
import { Button } from "@/components/ui/button";

interface ShowMoreFeaturedButtonProps {
  onClick: () => void;
  toolsCount: number;
  initialDisplayCount: number;
  className?: string;
}

const ShowMoreFeaturedButton = ({ 
  onClick, 
  toolsCount, 
  initialDisplayCount, 
  className = "" 
}: ShowMoreFeaturedButtonProps) => {
  return (
    <div className={`text-center mb-8 px-4 ${className}`}>
      <Button
        onClick={onClick}
        size="lg"
        className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold px-8 py-4 rounded-xl text-lg shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
      >
        ✨ Show More Featured AI Web Tools GPTs
      </Button>
      <div className="mt-4 text-purple-300 text-sm">
        Browse all {toolsCount.toLocaleString()} AI tools · {Math.min(initialDisplayCount, toolsCount)} shown · {Math.max(0, toolsCount - initialDisplayCount).toLocaleString()} remaining
      </div>
    </div>
  );
};

export default ShowMoreFeaturedButton;
