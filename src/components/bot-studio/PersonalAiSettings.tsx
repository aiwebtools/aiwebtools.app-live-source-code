import { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { KeyRound, ExternalLink, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PERSONAL_PROVIDERS, type PersonalProvider } from "../../../supabase/functions/_shared/personal-provider-policy";
import { clearPersonalAi, setPersonalAi, usePersonalAi } from "@/utils/personalAiSession";

function ProviderKey({ provider, session, busy }: { provider: PersonalProvider; session: Session | null; busy: boolean }) {
  const config = PERSONAL_PROVIDERS[provider];
  const keyId = useId();
  const [key, setKey] = useState("");
  const [models, setModels] = useState<string[]>([]);
  const [model, setModel] = useState("");
  const [checking, setChecking] = useState(false);
  const [notice, setNotice] = useState("");
  const request = useRef<AbortController | null>(null);
  const revision = useRef(0);
  useEffect(() => () => { request.current?.abort(); }, []);
  useEffect(() => { setKey(""); setModels([]); setModel(""); setNotice(""); revision.current++; request.current?.abort(); }, [session?.user.id]);
  const check = async () => {
    if (!session || !key.trim() || checking || busy) return;
    const current = revision.current;
    const controller = new AbortController(); request.current = controller;
    setChecking(true); setNotice("");
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/run-gpt-app`, {
        method: "POST", signal: controller.signal,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ personalAi: { provider, apiKey: key.trim() }, checkPersonalAi: true }),
      });
      const data = await response.json();
      if (revision.current !== current) return;
      if (!response.ok) throw new Error(data.error || "Your provider could not verify the key.");
      const offered = Array.isArray(data.models) ? data.models.filter((id: string) => (config.models as readonly string[]).includes(id)) : [];
      if (!offered.length) throw new Error("No supported model was returned by your provider.");
      setModels(offered); setModel(offered[0]); setNotice(data.message);
    } catch (error) {
      if (!controller.signal.aborted) setNotice(error instanceof Error ? error.message : "Key check failed. No key was activated.");
    } finally { setChecking(false); }
  };
  return <details className="mt-3 border-b border-border pb-3">
    <summary className="cursor-pointer py-2 text-sm font-semibold text-foreground">{config.name}</summary>
    <div className="space-y-2 pt-2" data-private-ai-key>
      <Label htmlFor={keyId}>{config.name} API key</Label>
      <Input id={keyId} type="password" autoComplete="off" spellCheck={false} value={key} disabled={!session || busy} placeholder="Paste your API key" onChange={(event) => { revision.current++; request.current?.abort(); setKey(event.target.value); setModels([]); setModel(""); setNotice(""); }} />
      <a href={config.keyUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-primary underline underline-offset-4">Get a {config.name} API key<ExternalLink className="h-3 w-3" /></a>
      <Button variant="outline" className="w-full gap-2" disabled={!session || !key.trim() || checking || busy} onClick={() => void check()}>{checking ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <KeyRound className="h-3.5 w-3.5" />}Check key</Button>
      {models.length > 0 && <><Select value={model} disabled={busy} onValueChange={setModel}><SelectTrigger aria-label={`${config.name} personal model`}><SelectValue /></SelectTrigger><SelectContent className="z-[190]">{models.map((id) => <SelectItem key={id} value={id}>{id}</SelectItem>)}</SelectContent></Select>
        <Button className="h-auto min-h-10 w-full gap-2 whitespace-normal py-2 text-xs" disabled={busy || !session || !model} onClick={() => { if (session) { setPersonalAi(session.user.id, { provider, apiKey: key.trim(), model }); setKey(""); setModels([]); setNotice(`${config.name} activated for bot text replies.`); } }}><Check className="h-3.5 w-3.5 shrink-0" />USE THIS API KEY FOR BOTS</Button></>}
      {notice && <p role="status" className="break-words text-xs text-muted-foreground">{notice}</p>}
    </div>
  </details>;
}

export default function PersonalAiSettings({ session, busy }: { session: Session | null; busy: boolean }) {
  const active = usePersonalAi(session?.user.id);
  return <div className="studio-setting-section">
    <h2 className="studio-label"><KeyRound className="h-4 w-4" />Use your own AI key</h2>
    <p className="mt-3 break-words text-xs text-muted-foreground">{active ? `${PERSONAL_PROVIDERS[active.provider].name} · ${active.model}` : "Default Lovable AI active"}</p>
    <p className="mt-2 text-xs text-muted-foreground">Personal keys cover text replies only. Provider fees may apply. Voice, images, web search and hosting stay separate. Keys clear on reload.</p>
    {!session && <Button asChild variant="outline" className="mt-3 w-full"><Link to={`/join?mode=signin&next=${encodeURIComponent(window.location.pathname)}`}>Sign in to use your key</Link></Button>}
    {(Object.keys(PERSONAL_PROVIDERS) as PersonalProvider[]).map((provider) => <ProviderKey key={provider} provider={provider} session={session} busy={busy} />)}
    {active && <Button variant="outline" disabled={busy} className="mt-3 w-full" onClick={clearPersonalAi}>Use default AI · clear key</Button>}
  </div>;
}