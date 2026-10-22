import { lazy, Suspense, useRef, useState } from "react";
import { ImagePlus, X, Wand2 } from "lucide-react";
import { prepareBotAvatar } from "@/utils/botAvatarUpload";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { saveCustomBot, type CustomBot } from "@/utils/customBots";
import { getGuestId } from "@/utils/guestId";
import { refreshStudioBots } from "./botCatalog";
import type { GptVoiceProfile } from "@/utils/gptVoiceProfiles";
import { loadSurvivalBuilderDraft } from "@/utils/survivalDrafts";
import { BOT_SUBJECTS, type BotSubject } from "./botSubjects";

// Heavy draft artwork loads only when the builder is actually opened.
const SurvivalDraftPicker = lazy(() => import("./SurvivalDraftPicker"));

const VOICES: Array<[GptVoiceProfile["voice"], string]> = [
  ["alloy", "Alloy · balanced guide"], ["ash", "Ash · confident analyst"], ["ballad", "Ballad · mystic narrator"],
  ["coral", "Coral · bright storyteller"], ["echo", "Echo · thoughtful scientist"], ["fable", "Fable · wise elder"],
  ["nova", "Nova · friendly teacher"], ["onyx", "Onyx · deep commander"], ["sage", "Sage · calm healer"],
  ["shimmer", "Shimmer · warm feminine"], ["verse", "Verse · charismatic host"],
];

