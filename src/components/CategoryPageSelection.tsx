
import { memo, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mainCategories } from "@/utils/mainCategoryMapping";

import { TOTAL_TOOLS as FAST_TOOL_TOTAL } from "@/data/generated/toolCount";

const CategoryPageSelection = memo(() => {
  const navigate = useNavigate();
  
  // Opening path must stay instant: no detector-based category counts on first paint.
  const categoryBadges = useMemo(() => {
    return Object.fromEntries(
      mainCategories.map((mainCat) => [
        mainCat.name,
        mainCat.name === "ALL AI TOOLS" ? `${FAST_TOOL_TOTAL.toLocaleString()} tools` : "Explore",
      ]),
    );
  }, []);

  const handleMainCategoryClick = (mainCategoryName: string) => {
    // INSTANT navigation - no delays
    const encodedName = encodeURIComponent(mainCategoryName);
    navigate(`/main-category/${encodedName}`, { state: { instantCategory: { name: mainCategoryName } } });
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const warmCategoryPage = () => {
    import("@/pages/MainCategoryPage").catch(() => {});
  };

  return (
    <section className="py-16 px-4 relative">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 bg-clip-text text-transparent" style={{ textShadow: '0 0 30px rgba(0, 255, 0, 0.3)' }}>
          🎯 Select Your AI Tool Category
        </h2>
        <p className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto">
          Select a category to explore an endless stream of AI tools that will suit your needs
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {mainCategories.map((mainCat) => {
            return (
              <Button
                key={mainCat.name}
                onClick={() => handleMainCategoryClick(mainCat.name)}
                onMouseEnter={warmCategoryPage}
                onFocus={warmCategoryPage}
                variant="outline"
                className={`group relative overflow-hidden transition-all duration-150 transform hover:scale-105 border h-auto py-6 px-3 min-w-0 ${
                  mainCat.name === "ALL AI TOOLS"
                    ? "bg-gradient-to-br from-yellow-600/30 to-orange-600/30 border-yellow-400/50 text-yellow-200 hover:from-yellow-600/40 hover:to-orange-600/40 hover:text-yellow-100 hover:shadow-xl hover:border-yellow-300/60"
                    : "bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-green-600/30 text-gray-200 hover:from-green-600/20 hover:to-emerald-600/20 hover:text-white hover:shadow-lg hover:border-green-400/50"
                }`}
              >
                <div className="flex flex-col items-center space-y-3 w-full min-w-0">
                  <span className="text-2xl flex-shrink-0">{mainCat.emoji}</span>
                  <span className="relative z-10 text-center leading-tight font-bold text-sm break-words hyphens-auto min-w-0 max-w-full">{mainCat.name}</span>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs relative z-10 flex-shrink-0 ${
                      mainCat.name === "ALL AI TOOLS"
                        ? "bg-yellow-500/20 text-yellow-200 border-yellow-400/40 group-hover:bg-yellow-400/30 group-hover:text-yellow-100 group-hover:border-yellow-300/50"
                        : "bg-black/30 text-gray-300 border-green-500/40 group-hover:bg-green-500/20 group-hover:text-white group-hover:border-green-400/30"
                    }`}
                  >
                    {categoryBadges[mainCat.name]}
                  </Badge>
                </div>
              </Button>
            );
          })}
        </div>
      </div>
    </section>
  );
});

CategoryPageSelection.displayName = "CategoryPageSelection";

export default CategoryPageSelection;