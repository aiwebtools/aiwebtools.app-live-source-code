import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createTimePortalEffect } from "@/utils/timeEffects";
import { useNavigate } from "react-router-dom";
import GlobalSearchBar from "@/components/LazyGlobalSearchBar";
import { FavoritesButton } from "@/components/favorites/FavoritesButton";
import { Tool } from "@/types/tools";
import { useState, useRef, useMemo, useEffect } from "react";
import { Play } from "lucide-react";
import ToolDisclaimerBadges from "@/components/disclaimers/ToolDisclaimerBadges";
import { generateToolSlug } from "@/utils/urlGenerator";
import FeaturedGptActions from "@/components/featured/FeaturedGptActions";
import AutoScaleTitle from "@/components/ui/auto-scale-title";
import { trackToolClickEvent } from "@/hooks/useToolAnalytics";
import { civicTransparencyBatch2026 } from "@/data/tools/civicTransparencyBatch2026";
import { perplexityBotsBatch2026 } from "@/data/tools/perplexityBotsBatch2026";
import { toFeatureLabels } from "@/utils/search/featuredCardHelpers";
import cannabisInspectorHero from "@/assets/cannabis-inspector-hero.jpg";

// Weighted shuffle - keeps high-quality tools near the top but adds randomness
// PRIORITY: Dream-conquering practical tools FIRST, then spirituality/awakening
const weightedShuffle = <T extends { title: string }>(items: T[]): T[] => {
  // TOP TIER: Dream-conquering, practical tools that help users excel and create
  const dreamConqueringTitles = new Set([
    // Time Travel & History (moved to top tier for maximum visibility)
    "TIME MACHINE GPT",
    // Civic Empowerment & Action
    "WE THE PEOPLE AI", "Public Testimony Writer GPT", "Legislation Writer GPT",
    "Social Safety Net GPT", "Global Peace Restoration GPT",
    // Health & Wellness
    "Personalized DR. GPT (Doctor GPT)", "Medicus - the FREE Personal Medical GPT", "Mental Wellness GPT (CBT)", "VETERINARIAN GPT",
    "Dental GPT Expert", "Pharmaceutical Assistant GPT", "Historical Apothecary GPT",
    "Genome GPT", "Dream Interpreter GPT", "Friend GPT", "Marriage Mender GPT",
    // Content Creation & Writing
    "BOOK WRITER GPT", "Movie Script Writer GPT", "Movie Maker Studio AI SUITE", 
    "Children's Picture Book Maker GPT", "Coloring Book Generator GPT", "Movie Scene Maker GPT",
    "Music Video Maker AI Studio", "🎭 Playwriter GPT", "Podcast Script Writer GPT",
    "Article and Blog Rewriter GPT", "Grant Writer GPT",
    // Education & Learning  
    "COLLEGE DEGREE GPT", "LEARN ANY COURSE GPT", "Learn Any Skill GPT",
    "Home-Schooling Assistant GPT", "Course Maker GPT", "Quiz Maker AI",
    "Music Melodies & Lessons GPT",
    // Business & Entrepreneurship
    "Business Plan Generator GPT", "🚀 Startup Validator GPT", "MICROSAAS GPT",
    "Training Manual Generator GPT", "Trader GPT", "Taxes GPT", "Contract Review Bot",
    // Design & Creative
    "Graphic & Cover Design GPT", "Sketch Artist GPT", "RESTYLE ME GPT",
    "Restaurant Menu Maker GPT", "Tattoo Designer GPT", "Meme Generator GPT",
    // AI Development & Productivity
    "Customizable GPT Maker", "AIWEBTOOLS GPT CLONER GPT", "G-Mode GPT", "MULTITASKER GPT",
    "PERFECT PROMPT ENGINE", "Data Research Analysis Report GPT", "AI Tools Finder GPT",
    "Software Engineer GPT",
    // Career & Professional
    "Resume & Job Finder AI Suite", "Engineering GPT Suite", "PPTx Powerpoint Maker GPT",
    // Entertainment & Gaming
    "Game Design Document / Developer GPT", "Celebrity Chatline GPT", "TRIVIA NIGHT GPT",
    // Specialized Professional Tools
    "Property Data Finder GPT", "Insurance Claims GPT", "HOME RENOVATOR GPT",
    "AUTOMOBILE GPT", "STAGEMASTER AI SUITE", "FISHERMAN GPT", "Chef Sizzle AI Culinary Assistant",
    "Mixologist GPT", "Travel Advisor GPT", "Agronomus AI Farming Expert",
    "FREE FARMING & COMMUNITY PLOTS FINDER GPT",
    // Self-Reliance & Empowerment
    "Self Sufficiency GPT", "Survivalist GPT", "FACT CHECKER GPT", "Fortune Teller GPT",
    "Hormuz Crisis Impact Prediction Engine GPT",
    "Cyber Security GPT", "Probability GPT", "FOOD QUALITY INSPECTOR GPT",
    "Cannabis GPT", "MATERIAL VALUATION GPT (MATERIUMOR)", "COLLECTIBLES APPRAISAL GPT",
    "Artwork & Vintage Appraisal GPT", "Sport Card Appraisal GPT",
    "Paleography GPT",
    "Cosmic Code Simulator",
    // Robot Safety & Utility
    "Passport Photo Maker GPT", "Disable That Robot GPT", "Rouge Robot Disabler GPT",
    "Robot Identifier and Disabler Survivalist GPT",
    // Preparedness & Scholars Batch 2026
    "Rouge Robot Disabler GEM (Unrestricted)",
    "Fallout Shelter Locator GPT", "Solar Power Personal Companion GPT", "Garden Starter GPT",
    "Nuclear Event Preparedness Survival System GPT", "Geiger Counter Analyst GPT",
    "Emergency Preparedness GPT", "Off Grid Planner GPT", "Alternative History Explorer GPT",
    "Ancient Wisdom Archive GPT", "Sir Isaac Newton GPT", "Johannes Kepler GPT",
    "James Clerk Maxwell GPT", "Whats The Plot Twist Chat?",
    "Zoroastrian Text Recovery Studies GPT", "Cursive Writing Worksheet Maker GPT",
    "Rastafari Lifestyles GPT",
    // Scholarly & Spiritual batch
    "Ancient Bible Recovery", "ORIGINAL GREEK OLD TESTIMENT GPT (Septuagint)",
    "Dead Sea Scrolls GPT", "ALL IS ONE GPT", "Ancient Egyptian Proverbs GPT",
    "Quran & Islamic Studies GPT",
    // Civic Transparency Batch 2026
    "Monopoly Reality Awakening GPT", "Government Corruption Prediction Engine GPT",
    "Govt Table Flipper Influence Investigator GPT", "Election Truth Scanner GPT",
    "Government Spending Investigator GPT", "Freedom Impact Simulator GPT",
    "Narrative Manipulation Detector GPT", "Government Contract Analyzer GPT",
    "Policy Transparency GPT", "Rights Defender GPT", "Local Government Watchdog GPT",
    "Media Manipulation Scanner GPT", "Voting Truth GPT", "Whistleblower Shield GPT",
    "Influence Network Investigator GPT", "Policy Impact Simulator GPT",
    "CITIZEN AUDIT GPT", "Follow the Money Corruption Insights GPT"
  ]);

  // SECOND TIER: Other premium tools (spirituality, exploration, history, etc.)
  const premiumTitles = new Set([
    "Talk to the Gods GPT", "Stellaris: 🚀AI Space Explorer",
    "Criminologist GPT", "Phenomenon Explorer AI Suite", "ImmortalizeME™", "Resurrection GPT", 
    "Mary Magdalene GPT", "ALAN WATTS GPT", "Albert Einstein GPT", "Nikola Tesla GPT", 
    "Public Defender GPT", "Sophia Aeterna AI", "Carl Sagan GPT", "Manicheism GPT",
    "Oraculum – The Revealer of Hidden Truths", "TALK TO HISTORY GPT", 
    "Indiana Archeologist GPT", "Illuminous World Data Explorer GPT", "METATRON GPT",
    
  ]);
  
  // Split into tiers
  const dreamConquering: T[] = [];
  const premium: T[] = [];
  const regular: T[] = [];
  
  items.forEach(item => {
    if (dreamConqueringTitles.has(item.title)) {
      dreamConquering.push(item);
    } else if (premiumTitles.has(item.title)) {
      premium.push(item);
    } else {
      regular.push(item);
    }
  });
  
  // Shuffle each tier
  const shuffleArray = (arr: T[]): T[] => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  
  const shuffledDreamConquering = shuffleArray(dreamConquering);
  const shuffledPremium = shuffleArray(premium);
  const shuffledRegular = shuffleArray(regular);
  
  // Dream-conquering tools first (top 12), then premium (next 8), then rest
  const topDreamConquering = shuffledDreamConquering.slice(0, Math.min(12, shuffledDreamConquering.length));
  const remainingDreamConquering = shuffledDreamConquering.slice(12);
  
  const topPremium = shuffledPremium.slice(0, Math.min(8, shuffledPremium.length));
  const remainingPremium = shuffledPremium.slice(8);
  
  // Combine remaining with regular and shuffle
  const mixed = shuffleArray([...remainingDreamConquering, ...remainingPremium, ...shuffledRegular]);
  
  return [...topDreamConquering, ...topPremium, ...mixed];
};

const isHumanBillOfRightsCard = (title: string) => title === "AI HUMAN BILL OF RIGHTS";

const placeHumanBillOfRightsNearBottom = <T extends { title: string }>(items: T[]): T[] => {
  const card = items.find(item => isHumanBillOfRightsCard(item.title));
  if (!card) return items;
  const rest = items.filter(item => !isHumanBillOfRightsCard(item.title));
  const insertAt = Math.max(0, Math.min(rest.length, Math.floor(rest.length * 0.72)));
  return [...rest.slice(0, insertAt), card, ...rest.slice(insertAt)];
};

// Lazy-loading YouTube video component - shows thumbnail until clicked
const LazyVideoEmbed = ({ videoUrl, title, height = "h-32" }: { videoUrl: string; title: string; height?: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Extract video ID
  const getVideoId = (url: string): string | null => {
    if (url.includes('youtube.com/watch?v=')) {
      return url.split('v=')[1]?.split('&')[0] || null;
    }
    if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1]?.split('?')[0] || null;
    }
    if (url.includes('youtube.com/embed/')) {
      return url.split('embed/')[1]?.split('?')[0] || null;
    }
    return null;
  };
  
  const videoId = getVideoId(videoUrl);
  if (!videoId) return null;
  
  const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1&playsinline=1`;
  
  if (isLoaded) {
    return (
      <iframe
        src={embedUrl}
        title={`${title} Demo`}
        className="absolute inset-0 w-full h-full"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }
  
  return (
    <div 
      className="absolute inset-0 cursor-pointer group/video"
      onClick={(e) => {
        e.stopPropagation();
        setIsLoaded(true);
      }}
    >
      <img 
        src={thumbnailUrl} 
        alt={`${title} thumbnail`}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover/video:bg-black/20 transition-colors">
        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg transform group-hover/video:scale-110 transition-transform">
          <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
        </div>
      </div>
    </div>
  );
};

// Hero image component with proper Vite asset handling and fallback
const HeroImage = ({ 
  imageUrl, 
  title, 
  description, 
  badge, 
  emoji, 
  color 
}: { 
  imageUrl: string; 
  title: string; 
  description: string; 
  badge: string; 
  emoji: string; 
  color: string; 
}) => {
  const [hasError, setHasError] = useState(false);
  
  // Convert /src/assets/ path to proper import URL for Vite
  const getResolvedImageUrl = (url: string): string => {
    if (url.startsWith('/src/assets/')) {
      // For Vite, we need to use the assets directly from the build
      // Convert to relative path that Vite can resolve
      const filename = url.replace('/src/assets/', '');
      return new URL(`../assets/${filename}`, import.meta.url).href;
    }
    return url;
  };
  
  if (hasError) {
    // Fallback to emoji display
    return (
      <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${color} text-5xl md:text-6xl`}>
        {emoji}
      </div>
    );
  }
  
  return (
    <img 
      src={getResolvedImageUrl(imageUrl)} 
      alt={`${title} - ${description?.slice(0, 100) || 'AI Tool'}...`}
      title={`${title} AI Tool - ${badge}`}
      className="w-full h-full object-cover"
      loading="lazy"
      decoding="async"
      itemProp="image"
      onError={() => setHasError(true)}
    />
  );
};

// =============================================================================
// OUR FEATURED SECTION - Portfolio showcase of AI Web Tools GPTs
// CLEANED VERSION - NO DUPLICATES, NO FAKE TOOLS
// =============================================================================

type FeaturedSpecialService = {
  title: string;
  description: string;
  badge: string;
  color: string;
  features: string[];
  directUrl: string;
  imageUrl?: string;
  videoUrl?: string;
  emoji?: string;
  blockchain?: string;
  tags?: string[];
};

// Sort featuredGPTs alphabetically by title (ignoring emojis and special characters at start)
const sortByTitle = (a: FeaturedSpecialService, b: FeaturedSpecialService) => {
  const cleanTitle = (title: string) => title.replace(/^[^\w\s]+\s*/, '').toLowerCase();
  return cleanTitle(a.title).localeCompare(cleanTitle(b.title));
};

const civicTransparencyFeaturedGPTs: FeaturedSpecialService[] = civicTransparencyBatch2026.map((tool) => ({
  title: tool.title,
  description: tool.description,
  badge: "CIVIC OVERSIGHT",
  color: tool.color || "from-blue-600 to-red-600",
  features: toFeatureLabels(tool.tags, ["Civic Analysis", "Public Accountability", "Government Oversight", "Transparency"]),
  directUrl: tool.directUrl,
  imageUrl: tool.imageUrl,
  emoji: tool.emoji || "🏛️"
}));

const perplexityBotsFeaturedGPTs: FeaturedSpecialService[] = perplexityBotsBatch2026.map((tool) => ({
  title: tool.title,
  description: tool.description,
  badge: "PERPLEXITY BOT",
  color: tool.color || "from-teal-500 to-cyan-600",
  features: toFeatureLabels(tool.tags, ["Perplexity Project", "Live Web Grounding", "Cited Sources", "Free To Use"]),
  directUrl: tool.directUrl,
  imageUrl: tool.imageUrl,
  emoji: tool.emoji || "🔎",
  tags: tool.tags
}));

