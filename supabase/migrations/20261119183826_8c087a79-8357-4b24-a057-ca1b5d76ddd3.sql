DROP POLICY IF EXISTS "Public can upload user submitted tool images" ON storage.objects;

DROP POLICY IF EXISTS "Anyone can read tool reviews" ON public.tool_reviews;
CREATE POLICY "Anyone can read valid tool reviews" ON public.tool_reviews FOR SELECT TO anon, authenticated
USING (rating BETWEEN 1 AND 5 AND tool_slug IS NOT NULL);

DROP POLICY IF EXISTS "Anyone can insert error logs" ON public.error_logs;
CREATE POLICY "Anyone can insert bounded error logs" ON public.error_logs FOR INSERT TO anon, authenticated
WITH CHECK (char_length(message) BETWEEN 1 AND 5000 AND char_length(error_type) <= 100
  AND (stack IS NULL OR char_length(stack) <= 20000) AND (url IS NULL OR char_length(url) <= 2048));

DROP POLICY IF EXISTS "Anyone can record site events" ON public.site_events;
CREATE POLICY "Anyone can record bounded site events" ON public.site_events FOR INSERT TO anon, authenticated
WITH CHECK (char_length(session_id) BETWEEN 1 AND 200 AND char_length(path) BETWEEN 1 AND 2048
  AND (label IS NULL OR char_length(label) <= 500) AND (target IS NULL OR char_length(target) <= 2048));

DROP POLICY IF EXISTS "Anyone can insert analytics" ON public.tool_analytics;
CREATE POLICY "Anyone can insert bounded analytics" ON public.tool_analytics FOR INSERT TO anon, authenticated
WITH CHECK (char_length(tool_title) BETWEEN 1 AND 300 AND event_type IN ('view','click','search','filter'));

DROP POLICY IF EXISTS "Anyone can subscribe" ON public.email_subscribers;
CREATE POLICY "Anyone can subscribe with valid email" ON public.email_subscribers FOR INSERT TO anon, authenticated
WITH CHECK (char_length(email) <= 320 AND email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$' AND confirmed = false);