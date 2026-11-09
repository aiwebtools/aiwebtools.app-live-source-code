
import { useState, useCallback, useEffect } from "react";
import { useFeaturedToolsState } from "@/hooks/useFeaturedToolsState";
import { useScrollMemory } from "@/hooks/useScrollMemory";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { verifyFeaturedToolsContent, runFullToolVerification } from "@/utils/toolIndexing";
import { searchTools } from "@/utils/searchUtils";

interface UseFeaturedToolsLogicProps {
  onToolsLoaded?: (count: number) => void;
}

export const useFeaturedToolsLogic = ({ onToolsLoaded }: UseFeaturedToolsLogicProps) => {
  const [showAllFeaturedTools, setShowAllFeaturedTools] = useState(false);
  
  const {
    selectedCategory,
    searchTerm,
    displayedCount,
    isLoading,
    setDisplayedCount,
    setIsLoading,
    handleCategoryChange,
    handleSearchChange,
    filteredTools,
    totalToolsCount,
    categoriesWithCounts,
    hasMoreTools
  } = useFeaturedToolsState();

  // Set initial display count to minimal for instant loading
  const initialDisplayCount = 8;

  // Calculate actual displayed count based on show more state
  const actualDisplayedCount = (!selectedCategory && !searchTerm && !showAllFeaturedTools) 
    ? Math.min(initialDisplayCount, filteredTools.length)
    : displayedCount;

  const shouldShowFeaturedToolsButton = !selectedCategory && !searchTerm && 
    filteredTools.length > initialDisplayCount && !showAllFeaturedTools && 
    actualDisplayedCount <= initialDisplayCount;

  // Disable heavy verification for better performance
  // Run comprehensive verification on component mount (disabled for performance)
  useEffect(() => {
    // Disable verification completely to improve performance
    // Only run basic logging in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 FeaturedTools loaded with', filteredTools.length, 'tools');
    }
  }, [filteredTools.length]);

  // Handle scroll position memory
  useScrollMemory({ displayedCount: actualDisplayedCount, selectedCategory, searchTerm });

  // Simplified performance logging
  if (process.env.NODE_ENV === 'development') {
    console.log(`📊 Tools: ${filteredTools.length} filtered, ${actualDisplayedCount} displayed`);
  }

  const handleLoadMore = useCallback(() => {
    if (isLoading || !hasMoreTools) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      const newCount = Math.min(displayedCount + 8, filteredTools.length);
      setDisplayedCount(newCount);
      setIsLoading(false);
      if (onToolsLoaded) {
        onToolsLoaded(newCount);
      }
    }, 50); // Reduced delay for faster loading
  }, [isLoading, displayedCount, setDisplayedCount, setIsLoading, onToolsLoaded, hasMoreTools, filteredTools.length]);

  const handleShowMoreFeaturedTools = useCallback(() => {
    setShowAllFeaturedTools(true);
    // Enable the existing guarded infinite loader, not a full-catalog mount.
    setDisplayedCount(Math.min(24, filteredTools.length));
  }, [setDisplayedCount, filteredTools.length]);

  // Disable infinite scroll for featured tools section - only manual loading
  // This prevents the jumping/glitching behavior

  return {
    // State
    showAllFeaturedTools,
    selectedCategory,
    searchTerm,
    isLoading,
    filteredTools,
    totalToolsCount,
    categoriesWithCounts,
    hasMoreTools,
    actualDisplayedCount,
    shouldShowFeaturedToolsButton,
    initialDisplayCount,
    
    // Handlers
    handleCategoryChange,
    handleSearchChange,
    handleLoadMore,
    handleShowMoreFeaturedTools
  };
};
