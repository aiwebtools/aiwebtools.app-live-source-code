import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', {headers:corsHeaders});
  const db=createClient(Deno.env.get('SUPABASE_URL') || '',Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '');
  const {data,error}=await db.from('chat_provider_state').select('provider,status,retry_at').in('provider',['lovable_chat','bionic']);
  if(error) return new Response(JSON.stringify({error:'Model availability could not be checked.'}),{status:503,headers:{...corsHeaders,'Content-Type':'application/json'}});
  const ready=(id:string)=> { const state=data?.find(s=>s.provider===id); return !state || state.status==='ready' || (state.status==='outage' && state.retry_at && Date.parse(state.retry_at)<=Date.now()); };
  return new Response(JSON.stringify({lovable:ready('lovable_chat'),bionic:ready('bionic')}),{headers:{...corsHeaders,'Content-Type':'application/json','Cache-Control':'no-store'}});
});