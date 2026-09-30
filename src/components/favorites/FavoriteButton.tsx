import React from 'react';
import { Heart } from 'lucide-react';
import { Tool } from '@/types/tools';
import { useFavorites } from '@/hooks/useFavorites';
import { Button } from '@/components/ui/button';

interface FavoriteButtonProps {
  tool: Tool;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
  tool, 
  className = '', 
  size = 'md' 
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isToolFavorite = isFavorite(tool.title);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(tool);
  };

  const sizeClasses = {
    sm: 'w-9 h-9 p-2',
    md: 'w-10 h-10 p-2.5',
    lg: 'w-11 h-11 p-3'
  };

  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 20
  };

  return (
    <Button
      onClick={handleFavoriteClick}
      variant="ghost"
      size="icon"
      className={`
        absolute top-1.5 right-1.5 z-30 rounded-full backdrop-blur-sm pointer-events-auto
        ${isToolFavorite 
          ? 'bg-red-500/95 hover:bg-red-600/95 text-white border border-red-400/60 shadow-lg' 
          : 'bg-gray-800/95 hover:bg-gray-700/95 text-gray-300 hover:text-red-400 border border-gray-600/60'
        }
        transition-all duration-200 hover:scale-105 active:scale-95
        ${sizeClasses[size]}
        ${className}
      `}
      title={isToolFavorite ? 'Remove from favorites' : 'Add to favorites'}
      aria-label={isToolFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart 
        size={iconSizes[size]}
        fill={isToolFavorite ? 'currentColor' : 'none'}
        className={`transition-colors duration-200 ${
          isToolFavorite ? 'text-white' : ''
        }`}
      />
    </Button>
  );
};

export default FavoriteButton;