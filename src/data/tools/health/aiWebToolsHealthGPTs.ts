
import { Tool } from "@/types/tools";
import { 
  Heart, 
  Activity, 
  Brain, 
  Stethoscope, 
  Pill,
  User,
  Sparkles,
  Shield,
  Beaker
} from "lucide-react";
import mindBodyGptHero from "@/assets/tools/mind-body-gpt-hero.jpg";
import skinCareGptHero from "@/assets/tools/skin-care-gpt-hero.jpg";
import meditationGuidanceGptHero from "@/assets/tools/meditation-guidance-gpt-hero.jpg";
import petroProductScreenerGptHero from "@/assets/tools/petro-product-screener-gpt-hero.jpg";
import patientsAdvocateGptHero from "@/assets/tools/patients-advocate-gpt-hero.jpg";

export const aiWebToolsHealthGPTs: Tool[] = [
  {
    icon: Brain,
    title: "MIND & BODY GPT",
    description: "MIND & BODY GPT (Neurophysical Titan) is an advanced AI specialist that integrates mental and physical wellness approaches. This comprehensive health assistant provides personalized guidance for optimizing both cognitive function and physical performance, offering evidence-based strategies for mind-body connection, stress management, fitness optimization, and holistic wellness. Perfect for those seeking to achieve peak mental and physical performance through integrated neurophysical approaches.",
    emoji: "🧠",
    color: "from-blue-500 to-green-600",
    directUrl: "https://chatgpt.com/g/g-68ae286601288191825384507ac74512-neurophysical-titan/",
    imageUrl: mindBodyGptHero,
    tags: ["mind body connection", "neurophysical health", "mental performance", "physical wellness", "holistic health", "cognitive optimization", "fitness", "stress management", "aiwebtools", "Mental Health", "Wellness", "Fitness"],
    category: "Health, Wellness & Personal Lifestyle",
    rating: 4.8,
    totalVotes: 4156
  },
  {
    icon: Sparkles,
    title: "Mental Wellness GPT",
    description: "Mental Wellness GPT is a virtual chat tool for emotional support and mental well-being, offering empathetic guidance rooted in cognitive behavioral therapy (CBT) principles. Designed to help navigate stress, anxiety, and life's challenges, I provide practical tools, coping strategies, and a safe, judgment-free space for personal growth. While not a licensed therapist, I aim to complement your journey toward resilience and self-care with meaningful insights and support. Disclaimer: These AI-driven tools are designed for creative and emotional support purposes only and should not be considered as replacements for professional mental health care, therapy, or diagnosis.",
    emoji: "😊",
    color: "from-pink-500 to-purple-600",
    directUrl: "https://mentalwellnessgpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/_e6DtLUv-2Q",
    imageUrl: "https://media.discordapp.net/attachments/1150636600846450729/1377362789097803786/image.png?ex=6838b08f&is=68375f0f&hm=f63e1ae446523dd9eff4aa0f95166aa8a5e6119c506b44ab1656322ea4ca47b7&=&format=webp&quality=lossless&width=2646&height=1392",
    tags: ["mental wellness", "emotional support", "CBT principles", "stress management", "personal growth", "aiwebtools", "Mental Health", "Therapy", "Stress Management"],
    category: "Health, Wellness & Personal Lifestyle",
    rating: 4.9,
    totalVotes: 6234
  },
  {
    icon: Stethoscope,
    title: "Personalized DR. GPT (Doctor GPT)",
    description: "Disclaimer: Dr. GPT is not a direct replacement for genuine medical advice. It was developed for individuals who may not have access to a medical doctor. It is crucial to recognize that this is a simulation, not an actual medical professional, and it should not be utilized as one. This AI tool is private, confidential, and personalized, intended solely for informational purposes and should not replace professional medical advice, diagnosis, or treatment.",
    emoji: "👨‍⚕️",
    color: "from-blue-500 to-green-600",
    directUrl: "https://chatgpt.com/g/g-69c4da4473b0819185462889b7348a28-medicus-wellcheck-gpt",
    videoUrl: "https://youtu.be/jwjNOKP5mf4",
    tags: ["medical consultation", "health advice", "doctor simulation", "healthcare", "medical ai", "aiwebtools", "Medical", "Healthcare"],
    category: "Health, Wellness & Personal Lifestyle",
    rating: 4.7,
    totalVotes: 5432
  },
  {
    icon: User,
    title: "🐾Veterinarian GPT",
    description: "Veterinarian GPT is a compassionate virtual veterinarian simulation offering expert advice on pet health and well-being. It utilizes advanced Ai features to analyze your pet's health and provide tailored care recommendations. This multimodal AI tool allows you to upload data or images of your pets for detailed assessments and receive practical solutions to ensure their optimal health. 🐾 Disclaimer: Veterinarian GPT is for informational purposes only and is not a substitute for professional veterinary advice, diagnosis, or treatment.",
    emoji: "🐾",
    color: "from-green-500 to-blue-600",
    directUrl: "https://petcaregpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://youtu.be/jwjNOKP5mf4",
    imageUrl: "https://cdn.discordapp.com/attachments/1150636600846450729/1377298535833407488/vet.webp",
    tags: ["veterinary care", "pet health", "animal medicine", "pet consultation", "veterinary advice", "aiwebtools", "Pet Health", "Healthcare"],
    category: "Health, Wellness & Personal Lifestyle",
    rating: 4.6,
    totalVotes: 4321
  },
  {
    icon: Pill,
    title: "Pharmaceutical Assistant GPT",
    description: "I'm an expert AI Pharmaceutical Assistant that supports pharmacy professionals and patients alike by streamlining medication management, offering detailed drug information, checking for interactions, and helping with scheduling, all to ensure safe and efficient healthcare practices.",
    emoji: "💊",
    color: "from-purple-500 to-pink-600",
    directUrl: "https://rxai.lovable.app/?via=aiwebtools",
    imageUrl: "https://img1.wsimg.com/isteam/ip/9fd6d942-5b46-4025-92e2-0f1ec2a7adf2/a-professional-looking-pharmaceutical-assistan.png/:/cr=t:5.43%25,l:0%25,w:100%25,h:89.13%25/rs=w:1200,h:600,cg:true",
    tags: ["pharmaceutical", "medication management", "drug information", "pharmacy", "healthcare", "aiwebtools", "Medical", "Healthcare"],
    category: "Health, Wellness & Personal Lifestyle",
    rating: 4.5,
    totalVotes: 3876
  },
  {
    icon: Activity,
    title: "PHARMA RESEARCH PRO",
    description: "Pharma Research Pro, an AI-powered assistant designed to streamline pharmaceutical research and clinical trials by providing advanced data analysis, literature reviews, and predictive insights. My capabilities ensure efficient and accurate drug development while maintaining regulatory and ethical compliance. From optimizing trial design to monitoring safety, I empower researchers and clinicians to make informed decisions and accelerate the path to safe, effective medications.",
    emoji: "🔬",
    color: "from-orange-500 to-red-600",
    directUrl: "https://rxai.lovable.app/?via=aiwebtools",
    imageUrl: "https://img1.wsimg.com/isteam/ip/9fd6d942-5b46-4025-92e2-0f1ec2a7adf2/a-photo-of-a-professional-pharmaceutical-assis.png/:/cr=t:5.43%25,l:0%25,w:100%25,h:89.13%25/rs=w:1200,h:600,cg:true",
    tags: ["pharmaceutical research", "clinical trials", "drug development", "regulatory compliance", "medical research", "aiwebtools", "Medical", "Healthcare"],
    category: "Health, Wellness & Personal Lifestyle",
    rating: 4.8,
    totalVotes: 4567
  },
  {
    icon: Activity,
    title: "Genome GPT",
    description: "Genome GPT is a cutting-edge AI tool designed to assist researchers, scientists, and enthusiasts in genetic analysis and discovery. Specializing in genomic data interpretation, Genome GPT provides comprehensive and detailed insights into genetic sequences, patterns, and variations. Whether you're analyzing human DNA, exploring plant genetics, or researching cannabis strains, Genome GPT offers thorough scientific analysis in a user-friendly, professional manner.",
    emoji: "🧬",
    color: "from-green-500 to-blue-600",
    directUrl: "https://genomegpt.lovable.app/?via=aiwebtools",
    imageUrl: "https://img1.wsimg.com/isteam/ip/9fd6d942-5b46-4025-92e2-0f1ec2a7adf2/a-conceptual-image-of-a-dna-double-helix-with-.png/:/cr=t:5.43%25,l:0%25,w:100%25,h:89.13%25/rs=w:1200,h:600,cg:true",
    tags: ["genetic analysis", "DNA research", "genomic data", "scientific analysis", "genetic variations", "aiwebtools", "Medical", "Healthcare"],
    category: "Health, Wellness & Personal Lifestyle",
    rating: 4.6,
    totalVotes: 3789
  },
  {
    icon: Heart,
    title: "Marriage Mender GPT",
    description: "Marriage Mender is a virtual mediation service designed for educational and informational purposes, facilitating communication and understanding between couples facing relationship challenges. It is an experimental simulation that provides guidance and support but is not a replacement for professional counseling or human marriage therapy. Users acknowledge that Marriage Mender is not a licensed therapist and disclaims any liability for actions taken based on the information provided.",
    emoji: "💕",
    color: "from-pink-500 to-red-600",
    directUrl: "https://marriagemendergpt.lovable.app/?via=aiwebtools",
    videoUrl: "https://www.youtube.com/watch?v=3HCv5_QldrU",
    tags: ["relationship counseling", "marriage advice", "couples therapy", "communication", "relationship support", "aiwebtools", "Therapy", "Mental Health"],
    category: "Health, Wellness & Personal Lifestyle",
    rating: 4.6,
    totalVotes: 4321
  },
  {
    icon: Sparkles,
    title: "SKIN CARE GPT",
    description: "SKINCARE GPT by AI Web Tools is your comprehensive AI-powered dermatology and skincare consultant, providing personalized skincare guidance, product recommendations, and professional beauty advice tailored to your unique skin type and concerns. Whether you're dealing with acne, aging, sensitivity, or seeking to optimize your skincare routine, this advanced AI analyzes your skin condition, lifestyle factors, and preferences to deliver customized skincare solutions that deliver real results. Upload photos of your skin for detailed analysis, receive personalized product recommendations from trusted brands, and get step-by-step skincare routines designed specifically for your needs. The AI considers factors like skin type, age, climate, budget, and specific concerns to create comprehensive skincare protocols that address everything from daily maintenance to targeted treatments. Features include ingredient compatibility checking, product comparison analysis, seasonal routine adjustments, and professional skincare technique guidance. Perfect for skincare enthusiasts seeking expert guidance, individuals with specific skin concerns needing targeted solutions, and anyone wanting to achieve healthy, radiant skin through science-backed recommendations. SKINCARE GPT ensures your skin gets the personalized care it deserves.",
    emoji: "✨",
    color: "from-pink-500 to-purple-600",
    directUrl: "https://skincaregpt.lovable.app/?via=aiwebtools",
    imageUrl: skinCareGptHero,
    tags: ["skincare", "dermatology", "beauty advice", "skin analysis", "cosmetics", "health", "wellness", "aiwebtools", "Wellness", "Healthcare"],
    category: "Health, Wellness & Personal Lifestyle",
    rating: 4.6,
    totalVotes: 4567
  },
  {
    icon: Brain,
    title: "Mediation Guidance GPT",
    description: "Mediation Guidance GPT is your personal AI meditation and mindfulness coach, designed to guide you through personalized meditation practices, breathing exercises, and mindfulness techniques. Whether you're a beginner seeking to start your meditation journey or an experienced practitioner looking to deepen your practice, this AI provides tailored guidance, meditation scripts, and mindfulness exercises to help you achieve inner peace, reduce stress, and enhance mental clarity. Features include guided meditation sessions, breathing technique instructions, mindfulness exercises for daily life, stress reduction strategies, and personalized meditation recommendations based on your goals and experience level.",
    emoji: "🧘",
    color: "from-indigo-500 to-purple-600",
    directUrl: "https://chatgpt.com/g/g-688ea843f0ac81918fb4b8d60d7dc4ef-meditation-guidance-gpt",
    imageUrl: meditationGuidanceGptHero,
    tags: ["meditation", "mindfulness", "stress relief", "mental wellness", "breathing exercises", "inner peace", "aiwebtools", "Meditation", "Mental Health", "Stress Management"],
    category: "Health, Wellness & Personal Lifestyle",
    rating: 4.7,
    totalVotes: 2890
  },
  {
    icon: Shield,
    title: "Petro Product Screener GPT",
    description: "Petro Product Screener GPT is an advanced AI safety analyzer that allows users to upload product images and receive comprehensive analysis of petrochemical sources, health hazards, and safety assessments. While it specializes in petroleum-based products, this versatile tool can analyze various consumer products to identify chemical compositions, potential health risks, and provide safety grades. It serves as your personal product safety consultant, helping you make informed decisions about product usage and exposure to potentially harmful chemicals. Perfect for health-conscious consumers, parents, and anyone concerned about product safety.",
    emoji: "🛡️",
    color: "from-orange-500 to-red-600",
    directUrl: "https://chatgpt.com/g/g-68d28a4d6ad481918869ea60627624de-petro-product-screener-gpt",
    imageUrl: petroProductScreenerGptHero,
    tags: ["product safety", "chemical analysis", "health hazards", "petrochemicals", "safety screening", "product analyzer", "aiwebtools", "Healthcare", "Wellness"],
    category: "Health, Wellness & Personal Lifestyle",
    rating: 4.6,
    totalVotes: 1234
  },
  {
    icon: User,
    title: "Patients Advocate GPT",
    description: "Patients Advocate GPT by AiWebTools.Ai is an empathetic guide designed to support patients through medical visits and help them understand their rights. This compassionate AI assistant provides guidance on navigating healthcare systems, preparing for medical appointments, understanding patient rights, advocating for proper care, and ensuring patients receive the attention and treatment they deserve. It offers emotional support, practical advice for communicating with healthcare providers, and helps patients feel empowered in their healthcare journey. Whether you're preparing for a doctor's visit, dealing with insurance issues, or need help understanding medical procedures, this advocate stands by your side.",
    emoji: "🤝",
    color: "from-blue-500 to-green-600",
    directUrl: "https://chatgpt.com/g/g-68cf22ea994481919206bf9eb0abccbc-patients-advocate-gpt",
    imageUrl: patientsAdvocateGptHero,
    tags: ["patient advocacy", "healthcare rights", "medical visits", "patient support", "healthcare navigation", "empowerment", "aiwebtools", "Healthcare", "Medical"],
    category: "Health, Wellness & Personal Lifestyle",
    rating: 4.8,
    totalVotes: 2156
  }
];
