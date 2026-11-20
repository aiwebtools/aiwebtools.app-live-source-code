
import { useState, useMemo, useCallback } from "react";
import { directoryTools as allTools } from "@/data/toolsData";
import { searchTools } from "@/utils/search/searchUtils";
import { getToolsByCategory } from "@/utils/categoryUtils";
import { getSortedStandardizedCategories } from "@/utils/categoryTitles";
import { filterDirectoryTools } from "@/utils/directoryIntegrity";

export const useFeaturedToolsState = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [displayedCount, setDisplayedCount] = useState<number>(24); // Initial display count
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showFreeOnly, setShowFreeOnly] = useState<boolean>(false);

  const handleCategoryChange = useCallback((category: string | null) => {
    console.log('🏷️ Category change requested:', category);
    setSelectedCategory(category);
    setSearchTerm("");
    setDisplayedCount(24);
    setIsLoading(false);
  }, []);

  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
    setSelectedCategory(null);
    setDisplayedCount(24);
    setIsLoading(false);
  }, []);

  const handleFreeOnlyChange = useCallback((freeOnly: boolean) => {
    setShowFreeOnly(freeOnly);
    setDisplayedCount(24);
    setIsLoading(false);
  }, []);

  // One scoped result set drives both the cards and their count. Never append
  // unrelated recommendations or replace an empty search with the full catalog.
  const filteredTools = useMemo(() => {
    const source = selectedCategory ? getToolsByCategory(allTools, selectedCategory) : allTools;
    return filterDirectoryTools(source, searchTerm, showFreeOnly);
  }, [selectedCategory, searchTerm, showFreeOnly]);
  const totalToolsCount = filteredTools.length;

  // Simple categories calculation
  const categoriesWithCounts = useMemo(() => {
    const categories = getSortedStandardizedCategories();
    return categories.map(([name, count]) => ({ name, count }));
  }, []);
  
  // Allow loading more only while there are more unique tools to show
  const hasMoreTools = displayedCount < filteredTools.length;

  return {
    selectedCategory,
    searchTerm,
    displayedCount,
    isLoading,
    showFreeOnly,
    setDisplayedCount,
    setIsLoading,
    handleCategoryChange,
    handleSearchChange,
    handleFreeOnlyChange,
    filteredTools,
    totalToolsCount,
    categoriesWithCounts,
    hasMoreTools
  };
};
