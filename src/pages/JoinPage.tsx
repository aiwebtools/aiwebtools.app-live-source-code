import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, Mail, KeyRound, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuthSession } from "@/hooks/useAuthSession";
import { buildCanonicalUrl } from "@/utils/seo";

const JoinPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session, loading: sessionLoading } = useAuthSession();

  const candidate = params.get("next") || "/account";
  const redirectTo = candidate.startsWith("/") && !candidate.startsWith("//") && !candidate.includes("\\") ? candidate : "/account";
  const [mode, setMode] = useState<"signup" | "signin">(params.get("mode") === "signin" ? "signin" : "signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [prefTools, setPrefTools] = useState(true);
  const [prefDigest, setPrefDigest] = useState(true);
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!sessionLoading && session) navigate(redirectTo, { replace: true });
  }, [session, sessionLoading, navigate, redirectTo]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setErrorMessage("");
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}${redirectTo}`,
            data: { display_name: displayName.trim().slice(0, 60) },
          },
        });
        if (error) throw error;

        if (prefTools || prefDigest) {
          await supabase.functions.invoke("subscribe-email", {
            body: {
              email: email.trim(),
              name: displayName.trim() || undefined,
              source: "member-signup",
              pref_new_tools: prefTools,
              pref_weekly_digest: prefDigest,
            },
          }).catch(() => undefined);
        }

        toast({
          title: "Welcome to the collective",
          description: "Check your email to confirm your account, then your in-site tools unlock.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        navigate(redirectTo, { replace: true });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setErrorMessage(message);
      toast({ title: "We could not do that", description: message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const googleSignIn = async () => {
    setBusy(true);
    setErrorMessage("");
    try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}${redirectTo}` },
    });
    if (error) {
      setErrorMessage(error.message);
      toast({ title: "Google sign-in unavailable", description: error.message, variant: "destructive" });
      setBusy(false);
    }
    } catch {
      setErrorMessage("Google sign-in could not connect. Please try email sign-in or try again.");
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-14">
      <Helmet>
        <title>Join AIWebTools — Free Access to In-Site AI Tools</title>
        <meta
          name="description"
          content="Create a free AIWebTools.ai account to run our hosted custom GPTs right on the site and get the weekly AI digest."
        />
        <link rel="canonical" href={buildCanonicalUrl("/join")} />
        <meta name="robots" content="noindex,follow" />
      </Helmet>

      <div className="mx-auto w-full max-w-md rounded-2xl border border-primary/30 bg-card/70 p-7 shadow-lg backdrop-blur">
        <div className="mb-6 text-center">
          <Sparkles className="mx-auto mb-2 h-7 w-7 text-primary" aria-hidden="true" />
          <h1 className="text-2xl font-bold text-primary">
            {mode === "signup" ? "Create your free account" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Unlock the in-site versions of our custom GPTs. Browsing stays free and open for everyone.
          </p>
        </div>

        <Button variant="outline" className="w-full" onClick={googleSignIn} disabled={busy}>
          Continue with Google
        </Button>

        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> or use email <span className="h-px flex-1 bg-border" />
        </div>

        {errorMessage && <p role="alert" className="mb-4 break-words text-sm text-destructive">{errorMessage}</p>}
        <form onSubmit={submit} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-1.5">
              <Label htmlFor="displayName">Your name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                maxLength={60}
                placeholder="Seeker"
                autoComplete="name"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
                autoComplete="email"
                maxLength={320}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
              />
            </div>
          </div>

          {mode === "signup" && (
            <div className="space-y-2 rounded-lg border border-border/60 p-3">
              <label className="flex items-start gap-2 text-sm">
                <Checkbox checked={prefTools} onCheckedChange={(v) => setPrefTools(v === true)} />
                <span>Email me when new AI tools land in the directory</span>
              </label>
              <label className="flex items-start gap-2 text-sm">
                <Checkbox checked={prefDigest} onCheckedChange={(v) => setPrefDigest(v === true)} />
                <span>Send me the weekly AI digest (news, trends, new tools)</span>
              </label>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={busy}>
            {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
            {mode === "signup" ? "Create free account" : "Sign in"}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          {mode === "signup" ? "Already have an account?" : "New here?"}{" "}
          <button
            type="button"
            className="font-semibold text-primary underline-offset-2 hover:underline"
            onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
          >
            {mode === "signup" ? "Sign in" : "Create one free"}
          </button>
        </p>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">← Back to the directory</Link>
        </p>
      </div>
    </div>
  );
};

export default JoinPage;
