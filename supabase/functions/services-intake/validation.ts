import { z } from 'npm:zod@3.23.8';
import { SERVICE_IDS } from '../_shared/servicesCatalog.ts';
export const IntakeSchema=z.object({
 requestKey:z.string().uuid(),name:z.string().trim().min(2).max(100),email:z.string().trim().email().max(254),
 phone:z.string().trim().max(40).optional(),serviceId:z.string().refine(id=>SERVICE_IDS.includes(id as typeof SERVICE_IDS[number])),
 details:z.string().trim().min(10).max(5000),consent:z.literal(true),
 appointmentStart:z.string().datetime().optional(),website:z.string().max(0).optional(),
}).strict();
export function validAppointment(start:string,now=Date.now()) { const t=Date.parse(start);return Number.isFinite(t) && t>now+60*60*1000 && t<now+90*86400000 && t%900000===0; }