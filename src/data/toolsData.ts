import { applyResurrectionAndHistoryTags } from "@/utils/digitalResurrectionTagging";
import { Tool } from "@/types/tools";
import { getAllToolCategories } from './toolsCollection';
import { searchTools } from '@/utils/searchUtils';
import { createFeaturedTools } from '@/utils/featuredTools';
import { getCategoriesWithCounts, getToolsByCategory } from '@/utils/categoryUtils';
import { consolidateTools } from '@/utils/categoryConsolidation';
import { deduplicateTools } from '@/utils/toolDeduplication';
import { markFreeTools, ensureTitleTags } from '@/utils/toolUtils';
import { ensurePricingTags } from '@/utils/pricingClassification';
import { applySpirtualTags } from '@/utils/spiritualTagging';
import { normalizeToolCategories } from '@/utils/category/canonicalCategory';


// Import AI Web Tools GPTs - PRIORITY FEATURED TOOLS
import { priorityFeaturedGPTs } from "./tools/aiWebTools/priorityFeaturedGPTs";
import { secondPriorityFeaturedGPTs } from "./tools/aiWebTools/secondPriorityFeaturedGPTs";
import { thirdPriorityFeaturedGPTs } from "./tools/aiWebTools/thirdPriorityFeaturedGPTs";
import { fourthPriorityFeaturedGPTs } from "./tools/aiWebTools/fourthPriorityFeaturedGPTs";

// Import AI Web Tools GPT Collections
import { aiWebToolsGPTs } from "./tools/aiWebTools/aiWebToolsGPTs";
import { advancedSpecialtyGPTs } from "./tools/aiWebTools/advancedSpecialtyGPTs";
import { additionalSpecializedGPTs } from "./tools/aiWebTools/additionalSpecializedGPTs";
import { finalSpecializedGPTs } from "./tools/aiWebTools/finalSpecializedGPTs";
import { newSpecializedGPTs } from "./tools/aiWebTools/newSpecializedGPTs";

// Import AI Web Tools Category Collections
import { personalDevelopmentGPTs } from "./tools/aiWebTools/personalDevelopmentGPTs";
import { educationAndLearningGPTs } from "./tools/aiWebTools/educationAndLearningGPTs";
import { educationalToolsGPTs } from "./tools/aiWebTools/educationalToolsGPTs";
import { healthAndWellnessGPTs } from "./tools/aiWebTools/healthAndWellnessGPTs";
import { researchAndPharmaceuticalGPTs } from "./tools/aiWebTools/researchAndPharmaceuticalGPTs";
import { scienceAndResearchGPTs } from "./tools/aiWebTools/scienceAndResearchGPTs";
import { businessAndFinanceGPTs } from "./tools/aiWebTools/businessAndFinanceGPTs";
import { businessStrategyGPTs } from "./tools/aiWebTools/businessStrategyGPTs";
import { legalAndGovernmentGPTs } from "./tools/aiWebTools/legalAndGovernmentGPTs";
import { governmentCivicGPTs } from "./tools/aiWebTools/governmentCivicGPTs";
import { professionalServicesGPTs } from "./tools/aiWebTools/professionalServicesGPTs";
import { utilityAndProductivityGPTs } from "./tools/aiWebTools/utilityAndProductivityGPTs";
import { creativeAndMediaGPTs } from "./tools/aiWebTools/creativeAndMediaGPTs";
import { contentCreationToolsGPTs } from "./tools/aiWebTools/contentCreationToolsGPTs";
import { multimediaAndContentGPTs } from "./tools/aiWebTools/multimediaAndContentGPTs";
import { artAndCreativeGPTs } from "./tools/aiWebTools/artAndCreativeGPTs";
import { aiPromptingAndGenerationGPTs } from "./tools/aiWebTools/aiPromptingAndGenerationGPTs";
import { communicationAndEntertainmentGPTs } from "./tools/aiWebTools/communicationAndEntertainmentGPTs";
import { entertainmentAndGamingGPTs } from "./tools/aiWebTools/entertainmentAndGamingGPTs";
import { foodAndHospitalityGPTs } from "./tools/aiWebTools/foodAndHospitalityGPTs";
import { investigativeAndAnalysisGPTs } from "./tools/aiWebTools/investigativeAndAnalysisGPTs";
import { appraisalAndValuationGPTs } from "./tools/aiWebTools/appraisalAndValuationGPTs";
import { mysteriousAndUnusualGPTs } from "./tools/aiWebTools/mysteriousAndUnusualGPTs";
import { spiritualAndPhilosophyGPTs } from "./tools/aiWebTools/spiritualAndPhilosophyGPTs";
import { timeAndHistoryGPTs } from "./tools/aiWebTools/timeAndHistoryGPTs";
import { technologyInnovationGPTs } from "./tools/aiWebTools/technologyInnovationGPTs";
import { specializedNicheToolsGPTs } from "./tools/aiWebTools/specializedNicheToolsGPTs";
import { verifiedMissingBatch2026XV } from "./tools/verifiedMissingBatch2026XV";
import { verifiedMissingBatch2026XVI } from "./tools/verifiedMissingBatch2026XVI";

// PREVIOUSLY MISSING IMPORTS - NOW INCLUDED TO RAISE TOOL COUNT
import { customGeminiGems } from "./tools/aiWebTools/customGeminiGems";
import { inspectorAndSafetyGPTs } from "./tools/aiWebTools/inspectorAndSafetyGPTs";
import { philosophyAndLifestyleGPTs } from "./tools/aiWebTools/philosophyAndLifestyleGPTs";
import { videoPromptGPTs } from "./tools/aiWebTools/videoPromptGPTs";

import { newAffiliatePlatforms2025 } from "./tools/newAffiliatePlatforms2025";
import { newPersonalDevelopmentTools } from "./tools/newPersonalDevelopmentTools";

// Import WEB3 domains
import { web3DomainsTools } from "./tools/web3DomainsTools";

// Import SFX Generator Tools
import { sfxGeneratorTools } from "./tools/sfxGeneratorTools";

// Import Emerging & Healthcare AI Tools 2025
import { emergingAITools2025 } from "./tools/emergingAITools2025";
import { healthcareAITools2025 } from "./tools/healthcareAITools2025";
import { healthcareAITools2025Batch2 } from "./tools/healthcareAITools2025Batch2";

// Import Email Productivity Tools 2025
import { emailProductivityTools2025 } from "./tools/emailProductivityTools2025";

// Import 3D Modeling Tools 2025
import { threeDModelingTools2025 } from "./tools/threeDModelingTools2025";

// Import AI Agents 2025
import { aiAgents2025 } from "./tools/aiAgents2025";
import { aiAgents2025Batch2 } from "./tools/aiAgents2025Batch2";

// Import Lifestyle Tools 2025 (Life Assistants, Memory, Face Swap, Finance, Audio)
import { lifestyleTools2025 } from "./tools/lifestyleTools2025";

// Import Multi-Category Tools 2025 (Legal, Real Estate, Games, Travel, Fashion, Healthcare, Data, Future Video, Prompts)
import { multiCategoryTools2025 } from "./tools/multiCategoryTools2025";

