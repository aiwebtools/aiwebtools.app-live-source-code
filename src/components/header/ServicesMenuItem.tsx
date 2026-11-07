import { BriefcaseBusiness } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
export default function ServicesMenuItem({onNavigate}:{onNavigate:()=>void}) {
 const navigate=useNavigate();
 return <DropdownMenuItem className="mb-3 min-h-11 gap-2 text-primary" onSelect={()=>{onNavigate();navigate('/services');}}><BriefcaseBusiness className="h-4 w-4"/>Our Services</DropdownMenuItem>;
}