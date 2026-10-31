import { Tool } from "@/types/tools";
import { Gamepad2, Sparkles, Users, Wand2, Bot, Dice5 } from "lucide-react";
import leonardoAiHero from "@/assets/tools/leonardo-ai-hero.jpg";
import streamlabsHero from "@/assets/tools/streamlabs-hero.jpg";
import obsStudioHero from "@/assets/tools/obs-studio-hero.jpg";
import rpgMakerHero from "@/assets/tools/rpg-maker-hero.jpg";
import vrchatHero from "@/assets/tools/vrchat-hero.jpg";
import scenarioAiHero from "@/assets/tools/scenario-ai-hero.jpg";
import ludoAiHero from "@/assets/tools/ludo-ai-hero.jpg";
import inworldAiHero from "@/assets/tools/inworld-ai-hero.jpg";
import rosebudAiHero from "@/assets/tools/rosebud-ai-hero.jpg";
import convaiHero from "@/assets/tools/convai-hero.jpg";
import unityHero from "@/assets/tools/unity-hero.jpg";
import unrealEngineHero from "@/assets/tools/unreal-engine-hero.jpg";
import godotHero from "@/assets/tools/godot-hero.jpg";

import gearzeroAiHero from "@/assets/tools/gearzero-ai-hero.jpg";
import astrocadeHero from "@/assets/tools/astrocade-hero.jpg";
import existsAiHero from "@/assets/tools/exists-ai-hero.jpg";
import layerAiHero from "@/assets/tools/layer-ai-hero.jpg";
import jabaliAiHero from "@/assets/tools/jabali-ai-hero.jpg";
import bitmagicHero from "@/assets/tools/bitmagic-hero.jpg";

