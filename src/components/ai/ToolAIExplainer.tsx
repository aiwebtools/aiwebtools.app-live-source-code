import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tool } from "@/types/tools";

/** Credit-independent listing explanation, not an invented AI answer. */
export default function ToolAIExplainer({ tool }: { tool: Tool }) {
  const [opened, setOpened] = useState(false);
  if (!tool.description?.trim()) return null;
  return <div className="mt-6">
    <Button variant="outline" onClick={() => setOpened(value => !value)} aria-expanded={opened}>
      <Sparkles className="mr-2 h-4 w-4" />What does this tool do?
    </Button>
    {opened && <div className="mt-4 border border-border bg-card p-4 rounded-lg">
      <p className="text-foreground text-sm leading-relaxed whitespace-pre-line">{tool.description.replace(/<[^>]+>/g, "").trim()}</p>
      <p className="mt-3 text-xs text-muted-foreground">From this tool’s directory listing. Check the provider for current features and pricing.</p>
    </div>}
  </div>;
}