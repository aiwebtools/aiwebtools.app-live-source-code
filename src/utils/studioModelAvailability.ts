export function modelIsAvailable(id:string, availability:{lovable:boolean;bionic:boolean}|null) {
  if (!availability) return false;
  if(id==='default') return availability.lovable || availability.bionic;
  return id.startsWith('bionic/') ? availability.bionic : availability.lovable;
}