export const aiGamingTools: Tool[] = [
  {
    icon: Gamepad2,
    title: "Scenario.ai",
    description: "AI-powered game asset generation platform. Create custom game art, characters, environments, and props with consistent style for your game development projects.",
    emoji: "🎮",
    color: "from-purple-500 to-pink-600",
    directUrl: "https://www.scenario.com/?via=aiwebtools",
    imageUrl: scenarioAiHero,
    tags: ["game assets", "AI art", "game development", "character design", "environment art", "asset generation", "Game Asset Generator", "video game", "video game generator", "ai to make video games", "make video games"],
    category: "AI Gaming & Game Development",
    rating: 4.7,
    totalVotes: 11234
  },
  {
    icon: Dice5,
    title: "Ludo.ai",
    description: "AI-powered game design assistant for ideation, research, and documentation. Generate game concepts, mechanics, and design documents with intelligent suggestions.",
    emoji: "🎲",
    color: "from-blue-500 to-indigo-600",
    directUrl: "https://ludo.ai/?via=aiwebtools",
    imageUrl: ludoAiHero,
    tags: ["game design", "game concepts", "ideation", "game mechanics", "design documents", "AI assistant", "Game Design", "video game", "video game generator", "ai to make video games", "make video games"],
    category: "AI Gaming & Game Development",
    rating: 4.6,
    totalVotes: 9876
  },
  {
    icon: Users,
    title: "Inworld AI",
    description: "AI-powered character engine for creating intelligent NPCs with natural conversations, emotions, and memories. Build immersive interactive experiences and games.",
    emoji: "👥",
    color: "from-green-500 to-emerald-600",
    directUrl: "https://www.inworld.ai/?via=aiwebtools",
    imageUrl: inworldAiHero,
    tags: ["AI NPCs", "character AI", "conversational AI", "game characters", "interactive experiences", "intelligent agents", "NPC & Character AI", "video game", "video game generator", "ai to make video games"],
    category: "AI Gaming & Game Development",
    rating: 4.8,
    totalVotes: 13456
  },
  {
    icon: Wand2,
    title: "Rosebud AI",
    description: "AI game development platform for creating games through natural language. Build games by describing what you want, generate assets, and iterate instantly.",
    emoji: "🪄",
    color: "from-pink-500 to-rose-600",
    directUrl: "https://www.rosebud.ai/?via=aiwebtools",
    imageUrl: rosebudAiHero,
    tags: ["game development", "no-code games", "AI game creation", "natural language", "game builder", "rapid prototyping", "Game Development", "video game", "video game generator", "ai to make video games", "make video games", "create video games"],
    category: "AI Gaming & Game Development",
    rating: 4.5,
    totalVotes: 7890
  },
  {
    icon: Bot,
    title: "Convai",
    description: "Conversational AI for game characters and virtual worlds. Create NPCs with voice-based conversations, contextual awareness, and dynamic responses.",
    emoji: "🤖",
    color: "from-cyan-500 to-blue-600",
    directUrl: "https://www.convai.com/?via=aiwebtools",
    imageUrl: convaiHero,
    tags: ["conversational AI", "game NPCs", "voice AI", "virtual characters", "interactive dialogue", "game AI", "NPC & Character AI", "video game", "video game generator", "ai to make video games"],
    category: "AI Gaming & Game Development",
    rating: 4.6,
    totalVotes: 8234
  },
  {
    icon: Sparkles,
    title: "Leonardo.Ai",
    description: "AI-powered creative tool for generating game assets, concept art, and visual content. Create consistent, high-quality game art with style control.",
    emoji: "✨",
    color: "from-orange-500 to-red-600",
    directUrl: "https://leonardo.ai/?via=aiwebtools",
    imageUrl: leonardoAiHero,
    tags: ["game art", "concept art", "AI generation", "game assets", "visual content", "style consistency", "Game Asset Generator", "video game", "video game generator", "ai to make video games"],
    category: "AI Gaming & Game Development",
    rating: 4.7,
    totalVotes: 16789
  },
  {
    icon: Gamepad2,
    title: "Unity",
    description: "Industry-leading cross-platform game engine for creating 2D, 3D, VR, and AR games. Build once and deploy to 20+ platforms with powerful tools and asset store.",
    emoji: "🎮",
    color: "from-gray-600 to-gray-800",
    directUrl: "https://unity.com/?via=aiwebtools",
    imageUrl: unityHero,
    tags: ["game engine", "3D games", "2D games", "VR", "AR", "cross-platform", "Game Engine", "video game", "video game generator", "make video games", "create video games"],
    category: "AI Gaming & Game Development",
    rating: 4.8,
    totalVotes: 45678
  },
  {
    icon: Gamepad2,
    title: "Unreal Engine",
    description: "Epic Games' powerful real-time 3D creation tool for games, films, and experiences. Features photorealistic rendering, physics, and Blueprint visual scripting.",
    emoji: "🎮",
    color: "from-blue-600 to-purple-700",
    directUrl: "https://www.unrealengine.com/?via=aiwebtools",
    imageUrl: unrealEngineHero,
    tags: ["game engine", "3D games", "AAA games", "visual scripting", "photorealistic", "Game Engine", "video game", "video game generator", "make video games", "create video games"],
    category: "AI Gaming & Game Development",
    rating: 4.9,
    totalVotes: 52345
  },
  {
    icon: Gamepad2,
    title: "Godot Engine",
    description: "Free and open-source game engine for 2D and 3D games. Features GDScript, visual programming, and a dedicated community. Perfect for indie developers.",
    emoji: "🤖",
    color: "from-blue-400 to-cyan-500",
    directUrl: "https://godotengine.org/?via=aiwebtools",
    imageUrl: godotHero,
    tags: ["game engine", "open source", "2D games", "3D games", "indie games", "GDScript", "Game Engine", "video game", "video game generator", "make video games", "create video games"],
    category: "AI Gaming & Game Development",
    rating: 4.7,
    totalVotes: 23456
  },
  {
    icon: Sparkles,
    title: "Streamlabs",
    description: "All-in-one streaming software for Twitch, YouTube, and Facebook. Features alerts, overlays, chatbot, and monetization tools for content creators.",
    emoji: "📺",
    color: "from-green-500 to-teal-600",
    directUrl: "https://streamlabs.com/?via=aiwebtools",
    imageUrl: streamlabsHero,
    tags: ["streaming", "twitch", "youtube", "content creator", "live stream", "overlays", "Streaming Tools"],
    category: "AI Gaming & Game Development",
    rating: 4.6,
    totalVotes: 34567
  },
  {
    icon: Bot,
    title: "OBS Studio",
    description: "Free and open-source software for video recording and live streaming. Professional-grade broadcasting with scenes, sources, and audio mixing.",
    emoji: "🎬",
    color: "from-gray-700 to-gray-900",
    directUrl: "https://obsproject.com/?via=aiwebtools",
    imageUrl: obsStudioHero,
    tags: ["streaming", "recording", "broadcasting", "open source", "video capture", "Streaming Tools"],
    category: "AI Gaming & Game Development",
    rating: 4.8,
    totalVotes: 67890
  },
  {
    icon: Gamepad2,
    title: "RPG Maker",
    description: "Game development tool for creating RPGs without programming knowledge. Features tile-based maps, event systems, and customizable game mechanics.",
    emoji: "⚔️",
    color: "from-red-500 to-orange-600",
    directUrl: "https://www.rpgmakerweb.com/?via=aiwebtools",
    imageUrl: rpgMakerHero,
    tags: ["rpg maker", "game development", "no-code", "rpg games", "storytelling", "Game Development", "video game", "video game generator", "make video games", "create video games"],
    category: "AI Gaming & Game Development",
    rating: 4.5,
    totalVotes: 18765
  },
  {
    icon: Sparkles,
    title: "VRChat",
    description: "Social VR platform for creating and exploring virtual worlds. Build custom avatars, worlds, and interactive experiences in virtual reality.",
    emoji: "🌐",
    color: "from-purple-500 to-indigo-600",
    directUrl: "https://hello.vrchat.com/?via=aiwebtools",
    imageUrl: vrchatHero,
    tags: ["virtual worlds", "VR", "social VR", "avatars", "metaverse", "Virtual Worlds"],
    category: "AI Gaming & Game Development",
    rating: 4.6,
    totalVotes: 28900
  },
  {
    icon: Gamepad2,
    title: "GearZero",
    description: "AI video game maker that turns your ideas into playable games: describe the world, characters and rules, and GearZero builds it with AI so anyone can create and share games without coding. The zero point where imagination becomes gameplay.",
    emoji: "⚙️",
    color: "from-orange-500 to-emerald-600",
    directUrl: "https://gearzero.ai/?via=aiwebtools",
    imageUrl: gearzeroAiHero,
    tags: ["GearZero", "gearzero.ai", "Gear Zero", "video game", "video game generator", "ai to make video games", "make video games", "create video games", "AI game maker", "game development", "no-code games", "Game Development", "Freemium", "free tier"],
    category: "AI Gaming & Game Development",
    rating: 4.6,
    totalVotes: 500
  },
  {
    icon: Gamepad2,
    title: "Astrocade",
    description: "AI game creation platform where you type an idea and get a playable mini-game in minutes, then remix and share games with a community of creators.",
    emoji: "🕹️",
    color: "from-fuchsia-500 to-cyan-500",
    directUrl: "https://www.astrocade.com/?via=aiwebtools",
    imageUrl: astrocadeHero,
    tags: ["Astrocade", "astrocade.com", "arcade", "video game", "video game generator", "ai to make video games", "make video games", "create video games", "AI game maker", "game development", "no-code games", "Game Development", "Freemium", "free tier"],
    category: "AI Gaming & Game Development",
    rating: 4.6,
    totalVotes: 500
  },
  {
    icon: Gamepad2,
    title: "Exists",
    description: "Generative AI platform that turns text prompts into playable 3D multiplayer games, building worlds, characters and gameplay without code.",
    emoji: "🌍",
    color: "from-blue-500 to-sky-600",
    directUrl: "https://www.exists.ai/?via=aiwebtools",
    imageUrl: existsAiHero,
    tags: ["Exists", "Exists AI", "exists.ai", "3D games", "multiplayer", "text to 3D game", "video game", "video game generator", "ai to make video games", "make video games", "create video games", "AI game maker", "game development", "no-code games", "Game Development", "Freemium", "free tier"],
    category: "AI Gaming & Game Development",
    rating: 4.6,
    totalVotes: 500
  },
  {
    icon: Gamepad2,
    title: "Layer AI",
    description: "AI game art platform for studios that generates on-style characters, items and environments at scale, trained on your game's art direction.",
    emoji: "🧱",
    color: "from-teal-500 to-amber-500",
    directUrl: "https://www.layer.ai/?via=aiwebtools",
    imageUrl: layerAiHero,
    tags: ["Layer AI", "layer.ai", "game art", "game assets", "art direction", "video game", "video game generator", "ai to make video games", "make video games", "create video games", "AI game maker", "game development", "no-code games", "Game Development", "Freemium", "free tier"],
    category: "AI Gaming & Game Development",
    rating: 4.6,
    totalVotes: 500
  },
  {
    icon: Gamepad2,
    title: "Jabali AI",
    description: "AI game studio with agents that help you design, build and playtest games from a prompt, generating levels, sprites and code so solo creators can ship faster.",
    emoji: "🤖",
    color: "from-amber-500 to-green-600",
    directUrl: "https://jabali.ai/?via=aiwebtools",
    imageUrl: jabaliAiHero,
    tags: ["Jabali", "Jabali AI", "jabali.ai", "AI game agents", "game prototyping", "video game", "video game generator", "ai to make video games", "make video games", "create video games", "AI game maker", "game development", "no-code games", "Game Development", "Freemium", "free tier"],
    category: "AI Gaming & Game Development",
    rating: 4.6,
    totalVotes: 500
  },
  {
    icon: Gamepad2,
    title: "BitMagic",
    description: "Create games with words: BitMagic uses generative AI to build playable game worlds from natural-language prompts, no programming needed.",
    emoji: "🪄",
    color: "from-purple-500 to-lime-500",
    directUrl: "https://www.bitmagic.ai/?via=aiwebtools",
    imageUrl: bitmagicHero,
    tags: ["BitMagic", "bitmagic.ai", "Bit Magic", "text to game", "video game", "video game generator", "ai to make video games", "make video games", "create video games", "AI game maker", "game development", "no-code games", "Game Development", "Freemium", "free tier"],
    category: "AI Gaming & Game Development",
    rating: 4.6,
    totalVotes: 500
  }
];
