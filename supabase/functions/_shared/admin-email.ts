export const ADMIN_RECIPIENTS = ['kgmasterbic@gmail.com', 'awtkgb@gmail.com', 'contact@ai-webtools.com'];
export const escapeEmailHtml = (value: unknown): string => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c] || c));
const colors = { background:'#050a07', panel:'#0d1711', ink:'#ecfff2', muted:'#b1c9b8', accent:'#39ff88', line:'#254a33' };
export function brandedEmail(title: string, content: string): string {
 return `<!doctype html><html><body style="margin:0;background:${colors.background};color:${colors.ink};font-family:Arial,sans-serif"><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td style="padding:24px 12px"><div style="max-width:640px;margin:auto;border:1px solid ${colors.line};background:${colors.panel};border-radius:8px;overflow:hidden"><header style="padding:28px;border-bottom:1px solid ${colors.line}"><a href="https://aiwebtools.app" style="color:${colors.accent};text-decoration:none;font-size:24px;font-weight:bold">AIWEBTOOLS.APP</a><p style="color:${colors.muted};font-size:12px;margin-bottom:0">Create. Empower. Awaken.</p></header><main style="padding:28px;line-height:1.65;overflow-wrap:anywhere"><h1 style="font-size:22px;color:${colors.accent};margin-top:0">${escapeEmailHtml(title)}</h1>${content}</main><footer style="padding:20px 28px;border-top:1px solid ${colors.line};color:${colors.muted};font-size:12px">AI for human creativity, knowledge and self-empowerment.<br><a href="https://aiwebtools.app/services" style="color:${colors.accent}">Our Services</a> · <a href="https://aiwebtools.app" style="color:${colors.accent}">AIWebTools.app</a><br>Official AIWebTools notification.</footer></div></td></tr></table></body></html>`;
}
const base64 = (value:string) => { let binary=''; for(const byte of new TextEncoder().encode(value)) binary+=String.fromCharCode(byte); return btoa(binary); };
export function rawBrandedEmail(to: string[], subject: string, html: string, replyTo?:string): string {
 const encodedSubject = `=?UTF-8?B?${base64(subject.replace(/[\r\n]/g,' '))}?=`;
 const email=['To: '+to.join(', '),'Subject: '+encodedSubject,...(replyTo?['Reply-To: '+replyTo.replace(/[\r\n]/g,'')]:[]),'MIME-Version: 1.0','Content-Type: text/html; charset=UTF-8','Content-Transfer-Encoding: base64','',base64(html)].join('\r\n');
 return base64(email).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
export async function sendBrandedEmail(to:string[], subject:string, html:string, replyTo?:string):Promise<{id:string}> {
 const auth=Deno.env.get('LOVABLE_API_KEY'); const key=Deno.env.get('GOOGLE_MAIL_API_KEY');
 if(!auth||!key) throw new Error('Administrator email delivery is not configured.');
 const response=await fetch('https://connector-gateway.lovable.dev/google_mail/gmail/v1/users/me/messages/send',{method:'POST',headers:{Authorization:`Bearer ${auth}`,'X-Connection-Api-Key':key,'Content-Type':'application/json'},body:JSON.stringify({raw:rawBrandedEmail(to,subject,html,replyTo)})});
 if(!response.ok){const details=await response.text();console.error('Administrator email failed',response.status,details);throw new Error(`Email delivery failed (${response.status}): ${details}`);}
 return await response.json();
}
export const sendAdminEmail = (subject:string, content:string, replyTo?:string) => sendBrandedEmail(ADMIN_RECIPIENTS,subject,brandedEmail(subject,content),replyTo);