// Import Image, Translation & Storytelling Tools 2025
import { imageTranslationStorytelling2025 } from "./tools/imageTranslationStorytelling2025";

// Import Marketing, Transcriber & Storytelling Tools 2025 (16 new verified tools)
import { marketingTranscriberStorytelling2025 } from "./tools/marketingTranscriberStorytelling2025";

// Import Verified AI Tools Batch 2025 (20+ new verified tools)
import { verifiedToolsBatch2025 } from "./tools/verifiedToolsBatch2025";

// Import Missing Tools Batch 2025 (7 new verified tools)
import { missingToolsBatch2025 } from "./tools/missingToolsBatch2025";

// Import Audit Batch Q2 2025 (14 new verified tools: TTS, AI Detection, Logo, Email Marketing)
import { auditBatch2025Q2Tools } from "./tools/auditBatch2025Q2";

// Import Audit Batch Q2 2025 Part 2 (20 new verified tools: E-commerce, AI Humanizer, Human Resources)
import { auditBatch2025Q2Part2Tools } from "./tools/auditBatch2025Q2Part2";

// Import Audit Batch Q2 2025 Part 3 (12 new verified tools: AI Chat, Video Gen, TTS, Education)
import { auditBatch2025Q2Part3 } from "./tools/auditBatch2025Q2Part3";

// Import Audit Batch Q2 2025 Part 4 (8 new verified tools: Logo Creation, Website & Design)
import { auditBatch2025Q2Part4Tools } from "./tools/auditBatch2025Q2Part4";

// Import Audit Batch Q2 2025 Part 5 (8 new verified tools: Image Editing, Video Edition, Audio Editing)
import { auditBatch2025Q2Part5Tools } from "./tools/auditBatch2025Q2Part5";

// Import Audit Batch Q2 2025 Part 6 (16 new verified tools: Extensions ChatGPT, Social Networks, Summarizer, Productivity)
import { auditBatch2025Q2Part6Tools } from "./tools/auditBatch2025Q2Part6";

// Import Audit Batch Q2 2025 Part 7 (17 new verified tools: Presentation, Files & Spreadsheets, Music, Face Swap)
import { auditBatch2025Q2Part7Tools } from "./tools/auditBatch2025Q2Part7";

// Import Audit Batch Q2 2025 Part 8 (7 new verified tools: Finance, Text Generators, Research & Science, Text-to-Video)
import { auditBatch2025Q2Part8Tools } from "./tools/auditBatch2025Q2Part8";

// Import Audit Batch Q2 2025 Part 9 (13 new verified tools: Translation, Marketing, Transcriber, Storytelling Generator)
import { auditBatch2025Q2Part9Tools } from "./tools/auditBatch2025Q2Part9";

// Import Audit Batch Q2 2025 Part 10 (8 new verified tools: ChatBots, Voice Cloning, Avatars, Amazing)
import { auditBatch2025Q2Part10Tools } from "./tools/auditBatch2025Q2Part10";

// Import Audit Batch Q2 2025 Part 11 (12 new verified tools: No Code/Low Code, Assistant Code, Developer Tools, Legal Assistants)
import { auditBatch2025Q2Part11Tools } from "./tools/auditBatch2025Q2Part11";

// Import Audit Batch Q2 2025 Part 12 (4 new verified tools: Business, Prompts & Aids)
import { auditBatch2025Q2Part12Tools } from "./tools/auditBatch2025Q2Part12";

// Import Audit Batch Q2 2025 Part 13 (6 new verified tools: Real Estate/Architect, Art, Travel)
import { auditBatch2025Q2Part13Tools } from "./tools/auditBatch2025Q2Part13";

// Import Audit Batch Q2 2025 Part 14 (6 new verified tools: Fashion, Dating & Relationships, Healthcare, Automation)
import { auditBatch2025Q2Part14Tools } from "./tools/auditBatch2025Q2Part14";

// Import Audit Batch Q2 2025 Part 15 (15 new verified tools: LLM Models, Data & Analytics, Assistive Technology, Future Tools)
import { auditBatch2025Q2Part15Tools } from "./tools/auditBatch2025Q2Part15";

// Import Future Tools Batch Q2 2025 (45+ new verified Future Tools)
import { futureToolsBatch2025Q2 } from "./tools/futureToolsBatch2025Q2";

// Import Trending Tools Batch 2025 (11 new trending tools: Face Shape, Photo Editor, Seedance, Wan2.6, MiniMax, etc.)
import { trendingToolsBatch2025 } from "./tools/trendingToolsBatch2025";

// Import Top AI Agent Platforms 2026 (Dify, Coze, Flowise, Letta, Agno)
import { topAgentPlatforms2026 } from "./tools/topAgentPlatforms2026";

// Import Top AI Agent Platforms 2026 Batch 2 (Wordware, Composio, SmythOS, MindPal, AgentOps)
import { topAgentPlatforms2026Batch2 } from "./tools/topAgentPlatforms2026Batch2";

// Import New AI Agents 2026 (15 verified: MultiOn, CodeRabbit, Phind, Induced, BrowserBase, LangGraph, Beam AI, Fixie, Sweep, Fine.dev, Adept, OpenHands, Dia Browser, Axiom, Ottogrid)
import { newAIAgents2026 } from "./tools/newAIAgents2026";

// Import New AI Agents Batch 2026 D (25 verified: Orby, Cresta, Hebbia, Glia, Forethought, Magic.dev, Reflection AI, Sema4.ai, Imbue, Kortix Suna, Klarity, Norm Ai, Pinecone Assistant, Lutra, Phonely, CrewAI Studio, Letta Cloud, Smol Developer, ChatDev, Druid AI, Rasa Pro, Pega GenAI, Workato Genie, Vespper, Tavily)
import { newAIAgentsBatch2026D } from "./tools/newAIAgentsBatch2026D";

// Import Enterprise Agents 2026 (26 tools: Salesforce Agentforce, Vertex AI, Ema, Decagon, Sierra, etc.)
import { enterpriseAgents2026 } from "./tools/enterpriseAgents2026";

// Import Advanced Agents Batch 2026 (25 tools: Agent Zero, Vercel AI SDK, OpenRouter, Langfuse, Haystack, etc.)
import { advancedAgentsBatch2026 } from "./tools/advancedAgentsBatch2026";

// Import Frontier Agents Batch 2026 (20 tools: Wayve, Mojo, Pinecone Canopy, Weaviate Verba, Heptabase, Readwise Reader, EvenUp, Osmo, Atomic AI, Formstack AI, Arthur Shield, Lasso Security, Protect AI, HiddenLayer, WhyLabs, Humane AI, NVIDIA Isaac, Hailo, BrainChip, Skyfire)
import { frontierAgentsBatch2026 } from "./tools/frontierAgentsBatch2026";

// Import Frontier Infrastructure Batches 2026 (67 tools: Security, No-Code, HR, Dev Infra, Sales, Finance, Productivity)
import { frontierInfraBatch2026 } from "./tools/frontierInfraBatch2026";
import { frontierInfraBatch2026B2 } from "./tools/frontierInfraBatch2026B2";
import { frontierInfraBatch2026B3 } from "./tools/frontierInfraBatch2026B3";

