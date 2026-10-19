CREATE TABLE public.community_apps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  title text NOT NULL,
  url text NOT NULL,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  ai_reason text,
  ai_score integer,
  submitter_hash text,
  CONSTRAINT community_apps_status_chk CHECK (status IN ('pending','approved','rejected')),
  CONSTRAINT community_apps_len_chk CHECK (char_length(title) BETWEEN 2 AND 80 AND char_length(url) <= 500 AND char_length(description) BETWEEN 10 AND 500)
);
CREATE UNIQUE INDEX community_apps_url_approved_idx ON public.community_apps (lower(url)) WHERE status = 'approved';
GRANT SELECT ON public.community_apps TO anon, authenticated;
GRANT ALL ON public.community_apps TO service_role;
ALTER TABLE public.community_apps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can see approved community apps" ON public.community_apps FOR SELECT TO anon, authenticated USING (status = 'approved');
CREATE POLICY "Admins see all community apps" ON public.community_apps FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage community apps" ON public.community_apps FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));