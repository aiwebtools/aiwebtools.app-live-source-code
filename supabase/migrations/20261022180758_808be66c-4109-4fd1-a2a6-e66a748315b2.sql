CREATE TABLE public.chat_provider_state (
 provider text PRIMARY KEY CHECK (provider IN ('bionic','lovable_chat')),
 status text NOT NULL DEFAULT 'ready' CHECK (status IN ('ready','outage','credits','denied','unavailable','configuration')),
 http_status integer,
 retry_at timestamptz,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.chat_provider_state TO service_role;
ALTER TABLE public.chat_provider_state ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_chat_provider_state_updated_at BEFORE UPDATE ON public.chat_provider_state FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
INSERT INTO public.chat_provider_state(provider) VALUES ('bionic'),('lovable_chat');