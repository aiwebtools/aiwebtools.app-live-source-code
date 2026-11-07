import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { sendAdminEmail } from "../_shared/admin-email.ts";
import { createClient } from "npm:@supabase/supabase-js@2";



const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ToolSubmission {
  name: string;
  description: string;
  url: string;
  category: string;
  videoUrl?: string;
  imageUrl?: string;
  imageBase64?: string;
  imageMime?: string;
  submitterName?: string;
  submitterEmail: string;
}

const escapeHtml = (str: string): string =>
  String(str ?? "").replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string
  ));

const safeUrl = (url: string): string => {
  try {
    const u = new URL(url);
    if (u.protocol !== "http:" && u.protocol !== "https:") return "#";
    return escapeHtml(u.toString());
  } catch { return "#"; }
};

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const ipHits = new Map<string, number[]>();
const isRateLimited = (ip: string): boolean => {
  const now = Date.now();
  const hits = (ipHits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (hits.length >= RATE_LIMIT_MAX) { ipHits.set(ip, hits); return true; }
  hits.push(now); ipHits.set(ip, hits);
  return false;
};

const MAX_LEN = { name: 200, description: 2000, category: 100, submitterName: 200, submitterEmail: 320, url: 2048 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_IMAGE_MIME = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const slugify = (s: string): string =>
  s.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_-]+/g, "-").slice(0, 80) || "user-tool";

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  { auth: { persistSession: false } },
);

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const xff = req.headers.get("x-forwarded-for") ?? "";
    const xffParts = xff.split(",").map((s) => s.trim()).filter(Boolean);
    const ip = req.headers.get("x-real-ip") || (xffParts.length ? xffParts[xffParts.length - 1] : "") || "unknown";
    if (isRateLimited(ip)) {
      return new Response(JSON.stringify({ error: "Too many submissions. Please try again later." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const submission: ToolSubmission = await req.json();
    console.log("Received tool submission for:", submission?.name);

    if (!submission.name || !submission.description || !submission.url || !submission.category || !submission.submitterEmail) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (
      submission.name.length > MAX_LEN.name ||
      submission.description.length > MAX_LEN.description ||
      submission.category.length > MAX_LEN.category ||
      submission.url.length > MAX_LEN.url ||
      submission.submitterEmail.length > MAX_LEN.submitterEmail ||
      (submission.submitterName && submission.submitterName.length > MAX_LEN.submitterName)
    ) {
      return new Response(JSON.stringify({ error: "One or more fields exceed allowed length." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (!EMAIL_RE.test(submission.submitterEmail)) {
      return new Response(JSON.stringify({ error: "Invalid email address." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Image upload
    let uploadedImageUrl: string | null = null;
    let uploadedImagePath: string | null = null;
    if (submission.imageBase64) {
      try {
        const b64 = submission.imageBase64.replace(/^data:[^;]+;base64,/, "");
        const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
        if (bytes.byteLength > MAX_IMAGE_BYTES) {
          return new Response(JSON.stringify({ error: "Image too large (max 5 MB)." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
        const mime = (submission.imageMime || "image/png").toLowerCase();
        if (!ALLOWED_IMAGE_MIME.has(mime)) {
          return new Response(JSON.stringify({ error: "Unsupported image type." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
        const ext = mime.split("/")[1] === "jpeg" ? "jpg" : mime.split("/")[1];
        const path = `user-submitted/${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabaseAdmin.storage.from("tool-images").upload(path, bytes, { contentType: mime, upsert: false });
        if (upErr) console.error("image upload failed", upErr);
        else {
          uploadedImagePath = path;
          uploadedImageUrl = supabaseAdmin.storage.from("tool-images").getPublicUrl(path).data.publicUrl;
        }
      } catch (imgErr) { console.error("image decode/upload error", imgErr); }
    }

    // AI safety screening
    let verdict: "safe" | "suspicious" | "blocked" = "suspicious";
    let safetyScore = 50;
    let safetyReason = "Pending review";
    try {
      const screenerRes = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/screen-tool-url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
        },
        body: JSON.stringify({ url: submission.url, name: submission.name, description: submission.description }),
      });
      if (screenerRes.ok) {
        const s = await screenerRes.json();
        if (s?.verdict) verdict = s.verdict;
        if (typeof s?.score === "number") safetyScore = s.score;
        if (s?.reason) safetyReason = String(s.reason).slice(0, 500);
      } else {
        console.error("screener non-OK", screenerRes.status, await screenerRes.text());
      }
    } catch (screenErr) { console.error("screener call failed", screenErr); }

    // First-pass triage: flag likely duplicates of tools already submitted.
    // Report-only — never blocks or deletes anything.
    let duplicateNote = "";
    try {
      const normalized = submission.url
        .replace(/^https?:\/\//i, "")
        .replace(/^www\./i, "")
        .split(/[?#]/)[0]
        .replace(/\/+$/, "")
        .toLowerCase();
      const { data: dupes } = await supabaseAdmin
        .from("tool_submissions")
        .select("id, name, url, status")
        .ilike("url", `%${normalized}%`)
        .limit(3);
      if (dupes && dupes.length > 0) {
        duplicateNote = dupes.map((d) => `${d.name} (${d.status})`).join(", ");
      }
    } catch (dupErr) { console.error("duplicate check failed", dupErr); }

    let status: "approved" | "pending" | "rejected" = "pending";
    let publishedAt: string | null = null;
    if (verdict === "safe" && safetyScore >= 80 && !duplicateNote) { status = "approved"; publishedAt = new Date().toISOString(); }
    else if (verdict === "blocked") { status = "rejected"; }

    const baseSlug = slugify(submission.name);
    let slug = baseSlug;
    if (status === "approved") {
      for (let i = 0; i < 8; i++) {
        const suffix = i === 0 ? "" : `-${Math.random().toString(36).slice(2, 6)}`;
        const candidate = `${baseSlug}${suffix}`.slice(0, 80);
        const { data: existing } = await supabaseAdmin.from("tool_submissions").select("id").eq("slug", candidate).maybeSingle();
        if (!existing) { slug = candidate; break; }
      }
    }

    const finalImageUrl = uploadedImageUrl || submission.imageUrl || null;
    const { data: inserted, error: insertErr } = await supabaseAdmin
      .from("tool_submissions")
      .insert({
        name: submission.name,
        description: submission.description,
        url: submission.url,
        category: submission.category,
        video_url: submission.videoUrl || null,
        image_url: finalImageUrl,
        image_storage_path: uploadedImagePath,
        submitter_email: submission.submitterEmail,
        submitter_name: submission.submitterName || null,
        status,
        slug: status === "approved" ? slug : null,
        published_at: publishedAt,
        ai_safety_score: safetyScore,
        ai_safety_verdict: verdict,
        ai_safety_reason: safetyReason,
      })
      .select("id, slug, status")
      .single();

    if (insertErr) {
      console.error("insert failed", insertErr);
      return new Response(JSON.stringify({ error: "Could not save submission. Please try again." }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const safeName = escapeHtml(submission.name);
    const safeDescription = escapeHtml(submission.description);
    const safeCategory = escapeHtml(submission.category);
    const safeSubmitterName = escapeHtml(submission.submitterName || "Not provided");
    const safeSubmitterEmail = escapeHtml(submission.submitterEmail);
    const safeToolUrl = safeUrl(submission.url);
    const safeVideoUrl = submission.videoUrl ? safeUrl(submission.videoUrl) : "";
    const safeImageUrl = finalImageUrl ? safeUrl(finalImageUrl) : "";

    let notified = false;
    try {
      await sendAdminEmail(`[${status.toUpperCase()}] Tool Submission: ${submission.name.slice(0, 200)}`, `
          <h1>New Tool Submission</h1>
          <p><strong>Auto status:</strong> ${escapeHtml(status)} — verdict ${escapeHtml(verdict)} (score ${safetyScore})</p>
          <p><strong>AI reason:</strong> ${escapeHtml(safetyReason)}</p>
          ${duplicateNote ? `<p style="color:#b45309;"><strong>⚠ Possible duplicate of:</strong> ${escapeHtml(duplicateNote)} — held for manual review.</p>` : ""}
          <h2>Submitter</h2>
          <p><strong>Name:</strong> ${safeSubmitterName}</p>
          <p><strong>Email:</strong> ${safeSubmitterEmail}</p>
          <h2>Tool</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Category:</strong> ${safeCategory}</p>
          <p><strong>URL:</strong> <a href="${safeToolUrl}">${safeToolUrl}</a></p>
          <h3>Description</h3>
          <p>${safeDescription}</p>
          ${safeVideoUrl ? `<p><strong>Video:</strong> <a href="${safeVideoUrl}">${safeVideoUrl}</a></p>` : ""}
          ${safeImageUrl ? `<p><strong>Image:</strong> <a href="${safeImageUrl}">${safeImageUrl}</a></p>` : ""}
          <hr><p><em>Submission ID: ${escapeHtml(inserted.id)}</em></p>
        `, submission.submitterEmail);
      notified = true;
    } catch (mailErr) { console.error("admin mail failed", mailErr); }

    return new Response(JSON.stringify({
      success: true,
      notified,
      status,
      verdict,
      score: safetyScore,
      reason: safetyReason,
      slug: inserted.slug,
      message:
        status === "approved" ? "Your tool passed AI safety screening and is now live on the site!"
        : status === "rejected" ? "Your submission was blocked by our AI safety screener."
        : "Your submission is queued for manual review.",
    }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (error) {
    console.error("Error in submit-tool function:", error);
    return new Response(JSON.stringify({ error: "Submission failed. Please try again later." }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});