
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Mail } from "lucide-react";
import { Tool } from "@/types/tools";
import { createTimePortalEffect } from "@/utils/timeEffects";
import { supabase } from "@/integrations/supabase/client";

interface ToolActionsProps {
  tool: Tool;
}

const ToolActions = ({ tool }: ToolActionsProps) => {
  const [hasHostedPreview, setHasHostedPreview] = useState(false);

  useEffect(() => {
    let alive = true;
    if (!tool.title) return;
    supabase
      .from("gpt_apps")
      .select("slug")
      .eq("tool_title", tool.title)
      .eq("is_active", true)
      .maybeSingle()
      .then(({ data }) => {
        if (alive) setHasHostedPreview(Boolean(data));
      });
    return () => {
      alive = false;
    };
  }, [tool.title]);
  const handleUseItNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!tool.directUrl) return;
    console.log('USE IT NOW button clicked for:', tool.title);
    console.log('Tool directUrl:', tool.directUrl);
    
    // Directly launch the tool with time portal effect
    createTimePortalEffect(tool.directUrl || '', tool.title);
  };

  const handleSendFeedback = () => {
    const subject = encodeURIComponent(`Feedback for ${tool.title}`);
    const body = encodeURIComponent(`Hi,

I would like to provide feedback about ${tool.title}:

[Please describe your concerns, bugs, or suggestions here]

Thank you!`);
    
    const mailtoUrl = `mailto:contact@ai-webtools.com?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;
  };

  // Check if this is an AI Web Tools original tool (has lovable.app in the URL)
  const isAIWebToolsOriginal = tool.directUrl?.includes('lovable.app') || false;
  const isCsvDownload = tool.directUrl?.startsWith('csv-download://') || false;

  return (
    <div className="tool-official-actions text-center pb-6 mb-6 border-b border-cyan-500/30">
      <div className="space-y-4 px-4">
        <Button 
          size="lg"
          onClick={handleUseItNow}
          disabled={!tool.directUrl}
          className={hasHostedPreview
            ? "official-gold-btn w-full sm:w-auto px-8 sm:px-12 py-4 text-base sm:text-lg rounded-xl"
            : "w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 sm:px-12 py-4 text-base sm:text-lg rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/30 interactive-button glow-effect"}
        >
          <ExternalLink className="w-5 h-5 mr-2" />
          {!tool.directUrl
            ? "COMING SOON"
            : isCsvDownload
              ? "DOWNLOAD CSV (FREE)"
              : hasHostedPreview
                ? "USE THE OFFICIAL VERSION — CLICK HERE"
                : "USE IT NOW"}
        </Button>
        
        {isAIWebToolsOriginal && (
          <Button 
            size="lg"
            onClick={handleSendFeedback}
            variant="outline"
            className="w-full sm:w-auto border-yellow-500/50 bg-yellow-500/10 text-yellow-300 hover:bg-yellow-500/20 hover:border-yellow-400 px-3 sm:px-6 py-4 text-xs sm:text-sm rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <Mail className="w-4 h-4 mr-1 sm:mr-2 flex-shrink-0" />
            <span className="text-center leading-tight">
              <span className="block sm:hidden">CREATOR</span>
              <span className="block sm:hidden">FEEDBACK</span>
              <span className="hidden sm:block">SEND CREATOR FEEDBACK</span>
            </span>
          </Button>
        )}
      </div>
      
      <p className="text-sm text-gray-400 mt-3 px-4">
        {isCsvDownload
            ? "Click to instantly download the complete AI Web Tools directory as a CSV file"
          : hasHostedPreview
            ? "The chat below is an AIWebTools preview. This button opens the official version in a new window."
          : tool.directUrl 
            ? "Click to access this AI tool and start using it immediately"
            : "Direct access coming soon - check back later"}
        {isAIWebToolsOriginal && (
          <>
            <br />
            <span className="text-yellow-400">Have feedback? Send concerns or bug reports directly to the creator!</span>
          </>
        )}
      </p>
    </div>
  );
};

export default ToolActions;