// Import Frontier Infrastructure Batches 2026 C1-C4 (57 tools: Orchestration, Evaluation, Hosting, Voice, Industry, Productivity)
import { frontierInfraBatch2026C1 } from "./tools/frontierInfraBatch2026C1";
import { frontierInfraBatch2026C2 } from "./tools/frontierInfraBatch2026C2";
import { frontierInfraBatch2026C3 } from "./tools/frontierInfraBatch2026C3";
import { frontierInfraBatch2026C4 } from "./tools/frontierInfraBatch2026C4";
import { newFrontierBatch2026Jun } from "./tools/newFrontierBatch2026Jun";
import { topNewBatch2026Jun20 } from "./tools/topNewBatch2026Jun20";
import { topNewBatch2026Jun25 } from "./tools/topNewBatch2026Jun25";
import { topAgentsBatch2026Jul } from "./tools/topAgentsBatch2026Jul";
import { topAgentsBatch2026JulPart2 } from "./tools/topAgentsBatch2026JulPart2";
import { topAgentsBatch2026JulPart3 } from "./tools/topAgentsBatch2026JulPart3";
import { topAgentsBatch2026JulPart4 } from "./tools/topAgentsBatch2026JulPart4";
import { topAgentsBatch2026JulPart5 } from "./tools/topAgentsBatch2026JulPart5";
import { topAgentsBatch2026JulPart6 } from "./tools/topAgentsBatch2026JulPart6";
import { topAgentsBatch2026JulPart7 } from "./tools/topAgentsBatch2026JulPart7";
import { topAgentsBatch2026JulPart8 } from "./tools/topAgentsBatch2026JulPart8";
import { topAgentsBatch2026JulPart9 } from "./tools/topAgentsBatch2026JulPart9";
import { topAgentsBatch2026JulPart10 } from "./tools/topAgentsBatch2026JulPart10";
import { topAgentsBatch2026JulPart11 } from "./tools/topAgentsBatch2026JulPart11";
import { topAgentsBatch2026JulPart12 } from "./tools/topAgentsBatch2026JulPart12";
import { topAgentsBatch2026JulPart13 } from "./tools/topAgentsBatch2026JulPart13";
import { topAgentsBatch2026JulPart14 } from "./tools/topAgentsBatch2026JulPart14";
import { topAgentsBatch2026JulPart15 } from "./tools/topAgentsBatch2026JulPart15";
import { topAgentsBatch2026JulPart16 } from "./tools/topAgentsBatch2026JulPart16";
import { topAgentsBatch2026JulPart17 } from "./tools/topAgentsBatch2026JulPart17";
import { topAgentsBatch2026JulPart18 } from "./tools/topAgentsBatch2026JulPart18";
import { topAgentsBatch2026JulPart19 } from "./tools/topAgentsBatch2026JulPart19";
import { topAgentsBatch2026JulPart20 } from "./tools/topAgentsBatch2026JulPart20";
import { topAgentsBatch2026JulPart21 } from "./tools/topAgentsBatch2026JulPart21";
import { topAgentsBatch2026JulPart22 } from "./tools/topAgentsBatch2026JulPart22";
import { deepAgentToolsBatch2026 } from "./tools/deepAgentToolsBatch2026";

// Import Frontier Batch D1-D4 (70 tools: Healthcare, Finance, Security, Enterprise, Agencies)
import { frontierBatchD1 } from "./tools/frontierBatchD1";
import { frontierBatchD2 } from "./tools/frontierBatchD2";
import { frontierBatchD3 } from "./tools/frontierBatchD3";
import { frontierBatchD4 } from "./tools/frontierBatchD4";
import { frontierBatchE1 } from "./tools/frontierBatchE1";
import { frontierBatchE2 } from "./tools/frontierBatchE2";
import { videoToolsBatch2026 } from "./tools/videoToolsBatch2026";
import { specializedAgentsBatch2026 } from "./tools/specializedAgentsBatch2026";
import { voiceAgentsBatch2026 } from "./tools/voiceAgentsBatch2026";
import { productivityAgentsBatch2026 } from "./tools/productivityAgentsBatch2026";
import { digitalHumansBatch2026 } from "./tools/digitalHumansBatch2026";
import { enterpriseOrchBatch2026 } from "./tools/enterpriseOrchBatch2026";
import { phoneAgentsBatch2026 } from "./tools/phoneAgentsBatch2026";
import { roboticsBatch2026 } from "./tools/roboticsBatch2026";
import { nicheBatch2026 } from "./tools/nicheBatch2026";
import { nicheSpecialty2026B1 } from "./tools/nicheSpecialty2026B1";
import { nicheSpecialty2026B2 } from "./tools/nicheSpecialty2026B2";
import { toolifyBatch2026 } from "./tools/toolifyBatch2026";
import { toolifyBatch2026B2 } from "./tools/toolifyBatch2026B2";
import { toolifyBatch2026B3 } from "./tools/toolifyBatch2026B3";
import { toolifyBatch2026B4 } from "./tools/toolifyBatch2026B4";
import { toolifyBatch2026B5 } from "./tools/toolifyBatch2026B5";
import { toolifyBatch2026B6 } from "./tools/toolifyBatch2026B6";
import { toolifyBatch2026B7 } from "./tools/toolifyBatch2026B7";
import { toolifyBatch2026B8 } from "./tools/toolifyBatch2026B8";
import { toolifyBatch2026B9 } from "./tools/toolifyBatch2026B9";
import { toolifyBatch2026B10 } from "./tools/toolifyBatch2026B10";
import { toolifyBatch2026B11 } from "./tools/toolifyBatch2026B11";
import { toolifyBatch2026B12 } from "./tools/toolifyBatch2026B12";
import { toolifyBatch2026B13 } from "./tools/toolifyBatch2026B13";
import { toolifyBatch2026B14 } from "./tools/toolifyBatch2026B14";
import { toolifyBatch2026B15 } from "./tools/toolifyBatch2026B15";
import { toolifyBatch2026B16 } from "./tools/toolifyBatch2026B16";
import { toolifyBatch2026B17 } from "./tools/toolifyBatch2026B17";
import { toolifyBatch2026B18 } from "./tools/toolifyBatch2026B18";
import { toolifyBatch2026B19 } from "./tools/toolifyBatch2026B19";
import { toolifyBatch2026B20 } from "./tools/toolifyBatch2026B20";
import { toolifyBatch2026B21 } from "./tools/toolifyBatch2026B21";
import { apocalypseSurvivalBatch2026 } from "./tools/apocalypseSurvivalBatch2026";
import { hotNewBatch2026March } from "./tools/hotNewBatch2026March";
import { topNewBatch2026May } from "./tools/topNewBatch2026May";
import { apocalypseSurvivalBatch2026B2 } from "./tools/apocalypseSurvivalBatch2026B2";
import { researchedToolsBatch2026 } from "./tools/researchedToolsBatch2026";
import { newVerifiedBatch2026 } from "./tools/newVerifiedBatch2026";
import { medicusGPT } from "./tools/medicusGPT";
import { hormuzCrisisGPT } from "./tools/hormuzCrisisGPT";
import { gameVR3DBatch2026 } from "./tools/gameVR3DBatch2026";
import { robotSafetyGPTs2026 } from "./tools/robotSafetyGPTs2026";
import { preparednessAndScholarsBatch2026 } from "./tools/preparednessAndScholarsBatch2026";
import { civicTransparencyBatch2026 } from "./tools/civicTransparencyBatch2026";
import { mustHaveToolsBatch2026 } from "./tools/mustHaveToolsBatch2026";
import { agentsAndCreatorsBatch2026 } from "./tools/agentsAndCreatorsBatch2026";
import { trendingPlatformsBatch2026 } from "./tools/trendingPlatformsBatch2026";
import { aiInfraBatch2026 } from "./tools/aiInfraBatch2026";
import { essentialToolsBatch2026 } from "./tools/essentialToolsBatch2026";
import { appBuildDiy2026 } from "./tools/appBuildDiy2026";
import { writingMarketingSEO2026 } from "./tools/writingMarketingSEO2026";
import { vr3DWorldsBatch2026 } from "./tools/vr3DWorldsBatch2026";
import { wearablesRobotsBatch2026 } from "./tools/wearablesRobotsBatch2026";
import { wearablesRobotsBatch2026Part2 } from "./tools/wearablesRobotsBatch2026Part2";
import { wearablesRobotsBatch2026Part3 } from "./tools/wearablesRobotsBatch2026Part3";
import { verifiedBatch2026Aug } from "./tools/verifiedBatch2026Aug";
import { trendingBatch2026 } from "./tools/trendingBatch2026";
import { agentOpsSecurityBatch2026 } from "./tools/agentOpsSecurityBatch2026";
import { aiNativeBatch2026 } from "./tools/aiNativeBatch2026";
import { devAiBatch2026Aug } from "./tools/devAiBatch2026Aug";
import { perplexityBotsBatch2026 } from "./tools/perplexityBotsBatch2026";

