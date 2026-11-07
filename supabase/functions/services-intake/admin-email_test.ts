import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import { ADMIN_RECIPIENTS } from '../_shared/admin-email.ts';
Deno.test('all administrator notifications include the three owner inboxes exactly once',()=>{
 assertEquals(ADMIN_RECIPIENTS,['kgmasterbic@gmail.com','awtkgb@gmail.com','contact@ai-webtools.com']);
 assertEquals(new Set(ADMIN_RECIPIENTS).size,3);
});