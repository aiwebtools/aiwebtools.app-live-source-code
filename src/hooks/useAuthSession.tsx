import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { clearOtherPersonalAi } from "@/utils/personalAiSession";

/**
 * Minimal auth session hook. Subscribes first, then reads the existing
 * session, so a restored session is never missed on first paint.
 */
export const useAuthSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      clearOtherPersonalAi(next?.user.id);
      setSession(next);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data }) => {
      clearOtherPersonalAi(data.session?.user.id);
      setSession(data.session ?? null);
      setLoading(false);
    }).catch(() => {
      clearOtherPersonalAi();
      setSession(null);
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const user: User | null = session?.user ?? null;
  return { session, user, loading, signOut: () => supabase.auth.signOut() };
};

export default useAuthSession;
