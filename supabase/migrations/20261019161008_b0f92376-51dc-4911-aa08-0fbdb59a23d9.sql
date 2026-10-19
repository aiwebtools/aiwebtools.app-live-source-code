CREATE TABLE public.site_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  session_id text NOT NULL,
  event_type text NOT NULL,
  path text NOT NULL,
  label text,
  target text,
  bot_slug text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  referrer text,
  device text,
  CONSTRAINT site_events_type_chk CHECK (event_type IN ('page_view','click','bot_open','error')),
  CONSTRAINT site_events_len_chk CHECK (char_length(path) <= 500 AND coalesce(char_length(label),0) <= 200 AND coalesce(char_length(target),0) <= 500 AND char_length(session_id) <= 80)
);
GRANT INSERT ON public.site_events TO anon, authenticated;
GRANT SELECT ON public.site_events TO authenticated;
GRANT ALL ON public.site_events TO service_role;
ALTER TABLE public.site_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can record site events" ON public.site_events FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins read site events" ON public.site_events FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE INDEX site_events_created_idx ON public.site_events (created_at DESC);
CREATE INDEX site_events_bot_idx ON public.site_events (bot_slug) WHERE bot_slug IS NOT NULL;