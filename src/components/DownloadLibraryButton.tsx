import { Download, FolderArchive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { downloadAllOperationalInstructions } from "@/utils/downloads";

interface DownloadLibraryButtonProps {
  className?: string;
  compact?: boolean;
  label?: string;
  onBeforeOpen?: () => void;
}

const DownloadLibraryButton = ({
  className,
  compact = false,
  label = "Download 3,200+ Operational Instructions",
  onBeforeOpen,
}: DownloadLibraryButtonProps) => {
  const openLibrary = () => {
    onBeforeOpen?.();
    window.setTimeout(downloadAllOperationalInstructions, onBeforeOpen ? 120 : 0);
  };

  return (
    <Button
      type="button"
      variant="gold"
      size={compact ? "default" : "lg"}
      onClick={openLibrary}
      className={cn(
        "group border border-primary/60 font-bold shadow-lg",
        compact ? "w-full px-3 text-xs" : "w-full sm:w-auto px-5 sm:px-8",
        className,
      )}
      aria-label={`${label}. Opens the free download library.`}
      title="Open the free AIWebTools instruction and source-code download library"
    >
      <FolderArchive className="transition-transform group-hover:-translate-y-0.5" aria-hidden="true" />
      <span>{label}</span>
      <Download className="transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
    </Button>
  );
};

export default DownloadLibraryButton;