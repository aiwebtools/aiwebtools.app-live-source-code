
import { useState, useEffect } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  totalVotes: number;
  onRate?: (rating: number) => void;
  showVoteCount?: boolean;
  toolId?: string; // Add toolId to track votes per tool
}

const StarRating = ({ rating, totalVotes, onRate, showVoteCount = true, toolId }: StarRatingProps) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  
  // Provide fallback values to prevent undefined errors
  const safeRating = rating || 4.1;
  const safeTotalVotes = totalVotes || 1000;
  
  const [currentRating, setCurrentRating] = useState(safeRating);
  const [currentVoteCount, setCurrentVoteCount] = useState(safeTotalVotes);

  // Check if user has already voted for this tool
  useEffect(() => {
    if (toolId) {
      const votedTools = JSON.parse(localStorage.getItem('votedTools') || '{}');
      const toolVoteData = votedTools[toolId];
      if (toolVoteData && typeof toolVoteData.currentRating === 'number' && typeof toolVoteData.voteCount === 'number') {
        setUserRating(toolVoteData.userRating || 0);
        setHasVoted(true);
        setCurrentRating(toolVoteData.currentRating);
        setCurrentVoteCount(toolVoteData.voteCount);
      }
    }
  }, [toolId]);

  const handleRate = (newRating: number) => {
    if (hasVoted || !toolId) return;

    setUserRating(newRating);
    setHasVoted(true);
    
    // Calculate new average: (current_rating * current_votes + new_rating) / (current_votes + 1)
    const totalRatingPoints = currentRating * currentVoteCount;
    const newTotalRatingPoints = totalRatingPoints + newRating;
    const newVoteCount = currentVoteCount + 1;
    const newAverageRating = newTotalRatingPoints / newVoteCount;
    
    setCurrentRating(newAverageRating);
    setCurrentVoteCount(newVoteCount);
    
    // Store vote in localStorage with enhanced data validation
    const votedTools = JSON.parse(localStorage.getItem('votedTools') || '{}');
    votedTools[toolId] = {
      userRating: newRating,
      currentRating: newAverageRating,
      voteCount: newVoteCount,
      timestamp: Date.now(),
      toolTitle: toolId // Add tool identification for debugging
    };
    localStorage.setItem('votedTools', JSON.stringify(votedTools));
    
    // Provide user feedback
    console.log(`⭐ User voted ${newRating} stars for tool ${toolId}`);
    console.log(`📊 New average: ${newAverageRating.toFixed(1)} (${newVoteCount} votes)`);
    
    onRate?.(newRating);
  };

  // Ensure displayRating and displayVotes are always valid numbers
  const displayRating = typeof currentRating === 'number' && !isNaN(currentRating) ? currentRating : safeRating;
  const displayVotes = typeof currentVoteCount === 'number' && !isNaN(currentVoteCount) ? currentVoteCount : safeTotalVotes;

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRate(star)}
            onMouseEnter={() => !hasVoted && setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className={`focus:outline-none transition-all duration-200 ${
              hasVoted ? 'cursor-default' : 'cursor-pointer hover:scale-110 transform'
            }`}
            disabled={hasVoted}
            title={hasVoted ? `You voted ${userRating} stars` : `Click to rate ${star} stars`}
          >
            <Star
              className={`w-4 h-4 ${
                star <= Math.round(hoveredRating || displayRating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-400 hover:text-yellow-300"
              } ${!hasVoted ? 'hover:drop-shadow-lg' : ''}`}
            />
          </button>
        ))}
      </div>
      <span className="text-sm text-cyan-300 font-medium">
        {displayRating.toFixed(1)}
      </span>
      {showVoteCount && (
        <span className="text-xs text-gray-400">
          ({displayVotes.toLocaleString()} votes)
        </span>
      )}
      {hasVoted && (
        <span className="text-xs text-green-400 font-medium flex items-center">
          ✓ You rated {userRating} star{userRating !== 1 ? 's' : ''}
        </span>
      )}
    </div>
  );
};

export default StarRating;