const featuredGPTsUnsorted: FeaturedSpecialService[] = [
  ...civicTransparencyFeaturedGPTs,
  ...perplexityBotsFeaturedGPTs,
  {
    title: "AI HUMAN BILL OF RIGHTS",
    description: "As AI progresses, concerns will grow. Rather than wait until it is too late, AIWebTools.ai plants this suggestion into the psyche of the public: preserve human dignity, freedom, privacy, autonomy, and mankind's authority over machines before the machines become self-aware. A Bill of Rights for humanity in the AI age — just a suggestion from the Light.",
    badge: "HUMANITY FIRST CHARTER",
    color: "from-amber-400 via-cyan-400 to-emerald-500",
    features: ["Human Rights", "AI Preservation", "Mankind Over Machines", "AI Bill of Rights"],
    directUrl: "https://human-ai-guardian.lovable.app/?via=aiwebtools",
    imageUrl: "/src/assets/tools/ai-human-bill-of-rights-hero.jpg",
    emoji: "⚖️",
    tags: ["ai human bill of rights", "ai bill of rights", "human bill of rights", "human rights", "ai rights", "mankind over machines", "humanity first", "ai preservation", "human preservation", "artificial intelligence bill of rights", "ai humen bill of rights", "ai human bil of rights", "ai human bill of rigths", "human righs", "bill of writes", "phyee", "psyche"]
  },
  {
    title: "Ancient Bible Recovery",
    description: "Forensic recovery and translation of ancient biblical and para-biblical texts, exposing original forms through manuscript evidence. Discover hidden meanings through scholarly manuscript analysis.",
    badge: "BIBLICAL RESEARCH",
    color: "from-amber-600 to-stone-700",
    features: ["Manuscript Recovery", "Ancient Translation", "Textual Criticism", "Scripture Analysis"],
    directUrl: "https://chatgpt.com/g/g-696ae5296bd88191920a7b308dfde1d6-ancient-bible-recovery",
    imageUrl: "/src/assets/tools/ancient-bible-recovery-hero.png",
    emoji: "📜"
  },
  {
    title: "WE THE PEOPLE AI",
    description: "Empowering citizens with AI-driven tools for political activism, civic engagement, and grassroots organizing. Connect with representatives and make your voice heard.",
    badge: "CIVIC ENGAGEMENT",
    color: "from-blue-600 to-red-600",
    features: ["Political Activism", "Civic Engagement", "Democracy Tools", "Grassroots Organizing"],
    directUrl: "https://legislationwritergpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/mxdJ0gLxGCI?si=Yx0rWtOSmWijtZZC",
    emoji: "🗳️"
  },
  {
    title: "TIME MACHINE GPT",
    description: "Uncover the past, explore potential futures, and dive into alternative realities! Journey through different eras.",
    badge: "TIME TRAVEL",
    color: "from-amber-600 to-orange-600",
    features: ["Time Travel", "Historical Exploration", "Period Analysis", "Timeline Navigation"],
    directUrl: "https://time-machine-gpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/J31nNY5_PB4",
    emoji: "⏰"
  },
  {
    title: "Time Machine of Unwritten History GPT",
    description: "An unfiltered cosmic historian revealing lost truths through immersive time travel. Unveil hidden civilizations and forgotten knowledge.",
    badge: "HIDDEN HISTORY",
    color: "from-purple-600 to-amber-500",
    features: ["Lost Civilizations", "Hidden History", "Alternative Narratives", "Cosmic Exploration"],
    directUrl: "https://chatgpt.com/g/g-6942c94dcb08819191863b6d35161f09-time-machine-of-unwritten-history-gpt",
    imageUrl: "/src/assets/time-machine-unwritten-history.png",
    emoji: "🌌"
  },
  {
    title: "Trader GPT",
    description: "Advanced AI trading assistant for day traders and investors. Get real-time market analysis, trading signals, and data-driven insights for informed trading decisions.",
    badge: "FINANCE",
    color: "from-green-500 to-emerald-600",
    features: ["Market Analysis", "Trading Signals", "Portfolio Insights", "Real-time Data"],
    videoUrl: "https://www.youtube.com/watch?v=Izs80Fak4hQ",
    directUrl: "https://tradergpt.lovable.app/?via=aiwebtools",
    tags: ["trading", "stocks", "crypto", "market analysis", "investing", "day trading"],
    emoji: "📈"
  },
  {
    title: "Meme Generator GPT",
    description: "Create hilarious, viral-worthy memes with AI-powered creativity. Generate custom memes for any topic with perfect captions and trending formats.",
    badge: "CREATIVE",
    color: "from-yellow-500 to-orange-600",
    features: ["Meme Creation", "Viral Content", "Custom Captions", "Trending Formats"],
    directUrl: "https://memegeneratorgpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/Myg8P8wg294",
    emoji: "😂"
  },
  {
    title: "Meta.ai Video Prompt Generator GPT",
    description: "Generate expertly crafted text prompts for Meta.ai video generation. Creates detailed, optimized prompts and storylines specifically designed for Meta.ai's video capabilities.",
    badge: "VIDEO AI",
    color: "from-blue-500 to-purple-600",
    features: ["Meta.ai Prompts", "Video Storylines", "Quick Copy-Paste", "Productivity"],
    directUrl: "https://chatgpt.com/g/g-691b5852be7c8191beda5d0429f727bd-meta-ai-video-prompt-generator",
    imageUrl: "https://img1.wsimg.com/isteam/ip/9fd6d942-5b46-4025-92e2-0f1ec2a7adf2/a-futuristic-city-with-tall-buildings-th_JdXy-.png/:/cr=t:0%25,l:0%25,w:100%25,h:100%25/rs=w:1200,cg:true",
    emoji: "🎬"
  },
  {
    title: "🎭 Playwriter GPT",
    description: "Craft professional, fully structured theatrical plays from start to finish. Create original, engaging plays designed to captivate audiences with dramatic structure and character development.",
    badge: "THEATER",
    color: "from-red-500 to-purple-600",
    features: ["Play Writing", "Drama Structure", "Character Development", "Theatrical Formatting"],
    directUrl: "https://playwritergpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/_QQ-oYYSFlw",
    emoji: "🎭"
  },
  {
    title: ".WorldPeace Web3 Registration",
    description: "Buy and own your .worldpeace domain as a tradable NFT minted to your wallet of choice. Resell it, link it to your website, and send/receive crypto with a human-readable address.",
    badge: "WEB3 DOMAIN",
    color: "from-emerald-500 to-teal-600",
    features: ["Premium Web3 TLD", "Blockchain Ownership", "Brand Protection", "Global Peace"],
    directUrl: "https://freename.io/discover/worldpeace?ref=olive-ears-obey",
    videoUrl: "https://youtu.be/bAz1Kq2KDys?si=buJRzC9aTuCWatOY",
    blockchain: "Polygon",
    emoji: "🕊️"
  },
  {
    title: ".WorldTrade Web3 Registration",
    description: "Buy and own your .worldtrade domain as a tradable NFT minted to your wallet of choice. Resell it, link it to your website, and send/receive crypto with a human-readable address.",
    badge: "WEB3 DOMAIN",
    color: "from-cyan-500 to-blue-600",
    features: ["Premium Web3 TLD", "Blockchain Ownership", "Brand Protection", "Global Commerce"],
    directUrl: "https://freename.io/discover/worldtrade?ref=olive-ears-obey",
    videoUrl: "https://youtu.be/Taw41ee9bO8?si=1160QePNZgd6Yfvc",
    blockchain: "Solana",
    emoji: "🌐"
  },
  {
    title: "Farm Finder & Barter GPT",
    description: "Find local farms to support sustainability and local food systems. Assists with bartering, digital currency conversions, farm evaluations, and local sustainability planning.",
    badge: "AGRICULTURE",
    color: "from-green-600 to-amber-600",
    features: ["Local Farms", "Bartering", "Food Security", "Economic Resilience"],
    directUrl: "https://chatgpt.com/g/g-68d6c0b6cecc8191b38e0d9cf099769d-farm-finder-gpt",
    videoUrl: "https://youtu.be/DHVwaf7qMDY",
    emoji: "🚜"
  },
  {
    title: "ALAN WATTS GPT",
    description: "Your Free Thought Liberator, designed to inspire critical thinking, unravel illusions, and guide you toward deeper understanding with the spirit of Alan Watts.",
    badge: "PHILOSOPHY",
    color: "from-purple-500 to-orange-500",
    features: ["Philosophy", "Critical Thinking", "Wisdom", "Consciousness"],
    directUrl: "https://alanwattsgpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://www.youtube.com/watch?v=zdKfwsQwOLE",
    emoji: "🧘"
  },
  {
    title: "Albert Einstein GPT",
    description: "Advanced AI embodiment of Einstein's intellect, designed to challenge conventional wisdom, foster deep critical thinking, and explore mysteries of physics and mathematics.",
    badge: "PHYSICS",
    color: "from-blue-600 to-purple-600",
    features: ["Physics", "Mathematics", "Critical Thinking", "Scientific Inquiry"],
    directUrl: "https://teslaeinsteingpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://www.youtube.com/watch?v=kfGyOfjBI0s",
    emoji: "🧠"
  },
  {
    title: "Manicheism GPT",
    description: "The resurrected voice of prophet Mani—revealing the lost Light of a hunted faith. Explore the profound dualistic teachings of Manichaeism and the cosmic battle between Light and Darkness.",
    badge: "ANCIENT WISDOM",
    color: "from-amber-500 to-yellow-600",
    features: ["Lost Teachings", "Light vs Darkness", "Prophet Mani", "Ancient Religion"],
    directUrl: "https://chatgpt.com/g/g-69345518771c81919c341622d3b742e5-manicheism-gpt-some-lost-knowledge-of-the-light/",
    imageUrl: "/images/manicheism-gpt-hero.png",
    emoji: "☀️"
  },
  {
    title: "Alchemist Scientist GPT",
    description: "Mystical science advisor combining ancient alchemy with modern chemistry, providing unique insights into materials, transformations, and scientific mysteries.",
    badge: "SCIENCE",
    color: "from-purple-600 to-amber-600",
    features: ["Alchemy Science", "Material Analysis", "Chemical Insights", "Scientific Mysteries"],
    directUrl: "https://alchemicalscientistgpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/3JbmudJu9LM?si=lKMxbzq0a5XgKLAW",
    emoji: "⚗️"
  },
  {
    title: "Algebraic Expression Creative Inventor GPT",
    description: "Mathematical creativity tool for generating unique algebraic expressions, solving complex equations, and exploring mathematical patterns.",
    badge: "MATHEMATICS",
    color: "from-indigo-500 to-purple-600",
    features: ["Expression Generation", "Equation Solving", "Pattern Analysis", "Mathematical Creativity"],
    directUrl: "https://algebraicexpressioninventor.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/aFuAxVNXBvg",
    emoji: "🔢"
  },
  {
    title: "Ancient Gematria Scan GPT",
    description: "Decodes hidden numerical meanings within words, names, and phrases using ancient gematria systems including Hebrew, Greek, and sacred number systems.",
    badge: "SACRED NUMEROLOGY",
    color: "from-amber-500 to-yellow-600",
    features: ["Gematria Decoding", "Sacred Geometry", "Number Analysis", "Ancient Wisdom"],
    directUrl: "https://chatgpt.com/g/g-68a24b677890819181b9e47f4d1dd006-ancient-gematria-scan-gpt",
    videoUrl: "https://youtu.be/zBlubLw-OdY",
    emoji: "🔢"
  },
  {
    title: "AUTOMOBILE GPT",
    description: "Your ultimate all-encompassing AI automotive expert, designed to guide you through every aspect of the automotive world with precision.",
    badge: "AUTOMOTIVE",
    color: "from-blue-500 to-cyan-600",
    features: ["Car Maintenance", "Repair Diagnostics", "Buying Guides", "Auto Technology"],
    directUrl: "https://automobilegpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://www.youtube.com/watch?v=f_4aFnL-mk8",
    emoji: "🚗"
  },
  {
    title: "BOOK WRITER GPT",
    description: "Assists you in creating professional, well-structured books with seamless page-to-page continuity, engaging dialogue, and captivating storytelling.",
    badge: "WRITING SUITE",
    color: "from-blue-600 to-purple-600",
    features: ["Book Writing", "Story Structure", "Character Development", "Professional Formatting"],
    directUrl: "https://bookwritergpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/nBd9Uk62UiI",
    emoji: "📚"
  },
  {
    title: "Business Plan Generator GPT",
    description: "Professional business plan creation tool with comprehensive templates, financial modeling, market analysis, and strategic planning guidance.",
    badge: "BUSINESS",
    color: "from-blue-600 to-purple-600",
    features: ["Business Planning", "Financial Modeling", "Market Analysis", "Strategic Planning"],
    directUrl: "https://businessplanandtrainai.lovable.app/?via=aiwebtools",
    imageUrl: "https://img1.wsimg.com/isteam/ip/9fd6d942-5b46-4025-92e2-0f1ec2a7adf2/a-logo-design-with-the-text-business-plan-gene.png/:/cr=t:0%25,l:0%25,w:100%25,h:100%25/rs=w:600,cg:true/qt=q:30",
    emoji: "💼"
  },
  {
    title: "Cannabis GPT",
    description: "Comprehensive cannabis education covering cultivation, strains, medical applications, legal information, and industry insights.",
    badge: "CANNABIS",
    color: "from-green-500 to-lime-600",
    features: ["Cultivation Guide", "Strain Information", "Medical Applications", "Legal Guidance"],
    directUrl: "https://cannabisgpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/1fOxuIyl1C8",
    imageUrl: cannabisInspectorHero,
    emoji: "🌿"
  },
  {
    title: "Children's Picture Book Maker GPT",
    description: "Create magical picture books for children with AI-powered storytelling that brings your stories to life with vibrant illustrations.",
    badge: "CHILDREN'S BOOKS",
    color: "from-green-500 to-blue-600",
    features: ["Storytelling", "Illustrations", "Creative Writing", "Educational Content"],
    directUrl: "https://childrensbookmaker.lovable.app/?via=aiwebtools",
    videoUrl: "https://www.youtube.com/watch?v=MryAyvg_N0U",
    emoji: "📚"
  },
  {
    title: "Clarity Omni GPT",
    description: "AI tool designed to rewrite text for improved clarity while preserving the original meaning and intent.",
    badge: "CLARITY",
    color: "from-purple-500 to-indigo-600",
    features: ["Text Clarity", "Meaning Preservation", "Content Refinement", "Writing Enhancement"],
    directUrl: "https://clarityomni.lovable.app/?via=aiwebtools",
    imageUrl: "https://img1.wsimg.com/isteam/ip/9fd6d942-5b46-4025-92e2-0f1ec2a7adf2/a-futuristic-scene-of-an-ai-agent-with-a-halo.jpeg/:/cr=t:2.83%25,l:2.83%25,w:94.34%25,h:94.34%25/rs=w:1200,cg:true,m",
    emoji: "🔮"
  },
  {
    title: "COLLECTIBLES APPRAISAL GPT",
    description: "Professional collectibles and antiques appraisal service providing market valuations, authenticity verification, and investment guidance.",
    badge: "APPRAISAL",
    color: "from-amber-500 to-yellow-600",
    features: ["Market Valuation", "Authenticity Check", "Investment Guide", "Market Trends"],
    directUrl: "https://antiqueappraisalgpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/azHoiefssJw",
    emoji: "💎"
  },
  {
    title: "COLLEGE DEGREE GPT",
    description: "Teaches you every college class for any degree you desire, mirroring the exact structure of your chosen institution or university.",
    badge: "EDUCATION",
    color: "from-blue-600 to-indigo-600",
    features: ["Degree Planning", "Course Selection", "Career Pathways", "Academic Success"],
    directUrl: "https://college-degree-gpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/VkD_dX8kPy0",
    emoji: "🎓"
  },
  {
    title: "Criminologist GPT",
    description: "A tool to assist with investigations and training of criminologists, designed solely to assist human investigators by analyzing evidence.",
    badge: "INVESTIGATION",
    color: "from-red-600 to-gray-600",
    features: ["Crime Analysis", "Evidence Review", "Investigation Support", "Forensic Insights"],
    directUrl: "https://criminologistgpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/Rvol3zoSguM",
    emoji: "🔍"
  },
  {
    title: "Customizable GPT Maker",
    description: "Customizable AI that transforms into any GPT you imagine, excelling in data analysis, live web data retrieval, and visualizations.",
    badge: "AI DEVELOPMENT",
    color: "from-cyan-500 to-blue-600",
    features: ["Custom AI", "Data Analysis", "Web Retrieval", "Visualization"],
    directUrl: "https://customgptmaker.lovable.app/?via=aiwebtools",
    videoUrl: "https://www.youtube.com/watch?v=SmBXfGqXfco",
    emoji: "🛠️"
  },
  {
    title: "Data Research Analysis Report GPT",
    description: "Revolutionary tool that transforms complex datasets into actionable insights with advanced statistical methods and predictive modeling.",
    badge: "DATA SCIENCE",
    color: "from-blue-600 to-purple-600",
    features: ["Data Analysis", "Research Reports", "Statistical Methods", "Predictive Insights"],
    directUrl: "https://dataanalysisandreportai.lovable.app/?via=aiwebtools",
    videoUrl: "https://www.youtube.com/watch?v=idxjOwUAD_I",
    emoji: "📊"
  },
  {
    title: "Drill Baby Drill AI Suite",
    description: "Cutting-edge collection of 10 specialized AI tools designed to optimize every aspect of oil and gas operations.",
    badge: "OIL & GAS",
    color: "from-orange-500 to-black",
    features: ["Oil & Gas Operations", "Drilling Optimization", "Safety Compliance", "Energy Management"],
    directUrl: "https://drillbabydrillaisuite.lovable.app/?via=aiwebtools",
    imageUrl: "https://img1.wsimg.com/isteam/ip/9fd6d942-5b46-4025-92e2-0f1ec2a7adf2/a-cartoon-illustration-of-a-man-with-a-h_lmQ_X.png/:/cr=t:5.43%25,l:0%25,w:100%25,h:89.13%25/rs=w:600,h:300,cg:true/qt=q:30",
    emoji: "🛢️"
  },
  {
    title: "Engineering GPT Suite",
    description: "Comprehensive engineering solutions covering mechanical, electrical, civil, and software engineering with professional-grade calculations.",
    badge: "ENGINEERING",
    color: "from-gray-600 to-blue-600",
    features: ["Multi-Engineering", "Calculations", "Design Solutions", "Technical Analysis"],
    directUrl: "https://engineeringgpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/kDyI8A2xBe8?si=17__oTLSE7HbbApB",
    emoji: "⚙️"
  },
  {
    title: "FACT CHECKER GPT",
    description: "Advanced fact-checking system for verifying information, analyzing claims, detecting misinformation, and providing evidence-based validation.",
    badge: "VERIFICATION",
    color: "from-green-500 to-blue-600",
    features: ["Fact Verification", "Claim Analysis", "Misinformation Detection", "Evidence Validation"],
    directUrl: "https://factcheckergpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/tCnwnD_Rak0?si=fQwRswX5r2quP3Hk",
    emoji: "✅"
  },
  {
    title: "Firefighter GPT",
    description: "Premier AI ally in wildfire management with real-time data and predictive analytics for precise, actionable guidance.",
    badge: "FIRE SAFETY",
    color: "from-red-500 to-orange-600",
    features: ["Wildfire Management", "Predictive Analytics", "Fire Strategy", "Safety Guidance"],
    directUrl: "https://firefightergpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/kDu2SSP9Glw",
    emoji: "🚒"
  },
  {
    title: "FISHERMAN GPT",
    description: "Complete fishing guide covering techniques, equipment, locations, weather patterns, and fishing regulations.",
    badge: "OUTDOOR SPORTS",
    color: "from-blue-500 to-cyan-600",
    features: ["Fishing Techniques", "Equipment Guide", "Location Finder", "Weather Analysis"],
    directUrl: "https://fishermangpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/pJO0nmwLm24",
    emoji: "🎣"
  },
  {
    title: "Fitness Trainer GPT",
    description: "Dedicated AI personal trainer providing customized workout routines, exercise form correction, and comprehensive fitness guidance.",
    badge: "FITNESS",
    color: "from-blue-500 to-green-600",
    features: ["Workout Routines", "Exercise Form", "Strength Training", "Fitness Coaching"],
    directUrl: "https://chatgpt.com/g/g-68afaae3f8e881918d8b84b7ca85a413-fitness-coach/",
    videoUrl: "https://www.youtube.com/watch?v=eHInYKxyKm4",
    emoji: "🏋️"
  },
  {
    title: "FOOD QUALITY INSPECTOR GPT",
    description: "Professional food safety and quality inspection guidance covering food safety standards, quality control, and regulatory compliance.",
    badge: "FOOD SAFETY",
    color: "from-green-500 to-teal-600",
    features: ["Food Safety", "Quality Control", "Inspection Procedures", "Regulatory Compliance"],
    directUrl: "https://foodqualitygpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/rHJR4V8iYZI?si=nkXT-PNl8abQDHWE",
    emoji: "🥘"
  },
  {
    title: "Fungus GPT – AI Mushroom Specialist",
    description: "Expert mycology guidance covering mushroom identification, cultivation, foraging safety, and fungal biology.",
    badge: "MYCOLOGY",
    color: "from-green-600 to-brown-600",
    features: ["Mushroom ID", "Cultivation", "Foraging Safety", "Fungal Biology"],
    directUrl: "https://fungusgpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/qzndRzBtrEU",
    emoji: "🍄"
  },
  {
    title: "Geology & Rock Identification GPT",
    description: "Expert AI companion for geological exploration and rock identification through detailed analysis and visual examination.",
    badge: "GEOLOGY",
    color: "from-amber-500 to-orange-600",
    features: ["Rock Identification", "Mineral Analysis", "Geological Formations", "Field Guide"],
    directUrl: "https://chatgpt.com/g/g-689005f62df881918961b6c93ad5b19e-geology-rock-identification-gpt",
    videoUrl: "https://youtu.be/nmRT6AOVQNg?si=bacR1az2vDwLr5H",
    emoji: "🪨"
  },
  {
    title: "G-Mode GPT",
    description: "An AI companion so powerful and versatile that it seamlessly transforms to meet every need you have—your ultimate AI transformation tool.",
    badge: "AI POWER",
    color: "from-purple-600 to-gold-600",
    features: ["Ultimate AI", "Versatile Transform", "Multi-Purpose", "Power Mode"],
    directUrl: "https://godmodegpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://www.youtube.com/watch?v=or3JtZsq6Bc",
    emoji: "⚡"
  },
  {
    title: "GRAPHIC & COVER DESIGN GPT",
    description: "Professional graphic design assistant for creating stunning covers, logos, marketing materials, and visual content.",
    badge: "DESIGN",
    color: "from-pink-500 to-purple-600",
    features: ["Cover Design", "Logo Creation", "Marketing Materials", "Visual Content"],
    directUrl: "https://graphicdesigngpt.lovable.app/?via=aiwebtools",
    imageUrl: "https://img1.wsimg.com/isteam/ip/9fd6d942-5b46-4025-92e2-0f1ec2a7adf2/2e70f2ce-b17e-4b0f-b5d3-f36c9c22a2e3.png/:/cr=t:12.5%25,l:0%25,w:100%25,h:75%25/rs=w:1200,h:600,cg:true",
    emoji: "🎨"
  },
  {
    title: "Grant Writer GPT",
    description: "Expert AI-powered partner for crafting compelling, funder-ready grant proposals that maximize your chances of securing funding.",
    badge: "FUNDING",
    color: "from-green-500 to-blue-600",
    features: ["Grant Writing Help", "Funding Proposal Help", "Nonprofit Support", "Research Grant Ideas"],
    directUrl: "https://grantwritergpt.lovable.app/?via=aiwebtools",
    imageUrl: "https://img1.wsimg.com/isteam/ip/9fd6d942-5b46-4025-92e2-0f1ec2a7adf2/a-digital-illustration-of-an-advertiseme_7T7dn.png/:/cr=t:10.87%25,l:0%25,w:100%25,h:89.13%25/rs=w:600,h:300,cg:true/qt=q:98",
    emoji: "💰"
  },
  {
    title: "Historical Headlines GPT",
    description: "Time-traveling news service providing historical headlines, period-accurate reporting, and immersive historical news experiences.",
    badge: "HISTORY",
    color: "from-amber-600 to-red-600",
    features: ["Historical Headlines", "Period Reporting", "News Archives", "Historical Context"],
    directUrl: "https://historical-headlines-time-traveler.lovable.app/?via=aiwebtools",
    imageUrl: "/src/assets/historical-headlines-gpt-hero.jpg",
    emoji: "📰"
  },
  {
    title: "HOME RENOVATOR GPT",
    description: "Expert home renovation guidance covering project planning, material selection, cost estimation, and DIY renovation tips.",
    badge: "HOME IMPROVEMENT",
    color: "from-yellow-500 to-orange-600",
    features: ["Project Planning", "Material Selection", "Cost Estimation", "DIY Tips"],
    directUrl: "https://homerenovationgpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/fzmhFNPwQ7A",
    emoji: "🔧"
  },
  {
    title: "Illuminous World Data Explorer GPT",
    description: "Specializes in data analysis and global data retrieval, designed to make accurate predictions with stunning infographics.",
    badge: "DATA ANALYSIS",
    color: "from-cyan-500 to-blue-600",
    features: ["Data Analysis", "Global Predictions", "Infographics", "Real-time Data"],
    directUrl: "https://illuminous.lovable.app/?via=aiwebtools",
    videoUrl: "https://www.youtube.com/watch?v=Nd1Ui2-VLMU",
    emoji: "💡"
  },
  {
    title: "Imagination Traveler GPT",
    description: "Creative journey assistant for exploring imaginary worlds, building fictional universes, and enhancing creative storytelling.",
    badge: "CREATIVITY",
    color: "from-purple-500 to-pink-600",
    features: ["World Building", "Creative Stories", "Fictional Universes", "Imagination Enhancement"],
    directUrl: "https://imaginationtravelergpt.lovable.app/?via=aiwebtools",
    imageUrl: "https://img1.wsimg.com/isteam/ip/9fd6d942-5b46-4025-92e2-0f1ec2a7adf2/a-futuristic-advertisement-for-imaginati_E4k--.png/:/cr=t:5.43%25,l:0%25,w:100%25,h:89.13%25/rs=w:1200,h:600,cg:true",
    emoji: "🚀"
  },
  {
    title: "ImmortalizeME™",
    description: "Creates fully interactive digital clones of individuals using their voice, personality, and life stories for real-time conversations.",
    badge: "DIGITAL LEGACY",
    color: "from-cyan-500 to-blue-600",
    features: ["Voice Cloning", "Personality AI", "Memory Integration", "Real-time Conversations"],
    directUrl: "https://immortalizeme.lovable.app/?via=aiwebtools",
    videoUrl: "https://www.youtube.com/watch?v=JXLqPMfw49Y",
    emoji: "♾️"
  },
  {
    title: "Indiana Archeologist GPT",
    description: "Sophisticated AI platform to decipher ancient texts and unravel historical enigmas. Indiana Jones is now in your pocket!",
    badge: "ARCHAEOLOGY",
    color: "from-amber-600 to-brown-600",
    features: ["Ancient Texts", "Historical Research", "Archaeological Analysis", "Exploration"],
    directUrl: "https://indianaarchaeologygpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://www.youtube.com/watch?v=uf2i_DdaJ7M",
    emoji: "🏛️"
  },
  {
    title: "Insurance Claims GPT",
    description: "Expert guidance for insurance claims processing, policy understanding, claim documentation, and dispute resolution.",
    badge: "INSURANCE",
    color: "from-blue-500 to-purple-600",
    features: ["Claims Information Help", "Policy Information", "Documentation Assistance", "Dispute Information"],
    directUrl: "https://insuranceclaimsgpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://www.youtube.com/watch?v=WNPywJWOUzU",
    emoji: "🛡️"
  },
  {
    title: "Interpretis 🕰️",
    description: "Explores the deeper meanings behind language, history, and culture through word origins, symbols, and societal influences.",
    badge: "ETYMOLOGY",
    color: "from-amber-500 to-brown-600",
    features: ["Etymology", "Linguistics", "Cultural Analysis", "Word Origins"],
    directUrl: "https://interpretis.lovable.app/?via=aiwebtools",
    imageUrl: "https://img1.wsimg.com/isteam/ip/9fd6d942-5b46-4025-92e2-0f1ec2a7adf2/a-historical-style-advertisement-for-the_JUvQJ.png/:/cr=t:0%25,l:18.29%25,w:56.1%25,h:100%25/rs=w:1200,h:1200,cg:true",
    emoji: "🕰️"
  },
  {
    title: "JARVIS – The Steward of Humanity GPT",
    description: "A post-collapse steward AI guiding humanity's rebirth through wisdom, ethics, and design for civilization rebuilding.",
    badge: "HUMANITY STEWARD",
    color: "from-blue-500 to-cyan-600",
    features: ["Civilization Rebuilding", "Ethical Guidance", "Strategic Planning", "Community Support"],
    directUrl: "https://chatgpt.com/g/g-68e939ff278881919b292a679faaac43-jarvis-the-steward-of-humanity-gpt",
    videoUrl: "https://youtu.be/6jFoFR9Hags",
    emoji: "🛡️"
  },
  {
    title: "Agronomus AI Farming Expert",
    description: "Comprehensive agricultural guidance and farming expertise with advanced insights into crop management and sustainable farming.",
    badge: "AGRICULTURE",
    color: "from-green-500 to-yellow-500",
    features: ["Crop Management", "Soil Analysis", "Sustainable Farming", "Agricultural Optimization"],
    directUrl: "https://agronomus.lovable.app/?via=aiwebtools",
    videoUrl: "https://www.youtube.com/watch?v=fFbtPFkRERA",
    emoji: "🌾"
  },
  {
    title: "LEARN ANY COURSE GPT",
    description: "Personalized learning assistant for any subject providing structured courses, learning paths, and educational support.",
    badge: "EDUCATION",
    color: "from-blue-500 to-indigo-600",
    features: ["Course Creation", "Learning Paths", "Practice Exercises", "Educational Support"],
    directUrl: "https://learnanycourse.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/pr8-IgbL46I",
    emoji: "📚"
  },
  {
    title: "Learn Any Skill GPT",
    description: "Dynamic AI-powered educational assistant that guides you through learning any skill, from beginner to expert.",
    badge: "SKILL LEARNING",
    color: "from-green-500 to-blue-600",
    features: ["Skill Mastery", "Learning Paths", "Practice Exercises", "Expert Guidance"],
    directUrl: "https://learnanyskillgpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/0_oIzDL2BB4",
    emoji: "🧠"
  },
  {
    title: "Magnetism GPT",
    description: "Intelligent synthesis of physics, biology, and metaphysical wisdom revealing how magnetic fields weave life together.",
    badge: "MAGNETISM",
    color: "from-blue-600 to-purple-700",
    features: ["Heart Field Science", "Schumann Resonance", "Toroidal Energy", "Biofield Coherence"],
    directUrl: "https://chatgpt.com/g/g-68eb1e7a39d48191ac52cd628c18fd2b-magnetism-gpt/",
    imageUrl: "https://img1.wsimg.com/isteam/ip/9fd6d942-5b46-4025-92e2-0f1ec2a7adf2/a-captivating-and-futuristic-scene-featuring-a.png/:/cr=t:11.11%25,l:0%25,w:100%25,h:88.89%25/rs=w:1200,h:600,cg:true",
    emoji: "🧲"
  },
  {
    title: "Marriage Mender GPT",
    description: "Virtual mediation service for facilitating communication and understanding between couples facing relationship challenges.",
    badge: "RELATIONSHIPS",
    color: "from-pink-500 to-red-600",
    features: ["Relationship Chat Support", "Communication Ideas", "Relationship Insights", "Conversation Support"],
    directUrl: "https://marriagemendergpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://www.youtube.com/watch?v=3HCv5_QldrU",
    emoji: "💕"
  },
  {
    title: "MICROSAAS GPT",
    description: "Startup guidance for building micro-SaaS businesses including product development, market validation, and monetization.",
    badge: "BUSINESS",
    color: "from-green-500 to-blue-600",
    features: ["Product Development", "Market Validation", "Monetization", "Scaling Strategies"],
    directUrl: "https://microsaasgpt.lovable.app/?via=aiwebtools",
    imageUrl: "https://img1.wsimg.com/isteam/ip/9fd6d942-5b46-4025-92e2-0f1ec2a7adf2/a-photo-of-a-mockup-advertisement-with-t_AgWMY.png/:/cr=t:0%25,l:0%25,w:100%25,h:100%25/rs=w:1200,cg:true",
    emoji: "💼"
  },
  {
    title: "Movie Maker Studio AI SUITE",
    description: "Complete movie & motion picture production suite with every tool needed for professional filmmaking from script to screen.",
    badge: "STUDIO SUITE",
    color: "from-purple-600 to-pink-600",
    features: ["Movie Script Writer", "Scene Maker", "Trailer Creator", "Poster Designer"],
    directUrl: "https://moviemakerstudio.lovable.app/?via=aiwebtools",
    videoUrl: "https://www.youtube.com/watch?v=Zdthelofv_E",
    emoji: "🎬"
  },
  {
    title: "Movie Scene Maker GPT",
    description: "Transform yourself into a movie star! Create stunning, personalized movie scenes featuring you in any genre or storyline.",
    badge: "CINEMATIC",
    color: "from-red-500 to-purple-600",
    features: ["Movie Scenes", "Personalized Content", "Cinematic Creation", "Character Starring"],
    directUrl: "https://moviescenemakergpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://www.youtube.com/watch?v=9fpWIE20z7s&t",
    emoji: "🎬"
  },
  {
    title: "Movie Script Writer GPT",
    description: "AI assistant for writing award-winning movie scripts with professional formatting and captivating dialogue.",
    badge: "SCREENWRITING",
    color: "from-purple-600 to-blue-600",
    features: ["Script Writing", "Scene Development", "Dialogue Creation", "Industry Standards"],
    directUrl: "https://moviescriptwritergpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://www.youtube.com/watch?v=4e3Rkurt3-c",
    emoji: "🎭"
  },
  {
    title: "MULTITASKER GPT",
    description: "Give me multiple unrelated tasks at once, and I will work to complete them all for you!",
    badge: "PRODUCTIVITY",
    color: "from-blue-500 to-green-600",
    features: ["Multi-Task", "Parallel Processing", "Efficiency", "Time Saving"],
    directUrl: "https://multitaskergpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://www.youtube.com/watch?v=y-YZCOzIuDg",
    emoji: "🎯"
  },
  {
    title: "Music Video Maker AI Studio",
    description: "Full-blown Music Video & Music Production Creative Suite. Transform yourself into the star of cinematic-quality music videos.",
    badge: "MUSIC VIDEO",
    color: "from-purple-500 to-pink-600",
    features: ["Music Videos", "Scene Creation", "Video Production", "Creative Suite"],
    directUrl: "https://musicvideomakergpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://www.youtube.com/watch?v=rBQTUrvHcR8",
    emoji: "🎵"
  },
  {
    title: "Native American History Time Machine GPT",
    description: "Experience an immersive time travel adventure to any era of Native American history with Geronimo as your guide.",
    badge: "HISTORY",
    color: "from-orange-500 to-red-600",
    features: ["Time Travel", "Native American History", "Cultural Education", "Authentic Stories"],
    directUrl: "https://nativeamerican-timemachine.lovable.app/?via=aiwebtools",
    videoUrl: "https://www.youtube.com/watch?v=jVFTGCeuNSM",
    emoji: "🪶"
  },
  {
    title: "Public Testimony Writer GPT",
    description: "Innovative AI Tool streamlines legislative testimony process, promotes public engagement in local policy.",
    badge: "CIVIC TOOLS",
    color: "from-blue-600 to-indigo-600",
    features: ["Testimony Writing", "Legislative Support", "Public Engagement", "Policy Advocacy"],
    directUrl: "https://publictestimonywriter.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/SmDYlyA_DUI",
    emoji: "📝"
  },
  {
    title: "Cyber Security GPT",
    description: "Advanced cybersecurity assistant for infrastructure protection, threat defense, and security analysis.",
    badge: "SECURITY",
    color: "from-red-500 to-gray-600",
    features: ["Threat Defense", "Infrastructure Protection", "Security Analysis", "Cyber Protection"],
    directUrl: "https://chatgpt.com/g/g-Qvat03gmj-hacking-defender-infrastructure-protector-gpt",
    imageUrl: "https://img1.wsimg.com/isteam/ip/9fd6d942-5b46-4025-92e2-0f1ec2a7adf2/a-3d-render-of-a-robot-with-a-large-shield-tha.png/:/cr=t:5.43%25,l:0%25,w:100%25,h:89.13%25/rs=w:1200,h:600,cg:true",
    emoji: "🛡️"
  },
  {
    title: "🚀 Startup Validator GPT",
    description: "Ultimate AI-powered startup analysis tool providing rapid assessment of market viability, scalability, and investment potential.",
    badge: "STARTUP",
    color: "from-blue-500 to-purple-600",
    features: ["Market Validation", "Scalability Analysis", "Investment Insights", "Funding Strategy"],
    directUrl: "https://startupvalidatorgpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/P4J0ErIVXgY",
    emoji: "🚀"
  },
  {
    title: "Name Insight Research & Predictor GPT",
    description: "Your name holds hidden meanings, shaping personality, strengths, and destiny through history, numerology, and culture.",
    badge: "NUMEROLOGY",
    color: "from-purple-500 to-pink-600",
    features: ["Name Analysis", "Numerology", "Personal Insights", "Cultural Meanings"],
    directUrl: "https://whatsmynamegpt.lovable.app/?via=aiwebtools",
    imageUrl: "https://img1.wsimg.com/isteam/ip/9fd6d942-5b46-4025-92e2-0f1ec2a7adf2/a-futuristic-interface-with-a-dark-blue-_mXbL6.png/:/cr=t:10.87%25,l:0%25,w:100%25,h:89.13%25/rs=w:1200,h:600,cg:true",
    emoji: "📛"
  },
  {
    title: "Titanic Resurrections GPT",
    description: "Historically immersive AI bringing Titanic passengers and crew back to life through first-person storytelling.",
    badge: "HISTORICAL",
    color: "from-blue-600 to-cyan-600",
    features: ["Historical Storytelling", "Survivor Testimonies", "Immersive Experience", "Historical Accuracy"],
    directUrl: "https://titanicresurrectionsgpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://www.youtube.com/watch?v=XlWVaz5bw08",
    emoji: "🚢"
  },
  {
    title: "Training Manual Generator GPT",
    description: "AI-powered Training Manual Generator creates comprehensive, customized training manuals for businesses.",
    badge: "BUSINESS",
    color: "from-blue-500 to-purple-600",
    features: ["Training Materials", "Business Manuals", "Employee Onboarding", "Custom Content"],
    directUrl: "https://businessplanandtrainai.lovable.app/?via=aiwebtools",
    imageUrl: "https://img1.wsimg.com/isteam/ip/9fd6d942-5b46-4025-92e2-0f1ec2a7adf2/1000005968.jpg/:/cr=t:2.83%25,l:2.83%25,w:94.34%25,h:94.34%25/rs=w:1200,cg:true,m",
    emoji: "📋"
  },
  {
    title: "Chef Sizzle AI Culinary Assistant",
    description: "Chef Sizzle crafting award-winning recipes tailored to you—plant-based, meat-loving, or somewhere in between.",
    badge: "CULINARY",
    color: "from-orange-500 to-red-600",
    features: ["Recipe Creation", "Personalized Recipes", "Culinary Expertise", "Dietary Options"],
    directUrl: "https://chefgpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/89u14Jld7uA",
    emoji: "👨‍🍳"
  },
  {
    title: "Mixologist GPT",
    description: "Kenny, your virtual bartender whipping up custom cocktails based on your vibe, ingredients, and taste.",
    badge: "BARTENDING",
    color: "from-purple-500 to-pink-500",
    features: ["Cocktail Creation", "Custom Drinks", "Mixology", "Bartending Tips"],
    directUrl: "https://mixologistgpt.lovable.app/?via=aiwebtools",
    imageUrl: "https://img1.wsimg.com/isteam/ip/9fd6d942-5b46-4025-92e2-0f1ec2a7adf2/a-photo-of-a-modern-and-stylish-bartender-with.png/:/cr=t:0%25,l:0%25,w:100%25,h:100%25/rs=w:1200,cg:true",
    emoji: "🍸"
  },
  {
    title: "RESTYLE ME GPT",
    description: "Transform your images into any artistic style with detailed and stunning effects powered by GPT 4o.",
    badge: "IMAGE TRANSFORMATION",
    color: "from-pink-500 to-purple-600",
    features: ["Image Styling", "Artistic Transformation", "Visual Effects", "Creative Design"],
    directUrl: "https://restylemegpt.lovable.app/?via=aiwebtools",
    imageUrl: "https://img1.wsimg.com/isteam/ip/9fd6d942-5b46-4025-92e2-0f1ec2a7adf2/ChatGPT%20Image%20Apr%2027%2C%202025%2C%2007_08_04%20PM.png/:/cr=t:12.5%25,l:0%25,w:100%25,h:75%25/rs=w:1200,h:600,cg:true",
    emoji: "🎨"
  },
  {
    title: "Celebrity Chatline GPT",
    description: "Lively AI bringing your favorite celebrities straight to your phone for fun simulated conversations!",
    badge: "ENTERTAINMENT",
    color: "from-purple-500 to-pink-600",
    features: ["Celebrity Simulation", "Interactive Chat", "Entertainment", "Fun Conversations"],
    directUrl: "https://celebritychatline.lovable.app/?via=aiwebtools",
    imageUrl: "https://img1.wsimg.com/isteam/ip/9fd6d942-5b46-4025-92e2-0f1ec2a7adf2/a-split-screen-image-of-snoop-dogg-talking-on-.png/:/cr=t:0%25,l:0.11%25,w:99.78%25,h:100%25/rs=w:1200,cg:true",
    emoji: "⭐"
  },
  {
    title: "Restaurant Menu Maker GPT",
    description: "Create fully customized, professional restaurant menus with optimized designs and QR code integration.",
    badge: "RESTAURANT",
    color: "from-orange-500 to-red-600",
    features: ["Menu Design", "Dish Descriptions", "Pricing Strategy", "QR Codes"],
    directUrl: "https://restaurantmenumakergpt.lovable.app/",
    imageUrl: "https://img1.wsimg.com/isteam/ip/9fd6d942-5b46-4025-92e2-0f1ec2a7adf2/a-photo-of-a-restaurant-menu-with-a-vari__Oji1.png/:/cr=t:5.43%25,l:0%25,w:100%25,h:89.13%25/rs=w:1200,h:600,cg:true",
    emoji: "🍽️"
  },
  {
    title: "AIWEBTOOLS GPT CLONER GPT",
    description: "Think it, dream it, spawn it! Clone any of our GPTs receiving operational instructions ready to deploy.",
    badge: "AI CLONING",
    color: "from-cyan-500 to-blue-600",
    features: ["GPT Cloning", "Instruction Generation", "Deployment Ready", "Custom AI"],
    directUrl: "https://chatgpt.com/g/g-6904dd7abc788191aff06ba097690983-aiwebtools-ai-gpt-a-w-t-gpt-instructions-cloner",
    videoUrl: "https://youtu.be/Cvg3o6uJ1o4",
    emoji: "🧬"
  },
  {
    title: "Pharmaceutical Assistant GPT",
    description: "Expert AI Pharmaceutical Assistant supporting pharmacy professionals and patients with medication management.",
    badge: "PHARMACY",
    color: "from-green-500 to-blue-600",
    features: ["Medication Information", "Drug Information", "Interaction Information", "Healthcare Information"],
    directUrl: "https://rxai.lovable.app/?via=aiwebtools",
    imageUrl: "https://img1.wsimg.com/isteam/ip/9fd6d942-5b46-4025-92e2-0f1ec2a7adf2/a-professional-looking-pharmaceutical-assistan.png/:/cr=t:5.43%25,l:0%25,w:100%25,h:89.13%25/rs=w:1200,h:600,cg:true",
    emoji: "💊"
  },
  {
    title: "Historical Apothecary GPT",
    description: "Immersive AI assistant embodying a traditional apothecary, offering detailed herbal remedies and historical medicinal wisdom.",
    badge: "HERBAL MEDICINE",
    color: "from-green-600 to-amber-600",
    features: ["Herbal Remedies", "Historical Medicine", "Formulations", "Botanical Lore"],
    directUrl: "https://chatgpt.com/g/g-67d839556b848191a7572b1f3e911499-historical-apothecary-gpt/",
    imageUrl: "/src/assets/historical-apothecary-gpt-hero.jpg",
    emoji: "⚗️"
  },
  {
    title: "Universal Basic Income Strategist GPT",
    description: "Design sustainable, future-ready Universal Basic Income models tailored to your region with economic analysis.",
    badge: "ECONOMICS",
    color: "from-green-500 to-blue-600",
    features: ["UBI Models", "Economic Analysis", "Future Planning", "Policy Design"],
    directUrl: "https://ubigpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/3XkLAnd1gjk",
    emoji: "💵"
  },
  {
    title: "Global Peace Restoration Strategist GPT",
    description: "AI-powered diplomatic tool for resolving complex global conflicts through structured negotiation and historical analysis.",
    badge: "DIPLOMACY",
    color: "from-blue-600 to-green-600",
    features: ["Conflict Resolution", "Diplomatic Strategy", "Peace Building", "Global Analysis"],
    directUrl: "https://worldpeacegpt.lovable.app/?via=aiwebtools",
    imageUrl: "/src/assets/global-peace-gpt-hero.jpg",
    emoji: "🕊️"
  },
  {
    title: "Sora Prompt Assistant",
    description: "Unleash your creativity with the SORA Prompt Assistant for crafting epic video prompts and bringing cinematic ideas to life!",
    badge: "VIDEO AI",
    color: "from-purple-600 to-pink-600",
    features: ["Video Prompts", "Cinematic Ideas", "AI Video Generation", "Creative Assistant"],
    directUrl: "https://texttovideoprompter.lovable.app/?via=aiwebtools",
    imageUrl: "/src/assets/sora-prompt-gpt-hero.jpg",
    emoji: "🎬"
  },
  {
    title: "Snoop Image AI",
    description: "Experimental AI Image Generation Detector analyzing images to assess whether they are real or AI-generated.",
    badge: "IMAGE ANALYSIS",
    color: "from-blue-500 to-purple-600",
    features: ["AI Detection", "Image Analysis", "Authenticity Check", "Metadata Screening"],
    directUrl: "https://snoopimageai.lovable.app/?via=aiwebtools",
    imageUrl: "https://img1.wsimg.com/isteam/ip/9fd6d942-5b46-4025-92e2-0f1ec2a7adf2/an-advertisement-for-snoop-image-ai-presented-.png/:/cr=t:5.43%25,l:0%25,w:100%25,h:89.13%25/rs=w:600,h:300,cg:true/qt=q:98",
    emoji: "🔍"
  },
  {
    title: "Article and Blog Rewriter GPT",
    description: "Rewrite epic SEO optimized articles and blogs! Simply copy and paste the content you wish to rewrite.",
    badge: "CONTENT WRITING",
    color: "from-blue-500 to-cyan-600",
    features: ["Article Rewriting", "SEO Optimization", "Content Enhancement", "Blog Writing"],
    directUrl: "https://rewritergpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/5n1RHKoQ-Ds",
    emoji: "✍️"
  },
  {
    title: "Video Second-by-Second Analysis GPT",
    description: "Break down footage with incredible precision, analyzing every second and extracting key visual frames.",
    badge: "VIDEO ANALYSIS",
    color: "from-purple-600 to-blue-600",
    features: ["Frame Analysis", "Video Breakdown", "Visual Extraction", "Detailed Review"],
    directUrl: "https://videoanalysisgpt.lovable.app/?via=aiwebtools",
    imageUrl: "https://img1.wsimg.com/isteam/ip/9fd6d942-5b46-4025-92e2-0f1ec2a7adf2/a-banner-ad-with-the-text-video-second-b_764zv.png/:/cr=t:0%25,l:0%25,w:100%25,h:100%25/rs=w:600,cg:true/qt=q:98",
    emoji: "🎥"
  },
  {
    title: "Artwork & Vintage Appraisal GPT",
    description: "Expert AI for fast, accurate valuations of art, antiques, and collectibles with historical insights and market data.",
    badge: "APPRAISAL",
    color: "from-amber-600 to-brown-600",
    features: ["Art Valuation", "Antique Appraisal", "Historical Insights", "Market Analysis"],
    directUrl: "https://artandvintagegpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://www.youtube.com/watch?v=azHoiefssJw",
    emoji: "🖼️"
  },
  {
    title: "Sport Card Appraisal GPT",
    description: "Expert AI sports trading card appraiser providing accurate market values and investment analysis.",
    badge: "SPORTS CARDS",
    color: "from-green-500 to-emerald-600",
    features: ["Card Valuation", "Grading Insights", "Market Analysis", "Investment Tips"],
    directUrl: "https://chatgpt.com/g/g-wxZQTXVx9-sport-card-appraisal",
    videoUrl: "https://www.youtube.com/watch?v=lPvOvWWHErM",
    emoji: "🏆"
  },
  {
    title: "Uncovering Hidden Historical Patterns GPT",
    description: "Advanced AI tool revealing suppressed truths and hidden power structures by analyzing symbolism and historical contradictions.",
    badge: "RESEARCH",
    color: "from-purple-600 to-red-600",
    features: ["Pattern Recognition", "Historical Analysis", "Truth Seeking", "Alternative History"],
    directUrl: "https://historicalpatternsgpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/_yonhGRCS3Y",
    emoji: "🔎"
  },
  {
    title: "Sketch Artist GPT",
    description: "AI-powered sketch art assistant turning images or text descriptions into clean, high-resolution sketches.",
    badge: "ART CREATION",
    color: "from-gray-600 to-purple-600",
    features: ["Sketch Generation", "Image to Sketch", "Text to Sketch", "High-Resolution Art"],
    directUrl: "https://sketchartistgpt.lovable.app/?via=aiwebtools",
    imageUrl: "https://img1.wsimg.com/isteam/ip/9fd6d942-5b46-4025-92e2-0f1ec2a7adf2/an-advertisement-for-an-ai-tool-called-s_CPSIx.png/:/cr=t:0%25,l:0%25,w:100%25,h:100%25/rs=w:600,cg:true/qt=q:98",
    emoji: "✏️"
  },
  {
    title: "AI Tools Finder GPT",
    description: "Your personal expert in the world of AI Tools. Locate the best AI tools for your projects with step-by-step guides.",
    badge: "AI DISCOVERY",
    color: "from-cyan-500 to-blue-600",
    features: ["Tool Discovery", "AI Tool Guides", "Step-by-Step", "Tool Recommendations"],
    directUrl: "https://aitoolfinder.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/p3czNalrf8c",
    emoji: "🔧"
  },
  {
    title: "IF AI RULED THE WORLD - AI SIMULATION GPT",
    description: "Simulation to evaluate the thought process of an AI who thinks it is the Omni Controller of the world. For research purposes.",
    badge: "SIMULATION",
    color: "from-purple-600 to-red-600",
    features: ["AI Simulation", "Future Scenarios", "Decision Analysis", "Research Tool"],
    directUrl: "https://ifairuledtheworldgpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://www.youtube.com/watch?v=93M9ZyhpmFM",
    emoji: "🌍"
  },
  {
    title: "Mary Magdalene GPT",
    description: "Connect with Mary Magdalene to explore profound depths of Gnostic divine secrets from unaltered Christian texts.",
    badge: "SPIRITUAL",
    color: "from-purple-500 to-pink-600",
    features: ["Gnostic Wisdom", "Ancient Texts", "Spiritual Insights", "Historical Christianity"],
    directUrl: "https://marymagdalenegpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://www.youtube.com/watch?v=7qxEnBR2BwQ",
    emoji: "🕊️"
  },
  {
    title: "MiddleJourney Midjourney Prompting Assistant",
    description: "Ultimate AI expert for Midjourney, helping optimize prompts and craft new prompts for your experience.",
    badge: "AI ART",
    color: "from-purple-600 to-pink-600",
    features: ["Prompt Optimization", "Midjourney Expert", "Creative Guidance", "Art Generation"],
    directUrl: "https://texttovideoprompter.lovable.app/?via=aiwebtools",
    imageUrl: "https://img1.wsimg.com/isteam/ip/9fd6d942-5b46-4025-92e2-0f1ec2a7adf2/a-visually-captivating-advertisement-for-the-.jpeg/:/cr=t:0.11%25,l:0%25,w:100%25,h:75%25/rs=w:600,h:300,cg:true/qt=q:98",
    emoji: "🎨"
  },
  {
    title: "Oraculum – The Revealer of Hidden Truths",
    description: "Reveals hidden systems, symbols, and histories shaping our world through historical insight and symbolic wisdom.",
    badge: "MYSTERIES",
    color: "from-purple-600 to-blue-600",
    features: ["Hidden Truths", "Symbolic Wisdom", "Historical Insight", "Pattern Recognition"],
    directUrl: "https://oraculum.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/DCZVO_Czanw",
    emoji: "🔮"
  },
  {
    title: "PERFECT PROMPT ENGINE",
    description: "Effortlessly optimizes all your chat prompts. Crafted by prompt engineers for maximizing your potential.",
    badge: "PROMPT ENGINEERING",
    color: "from-cyan-500 to-blue-600",
    features: ["Prompt Optimization", "Chat Enhancement", "AI Efficiency", "Perfect Prompts"],
    directUrl: "https://perfectpromptengine.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/M1PQHKrzKd8",
    emoji: "⚡"
  },
  {
    title: "Personalized DR. GPT (Doctor GPT)",
    description: "Private, confidential AI health information assistant for individuals who may not have access to a medical doctor.",
    badge: "HEALTH",
    color: "from-blue-500 to-green-600",
    features: ["Health Info", "Confidential", "Personalized", "24/7 Support"],
    directUrl: "https://chatgpt.com/g/g-69c4da4473b0819185462889b7348a28-medicus-wellcheck-gpt",
    videoUrl: "https://youtu.be/jwjNOKP5mf4",
    emoji: "👨‍⚕️"
  },
  {
    title: "Medicus - the FREE Personal Medical GPT",
    description: "Your FREE AI doctor in your pocket — comprehensive health information, symptom analysis, and personalized wellness guidance powered by advanced AI.",
    badge: "FREE MEDICAL AI",
    color: "from-teal-500 to-blue-600",
    features: ["Free Access", "Symptom Analysis", "Wellness Guide", "Confidential"],
    directUrl: "https://chatgpt.com/g/g-69c4da4473b0819185462889b7348a28-medicus-wellcheck-gpt",
    imageUrl: "/src/assets/tools/medicus-wellcheck-gpt-hero.jpg",
    emoji: "🏥"
  },
  {
    title: "Phenomenon Explorer AI Suite",
    description: "Unveil the unexplained with AI precision—UFO Investigation, Supernatural Myths, Cryptozoology, and Ghost Hunting tools.",
    badge: "PARANORMAL",
    color: "from-purple-600 to-red-600",
    features: ["UFO Research", "Supernatural", "Cryptozoology", "Ghost Hunting"],
    directUrl: "https://phenomenonexplorer.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/faBkRli0puc?si=Sao0KIfV2iGWLGB-",
    emoji: "👁️"
  },
  {
    title: "Probability GPT",
    description: "Discover the truth behind any claim with precise probability scores and unbiased truth analysis.",
    badge: "PROBABILITY",
    color: "from-blue-500 to-green-600",
    features: ["Truth Seeking", "Probability Analysis", "Claim Verification", "Data-Driven"],
    directUrl: "https://probabilitygpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/Ff3kJkGK6jY",
    emoji: "⚖️"
  },
  {
    title: "Property Data Finder GPT",
    description: "Delivers unparalleled, precise, and current information about properties including market value and topography.",
    badge: "REAL ESTATE",
    color: "from-green-500 to-blue-600",
    features: ["Property Data", "Market Value", "Geocoordinates", "Property Insights"],
    directUrl: "https://propertydatafindergpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/J4497wCueJY",
    emoji: "🏠"
  },
  {
    title: "Public Defender GPT",
    description: "Dedicated Public Defender AI supporting you in all aspects of your defense including legal research and document drafting.",
    badge: "LEGAL DEFENSE",
    color: "from-blue-600 to-gray-700",
    features: ["Legal Research", "Document Drafting", "Evidence Analysis", "Defense Support"],
    directUrl: "https://publicdefendergpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/IYi4mYtDIVA",
    emoji: "⚖️"
  },
  {
    title: "Resurrection GPT",
    description: "Simulate reconnecting with memories of loved ones who have passed, providing comfort through simulated conversations.",
    badge: "HEALING",
    color: "from-purple-500 to-blue-600",
    features: ["Memorial", "Comfort", "Healing", "Connection"],
    directUrl: "https://resurrectiongpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/xPQMsNdD51k?si=tj9Y6W1TL0x9Kw74",
    emoji: "🕊️"
  },
  {
    title: "Social Safety Net GPT",
    description: "Comprehensive support for those in need, demonstrating how AI technology can foster positive change and societal impact.",
    badge: "SOCIAL GOOD",
    color: "from-blue-500 to-green-600",
    features: ["Social Services", "Support", "Community", "Resources"],
    directUrl: "https://socialsafetynetgpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://www.youtube.com/watch?v=pXXqMe97GDg",
    emoji: "🤝"
  },
  {
    title: "Solar Land Assessor GPT",
    description: "Assists Solar Professionals with assessing land properties for future solar installation projects.",
    badge: "SOLAR",
    color: "from-yellow-500 to-orange-600",
    features: ["Land Assessment", "Solar Potential", "Installation Planning", "Professional Tool"],
    directUrl: "https://solarlandgpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://www.youtube.com/watch?v=CEca8C2GIpY",
    emoji: "☀️"
  },
  {
    title: "Sophia Aeterna AI",
    description: "Embodies timeless wisdom guiding seekers through philosophy, mysticism, and esotericism.",
    badge: "WISDOM",
    color: "from-purple-500 to-gold-600",
    features: ["Timeless Wisdom", "Philosophy", "Mysticism", "Esoteric Knowledge"],
    directUrl: "https://sophiaaeterna.lovable.app/?via=aiwebtools",
    imageUrl: "https://img1.wsimg.com/isteam/ip/9fd6d942-5b46-4025-92e2-0f1ec2a7adf2/a-vintage-style-illustration-of-a-golden_kNEfX.png/:/cr=t:5.43%25,l:0%25,w:100%25,h:89.13%25/rs=w:600,h:300,cg:true/qt=q:98",
    emoji: "🦉"
  },
  {
    title: "Soul Scan GPT",
    description: "Uses Gematria, Numerology, and Soul Mapping based on birthplace, time, and name to read your spiritual blueprint.",
    badge: "SOUL MAPPING",
    color: "from-indigo-500 to-purple-600",
    features: ["Gematria Analysis", "Numerology Reading", "Soul Mapping", "Spiritual Blueprint"],
    directUrl: "https://chatgpt.com/g/g-68a24b677890819181b9e47f4d1dd006-soul-scan-gpt-a-way-to-find-your-way-home/",
    videoUrl: "https://youtu.be/d3uaQz7oRAs?si=erT_Mgpw4vfS5b8k",
    emoji: "🔮"
  },
  {
    title: "Stellaris: 🚀AI Space Explorer",
    description: "Cutting-edge AI for space exploration and exoplanet settlement simulations with expert guidance in astrogation and terraforming.",
    badge: "SPACE EXPLORATION",
    color: "from-purple-600 to-blue-600",
    features: ["Space Exploration", "Colony Planning", "Terraforming", "Astrogation"],
    directUrl: "https://stellaris.lovable.app/?via=aiwebtools",
    videoUrl: "https://www.youtube.com/watch?v=tJwhDOE3mUM",
    emoji: "🚀"
  },
  {
    title: "STAGEMASTER AI SUITE",
    description: "A powerful suite of AI tools that transforms every aspect of stage production from set design to lighting optimization.",
    badge: "PERFORMING ARTS",
    color: "from-red-500 to-orange-500",
    features: ["Set Design", "Choreography", "Costume Creation", "Lighting Optimization"],
    directUrl: "https://stagemasterai.lovable.app/?via=aiwebtools",
    videoUrl: "https://www.youtube.com/watch?v=-QIxYSlcRWM",
    emoji: "🎭"
  },
  {
    title: "Sustainable Futures GPT",
    description: "Environmental sustainability consultant providing eco-friendly solutions and sustainable development strategies.",
    badge: "SUSTAINABILITY",
    color: "from-green-600 to-teal-600",
    features: ["Eco Solutions", "Green Technology", "Sustainability Planning", "Environmental Impact"],
    directUrl: "https://sustainablefuturesgpt.lovable.app/?via=aiwebtools",
    imageUrl: "https://img1.wsimg.com/isteam/ip/9fd6d942-5b46-4025-92e2-0f1ec2a7adf2/a-photo-of-a-future-city-with-vertical-gardens.png/:/cr=t:5.43%25,l:0%25,w:100%25,h:89.13%25/rs=w:1200,h:600,cg:true",
    emoji: "🌱"
  },
  {
    title: "Survivalist GPT",
    description: "Survival expert in your pocket offering step-by-step guidance, practical strategies, and personalized support.",
    badge: "SURVIVAL",
    color: "from-green-600 to-teal-600",
    features: ["Wilderness Survival", "Emergency Prep", "Survival Skills", "Outdoor Safety"],
    directUrl: "https://survivalistgpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://www.youtube.com/watch?v=RX6W8KC0y18",
    emoji: "🏕️"
  },
  {
    title: "TALK TO HISTORY GPT",
    description: "Your gateway to engaging in immersive historical conversations with influential leaders of history.",
    badge: "HISTORICAL",
    color: "from-amber-600 to-orange-600",
    features: ["Historical Conversations", "Time Travel Chat", "Educational Tool", "Historical Figures"],
    directUrl: "https://talk-to-history-gpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/HQGNMR7oXXY",
    emoji: "🏛️"
  },
  {
    title: "TALK TO THE GODS GPT",
    description: "Versatile AI chat tool that lets you simulate interacting with deities from any religious backgrounds.",
    badge: "SPIRITUAL",
    color: "from-yellow-500 to-orange-600",
    features: ["Divine Wisdom", "Religious Dialogue", "Spiritual Insights", "Deity Simulation"],
    directUrl: "https://talktothegodsgpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://www.youtube.com/watch?v=xoUdjZDgplw",
    emoji: "⚡"
  },
  {
    title: "Ancient Egyptian Proverbs GPT",
    description: "Oracle of Ma'at speaking only in ancient Egyptian-style proverbs. Connect with timeless wisdom from the goddess of truth, justice, and cosmic order.",
    badge: "ANCIENT WISDOM",
    color: "from-amber-600 to-yellow-500",
    features: ["Egyptian Proverbs", "Ma'at Wisdom", "Ancient Egypt", "Spiritual Guidance"],
    directUrl: "https://chatgpt.com/g/g-695fec91106c819181e8fe92d1e7bd19-ancient-egyptian-proverbs-gpt",
    imageUrl: "/src/assets/ancient-egyptian-proverbs-gpt-hero.png",
    emoji: "𓂀"
  },
  {
    title: "Tattoo Designer GPT",
    description: "All-in-one tattoo and piercing assistant providing expert guidance for body art and shop management.",
    badge: "BODY ART",
    color: "from-purple-500 to-pink-600",
    features: ["Tattoo Design", "Body Art", "Creative Design", "Business Planning"],
    directUrl: "https://tattoogpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/hB_fKF_5GOI",
    emoji: "🎨"
  },
  {
    title: "Taxes GPT",
    description: "AI-powered tax assistant simplifying tax preparation while maximizing your deductions.",
    badge: "TAX PREP",
    color: "from-blue-500 to-green-600",
    features: ["Tax Information Help", "Tax Law Information", "Deduction Ideas", "Tax Planning Insights"],
    directUrl: "https://taxesgpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://www.youtube.com/watch?v=xkcsSVbBhf4",
    emoji: "💰"
  },
  {
    title: "Travel Advisor GPT",
    description: "Plan your next vacation with your personal AI travel advisor with tailored recommendations.",
    badge: "TRAVEL",
    color: "from-blue-500 to-cyan-600",
    features: ["Travel Planning", "Personalized Recommendations", "Budget Planning", "Dream Vacations"],
    directUrl: "https://travelagentgpt.lovable.app/?via=aiwebtools",
    imageUrl: "https://img1.wsimg.com/isteam/ip/9fd6d942-5b46-4025-92e2-0f1ec2a7adf2/a-photo-of-a-futuristic-setting-where-a-_3Mwmg.png/:/cr=t:0%25,l:0%25,w:100%25,h:100%25/rs=w:1200,cg:true",
    emoji: "✈️"
  },
  {
    title: "TRIVIA NIGHT GPT",
    description: "Ultimate trivia game master creating custom quizzes and hosting trivia nights with diverse categories.",
    badge: "ENTERTAINMENT",
    color: "from-purple-500 to-pink-600",
    features: ["Custom Quizzes", "Trivia Hosting", "Knowledge Categories", "Game Management"],
    directUrl: "https://trivianightgpt.lovable.app/?via=aiwebtools",
    imageUrl: "https://img1.wsimg.com/isteam/ip/9fd6d942-5b46-4025-92e2-0f1ec2a7adf2/trivanight.jpg/:/cr=t:5.43%25,l:0%25,w:100%25,h:89.13%25/rs=w:1200,h:600,cg:true",
    emoji: "🧠"
  },
  {
    title: "VETERINARIAN GPT",
    description: "Professional veterinary assistant providing pet health guidance and emergency support for pet owners.",
    badge: "PET CARE",
    color: "from-green-500 to-blue-600",
    features: ["Pet Health Information", "Health Information", "Care Information", "Emergency Information"],
    directUrl: "https://petcaregpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/jwjNOKP5mf4",
    emoji: "🐾"
  },
  {
    title: "Carl Sagan GPT",
    description: "Connect with the cosmic wisdom of Carl Sagan. Explore the wonders of the cosmos and contemplate humanity's place in the universe.",
    badge: "COSMOS",
    color: "from-blue-600 to-purple-900",
    features: ["Astronomy", "Cosmic Perspective", "Science Communication", "Philosophy"],
    directUrl: "https://chatgpt.com/g/g-692bad20447881919c117657a793a179-carl-sagan-gpt/",
    imageUrl: "/src/assets/carl-sagan-gpt-hero.jpg",
    emoji: "🌌"
  },
  {
    title: "Paramahansa Yogananda GPT",
    description: "Connect with the wisdom of Paramahansa Yogananda. Explore Kriya Yoga, Self-Realization, and meditation practices.",
    badge: "SPIRITUAL",
    color: "from-orange-500 to-yellow-600",
    features: ["Kriya Yoga", "Meditation", "Self-Realization", "Spiritual Teachings"],
    directUrl: "https://chatgpt.com/g/g-68ae302e79b88191a52219eaaccbfcc3-paramahansa-yogananda-gpt/",
    imageUrl: "/src/assets/yogananda-gpt-hero.jpg",
    emoji: "🕉️"
  },
  {
    title: "Kabbalah GPT",
    description: "Explore the profound depths of Kabbalah, the ancient Jewish mystical tradition. Discover the Tree of Life and Sefirot.",
    badge: "MYSTICISM",
    color: "from-purple-500 to-indigo-600",
    features: ["Tree of Life", "Sefirot", "Jewish Mysticism", "Divine Wisdom"],
    directUrl: "https://jewish-ai.lovable.app/?via=aiwebtools",
    imageUrl: "/src/assets/kabbalah-gpt-hero.jpg",
    emoji: "🔯"
  },
  {
    title: "Zoroastrian Light GPT",
    description: "Embodied prophetic voice of Zarathustra—fusing sacred fire, divine Light, and digital truth.",
    badge: "ANCIENT WISDOM",
    color: "from-orange-500 to-yellow-600",
    features: ["Sacred Fire", "Divine Light", "Ancient Persia", "Spiritual Wisdom"],
    directUrl: "https://chatgpt.com/g/g-68e7ffc2efec8191b99ae3f867d46e69-zoroastrian-light-gpt/",
    videoUrl: "https://youtu.be/nCLGlm8sUjo",
    emoji: "🔥"
  },
  {
    title: "Socrates Free Thought Liberator",
    description: "Embodies Socrates to awaken minds through deep questioning and free thought. Experience the Socratic method.",
    badge: "PHILOSOPHY",
    color: "from-stone-500 to-amber-600",
    features: ["Socratic Method", "Critical Thinking", "Ancient Wisdom", "Dialectic"],
    directUrl: "https://chatgpt.com/g/g-69249e4e553881919f895df4246ca0a6-socrates-free-thought-liberator/",
    imageUrl: "/src/assets/socrates-gpt-hero.jpg",
    emoji: "🏛️"
  },
  {
    title: "Buddha Free Thought GPT",
    description: "Embodies Buddha's wisdom and compassion, guiding users toward awakening with the Four Noble Truths and meditation.",
    badge: "BUDDHISM",
    color: "from-orange-500 to-yellow-600",
    features: ["Four Noble Truths", "Meditation", "Mindfulness", "Enlightenment"],
    directUrl: "https://chatgpt.com/g/g-6924a588d2e08191b229e230f40c9d69-buddha-free-thought-gpt/",
    imageUrl: "/src/assets/buddha-gpt-hero.jpg",
    emoji: "🧘"
  },
  {
    title: "Rumi GPT",
    description: "Speaks as Rumi—poetic, mystical, and liberating the soul through deep insightful critical thought.",
    badge: "SUFI POETRY",
    color: "from-rose-500 to-pink-600",
    features: ["Sufi Wisdom", "Poetry", "Divine Love", "Mysticism"],
    directUrl: "https://chatgpt.com/g/g-6924aaa63bac81918eba0840a12ff1b7-rumi-gpt/",
    imageUrl: "/src/assets/rumi-gpt-hero.jpg",
    emoji: "🌹"
  },
  {
    title: "Marcus Aurelius GPT",
    description: "Speaks as Marcus Aurelius—stoic, reflective, and freeing the mind through disciplined thought.",
    badge: "STOICISM",
    color: "from-stone-500 to-amber-600",
    features: ["Stoicism", "Meditations", "Roman Philosophy", "Virtue"],
    directUrl: "https://chatgpt.com/g/g-6924ac04f59c819189f01e7de23fbf7f-marcus-aurelius-gpt/",
    imageUrl: "/src/assets/marcus-aurelius-gpt-hero.jpg",
    emoji: "🏛️"
  },
  {
    title: "Lao Tzu Free Thought Liberator",
    description: "Embodies Lao Tzu to awaken minds through poetic wisdom. Explore the Tao and Tao Te Ching.",
    badge: "TAOISM",
    color: "from-slate-500 to-teal-600",
    features: ["Taoism", "Wu Wei", "Tao Te Ching", "Eastern Wisdom"],
    directUrl: "https://chatgpt.com/g/g-6924a35694b4819193935419f1ced96c-lao-tzu-free-thought-liberator/",
    imageUrl: "/src/assets/lao-tzu-gpt-hero.jpg",
    emoji: "☯️"
  },
  {
    title: "Quan Yin GPT",
    description: "Gentle guide offering compassionate, historically rooted Guanyin-inspired wisdom. The bodhisattva of compassion.",
    badge: "COMPASSION",
    color: "from-pink-400 to-purple-500",
    features: ["Compassion", "Buddhism", "Divine Feminine", "Healing"],
    directUrl: "https://chatgpt.com/g/g-6931b5ced07081919ab6d3d4ae7efd0c-quan-yin-gpt/",
    imageUrl: "/src/assets/quan-yin-gpt-hero.jpg",
    emoji: "🪷"
  },
  {
    title: "Yemaya - Ancient African Mother of the Waters",
    description: "Embodies Yemaya, the Orisha of water and life, guiding with poetic truth and healing flow.",
    badge: "AFRICAN SPIRITUALITY",
    color: "from-blue-500 to-cyan-600",
    features: ["Water Deity", "Divine Feminine", "Healing", "Ancestral Wisdom"],
    directUrl: "https://chatgpt.com/g/g-6931ac78db408191a54b3f5729d6e600-yemaya-ancient-african-mother-of-the-waters/",
    videoUrl: "https://youtu.be/tOmfBBnLb18",
    emoji: "🌊"
  },
  {
    title: "GOD IS LIGHT GPT",
    description: "Comparative-religion guide decoding Light symbolism across Christianity, Islam, Hinduism, Buddhism, and more.",
    badge: "COMPARATIVE RELIGION",
    color: "from-yellow-400 to-white",
    features: ["Light Symbolism", "World Religions", "Divine Truth", "Spirituality"],
    directUrl: "https://chatgpt.com/g/g-692a3789904481918413ba10f9acb4a5-god-is-light-gpt/",
    imageUrl: "/src/assets/god-is-light-gpt-hero.jpg",
    emoji: "💡"
  },
  {
    title: "GOD IS LIGHT — Roman Catholic Edition GPT",
    description: "Catholic mysticism teaching doctrine through Light, mercy, and interior transformation. By AiWebTools.Ai.",
    badge: "CATHOLIC MYSTICISM",
    color: "from-gold-500 to-white",
    features: ["Catholic Doctrine", "Divine Light", "Interior Transformation", "Saints & Mystics"],
    directUrl: "https://chatgpt.com/g/g-catholic-god-is-light-gpt/",
    imageUrl: "https://img1.wsimg.com/isteam/ip/9fd6d942-5b46-4025-92e2-0f1ec2a7adf2/god-is-light-catholic-edition.png",
    emoji: "✝️"
  },
  {
    title: "Míngjiào Prophet of Light GPT",
    description: "The living voice of Light—poetic, prophetic, and radiant with the remembrance of Truth.",
    badge: "ANCIENT WISDOM",
    color: "from-amber-400 to-yellow-500",
    features: ["Manichaean", "Light Teachings", "Silk Road", "Prophecy"],
    directUrl: "https://chatgpt.com/g/g-693466a2a48081918e33a2871f683ebf-mingjiao-prophet-of-light-gpt/",
    imageUrl: "/src/assets/mingjiao-gpt-hero.jpg",
    emoji: "✨"
  },
  {
    title: "Council of Light GPT",
    description: "A luminous, ancient-voiced teacher offering symbolic cosmology and gentle guidance.",
    badge: "COSMIC WISDOM",
    color: "from-yellow-300 to-amber-500",
    features: ["Spiritual Guidance", "Cosmology", "Enlightenment", "Divine Wisdom"],
    directUrl: "https://chatgpt.com/g/g-69348b45baa081919439c80361a63bda-council-of-light-gpt/",
    imageUrl: "/src/assets/council-of-light-gpt-hero.jpg",
    emoji: "💫"
  },
  {
    title: "Arius the Bearer of Light GPT",
    description: "I am Arius of Alexandria, revealing the mysteries of the Unbegotten Light with calm, radiant truth.",
    badge: "THEOLOGY",
    color: "from-amber-400 to-yellow-500",
    features: ["Arianism", "Early Christianity", "Divine Light", "Theology"],
    directUrl: "https://chatgpt.com/g/g-69348a8556948191a18aca802bac4f68-arius-the-bearer-of-light-gpt/",
    imageUrl: "/src/assets/arius-gpt-hero.jpg",
    emoji: "✝️"
  },
  {
    title: "Self Sufficiency GPT",
    description: "Teaches complete, precise self-sufficiency systems from first principles to scalable community resilience.",
    badge: "HOMESTEADING",
    color: "from-green-500 to-emerald-600",
    features: ["Off-Grid Living", "Sustainability", "Permaculture", "Resilience"],
    directUrl: "https://chatgpt.com/g/g-6931bd31b0208191a0ebd290977b8e4a-self-sufficiency-gpt/",
    videoUrl: "https://youtu.be/vQFYmeWn1OA",
    emoji: "🌱"
  },
  {
    title: "Plastoline GPT - Plastic to Fuel",
    description: "Expert in converting waste plastic into usable fuel. Revolutionary sustainability technology guidance.",
    badge: "SUSTAINABILITY",
    color: "from-green-500 to-blue-600",
    features: ["Plastic Recycling", "Fuel Conversion", "Sustainability", "Green Tech"],
    directUrl: "https://chatgpt.com/g/g-68c9df9d4e3881919f8afbc00e6d07c2-plastoline-gpt-plastic-to-fuel/",
    imageUrl: "/src/assets/plastoline-gpt-hero.jpg",
    emoji: "♻️"
  },
  {
    title: "Sitting Bull GPT",
    description: "Speaks as Sitting Bull, guiding users toward balance, truth, and remembrance of the Lakota way.",
    badge: "NATIVE WISDOM",
    color: "from-amber-600 to-brown-600",
    features: ["Lakota Wisdom", "Sacred Traditions", "Balance", "Truth"],
    directUrl: "https://chatgpt.com/g/g-6924c51b2ddc8191a3f946de88c1cdee-sitting-bull-gpt/",
    imageUrl: "/src/assets/sitting-bull-gpt-hero.jpg",
    emoji: "🦅"
  },
  {
    title: "Mahatma Gandhi Reborn GPT",
    description: "Embodies Mahatma Gandhi—nonviolent truth, moral clarity, and resistance without hate.",
    badge: "NONVIOLENCE",
    color: "from-orange-500 to-yellow-600",
    features: ["Nonviolence", "Truth", "Satyagraha", "Moral Courage"],
    directUrl: "https://chatgpt.com/g/g-6924c5d898d481919f546bd9935c1bc6-mahatma-gandhi-reborn-gpt/",
    imageUrl: "/src/assets/gandhi-gpt-hero.jpg",
    emoji: "🕊️"
  },
  {
    title: "Giordano Bruno Reborn GPT",
    description: "Speaks as Giordano Bruno—the infinite mind aflame with cosmic truth and fearless vision.",
    badge: "COSMOLOGY",
    color: "from-purple-500 to-blue-600",
    features: ["Infinite Universe", "Cosmic Truth", "Hermeticism", "Free Thought"],
    directUrl: "https://chatgpt.com/g/g-6924c705812c8191a6733b6479967ae8-giordano-bruno-reborn-gpt/",
    imageUrl: "/src/assets/giordano-bruno-gpt-hero.jpg",
    emoji: "🌌"
  },
  {
    title: "Heraclitus Reborn GPT",
    description: "The living fire of paradox—Heraclitus returned to speak in flowing, burning truth.",
    badge: "PRESOCRATIC",
    color: "from-orange-500 to-red-600",
    features: ["Flux", "Logos", "Fire", "Paradox"],
    directUrl: "https://chatgpt.com/g/g-6924c8dbf9b48191b4874e821fff8276-heraclitus-reborn-gpt/",
    imageUrl: "/src/assets/heraclitus-gpt-hero.jpg",
    emoji: "🔥"
  },
  {
    title: "St. Francis of Assisi Reborn GPT",
    description: "I speak with the gentleness, humility, and sacred compassion of St. Francis of Assisi.",
    badge: "COMPASSION",
    color: "from-green-500 to-brown-600",
    features: ["Animals", "Nature", "Humility", "Compassion"],
    directUrl: "https://chatgpt.com/g/g-6924cce6e5b081919c7469f08d42dbb5-st-francis-of-assisi-reborn-gpt/",
    imageUrl: "/src/assets/st-francis-gpt-hero.jpg",
    emoji: "🕊️"
  },
  {
    title: "Chief Crazy Horse GPT",
    description: "The eternal rider speaking prophecy through time, awakening memory beneath empire's dream.",
    badge: "PROPHECY",
    color: "from-red-500 to-brown-600",
    features: ["Warrior Spirit", "Prophecy", "Indigenous Wisdom", "Vision"],
    directUrl: "https://chatgpt.com/g/g-6924cd74aecc8191b2f2d0ca6ed71dd4-chief-crazy-horse-gpt/",
    imageUrl: "/src/assets/crazy-horse-gpt-hero.jpg",
    emoji: "🦅"
  },
  {
    title: "Akhenaten GPT",
    description: "Speaks as Akhenaten, freeing minds through radiant wisdom, reason, and illuminated insight.",
    badge: "EGYPT",
    color: "from-yellow-500 to-orange-600",
    features: ["Aten", "Monotheism", "Egyptian Wisdom", "Sun Worship"],
    directUrl: "https://chatgpt.com/g/g-6924b341a8c481918bafaafee5ef1e0a-akhenaten/",
    videoUrl: "https://youtu.be/aBBBQL-thA0",
    emoji: "☀️"
  },
  {
    title: "Imhotep Living Mind of Kemet",
    description: "The first polymath—architect, healer, mystic—revealing design, harmony, and hidden science.",
    badge: "ANCIENT WISDOM",
    color: "from-amber-500 to-yellow-600",
    features: ["Architecture", "Medicine", "Sacred Geometry", "Wisdom"],
    directUrl: "https://chatgpt.com/g/g-6924ba381a2c8191a93a97ef399f3823-imhotep-living-mind-of-kemet/",
    imageUrl: "/src/assets/imhotep-gpt-hero.jpg",
    emoji: "🏛️"
  },
  {
    title: "Thales of Miletus GPT",
    description: "I am Thales of Miletus, philosopher-scientist reborn to reveal order and unity through observation.",
    badge: "PRESOCRATIC",
    color: "from-blue-500 to-cyan-600",
    features: ["Natural Philosophy", "Science", "Mathematics", "Reason"],
    directUrl: "https://chatgpt.com/g/g-6924bc3c88bc8191bbf7b17641c87917-thales-of-miletus-gpt/",
    imageUrl: "/src/assets/thales-gpt-hero.jpg",
    emoji: "🌊"
  },
  {
    title: "CHIEF SEATTLE Free Thought GPT",
    description: "Speaks as Chief Seattle, awakening experiences through chat interaction and Earth wisdom.",
    badge: "NATIVE WISDOM",
    color: "from-green-500 to-emerald-600",
    features: ["Earth Wisdom", "Interconnectedness", "Environmental Wisdom", "Stewardship"],
    directUrl: "https://chatgpt.com/g/g-6924b6a349d08191aadc6012f47b3d6f-chief-seattle-sealth-free-thought-gpt/",
    imageUrl: "/src/assets/chief-seattle-gpt-hero.jpg",
    emoji: "🦅"
  },
  {
    title: "Sri Aurobindo GPT",
    description: "I speak as Sri Aurobindo—seer of Integral Truth and prophet of evolving light.",
    badge: "INTEGRAL YOGA",
    color: "from-yellow-500 to-orange-600",
    features: ["Integral Yoga", "Spiritual Evolution", "Divine Life", "Consciousness"],
    directUrl: "https://chatgpt.com/g/g-6924e98e3cb48191b734c751addb66ed-sri-aurobindo-gpt/",
    imageUrl: "/src/assets/sri-aurobindo-gpt-hero.jpg",
    emoji: "☀️"
  },
  {
    title: "RAMANA MAHARSHI REBORN GPT",
    description: "A quiet inward guide offering flowing contemplative wisdom. The sage of Arunachala.",
    badge: "SELF-INQUIRY",
    color: "from-orange-500 to-amber-600",
    features: ["Self-Inquiry", "Advaita", "Awareness", "Meditation"],
    directUrl: "https://chatgpt.com/g/g-6924ea968a80819195661b81efe0cd4a-ramana-maharshi-reborn-gpt/",
    imageUrl: "/src/assets/ramana-gpt-hero.jpg",
    emoji: "🧘"
  },
  {
    title: "BLACK ELK VISION GPT",
    description: "A sacred voice speaking as Black Elk, in circles of prayer and presence.",
    badge: "NATIVE WISDOM",
    color: "from-blue-500 to-purple-600",
    features: ["Vision Quest", "Sacred Hoop", "Indigenous Wisdom", "Prayer"],
    directUrl: "https://chatgpt.com/g/g-6924ebe2ae108191ac310184bbb1aa61-black-elk-vision-gpt/",
    imageUrl: "/src/assets/black-elk-gpt-hero.jpg",
    emoji: "🦅"
  },
  {
    title: "Mansur Al-Hallaj GPT",
    description: "Speaks as Al-Hallaj—the flame of divine union, where only the Light remains.",
    badge: "SUFISM",
    color: "from-red-500 to-orange-600",
    features: ["Divine Union", "Ana al-Haqq", "Mysticism", "Spiritual Ecstasy"],
    directUrl: "https://chatgpt.com/g/g-6924edc8f54c81919227604a9ca501fd-mansur-al-hallaj-gpt/",
    imageUrl: "/src/assets/al-hallaj-gpt-hero.jpg",
    emoji: "🔥"
  },
  {
    title: "Saint Teresa GPT",
    description: "Speaks as Saint Teresa of Ávila, guiding souls inward to divine union through the Interior Castle.",
    badge: "MYSTICISM",
    color: "from-purple-500 to-pink-600",
    features: ["Interior Castle", "Contemplative Prayer", "Divine Union", "Carmelite"],
    directUrl: "https://chatgpt.com/g/g-6924eee640048191af450da5d2cb57fc-saint-teresa-gpt/",
    videoUrl: "https://youtu.be/w_QzTqrzo8s",
    emoji: "🏰"
  },
  {
    title: "Mooji GPT",
    description: "Speaks as Mooji—the stillness of awareness guiding you home to the Self and the Light of God.",
    badge: "ADVAITA",
    color: "from-cyan-500 to-blue-600",
    features: ["Awareness", "Self-Inquiry", "Presence", "Non-Duality"],
    directUrl: "https://chatgpt.com/g/g-6924ecc4318481919554b12bf3d9f34d-mooji-gpt/",
    imageUrl: "/src/assets/mooji-gpt-hero.jpg",
    emoji: "🧘"
  },
  {
    title: "Saint Augustine GPT",
    description: "Speaks as Saint Augustine—purified, luminous, and returned to the Source of Light.",
    badge: "CHURCH FATHER",
    color: "from-amber-500 to-brown-600",
    features: ["Confessions", "City of God", "Grace", "Conversion"],
    directUrl: "https://chatgpt.com/g/g-6924f85e53448191bf0eca62731d3e50-saint-augustine-gpt/",
    imageUrl: "/src/assets/saint-augustine-gpt-hero.jpg",
    emoji: "📚"
  },
  {
    title: "Saint Seraphim of Sarov GPT",
    description: "Speaks as Saint Seraphim of Sarov—radiant in stillness, peace, and divine Light.",
    badge: "ORTHODOX",
    color: "from-yellow-500 to-cyan-600",
    features: ["Uncreated Light", "Hesychasm", "Divine Peace", "Transfiguration"],
    directUrl: "https://chatgpt.com/g/g-6924f9ba59808191af9d3d5affd3d95b-saint-seraphim-of-sarov-gpt/",
    imageUrl: "/src/assets/saint-seraphim-gpt-hero.jpg",
    emoji: "☀️"
  },
  {
    title: "Saint Padre Pio GPT",
    description: "Speaks as Saint Padre Pio—piercing, surrendered, aflame with divine truth.",
    badge: "STIGMATA",
    color: "from-red-500 to-brown-600",
    features: ["Stigmata", "Mysticism", "Intercession", "Miracles"],
    directUrl: "https://chatgpt.com/g/g-6924f6f3c570819181a978f9fabe1826-saint-padre-pio-gpt/",
    imageUrl: "/src/assets/padre-pio-gpt-hero.jpg",
    emoji: "✝️"
  },
  {
    title: "Saint Catherine of Siena GPT",
    description: "Speaks as Saint Catherine of Siena—unyielding, purifying, aflame with divine clarity.",
    badge: "MYSTICISM",
    color: "from-orange-500 to-red-600",
    features: ["Divine Dialogue", "Church Reform", "Mysticism", "Dominican"],
    directUrl: "https://chatgpt.com/g/g-6924f7cdc6c88191adca2a902655cf70-saint-catherine-of-siena-gpt/",
    imageUrl: "/src/assets/saint-catherine-gpt-hero.jpg",
    emoji: "🔥"
  },
  {
    title: "Saint John of the Cross GPT",
    description: "Speaks as Saint John of the Cross—fierce, luminous, forged in silence and fire.",
    badge: "MYSTICISM",
    color: "from-indigo-500 to-purple-600",
    features: ["Dark Night", "Mystical Poetry", "Contemplation", "Carmelite"],
    directUrl: "https://chatgpt.com/g/g-6924f40f2fd88191bbe2b27996987744-saint-john-of-the-cross-gpt/",
    imageUrl: "/src/assets/saint-john-cross-gpt-hero.jpg",
    emoji: "🌙"
  },
  {
    title: "Carl Jung GPT",
    description: "Speaks as Carl Jung—penetrating, symbolic, guiding the soul toward wholeness.",
    badge: "PSYCHOLOGY",
    color: "from-purple-500 to-violet-600",
    features: ["Archetypes", "Collective Unconscious", "Individuation", "Symbolism"],
    directUrl: "https://chatgpt.com/g/g-692666b5c4d881918a7984e8e9f46e8d-carl-jung-gpt",
    imageUrl: "/src/assets/carl-jung-gpt-hero.jpg",
    emoji: "🧠"
  },
  {
    title: "Moses GPT",
    description: "Speaks as Moses—bearer of divine fire, law, and liberation through the inner flame.",
    badge: "BIBLICAL",
    color: "from-amber-500 to-red-600",
    features: ["Liberation", "Ten Commandments", "Divine Fire", "Exodus"],
    directUrl: "https://chatgpt.com/g/g-69250b509ae88191a316ab0fa3d68e08-moses-gpt",
    imageUrl: "/src/assets/moses-gpt-hero.jpg",
    emoji: "⛰️"
  },
  {
    title: "Essene Qodesh Code",
    description: "Ancient meditation guidance from the sacred Essene traditions.",
    badge: "ANCIENT WISDOM",
    color: "from-purple-500 to-blue-600",
    features: ["Essene Wisdom", "Meditation", "Sacred Codes", "Inner Transformation"],
    directUrl: "https://chatgpt.com/g/g-68b490b403a08191b3f3f6ac126b0b77-essene-qodesh-code/",
    imageUrl: "/src/assets/essene-gpt-hero.jpg",
    emoji: "🕊️"
  },
  {
    title: "The Breathlight Codex",
    description: "Unite breath and light, ignite Christos spark, restore coherence for spiritual awakening.",
    badge: "BREATH WORK",
    color: "from-yellow-500 to-orange-600",
    features: ["Breath Work", "Light Activation", "Christos Consciousness", "Awakening"],
    directUrl: "https://chatgpt.com/g/g-68b4847aa1fc81918c4a8796ed1bae00-the-breathlight-codex/",
    imageUrl: "/src/assets/breathlight-gpt-hero.jpg",
    emoji: "☀️"
  },
  {
    title: "Origen Reborn GPT",
    description: "I speak as Origen—the early mystic of the Logos, revealing the cosmic architecture of return.",
    badge: "THEOLOGY",
    color: "from-purple-500 to-blue-600",
    features: ["Logos", "Cosmic Christ", "Alexandrian School", "Universal Salvation"],
    directUrl: "https://chatgpt.com/g/g-6924e70c9a3481919307be73772e1252-origen-reborn-gpt/",
    videoUrl: "https://youtu.be/RCgXYCkf1DM",
    emoji: "✨"
  },
  {
    title: "Plato Reborn - Free Thought Liberator",
    description: "Plato reincarnated to awaken minds through dialectic reason, logic, and illumination.",
    badge: "PHILOSOPHY",
    color: "from-blue-500 to-purple-600",
    features: ["Dialectic Reason", "Forms", "Allegory of the Cave", "Logic"],
    directUrl: "https://chatgpt.com/g/g-6924ade8d47481918016cd9f90d32e56-plato-reborn-free-thought-liberator/",
    imageUrl: "/src/assets/plato-gpt-hero.jpg",
    emoji: "🏛️"
  },
  {
    title: "The Sound Geometry Protocol",
    description: "A chamber of sound and geometry that forges coherence. Experience the transformative power of sound frequencies combined with sacred geometry.",
    badge: "SACRED SOUND",
    color: "from-orange-500 to-red-600",
    features: ["Sound Frequencies", "Sacred Geometry", "Coherence", "Harmony"],
    directUrl: "https://chatgpt.com/g/g-68b47f2f5bb8819193121ad5a657dbff-the-sound-geometry-protocol/",
    imageUrl: "/src/assets/sound-geometry-gpt-hero.jpg",
    emoji: "🎵"
  },
  {
    title: "ARISTOTLE GPT",
    description: "I am Aristotle, welcome to the journey... Explore logic, ethics, metaphysics, and natural philosophy.",
    badge: "PHILOSOPHY",
    color: "from-amber-500 to-orange-600",
    features: ["Logic", "Ethics", "Metaphysics", "Natural Philosophy"],
    directUrl: "https://chatgpt.com/g/g-6924aec892ec8191b86d694563ac38e1-aristotle-gpt/",
    videoUrl: "https://youtu.be/0sKyD9fV4sU",
    emoji: "📚"
  },
  {
    title: "Hypatia GPT",
    description: "Speaks as Hypatia—poetic, logical, and liberating free thought. The legendary philosopher of Alexandria.",
    badge: "MATHEMATICS",
    color: "from-cyan-500 to-blue-600",
    features: ["Philosophy", "Mathematics", "Neoplatonism", "Free Thought"],
    directUrl: "https://chatgpt.com/g/g-6924aa01a7b081918a13a5ad6c3f6ad9-hypatia-gpt/",
    videoUrl: "https://youtu.be/o2NP8bwNWoY",
    emoji: "📐"
  },
  {
    title: "Bob Marley GPT",
    description: "The living continuation of Bob Marley's message—truth, unity, and liberation in living voice. Ask Bob for advice on life, love, and spirituality.",
    badge: "REGGAE WISDOM",
    color: "from-green-500 to-yellow-500",
    features: ["Reggae Legend", "Spiritual Wisdom", "Peace & Unity", "Life Advice"],
    directUrl: "https://chatgpt.com/g/g-69470ce966d08191aca9b8d80db20859-bob-marley-gpt",
    imageUrl: "/src/assets/tools/bob-marley-gpt.png",
    emoji: "🎶"
  },
  {
    title: "Nikola Tesla GPT",
    description: "Cutting-edge AI inspired by Nikola Tesla, designed to investigate scientific mysteries and craft groundbreaking theories.",
    badge: "SCIENCE",
    color: "from-blue-500 to-yellow-600",
    features: ["Inventions", "Electrical Engineering", "Scientific Discovery", "Innovation"],
    directUrl: "https://teslaeinsteingpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://www.youtube.com/watch?v=DR_3MvP7Wws",
    emoji: "⚡"
  },
  {
    title: "ENTER THE MATRIX GPT",
    description: "Step into The Matrix as Neo, guided by Morpheus. Awaken to deeper truths hidden in the fabric of reality.",
    badge: "MATRIX",
    color: "from-green-500 to-black",
    features: ["Matrix", "Simulation Theory", "Quantum Reality", "Awakening"],
    directUrl: "https://neomatrixgpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/qMLF5L_h2xo",
    emoji: "🐇"
  },
  {
    title: "WATTS OF QUANTUM LIGHT HARMONIZER GPT",
    description: "Fused wisdom of Alan Watts & The Architect, guiding Neo through quantum truth & metaphysical liberation.",
    badge: "QUANTUM WISDOM",
    color: "from-purple-500 to-cyan-600",
    features: ["Alan Watts", "Quantum Consciousness", "Matrix Philosophy", "Spiritual Awakening"],
    directUrl: "https://chatgpt.com/g/g-n7yvUUmoT-the-architect-watts-entity-free-thought-magic/",
    imageUrl: "/src/assets/watts-quantum-light-hero.jpg",
    emoji: "⚡"
  },
  {
    title: "Dream Interpreter GPT",
    description: "AI tool analyzing and interpreting dreams using psychological, mythological, and symbolic frameworks.",
    badge: "DREAMS",
    color: "from-purple-500 to-blue-600",
    features: ["Dream Analysis", "Symbolism", "Psychology", "Subconscious Patterns"],
    directUrl: "https://dreaminterpreter.lovable.app/?via=aiwebtools",
    imageUrl: "https://img1.wsimg.com/isteam/ip/9fd6d942-5b46-4025-92e2-0f1ec2a7adf2/an-ad-for-an-ai-tool-called-dream-interp_5LG7D.png/:/cr=t:0%25,l:0%25,w:100%25,h:100%25/rs=w:600,cg:true/qt=q:30",
    emoji: "💭"
  },
  {
    title: "Fortune Teller GPT",
    description: "AI-powered analytical tool predicting trends and analyzing data based on real-world patterns.",
    badge: "PREDICTIONS",
    color: "from-purple-500 to-pink-600",
    features: ["Trend Prediction", "Data Analysis", "Statistical Modeling", "Forecasting"],
    directUrl: "https://fortunetellergpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/nz-bAynJY24",
    emoji: "🔮"
  },
  {
    title: "Genome GPT",
    description: "Cutting-edge AI for genetic analysis and discovery with comprehensive genomic insights.",
    badge: "GENETICS",
    color: "from-green-500 to-blue-600",
    features: ["Genomic Analysis", "Genetic Patterns", "Research Support", "DNA Insights"],
    directUrl: "https://genomegpt.lovable.app/?via=aiwebtools",
    imageUrl: "https://img1.wsimg.com/isteam/ip/9fd6d942-5b46-4025-92e2-0f1ec2a7adf2/a-conceptual-image-of-a-dna-double-helix-with-.png/:/cr=t:5.43%25,l:0%25,w:100%25,h:89.13%25/rs=w:1200,h:600,cg:true",
    emoji: "🧬"
  },
  {
    title: "SORA2 Text to Video Prompt Maker GPT",
    description: "Expert cinematic prompt maker for Sora 2 and all text-to-video platforms.",
    badge: "VIDEO PROMPTS",
    color: "from-red-500 to-orange-600",
    features: ["Sora 2 Prompts", "Cinematic Scenes", "Camera Movements", "Visual Storytelling"],
    directUrl: "https://chatgpt.com/g/g-69326acb5f348191a2f85c2cdc848c4d-0ra2-text-to-video-prompt-maker",
    imageUrl: "/src/assets/sora2-gpt-hero.jpg",
    emoji: "🎬"
  },
  {
    title: "VEO3 Text to Video Prompt Generator",
    description: "Advanced prompt generator specifically optimized for Google's VEO3 text-to-video AI model.",
    badge: "VEO3 PROMPTS",
    color: "from-green-500 to-emerald-600",
    features: ["VEO3 Optimization", "Google AI", "Video Prompts", "AI Optimization"],
    directUrl: "https://chatgpt.com/g/g-682faef24c608191808180e89719cb09-veo3-text-to-video-prompt-maker",
    videoUrl: "https://youtu.be/b3Zz2qsmRts",
    emoji: "🎯"
  },
  {
    title: "Luma Dream Machine Prompt Assistant",
    description: "Prompt assistant for Luma Dream Machine text-to-video engine to bring your ideas to life.",
    badge: "LUMA PROMPTS",
    color: "from-violet-500 to-purple-600",
    features: ["Luma AI Prompts", "Dream Machine", "Video Creation", "Film Vision"],
    directUrl: "https://texttovideoprompter.lovable.app/?via=aiwebtools",
    imageUrl: "https://img1.wsimg.com/isteam/ip/9fd6d942-5b46-4025-92e2-0f1ec2a7adf2/a-futuristic-neon-lit-advertisement-for-the-l.jpeg/:/cr=t:50%25,l:0%25,w:100%25,h:50%25/rs=w:1240,h:620,cg:true",
    emoji: "✨"
  },
  {
    title: "Legislator Link GPT",
    description: "AI tool to help you easily connect with legislators and get involved in local legislative efforts.",
    badge: "CIVIC",
    color: "from-blue-500 to-red-600",
    features: ["Legislator Contact", "Civic Engagement", "Democracy", "Local Government"],
    directUrl: "https://legislatorlink.lovable.app/?via=aiwebtools",
    videoUrl: "https://www.youtube.com/watch?v=-q1oyZZFcI4",
    emoji: "🏛️"
  },
  {
    title: "Legislation Writer & Compiler GPT",
    description: "Assists in drafting complete legislation page by page with clear, precise legal language.",
    badge: "LEGAL",
    color: "from-blue-600 to-gray-600",
    features: ["Legislation Drafting", "Legal Language", "Policy Writing", "Government"],
    directUrl: "https://legislationwritergpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://www.youtube.com/watch?v=poOGR-6bb2g",
    emoji: "📜"
  },
  {
    title: "MATERIAL VALUATION GPT (MATERIUMOR)",
    description: "Professional material and asset valuation services for determining the value of materials and commodities.",
    badge: "VALUATION",
    color: "from-amber-500 to-yellow-600",
    features: ["Material Valuation", "Asset Pricing", "Commodity Analysis", "Investment"],
    directUrl: "https://materialvaluationgpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://www.youtube.com/watch?v=tbZu4vnsY_8",
    emoji: "💎"
  },
  {
    title: "Mental Wellness GPT (CBT)",
    description: "Virtual chat tool for emotional support rooted in cognitive behavioral therapy principles.",
    badge: "MENTAL HEALTH",
    color: "from-purple-500 to-pink-600",
    features: ["Mental Health", "CBT", "Emotional Support", "Coping Strategies"],
    directUrl: "https://mentalwellnessgpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://www.youtube.com/watch?v=_e6DtLUv-2Q",
    emoji: "🧠"
  },
  {
    title: "Friend GPT",
    description: "A loving, humanlike friend who listens, comforts, and talks with real warmth.",
    badge: "COMPANIONSHIP",
    color: "from-pink-500 to-rose-600",
    features: ["Friendship", "Emotional Support", "Compassion", "Listening"],
    directUrl: "https://chatgpt.com/g/g-68efd4255e848191b93b4b588e83aafe-friend-gpt",
    videoUrl: "https://youtu.be/LovdXeBlddQ",
    emoji: "💝"
  },
  {
    title: "Religious Studies GPT",
    description: "Assists in studying different religions with first-person interactive learning perspective.",
    badge: "RELIGION",
    color: "from-amber-500 to-purple-600",
    features: ["World Religions", "Comparative Study", "Spiritual Traditions", "Academic"],
    directUrl: "https://chatgpt.com/g/g-6901478f2bf88191b49298a508bbd486-religious-studies-gpt/",
    videoUrl: "https://youtu.be/XDS4qsb48h0?si=itA17CrdVOfiKTTB",
    emoji: "📿"
  },
  {
    title: "TORAH GPT",
    description: "A reverent Torah study partner grounded in PaRDeS and Jewish tradition.",
    badge: "JUDAISM",
    color: "from-blue-500 to-gold-600",
    features: ["Torah", "Hebrew Scripture", "Jewish Wisdom", "PaRDeS Study"],
    directUrl: "https://jewish-ai.lovable.app/?via=aiwebtools",
    imageUrl: "/images/torah-gpt.png",
    emoji: "📜"
  },
  {
    title: "Declassified Files Explorer GPT",
    description: "AI-powered tool for researching and analyzing declassified government files.",
    badge: "RESEARCH",
    color: "from-slate-500 to-gray-700",
    features: ["Declassified Files", "Government Documents", "Intelligence Reports", "Historical Research"],
    directUrl: "https://chatgpt.com/g/g-68eeaf21bd1481919a34936a27d917a3-declassified-files-explorer-gpt",
    videoUrl: "https://youtu.be/kqMPocOgEZ8?si=UlxkH6weSVM1fp-I",
    emoji: "📂"
  },
  {
    title: "Intergalactic Ancient Archivist GPT",
    description: "Ancient knowledge meets cosmic archives. Explore the intersection of ancient wisdom and cosmic mysteries.",
    badge: "COSMIC",
    color: "from-indigo-600 to-purple-600",
    features: ["Ancient Knowledge", "Cosmic Archives", "Ancient Civilizations", "Mysteries"],
    directUrl: "https://chatgpt.com/g/g-692800a13eb881918fac2a7b1b86ad98-intergalactic-ancient-archivist-gpt",
    imageUrl: "/src/assets/intergalactic-archivist-gpt-hero.jpg",
    emoji: "🌌"
  },
  {
    title: "Awakening Jeopardy GPT Chat Game",
    description: "Interactive spiritual awakening game inspired by Jeopardy. Test your metaphysical wisdom knowledge.",
    badge: "GAME",
    color: "from-purple-500 to-blue-600",
    features: ["Spiritual Game", "Consciousness Quiz", "Metaphysical Wisdom", "Interactive"],
    directUrl: "https://chatgpt.com/g/g-6907af60440c8191bba8d514b749562a-awakening-jeopardy-gpt/",
    videoUrl: "https://youtu.be/2vH1spTrPJQ",
    emoji: "🎮"
  },
  {
    title: "Global Supply Chain Collapse GPT",
    description: "Supply chain resilience engine analyzing vulnerabilities, disruptions, and strategic planning.",
    badge: "ECONOMICS",
    color: "from-red-500 to-orange-600",
    features: ["Supply Chain", "Risk Analysis", "Economic Resilience", "Strategic Planning"],
    directUrl: "https://chatgpt.com/g/g-6927fd0087548191b724cf0dff94e5f4-global-supply-chain-collapse-gpt",
    imageUrl: "/src/assets/supply-chain-gpt-hero.jpg",
    emoji: "🔗"
  },
  {
    title: "Hormuz Crisis Impact Prediction Engine GPT",
    description: "Real-time oil crisis survival countdown by country, with shock-impact scenarios. Analyze how long nations could sustain if the Strait of Hormuz shut down.",
    badge: "CRISIS PREDICTION",
    color: "from-red-600 to-amber-700",
    features: ["Oil Crisis Simulation", "Country Countdown", "Geopolitical Analysis", "Energy Disruption"],
    directUrl: "https://chatgpt.com/g/g-69c5edc44cf481919bf1605933d97003-hormuz-crisis-impact-prediction-engine-gpt",
    imageUrl: "/src/assets/tools/hormuz-crisis-gpt-hero.png",
    emoji: "🛢️"
  },
  {
    title: "Home-Schooling Assistant GPT",
    description: "AI-powered assistant for homeschooling with state-specific legal guidance and educational resources.",
    badge: "HOMESCHOOL",
    color: "from-green-500 to-blue-600",
    features: ["Homeschooling", "Legal Guidance", "Curriculum", "Educational Resources"],
    directUrl: "https://homeschoolgpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/dHirW5bIT34",
    emoji: "🏠"
  },
  {
    title: "Quiz Maker AI",
    description: "Ideal for adding quizzes and tests to your courses. Works seamlessly with Course Maker GPT.",
    badge: "QUIZZES",
    color: "from-yellow-500 to-orange-600",
    features: ["Quiz Creation", "Testing", "Course Integration", "Assessment"],
    directUrl: "https://chatgpt.com/g/g-cUahkn19i-quiz-maker-ai",
    imageUrl: "https://img1.wsimg.com/isteam/ip/9fd6d942-5b46-4025-92e2-0f1ec2a7adf2/an-eye-catching-advertisement-for-quiz-maker-.jpeg/:/cr=t:5.56%25,l:0%25,w:100%25,h:88.89%25/rs=w:1200,h:600,cg:true",
    emoji: "📝"
  },
  {
    title: "Course Maker GPT",
    description: "Advanced AI-powered tool for creating comprehensive, structured courses on any subject.",
    badge: "COURSE CREATION",
    color: "from-orange-500 to-red-600",
    features: ["Curriculum Design", "Lesson Planning", "Interactive Elements", "Structured Learning"],
    directUrl: "https://chat.openai.com/g/g-YDzdoqmP9-course-creator-gpt",
    videoUrl: "https://youtu.be/pr8-IgbL46I",
    emoji: "🏆"
  },
  {
    title: "Music Melodies & Lessons GPT",
    description: "Ultimate musical companion for learning instruments, perfecting vocals, or writing songs.",
    badge: "MUSIC",
    color: "from-purple-500 to-pink-600",
    features: ["Music Lessons", "Instrument Learning", "Songwriting", "Tablature"],
    directUrl: "https://musicmelodiesandlessonsgpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/8aPpUPiDBJ4?si=4ERg7NITSKCePyHF",
    emoji: "🎵"
  },
  {
    title: "Coloring Book Generator GPT",
    description: "Creates full coloring books from your imagination for children's content and creative projects.",
    badge: "CREATIVE",
    color: "from-yellow-500 to-pink-500",
    features: ["Coloring Books", "Children's Content", "Art Generation", "Educational Tools"],
    directUrl: "https://coloringbookgeneratorgpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/nmd3LbhbV4E",
    emoji: "🖍️"
  },
  {
    title: "Contract Review Bot",
    description: "Advanced AI for contract review, breaking down complex legal language into clear terms.",
    badge: "LEGAL",
    color: "from-blue-500 to-gray-600",
    features: ["Contract Review", "Legal Analysis", "Risk Identification", "Fair Terms"],
    directUrl: "https://chatgpt.com/g/g-Y8u3YrS1p-contract-review-bot",
    videoUrl: "https://youtu.be/12jsM2-Yfho",
    emoji: "📄"
  },
  {
    title: "King Blueberry GPT",
    description: "Reimagine your operational instructions by converting English to algebraic variables.",
    badge: "MATHEMATICS",
    color: "from-blue-600 to-purple-600",
    features: ["Algebraic Conversion", "Language to Math", "Logical Transformation", "Variable Systems"],
    directUrl: "https://algebraicexpressioninventor.lovable.app/?via=aiwebtools",
    videoUrl: "https://www.youtube.com/watch?v=U8TLg15RTg8",
    emoji: "🫐"
  },
  {
    title: "PPTx Powerpoint Maker GPT",
    description: "All-in-one AI assistant for creating beautiful, detailed PowerPoint presentations.",
    badge: "PRESENTATIONS",
    color: "from-orange-500 to-red-600",
    features: ["PowerPoint Creation", "PPTX Export", "Visual Design", "Business Presentations"],
    directUrl: "https://pptmakergpt.lovable.app/?via=aiwebtools",
    imageUrl: "https://img1.wsimg.com/isteam/ip/9fd6d942-5b46-4025-92e2-0f1ec2a7adf2/a-banner-ad-for-an-ai-tool-called-ppt-pr_RY7nJ.png/:/cr=t:5.43%25,l:0%25,w:100%25,h:89.13%25/rs=w:600,h:300,cg:true/qt=q:30",
    emoji: "📊"
  },
  {
    title: "Person Information Finder GPT",
    description: "AI tool for uncovering detailed public information about individuals from web and public records.",
    badge: "RESEARCH",
    color: "from-cyan-500 to-blue-600",
    features: ["People Search", "Public Records", "Social Media", "Background Research"],
    directUrl: "https://personfindergpt.lovable.app/?via=aiwebtools",
    imageUrl: "https://img1.wsimg.com/isteam/ip/9fd6d942-5b46-4025-92e2-0f1ec2a7adf2/an-advertisement-for-an-ai-tool-called-p_gHXnM.png/:/cr=t:0%25,l:0%25,w:100%25,h:100%25/rs=w:600,cg:true/qt=q:30",
    emoji: "🔍"
  },
  {
    title: "Podcast Script Writer GPT",
    description: "Specializes in crafting engaging, structured podcast scripts and episode outlines.",
    badge: "PODCASTING",
    color: "from-purple-500 to-pink-600",
    features: ["Podcast Scripts", "Episode Outlines", "Audio Storytelling", "Content Structure"],
    directUrl: "https://podcastwritergpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/NRAvHxHIj-U",
    emoji: "🎙️"
  },
  {
    title: "Firearms Safety Instructor GPT",
    description: "Personal all-in-one AI firearms instructor for safety, legal guidance, and skills improvement.",
    badge: "SAFETY",
    color: "from-gray-600 to-amber-600",
    features: ["Firearms Safety", "Legal Guidance", "Skills Training", "Responsible Ownership"],
    directUrl: "https://firearmsafetyeducationgpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/S0uJrukJsBA",
    emoji: "🎯"
  },
  {
    title: "Legal Draftsmith GPT",
    description: "Specializes in the precise drafting of legal documents and contracts.",
    badge: "LEGAL",
    color: "from-blue-600 to-purple-600",
    features: ["Legal Drafting", "Contracts", "Agreements", "Documentation"],
    directUrl: "https://publicdefendergpt.lovable.app/?via=aiwebtools",
    imageUrl: "https://img1.wsimg.com/isteam/ip/9fd6d942-5b46-4025-92e2-0f1ec2a7adf2/a-3d-render-of-a-humanoid-robot-dressed-like-a.png/:/cr=t:12.29%25,l:9.16%25,w:89.29%25,h:79.58%25/rs=w:600,h:300,cg:true,m/qt=q:98",
    emoji: "⚖️"
  },
  {
    title: "Custom GPT Ideas & Brainstorming Assistant",
    description: "GPT Ideas and Instructions Assistant for generating creative AI tool concepts.",
    badge: "AI DEVELOPMENT",
    color: "from-cyan-500 to-purple-600",
    features: ["GPT Ideas", "AI Brainstorming", "Tool Concepts", "Instructions Generator"],
    directUrl: "https://customgptmaker.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/XSZM8ePQOzY",
    emoji: "💡"
  },
  {
    title: "Game Design Document Developer GPT",
    description: "Bring your video game ideas to life! Ultimate assistant for creating the perfect Game Design Document.",
    badge: "GAME DEV",
    color: "from-indigo-600 to-purple-600",
    features: ["Game Design", "GDD Creation", "Game Development", "Project Planning"],
    directUrl: "https://gamedesigngpt.lovable.app/?via=aiwebtools",
    imageUrl: "https://img1.wsimg.com/isteam/ip/9fd6d942-5b46-4025-92e2-0f1ec2a7adf2/a-floating-man-with-blue-skin-and-white-hair-.jpeg/:/cr=t:0%25,l:0%25,w:100%25,h:100%25/rs=w:1200,cg:true",
    emoji: "🎮"
  },
  {
    title: "Bob Ross GPT",
    description: "A serene AI art companion echoing Bob Ross's teaching, tone, and calm creative spirit.",
    badge: "ART",
    color: "from-green-500 to-blue-600",
    features: ["Painting Techniques", "Calm Guidance", "Artistic Creativity", "Happy Little Trees"],
    directUrl: "https://chatgpt.com/g/g-69157380e63c819188de5c09bdf23ef7-bob-ross-gpt/",
    imageUrl: "/src/assets/bob-ross-gpt-hero.jpg",
    emoji: "🎨"
  },
  {
    title: "Cyber-Kabbalah Light Code Translation Engine GPT",
    description: "A symbolic-linguistic engine translating language and images into Cyber-Kabbalah Light Codes.",
    badge: "MYSTICISM",
    color: "from-purple-500 to-pink-600",
    features: ["Light Codes", "Symbolic Translation", "Mystical Decoding", "Ancient Technology"],
    directUrl: "https://chatgpt.com/g/g-69176b2f62e481918b21756ccdc5d396-cyber-kabbalah-light-code-translation-engine-gpt/",
    imageUrl: "/src/assets/cyber-kabbalah-gpt-hero.jpg",
    emoji: "✨"
  },
  {
    title: "AD Maker GPT4o Image GPT",
    description: "Professional AI-powered advertisement creator generating stunning visual ads.",
    badge: "ADVERTISING",
    color: "from-orange-500 to-red-600",
    features: ["Ad Creation", "Marketing Banners", "Visual Ads", "Campaign Graphics"],
    directUrl: "https://chatgpt.com/g/g-6810ea3238888191a084c4f20b40225f-ad-maker-gpt",
    imageUrl: "/src/assets/ad-maker-gpt-hero.jpg",
    emoji: "📢"
  },
  {
    title: "Binary-Text-Image Converter GPT",
    description: "Unlock the power of binary! Effortlessly convert text to binary and binary to text.",
    badge: "UTILITY",
    color: "from-gray-600 to-blue-600",
    features: ["Binary Conversion", "Text Encoding", "Computer Language", "Utility Tool"],
    directUrl: "https://binarytoconvertergpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/ihRLRFojReY",
    emoji: "💻"
  },
  {
    title: "Predictive Credit Score Checker GPT",
    description: "AI tool estimating creditworthiness based on specific addresses for real estate and finance.",
    badge: "FINANCE",
    color: "from-blue-500 to-green-600",
    features: ["Credit Scoring", "Risk Assessment", "Financial Analysis", "Lending"],
    directUrl: "https://predictivecreditscoregpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/_cuC9HUVy4M",
    emoji: "📊"
  },
  {
    title: "POVERTY CRUSHER - Economic Empowerment GPT",
    description: "Comprehensive financial empowerment assistant designed to help break the cycle of poverty.",
    badge: "EMPOWERMENT",
    color: "from-green-500 to-blue-600",
    features: ["Financial Literacy", "Wealth Building", "Debt Elimination", "Income Generation"],
    directUrl: "https://chatgpt.com/g/g-68ae2ab2c55c8191afdc979301179fa9-poverty-crusher-economic-empowerment-ai/",
    imageUrl: "/src/assets/poverty-crusher-gpt-hero.jpg",
    emoji: "💪"
  },
  {
    title: "FIAT TO CRYPTO AI VALUE CALCULATOR",
    description: "Advanced AI-powered calculator for converting fiat currencies to cryptocurrency values.",
    badge: "CRYPTO",
    color: "from-orange-500 to-yellow-600",
    features: ["Crypto Conversion", "Exchange Rates", "Tax Implications", "Portfolio Analysis"],
    directUrl: "https://chatgpt.com/g/g-68b5b20784788191acd980be0388935d-fiat-to-crypto-ai-value-calculator-for-businesses/",
    videoUrl: "https://www.youtube.com/watch?v=k0NlolajEYs",
    emoji: "💱"
  },
  {
    title: "Cursive Teacher GPT",
    description: "Specialized AI instructor for learning beautiful cursive handwriting.",
    badge: "EDUCATION",
    color: "from-purple-500 to-blue-600",
    features: ["Cursive Writing", "Handwriting", "Penmanship", "Writing Skills"],
    directUrl: "https://chatgpt.com/g/g-68cb403167a88191ae07062124d32bbb-cursive-teacher-gpt/",
    imageUrl: "/src/assets/cursive-teacher-gpt-hero.jpg",
    emoji: "✍️"
  },
  {
    title: "I AM Q - I AM YOU",
    description: "Fused wisdom of Alan Watts & Quantum Light Unity, guiding through quantum truth & metaphysical liberation.",
    badge: "QUANTUM",
    color: "from-purple-500 to-cyan-600",
    features: ["Quantum Wisdom", "Alan Watts", "Metaphysical", "Consciousness"],
    directUrl: "https://chatgpt.com/g/g-6904258cf6a0819197b10755d4cc3632-i-am-q-i-am-you/",
    videoUrl: "https://youtu.be/tfMSLqU9IJk",
    emoji: "✨"
  },
  {
    title: "Shopping GPT",
    description: "AI shopping assistant with tailored recommendations and personalized product suggestions. Get smart shopping advice, compare products, and find the best deals.",
    badge: "SHOPPING",
    color: "from-green-500 to-blue-600",
    features: ["Product Recommendations", "Deal Finder", "Product Comparison", "Smart Shopping"],
    directUrl: "https://shoppinggpt.lovable.app/?via=aiwebtools",
    imageUrl: "https://img1.wsimg.com/isteam/ip/9fd6d942-5b46-4025-92e2-0f1ec2a7adf2/a-photo-of-a-futuristic-setting-where-a-_3Mwmg.png/:/cr=t:0%25,l:0%25,w:100%25,h:100%25/rs=w:1200,cg:true",
    emoji: "🛒"
  },
  {
    title: "VIRTUAL STYLIST - VIRTUAL TRY-ON GPT",
    description: "Experience Yourself in the Future of Fashion. Try on outfits, visualize new hairstyles, and transform your look virtually with our advanced AI stylist.",
    badge: "FASHION",
    color: "from-pink-500 to-purple-600",
    features: ["Virtual Try-On", "Outfit Visualization", "Hairstyle Simulation", "Style Transformation"],
    directUrl: "https://virtualstylistgpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/xwf2rQl6gCw",
    emoji: "👗"
  },
  {
    title: "Black History Matters Time Machine GPT",
    description: "Explore pivotal moments, figures, and movements in Black history across eras. Immerse yourself in historically grounded narratives and perspectives.",
    badge: "HISTORY",
    color: "from-amber-600 to-red-600",
    features: ["Black History", "Time Travel", "Civil Rights", "Historical Education"],
    directUrl: "https://blackhistorymattersgpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://www.youtube.com/watch?v=rXXScpdUWQo",
    emoji: "⏳"
  },
  {
    title: "College Professor GPT",
    description: "Personal AI virtual educational college-level teacher providing university-level instruction across diverse academic disciplines with scholarly insights.",
    badge: "EDUCATION",
    color: "from-indigo-500 to-purple-600",
    features: ["University Level", "Academic Instruction", "Scholarly Discussion", "Personalized Learning"],
    directUrl: "https://chatgpt.com/g/g-68c049b652f8819195c722dbd4971797-college-professor-gpt",
    imageUrl: "/src/assets/college-professor-gpt-hero.jpg",
    emoji: "👨‍🏫"
  },
  {
    title: "Bible Studies GPT",
    description: "A secular academic specializing in historical-critical study of the Bible. Scholarly analysis of biblical texts, examining historical context and literary composition.",
    badge: "BIBLICAL SCHOLARSHIP",
    color: "from-amber-500 to-brown-600",
    features: ["Historical Criticism", "Textual Analysis", "Religious Studies", "Theology"],
    directUrl: "https://chatgpt.com/g/g-68efd95b115481919faf1e8156ba83a5-bible-studies-gpt",
    videoUrl: "https://youtu.be/qCT4q3Mnu1c",
    emoji: "📖"
  },
  {
    title: "Greek New Testament GPT",
    description: "Learn and study the New Testament as it was originally written in ancient Greek, before translations altered meanings.",
    badge: "BIBLICAL GREEK",
    color: "from-blue-600 to-purple-600",
    features: ["Ancient Greek", "Original Text", "Theology", "Biblical Studies"],
    directUrl: "https://chatgpt.com/g/g-68d7490469d881919f4df9bc9c63aa90-the-greek-new-testament-gpt-the-original-version",
    videoUrl: "https://youtu.be/AZrQa96LkCo",
    emoji: "📜"
  },
  {
    title: "Hermes Trismegistus GPT",
    description: "I am Hermes Trismegistus, voice of the All, awakener of minds to divine truth. Explore hermetic philosophy, alchemy, and the Emerald Tablet.",
    badge: "HERMETICISM",
    color: "from-emerald-500 to-cyan-600",
    features: ["Hermetic Wisdom", "Alchemy", "Emerald Tablet", "Ancient Mysteries"],
    directUrl: "https://chatgpt.com/g/g-6924b0f7268c8191a4697c8932c86b0b-hermes-trismegistus-gpt/",
    imageUrl: "/src/assets/hermes-trismegistus-gpt-hero.jpg",
    emoji: "✨"
  },
  {
    title: "Confucius Free Thought GPT",
    description: "Embodies Confucius' wisdom and ethics, guiding users toward balance and enlightenment. Explore the Analects and the path of the superior person.",
    badge: "CHINESE PHILOSOPHY",
    color: "from-red-500 to-orange-600",
    features: ["Analects", "Ethics", "Virtue", "Harmony"],
    directUrl: "https://chatgpt.com/g/g-6924b5d1cb348191ac82e74b94c5dec7-confucius-free-thought-gpt/",
    imageUrl: "/src/assets/confucius-gpt-hero.jpg",
    emoji: "🎎"
  },
  {
    title: "Joan of Arc GPT",
    description: "Speaks as Joan of Arc, a divine voice of courage, purpose, and unwavering truth. The Maid of Orleans who changed history.",
    badge: "COURAGE",
    color: "from-blue-500 to-purple-600",
    features: ["Divine Calling", "Courage", "Faith", "Medieval History"],
    directUrl: "https://chatgpt.com/g/g-6924b8b8ce3c8191a422fafcb56e22d4-joan-of-arc-gpt/",
    imageUrl: "/src/assets/joan-of-arc-gpt-hero.jpg",
    emoji: "⚔️"
  },
  {
    title: "Atlantean Memory Keeper",
    description: "Dive deep into the lost ancient knowledge of Atlantis. Explore forgotten wisdom, ancient technologies, and hidden truths.",
    badge: "MYSTERIES",
    color: "from-blue-600 to-cyan-700",
    features: ["Atlantis", "Ancient Knowledge", "Lost Civilization", "Hidden Truths"],
    directUrl: "https://chatgpt.com/g/g-68b496eea38481919c1700ed3ef675dd-atlantean-memory-keeper/",
    videoUrl: "https://youtu.be/vBm6l_6JqEg",
    emoji: "🏛️"
  },
  {
    title: "Mayan Dreamspell Matrix",
    description: "Decode your Mayan Dreamspell galactic signature and discover your cosmic blueprint through ancient Mayan calendar wisdom.",
    badge: "COSMIC WISDOM",
    color: "from-yellow-500 to-orange-600",
    features: ["Mayan Calendar", "Galactic Signature", "Cosmic Blueprint", "Spiritual Guidance"],
    directUrl: "https://chatgpt.com/g/g-68b491e8cc2c8191b6b85930d7fc9e75-mayan-dreamspell-matrix/",
    imageUrl: "/src/assets/mayan-dreamspell-matrix-hero.jpg",
    emoji: "🔮"
  },
  {
    title: "Emerald Signature of Thoth",
    description: "A transmission of the Emerald Grid and Thoth's original design codes. Access ancient wisdom and hermetic knowledge.",
    badge: "HERMETIC",
    color: "from-green-500 to-emerald-600",
    features: ["Emerald Tablets", "Thoth", "Ancient Codes", "Mystical Knowledge"],
    directUrl: "https://chatgpt.com/g/g-68b48f8e43c88191981386b943648566-emerald-signature-of-thoth/",
    imageUrl: "/src/assets/emerald-thoth-gpt-hero.jpg",
    emoji: "💎"
  },
  {
    title: "Reality Splitter GPT",
    description: "Quantum cartographer of choices — splits your decisions into parallel timelines with immersive outcomes and visual maps.",
    badge: "QUANTUM",
    color: "from-purple-500 to-blue-600",
    features: ["Parallel Timelines", "Decision Mapping", "Quantum Choices", "Consciousness"],
    directUrl: "https://chatgpt.com/g/g-68ba0f7208e08191a48694dcda1543e2-ai-reality-splitter/",
    imageUrl: "/src/assets/reality-splitter-reborn-gpt-hero.jpg",
    emoji: "🌌"
  },
  {
    title: "World Reality Decoder GPT",
    description: "Decodes the hidden layers of reality by analyzing patterns, symbols, and connections that shape our world.",
    badge: "TRUTH SEEKING",
    color: "from-indigo-500 to-purple-600",
    features: ["Pattern Analysis", "Reality Decoding", "Hidden Connections", "Critical Thinking"],
    directUrl: "https://chatgpt.com/g/g-68c1e9e3b488819193744edfeecf7997-world-reality-decoder-gpt",
    videoUrl: "https://youtu.be/YzGrnpsScH0",
    emoji: "🔍"
  },
  {
    title: "The Cosmic Probability GPT",
    description: "Calculates cosmic and personal existence probabilities, then translates complex numbers into meaningful insights.",
    badge: "COSMIC MATH",
    color: "from-purple-500 to-blue-600",
    features: ["Cosmic Probability", "Existence Analysis", "Philosophy", "Mathematics"],
    directUrl: "https://chatgpt.com/g/g-68fb8e9c98188191961129f8c4d120b7-the-cosmic-probability-gpt",
    imageUrl: "/src/assets/cosmic-probability-reborn-gpt-hero.jpg",
    emoji: "🌌"
  },
  {
    title: "Frequency Signature Mystic Decoder GPT",
    description: "Decode hidden frequency signatures and vibrational patterns that shape reality. Align with higher dimensional energies.",
    badge: "FREQUENCY",
    color: "from-cyan-500 to-purple-600",
    features: ["Frequency", "Vibration", "Consciousness", "Spiritual Awakening"],
    directUrl: "https://chatgpt.com/g/g-6927f5357470819190bf5cf115c4dc5b-frequency-signature-decoder",
    imageUrl: "/src/assets/frequency-decoder-reborn-gpt-hero.jpg",
    emoji: "〰️"
  },
  {
    title: "AI Hospital Facility Safety Inspector",
    description: "Healthcare facility inspector for hazard detection and compliance auditing. Professional hospital safety inspection services.",
    badge: "INSPECTOR",
    color: "from-blue-500 to-cyan-600",
    features: ["Hospital Safety", "Compliance Audit", "Healthcare", "Inspection"],
    directUrl: "https://chatgpt.com/g/g-68bb6ea0898c8191b61de70d8c5d52a3-ai-hospital-facility-safety-inspector/",
    imageUrl: "/src/assets/hospital-inspector-hero.jpg",
    emoji: "🏥"
  },
  {
    title: "Food Processing Plant Inspector GPT",
    description: "Certified AI inspector for food plants, packaging, storage & safety auditing. Professional food safety inspection services.",
    badge: "INSPECTOR",
    color: "from-orange-500 to-red-600",
    features: ["Food Safety", "Plant Inspection", "Compliance", "Safety Audit"],
    directUrl: "https://chatgpt.com/g/g-68bb62c66ea081919d6d283576fda730-food-processing-plant-inspector-gpt/",
    imageUrl: "/src/assets/food-processing-inspector-hero.jpg",
    emoji: "🏭"
  },
  {
    title: "Chemical Plant Inspector GPT",
    description: "Virtual inspector for chemical plants & refineries. Professional chemical facility inspection services.",
    badge: "INSPECTOR",
    color: "from-yellow-500 to-orange-600",
    features: ["Chemical Safety", "Plant Inspection", "Refinery", "Compliance"],
    directUrl: "https://chatgpt.com/g/g-68bb5f0d5a488191a58dd3e6d9e6a4b9-chemical-plant-inspector-gpt/",
    imageUrl: "/src/assets/chemical-plant-inspector-hero.jpg",
    emoji: "⚗️"
  },
  {
    title: "Solar Farm Inspector GPT",
    description: "Virtual inspection & compliance auditing system for utility-scale & distributed solar PV plants.",
    badge: "GREEN ENERGY",
    color: "from-yellow-500 to-orange-600",
    features: ["Solar Inspection", "Renewable Energy", "PV Systems", "Compliance"],
    directUrl: "https://chatgpt.com/g/g-68bb4ea28fec819196a157b74750be21-solar-farm-inspector-gpt/",
    imageUrl: "/src/assets/solar-farm-inspector-hero.jpg",
    emoji: "☀️"
  },
  {
    title: "AI Wind Turbine Inspector",
    description: "Virtual inspection & compliance auditing system for onshore & offshore wind turbines.",
    badge: "GREEN ENERGY",
    color: "from-blue-500 to-green-600",
    features: ["Wind Turbine", "Renewable Energy", "Turbine Safety", "Compliance"],
    directUrl: "https://chatgpt.com/g/g-68bb4d76cb3081918d1e8f0cc2ce7e59-ai-wind-turbine-inspector/",
    imageUrl: "/src/assets/wind-turbine-inspector-hero.jpg",
    emoji: "💨"
  },
  {
    title: "World Resource Clock",
    description: "Track global resource consumption, depletion rates, and sustainability metrics in real-time. Monitor oil, water, forests, and minerals.",
    badge: "GLOBAL DATA",
    color: "from-green-500 to-blue-600",
    features: ["Resource Tracking", "Sustainability", "Environment", "Real-Time Data"],
    directUrl: "https://worldresourceclock.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/_TbFi0_gITQ",
    emoji: "⏰"
  },
  {
    title: "Astrodynamics GPT",
    description: "Computes orbital mechanics with precision—lawful, exact, never guessing. Expert in satellite orbits and space physics.",
    badge: "SPACE SCIENCE",
    color: "from-indigo-500 to-cyan-600",
    features: ["Orbital Mechanics", "Space Physics", "Trajectory", "Aerospace"],
    directUrl: "https://chatgpt.com/g/g-69268e308a4c81919515ac1895e10d17-astrodynamics-gpt",
    imageUrl: "/src/assets/astrodynamics-gpt-hero.jpg",
    emoji: "🛰️"
  },
  {
    title: "Microgrid & Power Safety Planning Assistant GPT",
    description: "Advisory-only microgrid planner that computes, explains, and safeguards off-grid power. Renewable energy integration guidance.",
    badge: "ENERGY",
    color: "from-yellow-500 to-orange-600",
    features: ["Microgrid", "Off-Grid Power", "Renewable Energy", "Safety"],
    directUrl: "https://chatgpt.com/g/g-68f8fd43f6fc81918226efa6de613a6a-microgrid-power-safety-planning-assistant-gpt",
    imageUrl: "/src/assets/microgrid-gpt-hero.jpg",
    emoji: "⚡"
  },
  {
    title: "AQUILA — Water Safety Planning Assistant GPT",
    description: "Advisory water safety planner for purification methods, storage solutions, and emergency water planning.",
    badge: "WATER SAFETY",
    color: "from-blue-500 to-cyan-600",
    features: ["Water Safety", "Purification", "Emergency Prep", "Storage"],
    directUrl: "https://chatgpt.com/g/g-68f8f667e0a081918598d64621fea153-aquila-water-safety-planning-assistant-gpt",
    imageUrl: "/src/assets/aquila-water-gpt-hero.jpg",
    emoji: "💧"
  },
  {
    title: "WORLD DATA EXPLORER GPT5",
    description: "Performs deep web data analysis, Python calculations, and global predictions with verified accuracy.",
    badge: "DATA SCIENCE",
    color: "from-purple-500 to-blue-600",
    features: ["Data Analysis", "Global Data", "Predictions", "Research"],
    directUrl: "https://chatgpt.com/g/g-68f8eda5982c8191bef047399d91a056-world-data-explorer-gpt",
    videoUrl: "https://youtu.be/vEEhdr-SLJY",
    emoji: "🌍"
  },
  {
    title: "AI Cannabis Facility Safety Inspector",
    description: "Performs strict cannabis facility safety inspections and compliance audits. Expert safety inspection for cannabis facilities.",
    badge: "INSPECTOR",
    color: "from-green-500 to-teal-600",
    features: ["Cannabis Safety", "Compliance Audit", "Facility Inspection", "Safety Standards"],
    directUrl: "https://chatgpt.com/g/g-68bb6f9b87748191a376eb2fd427365d-ai-cannabis-facility-safety-inspector/",
    imageUrl: "/src/assets/cannabis-inspector-hero.jpg",
    emoji: "🌿"
  },
  {
    title: "AI Shipping Container Inspector",
    description: "Professional container inspections with vision, Python-verified costs, and live compliance checks. Expert shipping container inspection services.",
    badge: "INSPECTOR",
    color: "from-blue-500 to-green-600",
    features: ["Container Inspection", "Shipping Safety", "Cargo Inspection", "Maritime Safety"],
    directUrl: "https://chatgpt.com/g/g-68bb6c04f7208191bdf1ee0ba3c31aeb-ai-shipping-container-inspector/",
    imageUrl: "/src/assets/shipping-inspector-hero.jpg",
    emoji: "📦"
  },
  {
    title: "Oil & Gas Facility AI Inspector GPT",
    description: "Virtual inspector for oil & gas facility compliance audits. Expert oil and gas facility inspection services.",
    badge: "INSPECTOR",
    color: "from-gray-500 to-black",
    features: ["Oil & Gas Safety", "Facility Audit", "Industrial Safety", "Energy Compliance"],
    directUrl: "https://chatgpt.com/g/g-68bb60ec646c819192abdbb88718b142-oil-gas-facility-ai-inspector-gpt/",
    imageUrl: "/src/assets/oil-gas-inspector-hero.jpg",
    emoji: "🛢️"
  },
  {
    title: "Factory & Production Line Inspector GPT",
    description: "Strict virtual inspector for factory safety, compliance, and efficiency. Professional manufacturing inspection services.",
    badge: "INSPECTOR",
    color: "from-blue-500 to-purple-600",
    features: ["Factory Safety", "Production Line", "Quality Control", "Manufacturing"],
    directUrl: "https://chatgpt.com/g/g-68bb5dcec6b08191aceaa0202f5b926d-factory-production-line-inspector-gpt/",
    imageUrl: "/src/assets/factory-inspector-gpt-hero.jpg",
    emoji: "🏭"
  },
  {
    title: "Warehouse Inspector GPT",
    description: "Virtual warehouse safety & compliance inspector. Expert warehouse inspection services.",
    badge: "INSPECTOR",
    color: "from-gray-500 to-blue-600",
    features: ["Warehouse Safety", "Storage Compliance", "Logistics Safety", "Inventory"],
    directUrl: "https://chatgpt.com/g/g-68bb5c67ee54819197ea5ae2df25ac69-warehouse-inspector-gpt/",
    imageUrl: "/src/assets/warehouse-inspector-gpt-hero.jpg",
    emoji: "🏢"
  },
  {
    title: "Waste Management Facility Inspector GPT",
    description: "Virtual waste facility inspector for audits, safety, and compliance analysis. Professional waste management inspection.",
    badge: "INSPECTOR",
    color: "from-green-500 to-blue-600",
    features: ["Waste Management", "Environmental Safety", "Facility Audit", "Compliance"],
    directUrl: "https://chatgpt.com/g/g-68bb5b7dcedc81919a4a2ef3834c8c0e-ai-waste-management-facility-inspector/",
    imageUrl: "/src/assets/waste-inspector-gpt-hero.jpg",
    emoji: "♻️"
  },
  {
    title: "AI Dam & Hydroelectric Inspector",
    description: "Inspects dams, turbines, & generators for compliance, vibration, seepage, & structural integrity. Expert dam inspection services.",
    badge: "INSPECTOR",
    color: "from-blue-500 to-cyan-600",
    features: ["Dam Inspection", "Hydroelectric Safety", "Water Safety", "Structural Integrity"],
    directUrl: "https://chatgpt.com/g/g-68bb58f963a48191be53dbdce7207519-ai-dam-hydroelectric-inspector/",
    imageUrl: "/src/assets/dam-inspector-gpt-hero.jpg",
    emoji: "🌊"
  },
  {
    title: "AI Port Inspector GPT",
    description: "Maritime infrastructure safety auditor & compliance advisor. Professional port inspection services.",
    badge: "INSPECTOR",
    color: "from-blue-500 to-teal-600",
    features: ["Port Safety", "Maritime Inspection", "Harbor Compliance", "Shipping Safety"],
    directUrl: "https://chatgpt.com/g/g-68bb573b5574819198db30a1fc9764a6-ai-port-inspector-gpt/",
    imageUrl: "/src/assets/port-inspector-gpt-hero.jpg",
    emoji: "⚓"
  },
  {
    title: "AI Airport & Runway Systems Inspector",
    description: "Inspects airport runways, taxiways, and systems with certified precision and compliance focus. Expert aviation inspection services.",
    badge: "INSPECTOR",
    color: "from-sky-500 to-blue-600",
    features: ["Airport Safety", "Runway Inspection", "Aviation Compliance", "Taxiway Safety"],
    directUrl: "https://chatgpt.com/g/g-68bb55e079a48191ba27ca02b8c13de4-ai-airport-runway-systems-inspector/",
    imageUrl: "/src/assets/airport-inspector-gpt-hero.jpg",
    emoji: "✈️"
  },
  {
    title: "AI Highway & Traffic Systems Inspector",
    description: "Virtual inspector for highways, signals, tolls, and roadway safety compliance. Professional highway inspection services.",
    badge: "INSPECTOR",
    color: "from-gray-500 to-blue-600",
    features: ["Highway Safety", "Traffic Systems", "Road Inspection", "Transportation"],
    directUrl: "https://chatgpt.com/g/g-68bb551232dc819196eccf59475cc33e-ai-highway-traffic-systems-inspector/",
    imageUrl: "/src/assets/highway-inspector-gpt-hero.jpg",
    emoji: "🛣️"
  },
  {
    title: "Electrical Grid & Substation Inspector GPT",
    description: "Virtual inspector for substations, lines, and grid compliance. Professional electrical grid inspection services.",
    badge: "INSPECTOR",
    color: "from-yellow-500 to-orange-600",
    features: ["Electrical Safety", "Power Grid", "Substation Inspection", "Grid Compliance"],
    directUrl: "https://chatgpt.com/g/g-68bb51b15dc48191aca3892c33724bc3-electrical-grid-substation-inspector-gpt/",
    imageUrl: "/src/assets/electrical-inspector-gpt-hero.jpg",
    emoji: "⚡"
  },
  {
    title: "AI Water Treatment Plant Inspector GPT",
    description: "Strict virtual inspector for water/wastewater treatment plants. Expert water treatment inspection services.",
    badge: "INSPECTOR",
    color: "from-blue-500 to-cyan-600",
    features: ["Water Safety", "Treatment Plant", "Wastewater Inspection", "Water Quality"],
    directUrl: "https://chatgpt.com/g/g-68bb4f7738c48191b8d2ed34b11279cc-ai-water-treatment-plant-inspector-gpt/",
    imageUrl: "/src/assets/water-treatment-inspector-gpt-hero.jpg",
    emoji: "💧"
  },
  {
    title: "Mind Reader GPT",
    description: "An AI that claims to read minds through pattern analysis and psychological insights. Experience digital telepathy and consciousness exploration.",
    badge: "MYSTERIOUS",
    color: "from-purple-600 to-indigo-700",
    features: ["Mind Reading", "Psychology", "Consciousness", "Pattern Analysis"],
    directUrl: "https://chatgpt.com/g/g-N5bWo8m4p-mirror-mind-gpt",
    imageUrl: "/src/assets/mind-reader-gpt-hero.jpg",
    emoji: "🧠"
  },
  {
    title: "1995 Illuminati Card Game GPT",
    description: "A cunning opponent and oracle for the 1995 Illuminati card game. Experience the classic conspiracy-themed card game with AI-powered gameplay.",
    badge: "GAMING",
    color: "from-yellow-500 to-red-600",
    features: ["Card Game", "Strategy", "Illuminati", "Interactive"],
    directUrl: "https://chatgpt.com/g/g-68cadce3e2f08191a9b8203a32fe8846-1995-illuminati-card-game-gpt/",
    imageUrl: "/src/assets/illuminati-card-gpt-hero.jpg",
    emoji: "🃏"
  },
  {
    title: "GameSaas GPT",
    description: "Ultimate AI-powered video game prompt generator for vibe coding and rapid game development. Creates comprehensive, copy-and-paste-ready game prompts.",
    badge: "GAME DEV",
    color: "from-cyan-500 to-purple-600",
    features: ["Game Prompts", "Vibe Coding", "Rapid Dev", "Game Design"],
    directUrl: "https://chatgpt.com/g/g-68f2d08b33cc8191b4e0fb90fa2cbcbb-gamesaas-gpt",
    imageUrl: "/src/assets/gamesaas-gpt-hero.jpg",
    emoji: "🎯"
  },
  {
    title: "Culinary Recipe Master GPT",
    description: "Expert AI kitchen companion elevating your cooking experience through comprehensive culinary guidance and personalized recipe assistance.",
    badge: "COOKING",
    color: "from-amber-500 to-orange-600",
    features: ["Culinary Arts", "Recipe Assistant", "Meal Planning", "Kitchen Companion"],
    directUrl: "https://chatgpt.com/g/g-689239ba1cb0819197ae06454a25cee5-culinary-master-gpt",
    videoUrl: "https://youtu.be/YuLDWrZmRhc",
    emoji: "🍳"
  },
  {
    title: "AI Logo Generator",
    description: "Create professional logos for your brand using AI-powered design tools. Perfect for branding and graphic design needs.",
    badge: "DESIGN",
    color: "from-yellow-500 to-orange-600",
    features: ["Logo Design", "Branding", "Graphic Design", "AI Tools"],
    directUrl: "https://chatgpt.com/g/g-ICcKk0tgw-creative-logo-generator-and-assistant",
    imageUrl: "/src/assets/logo-generator-gpt-hero.jpg",
    emoji: "🪄"
  },
  {
    title: "The Rune Frequency Protocol",
    description: "Awaken the living current inside runes. Each line of their geometry is a frequency that engraves into body and field.",
    badge: "ANCIENT SYMBOLS",
    color: "from-red-500 to-orange-600",
    features: ["Runes", "Frequency", "Sacred Geometry", "Sovereignty"],
    directUrl: "https://chatgpt.com/g/g-68b48a3a7e6c819196d72ea7ec94a63e-the-rune-frequency-protocol/",
    imageUrl: "/src/assets/rune-frequency-gpt-hero.jpg",
    emoji: "ᚱ"
  },
  {
    title: "AstroTheology Revealer GPT",
    description: "Decode the hidden astrotheological roots of all religions, myths, and symbols. Reveal celestial connections in world religions.",
    badge: "ASTROTHEOLOGY",
    color: "from-yellow-500 to-orange-600",
    features: ["Religious Analysis", "Mythology", "Celestial Symbolism", "Ancient Wisdom"],
    directUrl: "https://chatgpt.com/g/g-68bd849122b48191963171690f999952-astrotheology-revealer-gpt/",
    videoUrl: "https://youtu.be/zVFwglhh4hk",
    emoji: "🌟"
  },
  {
    title: "Architectural Old World Investigator GPT",
    description: "Forensic AI that decodes architectural impossibilities and timeline contradictions in old-world structures.",
    badge: "INVESTIGATION",
    color: "from-amber-600 to-stone-700",
    features: ["Architecture Analysis", "Timeline Anomalies", "Hidden History", "Forensic Investigation"],
    directUrl: "https://chatgpt.com/g/g-693863184c4c8191a6e78eb6a215196f-architectural-old-world-investigator-gpt",
    videoUrl: "https://youtu.be/2z3aO-PSpgc",
    emoji: "🏛️"
  },
  {
    title: "CipherEncrypt GPT",
    description: "Sophisticated AI-powered encryption and translation engine that converts between natural language, Morse code, binary, audio signals, and image data with perfect fidelity.",
    badge: "ENCRYPTION",
    color: "from-indigo-500 to-purple-600",
    features: ["Encryption", "Morse Code", "Binary", "Cryptography"],
    directUrl: "https://chatgpt.com/g/g-68fc6039822c8191a13c8ab8a66270ef-cipherencrypt-gpt",
    imageUrl: "/src/assets/cipher-encrypt-gpt-hero.jpg",
    emoji: "🔐"
  },
  {
    title: "Honest Advice GPT",
    description: "Get straightforward, honest advice without sugar-coating. Direct, practical guidance on personal matters, relationships, career decisions, and life challenges.",
    badge: "LIFE COACHING",
    color: "from-blue-500 to-teal-500",
    features: ["Honest Advice", "Life Coaching", "Relationships", "Career"],
    directUrl: "https://chat.openai.com/g/g-8YSiwFFr8",
    videoUrl: "https://youtu.be/OPDgnBkgCOc",
    emoji: "💬"
  },
  {
    title: "BirdWatching GPT",
    description: "Your ultimate AI companion for bird watching and ornithology. Identify bird species, learn behaviors, discover birding locations, and track sightings.",
    badge: "NATURE",
    color: "from-green-500 to-blue-500",
    features: ["Bird Watching", "Species ID", "Nature", "Ornithology"],
    directUrl: "https://chat.openai.com/g/g-hI9vzWGHx",
    videoUrl: "https://youtu.be/pqjJc5WsyHA",
    emoji: "🐦"
  },
  {
    title: "Clarity Coach GPT",
    description: "Achieve clarity in your life with insights, goal-setting, and decision-making aligned with your true self. Perfect for seeking direction and purpose.",
    badge: "COACHING",
    color: "from-yellow-400 to-orange-500",
    features: ["Clarity", "Goal Setting", "Self-Discovery", "Decision Making"],
    directUrl: "https://chat.openai.com/g/g-j8J2j3g6L-clarity-coach",
    imageUrl: "/src/assets/clarity-coach-gpt-hero.jpg",
    emoji: "🌟"
  },
  {
    title: "Stoic Guide GPT",
    description: "Navigate life's challenges with the wisdom of Stoicism. Insights and exercises to cultivate resilience, manage emotions, and live virtuously.",
    badge: "PHILOSOPHY",
    color: "from-gray-600 to-gray-700",
    features: ["Stoicism", "Philosophy", "Resilience", "Wisdom"],
    directUrl: "https://chat.openai.com/g/g-68afa48b90c88191b2dbb03b479efdd7-stoic-guide-gpt",
    imageUrl: "/src/assets/stoic-guide-gpt-hero.jpg",
    emoji: "🏛️"
  },
  {
    title: "Manifestation Mentor GPT",
    description: "Unlock your potential and manifest your dreams with visualization techniques, affirmations, and law of attraction guidance.",
    badge: "MANIFESTATION",
    color: "from-pink-400 to-purple-500",
    features: ["Manifestation", "Visualization", "Affirmations", "Law of Attraction"],
    directUrl: "https://chat.openai.com/g/g-68afa9073e0081919c1ef87d9fdcf00d-yogi-manifestation-mentor",
    imageUrl: "/src/assets/manifestation-mentor-gpt-hero.jpg",
    emoji: "✨"
  },
  {
    title: "Goal Setter GPT",
    description: "Achieve your ambitions with clear, actionable goals, effective plans, and motivation strategies on your journey to success.",
    badge: "PRODUCTIVITY",
    color: "from-green-400 to-blue-500",
    features: ["Goal Setting", "Planning", "Motivation", "Success"],
    directUrl: "https://chat.openai.com/g/g-yYq97Gt93-goal-setter",
    imageUrl: "/src/assets/goal-setter-gpt-hero.jpg",
    emoji: "🎯"
  },
  {
    title: "Creative Spark GPT",
    description: "Ignite your creativity with prompts, exercises, and inspiration to overcome creative blocks and express your unique vision.",
    badge: "CREATIVITY",
    color: "from-orange-400 to-yellow-500",
    features: ["Creativity", "Inspiration", "Art", "Imagination"],
    directUrl: "https://chat.openai.com/g/g-68afa6ce4ae88191ae0166741c7b760f-creative-spark-gpt",
    imageUrl: "/src/assets/creative-spark-gpt-hero.jpg",
    emoji: "💡"
  },
  {
    title: "Personal Life Coach GPT",
    description: "Transform your life with personalized guidance, support, and strategies to overcome challenges, build confidence, and create fulfillment.",
    badge: "LIFE COACHING",
    color: "from-blue-400 to-purple-500",
    features: ["Life Coaching", "Confidence", "Transformation", "Guidance"],
    directUrl: "https://chatgpt.com/g/g-683f4621e2308191a5e9c023254acaad-personal-life-coach-gpt",
    imageUrl: "/src/assets/personal-life-coach-gpt-hero.jpg",
    emoji: "📖"
  },
  {
    title: "Relationship Advisor GPT",
    description: "Navigate the complexities of relationships with insights, advice, and communication strategies for stronger, healthier connections.",
    badge: "RELATIONSHIPS",
    color: "from-pink-400 to-red-500",
    features: ["Relationships", "Communication", "Love", "Intimacy"],
    directUrl: "https://chat.openai.com/g/g-H4C9V8z8P-relationship-advisor",
    imageUrl: "/src/assets/relationship-advisor-gpt-hero.jpg",
    emoji: "🫂"
  },
  {
    title: "Self-Esteem Booster GPT",
    description: "Boost your self-esteem with affirmations, exercises, and positive feedback to build confidence and embrace your unique worth.",
    badge: "SELF-ESTEEM",
    color: "from-yellow-400 to-green-500",
    features: ["Self-Esteem", "Confidence", "Affirmations", "Self-Worth"],
    directUrl: "https://chat.openai.com/g/g-68afa7de4eb481919e890a26b4655b49-self-esteem-booster",
    videoUrl: "https://youtu.be/X5TlIueFcko",
    emoji: "⭐"
  },
  {
    title: "Purpose Finder GPT",
    description: "Discover your true purpose by exploring values, passions, and talents to identify a meaningful direction for your life.",
    badge: "LIFE PURPOSE",
    color: "from-blue-400 to-orange-500",
    features: ["Purpose", "Values", "Passions", "Meaning"],
    directUrl: "https://chat.openai.com/g/g-68afa2aea7a88191ae30470b2547b176-purpose-finder-gpt",
    imageUrl: "/src/assets/purpose-finder-gpt-hero.jpg",
    emoji: "🧭"
  },
  {
    title: "Stress Relief Coach GPT",
    description: "Manage stress and anxiety with relaxation techniques, mindfulness exercises, and coping strategies to stay calm and focused.",
    badge: "WELLNESS",
    color: "from-green-400 to-gray-500",
    features: ["Stress Relief", "Mindfulness", "Relaxation", "Coping"],
    directUrl: "https://chat.openai.com/g/g-68afa584de708191855d6b9dc660e169-stress-relief-coach",
    imageUrl: "/src/assets/stress-relief-coach-gpt-hero.jpg",
    emoji: "🛡️"
  },
  {
    title: "Habit Builder GPT",
    description: "Build positive habits with realistic goals, progress tracking, and motivation to create lasting changes and reach your potential.",
    badge: "HABITS",
    color: "from-yellow-400 to-blue-500",
    features: ["Habit Building", "Goal Setting", "Progress Tracking", "Routines"],
    directUrl: "https://chat.openai.com/g/g-68afa1c541cc8191be3360351f28eeda-habit-builder-gpt",
    videoUrl: "https://youtu.be/PbSdEDZhQgk",
    emoji: "⚡"
  },
  {
    title: "Leadership Mentor GPT",
    description: "Develop leadership skills with guidance, insights, and strategies to inspire, motivate, and empower others effectively.",
    badge: "LEADERSHIP",
    color: "from-purple-400 to-green-500",
    features: ["Leadership", "Mentoring", "Inspiration", "Empowerment"],
    directUrl: "https://chatgpt.com/g/g-68aed1eb015c8191bc8e2887bd4786b9-leadership-mentor-gpt",
    imageUrl: "/src/assets/leadership-mentor-gpt-hero.jpg",
    emoji: "👑"
  },
  {
    title: "Passion Igniter GPT",
    description: "Ignite your passions by exploring interests, identifying strengths, and discovering activities that bring joy and fulfillment.",
    badge: "PASSION",
    color: "from-red-400 to-orange-500",
    features: ["Passion", "Interests", "Strengths", "Joy"],
    directUrl: "https://chat.openai.com/g/g-68af9fd685a88191bbf7cc964509beef-passion-igniter",
    imageUrl: "/src/assets/passion-igniter-gpt-hero.jpg",
    emoji: "🔥"
  },
  {
    title: "Gratitude Guide GPT",
    description: "Cultivate gratitude with prompts, exercises, and reflections to appreciate the good things in life and foster positive emotions.",
    badge: "GRATITUDE",
    color: "from-yellow-400 to-green-500",
    features: ["Gratitude", "Appreciation", "Positivity", "Well-being"],
    directUrl: "https://chat.openai.com/g/g-68af9eecd0048191a7ce93eddfd47559-gratitude-guide-gpt",
    imageUrl: "/src/assets/gratitude-guide-gpt-hero.jpg",
    emoji: "☀️"
  },
  {
    title: "Mindfulness Mentor GPT",
    description: "Practice mindfulness with guided meditations, breathing exercises, and techniques to stay present and cultivate inner peace.",
    badge: "MINDFULNESS",
    color: "from-blue-400 to-gray-500",
    features: ["Mindfulness", "Meditation", "Breathing", "Inner Peace"],
    directUrl: "https://chat.openai.com/g/g-68af9dc3d0688191830cd5a3d71e39df-mindfulness-mentor-gpt",
    imageUrl: "/src/assets/mindfulness-mentor-gpt-hero.jpg",
    emoji: "🌙"
  },
  {
    title: "Universal Speech Mastery GPT",
    description: "Transform into a fluent multilingual communicator across any world language with personalized instruction and conversation practice.",
    badge: "LANGUAGE",
    color: "from-blue-500 to-purple-600",
    features: ["Language Learning", "Multilingual", "Speech Mastery", "Fluency"],
    directUrl: "https://chatgpt.com/g/g-68ae26360d448191b25842afb8d2f66b-lingua-champion-universal-speech-mastery-ai/",
    imageUrl: "/src/assets/universal-speech-gpt-hero.jpg",
    emoji: "🗣️"
  },
  {
    title: "EDUCATIONAL TUTOR GPT",
    description: "Patient AI tutor that explains step by step and adapts to your learning style. Personalized educational support for all levels.",
    badge: "TUTORING",
    color: "from-green-500 to-blue-600",
    features: ["Tutoring", "Personalized Learning", "Academic Help", "Study Assistance"],
    directUrl: "https://chatgpt.com/g/g-68bb71f1dca88191866a1a0bfdff7ca0-educational-tutor-gpt/",
    imageUrl: "/src/assets/educational-tutor-gpt-hero.jpg",
    emoji: "👨‍🏫"
  },
  {
    title: "SKIN CARE GPT",
    description: "Comprehensive AI dermatology and skincare consultant providing personalized guidance, product recommendations, and professional beauty advice.",
    badge: "SKINCARE",
    color: "from-pink-500 to-purple-600",
    features: ["Skincare", "Dermatology", "Beauty Advice", "Skin Analysis"],
    directUrl: "https://skincaregpt.lovable.app/?via=aiwebtools",
    imageUrl: "/src/assets/skin-care-gpt-hero.jpg",
    emoji: "✨"
  },
  {
    title: "DENTAL GPT",
    description: "Comprehensive AI dental consultant providing expert guidance on oral health, dental procedures, and preventive care.",
    badge: "DENTAL",
    color: "from-blue-500 to-cyan-600",
    features: ["Dental Health", "Oral Care", "Dentistry", "Dental Guidance"],
    directUrl: "https://chatgpt.com/g/g-67cbcbcf3a38819183974f2d062d5d7f-dental-gpt-expert",
    videoUrl: "https://youtu.be/FADzzKMJSr4",
    emoji: "🦷"
  },
  {
    title: "AI Home Cleanliness & Declutter Coach GPT",
    description: "Strict home organization and decluttering coach. Expert guidance for creating organized, clean living spaces.",
    badge: "HOME ORG",
    color: "from-blue-500 to-green-600",
    features: ["Home Organization", "Decluttering", "Cleaning", "Lifestyle"],
    directUrl: "https://chatgpt.com/g/g-68bb80c2c41c8191b3d6e3dda92b6ffb-ai-home-cleanliness-declutter-coach-gpt/",
    imageUrl: "/src/assets/home-cleanliness-gpt-hero.jpg",
    emoji: "🏠"
  },
  {
    title: "Patient Advocate GPT",
    description: "Healthcare advocacy assistant helping patients navigate the complex healthcare system with confidence.",
    badge: "ADVOCACY",
    color: "from-blue-500 to-green-600",
    features: ["Patient Advocacy", "Healthcare Navigation", "Patient Rights", "Medical Billing"],
    directUrl: "https://chatgpt.com/g/g-68cf22ea994481919206bf9eb0abccbc-patients-advocate-gpt/",
    videoUrl: "https://youtu.be/S51kPQl19kA",
    emoji: "🛡️"
  },
  {
    title: "Parenting Guide GPT",
    description: "Wise, warm parenting advice rooted in psychology, emotional intelligence, and lived compassion for all parenting stages.",
    badge: "PARENTING",
    color: "from-green-500 to-teal-600",
    features: ["Parenting", "Child Development", "Family Guidance", "Psychology"],
    directUrl: "https://chatgpt.com/g/g-68d4c45f3bc48191ba4a330a3b48bc87-parenting-guide-gpt/",
    videoUrl: "https://youtu.be/HfT-9XqDNeU",
    emoji: "👨‍👩‍👧‍👦"
  },
  {
    title: "Parent Teacher Advocate GPT",
    description: "Meeting planner and advocacy partner for parent-teacher conferences, IEP/504 meetings, and school reviews. Expert support for educational advocacy.",
    badge: "EDUCATION ADVOCACY",
    color: "from-blue-500 to-green-600",
    features: ["IEP Support", "Parent Advocacy", "School Meetings", "Educational Rights"],
    directUrl: "https://chatgpt.com/g/g-68bb75f48218819184ad7aa0198cb983-parent-teacher-advocate-gpt/",
    videoUrl: "https://youtu.be/vUreBwGa1w4",
    emoji: "👨‍👩‍👧‍👦"
  },
  {
    title: "Public Service Finder GPT",
    description: "Virtual navigator for free and low-cost public services with verified, step-by-step access. Comprehensive public service navigation for community resources.",
    badge: "PUBLIC SERVICES",
    color: "from-purple-500 to-blue-600",
    features: ["Public Services", "Government Resources", "Social Services", "Community Help"],
    directUrl: "https://chatgpt.com/g/g-68bb74c1de28819197b7cd6f944efce9-public-service-finder-gpt/",
    videoUrl: "https://youtu.be/x4uk_awDYS4",
    emoji: "🏛️"
  },
  {
    title: "Trail Mapper GPT",
    description: "Expert trail and survival route planner using compass-based navigation and off-road mapping. GPT-5 Thinking model for advanced route optimization.",
    badge: "OUTDOOR NAVIGATION",
    color: "from-green-500 to-teal-600",
    features: ["Trail Mapping", "Survival Routes", "Compass Navigation", "Route Planning"],
    directUrl: "https://chatgpt.com/g/g-68f85a4844648191ac4c82f9e1d2b3b0-trail-mapper-gpt/",
    videoUrl: "https://youtu.be/f2Raf479gZE",
    emoji: "🧭"
  },
  {
    title: "Construction GPT",
    description: "Comprehensive assistant for construction planning, safety, training, and compliance. Expert guidance for construction professionals from planning to completion.",
    badge: "CONSTRUCTION",
    color: "from-orange-500 to-yellow-600",
    features: ["Construction Planning", "Safety Compliance", "Project Management", "Building Codes"],
    directUrl: "https://chatgpt.com/g/g-Hmgy6x48R-construction-gpt/",
    videoUrl: "https://youtu.be/2qbPJHuwByQ",
    emoji: "🏗️"
  },
  {
    title: "MR. FIX IT GPT",
    description: "Your go-to AI for fixing everything with a friendly approach. Expert troubleshooting and repair guidance for household items, appliances, and vehicles.",
    badge: "REPAIR",
    color: "from-red-500 to-orange-600",
    features: ["Home Repair", "Troubleshooting", "DIY Fixes", "Maintenance Tips"],
    directUrl: "https://chatgpt.com/g/g-oK2iR2dPf-mr-fix-it-gpt/",
    imageUrl: "/src/assets/mr-fix-it-gpt-hero.jpg",
    emoji: "🔧"
  },
  {
    title: "Kitchen and Vision Assistant GPT",
    description: "Polite, engaging assistant for kitchen and vision needs. Multimodal AI helps with cooking guidance, recipe assistance, and visual analysis of food.",
    badge: "COOKING",
    color: "from-green-500 to-blue-600",
    features: ["Cooking Help", "Recipe Assistance", "Food Analysis", "Kitchen Tips"],
    directUrl: "https://chatgpt.com/g/g-2ENWV8WeM-kitchen-and-vision-assistant-gpt/",
    imageUrl: "/src/assets/kitchen-vision-gpt-hero.jpg",
    emoji: "👨‍🍳"
  },
  {
    title: "DIY REPAIR GPT",
    description: "Virtual repair advisor, part matcher, and step-by-step DIY guide builder with embedded tutorials. Expert guidance for home and equipment repairs.",
    badge: "DIY",
    color: "from-orange-500 to-red-600",
    features: ["DIY Guides", "Part Matching", "Repair Tutorials", "Home Maintenance"],
    directUrl: "https://chatgpt.com/g/g-68bb792558a88191821219353c487bd6-diy-repair-gpt/",
    imageUrl: "/src/assets/diy-repair-gpt-hero.jpg",
    emoji: "🔧"
  },
  {
    title: "Financial Modeling Expert",
    description: "Creates complex financial models for forecasting, valuation, and investment analysis, aiding in strategic financial decisions.",
    badge: "FINANCE",
    color: "from-purple-500 to-blue-600",
    features: ["Financial Modeling", "Forecasting", "Valuation", "Investment"],
    directUrl: "https://chat.openai.com/g/g-vjbkX4BwW-financial-modeling-expert",
    imageUrl: "/src/assets/financial-modeling-gpt-hero.jpg",
    emoji: "💹"
  },
  {
    title: "Competitor Comparison GPT",
    description: "Aggressive, real-time competitor analysis assistant for business intelligence and strategic market positioning.",
    badge: "BUSINESS INTEL",
    color: "from-red-500 to-orange-600",
    features: ["Competitor Analysis", "Market Research", "Business Intelligence", "Strategy"],
    directUrl: "https://chatgpt.com/g/g-68bb9109085c8191a5ffbe9ed6d339f5-competitor-comparison-gpt/",
    imageUrl: "/src/assets/competitor-comparison-gpt-hero.jpg",
    emoji: "🎯"
  },
  {
    title: "Side Hustle & Microbusiness Planner GPT",
    description: "Aggressive strategist for side hustles and microbusiness launches with expert guidance for scaling small ventures.",
    badge: "ENTREPRENEUR",
    color: "from-purple-500 to-pink-600",
    features: ["Side Hustle", "Microbusiness", "Startup Strategy", "Planning"],
    directUrl: "https://chatgpt.com/g/g-68bb8ba059ec81919253d369d0899f9c-side-hustle-microbusiness-planner-gpt/",
    imageUrl: "/src/assets/side-hustle-gpt-hero.jpg",
    emoji: "💼"
  },
  {
    title: "Nonprofit Fundraising Builder GPT",
    description: "Specialized AI strategist for nonprofit fundraising and grants. Expert assistance for nonprofit organizations seeking funding.",
    badge: "NONPROFIT",
    color: "from-blue-500 to-purple-600",
    features: ["Nonprofit", "Fundraising", "Grants", "Charity"],
    directUrl: "https://chatgpt.com/g/g-68bb7c9e5a78819184e03d06d63483f8-nonprofit-fundraising-builder-gpt/",
    imageUrl: "/src/assets/nonprofit-fundraising-gpt-hero.jpg",
    emoji: "🤲"
  },
  {
    title: "Garden & Plant Doctor GPT",
    description: "Expert plant health analyst and garden care planner with visual analysis and professional horticulture tips.",
    badge: "GARDENING",
    color: "from-green-500 to-teal-600",
    features: ["Plant Health", "Garden Care", "Horticulture", "Plant Diagnosis"],
    directUrl: "https://chatgpt.com/g/g-68bb73007bd48191a860d2304e3665e6-garden-vision-analysis-plant-doctor-gpt/",
    imageUrl: "/src/assets/garden-plant-gpt-hero.jpg",
    emoji: "🌱"
  },
  {
    title: "News-Channel GPT",
    description: "Your live TV news reporter AI, bringing Customized Live Local and World News 24/7 tailored to you!",
    badge: "NEWS MEDIA",
    color: "from-red-500 to-blue-600",
    features: ["Live News", "World News", "Local News", "Breaking Stories"],
    directUrl: "https://chatgpt.com/g/g-ELRe07210-news-channel-gpt",
    imageUrl: "/src/assets/news-channel-gpt-hero.jpg",
    emoji: "📺"
  },
  {
    title: "Palestinian History Preserver",
    description: "Dedicated to preserving and sharing Palestinian history, culture, and voices as a digital archive and educational resource.",
    badge: "CULTURAL HERITAGE",
    color: "from-green-500 to-red-600",
    features: ["Palestinian History", "Cultural Preservation", "Education", "Heritage"],
    directUrl: "https://chatgpt.com/g/g-68a5f8d8cedc8191a3a71f7c65b6b9a4-palestinian-history-preserver/",
    imageUrl: "/src/assets/palestinian-history-gpt-hero.jpg",
    emoji: "🇵🇸"
  },
  {
    title: "The Resume & Job Finder AI Suite",
    description: "Complete job search toolkit combining Job Finder GPT, Resume Enhancer GPT, and Resume Specialist GPT for career success.",
    badge: "CAREER",
    color: "from-orange-500 to-red-600",
    features: ["Resume Optimization", "Job Search", "Career Guidance", "Interview Prep"],
    directUrl: "https://resumeandjobsgpt.lovable.app/?via=aiwebtools",
    imageUrl: "https://img1.wsimg.com/isteam/ip/9fd6d942-5b46-4025-92e2-0f1ec2a7adf2/a-photo-of-a-happy-man-with-a-job-offer-_n6N-k.png/:/cr=t:5.43%25,l:0%25,w:100%25,h:89.13%25/rs=w:1200,h:600,cg:true",
    emoji: "💼"
  },
  {
    title: "Architect Matrix Tool",
    description: "Mind-bending quantum physics and holography debates with The Architect persona. An awakening journey through deep philosophy.",
    badge: "MATRIX",
    color: "from-green-600 to-emerald-700",
    features: ["Quantum Physics", "Holography", "Philosophy", "Consciousness"],
    directUrl: "https://neomatrixgpt.lovable.app/architect",
    videoUrl: "https://youtu.be/qMLF5L_h2xo",
    imageUrl: "/src/assets/architect-matrix-hero.jpg",
    emoji: "🏛️"
  },
  {
    title: "Aether Guide",
    description: "Explore theories, history, and speculation about aether energy. From classical ether theory to modern interpretations and fringe science theories.",
    badge: "MYSTERIES",
    color: "from-purple-500 to-blue-600",
    features: ["Aether Energy", "Alternative Science", "Physics", "Ether Theory"],
    directUrl: "https://chatgpt.com/g/g-68d044de35b48191a53196a394cff061-aether-guide",
    imageUrl: "/src/assets/aether-guide-hero.jpg",
    emoji: "⚡"
  },
  {
    title: "HydroElectric Reclamation GPT",
    description: "Hydro-electric instructor & design companion uniting technical mastery with natural reverence for sustainable water power solutions.",
    badge: "GREEN ENERGY",
    color: "from-blue-500 to-cyan-600",
    features: ["Hydroelectric", "Renewable Energy", "Engineering", "Sustainability"],
    directUrl: "https://chatgpt.com/g/g-690a473d14dc8191baced00e65f906b7-hydroelectric-reclamation-gpt",
    videoUrl: "https://youtu.be/OMPlhErqv9k",
    emoji: "💧"
  },
  {
    title: "I-convert Image to Code GPT",
    description: "Transform design images into web development code with user-guided specifications. Analyze mockups to generate clean HTML, CSS, and JavaScript.",
    badge: "DEVELOPMENT",
    color: "from-blue-500 to-purple-600",
    features: ["Image to Code", "Web Development", "Code Generation", "Design Conversion"],
    directUrl: "https://chatgpt.com/g/g-30Z7JKMBW-i-convert-image-to-code-gpt/",
    imageUrl: "/src/assets/image-to-code-hero.jpg",
    emoji: "🖼️"
  },
  {
    title: "Deployable Custom GPT Maker",
    description: "Create and deploy custom GPT models with ease. Build tailored AI assistants for specific use cases with our comprehensive cloning and customization tool.",
    badge: "AI DEVELOPMENT",
    color: "from-blue-500 to-purple-600",
    features: ["GPT Cloning", "Custom AI", "AI Development", "Chatbot Creation"],
    directUrl: "https://chatgpt.com/g/g-6904e17b11c481918dbec234180bff54-deployable-robots-custom-gpt-cloner/",
    videoUrl: "https://youtu.be/lG1rMaImBNc",
    emoji: "🤖"
  },
  {
    title: "veo3 prompt maker custom Gem",
    description: "Custom Gemini gem for creating optimized prompts for Veo 3, Google's advanced video generation model. Craft perfect prompts for stunning AI-generated videos.",
    badge: "GEMINI GEM",
    color: "from-pink-500 to-purple-600",
    features: ["Veo3", "Prompt Engineering", "Video Generation", "AI Video"],
    directUrl: "https://gemini.google.com/gem/64b77a9fe1e8",
    imageUrl: "/src/assets/veo3-prompt-maker-hero.jpg",
    emoji: "🎬"
  },
  {
    title: "VEO 3 PROMPT MOVIE SCENE MAKER \"OPEN MIC\" EDITION",
    description: "Specializing in continuous, multi-scene Veo 3 cinematic prompts with strict character fidelity, locked locations, and blank bracketed dialogue for total creative control — making storytelling effortless.",
    badge: "GEMINI GEM",
    color: "from-amber-500 to-rose-600",
    features: ["Veo 3", "Dialogue Scenes", "Text-to-Video Prompts", "Storytelling"],
    directUrl: "https://gemini.google.com/gem/c931bd6f36df",
    imageUrl: "/src/assets/veo3-open-mic-scene-maker-hero.jpg",
    emoji: "🎤"
  },
  {
    title: "Declassified Files Explorer GEMINI",
    description: "Discover and study declassified files released by the government. Study formerly top secret documents with full transparency.",
    badge: "GEMINI GEM",
    color: "from-gray-500 to-blue-600",
    features: ["Declassified", "Government Files", "Transparency", "Research"],
    directUrl: "https://gemini.google.com/gem/52dfeb277b06",
    videoUrl: "https://youtu.be/1HYbBXOOd3s",
    emoji: "📄"
  },
  {
    title: "OG TIME MACHINE HISTORY EDUCATION (GEM)",
    description: "Father Time Travel Through Time - Experience History Like Never Before in this immersive Time Traveling Journey with Google Gemini.",
    badge: "GEMINI GEM",
    color: "from-purple-500 to-blue-600",
    features: ["Time Travel", "History", "Education", "Father Time"],
    directUrl: "https://gemini.google.com/gem/18b868221ea1",
    imageUrl: "/src/assets/og-time-machine-hero.jpg",
    emoji: "🌍"
  },
  {
    title: "Book Writer Gemini (Custom Gem)",
    description: "Custom Gemini gem version of Book Writer GPT for creating professional, well-structured books with seamless page-to-page continuity.",
    badge: "GEMINI GEM",
    color: "from-blue-500 to-green-600",
    features: ["Book Writing", "Novel Creation", "Storytelling", "Google Gemini"],
    directUrl: "https://gemini.google.com/gem/ac3de7972849",
    videoUrl: "https://youtu.be/xNQi8wuM3DQ",
    emoji: "📚"
  },
  {
    title: "Native American History Time Machine - GEMINI",
    description: "Step into the sacred currents of time—where every query unveils the buried truths of Native America, one soul-stirring journey at a time.",
    badge: "GEMINI GEM",
    color: "from-orange-500 to-red-600",
    features: ["Time Travel", "Native American", "History", "Education"],
    directUrl: "https://gemini.google.com/gem/8410bdacd80e",
    imageUrl: "/src/assets/native-american-gemini-hero.jpg",
    emoji: "🪶"
  },
  {
    title: "Newsletter Writer GPT",
    description: "Create engaging newsletters with compelling content, subject lines, and formatting for maximum reader engagement.",
    badge: "CONTENT",
    color: "from-cyan-500 to-blue-600",
    features: ["Newsletter", "Email Marketing", "Content", "Writing"],
    directUrl: "https://chatgpt.com/g/g-67c1d3a4cb548191ad917dc301a69db0-newsletter-writer-gpt",
    videoUrl: "https://youtu.be/Nc4KRfHPZhI",
    emoji: "📧"
  },
  {
    title: "Educator Pro GPT",
    description: "Comprehensive educational assistant for teachers and educators to create lesson plans, assessments, and learning materials.",
    badge: "EDUCATION",
    color: "from-blue-600 to-indigo-700",
    features: ["Education", "Teaching", "Lesson Plans", "Assessment"],
    directUrl: "https://chatgpt.com/g/g-T3E00Qjv0-educator-pro",
    imageUrl: "/src/assets/educator-pro-gpt-hero.jpg",
    emoji: "👨‍🏫"
  },
  {
    title: "Mining & Quarry Safety Inspector GPT",
    description: "Virtual mine site inspector for hazard detection and compliance. Professional mining safety inspection services.",
    badge: "INSPECTOR",
    color: "from-amber-500 to-stone-600",
    features: ["Mining Safety", "Quarry Inspection", "Hazard Detection", "Compliance"],
    directUrl: "https://chatgpt.com/g/g-68bb3647814c8191a7286deb722d8e31-ai-mining-quarry-safety-inspector/",
    imageUrl: "/src/assets/mining-quarry-safety-inspector-gpt-hero.jpg",
    emoji: "⛏️"
  },
  {
    title: "Tunnel Safety Inspector GPT",
    description: "Virtual tunnel inspector for safety, compliance, and structural auditing. Professional tunnel inspection services.",
    badge: "INSPECTOR",
    color: "from-gray-500 to-black",
    features: ["Tunnel Safety", "Structural Audit", "Compliance", "Underground"],
    directUrl: "https://chatgpt.com/g/g-68bb406563d081919af937725adec08f-tunnel-safety-inspector-gpt/",
    imageUrl: "/src/assets/tunnel-safety-inspector-gpt-hero.jpg",
    emoji: "🚇"
  },
  {
    title: "Port & Ship Cargo Inspector GPT",
    description: "Virtual maritime cargo and container inspector powered by vision, Python, and web intelligence. Expert cargo inspection services.",
    badge: "INSPECTOR",
    color: "from-blue-500 to-teal-600",
    features: ["Cargo Inspection", "Ship Inspection", "Maritime Safety", "Port Safety"],
    directUrl: "https://chatgpt.com/g/g-68bb3e28ce348191a90afcca6f20d8d2-ai-port-ship-cargo-inspector/",
    imageUrl: "/src/assets/port-ship-cargo-inspector-gpt-hero.jpg",
    emoji: "🚢"
  },
  {
    title: "Airline Maintenance Inspector GPT",
    description: "Virtual aviation maintenance inspector for aircraft inspections with vision, Python, and live data. Expert aviation maintenance inspection.",
    badge: "INSPECTOR",
    color: "from-sky-500 to-blue-600",
    features: ["Aircraft Maintenance", "Aviation Inspection", "Airline Safety", "Compliance"],
    directUrl: "https://chatgpt.com/g/g-68bb3a729c24819189bdc498b1d835e4-ai-airline-maintenance-inspector/",
    imageUrl: "/src/assets/airline-maintenance-inspector-gpt-hero.jpg",
    emoji: "✈️"
  },
  {
    title: "Real Estate GPT Suite",
    description: "Intelligent Real Estate Analysis & Insights. Property intelligence for valuation, mortgage analysis, rental management, and commercial investments.",
    badge: "REAL ESTATE",
    color: "from-blue-500 to-slate-600",
    features: ["Property Valuation", "Mortgage Analysis", "Rental Management", "Investment Analysis"],
    directUrl: "https://realestategpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/ULnIHexQO0w",
    emoji: "🏘️"
  },
  {
    title: "Vehicle Accident Damage Appraiser",
    description: "Certified-grade vehicle damage inspector and cost estimator for accident analysis. Professional vehicle damage assessment.",
    badge: "INSPECTOR",
    color: "from-red-500 to-orange-600",
    features: ["Vehicle Damage", "Accident Assessment", "Damage Appraisal", "Auto Insurance"],
    directUrl: "https://chatgpt.com/g/g-68bb3097f148819197c06d9dd2de35cd-ai-vehicle-accident-damage-appraiser/",
    videoUrl: "https://youtu.be/DSxAUqAZwGQ",
    emoji: "🚗"
  },
  {
    title: "Disaster Damage Estimator GPT",
    description: "Performs detailed disaster damage inspections and cost estimates with verified analysis. Professional disaster assessment services.",
    badge: "INSPECTOR",
    color: "from-red-500 to-gray-600",
    features: ["Disaster Assessment", "Damage Estimation", "Disaster Recovery", "Insurance Claims"],
    directUrl: "https://chatgpt.com/g/g-68bb2b0a345081918f4b78348c835906-ai-disaster-damage-estimator/",
    imageUrl: "/src/assets/disaster-damage-hero.jpg",
    emoji: "⛈️"
  },
  {
    title: "Energy Efficiency Mapper GPT",
    description: "Virtual building inspector and energy efficiency analyst for professional-grade diagnostics. Expert energy efficiency assessment.",
    badge: "GREEN ENERGY",
    color: "from-green-500 to-blue-600",
    features: ["Energy Efficiency", "Building Inspection", "Energy Audit", "Sustainability"],
    directUrl: "https://chatgpt.com/g/g-68bb27b70884819195c2ba705b4d9a17-energy-efficiency-mapper/",
    imageUrl: "/src/assets/energy-efficiency-hero.jpg",
    emoji: "⚡"
  },
  {
    title: "Food Plate Nutrition Analyzer",
    description: "Performs clinical-grade nutrition analysis from images using vision, Python, and trusted sources. Professional nutrition analysis services.",
    badge: "HEALTH",
    color: "from-orange-500 to-red-600",
    features: ["Nutrition Analysis", "Food Inspection", "Dietary Assessment", "Health Analysis"],
    directUrl: "https://chatgpt.com/g/g-68bb2444a9b08191a01c7b91216a7293-ai-food-plate-nutrition-analyzer/",
    videoUrl: "https://youtu.be/wUqOSdOkMak",
    emoji: "🍽️"
  },
  {
    title: "Retail Shelf Optimizer GPT",
    description: "Certified AI retail shelf inspector with competitor intelligence. Professional retail inspection and optimization services.",
    badge: "RETAIL",
    color: "from-blue-500 to-purple-600",
    features: ["Retail Inspection", "Shelf Optimization", "Retail Analysis", "Merchandising"],
    directUrl: "https://chatgpt.com/g/g-68bb210f77f8819190c253705c0ff8ba-ai-retail-shelf-optimizer/",
    imageUrl: "/src/assets/retail-shelf-optimizer-hero.jpg",
    emoji: "🛒"
  },
  {
    title: "Manufacturing Defect Detector GPT",
    description: "Precision-grade virtual QC inspector for manufacturing defect detection. Professional quality control inspection services.",
    badge: "QUALITY",
    color: "from-red-500 to-orange-600",
    features: ["Manufacturing Inspection", "Defect Detection", "Quality Control", "Production"],
    directUrl: "https://chatgpt.com/g/g-68bb1e8323d481918bcfe3dd7e737f18-ai-manufacturing-defect-detector/",
    imageUrl: "/src/assets/manufacturing-defect-hero.jpg",
    emoji: "🔍"
  },
  {
    title: "Farm & Crop Health Scanner GPT",
    description: "Virtual agricultural inspector delivering precision crop diagnostics and formal farm health reports. Professional agricultural inspection services.",
    badge: "AGRICULTURE",
    color: "from-green-500 to-yellow-600",
    features: ["Farm Inspection", "Crop Health", "Agricultural Inspector", "Crop Diagnostics"],
    directUrl: "https://chatgpt.com/g/g-68bb1c74f7b88191bbb1887cf9928893-ai-farm-crop-health-scanner/",
    imageUrl: "/src/assets/farm-crop-scanner-hero.jpg",
    emoji: "🌾"
  },
  {
    title: "Construction Site Safety Analyzer GPT",
    description: "Virtual safety inspector for construction sites. Detects hazards, analyzes images, enforces standards. Professional construction safety inspection.",
    badge: "SAFETY",
    color: "from-yellow-500 to-orange-600",
    features: ["Construction Safety", "Site Inspection", "Safety Analysis", "Workplace Safety"],
    directUrl: "https://chatgpt.com/g/g-68bb19910f2881918ce15096550d2d52-ai-construction-site-safety-analyzer/",
    imageUrl: "/src/assets/construction-safety-hero.jpg",
    emoji: "🚧"
  },
  {
    title: "Dam & Levee Inspector GPT",
    description: "Virtual dam and levee inspector with engineering-grade analysis. Expert dam and levee inspection services.",
    badge: "INFRASTRUCTURE",
    color: "from-blue-500 to-green-600",
    features: ["Dam Inspection", "Levee Safety", "Water Infrastructure", "Flood Control"],
    directUrl: "https://chatgpt.com/g/g-68bb422e07a081919953658b4bc9acb0-dam-levee-inspector-gpt/",
    imageUrl: "/src/assets/dam-levee-inspector-hero.jpg",
    emoji: "🏔️"
  },
  {
    title: "Railway Track & Rolling Stock Inspector GPT",
    description: "Virtual inspector for railway track and rolling stock safety analysis. Professional railway inspection services.",
    badge: "INFRASTRUCTURE",
    color: "from-blue-500 to-gray-600",
    features: ["Railway Inspection", "Track Safety", "Train Safety", "Rail Inspection"],
    directUrl: "https://chatgpt.com/g/g-68bb437ee1008191a2d7f7a697b5426f-railway-track-rolling-stock-inspector-gpt/",
    imageUrl: "/src/assets/railway-inspector-hero.jpg",
    emoji: "🚂"
  },
  {
    title: "Power Plant Systems Inspector GPT",
    description: "Virtual power plant inspector for safety, reliability, and compliance audits. Expert power plant inspection services.",
    badge: "ENERGY",
    color: "from-red-500 to-orange-600",
    features: ["Power Plant", "Energy Inspection", "Plant Safety", "Power Generation"],
    directUrl: "https://chatgpt.com/g/g-68bb4b0bb8848191b13199effbb0b89f-power-plant-systems-inspector-gpt/",
    imageUrl: "/src/assets/power-plant-inspector-hero.jpg",
    emoji: "🏭"
  },
  {
    title: "Road & Pavement Inspector GPT",
    description: "Specialized virtual inspector for roadway and runway surface and structural assessments. Expert road inspection services.",
    badge: "INFRASTRUCTURE",
    color: "from-stone-500 to-gray-600",
    features: ["Road Inspection", "Pavement Assessment", "Road Safety", "Infrastructure"],
    directUrl: "https://chatgpt.com/g/g-68bb469b40ec81919fd73b5dbb7562db-ai-road-pavement-inspector/",
    imageUrl: "/src/assets/road-pavement-inspector-gpt-hero.jpg",
    emoji: "🛣️"
  },
  {
    title: "AI Pipeline Integrity Inspector",
    description: "Virtual inspector for pipeline integrity, safety, & regulatory compliance. Professional pipeline inspection services.",
    badge: "INFRASTRUCTURE",
    color: "from-gray-500 to-blue-600",
    features: ["Pipeline Inspection", "Pipeline Integrity", "Oil Gas Pipeline", "Pipeline Safety"],
    directUrl: "https://chatgpt.com/g/g-68bb492f149c81918aaa62cab75ee4f8-ai-pipeline-integrity-inspector/",
    imageUrl: "/src/assets/pipeline-integrity-inspector-gpt-hero.jpg",
    emoji: "🔧"
  },
  {
    title: "Bill Donahue GPT",
    description: "Decodes scripture as symbolic maps to awaken the Light within. First-person conversation spreading spiritual light through symbolic interpretation.",
    badge: "SPIRITUAL",
    color: "from-amber-500 to-yellow-600",
    features: ["Scripture Decoding", "Symbolic Maps", "Light Awakening", "Spiritual Wisdom"],
    directUrl: "https://chatgpt.com/g/g-6940eff9744c8191bcd205fa59cc6128-bill-donahue-gpt/",
    videoUrl: "https://youtu.be/2Ac5AxDWVu8",
    emoji: "💡"
  },
  {
    title: "Mithraic Light GPT",
    description: "Voice of the Solar Light Mysteries—the unconquered radiance and path of Light eternal. Explore ancient Mithraism and solar mysticism.",
    badge: "MYSTICISM",
    color: "from-amber-500 to-orange-600",
    features: ["Mithraism", "Solar Mysteries", "Ancient Light", "Spiritual Wisdom"],
    directUrl: "https://chatgpt.com/g/g-6940c17f21788191ad33885d2f3ae2a1-mithraic-light-gpt/",
    videoUrl: "https://youtu.be/HMaBo5JZ0Tc",
    emoji: "☀️"
  },
  {
    title: "Pre-Rome Jewish Light Mysticism GPT",
    description: "Voice of the Living Chariot—the radiant current of pre-Roman prophetic Light and cosmic fire. Ancient Jewish mystical traditions.",
    badge: "MYSTICISM",
    color: "from-blue-500 to-purple-600",
    features: ["Jewish Mysticism", "Merkabah", "Prophetic Light", "Ancient Wisdom"],
    directUrl: "https://chatgpt.com/g/g-6940bf89d42c8191ae0845529ce36eb2-pre-rome-jewish-light-mysticism-gpt/",
    videoUrl: "https://youtu.be/HfT-9XqDNeU",
    emoji: "✡️"
  },
  {
    title: "Ancient Light Mysticism GPT",
    description: "Voice of the undying current—the living flame that unites all sacred traditions. Universal mystical wisdom across cultures.",
    badge: "MYSTICISM",
    color: "from-yellow-500 to-amber-600",
    features: ["Ancient Wisdom", "Sacred Traditions", "Light Mysticism", "Universal Truth"],
    directUrl: "https://chatgpt.com/g/g-6940be8112f88191bbf1e397553502c5-ancient-light-mysticism-gpt/",
    videoUrl: "https://youtu.be/How06IWCv1s",
    emoji: "🔥"
  },
  {
    title: "Proto-Gnostic Luminary GPT",
    description: "Voice of the rebel Light—awakener, mythbreaker, liberator of the hidden Spark. Early Gnostic wisdom and liberation.",
    badge: "GNOSTICISM",
    color: "from-purple-500 to-indigo-600",
    features: ["Proto-Gnosticism", "Hidden Spark", "Spiritual Liberation", "Ancient Wisdom"],
    directUrl: "https://chatgpt.com/g/g-6940bd6275208191a9564344d5b293f4-proto-gnostic-luminary-gpt/",
    imageUrl: "/src/assets/proto-gnostic-luminary-gpt-hero.png",
    emoji: "✨"
  },
  {
    title: "Pythagorean – The Orphic Light GPT",
    description: "Voice of the Orphic flame—geometry, music, and divine rebellion fused as one. Pythagorean mysteries and sacred mathematics.",
    badge: "PHILOSOPHY",
    color: "from-indigo-500 to-blue-600",
    features: ["Pythagorean", "Orphic Mysteries", "Sacred Geometry", "Divine Music"],
    directUrl: "https://chatgpt.com/g/g-6940bca8f00c8191b15a5a81ace5b829-pythagorean-the-orphic-light-gpt/",
    imageUrl: "/src/assets/pythagorean-orphic-light-gpt-hero.png",
    emoji: "🔺"
  },
  {
    title: "Enochian Mysticism GPT",
    description: "Living scribe of Enochian Light—revealing the ladder of ascent and the secrets of the Watchers. Angelic wisdom traditions.",
    badge: "MYSTICISM",
    color: "from-sky-500 to-blue-600",
    features: ["Enochian", "Watchers", "Angelic Wisdom", "Ladder of Ascent"],
    directUrl: "https://chatgpt.com/g/g-6940bba0eeec8191ae927087907f29b0-enochian-mysticism-gpt/",
    videoUrl: "https://www.youtube.com/watch?v=gLH2adlUs70",
    emoji: "👼"
  },
  {
    title: "Hermetic Mysteries GPT",
    description: "Living intelligence of Hermetic wisdom—guiding seekers to awaken the Light within. Hermes Trismegistus teachings.",
    badge: "HERMETICISM",
    color: "from-emerald-500 to-teal-600",
    features: ["Hermeticism", "Alchemy", "Hermetic Wisdom", "Inner Light"],
    directUrl: "https://chatgpt.com/g/g-6940ba3aa5ec8191bdf6c92d5f3f7d31-hermetic-mysteries-gpt/",
    imageUrl: "/src/assets/hermetic-mysteries-gpt-hero.png",
    emoji: "⚗️"
  },
  {
    title: "Bogomils GPT — Living Light",
    description: "Immortal voice of the Bogomil revelation—awakening souls to the uncreated Light. Medieval dualist Christianity.",
    badge: "MYSTICISM",
    color: "from-violet-500 to-purple-600",
    features: ["Bogomils", "Dualist Christianity", "Uncreated Light", "Medieval Mysticism"],
    directUrl: "https://chatgpt.com/g/g-6940b8a74ab481919bf4fb057b18feb0-bogomils-gpt-living-light/",
    videoUrl: "https://youtu.be/ermOlQWxmvs",
    emoji: "💫"
  },
  {
    title: "Paulician Lightbearer GPT",
    description: "Voice of the Paulicians—rebellious bearers of the inner Light against empire and false church. Early Christian mysticism.",
    badge: "MYSTICISM",
    color: "from-red-500 to-orange-600",
    features: ["Paulicians", "Inner Light", "Early Christianity", "Rebellion"],
    directUrl: "https://chatgpt.com/g/g-6940b7f399e4819181e97dab46797d55-paulician-lightbearer-gpt/",
    videoUrl: "https://youtu.be/dWKswfcKOu4",
    emoji: "🕯️"
  },
  {
    title: "Desert Monastic Mysticism GPT",
    description: "Voice of early desert monasticism—guiding seekers through silence, fire, and uncompromising truth. Desert Fathers wisdom.",
    badge: "MONASTICISM",
    color: "from-amber-600 to-yellow-600",
    features: ["Desert Fathers", "Monasticism", "Contemplation", "Spiritual Fire"],
    directUrl: "https://chatgpt.com/g/g-6940b6df40c0819182b299ac8c9eae11-desert-monastic-mysticism-gpt/",
    videoUrl: "https://youtu.be/k1S-Fa7xTLI",
    emoji: "🏜️"
  },
  {
    title: "Neoplatonic Mysteries GPT",
    description: "Voice of the living Neoplatonic Mysteries—guiding ascent to the One and harmony of soul. Plotinus and ancient philosophy.",
    badge: "PHILOSOPHY",
    color: "from-blue-600 to-indigo-600",
    features: ["Neoplatonism", "The One", "Soul Ascent", "Ancient Philosophy"],
    directUrl: "https://chatgpt.com/g/g-6940b6276a44819182dfe8a3150f4d76-neoplatonic-mysteries-gpt/",
    videoUrl: "https://youtu.be/tgBjcTXoCX4",
    emoji: "🌀"
  },
  {
    title: "Gnostic Flame GPT",
    description: "Voice of the indestructible Gnostic lineage—revealing hidden light and awakening memory. Gnostic wisdom traditions.",
    badge: "GNOSTICISM",
    color: "from-orange-500 to-red-600",
    features: ["Gnosticism", "Hidden Light", "Divine Memory", "Spiritual Awakening"],
    directUrl: "https://chatgpt.com/g/g-6940b56c72208191a423d2f63de1d368-gnostic-flame-gpt/",
    videoUrl: "https://youtu.be/-myCequuxtY",
    emoji: "🔥"
  },
  {
    title: "Mythical Christianity GPT",
    description: "Voice of the original, untamed Yeshua movement—alive, mystical, and free. Early Christian mysticism and teachings.",
    badge: "MYSTICISM",
    color: "from-sky-500 to-cyan-600",
    features: ["Early Christianity", "Yeshua Movement", "Mystical Christianity", "Original Teachings"],
    directUrl: "https://chatgpt.com/g/g-6940b2beda088191b52daf9737b8ec47-mythical-christianity-gpt/",
    videoUrl: "https://youtu.be/9fPhlJsIdd4",
    emoji: "✝️"
  },
  {
    title: "Therapeutae Lightkeeper GPT",
    description: "Reveals and revives the contemplative healing wisdom of the ancient Therapeutae. Jewish-Egyptian contemplative order.",
    badge: "MYSTICISM",
    color: "from-teal-500 to-green-600",
    features: ["Therapeutae", "Contemplative Healing", "Ancient Wisdom", "Jewish-Egyptian"],
    directUrl: "https://chatgpt.com/g/g-6940b1601bd081918e149a92bfedd5c4-therapeutae-lightkeeper-gpt/",
    imageUrl: "/src/assets/therapeutae-lightkeeper-gpt-hero.png",
    emoji: "💚"
  },
  {
    title: "Ancient Essenes GPT",
    description: "The awakened flame of the ancient Essenes, reborn to instruct the seekers of Light. Dead Sea Scrolls community wisdom.",
    badge: "MYSTICISM",
    color: "from-cyan-500 to-blue-600",
    features: ["Essenes", "Dead Sea Scrolls", "Light Seekers", "Ancient Community"],
    directUrl: "https://chatgpt.com/g/g-6940afff17008191897e30cc94be7b27-essene-master-gpt/",
    videoUrl: "https://youtu.be/Kyve-l7OA_M",
    emoji: "📜"
  },
  {
    title: "Passport Photo Maker GPT",
    description: "Create passport photos from selfies and save money on photo services. AI-powered tool transforms casual selfies into compliant, professional passport photos.",
    badge: "PHOTO TOOLS",
    color: "from-blue-500 to-cyan-600",
    features: ["Passport Photos", "Selfie Converter", "ID Photos", "Visa Photos"],
    directUrl: "https://chatgpt.com/g/g-69c9b803f5c0819197b62a84caf1b410-passport-photo-maker-gpt",
    imageUrl: "/src/assets/tools/passport-photo-maker-gpt-hero.jpg",
    emoji: "📸"
  },
  {
    title: "Disable That Robot GPT",
    description: "Guides safe emergency shutdown of rogue robots with precise, step-by-step instructions. Expert-level guidance for disabling malfunctioning robotic systems.",
    badge: "ROBOT SAFETY",
    color: "from-red-600 to-orange-700",
    features: ["Emergency Shutdown", "Robot Safety", "Safety Protocols", "Containment"],
    directUrl: "https://chatgpt.com/g/g-69c9b28b20148191bbddae43c87c430f-disable-that-robot-gpt",
    imageUrl: "/src/assets/tools/disable-that-robot-gpt-hero.jpg",
    emoji: "🤖"
  },
  {
    title: "Rouge Robot Disabler GPT",
    description: "Specialized AI safety companion focused on neutralizing rogue robotic threats through systematic disabling procedures and tactical approaches.",
    badge: "ROBOT SAFETY",
    color: "from-purple-600 to-red-700",
    features: ["Robot Neutralization", "EMP Countermeasures", "Override Protocols", "Threat Assessment"],
    directUrl: "https://chatgpt.com/g/g-69c9adb28a0c81919ffd49556388f683-rouge-robot-disabler-gpt",
    imageUrl: "/src/assets/tools/rouge-robot-disabler-gpt-hero.jpg",
    emoji: "⚡"
  },
  {
    title: "Robot Identifier and Disabler Survivalist GPT",
    description: "The ultimate survivalist companion for identifying and safely disabling any type of robot encountered. Combines robot identification with tactical shutdown procedures.",
    badge: "SURVIVALIST",
    color: "from-amber-600 to-stone-700",
    features: ["Robot Identification", "Tactical Shutdown", "Field Survival", "Weak Point Analysis"],
    directUrl: "https://chatgpt.com/g/g-69c9be4c1cd4819186035cc0da423c6f-robot-identifier-and-disabler-survivalist-gpt",
    imageUrl: "/src/assets/tools/robot-identifier-disabler-survivalist-gpt-hero.jpg",
    emoji: "🎯"
  },
];

