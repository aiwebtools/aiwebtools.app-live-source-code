import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import { IntakeSchema,validAppointment } from './validation.ts';
Deno.test('intake validates real service IDs, consent, email and minimum details',()=>{
 const base={requestKey:'123e4567-e89b-12d3-a456-426614174000',name:'Test Owner',email:'owner@example.com',details:'A real business project',consent:true,serviceId:'website'};
 assertEquals(IntakeSchema.safeParse(base).success,true);
 for(const change of [{serviceId:'invented'},{consent:false},{email:'bad'},{details:'short'}]) assertEquals(IntakeSchema.safeParse({...base,...change}).success,false);
});
Deno.test('free consultations use 15-minute aligned slots one hour ahead within 90 days',()=>{
 const now=Date.parse('2026-11-07T20:00:00Z');
 assertEquals(validAppointment('2026-11-08T20:15:00Z',now),true);
 assertEquals(validAppointment('2026-11-07T20:15:00Z',now),false);
 assertEquals(validAppointment('2026-11-08T20:16:00Z',now),false);
 assertEquals(validAppointment('2027-03-08T20:15:00Z',now),false);
});