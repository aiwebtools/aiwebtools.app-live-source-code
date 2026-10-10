import { useState } from "react";
import { Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { saveCustomBot, type CustomBot } from "@/utils/customBots";
import type { GptVoiceProfile } from "@/utils/gptVoiceProfiles";

const VOICES: Array<[GptVoiceProfile["voice"], string]> = [
  ["alloy", "Alloy · balanced guide"], ["ash", "Ash · confident analyst"], ["ballad", "Ballad · mystic narrator"],
  ["coral", "Coral · bright storyteller"], ["echo", "Echo · thoughtful scientist"], ["fable", "Fable · wise elder"],
  ["nova", "Nova · friendly teacher"], ["onyx", "Onyx · deep commander"], ["sage", "Sage · calm healer"],
  ["shimmer", "Shimmer · warm feminine"], ["verse", "Verse · charismatic host"],
];

export default function BotBuilder({ open, onOpenChange, onSaved }: { open: boolean; onOpenChange: (v: boolean) => void; onSaved: (bot: CustomBot) => void }) {
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [instructions, setInstructions] = useState("");
  const [voice, setVoice] = useState<GptVoiceProfile["voice"]>("alloy");
  const valid = name.trim().length > 1 && instructions.trim().length >= 10;
  const save = () => {
    if (!valid) return;
    const bot = saveCustomBot({ display_name: name.trim().slice(0, 80), tagline: tagline.trim().slice(0, 160), instructions: instructions.trim().slice(0, 20000), voice });
    setName(""); setTagline(""); setInstructions("");
    onSaved(bot);
  };
  const field = "w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary";
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-h-[92vh] overflow-y-auto border-primary/40 sm:max-w-xl">
      <DialogHeader>
        <DialogTitle className="gpt-room-accent tracking-wide">CREATE YOUR OWN CUSTOM MODEL</DialogTitle>
        <DialogDescription>Saved on this device. Web search, image creation, voice, long memory and every studio ability are switched on automatically.</DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
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
            <SelectContent>{VOICES.map(([id, label]) => <SelectItem key={id} value={id}>{label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <Button className="studio-new w-full gap-2" disabled={!valid} onClick={save}><Wand2 className="h-4 w-4" />Save & launch my bot</Button>
      </div>
    </DialogContent>
  </Dialog>;
}