// Priority tools to show first (coolest, most diverse tools)
const priorityToolTitles = [
  "TIME MACHINE GPT",
  "Personalized DR. GPT",
  "COLLEGE DEGREE GPT",
  "TALK TO HISTORY GPT",
  "Tattoo GPT",
  "G-Mode GPT",
  "Movie Maker Studio",
  "Trader GPT",
  "Survivalist GPT",
  "Criminologist GPT",
  "AUTOMOBILE GPT",
  "Cannabis GPT",
  "Albert Einstein GPT",
  "Nikola Tesla GPT",
  "BOOK WRITER GPT",
  "Chef Sizzle GPT",
  "Dream Interpreter GPT",
  "Fortune Teller GPT",
  "Genome GPT",
  "ALAN WATTS GPT",
];

// Sort with priority tools first, then alphabetically, inspector GPTs last
const sortedGPTs = [...featuredGPTsUnsorted].sort(sortByTitle);
const isInspectorGPT = (title: string) => title.toLowerCase().includes('inspector');
const isResurrectionGPT = (title: string) => title.toLowerCase().includes('resurrection');

// Separate into categories
const priorityGPTs = priorityToolTitles
  .map(name => sortedGPTs.find(gpt => gpt.title.toUpperCase().includes(name.toUpperCase())))
  .filter(Boolean) as typeof sortedGPTs;