const allToolCategories = consolidateTools([
  ...getAllToolCategories(),
  ...newAffiliatePlatforms2025,
  ...newPersonalDevelopmentTools,
  ...web3DomainsTools,
  
  // Add the AI Web Tools GPT Collections
  ...priorityFeaturedGPTs,
  ...secondPriorityFeaturedGPTs,
  ...thirdPriorityFeaturedGPTs,
  ...fourthPriorityFeaturedGPTs,
  ...aiWebToolsGPTs,
  ...advancedSpecialtyGPTs,
  ...additionalSpecializedGPTs,
  ...finalSpecializedGPTs,
  ...newSpecializedGPTs,
  ...personalDevelopmentGPTs,
  ...educationAndLearningGPTs,
  ...educationalToolsGPTs,
  ...healthAndWellnessGPTs,
  ...researchAndPharmaceuticalGPTs,
  ...scienceAndResearchGPTs,
  ...businessAndFinanceGPTs,
  ...businessStrategyGPTs,
  ...legalAndGovernmentGPTs,
  ...governmentCivicGPTs,
  ...professionalServicesGPTs,
  ...utilityAndProductivityGPTs,
  ...creativeAndMediaGPTs,
  ...contentCreationToolsGPTs,
  ...multimediaAndContentGPTs,
  ...artAndCreativeGPTs,
  ...aiPromptingAndGenerationGPTs,
  ...communicationAndEntertainmentGPTs,
  ...entertainmentAndGamingGPTs,
  ...foodAndHospitalityGPTs,
  ...investigativeAndAnalysisGPTs,
  ...appraisalAndValuationGPTs,
  ...mysteriousAndUnusualGPTs,
  ...spiritualAndPhilosophyGPTs,
  ...timeAndHistoryGPTs,
  ...technologyInnovationGPTs,
  ...specializedNicheToolsGPTs,
  
  // PREVIOUSLY MISSING COLLECTIONS - NOW INCLUDED
  ...customGeminiGems,
  ...inspectorAndSafetyGPTs,
  ...philosophyAndLifestyleGPTs,
  ...videoPromptGPTs,
  
  // SFX Generator Tools
  ...sfxGeneratorTools,
  
  // Emerging & Healthcare AI Tools 2025
  ...emergingAITools2025,
  ...healthcareAITools2025,
  ...healthcareAITools2025Batch2,
  
  // Email Productivity Tools 2025
  ...emailProductivityTools2025,
  
  // 3D Modeling Tools 2025
  ...threeDModelingTools2025,
  
  // AI Agents 2025 (85+ new agent tools)
  ...aiAgents2025,
  ...aiAgents2025Batch2,
  
  // Lifestyle Tools 2025 (Life Assistants, Memory, Face Swap, Finance, Audio)
  ...lifestyleTools2025,
  
  // Multi-Category Tools 2025 (Legal, Real Estate, Games, Travel, Fashion, Healthcare, Data, Future Video, Prompts)
  ...multiCategoryTools2025,
  
  // Image, Translation & Storytelling Tools 2025
  ...imageTranslationStorytelling2025,
  
  // Marketing, Transcriber & Storytelling Tools 2025 (16 new verified tools)
  ...marketingTranscriberStorytelling2025,
  
  // Verified AI Tools Batch 2025 (20+ new verified tools)
  ...verifiedToolsBatch2025,
  
  // Missing Tools Batch 2025 (7 new verified tools)
  ...missingToolsBatch2025,
  
  // Audit Batch Q2 2025 (14 new verified tools: TTS, AI Detection, Logo, Email Marketing)
  ...auditBatch2025Q2Tools,
  
  // Audit Batch Q2 2025 Part 2 (20 new verified tools: E-commerce, AI Humanizer, Human Resources)
  ...auditBatch2025Q2Part2Tools,
  
  // Audit Batch Q2 2025 Part 3 (12 new verified tools: AI Chat, Video Gen, TTS, Education)
  ...auditBatch2025Q2Part3,
  
  // Audit Batch Q2 2025 Part 4 (8 new verified tools: Logo Creation, Website & Design)
  ...auditBatch2025Q2Part4Tools,
  
  // Audit Batch Q2 2025 Part 5 (8 new verified tools: Image Editing, Video Edition, Audio Editing)
  ...auditBatch2025Q2Part5Tools,
  
  // Audit Batch Q2 2025 Part 6 (16 new verified tools: Extensions ChatGPT, Social Networks, Summarizer, Productivity)
  ...auditBatch2025Q2Part6Tools,
  
  // Audit Batch Q2 2025 Part 7 (17 new verified tools: Presentation, Files & Spreadsheets, Music, Face Swap)
  ...auditBatch2025Q2Part7Tools,
  
  // Audit Batch Q2 2025 Part 8 (7 new verified tools: Finance, Text Generators, Research & Science, Text-to-Video)
  ...auditBatch2025Q2Part8Tools,
  
  // Audit Batch Q2 2025 Part 9 (13 new verified tools: Translation, Marketing, Transcriber, Storytelling Generator)
  ...auditBatch2025Q2Part9Tools,
  
  // Audit Batch Q2 2025 Part 10 (8 new verified tools: ChatBots, Voice Cloning, Avatars, Amazing)
  ...auditBatch2025Q2Part10Tools,
  
  // Audit Batch Q2 2025 Part 11 (12 new verified tools: No Code/Low Code, Assistant Code, Developer Tools, Legal Assistants)
  ...auditBatch2025Q2Part11Tools,
  
  // Audit Batch Q2 2025 Part 12 (4 new verified tools: Business, Prompts & Aids)
  ...auditBatch2025Q2Part12Tools,
  
  // Audit Batch Q2 2025 Part 13 (6 new verified tools: Real Estate/Architect, Art, Travel)
  ...auditBatch2025Q2Part13Tools,
  
  // Audit Batch Q2 2025 Part 14 (6 new verified tools: Fashion, Dating & Relationships, Healthcare, Automation)
  ...auditBatch2025Q2Part14Tools,
  
  // Audit Batch Q2 2025 Part 15 (15 new verified tools: LLM Models, Data & Analytics, Assistive Technology, Future Tools)
  ...auditBatch2025Q2Part15Tools,
  
  // Future Tools Batch Q2 2025 (45+ new verified Future Tools)
  ...futureToolsBatch2025Q2,
  
  // Trending Tools Batch 2025 (11 new trending tools from industry rankings)
  ...trendingToolsBatch2025,
  
  // Top AI Agent Platforms 2026 (Dify, Coze, Flowise, Letta, Agno)
  ...topAgentPlatforms2026,
  
  // Top AI Agent Platforms 2026 Batch 2 (Wordware, Composio, SmythOS, MindPal, AgentOps)
  ...topAgentPlatforms2026Batch2,

  // New AI Agents Batch 2026 D (25 verified agents)
  ...newAIAgentsBatch2026D,
  ...verifiedMissingBatch2026XV,
  ...verifiedMissingBatch2026XVI,
  
  // New AI Agents 2026 (15 verified: MultiOn, CodeRabbit, Phind, Induced, BrowserBase, LangGraph, Beam AI, Fixie, Sweep, Fine.dev, Adept, OpenHands, Dia Browser, Axiom, Ottogrid)
  ...newAIAgents2026,
  
  // Enterprise Agents 2026
  ...enterpriseAgents2026,
  
  // Advanced Agents Batch 2026 (25 tools: Agent Zero, Vercel AI SDK, OpenRouter, Langfuse, Haystack, Semantic Kernel, Agentverse, Otterly.AI, SignalHero, Tektonic AI, Echovane, causaLens, Vic.ai, SAS Viya, Hugo AI, StartClaw, Jan AI, Self-Operating Computer, ProxAI, Valyu, Brave Search API, Unstructured.io, Pi, CourseHero AI, Mentra)
  ...advancedAgentsBatch2026,
  
  // Frontier Agents Batch 2026
  ...frontierAgentsBatch2026,
  
  // Frontier Infrastructure Batches 2026 (67 tools)
  ...frontierInfraBatch2026,
  ...frontierInfraBatch2026B2,
  ...frontierInfraBatch2026B3,
  
  // Frontier Infrastructure Batches 2026 C1-C4 (57 tools: Orchestration, Evaluation, Hosting, Voice, Industry, Productivity)
  ...frontierInfraBatch2026C1,
  ...frontierInfraBatch2026C2,
  ...frontierInfraBatch2026C3,
  ...frontierInfraBatch2026C4,

  // June 2026 — 20 verified frontier AI tools (Sesame, Mercury, Sakana, Liquid AI, Cohere North, Reve, FLUX Kontext, Whisk, Wispr Flow, Superwhisper, Aragon, PhotoAI, Cerebras, Voyage, Jina, Qdrant, Braintrust, Helicone, Cline, Goose)
  ...newFrontierBatch2026Jun,

  // Top New Batch — June 4 2026 (20 verified real AI tools: Read AI, Veo 3, Sora 2, ChatGPT Atlas, ChatPRD, Luma Ray 2, ElevenReader, Particle News, Magic Loops, Letta, Eraser AI, Grok 3, DeepSeek R1, Stitch, Subframe, Magic Patterns, Perplexity Labs, Skywork AI, Tonic AI, ChatGPT Pulse)
  ...topNewBatch2026Jun20,

  // Top New Batch — June 2026 Part 2 (25 verified real AI tools: Wan 2.5, Submagic, Eleven v3, Suno v4, JetBrains Junie, AutoGPT, SWE-agent, Mistral Large, Pixtral, NVIDIA Nemotron, OLMo, Gemini 2.5 Pro, Claude 4, GPT-5, OpenAI o3, Recraft V3, Ideogram 2, FLUX Kontext, Stable Diffusion 3.5, Black Forest Labs, PromptLayer, Chroma, Convex, Nyota, Krea Realtime)
  ...topNewBatch2026Jun25,
  ...topAgentsBatch2026Jul,
  ...topAgentsBatch2026JulPart2,

  // Top Agents Batch — July 2026 Part 3 (25 verified-new agent tools, dedupe-checked)
  ...topAgentsBatch2026JulPart3,

  // Top Agents Batch — July 2026 Part 4 (25 verified-new agent tools, dedupe-checked)
  ...topAgentsBatch2026JulPart4,
  ...topAgentsBatch2026JulPart5,
  ...topAgentsBatch2026JulPart6,
  ...topAgentsBatch2026JulPart7,
  ...topAgentsBatch2026JulPart8,
  ...topAgentsBatch2026JulPart9,
  ...topAgentsBatch2026JulPart10,
  ...topAgentsBatch2026JulPart11,
  ...topAgentsBatch2026JulPart12,
  ...topAgentsBatch2026JulPart13,
  ...topAgentsBatch2026JulPart14,
  ...topAgentsBatch2026JulPart15,
  ...topAgentsBatch2026JulPart16,
  ...topAgentsBatch2026JulPart17,
  ...topAgentsBatch2026JulPart18,
  ...topAgentsBatch2026JulPart19,
  ...topAgentsBatch2026JulPart20,
  ...topAgentsBatch2026JulPart21,
  ...topAgentsBatch2026JulPart22,
  ...deepAgentToolsBatch2026,

  // Frontier Batch D1-D4 (70 tools: Healthcare, Finance, Security, Enterprise, Agencies)
  ...frontierBatchD1,
  ...frontierBatchD2,
  ...frontierBatchD3,
  ...frontierBatchD4,

  // Frontier Batch E1-E2 (40 new tools: Sales, Browser, Dev Frameworks, Industrial, Finance, Agencies)
  ...frontierBatchE1,
  ...frontierBatchE2,

  // Video Tools Batch 2026 (7 tools: Magic Hour, Flova, Envato VideoGen, Hedra Character-3, Mochi-1, Grok Imagine, LM Arena Video)
  ...videoToolsBatch2026,

  // Specialized Agents Batch 2026 (10 tools: IBM watsonx.ai, Conversica, Nexi, Hunters AI, MS Defender XDR, Claude Co-Work, Jinba Flow, I/ONX HPC, Micro-Therapist, AI Event Coordinator)
  ...specializedAgentsBatch2026,

  // Voice Agents Batch 2026 (16 tools: PolyAI, Five9, NICE CXone, Huawei AICC, Talkdesk, AgentVoice, Noca, CloudTalk, Insighto.ai, Smallest.ai, Qwen3-TTS, Regal.ai, Calldesk, Dialpad, RingCentral, Nextiva)
  ...voiceAgentsBatch2026,

  // Productivity Agents Batch 2026 (12 tools: Gladly, Freshworks Freddy, Front AI, Sprinklr, Jotform AI, Circleback, Shortwave, Motion, Infobip, Copilot Studio, Everything AI, Exa)
  ...productivityAgentsBatch2026,

  // Digital Humans Batch 2026 (11 tools: UneeQ, NVIDIA ACE, Leadde, InfiniteTalk, DaveAI, Crescendo.ai, Observe.AI, Yuma AI, Workbeaver, Marketecs Engine, Pod AI)
  ...digitalHumansBatch2026,

  // Enterprise Orchestration Batch 2026 (18 tools: FloTorch, Wizr AI, Shakudo, LuMay AI, GoSearch, Twin, Parabola, Text Blaze, Prophet Security, LoOper, Averi, StoryChief, Ardigen, AccuKnox, Open WebUI, ChromaDB, Qdrant, Whisper.cpp)
  ...enterpriseOrchBatch2026,

  // Phone Agents Batch 2026 (15 tools: Aloware, Nooks, SquadStack, Koncert, Orum, SalesAPE, NLPearl, Dialzara, Slang.ai, Rosie, Smith.ai, My AI Front Desk, Leaping AI, CallBotics, Allo)
  ...phoneAgentsBatch2026,

  // Robotics Batch 2026 (5 tools: Noetix Bumi, Mirokaï, Fourier GR-2, AGIBOT, Standard Bots RO1)
  ...roboticsBatch2026,

  // Niche Batch 2026 (6 tools: FeedHive, Relay.app, Obviously AI, LeadIQ, Rose AI, Perception AI)
  ...nicheBatch2026,

  // Niche Specialty 2026 B1 (16 tools: Lerty AI, Abridge, Mintlify, Outbond AI, Revio, Buddy Pro, Lavender, 6sense, Luma Genie, Vidio AI, Mokker, Humata, Eightify, Genei, Scribbr, Whisper Flow)
  ...nicheSpecialty2026B1,

  // Niche Specialty 2026 B2 (15 tools: Speechelo, Estimatic AI, ChefGPT, Komo, YourAtlas, Crayo, Storylane, Coveo, Guru, LanguageTool, Doclingo, Unbabel, Weglot, Localazy, Pairaphrase)
  ...nicheSpecialty2026B2,

  // Toolify Batch 2026 (23 tools: CrePal, Gobii, EverMemOS, Paperclip, NemoClaw, etc.)
  ...toolifyBatch2026,

  // Toolify Batch 2026 B2 (20 tools: Kovvid AI, C Dance AI, Doctor Handwriting Reader AI, HousesDecorate, etc.)
  ...toolifyBatch2026B2,

  // Toolify Batch 2026 B3 (25 tools: Artedge AI, Wallnora, Pine AI, Pixwit, Hitem3D, Vidu AI, etc.)
  ...toolifyBatch2026B3,

  // Toolify Batch 2026 B4 (25 tools: GLM 5, TemVideo, AITextTune, GenPPT AI, Crun AI, OutdoorBrite, etc.)
  ...toolifyBatch2026B4,

  // Toolify Batch 2026 B5 (24 tools: ContentPod, Anirole, Voiceley, Studioify, CiteTrue, Fizzly AI, GlowVideo, Surfn, playmix.ai, Editly, Neolemon, TarotAI, GoCrazyAI, Tubeletter, Ricebowl AI, SwingVision, Creaibo, SocialPost, RoomX AI, ColorPage Lab, Inspix AI, ReelMuse.ai, Manga Translator, CogVideo AI)
  ...toolifyBatch2026B5,

  // Toolify Batch 2026 B6 (25 tools: SyntrofAI, VidFlux, WhiteRank, VISBOOM, Diagrimo, RemakePic, BlogSEO, ChartGen.ai, Protaigé, GSong.ai, Contenov, Falva, Kodey AI, LearnFlux, TimeTuna, WayinVideo, Lensgo AI, SpikApp, Spectrahertz, FlowLens, VibeCodePrompts, ZestyGen, Hooktok, Noiz Agent, BigIdeasDB)
  ...toolifyBatch2026B6,

  // Toolify Batch 2026 B7 (25 tools: Managelify, Ripplica, Agenta, DebuggAI, To3D.AI, MuseVideo, Dreamlux, Whisper Thunder, Hocha AI, ReelMate AI, DeHome, Aivvid AI, InterviewFlowAI, ValidateIdea.io, Klariqo, Nodejam, EchoSnap, Haxiom, Motionik, TinyCommand, Didoo AI, Monetize.ai, DesignLumo, BrandJet AI, MediaPET)
  ...toolifyBatch2026B7,

  // Toolify Batch 2026 B8 (22 tools: Ezswap, SimpleClean, BananaPro AI, UniMusic AI, aicofounder, ShareSpeak, MethodsAgent, Loova, The Bean.AI, HumanText Pro, Imgezy, GenZWrite, PitchFit, Twee, DeepSwapFace, TruGen AI, Ponder, Freudly, Vidofy AI, Gavel Exec, Mixboard, Kirkify AI)
  ...toolifyBatch2026B8,

  // Toolify Batch 2026 B9 (22 tools: Bright Data, Limecube, Loamly, Jet Admin, Rankpilot, SongR, TurboScribe, PicLumen, WriteHuman, Trickle Magic Canvas, Floyo, Adsturbo, SlidesGPT, Vocol AI, Redesignr AI, Nume, LINER AI, SocialDude, Chaindesk, Samurai AI, StoryNest.ai, CometAPI)
  ...toolifyBatch2026B9,

  // Toolify Batch 2026 B10 (22 tools: FalcoCut, MyEdit, IdeaApe, OutlierKit, Korgi, Rezzy, Medeo, Feen AI, ZOER, ImgCreator.AI, ArtGuru, MotionExcel, DeepBrain AI, ChatUp AI, Polymer DSPM, Vectorizer.AI, X-Pilot, Dewy Chat, Hemleion, VidGuru, InVidiai, Pixcap)
  ...toolifyBatch2026B10,

  // Toolify Batch 2026 B11 (11 tools: Gencraft, Flot.ai, Caveduck, Somny, Arcads, VisionStory AI, Miragic SalesPilot, Easy-Peasy.AI, AI Interview Copilot, CodeDesign.ai, Textero.ai)
  ...toolifyBatch2026B11,

  // Toolify Batch 2026 B12 (11 tools: Code Arena, Moltbook, Duck.ai, Use AI, RentAHuman.ai, Chaport, Mureka, WizGenerator, Zara AI Recruiter, Studocu, Course Hero)
  ...toolifyBatch2026B12,

  // Toolify Batch 2026 B13 (12 tools: Clawdbot, Dokie AI, ParakeetAI, Postel, Browser Cash, Viyou AI, VideoCompress, Revvie AI, FLORA AI, Nana Banana AI, Mammouth, Videoinu)
  ...toolifyBatch2026B13,

  // Toolify Batch 2026 B14 (10 tools: WeShop, Pencil, Kula AI, Atoms, Typeframes, Crisp, Dubverse, Marblism, Yutori Scouts, Kimi Slides)
  ...toolifyBatch2026B14,

  // Toolify Batch 2026 B15 (24 tools: Sondo AI, Musicful, ElevenLabs Music, DistroKid, Higgsfield, Wanderboat AI, Stitch, Raccoon AI, Morph Studio, Memories.ai, Astra AI, PlantIn, Knowt, Weavy, Skywork.ai, Kiro, GPT Researcher, HiFun, Flash.co, Studydrive, Google Antigravity, Stackie.AI, Sitefire, Listen Labs)
  ...toolifyBatch2026B15,

  // Toolify Batch 2026 B16 (25 tools: Pollo AI, RevisionDojo, Typecast AI, Sider AI, Napkin AI, Gamma AI, PromeAI, ThumbnailCreator, EverMemOS, Trae, Bolt.new, Devin AI, Beautiful.ai, Tome, Pictory, Luma AI, Monica AI, Merlin AI, MaxAI, Harpa AI, i10X, Rubii, Miro AI, Notion AI, Cuty AI)
  ...toolifyBatch2026B16,

  // Toolify Batch 2026 B17 (25 tools: Seedance 2.0, Genspark, ZeroGPT, Manus, Base44, Emergent, Fathom 2.0, Cognito, Packback, Coddy, PixelBin.io, Otter AI, MathGPT, Veo Sports Camera, Tilda Publishing, Polsia, Semantic Scholar, Gizmo AI, Phrasly, MaxClaw, Prezi, Accio, Answer Overflow, Type AI, Video Transcriber AI)
  ...toolifyBatch2026B17,

  // Toolify Batch 2026 B18 (25 tools: OpenSwarm, Enia Code, Vercel Agent Browser, ZeroClaw, ScienceClaw, OpenBrowserClaw, ClawTank, Van Gogh AI, Together AI, LiveKit Agents, Retune, UBOS, Tabby, Julep AI, BrowserBird, Instructor, Marvin AI, ControlFlow, On-Device Browser Agent, AgentDesk, Agent Harness, Weights & Biases, Anyscale, Potpie AI, Faros AI)
  ...toolifyBatch2026B18,

  // Toolify Batch 2026 B19 (25 tools: Groq, Lindy AI, Windsurf, Cline, Aider, Glean, Stagehand, Browserbase, Supermaven, Amazon Q Developer, Qodo, Augment Code, JetBrains AI, v0 by Vercel, Pieces, Continue, AgentDiscuss, Banyan AI, AI Auto Browser, Cody AI, Tusk AI, Codestory, Opera Browser AI, Wordware, CodeRabbit)
  ...toolifyBatch2026B19,

  // Toolify Batch 2026 B20 (25 tools: Mastra, CrewAI, Mem0, Meshy, OpusClip, Recraft, MAI-Image-2, ComfyUI, RunComfy, fal.ai, Lovable, Tempo Labs, Greptile, Cosine Genie, Val Town, Marimo, Firecrawl, Trigger.dev, Inngest, Cal.com, Raycast, Arc Browser, Jan, tldraw, Perfectly)
  ...toolifyBatch2026B20,

  // Toolify Batch 2026 B21 (25 tools: Chronicle, Tango, tl;dv, LMNT, Loom AI, SimilarWeb, SpyFu, PhantomBuster, Mangools, Coda AI, Linear, Height AI, Fellow, Spinach AI, Jamie AI, Genially, Mentimeter, Amie, Todoist AI, Supernormal, Screenpipe, Labelbox, Snorkel AI, DagsHub, Hunchly)
  ...toolifyBatch2026B21,

  // Apocalypse Survival Batch 2026 (25 tools: Project NOMAD, Kiwix, OsmAnd, Organic Maps, Meshtastic, Briar, Zello, Bunkers App, Offline Survival Manual, Private LLM, Windy, KoBoToolbox, MAPS.ME, Bridgefy, Red Cross First Aid, what3words, Avenza Maps, iNaturalist, PlantNet, Star Walk, Outdooractive, KoboldCPP, LocalSend, Syncthing, Gaia GPS)
  ...apocalypseSurvivalBatch2026,

  // Apocalypse Survival Batch 2026 B2 (25 tools: HAVEN, PrepGPT, BunkerVault, Survival AI: The Ark, Trail Sense, AllTrails, FEMA App, APRSdroid, PinPoint APRS, Tails OS, F-Droid, llama.cpp, Prepper AI, Komoot, Locus Map, BackCountry Navigator, Knots 3D, CHIRP Radio, Cairn, Emergency Alerts, SAS Survival Guide, Garmin Explore, Open Camera, Morse Mania, PeakVisor)
  ...apocalypseSurvivalBatch2026B2,

  // Researched Tools Batch 2026 (10 tools: Rask AI, Typeface AI, Coframe, Collov AI, ScreenApp, Vizcom, RenderNet AI, Delphi AI, Stockimg AI, Exactly AI)
  ...researchedToolsBatch2026,

  // New Verified Batch 2026 (5 tools: Sim AI, AI Crucible, Twain AI, Twineo, CAMEL AI)
  ...newVerifiedBatch2026,

  // Medicus GPT (FREE Personal Medical GPT)
  ...medicusGPT,

  // Hormuz Crisis Impact Prediction Engine GPT
  ...hormuzCrisisGPT,

  // Hot New Batch March 2026 (25 tools)
  ...hotNewBatch2026March,

  // Top New Batch May 2026 (5 tools: Manus, Genspark, Higgsfield, Lindy, Cluely)
  ...topNewBatch2026May,

  // Game, VR & 3D Creation Batch 2026 (30 tools)
  ...gameVR3DBatch2026,

  // Robot Safety GPTs 2026 (4 tools: Passport Photo Maker, Disable That Robot, Rouge Robot Disabler, Robot Identifier and Disabler Survivalist)
  ...robotSafetyGPTs2026,

  // Preparedness & Scholars Batch 2026 (17 tools: Fallout Shelter, Solar Power, Garden Starter, Nuclear Event, Geiger Counter, Emergency Prep, Off Grid, Alt History, Ancient Wisdom, Newton, Kepler, Maxwell, Plot Twist, Zoroastrian Text Recovery, Cursive Writing, Rastafari)
  ...preparednessAndScholarsBatch2026,

  // Civic Transparency Batch 2026 (18 tools: Monopoly Reality Awakening, Govt Corruption Prediction, Table Flipper, Election Truth Scanner, Govt Spending Investigator, Freedom Impact Simulator, Narrative Manipulation Detector, Govt Contract Analyzer, Policy Transparency, Rights Defender, Local Govt Watchdog, Media Manipulation Scanner, Voting Truth, Whistleblower Shield, Influence Network Investigator, Policy Impact Simulator, Citizen Audit, Follow the Money)
  ...civicTransparencyBatch2026,

  // Must-Have Tools Batch 2026 (25 tools: Dataiku, E2B, Promptfoo, Msty, LibreChat, Nomic AI, PearAI, Bolt DIY, AnythingLLM, LocalAI, Llamafile, LiteLLM, vLLM, MLX, Google IDX, Gitpod, LobeChat, MLflow, Neptune AI, Langtrace, Pezzo AI, LastMile AI, Twilio AI, Sendbird AI Chatbot, Dagster)
  ...mustHaveToolsBatch2026,

  // Agents & Creators Batch 2026 (25 tools)
  ...agentsAndCreatorsBatch2026,

  // Trending Platforms Batch 2026 (10 tools)
  ...trendingPlatformsBatch2026,

  // AI Infrastructure Batch 2026 (10 tools)
  ...aiInfraBatch2026,

  // Essential Tools Batch 2026 (25 tools)
  ...essentialToolsBatch2026,

  // AppBuild.diy 2026
  ...appBuildDiy2026,

  // Writing, Marketing & SEO Batch 2026 (20 tools)
  ...writingMarketingSEO2026,

  // VR & 3D Worlds Batch 2026 (4 tools: OpenArt Worlds, Marble World Labs, Meta SAM 3D, Meta WorldGen)
  ...vr3DWorldsBatch2026,

  // Wearables & Robots Batch 2026 (3 tools: 1X NEO, Friend AI Pendant, Plaud NotePin)
  ...wearablesRobotsBatch2026,

  // Wearables & Robots Batch 2026 Part 2 (5 tools: Unitree G1, Figure 02, Limitless Pendant, Bee AI, Rabbit R1)
  ...wearablesRobotsBatch2026Part2,

  // Wearables & Robots Batch 2026 Part 3 (5 tools: Boston Dynamics Atlas Electric, Agility Digit, Apptronik Apollo, Sanctuary Phoenix, Tesla Optimus Gen 3)
  ...wearablesRobotsBatch2026Part3,

  // Verified Batch 2026 August (10 tools: OpenEvidence, Legora, Chai Discovery, Mistral Le Chat, Sana AI, Scribe, Amp Code, Void Editor, Ellipsis, Ultralytics YOLO)
  ...verifiedBatch2026Aug,

  // Trending Batch 2026 (20 tools: Kosmos, FutureHouse, Sonauto, MacWhisper, Aqua Voice, Willow Voice, Atlassian Rovo, Northflank, Chutes, Chonkie, Visual Electric, Playbook, Backflip AI, Adam CAD, Tembo, Traversal, Rootly AI, Enconvo, Polar, Scalar)
  ...trendingBatch2026,

  // Agent Ops & AI Security Batch 2026 (12 tools: Parahelp, Momentic, Antithesis, Zenity, Noma Security, Pillar Security, Aim Security, Dropzone AI, Intezer, Tines, Meticulous, Freestyle)
  ...agentOpsSecurityBatch2026,

  // AI-Native Batch 2026 (50 tools: agent orchestration, AI security, QA automation, AI user research)
  ...aiNativeBatch2026,

  // Dev & Agent Infrastructure Batch — August 2026 (12 tools: Sculptor, Bito AI, Baz, Entelligence AI, Nia, Devlo, Tusk, Kernel, Steel.dev, Cased, Cleric, Macroscope)
  ...devAiBatch2026Aug,

  // AIWebTools.ai Perplexity Bot Directory — 187 Perplexity Project editions of our custom GPTs
  ...perplexityBotsBatch2026
]);

