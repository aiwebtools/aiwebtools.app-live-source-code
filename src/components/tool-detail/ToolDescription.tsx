
import { CardDescription } from "@/components/ui/card";
import { Tool } from "@/types/tools";
import { getDisplayedCategory } from "@/utils/toolCategoryDisplay";
import { TOTAL_TOOLS } from "@/data/generated/toolCount";

interface ToolDescriptionProps {
  tool: Tool;
}

const ToolDescription = ({ tool }: ToolDescriptionProps) => {
  // Enhanced description generation with more detailed and engaging content
  const getEnhancedDescription = () => {
    // If the tool already has a substantial description (over 150 characters), enhance it further
    if (tool.description && tool.description.length > 150) {
      let enhancedDescription = tool.description;
      
      // Add category-specific benefits
      if (tool.category) {
        enhancedDescription += tool.title === "Muse" && getDisplayedCategory(tool) === "AI Agents"
          ? " Muse revolutionizes workflows by automating complex tasks and providing intelligent insights that would typically require hours of manual work."
          : ` This cutting-edge ${tool.category.toLowerCase()} AI tool revolutionizes workflows by automating complex tasks and providing intelligent insights that would typically require hours of manual work.`;
      }
      
      // Add tag-based features
      if (tool.tags && tool.tags.length > 0) {
        enhancedDescription += ` Key capabilities include ${tool.tags.slice(0, 5).join(', ')}, making it an essential tool for professionals seeking to leverage artificial intelligence for enhanced productivity and superior results.`;
      }
      
      return enhancedDescription;
    }
    
    // Generate comprehensive descriptions for tools with shorter descriptions
    let description = tool.description || `${tool.title} is an advanced AI-powered solution designed to transform your ${tool.category?.toLowerCase() || 'digital'} workflow with intelligent automation and cutting-edge artificial intelligence capabilities.`;
    
    // Add category-specific value propositions
    if (tool.category) {
      const categoryBenefits = getCategoryBenefits(tool.category);
      description += ` ${categoryBenefits}`;
    }
    
    // Add feature descriptions based on tags
    if (tool.tags && tool.tags.length > 0) {
      description += ` This comprehensive AI solution offers ${tool.tags.slice(0, 4).join(', ')} functionality, providing users with a complete toolkit for ${tool.category?.toLowerCase() || 'AI-powered'} tasks.`;
      
      if (tool.tags.length > 4) {
        description += ` Additional features include ${tool.tags.slice(4, 8).join(', ')}, ensuring versatility across diverse use cases and professional requirements.`;
      }
    }
    
    // Add value proposition
    description += ` Experience the power of next-generation artificial intelligence technology that streamlines complex processes, reduces manual effort, and delivers professional-grade results in a fraction of the time.`;
    
    // Add user benefit statement
    description += ` Whether you're a beginner exploring AI capabilities or a seasoned professional optimizing workflows, this tool provides intuitive interfaces combined with powerful AI algorithms to meet your specific needs and exceed expectations.`;
    
    return description;
  };

  const getCategoryBenefits = (category: string): string => {
    const benefits: Record<string, string> = {
      "AI Assistants": "Leverage intelligent virtual assistance that understands context, provides personalized recommendations, and adapts to your unique workflow patterns for maximum efficiency.",
      "Content Creation": "Generate high-quality, engaging content with AI-powered writing assistance that maintains your brand voice while optimizing for audience engagement and SEO performance.",
      "Image Generation": "Create stunning visual content using advanced AI algorithms that transform text descriptions into professional-quality images, artwork, and graphics.",
      "Video Tools": "Produce professional video content with AI-enhanced editing, automated effects, and intelligent content optimization that saves hours of manual editing work.",
      "Business Tools": "Streamline business operations with intelligent automation that handles repetitive tasks, analyzes data patterns, and provides actionable insights for strategic decision-making.",
      "Developer Tools": "Accelerate development workflows with AI-powered code generation, debugging assistance, and intelligent suggestions that enhance productivity and code quality.",
      "Audio & Music": "Transform audio experiences with AI-driven sound enhancement, music generation, and voice processing that delivers studio-quality results.",
      "Writing & Content": "Enhance written communication with AI-powered editing, grammar optimization, style suggestions, and content structure improvements.",
      "Design & Graphics": "Create professional designs using AI-assisted tools that provide creative suggestions, automated layouts, and design optimization for various media formats.",
      "Research & Learning": "Accelerate knowledge discovery with AI-powered research assistance, information synthesis, and learning optimization that enhances comprehension and retention.",
      "Productivity": "Maximize efficiency with intelligent task management, automated scheduling, and workflow optimization that adapts to your personal productivity patterns.",
      "Education": "Enhance learning experiences with personalized AI tutoring, adaptive content delivery, and intelligent assessment tools that optimize educational outcomes."
    };
    
    return benefits[category] || "Harness advanced AI capabilities to automate complex tasks, enhance decision-making, and achieve superior results with minimal effort.";
  };

  const getUseCases = () => {
    if (!tool.category) return [];
    
    const useCases: Record<string, string[]> = {
      "AI Assistants": ["Personal productivity management", "Customer service automation", "Research assistance", "Schedule optimization"],
      "Content Creation": ["Blog post generation", "Social media content", "Marketing copy", "SEO-optimized articles"],
      "Image Generation": ["Marketing visuals", "Social media graphics", "Product mockups", "Creative artwork"],
      "Video Tools": ["Content marketing videos", "Educational tutorials", "Social media clips", "Professional presentations"],
      "Business Tools": ["Data analysis", "Process automation", "Customer insights", "Performance optimization"],
      "Developer Tools": ["Code generation", "Bug detection", "API development", "Testing automation"],
      "Audio & Music": ["Podcast production", "Music composition", "Voice enhancement", "Audio editing"],
      "Writing & Content": ["Document editing", "Creative writing", "Technical documentation", "Translation services"],
      "Design & Graphics": ["Logo creation", "Website design", "Print materials", "Brand assets"],
      "Research & Learning": ["Academic research", "Market analysis", "Skill development", "Knowledge synthesis"],
      "Productivity": ["Task automation", "Time management", "Workflow optimization", "Goal tracking"],
      "Education": ["Personalized learning", "Assessment creation", "Curriculum development", "Student support"]
    };
    
    return useCases[tool.category] || ["Process automation", "Efficiency improvement", "Quality enhancement", "Time optimization"];
  };

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4 cyber-glow">
        About {tool.title}
      </h3>
      
      <CardDescription className="text-lg text-gray-300 leading-relaxed mb-6">
        {getEnhancedDescription()}
      </CardDescription>
      
      {/* Use Cases Section */}
      <div className="mb-6">
        <h4 className="text-xl font-semibold text-cyan-300 mb-3">Perfect For:</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {getUseCases().map((useCase, index) => (
            <div key={index} className="flex items-center text-gray-400">
              <span className="text-cyan-400 mr-2">✓</span>
              <span className="text-sm">{useCase}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Key Benefits */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-4 mb-6">
        <h4 className="text-lg font-semibold text-cyan-300 mb-3">Why Choose {tool.title}?</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-300">
          <div className="flex items-center">
            <span className="text-green-400 mr-2">🚀</span>
            <span>Boost productivity up to 10x faster</span>
          </div>
          <div className="flex items-center">
            <span className="text-blue-400 mr-2">🎯</span>
            <span>Professional-quality results</span>
          </div>
          <div className="flex items-center">
            <span className="text-purple-400 mr-2">💡</span>
            <span>Intuitive and user-friendly</span>
          </div>
          <div className="flex items-center">
            <span className="text-yellow-400 mr-2">⚡</span>
            <span>Instant AI-powered processing</span>
          </div>
        </div>
      </div>
      
      {/* SEO Tagline */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-4">
        <p className="text-sm text-cyan-300 text-center leading-relaxed">
          <span className="font-semibold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Discover {tool.title} in our collection of {TOTAL_TOOLS.toLocaleString()} AI Tools
          </span>
          <br />
          <span className="text-gray-400">
            Curated by <strong className="text-cyan-300">AI WEB TOOLS</strong> | 
            Visit <strong className="text-cyan-300">AIWEBTOOLS.AI</strong> | 
            Your trusted <strong className="text-cyan-300">AI WEB TOOLS</strong> directory for cutting-edge artificial intelligence solutions
          </span>
        </p>
      </div>
    </div>
  );
};

export default ToolDescription;