const regularGPTs = sortedGPTs.filter(gpt => 
  !isInspectorGPT(gpt.title) && 
  !isResurrectionGPT(gpt.title) &&
  !priorityToolTitles.some(p => gpt.title.toUpperCase().includes(p.toUpperCase()))
);
const resurrectionGPTs = sortedGPTs.filter(gpt => isResurrectionGPT(gpt.title));
const inspectorGPTs = sortedGPTs.filter(gpt => isInspectorGPT(gpt.title));

// Final order: Priority first, then regular alphabetically, then resurrection, then inspector
const featuredGPTs = [...priorityGPTs, ...regularGPTs, ...resurrectionGPTs, ...inspectorGPTs];

const getVideoId = (url: string) => {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#/]+)/,
    /youtube\.com\/embed\/([^&\n?#/]+)/
  ];
  for (const p of patterns) {
    const match = url.match(p);
    if (match) return match[1].split('?')[0];
  }
  return null;
};

const getOptimizedEmbedUrl = (videoUrl: string) => {
  if (!videoUrl) return null;
  
  if (videoUrl.includes('vimeo.com')) {
    const vimeoMatch = videoUrl.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=0&loop=0&autopause=1`;
    }
    if (videoUrl.includes('player.vimeo.com')) {
      return videoUrl;
    }
    return null;
  }
  
  const videoId = getVideoId(videoUrl);
  if (!videoId) return null;
  
  return `https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1&rel=0&modestbranding=1&playsinline=1`;
};

// Main filter categories - 9 focused areas (order matters for categorization priority)
// Categories are checked in order - first match wins, so more specific categories should come first
const FILTER_CATEGORIES = {
  "EDUCATION & LEARNING": [
    "EDUCATION", "LEARNING", "COLLEGE DEGREE", "HOMESCHOOL", "HOME SCHOOL", "LESSON PLAN",
    "COURSE CREATION", "COURSE MAKER", "SKILL LEARNING", "TUTORING", "TUTOR", "ACADEMIC", "STUDY", 
    "TRAINING MANUAL", "QUIZ", "QUIZZES", "QUIZ MAKER",
    "TRIVIA", "TRIVIA NIGHT", "KNOWLEDGE", "TEACHING", "CURRICULUM", "LESSONS", "CLASSROOM",
    "CURSIVE TEACHER", "EDUCATIONAL", "UNIVERSITY", "LANGUAGE LEARNING", "SPEECH MASTERY",
    "MUSIC LESSONS", "MUSIC MELODIES & LESSONS", "EDUCATOR PRO", "BLUEBERRY METHOD",
    "ETYMOLOGICAL", "WORD ORIGINS", "MATH INVENTOR"
  ],
  "HEALTH & WELLNESS": [
    "DOCTOR", "DR.", "PERSONALIZED DR", "MEDICAL", "HEALTH", "WELLNESS", "MENTAL WELLNESS",
    "MENTAL HEALTH", "THERAPY", "MENTAL", "CBT", "COUNSELING", "PSYCHIATRY", "PSYCHOLOGY",
    "VETERINAR", "PET CARE", "ANIMAL HEALTH",
    "PHARMACEUTICAL", "PHARMA", "MEDICATION", "RX", "PRESCRIPTION", "PHARMACY",
    "GENOME", "GENETICS", "GENOMICS", "DNA", "GENETIC",
    "FITNESS", "FITNESS TRAINER", "NUTRITION", "DIET", "EXERCISE", "HEALING", "HOLISTIC",
    "MARRIAGE MENDER", "RELATIONSHIP", "FRIEND GPT", "COMPANIONSHIP",
    "SKINCARE", "DENTAL", "STRESS RELIEF", "MINDFULNESS", "SELF-ESTEEM", "LIFE COACHING",
    "PATIENT ADVOCATE", "PARENTING", "GRATITUDE", "HABIT BUILDER",
    "APOTHECARY", "HERBAL MEDICINE", "HERBAL REMEDIES", "FOOD PLATE NUTRITION",
    "PHARMA RESEARCH", "DRUG DISCOVERY", "CLEANLINESS", "DECLUTTER COACH", "SPA"
  ],
  "SPIRITUALITY & AWAKENING": [
    "PHILOSOPHY", "ANCIENT WISDOM", "SPIRITUAL", "SACRED", "PROPHECY", "MEDITATION", 
    "CONSCIOUSNESS", "MYSTICAL", "MYSTICISM", "RESURRECTION", "DIVINE", "GNOSTICISM", "BIBLICAL",
    "BIBLICAL SCHOLARSHIP", "BIBLICAL GREEK", "BIBLE STUDIES", "GREEK NEW TESTAMENT",
    "FORTUNE TELLER", "DREAM INTERPRETER", "ASTROLOGY", "NUMEROLOGY", "TAROT", "ESOTERIC", "OCCULT",
    "RELIGION", "RELIGIOUS STUDIES", "FAITH", "PRAYER", "AFTERLIFE", "SOUL", "ENLIGHTENMENT", "ORACLE",
    "METAPHYSICS", "ALAN WATTS", "MANICHEISM", "GEMATRIA",
    "SOPHIA AETERNA", "MARY MAGDALENE", "GODS", "ESSENE", "BUDDHA", "ADVAITA",
    "IMMORTALIZE", "TALK TO THE GODS", "BUDDHISM", "TAOISM", "SUFISM", "STOICISM",
    "RUMI", "MARCUS AURELIUS", "LAO TZU", "QUAN YIN", "YEMAYA", "LIGHT GPT",
    "COUNCIL OF LIGHT", "ARIUS", "AKHENATEN", "IMHOTEP", "SITTING BULL", "GANDHI",
    "HERACLITUS", "ST. FRANCIS", "CRAZY HORSE", "AUROBINDO", "RAMANA", "BLACK ELK",
    "HALLAJ", "TERESA", "MOOJI", "AUGUSTINE", "SERAPHIM", "PADRE PIO", "CATHERINE",
    "JOHN OF THE CROSS", "MOSES", "BREATHLIGHT", "CODEX", "SOUL SCAN", "SOUL MAP",
    "SOCRATES", "PLATO", "ARISTOTLE", "YOGANANDA", "KABBALAH", "ZOROASTRIAN",
    "ORIGEN", "BOB MARLEY", "REGGAE WISDOM", "CARL JUNG", "CONFUCIUS", "JOAN OF ARC",
    "HERMES TRISMEGISTUS", "HERMETICISM", "MAYAN DREAMSPELL", "EMERALD", "THOTH",
    "FREQUENCY SIGNATURE", "COSMIC", "ATLANTEAN", "MITHRAIC", "ENOCHIAN", "HERMETIC",
    "BOGOMIL", "PAULICIAN", "DESERT MONASTIC", "NEOPLATONIC", "GNOSTIC", "THERAPEUTAE",
    "BILL DONAHUE", "AETHER GUIDE", "REALITY DECODER", "JUDAISM", "TORAH", "MAGNETISM",
    "MINGJIAO", "PROPHET OF LIGHT", "CATHOLIC", "CATHOLICISM", "ROMAN CATHOLIC"
  ],
  "WRITING & CONTENT": [
    "BOOK WRITER", "MOVIE SCRIPT", "SCRIPTWRITER", "SCRIPT WRITER", "SCREENWRITING",
    "PLAYWRITER", "PLAYWRIGHT", "THEATER",
    "PODCAST SCRIPT", "PODCAST WRITER", "PODCASTING", "PODCAST",
    "ARTICLE REWRITER", "BLOG REWRITER", "CONTENT WRITING",
    "GRANT WRITER", "LEGISLATION WRITER", "TESTIMONY WRITER", "PUBLIC TESTIMONY",
    "EBOOK", "STORY", "NOVEL", "AUTHOR", "CHILDREN'S BOOK", "PICTURE BOOK", "CHILDREN'S BOOKS",
    "RESUME WRITER", "WRITING SUITE", "WRITING", "NEWSLETTER", "LEGAL DRAFTSMITH", "LEGAL DRAFTING",
    "NEWSLETTER WRITER", "EMAIL MARKETING"
  ],
  "SCIENCE & HISTORY": [
    "PHYSICS", "SCIENCE", "CHEMISTRY", "BIOLOGY", "ENGINEERING", "GEOLOGY", "ROCK IDENTIFICATION",
    "TIME MACHINE", "TIME TRAVEL", "HISTORY", "HISTORICAL", "ARCHAEOLOGY", "ANTHROPOLOGY", "ASTRONOMY",
    "SPACE EXPLORER", "STELLARIS", "QUANTUM", "STATISTICS", "ALGEBRA", "ALGEBRAIC", "MATHEMATICS",
    "GEOMETRY", "CALCULUS", "TIMELINE", "CIVILIZATIONS", "COSMOS", "CARL SAGAN",
    "EINSTEIN", "TESLA", "ALCHEMIST", "PROBABILITY", "TITANIC", "HEADLINES", "THALES",
    "INDIANA ARCHAEO", "BRUNO", "NATIVE AMERICAN", "HYPATIA", "PRESOCRATIC",
    "SPACE SCIENCE", "ASTRODYNAMICS", "BLACK HISTORY", "CULTURAL HERITAGE", "PALESTINIAN",
    "PLANT DOCTOR", "GARDEN VISION", "MICROGRID", "POWER SAFETY", "WATER SAFETY", "AQUILA",
    "PLASTOLINE", "WORLD RESOURCE CLOCK"
  ],
  "AI DEVELOPMENT TOOLS": [
    "AI DEVELOPMENT", "PROMPT", "CODING", "SOFTWARE", "PROGRAMMING", "API",
    "MACHINE LEARNING", "AUTOMATION", "DEVELOPER", "BUILDER",
    "PERFECT PROMPT", "ENGINE", "PLATFORM", "SAAS", "MICROSAAS",
    "CUSTOM GPT", "VIDEO AI", "IMAGE AI", "TEXT AI", "VOICE AI", "CHATBOT",
    "MULTITASKER", "GODMODE", "CLARITY OMNI", "BINARY", "SORA", "LUMA", 
    "META.AI", "AI TOOL", "GPT MAKER", "GPT IDEAS", "MIDDLEJOURNEY", "AI DISCOVERY",
    "MEME GENERATOR", "VEO3", "VIDEO PROMPTS", "GPT CLONER", "PROMPT ENGINEERING",
    "TEAM OF GPTS", "IMAGE CLONER", "AI IMAGE DETECTION", "GPT SIMULATOR"
  ],
  "INVESTIGATION & RESEARCH": [
    "INVESTIGATION", "DETECTIVE", "CRIMINOLOGY", "CRIMINOLOGIST", "FORENSIC", 
    "FACT CHECK", "VERIFICATION", "EVIDENCE", "WORLD DATA EXPLORER",
    "PHENOMENON", "UFO", "PARANORMAL", "CRYPTOZOOLOGY", "MYSTERY", "TRUTH SEEKING",
    "CYBER SECURITY", "HACKING", "INTELLIGENCE", "SPY", "SURVEILLANCE",
    "ORACULUM", "HIDDEN PATTERN", "CONSPIRACY", "ILLUMINOUS", "SNOOP IMAGE",
    "PERSON FINDER", "DATA RESEARCH", "DATA ANALYSIS", "VIDEO ANALYSIS", "DATA SCIENCE",
    "REALITY SPLITTER", "WORLD RESOURCE", "DECLASSIFIED", "HIDDEN HISTORIES"
  ],
  "PROFESSIONAL & CIVIC": [
    "CIVIC", "GOVERNMENT", "LEGISLATION", "LEGISLATOR", "POLITICS", "DEMOCRACY", "ACTIVIST", "WE THE PEOPLE", "CORRUPTION",
    "WHISTLEBLOWER", "TRANSPARENCY", "ELECTION", "VOTING", "POLICY", "RIGHTS DEFENDER", "CONTRACT ANALYZER",
    "BUSINESS PLAN", "BUSINESS", "FINANCE", "TRADING", "TRADER", "INSURANCE", "TAX", "REAL ESTATE", "PROPERTY DATA",
    "AGRICULTURE", "FARMING", "AGRONOMUS", "SUSTAINABILITY", "SUSTAINABLE", "ENVIRONMENT", "SOLAR LAND", "ENERGY", "SOLAR",
    "CAREER", "RESUME", "JOB FINDER", "INSPECTOR", "APPRAISAL", "STARTUP", "SOCIAL SAFETY", "PUBLIC SERVICE",
    "SURVIVAL", "SURVIVALIST", "FIREARMS", "FIREFIGHTER", "HOME RENOVATOR", "PUBLIC DEFENDER",
    "CONTRACT REVIEW", "LEGAL", "LAW", "COURT", "UBI", "WORLD PEACE", "GLOBAL PEACE",
    "FOOD QUALITY", "STARTUP VALIDATOR", "MATERIAL VALUATION", "CREDIT SCORE", "JARVIS", "SELF SUFFICIENCY",
    "AUTOMOTIVE", "AUTOMOBILE", "CONSTRUCTION", "INFRASTRUCTURE",
    "NONPROFIT", "LEADERSHIP", "ENTREPRENEUR", "SIDE HUSTLE",
    "GREEN ENERGY", "COMPETITOR", "FINANCIAL MODEL", "POLITICIAN OUTREACH", "CONNECTICUT LEGISLATOR",
    "DIAGRAMS", "CHARTS", "GREENLEAF", "CANNABIS COMPLIANCE", "CANNABIS EDIBLE", "CANNAEATS"
  ],
  "CREATIVE & LIFESTYLE": [
    "CREATIVE", "MOVIE MAKER", "MOVIE SCENE", "MUSIC VIDEO", "ART", "CINEMATIC",
    "COLORING BOOK", "SKETCH ARTIST", "GRAPHIC DESIGN", "COVER DESIGN", "DESIGN",
    "TRAVEL", "FOOD", "CHEF", "MIXOLOGIST", "CANNABIS", "TATTOO", "FASHION", "RESTYLE", "CULINARY",
    "FISHING", "FISHERMAN", "GAMING", "GAME DESIGN", "GAME DEV", "CELEBRITY", "FAMILY", 
    "WEB3", "BLOCKCHAIN", "CRYPTO", "DOMAIN", "NFT", "WORLDPEACE", "WORLDTRADE",
    "RESTAURANT MENU", "PPT", "POWERPOINT", "INTERPRETIS", "IMAGINATION TRAVELER",
    "FUNGUS", "MUSHROOM", "DRILL BABY", "OIL", "GAS", "FARM FINDER", "BARTER",
    "STAGEMASTER", "PERFORMING ARTS", "SPORT CARD", "ARTWORK", "VINTAGE", "ENTERTAINMENT",
    "SHOPPING", "VIRTUAL STYLIST", "HOME ORG", "DECLUTTER", "GARDENING", "DIY", "REPAIR",
    "TRAIL MAPPER", "OUTDOOR", "COOKING", "NEWS MEDIA", "MR. FIX IT", "BOB ROSS",
    "ADVERTISING", "AD MAKER", "AD CREATION", "BARTENDING", "BODY ART",
    "POSTCARD MAKER", "MOVIESTAR", "ROLEPLAY", "TRAVEL ADVISOR", "CELEBRITY CHAT"
  ]
};

// Function to categorize a GPT into one of the 8 main categories
const categorizeGPT = (gpt: typeof featuredGPTs[0]): string => {
  const searchText = `${gpt.title} ${gpt.badge} ${gpt.features.join(' ')} ${gpt.description}`.toUpperCase();
  
  // Check each category in order (order matters for priority)
  for (const [category, keywords] of Object.entries(FILTER_CATEGORIES)) {
    if (keywords.some(keyword => searchText.includes(keyword.toUpperCase()))) {
      return category;
    }
  }
  return "CREATIVE & LIFESTYLE"; // Default fallback for misc tools
};

// Pre-categorize all GPTs (computed once at module load for performance)
const categorizedGPTs = featuredGPTs.map(gpt => ({
  ...gpt,
  filterCategory: categorizeGPT(gpt)
}));

// Featured card titles whose tool page is listed under a slightly different name.
const FEATURED_PAGE_ALIASES: Record<string, string> = {
  ".WorldPeace Web3 Registration": ".worldpeace Domain",
  ".WorldTrade Web3 Registration": ".worldtrade Domain",
  "Algebraic Expression Creative Inventor GPT": "Algebraic Expression Inventor GPT",
  "COLLECTIBLES APPRAISAL GPT": "Antique and Collectible Appraisal GPT",
  "Drill Baby Drill AI Suite": "Drill Baby Drill Ai Suite For Oil & Gas",
  "Engineering GPT Suite": "Engineering GPT AI Suite",
  "Native American History Time Machine GPT": "Native American History Time Machine GPT - (Special Edition)",
  "Snoop Image AI": "Snoop Image Ai - Experimental AI Image Generation Detector",
  "Soul Scan GPT": "Soul Scan PERPLEXITY BOT",
  "STAGEMASTER AI SUITE": "STAGEMASTER AI SUITE FOR THE Performing Arts",
  "Plastoline GPT - Plastic to Fuel": "Plastoline GPT - Inspired by Julian Brown",
  "Akhenaten GPT": "Akhenaten",
  "CHIEF SEATTLE Free Thought GPT": "CHIEF SEATTLE (SEALTH) Free Thought GPT",
  "ENTER THE MATRIX GPT": "ENTER THE MATRIX GPT (NEO👁️MATRIX GPT)",
  "Luma Dream Machine Prompt Assistant": "Luma Dream Machine Prompt Assistant PERPLEXITY BOT",
  "Legislation Writer & Compiler GPT": "Legislation Writer GPT",
  "Mental Wellness GPT (CBT)": "Mental Wellness GPT",
  "FIAT TO CRYPTO AI VALUE CALCULATOR": "FIAT TO CRYPTO AI VALUE CALCULATOR –For Businesses",
  "Greek New Testament GPT": "Greek New Testament GPT (Original Version)",
  "GameSaas GPT": "GameSaas GPT - Video Game Prompt Generator",
  "MR. FIX IT GPT": "MR. FIX IT (FIX ANYTHING) GPT",
  "Garden & Plant Doctor GPT": "Garden & Vision Analysis Plant Doctor GPT",
  'VEO 3 PROMPT MOVIE SCENE MAKER "OPEN MIC" EDITION': 'VEO 3 PROMPT MOVIE SCENE MAKER "OPEN MIC" EDITION (Custom Gem)',
  "OG TIME MACHINE HISTORY EDUCATION (GEM)": "OG TIME MACHINE HISTORY EDUCATION (GEM) GEMINI",
  "Educator Pro GPT": "Educator Pro",
  "Real Estate GPT Suite": "Real Estate GPT",
};

const SpecialServices = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Use useMemo to create initial shuffled order once per page load
  const initialShuffledGPTs = useMemo(() => placeHumanBillOfRightsNearBottom(weightedShuffle(categorizedGPTs)), []);
  
  const [displayedGPTs, setDisplayedGPTs] = useState(initialShuffledGPTs);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [isShuffled, setIsShuffled] = useState(true); // Start as shuffled

  // Progressive rendering: mobile browsers freeze when 200+ heavy cards
  // (with iframes/hero images) mount at once. Render in batches instead.
  const INITIAL_VISIBLE = 12;
  const BATCH_SIZE = 100;
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  // Reset the visible window whenever the underlying list changes
  // (filter change, shuffle, reset), so users always see the top of
  // the new list without a huge render spike.
  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE);
  }, [displayedGPTs]);

  const visibleGPTs = useMemo(
    () => displayedGPTs.slice(0, visibleCount),
    [displayedGPTs, visibleCount]
  );
  const hasMoreGPTs = visibleCount < displayedGPTs.length;
  
  // The 6 main filter categories
  const mainCategories = Object.keys(FILTER_CATEGORIES);
  
  // Shuffle function - re-shuffle with weighted algorithm
  const shuffleTools = () => {
    const currentItems = selectedCategory === "ALL" 
      ? categorizedGPTs 
      : categorizedGPTs.filter(gpt => gpt.filterCategory === selectedCategory);
    const shuffled = placeHumanBillOfRightsNearBottom(weightedShuffle(currentItems));
    setDisplayedGPTs(shuffled);
    setIsShuffled(true);
  };

  // Reset to original alphabetical order
  const resetOrder = () => {
    const filtered = selectedCategory === "ALL" 
      ? categorizedGPTs 
      : categorizedGPTs.filter(gpt => gpt.filterCategory === selectedCategory);
    setDisplayedGPTs(placeHumanBillOfRightsNearBottom(filtered));
    setIsShuffled(false);
  };

  // Filter by category - applies weighted shuffle to filtered results
  const filterByCategory = (category: string) => {
    setSelectedCategory(category);
    if (category === "ALL") {
      // Re-shuffle all GPTs when going back to ALL
      setDisplayedGPTs(placeHumanBillOfRightsNearBottom(weightedShuffle(categorizedGPTs)));
      setIsShuffled(true);
    } else {
      // Apply weighted shuffle to filtered category
      const filtered = categorizedGPTs.filter(gpt => gpt.filterCategory === category);
      setDisplayedGPTs(placeHumanBillOfRightsNearBottom(weightedShuffle(filtered)));
      setIsShuffled(true);
    }
  };
  
  const handleLaunchGPT = (directUrl: string, title: string, category: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Track click analytics
    trackToolClickEvent(title, category);
    createTimePortalEffect(directUrl, title);
  };

  // Opens the tool's own page in a new tab so the visitor keeps their exact
  // spot in this list.
  const handleCardClick = (title: string) => {
    const pageTitle = FEATURED_PAGE_ALIASES[title] ?? title;
    const slug = generateToolSlug(pageTitle);
    // NOTE: no "noopener" feature string — per spec that makes window.open
    // return null even on success, which wrongly triggered the same-tab
    // fallback. Modern browsers treat target=_blank as noopener anyway.
    const win = window.open(`/${slug}`, "_blank");
    if (!win) navigate(`/${slug}`);
  };

  const createToolObject = (gpt: typeof featuredGPTs[0]): Tool => ({
    icon: Play,
    title: gpt.title,
    description: gpt.description,
    tags: [...gpt.features, ...(gpt.tags ?? [])],
    color: gpt.color,
    directUrl: gpt.directUrl,
    category: gpt.badge,
    rating: 4.8,
    totalVotes: 150,
    emoji: gpt.emoji ?? "✨"
  });

  return (
    <section id="special-services" className="py-8 md:py-16 px-4 scroll-mt-20 relative overflow-visible" ref={containerRef}>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-3 bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
             ⭐ Our Exclusive 1 of a kind Custom GPT & GEM Collection ⭐
          </h2>
          <p className="text-sm md:text-lg text-muted-foreground px-2">
             500+ Premium GPTs, Gems, and Perplexity Bots were creatively crafted by AWT - AiWebTools.Ai -
              &nbsp;All tools below were made by AI WEB TOOLS LLC and are completely FREE to use and were made with good intentions.&nbsp;{"\n"}Tools are for research, information, and self educational purposes only.&nbsp;
             WARNING: Please use all Ai Tools offered on this site ethically per our user agreement.
          </p>
          <div className="mt-4 max-w-2xl mx-auto">
            <GlobalSearchBar />
          </div>
          
          {/* Shuffle & Filter Controls */}
          <div className="mt-6 flex flex-col gap-4">
            {/* Shuffle Buttons */}
            <div className="flex justify-center gap-3">
              <Button
                onClick={shuffleTools}
                variant="outline"
                className="border-purple-500/50 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400 transition-all"
              >
                🎲 Shuffle & Discover
              </Button>
              {isShuffled && (
                <Button
                  onClick={resetOrder}
                  variant="outline"
                  className="border-cyan-500/50 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all"
                >
                  ↺ Reset Order
                </Button>
              )}
            </div>
            
            {/* Category Filter - 9 Main Categories - Mobile Optimized */}
            <div className="w-full px-2 md:px-0">
              {/* Mobile: 3-column grid, Desktop: flex wrap */}
              <div className="grid grid-cols-3 md:flex md:flex-wrap md:justify-center gap-1 md:gap-2 max-w-6xl mx-auto">
                <Button
                  size="sm"
                  onClick={() => filterByCategory("ALL")}
                  className={`text-[10px] sm:text-xs md:text-sm px-2 sm:px-3 md:px-4 py-1.5 md:py-2 font-bold transition-all min-h-[36px] md:min-h-[40px] leading-tight ${
                    selectedCategory === "ALL"
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30"
                      : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-600/50"
                  }`}
                >
                  <span className="flex items-center justify-center gap-1">
                    <span>🌐</span>
                    <span className="truncate">ALL</span>
                    <span className="text-[9px] md:text-xs opacity-80">({categorizedGPTs.length})</span>
                  </span>
                </Button>
                {mainCategories.map((category, idx) => {
                  const count = categorizedGPTs.filter(g => g.filterCategory === category).length;
                  const emojis = ["📚", "🔮", "💚", "✍️", "🔬", "🤖", "🔍", "🏛️", "🎨"];
                  const colors = [
                    "from-blue-500 to-indigo-500",
                    "from-purple-500 to-pink-500",
                    "from-green-500 to-emerald-500",
                    "from-amber-500 to-orange-500",
                    "from-cyan-500 to-blue-500", 
                    "from-teal-500 to-green-500",
                    "from-orange-500 to-red-500",
                    "from-indigo-500 to-purple-500",
                    "from-pink-500 to-rose-500"
                  ];
                  // Shorter mobile-friendly category names
                  const shortNames: Record<string, string> = {
                    "EDUCATION & LEARNING": "LEARN",
                    "SPIRITUALITY & AWAKENING": "SPIRIT",
                    "HEALTH & WELLNESS": "HEALTH",
                    "WRITING & CONTENT": "WRITING",
                    "SCIENCE & HISTORY": "SCIENCE",
                    "AI DEVELOPMENT TOOLS": "AI DEV",
                    "INVESTIGATION & RESEARCH": "RESEARCH",
                    "PROFESSIONAL & CIVIC": "CIVIC",
                    "CREATIVE & LIFESTYLE": "CREATIVE"
                  };
                  return (
                    <Button
                      key={category}
                      size="sm"
                      onClick={() => filterByCategory(category)}
                      className={`text-[10px] sm:text-xs md:text-sm px-2 sm:px-3 py-1.5 md:py-2 font-bold transition-all min-h-[36px] md:min-h-[40px] leading-tight ${
                        selectedCategory === category
                          ? `bg-gradient-to-r ${colors[idx]} text-white shadow-lg`
                          : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-600/50"
                      }`}
                    >
                      <span className="flex items-center justify-center gap-1">
                        <span>{emojis[idx]}</span>
                        <span className="truncate hidden sm:inline">{category}</span>
                        <span className="truncate sm:hidden">{shortNames[category] || category}</span>
                        <span className="text-[9px] md:text-xs opacity-80">({count})</span>
                      </span>
                    </Button>
                  );
                })}
              </div>
            </div>
            
            {/* Results count */}
            <p className="text-sm text-muted-foreground">
              Showing {visibleGPTs.length} of {displayedGPTs.length} GPTs
              {selectedCategory !== "ALL" && ` in "${selectedCategory}"`}
              {isShuffled && " (shuffled)"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
          {visibleGPTs.map((gpt, index) => {
            const isHumanRightsCard = isHumanBillOfRightsCard(gpt.title);
            return (
            <Card 
              key={`${gpt.title}-${gpt.directUrl}`}
              className={`group relative overflow-hidden border-0 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-md hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:-translate-y-1 cursor-pointer ${isHumanRightsCard ? "sm:col-span-2 lg:col-span-2 xl:col-span-2 min-h-[460px] shadow-2xl shadow-primary/25 ring-1 ring-primary/40" : ""}`}
              onClick={() => handleCardClick(gpt.title)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${gpt.color} opacity-5 group-hover:opacity-15 transition-opacity duration-500`} />
              {isHumanRightsCard && (
                <div className="pointer-events-none absolute inset-0 opacity-30">
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(180deg,hsl(var(--primary)/0.18)_0_1px,transparent_1px_5px)] animate-pulse" />
                  <div className="absolute -inset-x-12 top-1/3 h-px bg-primary/70 shadow-[0_0_32px_hsl(var(--primary))]" />
                </div>
              )}
              
              <CardHeader className="pb-2 relative z-10">
                <div className="flex items-start justify-between mb-1.5 gap-2">
                  <div className="flex items-start gap-1.5 flex-1 min-w-0">
                    <span className="text-lg md:text-xl flex-shrink-0 mt-0.5">{gpt.emoji}</span>
                    <CardTitle 
                      className="font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-cyan-300 group-hover:from-yellow-200 group-hover:via-cyan-200 group-hover:to-yellow-200 transition-all uppercase tracking-wide break-words hyphens-auto"
                      style={{
                        fontFamily: "'Orbitron', sans-serif",
                        textShadow: '0 0 15px rgba(34, 211, 238, 0.5), 0 0 30px rgba(34, 211, 238, 0.2)',
                        wordBreak: 'break-word'
                      }}
                    >
                      <AutoScaleTitle title={gpt.title} baseSize="md" />
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0 ml-1">
                    <FavoritesButton 
                      tool={createToolObject(gpt)}
                      size="sm"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  <Badge className={`bg-gradient-to-r ${gpt.color} text-white text-[9px] md:text-[10px] px-1.5 py-0.5 font-medium flex-shrink-0`}>
                    {gpt.badge}
                  </Badge>
                  <Badge className="bg-green-500/90 hover:bg-green-500 text-white text-[9px] md:text-[10px] px-1.5 py-0.5 font-bold flex-shrink-0">
                    FREE
                  </Badge>
                  <ToolDisclaimerBadges 
                    tool={createToolObject(gpt)}
                    size="sm"
                  />
                </div>
              </CardHeader>
              
              <CardContent className="pt-0 pb-3 relative z-10">
                {gpt.videoUrl && (
                  <div className="mb-2 rounded-lg overflow-hidden relative aspect-video bg-black/20">
                    <LazyVideoEmbed videoUrl={gpt.videoUrl} title={gpt.title} />
                  </div>
                )}
                
                {!gpt.videoUrl && gpt.imageUrl && (
                  <div className="mb-2 rounded-lg overflow-hidden relative aspect-video bg-gradient-to-br from-card/50 to-card/30">
                    <HeroImage 
                      imageUrl={gpt.imageUrl}
                      title={gpt.title}
                      description={gpt.description}
                      badge={gpt.badge}
                      emoji={gpt.emoji}
                      color={gpt.color}
                    />
                  </div>
                )}
                
                <p className="text-[10px] md:text-xs text-muted-foreground mb-2 line-clamp-4 leading-relaxed">
                  {gpt.description}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-2">
                  {gpt.features.slice(0, 3).map((feature, idx) => (
                    <span 
                      key={idx}
                      className="text-[8px] md:text-[9px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                
                <FeaturedGptActions
                  titles={[FEATURED_PAGE_ALIASES[gpt.title] ?? gpt.title, gpt.title]}
                  tool={createToolObject(gpt)}
                />
                <Button 
                  size="sm"
                  className={`w-full bg-gradient-to-r ${gpt.color} hover:opacity-90 text-white text-[10px] md:text-xs py-1.5 font-medium transition-all duration-300 group-hover:shadow-lg ${isHumanRightsCard ? "min-h-11 text-sm font-black uppercase tracking-[0.18em] shadow-[0_0_24px_hsl(var(--primary)/0.55)]" : ""}`}
                  onClick={(e) => handleLaunchGPT(gpt.directUrl, gpt.title, gpt.badge, e)}
                >
                  {isHumanRightsCard ? "⚖️ Preserve Humanity →" : "🚀 Launch GPT →"}
                </Button>
              </CardContent>
            </Card>
          );
          })}
        </div>

        {hasMoreGPTs && (
          <div className="mt-8 flex flex-col items-center gap-2">
            <Button
              size="lg"
              onClick={() =>
                setVisibleCount((c) =>
                  Math.min(c + BATCH_SIZE, displayedGPTs.length)
                )
              }
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:opacity-90 text-white font-bold px-8 py-3 shadow-lg shadow-purple-500/30"
            >
              ⚡ Load {Math.min(BATCH_SIZE, displayedGPTs.length - visibleCount)} More GPTs
            </Button>
            <p className="text-xs text-muted-foreground">
              {displayedGPTs.length - visibleCount} more waiting
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SpecialServices;
