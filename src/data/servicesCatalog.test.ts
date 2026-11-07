// @ts-ignore Bun regression runner
import {expect,test} from 'bun:test';
import {SERVICE_PACKAGES} from '../../supabase/functions/_shared/servicesCatalog';
test('published service prices retain both distinct branch offers',()=>{
 const price=(id:string)=>SERVICE_PACKAGES.find(p=>p.id===id)?.price;
 expect(price('website')).toBe('$1,497');expect(price('app')).toBe('From $7,500');
 expect(price('social-starter')).toBe('$149 / month');expect(price('social-growth')).toBe('$299 / month');expect(price('social-full')).toBe('$549 / month');expect(price('managed-social')).toBe('$997 / month');
});