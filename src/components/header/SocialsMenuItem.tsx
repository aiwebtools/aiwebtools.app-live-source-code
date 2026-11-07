import { Radio } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export default function SocialsMenuItem({ onNavigate }: { onNavigate: () => void }) {
  const navigate = useNavigate();
  return (
    <DropdownMenuItem
      className="mb-3 min-h-11 gap-2 rounded-md text-primary focus:bg-accent focus:text-accent-foreground"
      onSelect={() => { onNavigate(); navigate("/socials"); }}
    >
      <Radio className="h-4 w-4" aria-hidden="true" /> Socials
    </DropdownMenuItem>
  );
}