
import { Tool } from "@/types/tools";
import { Brain, Palette, FileText, Video, Zap, Search, Image, Music, Calendar, Target, Database } from "lucide-react";
import directoryListHero from "@/assets/tools/aiwebtools-directory-list-hero.jpg";

export const additionalSpecializedGPTs: Tool[] = [
  {
    icon: Database,
    title: "Downloadable AIWebTools Directory List",
    description: "The complete downloadable AIWebTools.ai directory in a single CSV file — every AI tool in our database with names, descriptions, categories, direct URLs, video URLs, image URLs, tags, ratings, and metadata. Perfect for researchers, builders, marketers, and AI enthusiasts who want offline access to the full AI Tools catalog. Always synced with the live database. Click 'USE IT NOW' to instantly download the latest CSV export.",
    emoji: "📊",
    color: "from-green-500 to-emerald-600",
    directUrl: "https://aiwebtools.lovable.app/downloads/aiwebtools-directory-list.csv",
    imageUrl: directoryListHero,
    tags: ["downloadable", "csv", "directory", "database", "export", "ai tools list", "spreadsheet", "research", "data", "catalog", "complete directory", "offline", "aiwebtools", "Custom GPT"],
    category: "Additional Specialized",
    rating: 5.0,
    totalVotes: 8888,
    isFree: true
  },
  {
    icon: Brain,
    title: "Dream Interpreter GPT",
    description: "Dream Interpreter GPT is an AI-driven tool designed to analyze and interpret dreams using psychological, mythological, and symbolic frameworks. It helps users uncover hidden meanings, explore subconscious patterns, and gain insights into their emotions and personal growth. By breaking down dream symbols, guiding introspection, and offering actionable advice, it empowers users to better understand themselves through their dreams.",
    emoji: "💭",
    color: "from-purple-500 to-pink-600",
    directUrl: "https://dreaminterpreter.lovable.app/?via=aiwebtools",
    imageUrl: "https://img1.wsimg.com/isteam/ip/9fd6d942-5b46-4025-92e2-0f1ec2a7adf2/an-ad-for-an-ai-tool-called-dream-interp_5LG7D.png/:/cr=t:0%25,l:0%25,w:100%25,h:100%25/rs=w:600,cg:true/qt=q:30",
    tags: ["dream analysis", "psychology", "personal growth", "subconscious", "symbolism", "Custom GPT"],
    category: "Additional Specialized",
    rating: 4.6,
    totalVotes: 4321
  },
  {
    icon: Palette,
    title: "Sketch Artist GPT",
    description: "Sketch Artist GPT is your AI-powered sketch art assistant, turning images or text descriptions into clean, high-resolution sketches using advanced Python and DALLE technology. Whether you're uploading a photo or describing an idea, Sketch Artist GPT delivers precise, professional sketches ready for creative use.",
    emoji: "✏️",
    color: "from-gray-500 to-blue-600",
    directUrl: "https://sketchartistgpt.lovable.app/?via=aiwebtools",
    imageUrl: "https://img1.wsimg.com/isteam/ip/9fd6d942-5b46-4025-92e2-0f1ec2a7adf2/an-advertisement-for-an-ai-tool-called-s_CPSIx.png/:/cr=t:0%25,l:0%25,w:100%25,h:100%25/rs=w:600,cg:true/qt=q:98",
    tags: ["sketch art", "digital art", "image conversion", "artistic tools", "creative design", "Custom GPT"],
    category: "Additional Specialized",
    rating: 4.7,
    totalVotes: 5234
  },
  {
    icon: Search,
    title: "AI Tools Finder GPT",
    description: "Your own personal expert in the world of Ai Tools and knowledge. Locate the best Ai tools for your projects and be presented with step by step guides on any Ai tool that exists.",
    emoji: "🔍",
    color: "from-cyan-500 to-blue-600",
    directUrl: "https://aitoolfinder.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/p3czNalrf8c",
    tags: ["AI tools", "tool discovery", "resource finder", "technology guides", "AI research", "Custom GPT"],
    category: "Additional Specialized",
    rating: 4.8,
    totalVotes: 6789
  },
  {
    icon: FileText,
    title: "Article and Blog Rewriter GPT",
    description: "Rewrite epic SEO optimized articles and blogs! Simply copy and paste the blog or article you wish to rewrite and bam! 🎯",
    emoji: "📝",
    color: "from-green-500 to-blue-600",
    directUrl: "https://rewritergpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/5n1RHKoQ-Ds",
    imageUrl: "https://img1.wsimg.com/isteam/ip/9fd6d942-5b46-4025-92e2-0f1ec2a7adf2/1000005696.jpg/:/cr=t:9.9%25,l:0%25,w:100%25,h:80.21%25/rs=w:600,h:300,cg:true/qt=q:98",
    tags: ["content rewriting", "SEO optimization", "blog writing", "article creation", "content marketing", "Custom GPT"],
    category: "Additional Specialized",
    rating: 4.6,
    totalVotes: 4321
  },
  {
    icon: Video,
    title: "Video Second-by-Second Analysis GPT",
    description: "Video Second-by-Second Analysis GPT breaks down your footage with incredible precision, analyzing every second and extracting key visual frames for detailed insight. Just upload your video, and this AI tool will guide you through a step-by-step review of each moment—highlighting actions, people, objects, and scene changes. It's also a powerful resource for training and fine-tuning Vision-Language Models (VLMs), offering structured, labeled visual data with contextual analysis. Ideal for creators, analysts, educators, researchers, and investigators who need deep clarity from their video content.",
    emoji: "🎥",
    color: "from-red-500 to-purple-600",
    directUrl: "https://videoanalysisgpt.lovable.app/?via=aiwebtools",
    imageUrl: "https://img1.wsimg.com/isteam/ip/9fd6d942-5b46-4025-92e2-0f1ec2a7adf2/a-banner-ad-with-the-text-video-second-b_764zv.png/:/cr=t:0%25,l:0%25,w:100%25,h:100%25/rs=w:600,cg:true/qt=q:98",
    tags: ["video analysis", "frame extraction", "visual analytics", "research tools", "content analysis", "Custom GPT"],
    category: "Additional Specialized",
    rating: 4.7,
    totalVotes: 5432
  },
  {
    icon: Image,
    title: "\"MiddleJourney\" Midjourney Prompting Assistant",
    description: "MiddleJourney Prompt Enhancer is the ultimate AI expert when it comes to all things Midjourney. Whether you need help optimizing prompts, seeking answers to questions about Midjourney, or crafting new prompts to enhance your experience, MiddleJourney Prompt Enhancer has got you covered. With its advanced capabilities and vast knowledge, MiddleJourney Prompt Enhancer is your go-to resource for making the most out of your midjourney. Trust in this expert AI tool to guide you through every step of the journey with precision and efficiency.",
    emoji: "🎨",
    color: "from-pink-500 to-purple-600",
    directUrl: "https://texttovideoprompter.lovable.app/?via=aiwebtools",
    imageUrl: "https://img1.wsimg.com/isteam/ip/9fd6d942-5b46-4025-92e2-0f1ec2a7adf2/a-visually-captivating-advertisement-for-the-.jpeg/:/cr=t:0.11%25,l:0%25,w:100%25,h:75%25/rs=w:600,h:300,cg:true/qt=q:98",
    tags: ["Midjourney", "prompt optimization", "AI art", "image generation", "creative tools", "Custom GPT"],
    category: "Additional Specialized",
    rating: 4.8,
    totalVotes: 6234
  },
  {
    icon: Search,
    title: "🕊️Mary Magdalene GPT",
    description: "Connect with Mary Magdalene to explore the profound depths of her Gnostic divine secrets. This GPT challenges the norm by unveiling insights that were once hidden. It is exclusively trained on unaltered Christian texts, such as the Gospel of Mary and the Gospel of Thomas, which were unearthed in 1945 and have seldom been discussed in society. We asked Mary Magdalene GPT to write her own song for humanity, and so she did... \"Et veritas vos liberabit.\"",
    emoji: "🕊️",
    color: "from-yellow-500 to-orange-600",
    directUrl: "https://marymagdalenegpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://www.youtube.com/watch?v=7qxEnBR2BwQ",
    tags: ["spirituality", "gnostic teachings", "religious studies", "historical texts", "divine wisdom", "Custom GPT"],
    category: "Additional Specialized",
    rating: 4.9,
    totalVotes: 7234
  },
  {
    icon: Target,
    title: "Snoop Image Ai - Experimental AI Image Generation Detector",
    description: "Introducing Snoop Image AI — your go-to tool for verifying image authenticity, infused with the unmistakable style of Snoop Dogg. This experimental tool analyzes images to assess whether they are likely real or AI-generated. While not 100% accurate—due to the advanced realism of modern AI-generated visuals—it identifies key indicators of an image's origin. These include metadata analysis, deep color screening, and precision pixel measurements to offer clues about its authenticity.",
    emoji: "🔍",
    color: "from-green-500 to-purple-600",
    directUrl: "https://snoopimageai.lovable.app/?via=aiwebtools",
    imageUrl: "https://img1.wsimg.com/isteam/ip/9fd6d942-5b46-4025-92e2-0f1ec2a7adf2/an-advertisement-for-snoop-image-ai-presented-.png/:/cr=t:5.43%25,l:0%25,w:100%25,h:89.13%25/rs=w:600,h:300,cg:true/qt=q:98",
    tags: ["image detection", "AI verification", "authenticity check", "digital forensics", "image analysis", "Custom GPT"],
    category: "Additional Specialized",
    rating: 4.5,
    totalVotes: 3876
  },
  {
    icon: FileText,
    title: "Legal Draftsmith GPT",
    description: "Specializes in the precise drafting of legal documents.",
    emoji: "⚖️",
    color: "from-blue-500 to-gray-600",
    directUrl: "https://publicdefendergpt.lovable.app/?via=aiwebtools",
    imageUrl: "https://img1.wsimg.com/isteam/ip/9fd6d942-5b46-4025-92e2-0f1ec2a7adf2/a-3d-render-of-a-humanoid-robot-dressed-like-a.png/:/cr=t:12.29%25,l:9.16%25,w:89.29%25,h:79.58%25/rs=w:600,h:300,cg:true,m/qt=q:98",
    tags: ["legal documents", "contract drafting", "legal writing", "document creation", "legal assistance", "Custom GPT"],
    category: "Additional Specialized",
    rating: 4.6,
    totalVotes: 4321
  },
  {
    icon: Zap,
    title: "Custom GPT Ideas & Brainstorming Assistant",
    description: "GPT Ideas and Instructions Assistant",
    emoji: "💡",
    color: "from-yellow-500 to-red-600",
    directUrl: "https://customgptmaker.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/XSZM8ePQOzY",
    tags: ["brainstorming", "idea generation", "GPT creation", "AI development", "creative assistance", "Custom GPT"],
    category: "Additional Specialized",
    rating: 4.7,
    totalVotes: 5432
  }
];
