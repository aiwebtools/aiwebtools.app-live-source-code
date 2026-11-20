
import { getCategoriesWithCounts } from "./categoryUtils";
import { directoryTools as allTools } from "@/data/toolsData";

// Consolidated category title configuration matching your new structure
export const CATEGORY_TITLES = {
  // Core consolidated categories
  "AI Development & Platforms": "AI Development & Platforms",
  "Writing & Text Generation": "Writing & Text Generation",
  "Image & Design Generation": "Image & Design Generation",
  "Video & Animation Tools": "Video & Animation Tools",
  "Audio & Music Tools": "Audio & Music Tools",
  "Business Operations & Productivity": "Business Operations & Productivity",
  "Automation Platforms": "Automation Platforms",
  "Marketing & Sales Solutions": "Marketing & Sales Solutions",
  "Communication & Collaboration Tools": "Communication & Collaboration Tools",
  "AI Assistants & Search": "AI Assistants & Search",
  "Data Science & Analytics": "Data Science & Analytics",
  "Education & Research Tools": "Education & Research Tools",
  "Industry-Specific Solutions": "Industry-Specific Solutions",
  "Creative & Entertainment (General & Gaming)": "Creative & Entertainment (General & Gaming)",
  "Health, Wellness & Personal Lifestyle": "Health, Wellness & Personal Lifestyle",
  "Historical & Time-Based AI Tools": "Historical & Time-Based AI Tools",
  
  // Special categories
  "ai-originals": "AIWebTools GPTs Collection",
  "AIWebTools GPTs Collection": "AIWebTools GPTs Collection"
} as const;

// Function to get standardized category title
export const getStandardizedCategoryTitle = (category: string): string => {
  return CATEGORY_TITLES[category as keyof typeof CATEGORY_TITLES] || category;
};

// Function to get all categories with standardized titles and counts
export const getStandardizedCategoriesWithCounts = (): Record<string, number> => {
  const categoriesWithCounts = getCategoriesWithCounts(allTools);
  const standardizedCategories: Record<string, number> = {};
  
  Object.entries(categoriesWithCounts).forEach(([category, count]) => {
    const standardizedTitle = getStandardizedCategoryTitle(category);
    standardizedCategories[standardizedTitle] = (standardizedCategories[standardizedTitle] || 0) + count;
  });
  
  // Category structure logging disabled for performance
  
  return standardizedCategories;
};

// Strategic order for the new consolidated categories
export const CATEGORY_DISPLAY_ORDER = [
  "AI Development & Platforms",
  "Writing & Text Generation",
  "Image & Design Generation", 
  "Video & Animation Tools",
  "Audio & Music Tools",
  "Business Operations & Productivity",
  "Marketing & Sales Solutions",
  "Communication & Collaboration Tools",
  "AI Assistants & Search",
  "Data Science & Analytics",
  "Automation Platforms",
  "Education & Research Tools",
  "Industry-Specific Solutions",
  "Creative & Entertainment (General & Gaming)",
  "Health, Wellness & Personal Lifestyle",
  "Historical & Time-Based AI Tools"
];

// Function to get sorted categories with consistent ordering
export const getSortedStandardizedCategories = (): [string, number][] => {
  const categoriesWithCounts = getStandardizedCategoriesWithCounts();
  
  return Object.entries(categoriesWithCounts).sort(([a], [b]) => {
    const aIndex = CATEGORY_DISPLAY_ORDER.indexOf(a);
    const bIndex = CATEGORY_DISPLAY_ORDER.indexOf(b);
    
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    } else if (aIndex !== -1) {
      return -1;
    } else if (bIndex !== -1) {
      return 1;
    } else {
      return a.localeCompare(b);
    }
  });
};