export default function BotBuilder({ open, onOpenChange, onSaved }: { open: boolean; onOpenChange: (v: boolean) => void; onSaved: (bot: CustomBot, publishedSlug?: string) => void }) {
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [instructions, setInstructions] = useState("");
  const [voice, setVoice] = useState<GptVoiceProfile["voice"]>("alloy");
  const [subject, setSubject] = useState<BotSubject>("General & Productivity");
  const [avatar, setAvatar] = useState("");
  const [preparingAvatar, setPreparingAvatar] = useState(false);
  const avatarInput = useRef<HTMLInputElement | null>(null);
  const [share, setShare] = useState(true);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [savedBot, setSavedBot] = useState<CustomBot | null>(null);
  const save = async () => {
    if (busy || preparingAvatar) return;
    if (name.trim().length < 2) { setStatus("Add a title with at least 2 characters."); return; }
    if (instructions.trim().length < (share ? 30 : 10)) { setStatus(share ? "Add at least 30 characters of instructions for the ethics review." : "Add at least 10 characters of instructions."); return; }
    setBusy(true);
    let bot: CustomBot;
    try {
      bot = saveCustomBot({ ...(savedBot ? { slug: savedBot.slug } : {}), display_name: name.trim(), tagline: tagline.trim(), instructions: instructions.trim(), voice, image_url: avatar || undefined });
      setSavedBot(bot);
    } catch { setStatus("Your browser could not save this bot. Check available device storage and try again."); setBusy(false); return; }
    let publishedSlug: string | undefined;
    if (share) {
      setBusy(true); setStatus("AI ethics review in progress…");
      try {
        const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/publish-community-gpt`, { method: "POST", headers: { "Content-Type": "application/json", apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY }, body: JSON.stringify({ name: bot.display_name, tagline: bot.tagline, instructions: bot.instructions, voice: bot.voice, avatar: bot.image_url, subject, guestId: getGuestId() }) });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) { setStatus(`Saved on this device. Not published: ${data.error || "the review failed."}`); setBusy(false); return; }
        if (!data.approved) { setStatus(`Saved on this device. The ethics review did not approve publishing: ${data.reason}`); setBusy(false); return; }
        publishedSlug = data.slug; await refreshStudioBots().catch(() => undefined);
      } catch { setStatus("Saved on this device. Publishing failed — check your connection."); setBusy(false); return; }
      setBusy(false);
    }
    setBusy(false); setSavedBot(null); setName(""); setTagline(""); setInstructions(""); setAvatar(""); setStatus("");
    onSaved(bot, publishedSlug);
  };
  const field = "w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary";
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-h-[92vh] overflow-y-auto border-primary/40 sm:max-w-xl">
      <DialogHeader>
        <DialogTitle className="gpt-room-accent tracking-wide">CREATE YOUR OWN CUSTOM MODEL</DialogTitle>
        <DialogDescription>Saved on this device. Web search, image creation, voice, long memory and every studio ability are switched on automatically.</DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <Suspense fallback={null}><SurvivalDraftPicker onChoose={(slug) => { void loadSurvivalBuilderDraft(slug).then((draft) => {
          if (!draft) return;
          setSavedBot(null); setName(draft.display_name); setTagline(draft.tagline); setInstructions(draft.instructions); setVoice(draft.voice); setAvatar(draft.image_url || ""); setShare(true); setStatus("Draft loaded. Public publication requires ethics review and available daily allowance.");
        }).catch(() => setStatus("This draft could not load. Please try again.")); }} /></Suspense>
        <div className="flex items-center gap-3">
          {avatar && <img src={avatar} alt="Bot avatar preview" className="h-16 w-16 rounded-md object-cover" />}
          <input ref={avatarInput} type="file" accept="image/jpeg,image/png,image/webp" aria-label="Bot avatar picture" className="hidden" onChange={async (e) => {
            const file = e.target.files?.[0]; if (!file) return;
            setPreparingAvatar(true);
            try { setAvatar(await prepareBotAvatar(file)); setStatus(""); } catch (error) { setStatus(error instanceof Error ? error.message : "Could not read this picture."); }
            finally { setPreparingAvatar(false); e.target.value = ""; }
          }} />
          <Button type="button" variant="outline" disabled={busy || preparingAvatar} onClick={() => avatarInput.current?.click()} className="gap-2"><ImagePlus className="h-4 w-4" />{preparingAvatar ? "Preparing picture…" : avatar ? "Change avatar" : "Upload avatar"}</Button>
          {avatar && <Button type="button" variant="ghost" size="icon" aria-label="Remove avatar" disabled={busy} onClick={() => setAvatar("")}><X className="h-4 w-4" /></Button>}
        </div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-primary">Title for tool name
          <input className={`${field} mt-1`} maxLength={80} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Pirate Captain GPT" />
        </label>
        <label className="block text-xs font-semibold uppercase tracking-wider text-primary">Subheader for tool name
          <input className={`${field} mt-1`} maxLength={160} value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="e.g. Your swashbuckling guide to the seven seas" />
        </label>
        <label className="block text-xs font-semibold uppercase tracking-wider text-primary">Instructions
          <textarea className={`${field} mt-1 min-h-[180px] font-mono`} maxLength={20000} value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="Who is this bot? What is its opening question, step-by-step flow, tone and rules?" />
          <span className="mt-1 block text-right font-normal normal-case text-muted-foreground">{instructions.length.toLocaleString()} / 20,000</span>
        </label>
        <div className="text-xs font-semibold uppercase tracking-wider text-primary">Voice
          <Select value={voice} onValueChange={(v) => setVoice(v as GptVoiceProfile["voice"])}>
            <SelectTrigger className="mt-1" aria-label="Bot voice"><SelectValue /></SelectTrigger>
            <SelectContent className="z-[190]">{VOICES.map(([id, label]) => <SelectItem key={id} value={id}>{label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="flex items-start gap-2 text-sm text-foreground"><Checkbox id="builder-public-share" aria-label="Share in public Community GPT library" className="mt-1 shrink-0" checked={share} onCheckedChange={(checked) => setShare(checked === true)} /><label htmlFor="builder-public-share">Share it in the public Community GPT library. An AI ethics review checks it first, then it is published automatically for everyone.</label></div>
        {status && <p role="status" className="rounded-md border border-primary/40 p-3 text-xs text-foreground">{status}</p>}
        <Button type="button" className="studio-new w-full gap-2" disabled={busy || preparingAvatar} onClick={() => void save()}><Wand2 className="h-4 w-4" />{busy ? "Reviewing & publishing…" : share ? "Save, review & publish" : "Save & launch my bot"}</Button>
        {savedBot && !busy && status && <Button type="button" variant="outline" className="w-full" onClick={() => onSaved(savedBot)}>Open my saved bot</Button>}
      </div>
    </DialogContent>
  </Dialog>;
}
