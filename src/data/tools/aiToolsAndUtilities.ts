
import { Tool } from "@/types/tools";
import { 
  Bot, 
  Search, 
  Code, 
  Zap, 
  Brain, 
  Settings, 
  Globe, 
  Calculator,
  Target,
  MessageSquare,
  Lightbulb,
  Database,
  FileText,
  Cpu,
  Activity,
  Shield,
  Eye,
  Rocket,
  Hash,
  Cloud,
  List,
  FlaskConical,
  Atom
} from "lucide-react";

import perplexityAiHero from "@/assets/tools/perplexity-ai-hero.jpg";
import promptBoxHero from "@/assets/tools/prompt-box-hero.jpg";

export const aiToolsAndUtilities: Tool[] = [
  {
    icon: Search,
    title: "Perplexity AI Search Engine",
    description: "One of the best AI search engines available - similar to Google but with advanced AI capabilities. Features real-time search with citations and sources.",
    emoji: "🔍",
    color: "from-blue-500 to-purple-600",
    directUrl: "https://www.perplexity.ai/?via=aiwebtools",
    imageUrl: perplexityAiHero,
    tags: ["AI search", "search engine", "research", "citations", "real-time"],
    category: "AI Tools & Utilities",
    rating: 4.8,
    totalVotes: 4567
  },
  {
    icon: List,
    title: "AI Tools List (FREE CSV Download)",
    description: "Instantly download the complete AI Web Tools directory as a CSV file — every tool, category, URL, tag, and rating in our live database. Always up-to-date with every new tool added.",
    emoji: "📚",
    color: "from-green-500 to-blue-600",
    directUrl: "csv-download://all-tools",
    tags: ["AI tools", "AI resources", "list", "directory", "database", "CSV", "download", "free", "complete directory", "export"],
    category: "AI Tools & Utilities",
    rating: 4.9,
    totalVotes: 2789,
    isFree: true
  },
  {
    icon: Zap,
    title: "Prompt Box",
    description: "AI-powered prompt generator for creating effective prompts for AI models and chatbots.",
    emoji: "💡",
    color: "from-yellow-500 to-orange-600",
    directUrl: "https://promptbox.lovable.app/?via=aiwebtools",
    imageUrl: promptBoxHero,
    tags: ["prompt generator", "AI prompts", "chatbots", "AI models", "prompt engineering"],
    category: "AI Tools To Run LOCALLY",
    rating: 4.1,
    totalVotes: 1987
  }
];