// Apply deduplication to remove tools that appear in multiple categories
const deduplicatedTools = deduplicateTools(allToolCategories);

// Use deduplicatedTools directly (power ranking now handled in featured tools)
let combinedTools: Tool[] = [...deduplicatedTools];

// Apply specific fixes for known tools
combinedTools = combinedTools.map(tool => {
  if (tool.title === "Property Data Finder GPT") {
    return {
      ...tool,
      directUrl: "https://propertydatafindergpt.lovable.app/?via=aiwebtools",
      category: tool.category || "Real Estate & Property",
      description: tool.description || "Property Data Finder GPT by Ai Web Tools delivers unparalleled, precise, and current information about properties."
    };
  }
  if (tool.title === "Manicheism GPT") {
    return { ...tool, imageUrl: "/images/manicheism-gpt-hero.png", isFree: true };
  }
  if (tool.title === "COLLEGE DEGREE GPT") {
    return {
      ...tool,
      directUrl: "https://college-degree-gpt.lovable.app/?via=aiwebtools",
      videoUrl: "https://www.youtube.com/watch?v=Cd8uvD-smlM",
      imageUrl: "https://i.ytimg.com/vi/Cd8uvD-smlM/hqdefault.jpg",
      description: "College Degree GPT teaches every college class for any degree you choose, mirroring the structure of your selected institution or university. It provides a complete, in-depth educational experience while clearly stating that it does not issue an accredited degree.",
      category: "Education & Learning",
      isFree: true,
    };
  }
  if (tool.title === "Seedance 1.5 Pro" || tool.title === "Seedance 2.0") {
    return {
      ...tool,
      directUrl: "https://seed.bytedance.com/en/?via=aiwebtools",
    };
  }
  if (tool.title === "C Dance AI") {
    return {
      ...tool,
      directUrl: "https://seevio.ai/?via=aiwebtools",
    };
  }
  return tool;
});

