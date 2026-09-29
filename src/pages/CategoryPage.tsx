
import { useParams } from "react-router-dom";
import { useState, useEffect, useMemo, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import CategoryHeader from "@/components/category/CategoryHeader";
import ToolsGrid from "@/components/tools/ToolsGrid";
import ScrollToTopButton from "@/components/category/ScrollToTopButton";
import SEOHead from "@/components/SEOHead";
import { allTools } from "@/data/toolsData";
import { getToolsByCategory } from "@/utils/categoryUtils";
import { getStandardizedCategoryTitle } from "@/utils/categoryTitles";
import { generateStructuredData } from "@/utils/seo";
import { searchTools } from "@/utils/searchUtils";
import { orderCategoryTools } from "@/utils/category/categoryOrdering";
import DownloadLibraryButton from "@/components/DownloadLibraryButton";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [displayedCount, setDisplayedCount] = useState(48);
  const [isLoading, setIsLoading] = useState(false);
  const [filterSearchTerm, setFilterSearchTerm] = useState("");

  // Decode and standardize the category name
  const decodedCategory = categoryName ? decodeURIComponent(categoryName) : "";
  const standardizedCategory = getStandardizedCategoryTitle(decodedCategory);
  
  // Get tools for this category
  const categoryTools = useMemo(() => {
    const tools = getToolsByCategory(allTools, standardizedCategory);
    if (import.meta.env.DEV) {
      console.log(`📊 Found ${tools.length} tools in category "${standardizedCategory}"`);
    }
    return tools;
  }, [standardizedCategory]);

  // Stable, deduplicated, deterministically ordered list. No random filler:
  // random re-shuffles on every "load more" made scrolled cards appear to
  // repeat. Pagination now only ever appends new, unique tools.
  const finalFilteredTools = useMemo(() => {
    const source = filterSearchTerm.trim()
      ? searchTools(allTools, filterSearchTerm)
      : categoryTools;

    const seen = new Set<string>();
    const unique = source.filter((tool) => {
      const key = `${tool.title.toLowerCase().trim()}|||${tool.directUrl || ""}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    if (filterSearchTerm.trim()) return unique;
    return orderCategoryTools(unique, standardizedCategory);
  }, [categoryTools, standardizedCategory, filterSearchTerm]);

  useEffect(() => {
    // Scroll to top when the category itself changes.
    window.scrollTo(0, 0);
    setDisplayedCount(48);
    setFilterSearchTerm(""); // Clear filter when category changes
  }, [standardizedCategory]);


  const handleLoadMore = useCallback(() => {
    setIsLoading((loading) => {
      if (loading) return loading;
      setTimeout(() => {
        setDisplayedCount(prev => prev + 48);
        setIsLoading(false);
      }, 100);
      return true;
    });
  }, []);

  const handleFilterSearch = useCallback((searchTerm: string) => {
    setFilterSearchTerm(searchTerm);
    setDisplayedCount(48); // Reset count when new filter is applied
    window.scrollTo(0, 0); // Scroll to top to see results
  }, []);

  if (!decodedCategory) {
    return (
      <div className="min-h-screen bg-black relative overflow-x-hidden">
        <SEOHead
          title="Category Not Found"
          description="The requested category could not be found. Browse our collection of AI tool categories."
          noIndex={true}
        />
        <AnimatedBackground />
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-3xl font-bold text-cyan-100 mb-4">Category Not Found</h1>
            <p className="text-gray-300">This category doesn't exist in our directory.</p>
          </div>
        </div>
      </div>
    );
  }

  const categoryStructuredData = generateStructuredData('category');

  return (
    <div className="min-h-screen bg-black relative overflow-x-hidden">
      <SEOHead
        title={`${standardizedCategory} AI Tools - Best ${standardizedCategory} Tools 2026`}
        description={`Discover ${categoryTools.length} premium ${standardizedCategory.toLowerCase()} AI tools. Find the best artificial intelligence solutions for ${standardizedCategory.toLowerCase()} tasks and workflows.`}
        keywords={[
          `${standardizedCategory.toLowerCase()} ai tools`,
          `best ${standardizedCategory.toLowerCase()} tools`,
          `${standardizedCategory.toLowerCase()} artificial intelligence`,
          `ai ${standardizedCategory.toLowerCase()} software`,
          "ai tools directory",
          "artificial intelligence tools",
          "ai tools 2026"
        ]}
        url={`/category/${encodeURIComponent(standardizedCategory)}`}
        structuredData={categoryStructuredData}
        category={standardizedCategory}
      />
      
      <AnimatedBackground />
      <div className="relative z-10 cyber-grid">
        <Header />
        
        <div className="pt-32 md:pt-36 lg:pt-40">
          <CategoryHeader 
            categoryName={standardizedCategory}
            toolCount={categoryTools.length}
            onFilterSearch={handleFilterSearch}
          />
          
          <ToolsGrid 
            tools={finalFilteredTools}
            displayedCount={displayedCount}
            selectedCategory={filterSearchTerm ? null : standardizedCategory} // Don't show category when filtering
            searchTerm={filterSearchTerm} // Pass filter term as search term
            onLoadMore={handleLoadMore}
            hasInfiniteScroll={true}
            isLoading={isLoading}
            isFilterSearch={!!filterSearchTerm} // Pass filter search flag
          />
          <div className="container mx-auto flex justify-center px-4 py-10">
            <DownloadLibraryButton />
          </div>
        </div>
        
        <ScrollToTopButton />
        <Footer />
      </div>
    </div>
  );
};

export default CategoryPage;
