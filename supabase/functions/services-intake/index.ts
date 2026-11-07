import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { IntakeSchema,validAppointment } from './validation.ts';
import { SERVICE_PACKAGES } from '../_shared/servicesCatalog.ts';
import { ADMIN_RECIPIENTS, brandedEmail, escapeEmailHtml, sendBrandedEmail, sendAdminEmail } from '../_shared/admin-email.ts';
const owners=ADMIN_RECIPIENTS;
const headers={...corsHeaders,'Content-Type':'application/json'};
const reply=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers});
async function google(service:'google_mail'|'google_calendar',path:string,body?:unknown) {
 const key=Deno.env.get(service==='google_mail'?'GOOGLE_MAIL_API_KEY':'GOOGLE_CALENDAR_API_KEY');
 const auth=Deno.env.get('LOVABLE_API_KEY');
 if(!key||!auth)throw new Error('Booking notifications are temporarily unavailable. Please contact our team.');
 const response=await fetch(`https://connector-gateway.lovable.dev/${service}/${path}`,{method:body?'POST':'GET',headers:{Authorization:`Bearer ${auth}`,'X-Connection-Api-Key':key,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});
 if(!response.ok){const text=await response.text();console.error('Service provider error',service,response.status,text.slice(0,600));throw new Error(`The ${service==='google_mail'?'email':'calendar'} service is unavailable (${response.status}). Your request is saved; contact our team for help.`);}
 return await response.json();
}
Deno.serve(async req=>{
 if(req.method==='OPTIONS')return new Response('ok',{headers:corsHeaders});
 if(req.method!=='POST')return reply({error:'Please submit the request form.'},405);
 if(Number(req.headers.get('content-length')||0)>16000)return reply({error:'Please shorten your project details.'},413);
 let input;try{input=IntakeSchema.safeParse(await req.json());}catch{return reply({error:'Please check your form details.'},400);}
 if(!input.success)return reply({error:'Please enter a valid name, email, service and project description.'},400);
 const x=input.data;
 if(x.appointmentStart&&!validAppointment(x.appointmentStart))return reply({error:'Choose a 15-minute appointment slot at least one hour ahead, within 90 days.'},400);
 const db=createClient(Deno.env.get('SUPABASE_URL')||'',Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')||'');
 try{
  const {data:previous}=await db.from('service_requests').select('*').eq('request_key',x.requestKey).maybeSingle();
  if(previous && (previous.email!==x.email || previous.details!==x.details))return reply({error:'Please start a new request.'},409);
  let row=previous;
  if(!row){
   const {data,error}=await db.from('service_requests').insert({request_key:x.requestKey,name:x.name,email:x.email,phone:x.phone||null,service_id:x.serviceId,details:x.details,appointment_start:x.appointmentStart||null}).select().single();
   if(error)throw new Error('Your request could not be saved. Please try again.');row=data;
  }
  if(row.notification_status==='sent')return reply({id:row.id,meetUrl:row.meet_url,booked:Boolean(row.calendar_event_id),notified:true});
  const pack=SERVICE_PACKAGES.find(p=>p.id===x.serviceId);
  if(x.appointmentStart&&!row.calendar_event_id){
   const end=new Date(Date.parse(x.appointmentStart)+15*60000).toISOString();
   const free=await google('google_calendar','calendar/v3/freeBusy',{timeMin:x.appointmentStart,timeMax:end,items:[{id:'primary'}]});
   if(free.calendars?.primary?.errors?.length)throw new Error('Calendar availability could not be checked. Your project request is saved.');
   if(free.calendars?.primary?.busy?.length){await db.from('service_requests').update({appointment_start:null}).eq('id',row.id);return reply({error:'That appointment time is already booked. Your project details are saved; choose another time.'},409);}
   const event=await google('google_calendar','calendar/v3/calendars/primary/events?conferenceDataVersion=1&sendUpdates=all',{
    id:x.requestKey.replace(/-/g,''),summary:`AIWebTools free consultation - ${pack?.name}`,
    description:`Project request ${row.id}\n${x.name}\n${x.details}`,
    start:{dateTime:x.appointmentStart},end:{dateTime:end},attendees:[{email:x.email},...owners.map(email=>({email}))],
    conferenceData:{createRequest:{requestId:x.requestKey,conferenceSolutionKey:{type:'hangoutsMeet'}}},
    reminders:{useDefault:false,overrides:[{method:'email',minutes:1440},{method:'popup',minutes:30}]},
   });
   row.calendar_event_id=event.id;row.meet_url=event.hangoutLink||event.conferenceData?.entryPoints?.find((p:{entryPointType:string})=>p.entryPointType==='video')?.uri||null;
   await db.from('service_requests').update({calendar_event_id:row.calendar_event_id,meet_url:row.meet_url}).eq('id',row.id);
  }
  const summary=`Request: ${row.id}\nName: ${x.name}\nEmail: ${x.email}\nPhone: ${x.phone||'Not supplied'}\nService: ${pack?.branch} - ${pack?.name}\n${pack?.price}\n\n${x.details}\n\n${x.appointmentStart?`Google Meet consultation: ${x.appointmentStart}\n${row.meet_url||'Meet link is being prepared.'}`:'No appointment requested.'}\nPayment: not collected; project agreement and payment link required.`;
  await sendAdminEmail(x.appointmentStart?'New Google Meet booking & project request':'New project request',`<p>A visitor has reached out to the AIWebTools team.</p><div style="white-space:pre-wrap">${escapeEmailHtml(summary)}</div><p><a href="mailto:${escapeEmailHtml(x.email)}">Reply to ${escapeEmailHtml(x.name)}</a></p>`,x.email);
  await db.from('service_requests').update({notification_status:'sent'}).eq('id',row.id);
  try{await sendBrandedEmail([x.email],'Your AIWebTools project request',brandedEmail('Your vision starts here',`<p>Thank you, ${escapeEmailHtml(x.name)}. Your ${escapeEmailHtml(pack?.name)} request has reached our team.</p><p>Reference: ${escapeEmailHtml(row.id)}</p>${x.appointmentStart?`<p>Appointment: ${escapeEmailHtml(x.appointmentStart)}<br>Google Meet: ${escapeEmailHtml(row.meet_url||'See your calendar invitation.')}</p>`:'<p>Our team will contact you about your project.</p>'}<p>No payment has been taken. Deposits are arranged with your project agreement.</p>`));}catch(e){console.error('Visitor confirmation unavailable',String(e));}
  return reply({id:row.id,meetUrl:row.meet_url,booked:Boolean(row.calendar_event_id),notified:true});
 }catch(error){return reply({error:error instanceof Error?error.message:'The service is temporarily unavailable.'},503);}
});