// Remove duplicate Financial Calculator Pro entries
const filteredTools = combinedTools.filter(tool => {
  if (tool.title === 'Financial Calculator Pro') {
    return tool.category === 'Business & Productivity' && 
           tool.directUrl === 'https://chatgpt.com/g/g-683cfb6951308191abb310d5d2fa8238-financial-calculator-pro';
  }
  return true;
});

// Mark all AI Web Tools GPTs as free and apply spiritual/simulation tags
// Re-run the exact-duplicate pass AFTER the URL corrections above, so entries
// that only became identical once their destination was fixed collapse too.
const finalUniqueTools = deduplicateTools(filteredTools);

const toolsWithFreeFlags = markFreeTools(finalUniqueTools);
const toolsWithSpiritualTags = applyResurrectionAndHistoryTags(applySpirtualTags(toolsWithFreeFlags));
// Auto-tag every tool with its full title so exact-name searches always hit
const toolsWithTags = ensureTitleTags(toolsWithSpiritualTags);
// Tag every tool with its pricing model (Free / Freemium / Paid) so all
// search bars can surface them and cards can badge them consistently.
const toolsWithPricing = ensurePricingTags(toolsWithTags);
// Normalise legacy ALL-CAPS category labels so the same category never shows
// up twice with different casing on cards, chips and filters.
const toolsWithCanonicalCategories = normalizeToolCategories(toolsWithPricing);

export const allTools: Tool[] = toolsWithCanonicalCategories;


// Use filtered tools for all exports
export const featuredTools: Tool[] = createFeaturedTools(finalUniqueTools);

// Export utility functions for use in components
export { searchTools, getCategoriesWithCounts, getToolsByCategory };
