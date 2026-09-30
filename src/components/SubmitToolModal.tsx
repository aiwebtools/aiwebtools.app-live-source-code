import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Send, Loader2, CheckCircle2, ShieldAlert, ShieldCheck, Clock3, Upload, X } from "lucide-react";

const categories = [
  "Education",
  "Productivity",
  "Creative",
  "Business",
  "Developer",
  "Research",
  "Healthcare",
  "Entertainment",
  "Communication",
  "User Submitted Tools",
  "Other",
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const empty = {
  name: "",
  description: "",
  url: "",
  category: "",
  videoUrl: "",
  imageUrl: "",
  submitterName: "",
  submitterEmail: "",
};

type SubmitResult = {
  status: "approved" | "pending" | "rejected";
  verdict: string;
  score: number;
  reason: string;
  slug?: string | null;
  message: string;
};

const SubmitToolModal = ({ open, onOpenChange }: Props) => {
  const [formData, setFormData] = useState(empty);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fileToBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!["image/png", "image/jpeg", "image/webp", "image/gif"].includes(f.type)) {
      toast.error("Unsupported image", { description: "Use PNG, JPG, WEBP, or GIF." });
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      toast.error("Image too large", { description: "Max 5 MB." });
      return;
    }
    setImageFile(f);
    setImagePreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !formData.url || !formData.category || !formData.submitterEmail) {
      toast.error("Missing information", { description: "Please fill in all required fields." });
      return;
    }
    setSubmitting(true);
    try {
      const payload: any = { ...formData };
      if (imageFile) {
        payload.imageBase64 = await fileToBase64(imageFile);
        payload.imageMime = imageFile.type;
      }
      const { data, error } = await supabase.functions.invoke("submit-tool", { body: payload });
      if (error) throw error;
      const res = data as SubmitResult;
      setResult(res);
      if (res.status === "approved") toast.success("Live on AIWebTools!", { description: res.message });
      else if (res.status === "rejected") toast.error("Blocked by AI screener", { description: res.reason });
      else toast("Queued for review", { description: res.message });
    } catch (err: any) {
      console.error("Submit tool error:", err);
      toast.error("Submission failed", { description: err?.message || "Please try again in a moment." });
    } finally {
      setSubmitting(false);
    }
  };

  const closeAndReset = () => {
    onOpenChange(false);
    setTimeout(() => {
      setResult(null);
      setFormData(empty);
      setImageFile(null);
      setImagePreview(null);
    }, 250);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) closeAndReset(); else onOpenChange(o); }}>
      <DialogContent className="bg-black border-2 border-green-500/50 text-green-100 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle
            className="text-green-400 font-mono text-xl flex items-center gap-2"
            style={{ textShadow: "0 0 8px rgba(0,255,65,0.6)" }}
          >
            <Send className="w-5 h-5" /> Submit Your AI Tool
          </DialogTitle>
          <DialogDescription className="text-green-200/80 font-mono text-sm">
            Your submission is auto-screened by our AI safety model. Safe tools go live instantly with a full tool page.
          </DialogDescription>
        </DialogHeader>

        {result ? (
          <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
            {result.status === "approved" && (
              <>
                <ShieldCheck className="w-16 h-16 text-green-400" style={{ filter: "drop-shadow(0 0 12px rgba(0,255,65,0.8))" }} />
                <p className="text-green-300 font-mono text-lg">Live now — safety score {result.score}/100</p>
                <p className="text-green-200/80 font-mono text-sm max-w-md">{result.reason}</p>
                {result.slug && (
                  <a href={`/user-submitted/${result.slug}`} className="text-cyan-300 underline font-mono text-sm">View your tool page →</a>
                )}
              </>
            )}
            {result.status === "pending" && (
              <>
                <Clock3 className="w-16 h-16 text-yellow-400" />
                <p className="text-yellow-300 font-mono text-lg">Queued for human review</p>
                <p className="text-yellow-200/80 font-mono text-sm max-w-md">{result.reason}</p>
              </>
            )}
            {result.status === "rejected" && (
              <>
                <ShieldAlert className="w-16 h-16 text-red-400" />
                <p className="text-red-300 font-mono text-lg">Blocked by AI safety screener</p>
                <p className="text-red-200/80 font-mono text-sm max-w-md">{result.reason}</p>
              </>
            )}
            <Button onClick={closeAndReset} className="mt-2 bg-green-500 hover:bg-green-400 text-black font-mono">Close</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 mt-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="stm-name" className="text-green-300 font-mono">Your Name</Label>
                <Input
                  id="stm-name"
                  value={formData.submitterName}
                  onChange={(e) => setFormData({ ...formData, submitterName: e.target.value })}
                  placeholder="Optional"
                  className="bg-black/60 border-green-500/40 text-green-100 placeholder:text-green-500/40 font-mono"
                  maxLength={200}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stm-email" className="text-green-300 font-mono">Your Email *</Label>
                <Input
                  id="stm-email"
                  type="email"
                  required
                  value={formData.submitterEmail}
                  onChange={(e) => setFormData({ ...formData, submitterEmail: e.target.value })}
                  placeholder="you@example.com"
                  className="bg-black/60 border-green-500/40 text-green-100 placeholder:text-green-500/40 font-mono"
                  maxLength={320}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stm-tool-name" className="text-green-300 font-mono">Tool Name *</Label>
              <Input
                id="stm-tool-name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="My Awesome AI Tool"
                className="bg-black/60 border-green-500/40 text-green-100 placeholder:text-green-500/40 font-mono"
                maxLength={200}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stm-desc" className="text-green-300 font-mono">Description *</Label>
              <Textarea
                id="stm-desc"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What does your tool do, who is it for, what problem does it solve?"
                rows={4}
                className="bg-black/60 border-green-500/40 text-green-100 placeholder:text-green-500/40 font-mono"
                maxLength={2000}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="stm-url" className="text-green-300 font-mono">Tool URL *</Label>
                <Input
                  id="stm-url"
                  type="url"
                  required
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://yourtool.com"
                  className="bg-black/60 border-green-500/40 text-green-100 placeholder:text-green-500/40 font-mono"
                  maxLength={2048}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stm-cat" className="text-green-300 font-mono">Category *</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                  <SelectTrigger id="stm-cat" className="bg-black/60 border-green-500/40 text-green-100 font-mono">
                    <SelectValue placeholder="Choose one" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-green-500/40 text-green-100">
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="stm-video" className="text-green-300 font-mono">YouTube Demo (optional)</Label>
                <Input
                  id="stm-video"
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                  className="bg-black/60 border-green-500/40 text-green-100 placeholder:text-green-500/40 font-mono"
                  maxLength={2048}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stm-img" className="text-green-300 font-mono">Image URL (optional)</Label>
                <Input
                  id="stm-img"
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.png"
                  className="bg-black/60 border-green-500/40 text-green-100 placeholder:text-green-500/40 font-mono"
                  maxLength={2048}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-green-300 font-mono">Or upload a hero image (PNG/JPG/WEBP · max 5 MB)</Label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 border border-green-500/40 rounded bg-black/60 hover:bg-green-500/10 font-mono text-green-300 text-sm">
                  <Upload className="w-4 h-4" /> Choose file
                  <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="hidden" onChange={handleFileChange} />
                </label>
                {imagePreview && (
                  <div className="relative">
                    <img src={imagePreview} alt="preview" className="h-12 w-20 object-cover rounded border border-green-500/40" />
                    <button
                      type="button"
                      onClick={() => { setImageFile(null); setImagePreview(null); }}
                      className="absolute -right-4 -top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-red-400/60 bg-black text-red-300"
                      aria-label="Remove image"
                    ><X className="h-4 w-4" /></button>
                  </div>
                )}
              </div>
            </div>

            <div className="text-[11px] text-green-500/70 font-mono border border-green-500/20 rounded p-2 bg-green-500/5 flex gap-2">
              <ShieldCheck className="w-4 h-4 flex-none text-green-400 mt-0.5" />
              <span>Every URL is auto-scanned by our AI safety model for malware, phishing, scams, and NSFW content. Safe tools publish instantly. Suspicious ones are held for human review.</span>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-green-500 hover:bg-green-400 text-black font-bold font-mono"
              style={{ boxShadow: "0 0 20px rgba(0,255,65,0.5)" }}
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> AI safety scan in progress…</>
              ) : (
                <><Send className="w-4 h-4 mr-2" /> Submit Tool for Review</>
              )}
            </Button>
            <p className="text-[10px] text-green-500/60 text-center font-mono">
              Submissions are stored securely, screened by AI, then published or queued for human review.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SubmitToolModal;