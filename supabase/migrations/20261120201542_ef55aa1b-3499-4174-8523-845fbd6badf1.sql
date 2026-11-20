CREATE OR REPLACE FUNCTION public.reserve_gpt_free_run(p_user_id uuid, p_guest_key text, p_limit integer)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_count integer;
BEGIN
 IF p_limit <> 10 THEN RAISE EXCEPTION 'Invalid allowance'; END IF;
 IF p_user_id IS NOT NULL THEN
  INSERT INTO public.gpt_usage(user_id,usage_date,message_count,updated_at) VALUES(p_user_id,(now() AT TIME ZONE 'UTC')::date,1,now())
  ON CONFLICT(user_id,usage_date) DO UPDATE SET message_count=gpt_usage.message_count+1,updated_at=now() WHERE gpt_usage.message_count < p_limit
  RETURNING message_count INTO v_count;
 ELSE
  IF p_guest_key IS NULL OR length(p_guest_key) <> 64 THEN RAISE EXCEPTION 'Invalid visitor'; END IF;
  INSERT INTO public.gpt_guest_usage(guest_key,usage_date,message_count,updated_at) VALUES(p_guest_key,(now() AT TIME ZONE 'UTC')::date,1,now())
  ON CONFLICT(guest_key,usage_date) DO UPDATE SET message_count=gpt_guest_usage.message_count+1,updated_at=now() WHERE gpt_guest_usage.message_count < p_limit
  RETURNING message_count INTO v_count;
 END IF;
 RETURN coalesce(v_count,0);
END;
$$;
REVOKE ALL ON FUNCTION public.reserve_gpt_free_run(uuid,text,integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reserve_gpt_free_run(uuid,text,integer) TO service_role;