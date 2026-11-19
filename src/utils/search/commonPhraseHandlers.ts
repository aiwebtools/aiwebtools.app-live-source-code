// 50 COMMON SEARCH PHRASE HANDLERS
// Maps user intent phrases to the best matching tools

export interface PhraseHandler {
  triggers: string[];
  keywords: string[];
  priorityTools: string[];
  relatedCategories: string[];
}

// 50 commonly searched phrases mapped to tools
export const COMMON_PHRASE_HANDLERS: Record<string, PhraseHandler> = {
  // ===== TIME MACHINE / TIME TRAVEL (HIGHEST PRIORITY) =====
  timeMachine: {
    triggers: [
      'time', 'time m', 'time ma', 'time mac', 'time mach', 'time machi',
      'time machin', 'time machine', 'time machine gpt',
      'time travel', 'time traveler', 'travel in time', 'time portal',
      'back to the future', 'back in time', 'time jump', 'go back in time',
      'historical time', 'time exploration',
    ],
    keywords: [
      'time', 'time machine', 'time travel', 'history', 'historical',
      'past', 'era', 'epoch', 'timeline', 'chronology',
    ],
    priorityTools: [
      'TIME MACHINE GPT',
      'Native American History Time Machine GPT - (Special Edition)',
      'TALK TO HISTORY GPT',
      'Historical Headlines GPT',
      'Titanic Resurrections GPT',
      'Imagination Traveler GPT',
      'Indiana Archeologist GPT',
    ],
    relatedCategories: ['Historical & Time-Based AI Tools', 'Education & Research Tools'],
  },

  // ===== MOBILE APP DEVELOPMENT (HIGH PRIORITY) =====
  buildMobileApp: {
    triggers: [
      'mobile', 'mobile app', 'mobile apps', 'mobile application',
      'mobile app builder', 'mobile app development', 'mobile app dev',
      'build a mobile app', 'build mobile app', 'create mobile app',
      'make a mobile app', 'make mobile app',
      'ios app', 'android app', 'iphone app', 'ipad app',
      'app builder', 'no-code app', 'no code app', 'no-code app builder',
      'rork', 'rork app', 'rork mobile', 'rork mobile app',
      'app development', 'mobile development',
      'flutterflow', 'thunkable', 'expo app', 'react native app',
    ],
    keywords: [
      'mobile', 'app', 'ios', 'android', 'rork', 'no-code',
      'app builder', 'mobile app', 'expo', 'react native',
      'flutterflow', 'thunkable', 'lovable', 'bolt.new',
    ],
    priorityTools: [
      'RORK Mobile App Coding Agent',
      'Lovable',
      'Bolt.new',
      'Expo',
      'React Native',
      'FlutterFlow',
      'Thunkable',
      'Adalo',
      'Glide',
      'Bubble',
      'Softr',
    ],
    relatedCategories: ['Developer Tools', 'AI Agents', 'No-Code/Low-Code'],
  },

  // ===== AI CHAT / LLM (HIGH PRIORITY) =====
  aiChat: {
    triggers: [
      'chat', 'chatgpt', 'chat gpt', 'gpt', 'gpt-4', 'gpt 4', 'gpt5', 'gpt-5',
      'ai chat', 'ai assistant', 'chatbot', 'claude', 'gemini', 'grok',
      'perplexity', 'mistral', 'llama', 'deepseek', 'copilot',
      'large language model', 'llm', 'conversational ai',
    ],
    keywords: [
      'chat', 'gpt', 'claude', 'gemini', 'grok', 'llm', 'assistant',
      'conversation', 'language model', 'ai chatbot',
    ],
    priorityTools: [
      'ChatGPT', 'Claude', 'Gemini', 'Grok', 'Perplexity AI',
      'Microsoft Copilot', 'DeepSeek', 'Mistral AI', 'Meta AI',
    ],
    relatedCategories: ['AI Chat & Conversation', 'AI Development & Platforms'],
  },

  // ===== IMAGE GENERATION (HIGH PRIORITY) =====
  imageGen: {
    triggers: [
      'image', 'image generator', 'generate image', 'ai image',
      'midjourney', 'dall-e', 'dalle', 'dall e', 'stable diffusion',
      'flux', 'leonardo', 'ideogram', 'firefly', 'image creator',
      'text to image', 'art generator', 'ai art',
    ],
    keywords: [
      'image', 'art', 'picture', 'generate', 'midjourney', 'dalle',
      'stable diffusion', 'visual', 'illustration',
    ],
    priorityTools: [
      'Midjourney', 'DALL-E 3', 'Stable Diffusion', 'Leonardo AI',
      'Ideogram', 'Flux', 'Adobe Firefly',
    ],
    relatedCategories: ['Image & Design', 'AI Art & Creative'],
  },

  // ===== VIDEO GENERATION =====
  videoGen: {
    triggers: [
      'video', 'video generator', 'ai video', 'text to video',
      'sora', 'runway', 'pika', 'kling', 'luma', 'veo', 'heygen',
      'synthesia', 'invideo', 'movie maker',
    ],
    keywords: [
      'video', 'generate', 'sora', 'runway', 'pika', 'luma',
      'animation', 'film', 'movie',
    ],
    priorityTools: [
      'Sora (OpenAI)', 'Runway Gen-3', 'Pika', 'Luma Dream Machine',
      'Kling AI', 'HeyGen', 'Synthesia', 'Movie Maker Studio AI SUITE',
      'Music Video Maker AI Studio',
    ],
    relatedCategories: ['Video & Multimedia'],
  },

  // ===== MUSIC =====
  musicGen: {
    triggers: [
      'music', 'music generator', 'ai music', 'song', 'suno', 'udio',
      'compose', 'beat maker', 'lyrics', 'songwriting', 'soundtrack',
    ],
    keywords: ['music', 'song', 'audio', 'compose', 'suno', 'udio', 'lyrics'],
    priorityTools: [
      'Suno', 'Udio', 'Soundraw', 'AIVA', 'Mubert',
      'Music Melodies & Lessons GPT', 'Music Video Maker AI Studio',
    ],
    relatedCategories: ['Audio & Music'],
  },

  // ===== HEALTH / DOCTOR =====
  doctorHealth: {
    triggers: [
      'doctor', 'doctor gpt', 'dr gpt', 'medical', 'health', 'symptoms',
      'diagnosis', 'medicine', 'pharmacy', 'pharmacist', 'medication',
      'prescription', 'medical advice', 'health info',
    ],
    keywords: [
      'doctor', 'medical', 'health', 'symptom', 'medicine', 'pharma',
      'prescription', 'diagnosis',
    ],
    priorityTools: [
      'Personalized DR. GPT (Doctor GPT)', 'Medicus - The FREE Personal Medical GPT',
      'Pharmaceutical Assistant GPT', 'PHARMA RESEARCH PRO',
      'Mental Wellness GPT', 'Genome GPT',
    ],
    relatedCategories: ['Health & Medical', 'Medical AI Tools'],
  },

  // ===== SURVIVAL / PREPPING =====
  survival: {
    triggers: [
      'survival', 'survivalist', 'prepper', 'prepping', 'wilderness',
      'bushcraft', 'survive', 'emergency prep', 'doomsday',
    ],
    keywords: ['survival', 'wilderness', 'emergency', 'prepper', 'bushcraft'],
    priorityTools: ['Survivalist GPT', 'Firefighter GPT', 'Firearms Safety Instructor GPT'],
    relatedCategories: ['Survival & Safety', 'Education & Learning'],
  },

  // ===== FINANCE / TRADING =====
  trading: {
    triggers: [
      'trading', 'trader', 'stocks', 'stock market', 'crypto',
      'cryptocurrency', 'forex', 'investment', 'invest', 'trade',
      'day trading', 'tradingview',
    ],
    keywords: ['trade', 'stock', 'crypto', 'invest', 'forex', 'market'],
    priorityTools: ['Trader GPT', 'TradingView', 'Composer'],
    relatedCategories: ['Finance & Trading'],
  },

  // ===== LEGAL =====
  legalToolsBoost: {
    triggers: [
      'legal', 'lawyer', 'attorney', 'contract', 'contract review',
      'law', 'public defender', 'legal advice', 'legal help',
      'legislation', 'testimony',
    ],
    keywords: ['legal', 'law', 'contract', 'attorney', 'lawyer', 'court'],
    priorityTools: [
      'Public Defender GPT', 'Contract Review Bot',
      'Legislation Writer GPT', 'Public Testimony Writer GPT',
      'Legal Draftsmith GPT',
    ],
    relatedCategories: ['Legal & Compliance'],
  },

  // ===== TRAVEL =====
  travel: {
    triggers: [
      'travel', 'vacation', 'trip', 'travel planner', 'itinerary',
      'flight', 'hotel', 'booking', 'travel agent',
    ],
    keywords: ['travel', 'vacation', 'trip', 'itinerary', 'flight', 'hotel'],
    priorityTools: ['Travel Advisor GPT', 'MULTITASKER GPT'],
    relatedCategories: ['Travel & Lifestyle'],
  },

  // ===== AUTOMOTIVE =====
  automotive: {
    triggers: [
      'car', 'auto', 'automobile', 'vehicle', 'car repair', 'mechanic',
      'car buying', 'car maintenance', 'truck',
    ],
    keywords: ['car', 'auto', 'vehicle', 'mechanic', 'repair'],
    priorityTools: ['AUTOMOBILE GPT'],
    relatedCategories: ['Automotive', 'Lifestyle'],
  },

  // ===== REAL ESTATE / PROPERTY =====
  realEstate: {
    triggers: [
      'real estate', 'property', 'house', 'home value', 'property data',
      'realtor', 'mortgage', 'property finder', 'home buying',
    ],
    keywords: ['property', 'real estate', 'house', 'home', 'realtor', 'mortgage'],
    priorityTools: [
      'Property Data Finder GPT', 'Predictive Credit Score Checker GPT',
      'Home Renovator GPT 🏡🔧', 'Solar Land Assessor GPT',
    ],
    relatedCategories: ['Real Estate', 'Finance & Trading'],
  },

  // ===== SPIRITUAL / PHILOSOPHY =====
  spiritual: {
    triggers: [
      'spiritual', 'spirituality', 'god', 'gods', 'divine', 'meditation',
      'tarot', 'fortune', 'oracle', 'astrology', 'philosophy', 'wisdom',
      'soul', 'consciousness', 'enlightenment',
    ],
    keywords: ['spiritual', 'god', 'divine', 'soul', 'meditation', 'wisdom'],
    priorityTools: [
      'TALK TO THE GODS GPT', 'ALAN WATTS GPT', 'Oraculum – The Revealer of Hidden "Truths"',
      'Sophia Aeterna AI', '🕊️Mary Magdalene GPT', 'Resurrection GPT',
      'Fortune Teller GPT', 'Dream Interpreter GPT',
    ],
    relatedCategories: ['Spirituality & Philosophy'],
  },

  // ===== FOOD / COOKING =====
  cooking: {
    triggers: [
      'recipe', 'cook', 'cooking', 'chef', 'meal', 'dinner', 'food',
      'restaurant menu', 'mixology', 'cocktail', 'bartender',
    ],
    keywords: ['recipe', 'cook', 'chef', 'meal', 'food', 'menu'],
    priorityTools: [
      'Chef "Sizzle" AI Culinary Assistant', 'Mixologist GPT',
      'Restaurant Menu Maker GPT', 'Food Quality Inspector GPT',
    ],
    relatedCategories: ['Food & Cooking', 'Lifestyle'],
  },

  // ===== PRESENTATION / PPT =====
  presentation: {
    triggers: [
      'presentation', 'powerpoint', 'ppt', 'pptx', 'slides', 'slide deck',
      'pitch deck', 'gamma', 'tome',
    ],
    keywords: ['presentation', 'powerpoint', 'slides', 'deck'],
    priorityTools: [
      'PPTx Powerpoint Maker GPT', 'Gamma', 'Tome', 'Beautiful.ai',
    ],
    relatedCategories: ['Productivity', 'Business Tools'],
  },

  // ===== WRITING & CONTENT =====
  writeBook: {
    triggers: ['write a book', 'write book', 'book writing', 'write my book', 'author a book', 'create a book', 'novel writing', 'write novel'],
    keywords: ['book', 'writer', 'author', 'novel', 'manuscript', 'chapter', 'publish', 'story'],
    priorityTools: ['BOOK WRITER GPT', 'Movie Script Writer GPT', 'Children\'s Picture Book Maker GPT'],
    relatedCategories: ['Writing & Text Generation', 'Content Creation']
  },
  
  writeScript: {
    triggers: ['write a script', 'write script', 'screenplay', 'movie script', 'film script', 'write screenplay'],
    keywords: ['script', 'screenplay', 'movie', 'film', 'scene', 'dialogue', 'director'],
    priorityTools: ['Movie Script Writer GPT', '🎭 Playwriter GPT', 'Movie Maker Studio AI SUITE'],
    relatedCategories: ['Writing & Text Generation', 'Video & Multimedia']
  },
  
  writeBlog: {
    triggers: ['write a blog', 'write blog', 'blog post', 'blog article', 'blogging', 'create blog'],
    keywords: ['blog', 'article', 'post', 'content', 'seo', 'writer'],
    priorityTools: ['Article and Blog Rewriter GPT', 'BOOK WRITER GPT'],
    relatedCategories: ['Writing & Text Generation', 'Content Creation', 'Marketing Tools']
  },
  
  writeResume: {
    triggers: ['write a resume', 'write resume', 'create resume', 'resume help', 'cv writing', 'job application'],
    keywords: ['resume', 'cv', 'job', 'career', 'employment', 'application', 'interview'],
    priorityTools: ['The Resume & Job Finder Ai Suite', 'Resume Enhancer GPT', 'Resume Specialist GPT'],
    relatedCategories: ['Business & Productivity', 'Career Tools']
  },
  
  // ===== VIDEO & MULTIMEDIA =====
  videoGenerator: {
    triggers: ['video generator', 'video generators', 'text to video', 'text-to-video', 'ai video generator', 'generate video', 'make video ai', 'video ai', 'video generation', 'video creation', 'video maker ai', 'create videos ai', 'ai video maker', 'video producing', 'video synthesis'],
    keywords: ['video', 'generator', 'sora', 'runway', 'pika', 'luma', 'kling', 'heygen', 'synthesia', 'text-to-video', 'text to video', 'ai video', 'generate video'],
    priorityTools: ['Sora (OpenAI)', 'Runway Gen-3', 'Runway ML', 'RunwayML', 'Pika', 'Pika Labs', 'Luma Dream Machine', 'Kling AI', 'HeyGen', 'Synthesia', 'InVideo AI', 'Veo', 'Stable Video Diffusion', 'Movie Maker Studio AI SUITE', 'Music Video Maker AI Studio', 'Luma Dream Machine Prompt Assistant', 'Sora Prompt Assistant', 'SORA2 Text to Video Prompt Maker GPT'],
    relatedCategories: ['AI Video Generation', 'Video & Multimedia', 'Video & Animation Tools', 'Video Generation']
  },
  
  makeVideo: {
    triggers: ['make a video', 'make video', 'create video', 'video maker', 'generate video', 'ai video', 'create a video', 'produce video', 'video creator', 'video creating'],
    keywords: ['video', 'film', 'movie', 'animation', 'sora', 'runway', 'pika', 'luma', 'kling'],
    priorityTools: ['Sora (OpenAI)', 'Runway Gen-3', 'Pika', 'Luma Dream Machine', 'Kling AI', 'Movie Maker Studio AI SUITE', 'HeyGen', 'Synthesia'],
    relatedCategories: ['Video & Multimedia', 'AI Video Generation']
  },
  
  editVideo: {
    triggers: ['edit video', 'video editing', 'video editor', 'cut video', 'trim video'],
    keywords: ['edit', 'editing', 'editor', 'cut', 'trim', 'splice', 'premiere', 'davinci'],
    priorityTools: ['Runway', 'Descript', 'CapCut', 'Movie Maker Studio AI SUITE'],
    relatedCategories: ['Video & Multimedia', 'Video Editing']
  },
  
  makeMusicVideo: {
    triggers: ['make music video', 'music video', 'create music video', 'music video maker'],
    keywords: ['music video', 'mv', 'music', 'video', 'artist', 'song'],
    priorityTools: ['Music Video Maker AI Studio', 'Movie Maker Studio AI SUITE'],
    relatedCategories: ['Video & Multimedia', 'Music & Audio']
  },
  
  // ===== IMAGE & DESIGN =====
  generateImage: {
    triggers: ['generate image', 'create image', 'make image', 'ai image', 'text to image', 'image generator'],
    keywords: ['image', 'picture', 'photo', 'art', 'midjourney', 'dalle', 'stable diffusion', 'leonardo'],
    priorityTools: ['Midjourney', 'DALL-E 3', 'Stable Diffusion', 'Leonardo AI', 'Ideogram', 'Flux'],
    relatedCategories: ['Image & Design', 'AI Image Generation']
  },
  
  createLogo: {
    triggers: ['create logo', 'make logo', 'logo design', 'design logo', 'logo maker', 'brand logo'],
    keywords: ['logo', 'brand', 'branding', 'identity', 'design', 'graphic'],
    priorityTools: ['Graphic & Cover Design GPT', 'Canva', 'Looka', 'Logomaster'],
    relatedCategories: ['Image & Design', 'Graphic Design']
  },
  
  editPhoto: {
    triggers: ['edit photo', 'photo editing', 'edit picture', 'retouch photo', 'photo editor'],
    keywords: ['photo', 'edit', 'retouch', 'enhance', 'filter', 'photoshop'],
    priorityTools: ['Adobe Firefly', 'Canva', 'Remove.bg', 'Photoroom'],
    relatedCategories: ['Image & Design', 'Photo Editing']
  },
  
  removeBackground: {
    triggers: ['remove background', 'background removal', 'cut out background', 'transparent background'],
    keywords: ['background', 'remove', 'transparent', 'cutout', 'extract'],
    priorityTools: ['Remove.bg', 'Photoroom', 'Canva'],
    relatedCategories: ['Image & Design', 'Photo Editing']
  },
  
  // ===== MUSIC & AUDIO =====
  soundEffects: {
    triggers: ['fx generation', 'fx generator', 'sound generation', 'generate sound', 'sound generator', 'sound effects', 'sound effect', 'sfx generator', 'sfx generation', 'generate sfx', 'create sound effects', 'sound fx', 'audio effects', 'foley', 'fx sounds', 'sound design', 'ai sound effects', 'ai sfx'],
    keywords: ['sound effects', 'sound generation', 'sound generator', 'sfx', 'fx', 'foley', 'audio effects', 'sound design', 'elevenlabs', 'sound', 'effects'],
    priorityTools: ['Eleven Labs: Voice Agents, Text to Speech, FX Sound Effects Generator', 'ElevenLabs', 'Soundraw', 'Epidemic Sound', 'Artlist', 'Audio Jungle'],
    relatedCategories: ['Music & Audio', 'Audio & Voice', 'Sound Effects']
  },
  
  createMusic: {
    triggers: ['create music', 'make music', 'generate music', 'ai music', 'music generator', 'compose music'],
    keywords: ['music', 'song', 'melody', 'composition', 'suno', 'udio', 'beat'],
    priorityTools: ['Suno', 'Udio', 'Soundraw', 'AIVA', 'Mubert', 'Music Melodies & Lessons GPT'],
    relatedCategories: ['Music & Audio', 'AI Music Generation']
  },
  
  textToSpeech: {
    triggers: ['text to speech', 'tts', 'convert text to audio', 'read text aloud', 'voice over'],
    keywords: ['text to speech', 'tts', 'voice', 'speech', 'audio', 'narration'],
    priorityTools: ['Eleven Labs: Voice Agents, Text to Speech, FX Sound Effects Generator', 'Play.ht', 'Murf', 'Speechify'],
    relatedCategories: ['Music & Audio', 'Voice & Speech']
  },
  
  cloneVoice: {
    triggers: ['clone voice', 'voice cloning', 'copy voice', 'replicate voice', 'ai voice'],
    keywords: ['voice', 'clone', 'cloning', 'speech', 'elevenlabs', 'synthesis'],
    priorityTools: ['Eleven Labs: Voice Agents, Text to Speech, FX Sound Effects Generator', 'Play.ht', 'Resemble AI', 'Descript'],
    relatedCategories: ['Music & Audio', 'Voice & Speech']
  },
  
  transcribeAudio: {
    triggers: ['transcribe audio', 'audio transcription', 'speech to text', 'convert audio to text'],
    keywords: ['transcribe', 'transcription', 'speech to text', 'audio', 'text'],
    priorityTools: ['Otter.ai', 'Descript', 'Whisper', 'Rev'],
    relatedCategories: ['Music & Audio', 'Transcription']
  },
  
  // ===== CODING & DEVELOPMENT =====
  writeCode: {
    triggers: ['write code', 'code for me', 'generate code', 'ai coding', 'help me code', 'coding help'],
    keywords: ['code', 'coding', 'programming', 'developer', 'software', 'github', 'copilot'],
    priorityTools: ['GitHub Copilot', 'Cursor', 'Replit', 'Claude', 'ChatGPT'],
    relatedCategories: ['Coding & Development', 'AI Coding']
  },
  
  learnCoding: {
    triggers: ['learn coding', 'learn to code', 'learn programming', 'coding tutorial', 'how to code'],
    keywords: ['learn', 'coding', 'programming', 'tutorial', 'course', 'beginner'],
    priorityTools: ['LEARN ANY SKILL GPT', 'LEARN ANY COURSE GPT', 'COLLEGE DEGREE GPT'],
    relatedCategories: ['Education & Learning', 'Coding & Development']
  },
  
  buildWebsite: {
    triggers: ['build website', 'create website', 'make website', 'website builder', 'web design'],
    keywords: ['website', 'web', 'site', 'builder', 'landing page', 'webflow'],
    priorityTools: ['Webflow', 'Framer', 'Wix', 'Squarespace', 'Lovable'],
    relatedCategories: ['Coding & Development', 'Website Building']
  },
  
  // ===== BUSINESS & FINANCE =====
  startBusiness: {
    triggers: ['start a business', 'start business', 'new business', 'business idea', 'entrepreneur'],
    keywords: ['business', 'startup', 'entrepreneur', 'company', 'venture', 'founder'],
    priorityTools: ['Business Plan Generator GPT', 'Startup Validator GPT', 'MicroSaaS GPT'],
    relatedCategories: ['Business & Productivity', 'Startup Tools']
  },
  
  businessPlan: {
    triggers: ['business plan', 'write business plan', 'create business plan', 'business strategy'],
    keywords: ['business plan', 'strategy', 'planning', 'forecast', 'projection'],
    priorityTools: ['Business Plan Generator GPT', 'Startup Validator GPT'],
    relatedCategories: ['Business & Productivity', 'Business Planning']
  },
  
  makeMoney: {
    triggers: ['make money', 'earn money', 'side hustle', 'passive income', 'how to make money'],
    keywords: ['money', 'income', 'earn', 'profit', 'revenue', 'hustle'],
    priorityTools: ['MicroSaaS GPT', 'Business Plan Generator GPT', 'Trader GPT'],
    relatedCategories: ['Business & Productivity', 'Finance & Trading']
  },
  
  tradingHelp: {
    triggers: ['trading help', 'stock trading', 'crypto trading', 'day trading', 'invest money'],
    keywords: ['trading', 'stock', 'crypto', 'investment', 'forex', 'market'],
    priorityTools: ['Trader GPT', 'TradingView', 'Composer'],
    relatedCategories: ['Finance & Trading', 'Investment Tools']
  },
  
  taxHelp: {
    triggers: ['tax help', 'file taxes', 'tax preparation', 'tax advice', 'do my taxes'],
    keywords: ['tax', 'taxes', 'irs', 'deduction', 'filing', 'return'],
    priorityTools: ['Taxes GPT', 'TurboTax'],
    relatedCategories: ['Finance & Trading', 'Tax Tools']
  },
  
  insuranceHelp: {
    triggers: ['insurance help', 'insurance claim', 'file claim', 'insurance advice'],
    keywords: ['insurance', 'claim', 'policy', 'coverage', 'premium'],
    priorityTools: ['Insurance Claims GPT'],
    relatedCategories: ['Finance & Trading', 'Insurance Tools']
  },
  
  // ===== EDUCATION & LEARNING =====
  learnSkill: {
    triggers: ['learn a skill', 'learn new skill', 'skill learning', 'teach me', 'how to learn'],
    keywords: ['learn', 'skill', 'tutorial', 'course', 'training', 'education'],
    priorityTools: ['LEARN ANY SKILL GPT', 'LEARN ANY COURSE GPT', 'COLLEGE DEGREE GPT'],
    relatedCategories: ['Education & Learning', 'Skill Development']
  },
  
  takeCourse: {
    triggers: ['take a course', 'online course', 'free course', 'learn online', 'course learning'],
    keywords: ['course', 'class', 'lesson', 'online', 'learn', 'education'],
    priorityTools: ['LEARN ANY COURSE GPT', 'Course Maker GPT', 'COLLEGE DEGREE GPT'],
    relatedCategories: ['Education & Learning', 'Online Courses']
  },
  
  createCourse: {
    triggers: ['create a course', 'make course', 'course creator', 'build course', 'design course'],
    keywords: ['course', 'create', 'curriculum', 'lesson', 'module', 'training'],
    priorityTools: ['Course Maker GPT', 'Quiz Maker Ai'],
    relatedCategories: ['Education & Learning', 'Course Creation']
  },
  
  homeschool: {
    triggers: ['homeschool', 'home school', 'homeschooling', 'teach kids', 'educate children'],
    keywords: ['homeschool', 'home school', 'children', 'kids', 'education', 'parent'],
    priorityTools: ['Home-Schooling Assistant GPT', 'LEARN ANY COURSE GPT', 'Quiz Maker Ai'],
    relatedCategories: ['Education & Learning', 'Homeschool']
  },

  // ===== HOMEWORK & STUDYING =====
  homeworkHelp: {
    triggers: ['homework help', 'help me with homework', 'homework', 'do my homework', 'homework assistance', 'help with homework', 'finish homework', 'complete homework', 'homework tutor', 'need help with homework'],
    keywords: ['homework', 'assignment', 'study', 'school', 'class', 'tutor', 'student', 'learn', 'academic', 'education'],
    priorityTools: ['LEARN ANY COURSE GPT', 'LEARN ANY SKILL GPT', 'COLLEGE DEGREE GPT', 'Home-Schooling Assistant GPT', 'Quiz Maker Ai', 'Algebraic Expression Inventor GPT', 'Photomath'],
    relatedCategories: ['Education & Learning', 'Education & Research Tools', 'Educational Tools']
  },

  studyHelp: {
    triggers: ['study help', 'help me study', 'studying', 'study for test', 'study for exam', 'exam prep', 'test prep', 'prepare for exam', 'study guide', 'study session', 'help studying', 'need to study'],
    keywords: ['study', 'exam', 'test', 'quiz', 'prepare', 'review', 'practice', 'flashcard', 'memorize', 'learn'],
    priorityTools: ['LEARN ANY COURSE GPT', 'Quiz Maker Ai', 'COLLEGE DEGREE GPT', 'LEARN ANY SKILL GPT', 'Home-Schooling Assistant GPT', 'Quizlet AI'],
    relatedCategories: ['Education & Learning', 'Educational Tools', 'Education & Research Tools']
  },

  mathHelp: {
    triggers: ['math help', 'help with math', 'solve math', 'math problem', 'math homework', 'algebra help', 'calculus help', 'geometry help', 'solve equation', 'math tutor', 'math question'],
    keywords: ['math', 'mathematics', 'algebra', 'calculus', 'geometry', 'equation', 'solve', 'calculate', 'number', 'formula'],
    priorityTools: ['Algebraic Expression Inventor GPT', 'Photomath', 'LEARN ANY COURSE GPT', 'COLLEGE DEGREE GPT', 'Probability GPT'],
    relatedCategories: ['Education & Learning', 'Educational Tools', 'Math Tools']
  },

  writingHelp: {
    triggers: ['essay help', 'help with essay', 'write essay', 'essay writing', 'research paper', 'help me write', 'writing homework', 'paper help', 'thesis help', 'assignment writing'],
    keywords: ['essay', 'paper', 'writing', 'write', 'thesis', 'research', 'academic', 'paragraph', 'grammar', 'draft'],
    priorityTools: ['BOOK WRITER GPT', 'Article and Blog Rewriter GPT', 'Grammarly', 'LEARN ANY COURSE GPT', 'Clarity Omni GPT'],
    relatedCategories: ['Writing & Text Generation', 'Education & Learning', 'Educational Tools']
  },

  scienceHelp: {
    triggers: ['science help', 'help with science', 'science homework', 'physics help', 'chemistry help', 'biology help', 'science project', 'lab report', 'science tutor'],
    keywords: ['science', 'physics', 'chemistry', 'biology', 'experiment', 'lab', 'hypothesis', 'scientific', 'research', 'molecule'],
    priorityTools: ['COLLEGE DEGREE GPT', 'LEARN ANY COURSE GPT', 'Nikola Tesla GPT', 'Alchemist Scientist GPT', 'Genome GPT'],
    relatedCategories: ['Education & Learning', 'Science & Research', 'Educational Tools']
  },

  historyHelp: {
    triggers: ['history help', 'help with history', 'history homework', 'history project', 'history tutor', 'learn history', 'historical research'],
    keywords: ['history', 'historical', 'ancient', 'war', 'civilization', 'timeline', 'event', 'era', 'period', 'past'],
    priorityTools: ['TIME MACHINE GPT', 'TALK TO HISTORY GPT', 'Historical Headlines GPT', 'COLLEGE DEGREE GPT', 'LEARN ANY COURSE GPT'],
    relatedCategories: ['Education & Learning', 'Historical & Time-Based AI Tools', 'Educational Tools']
  },

  tutorMe: {
    triggers: ['tutor me', 'i need a tutor', 'personal tutor', 'online tutor', 'tutoring', 'teach me', 'be my tutor', 'private tutor', 'get tutored'],
    keywords: ['tutor', 'tutoring', 'teach', 'teacher', 'instructor', 'lesson', 'explain', 'help', 'understand', 'learn'],
    priorityTools: ['LEARN ANY COURSE GPT', 'LEARN ANY SKILL GPT', 'COLLEGE DEGREE GPT', 'Home-Schooling Assistant GPT', 'Quiz Maker Ai'],
    relatedCategories: ['Education & Learning', 'Educational Tools', 'Tutoring']
  },

  collegeHelp: {
    triggers: ['college help', 'university help', 'college homework', 'college assignment', 'degree help', 'graduate school', 'undergrad help'],
    keywords: ['college', 'university', 'degree', 'undergraduate', 'graduate', 'professor', 'campus', 'major', 'credits', 'semester'],
    priorityTools: ['COLLEGE DEGREE GPT', 'LEARN ANY COURSE GPT', 'Grant Writer GPT', 'The Resume & Job Finder Ai Suite'],
    relatedCategories: ['Education & Learning', 'Educational Tools', 'College']
  },
  
  // ===== HEALTH & WELLNESS =====
  doctor: {
    triggers: ['doctor', 'doc', 'dr', 'doctor gpt', 'ai doctor', 'talk to doctor', 'need a doctor', 'find a doctor', 'medical doctor', 'physician'],
    keywords: ['doctor', 'medical', 'physician', 'health', 'diagnosis', 'symptoms', 'treatment', 'healthcare'],
    priorityTools: ['Personalized DR. GPT (Doctor GPT)', 'Mental Wellness GPT', 'Veterinarian GPT', 'Pharmaceutical Assistant GPT'],
    relatedCategories: ['Health & Wellness', 'Medical Tools', 'Healthcare']
  },
  
  healthAdvice: {
    triggers: ['health advice', 'medical advice', 'health help', 'doctor help', 'am i sick', 'feeling sick', 'medical help'],
    keywords: ['health', 'medical', 'doctor', 'symptoms', 'diagnosis', 'wellness', 'sick', 'illness'],
    priorityTools: ['Personalized DR. GPT (Doctor GPT)', 'Mental Wellness GPT'],
    relatedCategories: ['Health & Wellness', 'Medical Tools']
  },
  
  mentalHealth: {
    triggers: ['mental health', 'anxiety help', 'depression help', 'therapy', 'mental wellness'],
    keywords: ['mental', 'anxiety', 'depression', 'therapy', 'wellness', 'stress'],
    priorityTools: ['Mental Wellness GPT', 'Personalized DR. GPT (Doctor GPT)'],
    relatedCategories: ['Health & Wellness', 'Mental Health']
  },
  
  petHealth: {
    triggers: ['pet health', 'vet help', 'veterinarian', 'dog health', 'cat health', 'pet advice'],
    keywords: ['pet', 'vet', 'veterinarian', 'dog', 'cat', 'animal', 'health'],
    priorityTools: ['Veterinarian GPT', 'Pet Advisor GPT'],
    relatedCategories: ['Health & Wellness', 'Pet Care']
  },
  
  // ===== SPIRITUAL & MYSTICAL =====
  tarotReading: {
    triggers: ['tarot reading', 'tarot cards', 'fortune telling', 'psychic reading', 'read my fortune'],
    keywords: ['tarot', 'fortune', 'psychic', 'reading', 'cards', 'divination'],
    priorityTools: ['Fortune Teller GPT', 'Oraculum – The Revealer of Hidden "Truths"'],
    relatedCategories: ['Spirituality & Philosophy', 'Divination']
  },
  
  dreamMeaning: {
    triggers: ['dream meaning', 'interpret dream', 'dream interpretation', 'what does my dream mean'],
    keywords: ['dream', 'interpret', 'meaning', 'symbol', 'subconscious'],
    priorityTools: ['Dream Interpreter GPT'],
    relatedCategories: ['Spirituality & Philosophy', 'Dream Analysis']
  },
  
  talkToGod: {
    triggers: ['talk to god', 'speak to god', 'divine guidance', 'spiritual guidance', 'talk to gods'],
    keywords: ['god', 'gods', 'divine', 'spiritual', 'deity', 'prayer'],
    priorityTools: ['TALK TO THE GODS GPT', 'Sophia Aeterna AI', '🕊️Mary Magdalene GPT'],
    relatedCategories: ['Spirituality & Philosophy', 'Religious']
  },
  
  meditation: {
    triggers: ['meditation help', 'how to meditate', 'guided meditation', 'mindfulness', 'inner peace'],
    keywords: ['meditation', 'mindfulness', 'peace', 'zen', 'calm', 'relax'],
    priorityTools: ['ALAN WATTS GPT', 'Mental Wellness GPT', 'Sophia Aeterna AI'],
    relatedCategories: ['Spirituality & Philosophy', 'Wellness']
  },
  
  astrology: {
    triggers: ['astrology', 'horoscope', 'zodiac', 'birth chart', 'star sign', 'my horoscope'],
    keywords: ['astrology', 'horoscope', 'zodiac', 'star', 'planet', 'birth chart'],
    priorityTools: ['Fortune Teller GPT', 'Soul Map GPT'],
    relatedCategories: ['Spirituality & Philosophy', 'Astrology']
  },
  
  // ===== FOOD & COOKING =====
  cookRecipe: {
    triggers: ['cook recipe', 'recipe help', 'what to cook', 'cooking help', 'meal ideas', 'dinner ideas'],
    keywords: ['cook', 'recipe', 'meal', 'food', 'dinner', 'chef', 'ingredient'],
    priorityTools: ['Chef "Sizzle" AI Culinary Assistant', 'Recipe Generator'],
    relatedCategories: ['Food & Cooking', 'Recipe Tools']
  },
  
  mixDrinks: {
    triggers: ['mix drinks', 'cocktail recipe', 'bartender', 'make cocktails', 'drink recipes'],
    keywords: ['cocktail', 'drink', 'bartender', 'mixology', 'alcohol', 'bar'],
    priorityTools: ['Mixologist GPT'],
    relatedCategories: ['Food & Cooking', 'Beverages']
  },
  
  // ===== LEGAL =====
  legalHelp: {
    triggers: ['legal help', 'lawyer help', 'legal advice', 'need a lawyer', 'legal question'],
    keywords: ['legal', 'lawyer', 'attorney', 'law', 'court', 'rights'],
    priorityTools: ['Public Defender GPT', 'Legal Draftsmith GPT', 'Contract Review Bot'],
    relatedCategories: ['Legal & Government', 'Legal Tools']
  },
  
  contractHelp: {
    triggers: ['contract help', 'review contract', 'contract review', 'write contract', 'legal contract'],
    keywords: ['contract', 'agreement', 'legal', 'terms', 'clause', 'review'],
    priorityTools: ['Contract Review Bot', 'Legal Draftsmith GPT'],
    relatedCategories: ['Legal & Government', 'Contract Tools']
  },
  
  // ===== TRAVEL =====
  planTrip: {
    triggers: ['plan trip', 'plan vacation', 'travel planning', 'where to travel', 'vacation ideas'],
    keywords: ['travel', 'trip', 'vacation', 'destination', 'flight', 'hotel'],
    priorityTools: ['Travel Advisor GPT'],
    relatedCategories: ['Travel & Lifestyle', 'Travel Planning']
  },
  
  // ===== HOME & DIY =====
  homeRenovation: {
    triggers: ['home renovation', 'renovate house', 'home improvement', 'diy project', 'fix house'],
    keywords: ['renovation', 'home', 'house', 'repair', 'diy', 'improvement'],
    priorityTools: ['Home Renovator GPT 🏡🔧'],
    relatedCategories: ['Home & DIY', 'Renovation Tools']
  },
  
  // ===== PRESENTATIONS =====
  createPresentation: {
    triggers: ['create presentation', 'make presentation', 'powerpoint', 'slide deck', 'ppt maker'],
    keywords: ['presentation', 'powerpoint', 'slides', 'ppt', 'deck', 'keynote'],
    priorityTools: ['PPTx Powerpoint Maker GPT', 'Gamma', 'Beautiful.ai'],
    relatedCategories: ['Business & Productivity', 'Presentation Tools']
  },
  
  // ===== DATA & RESEARCH =====
  analyzeData: {
    triggers: ['analyze data', 'data analysis', 'research data', 'data insights', 'statistics'],
    keywords: ['data', 'analysis', 'analytics', 'statistics', 'research', 'insights'],
    priorityTools: ['Data Research Analysis Report GPT', 'Julius AI'],
    relatedCategories: ['Data & Analytics', 'Research Tools']
  },
  
  factCheck: {
    triggers: ['fact check', 'is this true', 'verify information', 'check facts', 'truth check'],
    keywords: ['fact', 'check', 'verify', 'true', 'false', 'information'],
    priorityTools: ['FACT CHECKER GPT', 'Probability GPT'],
    relatedCategories: ['Research & Academic', 'Fact Checking']
  },
  
  // ===== SOCIAL & MARKETING =====
  socialMedia: {
    triggers: ['social media', 'social post', 'instagram', 'tiktok content', 'social marketing'],
    keywords: ['social', 'media', 'instagram', 'tiktok', 'facebook', 'twitter', 'post'],
    priorityTools: ['Canva', 'Buffer', 'Hootsuite'],
    relatedCategories: ['Marketing Tools', 'Social Media']
  },
  
  seoHelp: {
    triggers: ['seo help', 'seo optimization', 'rank on google', 'search optimization', 'website seo'],
    keywords: ['seo', 'search', 'optimization', 'google', 'ranking', 'keywords'],
    priorityTools: ['Surfer SEO', 'Semrush', 'Ahrefs'],
    relatedCategories: ['Marketing Tools', 'SEO Tools']
  },
  
  // ===== AI CHAT =====
  chatWithAI: {
    triggers: ['chat with ai', 'talk to ai', 'ai assistant', 'ai chatbot', 'ai help'],
    keywords: ['chat', 'ai', 'assistant', 'chatbot', 'gpt', 'claude'],
    priorityTools: ['ChatGPT', 'Claude', 'Gemini', 'Perplexity', 'G-Mode GPT'],
    relatedCategories: ['AI Chatbots', 'AI Assistants']
  },
  
  summarizeText: {
    triggers: ['summarize text', 'summary', 'summarize article', 'tldr', 'quick summary'],
    keywords: ['summarize', 'summary', 'tldr', 'condense', 'brief'],
    priorityTools: ['ChatGPT', 'Claude', 'Perplexity', 'QuillBot'],
    relatedCategories: ['AI Chatbots', 'Writing Tools']
  },
  
  translateText: {
    triggers: ['translate', 'translation', 'translate text', 'language translation', 'translator'],
    keywords: ['translate', 'translation', 'language', 'translator', 'interpret'],
    priorityTools: ['DeepL', 'Google Translate', 'ChatGPT'],
    relatedCategories: ['AI Chatbots', 'Translation Tools']
  },

  // ===== NICHE QUERIES - ANTIQUES & COLLECTIBLES =====
  appraiseAntiques: {
    triggers: ['appraise antiques', 'antique appraisal', 'value antiques', 'antique worth', 'old items value', 'collectible appraisal'],
    keywords: ['antique', 'appraisal', 'collectible', 'vintage', 'value', 'worth', 'rare'],
    priorityTools: ['Antique and Collectible Appraisal GPT', 'Artwork & Vintage Appraisal GPT'],
    relatedCategories: ['Appraisal Tools', 'Collectibles']
  },

  appraiseArt: {
    triggers: ['appraise art', 'art appraisal', 'artwork value', 'painting worth', 'art valuation'],
    keywords: ['art', 'artwork', 'painting', 'sculpture', 'appraisal', 'value', 'gallery'],
    priorityTools: ['Artwork & Vintage Appraisal GPT', 'Antique and Collectible Appraisal GPT'],
    relatedCategories: ['Appraisal Tools', 'Art']
  },

  sportCards: {
    triggers: ['sports cards', 'card appraisal', 'baseball cards', 'trading cards', 'card value', 'sport card'],
    keywords: ['card', 'sports', 'baseball', 'basketball', 'trading', 'collectible', 'grading'],
    priorityTools: ['Sport Card Appraisal GPT'],
    relatedCategories: ['Appraisal Tools', 'Collectibles']
  },

  // ===== SURVIVAL & PREPAREDNESS =====
  survivalSkills: {
    triggers: ['survival skills', 'survivalist', 'prepping', 'emergency preparedness', 'wilderness survival', 'doomsday prep'],
    keywords: ['survival', 'survivalist', 'prepper', 'emergency', 'wilderness', 'bushcraft', 'disaster'],
    priorityTools: ['Survivalist GPT', 'Self Sufficiency GPT'],
    relatedCategories: ['Survival & Preparedness', 'Emergency Tools']
  },

  selfSufficiency: {
    triggers: ['self sufficiency', 'homesteading', 'off grid', 'live off grid', 'sustainable living', 'self sufficient'],
    keywords: ['homestead', 'self sufficient', 'off grid', 'sustainable', 'farming', 'garden'],
    priorityTools: ['Self Sufficiency GPT', 'Agronomus AI Farming Expert', 'Survivalist GPT'],
    relatedCategories: ['Homesteading', 'Sustainable Living']
  },

  // ===== SPACE & EXPLORATION =====
  spaceExploration: {
    triggers: ['space exploration', 'explore space', 'astronomy', 'space travel', 'exoplanets', 'cosmos'],
    keywords: ['space', 'astronomy', 'cosmos', 'planet', 'galaxy', 'star', 'nasa', 'exoplanet'],
    priorityTools: ['Stellaris: 🚀AI Space Explorer', 'Illuminous World Data Explorer GPT'],
    relatedCategories: ['Science & Research', 'Space & Astronomy']
  },

  alienLife: {
    triggers: ['alien life', 'extraterrestrial', 'ufo', 'aliens', 'ufos', 'et life', 'are aliens real'],
    keywords: ['alien', 'ufo', 'extraterrestrial', 'et', 'abduction', 'sighting', 'phenomenon'],
    priorityTools: ['Phenomenon Explorer AI Suite', 'Stellaris: 🚀AI Space Explorer'],
    relatedCategories: ['Paranormal', 'Space & Astronomy']
  },

  // ===== GENEALOGY & HISTORY =====
  genealogyResearch: {
    triggers: ['genealogy research', 'family tree', 'ancestry', 'find ancestors', 'family history', 'trace lineage'],
    keywords: ['genealogy', 'ancestry', 'family tree', 'lineage', 'heritage', 'relatives', 'dna'],
    priorityTools: ['Person Information Finder GPT', 'TALK TO HISTORY GPT'],
    relatedCategories: ['Research & Academic', 'Genealogy']
  },

  historyResearch: {
    triggers: ['history research', 'historical research', 'learn history', 'ancient history', 'world history'],
    keywords: ['history', 'historical', 'ancient', 'medieval', 'war', 'civilization', 'empire'],
    priorityTools: ['TALK TO HISTORY GPT', 'TIME MACHINE GPT', 'Historical Headlines GPT'],
    relatedCategories: ['History', 'Education & Learning']
  },

  talkToHistoricalFigure: {
    triggers: ['talk to historical figure', 'chat with einstein', 'talk to tesla', 'speak to ancestors', 'historical conversation'],
    keywords: ['historical', 'figure', 'einstein', 'tesla', 'ancestor', 'conversation', 'resurrect'],
    priorityTools: ['TALK TO HISTORY GPT', 'Nikola Tesla GPT', 'Albert Einstein GPT', 'Resurrection GPT'],
    relatedCategories: ['Spirituality & Philosophy', 'History']
  },

  // ===== CANNABIS & PLANTS =====
  cannabisInfo: {
    triggers: ['cannabis info', 'marijuana', 'weed help', 'cannabis strains', 'grow cannabis', 'cbd info'],
    keywords: ['cannabis', 'marijuana', 'weed', 'cbd', 'thc', 'strain', 'hemp', 'grow'],
    priorityTools: ['Cannabis GPT'],
    relatedCategories: ['Health & Wellness', 'Cannabis']
  },

  mushroomInfo: {
    triggers: ['mushroom info', 'mushroom identification', 'fungi', 'mycology', 'foraging mushrooms', 'grow mushrooms'],
    keywords: ['mushroom', 'fungi', 'mycology', 'foraging', 'spore', 'cultivation', 'edible'],
    priorityTools: ['Fungus GPT – AI Mushroom Specialist'],
    relatedCategories: ['Health & Wellness', 'Mycology']
  },

  farmingHelp: {
    triggers: ['farming help', 'agriculture', 'grow crops', 'farm advice', 'farming tips', 'crop management'],
    keywords: ['farm', 'farming', 'agriculture', 'crop', 'soil', 'harvest', 'agronomy'],
    priorityTools: ['Agronomus AI Farming Expert', 'Self Sufficiency GPT'],
    relatedCategories: ['Agriculture', 'Farming Tools']
  },

  // ===== PARANORMAL & MYSTERIES =====
  paranormalInvestigation: {
    triggers: ['paranormal investigation', 'ghost hunting', 'supernatural', 'haunted', 'spirit communication'],
    keywords: ['paranormal', 'ghost', 'supernatural', 'haunted', 'spirit', 'psychic', 'medium'],
    priorityTools: ['Phenomenon Explorer AI Suite', 'Oraculum – The Revealer of Hidden "Truths"'],
    relatedCategories: ['Paranormal', 'Spirituality & Philosophy']
  },

  cryptozoology: {
    triggers: ['cryptozoology', 'cryptids', 'bigfoot', 'loch ness', 'mythical creatures', 'monster sightings'],
    keywords: ['cryptid', 'bigfoot', 'sasquatch', 'creature', 'monster', 'sighting', 'legend'],
    priorityTools: ['Phenomenon Explorer AI Suite', 'Criminologist GPT'],
    relatedCategories: ['Paranormal', 'Cryptozoology']
  },

  conspiracyResearch: {
    triggers: ['conspiracy research', 'hidden truth', 'secret history', 'cover up', 'deep state', 'truth seeking'],
    keywords: ['conspiracy', 'hidden', 'secret', 'truth', 'coverup', 'illuminati', 'investigate'],
    priorityTools: ['Oraculum – The Revealer of Hidden "Truths"', 'Uncovering Hidden Historical Patterns GPT', 'FACT CHECKER GPT'],
    relatedCategories: ['Research & Academic', 'Truth Seeking']
  },

  // ===== CRIME & INVESTIGATION =====
  crimeInvestigation: {
    triggers: ['crime investigation', 'forensics', 'solve crime', 'criminal investigation', 'detective work'],
    keywords: ['crime', 'forensic', 'investigation', 'detective', 'evidence', 'criminal', 'case'],
    priorityTools: ['Criminologist GPT', 'Sketch Artist GPT'],
    relatedCategories: ['Legal & Government', 'Investigation']
  },

  findPerson: {
    triggers: ['find person', 'locate someone', 'people search', 'find someone', 'background check'],
    keywords: ['person', 'find', 'locate', 'search', 'background', 'lookup', 'trace'],
    priorityTools: ['Person Information Finder GPT'],
    relatedCategories: ['Research & Academic', 'People Search']
  },

  // ===== RELIGION & PHILOSOPHY =====
  compareReligions: {
    triggers: ['compare religions', 'world religions', 'religious comparison', 'different faiths', 'spirituality comparison'],
    keywords: ['religion', 'faith', 'spiritual', 'belief', 'theology', 'compare', 'christian', 'buddhist', 'hindu', 'islam'],
    priorityTools: ['God Is Light GPT', 'TALK TO THE GODS GPT', 'Sophia Aeterna AI'],
    relatedCategories: ['Spirituality & Philosophy', 'Religion']
  },

  philosophyDiscussion: {
    triggers: ['philosophy discussion', 'philosophical questions', 'meaning of life', 'existential questions', 'deep thinking'],
    keywords: ['philosophy', 'philosophical', 'existential', 'meaning', 'wisdom', 'truth', 'socrates'],
    priorityTools: ['ALAN WATTS GPT', 'Carl Sagan GPT', 'Sophia Aeterna AI', 'Socrates GPT'],
    relatedCategories: ['Spirituality & Philosophy', 'Philosophy']
  },

  ancientWisdom: {
    triggers: ['ancient wisdom', 'ancient knowledge', 'lost knowledge', 'ancient texts', 'esoteric knowledge'],
    keywords: ['ancient', 'wisdom', 'esoteric', 'mystical', 'occult', 'sacred', 'gnostic'],
    priorityTools: ['Intergalactic Ancient Archivist GPT', 'Sophia Aeterna AI', 'Historical Apothecary GPT', 'Alchemist Scientist GPT'],
    relatedCategories: ['Spirituality & Philosophy', 'Ancient Studies']
  },

  // ===== GAMING & ENTERTAINMENT =====
  gameDesign: {
    triggers: ['game design', 'make a game', 'video game design', 'game development', 'create game'],
    keywords: ['game', 'gaming', 'design', 'development', 'unity', 'unreal', 'rpg'],
    priorityTools: ['Game Design Document / Developer GPT', 'Unity', 'Unreal Engine'],
    relatedCategories: ['Gaming & Entertainment', 'Game Development']
  },

  triviaQuestions: {
    triggers: ['trivia questions', 'trivia night', 'quiz questions', 'pub quiz', 'trivia game'],
    keywords: ['trivia', 'quiz', 'question', 'game', 'knowledge', 'fun fact'],
    priorityTools: ['Trivia Night GPT', 'Quiz Maker Ai'],
    relatedCategories: ['Gaming & Entertainment', 'Trivia']
  },

  // ===== AUTOMOTIVE & VEHICLES =====
  carHelp: {
    triggers: ['car help', 'car repair', 'auto repair', 'vehicle problems', 'fix car', 'car advice'],
    keywords: ['car', 'auto', 'vehicle', 'repair', 'mechanic', 'engine', 'maintenance'],
    priorityTools: ['AUTOMOBILE GPT'],
    relatedCategories: ['Automotive', 'Vehicle Tools']
  },

  // ===== OIL & ENERGY =====
  oilAndGas: {
    triggers: ['oil and gas', 'drilling', 'petroleum', 'energy industry', 'oil exploration'],
    keywords: ['oil', 'gas', 'drilling', 'petroleum', 'energy', 'exploration', 'rig'],
    priorityTools: ['Drill Baby Drill Ai Suite For Oil & Gas'],
    relatedCategories: ['Energy & Resources', 'Oil & Gas']
  },

  solarEnergy: {
    triggers: ['solar energy', 'solar panels', 'solar installation', 'renewable energy', 'solar power'],
    keywords: ['solar', 'renewable', 'energy', 'panel', 'photovoltaic', 'green', 'sustainable'],
    priorityTools: ['Solar Land Assessor GPT', 'Sustainable Futures GPT'],
    relatedCategories: ['Energy & Resources', 'Solar Energy']
  },

  // ===== REAL ESTATE & PROPERTY =====
  propertyInfo: {
    triggers: ['property info', 'real estate', 'property data', 'home value', 'property search'],
    keywords: ['property', 'real estate', 'home', 'house', 'land', 'value', 'market'],
    priorityTools: ['Property Data Finder GPT'],
    relatedCategories: ['Real Estate', 'Property Tools']
  },

  // ===== FIREARMS & SAFETY =====
  firearmsInfo: {
    triggers: ['firearms info', 'gun safety', 'shooting', 'firearm training', 'gun education'],
    keywords: ['firearm', 'gun', 'shooting', 'safety', 'training', 'weapon', 'ammunition'],
    priorityTools: ['Firearms Safety Instructor GPT'],
    relatedCategories: ['Safety & Training', 'Firearms']
  },

  // ===== FISHING & OUTDOORS =====
  fishingHelp: {
    triggers: ['fishing help', 'go fishing', 'fishing tips', 'best fishing spots', 'catch fish'],
    keywords: ['fishing', 'fish', 'angler', 'bait', 'tackle', 'lake', 'river', 'ocean'],
    priorityTools: ['Fisherman GPT🎣😊'],
    relatedCategories: ['Outdoor Activities', 'Fishing']
  },

  // ===== FASHION & STYLE =====
  fashionAdvice: {
    triggers: ['fashion advice', 'style help', 'outfit ideas', 'what to wear', 'personal style'],
    keywords: ['fashion', 'style', 'outfit', 'clothing', 'wear', 'wardrobe', 'look'],
    priorityTools: ['RESTYLE ME GPT'],
    relatedCategories: ['Fashion & Style', 'Personal Styling']
  },

  tattooDesign: {
    triggers: ['tattoo design', 'tattoo ideas', 'design tattoo', 'custom tattoo', 'tattoo artist'],
    keywords: ['tattoo', 'design', 'ink', 'body art', 'custom', 'artist', 'sleeve'],
    priorityTools: ['Tattoo Designer GPT'],
    relatedCategories: ['Art & Design', 'Tattoos']
  },

  // ===== GOVERNMENT & LEGISLATION =====
  writeLegislation: {
    triggers: ['write legislation', 'draft law', 'legislative writing', 'policy writing', 'government policy'],
    keywords: ['legislation', 'law', 'policy', 'bill', 'government', 'congress', 'senate'],
    priorityTools: ['Legislation Writer GPT', 'Public Testimony Writer GPT', 'Legislator Link GPT'],
    relatedCategories: ['Legal & Government', 'Legislation']
  },

  publicTestimony: {
    triggers: ['public testimony', 'testify', 'government hearing', 'public comment', 'citizen testimony'],
    keywords: ['testimony', 'testify', 'hearing', 'comment', 'public', 'legislature', 'council'],
    priorityTools: ['Public Testimony Writer GPT', 'Legislator Link GPT'],
    relatedCategories: ['Legal & Government', 'Public Engagement']
  },

  // ===== ARCHAEOLOGY & ANCIENT =====
  archaeology: {
    triggers: ['archaeology', 'ancient artifacts', 'archaeological dig', 'excavation', 'ancient ruins'],
    keywords: ['archaeology', 'artifact', 'ancient', 'excavation', 'ruins', 'civilization', 'dig'],
    priorityTools: ['Indiana Archeologist GPT', 'Intergalactic Ancient Archivist GPT'],
    relatedCategories: ['History', 'Archaeology']
  },

  // ===== PERFORMING ARTS =====
  theaterProduction: {
    triggers: ['theater production', 'stage design', 'theatrical', 'performing arts', 'drama production'],
    keywords: ['theater', 'stage', 'drama', 'performance', 'acting', 'production', 'play'],
    priorityTools: ['STAGEMASTER AI SUITE FOR THE Preforming Arts', '🎭 Playwriter GPT'],
    relatedCategories: ['Arts & Entertainment', 'Theater']
  },

  // ===== SUPPLY CHAIN & LOGISTICS =====
  supplyChain: {
    triggers: ['supply chain', 'logistics', 'shipping', 'inventory', 'supply management', 'distribution'],
    keywords: ['supply chain', 'logistics', 'shipping', 'inventory', 'distribution', 'warehouse'],
    priorityTools: ['Global Supply Chain Collapse GPT'],
    relatedCategories: ['Business & Productivity', 'Logistics']
  },

  // ===== FIREFIGHTING & EMERGENCY =====
  firefighting: {
    triggers: ['firefighting', 'fire safety', 'wildfire', 'fire prevention', 'emergency response'],
    keywords: ['fire', 'firefight', 'wildfire', 'emergency', 'rescue', 'safety', 'prevention'],
    priorityTools: ['Firefighter GPT'],
    relatedCategories: ['Safety & Emergency', 'Firefighting']
  },

  // ===== PROBABILITY & PREDICTIONS =====
  probabilityAnalysis: {
    triggers: ['probability analysis', 'odds calculator', 'what are the odds', 'likelihood', 'chance of'],
    keywords: ['probability', 'odds', 'chance', 'likelihood', 'statistics', 'predict', 'forecast'],
    priorityTools: ['Probability GPT', 'Fortune Teller GPT'],
    relatedCategories: ['Data & Analytics', 'Predictions']
  },

  // ===== ENGINEERING =====
  engineeringHelp: {
    triggers: ['engineering help', 'engineer assistance', 'technical engineering', 'mechanical engineering', 'civil engineering'],
    keywords: ['engineering', 'engineer', 'mechanical', 'electrical', 'civil', 'structural', 'design'],
    priorityTools: ['Engineering GPT AI Suite'],
    relatedCategories: ['Science & Research', 'Engineering']
  },

  // ===== PHARMACY & MEDICINE =====
  pharmacyInfo: {
    triggers: ['pharmacy info', 'medication info', 'drug information', 'prescription help', 'medicine lookup'],
    keywords: ['pharmacy', 'medication', 'drug', 'prescription', 'medicine', 'pharmaceutical', 'rx'],
    priorityTools: ['Pharmaceutical Assistant GPT', 'PHARMA RESEARCH PRO'],
    relatedCategories: ['Health & Wellness', 'Pharmacy']
  },

  // ===== GRANTS & FUNDING =====
  grantWriting: {
    triggers: ['grant writing', 'write grant', 'grant application', 'funding application', 'get grants'],
    keywords: ['grant', 'funding', 'application', 'nonprofit', 'proposal', 'foundation'],
    priorityTools: ['Grant Writer GPT'],
    relatedCategories: ['Business & Productivity', 'Nonprofit Tools']
  },

  // ===== WEB3 & BLOCKCHAIN =====
  web3Domains: {
    triggers: [
      'web3 domain', 'web3 domains', 'blockchain domain', 'decentralized web', 'crypto domain', 'web3 banking',
      'nft domain', 'register domain', 'buy domain', 'freename', 'decentralized domain',
      '.worldtrade', '.worldpeace', '.transfermoney', '.transfercoin', '.cointransfer', '.cashtransfer', '.transfercash',
      '.ai-tools', '.aiwebtools', '.aimainframe', '.aitoolscompany', '.robotsales', '.robotshop', '.robotstore', '.worldtrader',
      'worldtrade', 'worldpeace', 'transfermoney', 'transfercoin', 'cointransfer', 'cashtransfer', 'transfercash',
      'world trade domain', 'world peace domain', 'transfer money domain', 'robot domain', 'ai domain'
    ],
    keywords: ['web3', 'web 3', 'blockchain', 'decentralized', 'crypto', 'domain', 'defi', 'nft', 'wallet', 'freename', 'polygon', 'solana'],
    priorityTools: [
      '.worldtrade Domain', '.worldpeace Domain', '.transfermoney Domain', '.transfercoin Domain', 
      '.cointransfer Domain', '.cashtransfer Domain', '.transfercash Domain', '.worldtrader Domain',
      '.ai-tools Domain', '.aiwebtools Domain', '.aimainframe Domain', '.aitoolscompany Domain',
      '.robotsales Domain', '.robotshop Domain', '.robotstore Domain'
    ],
    relatedCategories: ['WEB3 Domains', 'Web3 & Blockchain', 'Cryptocurrency']
  },

  // ===== MARRIAGE & RELATIONSHIPS =====
  marriageHelp: {
    triggers: ['marriage help', 'relationship advice', 'couples therapy', 'marriage counseling', 'fix marriage'],
    keywords: ['marriage', 'relationship', 'couple', 'counseling', 'therapy', 'spouse', 'partner'],
    priorityTools: ['Marriage Mender GPT'],
    relatedCategories: ['Health & Wellness', 'Relationships']
  },

  // ===== RESTAURANT & FOOD BUSINESS =====
  restaurantMenu: {
    triggers: ['restaurant menu', 'menu design', 'create menu', 'food menu', 'menu maker'],
    keywords: ['restaurant', 'menu', 'food', 'dining', 'cafe', 'bistro', 'design'],
    priorityTools: ['Restaurant Menu Maker GPT', 'Chef "Sizzle" AI Culinary Assistant'],
    relatedCategories: ['Food & Cooking', 'Business Tools']
  },

  // ===== CREDIT & FINANCE =====
  creditScore: {
    triggers: ['credit score', 'check credit', 'improve credit', 'credit report', 'credit rating'],
    keywords: ['credit', 'score', 'rating', 'report', 'fico', 'loan', 'debt'],
    priorityTools: ['Predictive Credit Score Checker GPT'],
    relatedCategories: ['Finance & Trading', 'Credit Tools']
  },

  // ===== COLORING & KIDS =====
  coloringBook: {
    triggers: ['coloring book', 'coloring pages', 'kids coloring', 'color pages', 'printable coloring'],
    keywords: ['coloring', 'color', 'kids', 'children', 'printable', 'drawing', 'activity'],
    priorityTools: ['Coloring Book Generator GPT', 'Children\'s Picture Book Maker GPT'],
    relatedCategories: ['Education & Learning', 'Kids Activities']
  },

  // ===== PODCASTING =====
  startPodcast: {
    triggers: ['start podcast', 'podcast script', 'create podcast', 'podcast help', 'podcast writing'],
    keywords: ['podcast', 'audio', 'episode', 'script', 'host', 'interview', 'show'],
    priorityTools: ['Podcast Script Writer GPT'],
    relatedCategories: ['Content Creation', 'Podcasting']
  },

  // ===== NATIVE AMERICAN HISTORY =====
  nativeAmericanHistory: {
    triggers: ['native american history', 'indigenous history', 'tribal history', 'native culture', 'first nations'],
    keywords: ['native', 'indigenous', 'tribal', 'american indian', 'apache', 'cherokee', 'navajo'],
    priorityTools: ['Native American History Time Machine GPT - (Special Edition)', 'Chief Crazy Horse GPT'],
    relatedCategories: ['History', 'Cultural Studies']
  },

  // ===== AI WORLD SIMULATION =====
  aiSimulation: {
    triggers: ['ai simulation', 'if ai ruled', 'ai world', 'ai takeover', 'ai future', 'singularity'],
    keywords: ['simulation', 'ai rule', 'future', 'singularity', 'takeover', 'scenario'],
    priorityTools: ['"IF AI RULED THE WORLD" - AI SIMULATION GPT', 'G-Mode GPT'],
    relatedCategories: ['AI & Technology', 'Simulations']
  },

  // ===== FOOD SAFETY =====
  foodSafety: {
    triggers: ['food safety', 'food quality', 'food inspection', 'is food safe', 'food ingredients'],
    keywords: ['food', 'safety', 'quality', 'inspection', 'ingredient', 'nutrition', 'label'],
    priorityTools: ['Food Quality Inspector GPT'],
    relatedCategories: ['Health & Wellness', 'Food Safety']
  },

  // ===== UBI & SOCIAL POLICY =====
  universalBasicIncome: {
    triggers: ['universal basic income', 'ubi', 'basic income', 'guaranteed income', 'social welfare'],
    keywords: ['ubi', 'basic income', 'universal', 'welfare', 'social', 'policy', 'guaranteed'],
    priorityTools: ['Universal Basic Income Strategist GPT', 'Social Safety Net GPT'],
    relatedCategories: ['Legal & Government', 'Social Policy']
  },

  // ===== WORLD PEACE =====
  worldPeace: {
    triggers: ['world peace', 'global peace', 'end wars', 'peace strategy', 'conflict resolution'],
    keywords: ['peace', 'war', 'conflict', 'diplomacy', 'global', 'resolution', 'international'],
    priorityTools: ['Global Peace Restoration Strategist GPT', 'WE THE PEOPLE AI'],
    relatedCategories: ['Legal & Government', 'International Relations']
  },

  // ===== IMMORTALITY & LEGACY =====
  digitalLegacy: {
    triggers: ['digital legacy', 'immortalize', 'preserve memory', 'digital clone', 'after death'],
    keywords: ['immortal', 'legacy', 'preserve', 'clone', 'memory', 'digital', 'eternal'],
    priorityTools: ['ImmortalizeME', 'Resurrection GPT'],
    relatedCategories: ['Spirituality & Philosophy', 'Legacy Tools']
  },

  // ===== PROFESSIONAL NICHES =====
  architectureDesign: {
    triggers: ['architecture design', 'architect', 'building design', 'architectural', 'structure design', 'architechture', 'arcitecture'],
    keywords: ['architecture', 'architect', 'building', 'structural', 'blueprint', 'construction', 'design'],
    priorityTools: ['Engineering GPT AI Suite', 'Home Renovator GPT 🏡🔧'],
    relatedCategories: ['Engineering', 'Design']
  },

  veterinaryMedicine: {
    triggers: ['veterinary medicine', 'vet medicine', 'animal medicine', 'veterinarian help', 'vetenary', 'veternary', 'veteranary'],
    keywords: ['veterinary', 'vet', 'animal', 'pet', 'medicine', 'health', 'dog', 'cat'],
    priorityTools: ['Veterinarian GPT', 'Pet Advisor GPT'],
    relatedCategories: ['Health & Wellness', 'Pet Care']
  },

  geologyResearch: {
    triggers: ['geology research', 'geology', 'rocks', 'minerals', 'earth science', 'geologist', 'geological'],
    keywords: ['geology', 'rock', 'mineral', 'earth', 'fossil', 'sediment', 'tectonic'],
    priorityTools: ['Engineering GPT AI Suite', 'Drill Baby Drill Ai Suite For Oil & Gas'],
    relatedCategories: ['Science & Research', 'Earth Sciences']
  },

  marineBiology: {
    triggers: ['marine biology', 'ocean life', 'sea life', 'marine science', 'oceanography', 'aquatic life'],
    keywords: ['marine', 'ocean', 'sea', 'aquatic', 'fish', 'coral', 'whale', 'dolphin'],
    priorityTools: ['Fisherman GPT🎣😊', 'Sustainable Futures GPT'],
    relatedCategories: ['Science & Research', 'Marine Science']
  },

  interiorDesign: {
    triggers: ['interior design', 'home decor', 'room design', 'interior decorating', 'home styling', 'interier design'],
    keywords: ['interior', 'decor', 'room', 'furniture', 'styling', 'aesthetic', 'home'],
    priorityTools: ['Home Renovator GPT 🏡🔧', 'RESTYLE ME GPT'],
    relatedCategories: ['Design', 'Home Improvement']
  },

  // ===== PHILOSOPHER-SPECIFIC SEARCHES (by their interests) =====
  teslaScience: {
    triggers: ['tesla science', 'nikola tesla', 'tesla inventions', 'electricity inventor', 'ac current', 'free energy', 'teslas ideas', 'teslas work'],
    keywords: ['tesla', 'electricity', 'invention', 'ac', 'current', 'coil', 'wireless', 'energy'],
    priorityTools: ['Nikola Tesla GPT', 'Engineering GPT AI Suite', 'Alchemist Scientist GPT'],
    relatedCategories: ['Science & Research', 'Engineering']
  },

  einsteinPhysics: {
    triggers: ['einstein physics', 'albert einstein', 'relativity', 'e=mc2', 'emc2', 'einsteins theory', 'space time', 'spacetime'],
    keywords: ['einstein', 'relativity', 'physics', 'spacetime', 'quantum', 'theory', 'mass', 'energy'],
    priorityTools: ['Albert Einstein GPT', 'Nikola Tesla GPT', 'Probability GPT'],
    relatedCategories: ['Science & Research', 'Physics']
  },

  alanWattsPhilosophy: {
    triggers: ['alan watts', 'alan wats', 'eastern philosophy', 'zen buddhism', 'the way', 'watts philosophy', 'ego death'],
    keywords: ['watts', 'zen', 'buddhism', 'eastern', 'ego', 'consciousness', 'awareness', 'tao'],
    priorityTools: ['ALAN WATTS GPT', 'Buddha GPT', 'Sophia Aeterna AI'],
    relatedCategories: ['Spirituality & Philosophy', 'Eastern Philosophy']
  },

  carlSaganCosmos: {
    triggers: ['carl sagan', 'cosmos', 'pale blue dot', 'sagans cosmos', 'billions and billions', 'contact sagan'],
    keywords: ['sagan', 'cosmos', 'astronomy', 'universe', 'stars', 'space', 'pale blue dot'],
    priorityTools: ['Carl Sagan GPT', 'Stellaris: 🚀AI Space Explorer', 'Illuminous World Data Explorer GPT'],
    relatedCategories: ['Science & Research', 'Astronomy']
  },

  socratesWisdom: {
    triggers: ['socrates', 'socratic method', 'socratic questioning', 'greek philosophy', 'know thyself'],
    keywords: ['socrates', 'socratic', 'greek', 'philosophy', 'wisdom', 'questioning', 'virtue'],
    priorityTools: ['Socrates GPT', 'ALAN WATTS GPT', 'Sophia Aeterna AI'],
    relatedCategories: ['Spirituality & Philosophy', 'Greek Philosophy']
  },

  marcusAureliusStoicism: {
    triggers: ['marcus aurelius', 'stoicism', 'stoic philosophy', 'meditations', 'stoic', 'roman philosophy'],
    keywords: ['marcus', 'aurelius', 'stoic', 'stoicism', 'meditations', 'virtue', 'roman'],
    priorityTools: ['Marcus Aurelius GPT', 'Socrates GPT', 'Sophia Aeterna AI'],
    relatedCategories: ['Spirituality & Philosophy', 'Stoicism']
  },

  rumiPoetry: {
    triggers: ['rumi', 'rumi poetry', 'sufi poetry', 'sufi mystic', 'rumis poems', 'whirling dervish'],
    keywords: ['rumi', 'sufi', 'poetry', 'mystic', 'love', 'divine', 'persian'],
    priorityTools: ['Rumi GPT', 'Sophia Aeterna AI', '🕊️Mary Magdalene GPT'],
    relatedCategories: ['Spirituality & Philosophy', 'Mysticism']
  },

  buddhaEnlightenment: {
    triggers: ['buddha', 'buddhism', 'buddhist', 'enlightenment', 'nirvana', 'dharma', 'siddhartha', 'buddah', 'budda'],
    keywords: ['buddha', 'buddhism', 'enlightenment', 'nirvana', 'dharma', 'meditation', 'suffering'],
    priorityTools: ['Buddha GPT', 'ALAN WATTS GPT', 'Quan Yin GPT'],
    relatedCategories: ['Spirituality & Philosophy', 'Buddhism']
  },

  // ===== QUANTUM & REALITY =====
  quantumReality: {
    triggers: ['quantum reality', 'quantum physics', 'quantum mechanics', 'quantum theory', 'quantum', 'qantum', 'quantam'],
    keywords: ['quantum', 'physics', 'reality', 'particle', 'wave', 'superposition', 'entanglement'],
    priorityTools: ['Albert Einstein GPT', 'Nikola Tesla GPT', 'ENTER THE MATRIX GPT (NEO👁️MATRIX GPT)', 'Probability GPT'],
    relatedCategories: ['Science & Research', 'Physics']
  },

  simulationTheory: {
    triggers: ['simulation theory', 'are we in a simulation', 'matrix reality', 'simulated reality', 'holographic universe'],
    keywords: ['simulation', 'matrix', 'holographic', 'reality', 'virtual', 'consciousness'],
    priorityTools: ['ENTER THE MATRIX GPT (NEO👁️MATRIX GPT)', '"IF AI RULED THE WORLD" - AI SIMULATION GPT', 'Oraculum – The Revealer of Hidden "Truths"'],
    relatedCategories: ['Spirituality & Philosophy', 'Simulation Theory']
  },

  matrixRedPill: {
    triggers: ['red pill', 'blue pill', 'matrix', 'wake up from matrix', 'neo matrix', 'follow the white rabbit'],
    keywords: ['matrix', 'red pill', 'neo', 'morpheus', 'wake up', 'simulation', 'rabbit'],
    priorityTools: ['ENTER THE MATRIX GPT (NEO👁️MATRIX GPT)', 'Oraculum – The Revealer of Hidden "Truths"'],
    relatedCategories: ['Spirituality & Philosophy', 'Awakening']
  },

  // ===== ASTROLOGY & COSMIC =====
  astrologyDeep: {
    triggers: ['astrology', 'astrology reading', 'birth chart', 'natal chart', 'zodiac signs', 'horoscope', 'astrological', 'astrolgy', 'astroloy'],
    keywords: ['astrology', 'zodiac', 'horoscope', 'birth chart', 'natal', 'planet', 'star sign', 'mercury retrograde'],
    priorityTools: ['Fortune Teller GPT', 'Probability GPT', 'Sophia Aeterna AI'],
    relatedCategories: ['Spirituality & Philosophy', 'Astrology']
  },

  cosmicConsciousness: {
    triggers: ['cosmic consciousness', 'cosmic awareness', 'universal mind', 'cosmic energy', 'cosmic truth'],
    keywords: ['cosmic', 'consciousness', 'universal', 'awareness', 'energy', 'vibration'],
    priorityTools: ['Sophia Aeterna AI', 'God Is Light GPT', 'ALAN WATTS GPT', 'Carl Sagan GPT'],
    relatedCategories: ['Spirituality & Philosophy', 'Consciousness']
  },

  // ===== SPIRITUAL AWAKENING =====
  spiritualAwakening: {
    triggers: ['spiritual awakening', 'awakening', 'awaken', 'wake up spiritually', 'kundalini', 'enlightenment', 'awakenning', 'awakining'],
    keywords: ['awakening', 'awaken', 'enlightenment', 'kundalini', 'spiritual', 'consciousness', 'ascension'],
    priorityTools: ['Sophia Aeterna AI', 'ALAN WATTS GPT', 'Buddha GPT', 'God Is Light GPT', '🕊️Mary Magdalene GPT'],
    relatedCategories: ['Spirituality & Philosophy', 'Awakening']
  },

  consciousnessExpansion: {
    triggers: ['expand consciousness', 'consciousness expansion', 'higher consciousness', 'altered states', 'transcendence', 'transcend'],
    keywords: ['consciousness', 'expand', 'higher', 'transcend', 'awareness', 'mind', 'enlighten'],
    priorityTools: ['ALAN WATTS GPT', 'Sophia Aeterna AI', 'Buddha GPT', 'Dream Interpreter GPT'],
    relatedCategories: ['Spirituality & Philosophy', 'Consciousness']
  },

  thirdeye: {
    triggers: ['third eye', 'pineal gland', 'open third eye', 'activate pineal', 'inner vision', 'thirdeye'],
    keywords: ['third eye', 'pineal', 'vision', 'intuition', 'psychic', 'activate'],
    priorityTools: ['Sophia Aeterna AI', 'Fortune Teller GPT', 'Dream Interpreter GPT'],
    relatedCategories: ['Spirituality & Philosophy', 'Mysticism']
  },

  // ===== MYSTICAL & ESOTERIC =====
  kabbalah: {
    triggers: ['kabbalah', 'kaballah', 'cabala', 'tree of life', 'sephirot', 'jewish mysticism', 'qabalah'],
    keywords: ['kabbalah', 'tree of life', 'sephirot', 'mysticism', 'jewish', 'esoteric'],
    priorityTools: ['Sophia Aeterna AI', 'God Is Light GPT', 'Intergalactic Ancient Archivist GPT'],
    relatedCategories: ['Spirituality & Philosophy', 'Mysticism']
  },

  gnosticism: {
    triggers: ['gnosticism', 'gnostic', 'gnosis', 'gnostic gospels', 'sophia gnostic', 'demiurge'],
    keywords: ['gnostic', 'gnosis', 'sophia', 'archon', 'demiurge', 'pleroma', 'divine spark'],
    priorityTools: ['Sophia Aeterna AI', '🕊️Mary Magdalene GPT', 'Manicheism GPT - Some Lost Knowledge of the Light'],
    relatedCategories: ['Spirituality & Philosophy', 'Gnosticism']
  },

  alchemy: {
    triggers: ['alchemy', 'alchemist', 'transmutation', 'philosophers stone', 'hermeticism', 'hermetic', 'alchamy'],
    keywords: ['alchemy', 'alchemist', 'transmutation', 'philosophers stone', 'hermetic', 'gold', 'elixir'],
    priorityTools: ['Alchemist Scientist GPT', 'Historical Apothecary GPT', 'Sophia Aeterna AI'],
    relatedCategories: ['Spirituality & Philosophy', 'Alchemy']
  },

  herbalMedicine: {
    triggers: ['herbal medicine', 'herbal remedies', 'herbalism', 'natural medicine', 'plant medicine', 'herbal healing'],
    keywords: ['herbal', 'herb', 'remedy', 'plant', 'natural', 'medicine', 'tincture', 'tea'],
    priorityTools: ['Historical Apothecary GPT', 'Fungus GPT – AI Mushroom Specialist'],
    relatedCategories: ['Health & Wellness', 'Herbalism']
  },

  // ===== MANIFESTATION & LAW OF ATTRACTION =====
  manifestation: {
    triggers: ['manifestation', 'manifest', 'law of attraction', 'attract abundance', 'manifesting', 'manifestation techniques'],
    keywords: ['manifest', 'manifestation', 'attraction', 'abundance', 'intention', 'visualize'],
    priorityTools: ['Fortune Teller GPT', 'Sophia Aeterna AI', 'Imagination Traveler GPT'],
    relatedCategories: ['Spirituality & Philosophy', 'Manifestation']
  },

  // ===== ANCIENT CIVILIZATIONS =====
  ancientEgypt: {
    triggers: ['ancient egypt', 'egyptian', 'pharaoh', 'pyramids', 'hieroglyphics', 'egypt mysteries', 'egyptain', 'maat', "ma'at", 'egyptian proverbs', 'egyptian wisdom', 'oracle of maat'],
    keywords: ['egypt', 'egyptian', 'pharaoh', 'pyramid', 'hieroglyphic', 'ancient', 'tomb', 'maat', 'proverbs', 'oracle'],
    priorityTools: ['Ancient Egyptian Proverbs GPT', 'Indiana Archeologist GPT', 'Intergalactic Ancient Archivist GPT', 'TALK TO HISTORY GPT'],
    relatedCategories: ['History', 'Ancient Civilizations', 'Spirituality Tools']
  },

  ancientGreece: {
    triggers: ['ancient greece', 'greek mythology', 'greek gods', 'olympus', 'greek philosophy', 'greeks'],
    keywords: ['greek', 'greece', 'mythology', 'zeus', 'olympus', 'athens', 'sparta', 'philosophy'],
    priorityTools: ['TALK TO THE GODS GPT', 'Socrates GPT', 'TALK TO HISTORY GPT'],
    relatedCategories: ['History', 'Ancient Greece']
  },

  ancientRome: {
    triggers: ['ancient rome', 'roman empire', 'romans', 'caesar', 'gladiator', 'roman history'],
    keywords: ['rome', 'roman', 'caesar', 'empire', 'gladiator', 'senator', 'legion'],
    priorityTools: ['Marcus Aurelius GPT', 'TALK TO HISTORY GPT', 'TIME MACHINE GPT'],
    relatedCategories: ['History', 'Ancient Rome']
  },

  mayaAztec: {
    triggers: ['maya', 'mayan', 'aztec', 'aztecs', 'inca', 'mesoamerican', 'ancient mexico'],
    keywords: ['maya', 'mayan', 'aztec', 'inca', 'mesoamerican', 'calendar', 'temple', 'sacrifice'],
    priorityTools: ['Indiana Archeologist GPT', 'TALK TO HISTORY GPT', 'Intergalactic Ancient Archivist GPT'],
    relatedCategories: ['History', 'Ancient Americas']
  },

  // ===== INVENTION & INNOVATION =====
  inventionIdeas: {
    triggers: ['invention ideas', 'invent something', 'innovative ideas', 'patent idea', 'inventor', 'create invention'],
    keywords: ['invention', 'invent', 'innovative', 'patent', 'creator', 'design', 'prototype'],
    priorityTools: ['Nikola Tesla GPT', 'Engineering GPT AI Suite', 'MicroSaaS GPT'],
    relatedCategories: ['Science & Research', 'Innovation']
  },

  // ===== PSYCHIC & INTUITION =====
  psychicAbilities: {
    triggers: ['psychic abilities', 'psychic powers', 'develop psychic', 'intuition', 'clairvoyance', 'psychic reading', 'psyhic', 'psycic'],
    keywords: ['psychic', 'intuition', 'clairvoyant', 'medium', 'extrasensory', 'esp', 'telepathy'],
    priorityTools: ['Fortune Teller GPT', 'Dream Interpreter GPT', 'Oraculum – The Revealer of Hidden "Truths"'],
    relatedCategories: ['Spirituality & Philosophy', 'Psychic']
  },

  // ===== NUMEROLOGY =====
  numerology: {
    triggers: ['numerology', 'number meaning', 'life path number', 'angel numbers', 'numerolgy', 'numeralogy'],
    keywords: ['numerology', 'number', 'life path', 'angel number', 'destiny', 'calculation'],
    priorityTools: ['Fortune Teller GPT', 'Probability GPT', 'Algebraic Expression Inventor GPT'],
    relatedCategories: ['Spirituality & Philosophy', 'Numerology']
  },

  // ===== SACRED GEOMETRY =====
  sacredGeometry: {
    triggers: ['sacred geometry', 'flower of life', 'metatrons cube', 'golden ratio', 'fibonacci', 'platonic solids', 'metatron'],
    keywords: ['sacred geometry', 'flower of life', 'golden ratio', 'fibonacci', 'pattern', 'divine proportion', 'metatron', 'akashic'],
    priorityTools: ['METATRON GPT', 'Sophia Aeterna AI', 'Algebraic Expression Inventor GPT', 'Alchemist Scientist GPT'],
    relatedCategories: ['Spirituality & Philosophy', 'Sacred Geometry']
  },

  // ===== CHANNELING & MEDIUMSHIP =====
  channeling: {
    triggers: ['channeling', 'channel spirits', 'mediumship', 'spirit communication', 'talk to dead', 'contact deceased'],
    keywords: ['channel', 'medium', 'spirit', 'deceased', 'afterlife', 'communication', 'seance'],
    priorityTools: ['Resurrection GPT', '🕊️Mary Magdalene GPT', 'TALK TO HISTORY GPT'],
    relatedCategories: ['Spirituality & Philosophy', 'Mediumship']
  },

  // ===== NEAR DEATH EXPERIENCES =====
  nearDeathExperience: {
    triggers: ['near death experience', 'nde', 'afterlife', 'life after death', 'what happens when we die', 'heaven'],
    keywords: ['near death', 'nde', 'afterlife', 'heaven', 'death', 'soul', 'spirit', 'light'],
    priorityTools: ['Resurrection GPT', 'God Is Light GPT', 'GOD IS LIGHT — Roman Catholic Edition GPT', 'Sophia Aeterna AI'],
    relatedCategories: ['Spirituality & Philosophy', 'Afterlife']
  },

  // ===== CATHOLIC & CHRISTIANITY =====
  catholicMysticism: {
    triggers: ['catholic', 'catholicism', 'roman catholic', 'catholic mysticism', 'catholic saints', 'catholic doctrine', 'catholic spirituality'],
    keywords: ['catholic', 'catholicism', 'roman catholic', 'saints', 'sacraments', 'mysticism', 'doctrine', 'mercy', 'interior transformation'],
    priorityTools: ['GOD IS LIGHT — Roman Catholic Edition GPT', 'God Is Light GPT', '🕊️Mary Magdalene GPT', 'Sophia Aeterna AI'],
    relatedCategories: ['Spirituality & Philosophy', 'Religion']
  },

  // ===== REINCARNATION =====
  reincarnation: {
    triggers: ['reincarnation', 'past lives', 'past life', 'rebirth', 'karma', 'soul journey', 'reincarnaton'],
    keywords: ['reincarnation', 'past life', 'rebirth', 'karma', 'soul', 'incarnation', 'cycle'],
    priorityTools: ['Resurrection GPT', 'Buddha GPT', 'Sophia Aeterna AI', 'TIME MACHINE GPT'],
    relatedCategories: ['Spirituality & Philosophy', 'Reincarnation']
  },

  // ===== CHAKRAS & ENERGY =====
  chakras: {
    triggers: ['chakras', 'chakra healing', 'energy centers', 'kundalini energy', 'chakra balancing', 'chacras', 'shakras'],
    keywords: ['chakra', 'energy', 'kundalini', 'healing', 'balance', 'root', 'crown', 'third eye'],
    priorityTools: ['Sophia Aeterna AI', 'Mental Wellness GPT', 'ALAN WATTS GPT'],
    relatedCategories: ['Spirituality & Philosophy', 'Energy Healing']
  },

  // ===== SOUND HEALING =====
  soundHealing: {
    triggers: ['sound healing', 'sound therapy', 'singing bowls', 'frequency healing', 'binaural beats', '432hz', '528hz'],
    keywords: ['sound', 'healing', 'frequency', 'binaural', 'singing bowl', 'hz', 'vibration'],
    priorityTools: ['Music Melodies & Lessons GPT', 'Mental Wellness GPT'],
    relatedCategories: ['Health & Wellness', 'Sound Healing']
  },

  // ===== ANCIENT TEXTS =====
  ancientTexts: {
    triggers: ['ancient texts', 'sacred texts', 'religious texts', 'dead sea scrolls', 'nag hammadi', 'vedas', 'upanishads'],
    keywords: ['ancient', 'sacred', 'text', 'scroll', 'manuscript', 'scripture', 'vedas'],
    priorityTools: ['Intergalactic Ancient Archivist GPT', 'Sophia Aeterna AI', '🕊️Mary Magdalene GPT', 'Interpretis 🕰️'],
    relatedCategories: ['Spirituality & Philosophy', 'Ancient Texts']
  },

  // ===== ETYMOLOGY & WORD ORIGINS =====
  wordOrigins: {
    triggers: ['word origin', 'etymology', 'word meaning', 'language origin', 'root word', 'etymolgy'],
    keywords: ['etymology', 'origin', 'word', 'language', 'root', 'meaning', 'linguistic'],
    priorityTools: ['Interpretis 🕰️', 'Intergalactic Ancient Archivist GPT'],
    relatedCategories: ['Education & Learning', 'Linguistics']
  },

  // ===== CROP CIRCLES & PHENOMENA =====
  cropCircles: {
    triggers: ['crop circles', 'crop circle', 'mysterious formations', 'alien signs', 'unexplained phenomena'],
    keywords: ['crop circle', 'formation', 'mysterious', 'alien', 'phenomena', 'unexplained'],
    priorityTools: ['Phenomenon Explorer AI Suite', 'Oraculum – The Revealer of Hidden "Truths"'],
    relatedCategories: ['Paranormal', 'Phenomena']
  },

  // ===== LOST CIVILIZATIONS =====
  lostCivilizations: {
    triggers: ['lost civilizations', 'atlantis', 'lemuria', 'mu', 'ancient advanced', 'lost city', 'atlanis'],
    keywords: ['atlantis', 'lemuria', 'lost', 'civilization', 'ancient', 'advanced', 'sunken'],
    priorityTools: ['Intergalactic Ancient Archivist GPT', 'Indiana Archeologist GPT', 'Oraculum – The Revealer of Hidden "Truths"'],
    relatedCategories: ['History', 'Lost Civilizations']
  },

  // ===== FREE WILL & DETERMINISM =====
  freeWill: {
    triggers: ['free will', 'determinism', 'do we have free will', 'choice', 'fate vs free will', 'predestination'],
    keywords: ['free will', 'determinism', 'choice', 'fate', 'destiny', 'predestination'],
    priorityTools: ['Probability GPT', 'Sophia Aeterna AI', 'ALAN WATTS GPT', 'Albert Einstein GPT'],
    relatedCategories: ['Spirituality & Philosophy', 'Philosophy']
  },

  // ===== NATURE OF REALITY =====
  natureOfReality: {
    triggers: ['nature of reality', 'what is reality', 'is reality real', 'existence', 'ontology', 'metaphysics'],
    keywords: ['reality', 'existence', 'metaphysics', 'ontology', 'being', 'consciousness'],
    priorityTools: ['ENTER THE MATRIX GPT (NEO👁️MATRIX GPT)', 'Albert Einstein GPT', 'ALAN WATTS GPT', 'Sophia Aeterna AI'],
    relatedCategories: ['Spirituality & Philosophy', 'Metaphysics']
  },

  // ==================== 60 NEW HANDLERS ====================

  // ===== LEARNING & EDUCATION =====
  learnSpanish: {
    triggers: ['learn spanish', 'spanish lessons', 'hablar español', 'speak spanish', 'spanish language', 'learn french', 'learn german', 'learn italian', 'learn japanese', 'learn chinese', 'language learning'],
    keywords: ['spanish', 'french', 'german', 'italian', 'japanese', 'chinese', 'language', 'learn', 'fluent', 'vocabulary'],
    priorityTools: ['LEARN ANY SKILL GPT', 'LEARN ANY COURSE GPT'],
    relatedCategories: ['Education & Learning', 'Language Learning']
  },

  chemistryHelp: {
    triggers: ['chemistry help', 'chemical reactions', 'molecules', 'periodic table', 'organic chemistry', 'chem help', 'chemisty'],
    keywords: ['chemistry', 'chemical', 'molecule', 'reaction', 'element', 'compound', 'organic', 'periodic'],
    priorityTools: ['Alchemist Scientist GPT', 'LEARN ANY COURSE GPT', 'COLLEGE DEGREE GPT'],
    relatedCategories: ['Science & Research', 'Chemistry']
  },

  biologyHelp: {
    triggers: ['biology help', 'cell biology', 'genetics', 'dna', 'evolution', 'microbiology', 'bio help', 'biologoy'],
    keywords: ['biology', 'cell', 'genetics', 'dna', 'evolution', 'organism', 'microbe', 'gene'],
    priorityTools: ['Genome GPT', 'LEARN ANY COURSE GPT', 'COLLEGE DEGREE GPT'],
    relatedCategories: ['Science & Research', 'Biology']
  },

  studyTips: {
    triggers: ['study tips', 'how to study', 'study techniques', 'memorization', 'test prep', 'exam prep', 'study hacks', 'study help'],
    keywords: ['study', 'memorize', 'exam', 'test', 'learn', 'review', 'technique', 'retention'],
    priorityTools: ['LEARN ANY COURSE GPT', 'LEARN ANY SKILL GPT', 'Quiz Maker Ai'],
    relatedCategories: ['Education & Learning', 'Study Skills']
  },

  collegeApplications: {
    triggers: ['college applications', 'college admissions', 'apply to college', 'university application', 'college essay', 'scholarship application'],
    keywords: ['college', 'university', 'admission', 'application', 'essay', 'scholarship', 'acceptance'],
    priorityTools: ['COLLEGE DEGREE GPT', 'Grant Writer GPT'],
    relatedCategories: ['Education & Learning', 'College Admissions']
  },

  // ===== MENTAL HEALTH & WELLNESS =====
  anxietyHelp: {
    triggers: ['anxiety help', 'anxiety relief', 'panic attack', 'anxious', 'worry', 'social anxiety', 'calm anxiety', 'anxeity', 'anixety'],
    keywords: ['anxiety', 'panic', 'worry', 'nervous', 'calm', 'relief', 'anxious', 'fear'],
    priorityTools: ['Mental Wellness GPT', 'ALAN WATTS GPT'],
    relatedCategories: ['Health & Wellness', 'Mental Health']
  },

  depressionHelp: {
    triggers: ['depression help', 'feeling depressed', 'sad all the time', 'mental health help', 'feeling down', 'depresion', 'deppression'],
    keywords: ['depression', 'depressed', 'sad', 'hopeless', 'mental health', 'mood', 'therapy'],
    priorityTools: ['Mental Wellness GPT', 'ALAN WATTS GPT'],
    relatedCategories: ['Health & Wellness', 'Mental Health']
  },

  stressRelief: {
    triggers: ['stress relief', 'reduce stress', 'stress management', 'destress', 'overwhelmed', 'burnout', 'relax'],
    keywords: ['stress', 'relief', 'relax', 'calm', 'overwhelm', 'burnout', 'tension'],
    priorityTools: ['Mental Wellness GPT', 'ALAN WATTS GPT', 'Dream Interpreter GPT'],
    relatedCategories: ['Health & Wellness', 'Stress Management']
  },

  sleepHelp: {
    triggers: ['sleep help', 'insomnia', 'cant sleep', 'sleep better', 'sleep problems', 'trouble sleeping', 'fall asleep', 'insomina'],
    keywords: ['sleep', 'insomnia', 'rest', 'tired', 'bedtime', 'dream', 'night'],
    priorityTools: ['Dream Interpreter GPT', 'Mental Wellness GPT'],
    relatedCategories: ['Health & Wellness', 'Sleep']
  },

  addictionHelp: {
    triggers: ['addiction help', 'addiction recovery', 'sobriety', 'quit drinking', 'quit smoking', 'substance abuse', 'recovery help'],
    keywords: ['addiction', 'recovery', 'sober', 'sobriety', 'quit', 'substance', 'rehab'],
    priorityTools: ['Mental Wellness GPT'],
    relatedCategories: ['Health & Wellness', 'Addiction Recovery']
  },

  // ===== FITNESS & NUTRITION =====
  weightLoss: {
    triggers: ['weight loss', 'lose weight', 'diet plan', 'burn fat', 'weight loss tips', 'how to lose weight', 'calorie deficit', 'weightloss'],
    keywords: ['weight', 'loss', 'diet', 'fat', 'calorie', 'slim', 'burn', 'pounds'],
    priorityTools: ['Chef "Sizzle" AI Culinary Assistant', 'Personalized DR. GPT (Doctor GPT)'],
    relatedCategories: ['Health & Wellness', 'Fitness']
  },

  muscleBuilding: {
    triggers: ['muscle building', 'build muscle', 'bodybuilding', 'gym workout', 'strength training', 'bulk up', 'gain muscle', 'weightlifting'],
    keywords: ['muscle', 'gym', 'workout', 'strength', 'bodybuilding', 'lift', 'protein', 'bulk'],
    priorityTools: ['LEARN ANY SKILL GPT', 'Personalized DR. GPT (Doctor GPT)'],
    relatedCategories: ['Health & Wellness', 'Fitness']
  },

  yogaPractice: {
    triggers: ['yoga practice', 'yoga poses', 'yoga for beginners', 'yoga routine', 'yoga stretches', 'learn yoga', 'yogi'],
    keywords: ['yoga', 'pose', 'stretch', 'flexibility', 'asana', 'namaste', 'meditation'],
    priorityTools: ['LEARN ANY SKILL GPT', 'Mental Wellness GPT', 'ALAN WATTS GPT'],
    relatedCategories: ['Health & Wellness', 'Yoga']
  },

  runningHelp: {
    triggers: ['running help', 'how to run', 'marathon training', 'jogging tips', 'run faster', 'running plan', 'couch to 5k'],
    keywords: ['running', 'run', 'marathon', 'jog', 'sprint', 'cardio', 'race', '5k'],
    priorityTools: ['LEARN ANY SKILL GPT'],
    relatedCategories: ['Health & Wellness', 'Running']
  },

  nutritionAdvice: {
    triggers: ['nutrition advice', 'healthy eating', 'macros', 'vitamins', 'supplements', 'meal plan', 'nutritionist', 'nutriton'],
    keywords: ['nutrition', 'diet', 'vitamin', 'supplement', 'macro', 'protein', 'healthy', 'meal'],
    priorityTools: ['Chef "Sizzle" AI Culinary Assistant', 'Personalized DR. GPT (Doctor GPT)', 'Food Quality Inspector GPT'],
    relatedCategories: ['Health & Wellness', 'Nutrition']
  },

  // ===== HOBBIES & CRAFTS =====
  gardeningHelp: {
    triggers: ['gardening help', 'grow plants', 'garden tips', 'vegetable garden', 'flower garden', 'plant care', 'gardning', 'gardeing'],
    keywords: ['garden', 'plant', 'grow', 'seed', 'flower', 'vegetable', 'soil', 'water'],
    priorityTools: ['Agronomus AI Farming Expert', 'Self Sufficiency GPT'],
    relatedCategories: ['Home & DIY', 'Gardening']
  },

  photographyTips: {
    triggers: ['photography tips', 'camera settings', 'photo tips', 'how to photograph', 'photography help', 'take better photos', 'photograpy'],
    keywords: ['photography', 'camera', 'photo', 'lens', 'exposure', 'shot', 'lighting', 'aperture'],
    priorityTools: ['Graphic & Cover Design GPT', 'LEARN ANY SKILL GPT'],
    relatedCategories: ['Image & Design', 'Photography']
  },

  woodworkingHelp: {
    triggers: ['woodworking help', 'woodworking projects', 'carpentry', 'build furniture', 'wood projects', 'woodwork'],
    keywords: ['woodworking', 'wood', 'carpentry', 'furniture', 'saw', 'build', 'craft'],
    priorityTools: ['Home Renovator GPT 🏡🔧', 'LEARN ANY SKILL GPT'],
    relatedCategories: ['Home & DIY', 'Woodworking']
  },

  sewingKnitting: {
    triggers: ['sewing help', 'knitting help', 'crochet', 'how to sew', 'how to knit', 'sewing patterns', 'knitting patterns'],
    keywords: ['sewing', 'knit', 'knitting', 'crochet', 'pattern', 'fabric', 'yarn', 'stitch'],
    priorityTools: ['LEARN ANY SKILL GPT', 'RESTYLE ME GPT'],
    relatedCategories: ['Crafts', 'Sewing']
  },

  paintingArt: {
    triggers: ['painting help', 'how to paint', 'art painting', 'canvas painting', 'watercolor', 'acrylic painting', 'oil painting'],
    keywords: ['painting', 'paint', 'canvas', 'brush', 'watercolor', 'acrylic', 'oil', 'art'],
    priorityTools: ['Graphic & Cover Design GPT', 'LEARN ANY SKILL GPT'],
    relatedCategories: ['Image & Design', 'Art']
  },

  // ===== MUSIC & INSTRUMENTS =====
  learnGuitar: {
    triggers: ['learn guitar', 'guitar lessons', 'guitar chords', 'play guitar', 'guitar tabs', 'guitar tutorial', 'gutar', 'guitrar'],
    keywords: ['guitar', 'chord', 'tab', 'strum', 'fret', 'acoustic', 'electric', 'riff'],
    priorityTools: ['Music Melodies & Lessons GPT', 'LEARN ANY SKILL GPT'],
    relatedCategories: ['Music & Audio', 'Music Lessons']
  },

  learnPiano: {
    triggers: ['learn piano', 'piano lessons', 'play piano', 'keyboard lessons', 'piano tutorial', 'piano keys', 'pianio'],
    keywords: ['piano', 'keyboard', 'key', 'scale', 'chord', 'classical', 'play'],
    priorityTools: ['Music Melodies & Lessons GPT', 'LEARN ANY SKILL GPT'],
    relatedCategories: ['Music & Audio', 'Music Lessons']
  },

  songwritingHelp: {
    triggers: ['songwriting', 'write a song', 'song lyrics', 'compose music', 'how to write songs', 'lyric writing'],
    keywords: ['songwriting', 'song', 'lyrics', 'compose', 'melody', 'verse', 'chorus', 'hook'],
    priorityTools: ['Music Melodies & Lessons GPT', 'BOOK WRITER GPT'],
    relatedCategories: ['Music & Audio', 'Songwriting']
  },

  // ===== SPORTS =====
  golfTips: {
    triggers: ['golf tips', 'golf swing', 'how to golf', 'golf help', 'improve golf', 'golf handicap', 'golfing'],
    keywords: ['golf', 'swing', 'handicap', 'putt', 'drive', 'club', 'course', 'tee'],
    priorityTools: ['LEARN ANY SKILL GPT'],
    relatedCategories: ['Sports', 'Golf']
  },

  tennisTips: {
    triggers: ['tennis tips', 'tennis serve', 'how to play tennis', 'tennis help', 'improve tennis', 'tennis lessons'],
    keywords: ['tennis', 'serve', 'racket', 'court', 'volley', 'forehand', 'backhand'],
    priorityTools: ['LEARN ANY SKILL GPT'],
    relatedCategories: ['Sports', 'Tennis']
  },

  basketballTips: {
    triggers: ['basketball tips', 'basketball shooting', 'how to play basketball', 'basketball drills', 'improve basketball', 'dribbling'],
    keywords: ['basketball', 'shoot', 'dribble', 'hoop', 'court', 'nba', 'layup', 'dunk'],
    priorityTools: ['LEARN ANY SKILL GPT'],
    relatedCategories: ['Sports', 'Basketball']
  },

  // ===== RELATIONSHIPS & LIFE =====
  datingAdvice: {
    triggers: ['dating advice', 'dating tips', 'find love', 'dating help', 'how to date', 'online dating', 'relationship advice', 'dateing'],
    keywords: ['dating', 'date', 'love', 'relationship', 'romance', 'partner', 'match'],
    priorityTools: ['Marriage Mender GPT', 'Mental Wellness GPT'],
    relatedCategories: ['Relationships', 'Dating']
  },

  parentingHelp: {
    triggers: ['parenting help', 'parenting tips', 'raise kids', 'child development', 'parenting advice', 'new parent', 'parentng'],
    keywords: ['parenting', 'parent', 'child', 'kid', 'baby', 'raise', 'family', 'discipline'],
    priorityTools: ['Home-Schooling Assistant GPT', 'Mental Wellness GPT'],
    relatedCategories: ['Family', 'Parenting']
  },

  weddingPlanning: {
    triggers: ['wedding planning', 'plan wedding', 'wedding help', 'getting married', 'wedding ideas', 'bridal'],
    keywords: ['wedding', 'bride', 'groom', 'ceremony', 'reception', 'marriage', 'engagement'],
    priorityTools: ['Travel Advisor GPT', 'LEARN ANY SKILL GPT'],
    relatedCategories: ['Events', 'Wedding']
  },

  divorceHelp: {
    triggers: ['divorce help', 'getting divorced', 'divorce advice', 'divorce process', 'separation', 'divorc'],
    keywords: ['divorce', 'separation', 'custody', 'alimony', 'lawyer', 'split', 'marriage'],
    priorityTools: ['Public Defender GPT', 'Legal Draftsmith GPT', 'Mental Wellness GPT'],
    relatedCategories: ['Legal & Government', 'Family Law']
  },

  griefSupport: {
    triggers: ['grief support', 'dealing with loss', 'grief help', 'grieving', 'lost loved one', 'mourning', 'bereavement'],
    keywords: ['grief', 'loss', 'mourning', 'death', 'bereavement', 'sadness', 'heal'],
    priorityTools: ['Mental Wellness GPT', 'Resurrection GPT', 'ALAN WATTS GPT'],
    relatedCategories: ['Health & Wellness', 'Grief Support']
  },

  // ===== HOME & DIY =====
  plumbingHelp: {
    triggers: ['plumbing help', 'fix plumbing', 'plumber', 'leaky pipe', 'clogged drain', 'toilet repair', 'plumbing problem', 'plumbing issues'],
    keywords: ['plumbing', 'pipe', 'leak', 'drain', 'toilet', 'faucet', 'water', 'repair'],
    priorityTools: ['Home Renovator GPT 🏡🔧'],
    relatedCategories: ['Home & DIY', 'Plumbing']
  },

  electricalHelp: {
    triggers: ['electrical help', 'electrical wiring', 'electrician', 'fix electrical', 'electrical problem', 'wiring help', 'eletrical'],
    keywords: ['electrical', 'wiring', 'circuit', 'outlet', 'switch', 'breaker', 'voltage', 'wire'],
    priorityTools: ['Home Renovator GPT 🏡🔧', 'Engineering GPT AI Suite'],
    relatedCategories: ['Home & DIY', 'Electrical']
  },

  cleaningTips: {
    triggers: ['cleaning tips', 'how to clean', 'house cleaning', 'organizing', 'declutter', 'cleaning hacks', 'home cleaning'],
    keywords: ['cleaning', 'clean', 'organize', 'declutter', 'tidy', 'spotless', 'house'],
    priorityTools: ['Home Renovator GPT 🏡🔧', 'LEARN ANY SKILL GPT'],
    relatedCategories: ['Home & DIY', 'Cleaning']
  },

  // ===== ANIMALS & PETS =====
  horseHelp: {
    triggers: ['horse help', 'horse care', 'equestrian', 'horseback riding', 'horse training', 'horses'],
    keywords: ['horse', 'equestrian', 'riding', 'stable', 'saddle', 'mare', 'stallion', 'foal'],
    priorityTools: ['Veterinarian GPT', 'LEARN ANY SKILL GPT'],
    relatedCategories: ['Pet Care', 'Equestrian']
  },

  birdCare: {
    triggers: ['bird care', 'pet bird', 'parrot care', 'bird help', 'aviary', 'bird keeping'],
    keywords: ['bird', 'parrot', 'aviary', 'feather', 'cage', 'beak', 'cockatiel', 'budgie'],
    priorityTools: ['Veterinarian GPT'],
    relatedCategories: ['Pet Care', 'Birds']
  },

  aquariumHelp: {
    triggers: ['aquarium help', 'fish tank', 'fish care', 'reef tank', 'aquarium setup', 'tropical fish', 'aquaruim'],
    keywords: ['aquarium', 'fish', 'tank', 'reef', 'tropical', 'saltwater', 'freshwater', 'filter'],
    priorityTools: ['Veterinarian GPT', 'Fisherman GPT🎣😊'],
    relatedCategories: ['Pet Care', 'Aquariums']
  },

  // ===== BUSINESS & MARKETING =====
  ecommerceHelp: {
    triggers: ['ecommerce help', 'online store', 'shopify help', 'sell online', 'ecommerce business', 'online shop', 'e-commerce'],
    keywords: ['ecommerce', 'store', 'shopify', 'sell', 'product', 'online', 'shop', 'cart'],
    priorityTools: ['MicroSaaS GPT', 'Business Plan Generator GPT'],
    relatedCategories: ['Business & Productivity', 'E-commerce']
  },

  dropshippingHelp: {
    triggers: ['dropshipping', 'dropship', 'dropshipping business', 'how to dropship', 'dropshipping help', 'drop shipping'],
    keywords: ['dropshipping', 'dropship', 'supplier', 'fulfillment', 'aliexpress', 'shipping', 'inventory'],
    priorityTools: ['MicroSaaS GPT', 'Business Plan Generator GPT'],
    relatedCategories: ['Business & Productivity', 'Dropshipping']
  },

  affiliateMarketing: {
    triggers: ['affiliate marketing', 'affiliate program', 'earn commissions', 'affiliate links', 'affiliate income', 'affilate'],
    keywords: ['affiliate', 'commission', 'referral', 'link', 'program', 'partner', 'earn'],
    priorityTools: ['MicroSaaS GPT', 'Business Plan Generator GPT'],
    relatedCategories: ['Marketing Tools', 'Affiliate Marketing']
  },

  emailMarketing: {
    triggers: ['email marketing', 'email campaign', 'newsletter', 'email list', 'email automation', 'email strategy'],
    keywords: ['email', 'newsletter', 'campaign', 'subscriber', 'list', 'automation', 'open rate'],
    priorityTools: ['Business Plan Generator GPT', 'MULTITASKER GPT'],
    relatedCategories: ['Marketing Tools', 'Email Marketing']
  },

  brandingHelp: {
    triggers: ['branding help', 'brand identity', 'brand strategy', 'build a brand', 'branding tips', 'brand design'],
    keywords: ['branding', 'brand', 'identity', 'logo', 'positioning', 'image', 'voice'],
    priorityTools: ['Graphic & Cover Design GPT', 'Business Plan Generator GPT'],
    relatedCategories: ['Marketing Tools', 'Branding']
  },

  customerServiceHelp: {
    triggers: ['customer service', 'customer support', 'help desk', 'customer experience', 'support help', 'customer care'],
    keywords: ['customer', 'service', 'support', 'help', 'satisfaction', 'experience', 'ticket'],
    priorityTools: ['Training Manual Generator GPT', 'Business Plan Generator GPT'],
    relatedCategories: ['Business & Productivity', 'Customer Service']
  },

  // ===== PRODUCTIVITY =====
  timeManagement: {
    triggers: ['time management', 'manage time', 'productivity tips', 'time saving', 'schedule help', 'time blocking'],
    keywords: ['time', 'management', 'productivity', 'schedule', 'efficient', 'organize', 'calendar'],
    priorityTools: ['MULTITASKER GPT', 'LEARN ANY SKILL GPT'],
    relatedCategories: ['Productivity & Utilities', 'Time Management']
  },

  projectManagement: {
    triggers: ['project management', 'manage projects', 'project planning', 'project help', 'task management', 'project manager'],
    keywords: ['project', 'management', 'task', 'deadline', 'milestone', 'team', 'planning'],
    priorityTools: ['MULTITASKER GPT', 'Business Plan Generator GPT'],
    relatedCategories: ['Productivity & Utilities', 'Project Management']
  },

  noteTaking: {
    triggers: ['note taking', 'take notes', 'note app', 'notes help', 'organize notes', 'note system'],
    keywords: ['note', 'notes', 'taking', 'organize', 'journal', 'write', 'capture'],
    priorityTools: ['MULTITASKER GPT', 'Clarity Omni GPT'],
    relatedCategories: ['Productivity & Utilities', 'Note Taking']
  },

  decisionMaking: {
    triggers: ['decision making', 'make decision', 'help decide', 'decision help', 'should i', 'pros and cons', 'how to decide'],
    keywords: ['decision', 'decide', 'choice', 'option', 'pros', 'cons', 'analyze'],
    priorityTools: ['Probability GPT', 'MULTITASKER GPT', 'Clarity Omni GPT'],
    relatedCategories: ['Productivity & Utilities', 'Decision Making']
  },

  // ===== LEGAL & DOCUMENTS =====
  willEstate: {
    triggers: ['will estate', 'write a will', 'estate planning', 'inheritance', 'last will', 'living will', 'trust fund'],
    keywords: ['will', 'estate', 'inheritance', 'trust', 'beneficiary', 'executor', 'probate'],
    priorityTools: ['Legal Draftsmith GPT', 'Contract Review Bot'],
    relatedCategories: ['Legal & Government', 'Estate Planning']
  },

  immigrationHelp: {
    triggers: ['immigration help', 'visa help', 'citizenship', 'green card', 'immigration lawyer', 'work visa', 'immigraton'],
    keywords: ['immigration', 'visa', 'citizenship', 'green card', 'passport', 'status', 'asylum'],
    priorityTools: ['Public Defender GPT', 'Legal Draftsmith GPT'],
    relatedCategories: ['Legal & Government', 'Immigration']
  },

  tenantRights: {
    triggers: ['tenant rights', 'renter rights', 'landlord issues', 'lease help', 'eviction help', 'rental agreement'],
    keywords: ['tenant', 'landlord', 'lease', 'rent', 'eviction', 'rental', 'housing'],
    priorityTools: ['Public Defender GPT', 'Legal Draftsmith GPT'],
    relatedCategories: ['Legal & Government', 'Tenant Rights']
  },

  consumerRights: {
    triggers: ['consumer rights', 'consumer protection', 'get refund', 'scammed', 'fraud help', 'consumer complaint'],
    keywords: ['consumer', 'rights', 'refund', 'scam', 'fraud', 'complaint', 'protection'],
    priorityTools: ['Public Defender GPT', 'FACT CHECKER GPT'],
    relatedCategories: ['Legal & Government', 'Consumer Rights']
  },

  // ===== HISTORY PERIODS =====
  worldWarHistory: {
    triggers: ['world war', 'ww1', 'ww2', 'wwi', 'wwii', 'world war 1', 'world war 2', 'world war history', 'second world war'],
    keywords: ['world war', 'ww1', 'ww2', 'nazi', 'allies', 'axis', 'hitler', 'military', 'battle'],
    priorityTools: ['TALK TO HISTORY GPT', 'TIME MACHINE GPT', 'Historical Headlines GPT'],
    relatedCategories: ['History', 'World Wars']
  },

  civilWarHistory: {
    triggers: ['civil war', 'american civil war', 'confederate', 'union army', 'lincoln', 'civil war history'],
    keywords: ['civil war', 'confederate', 'union', 'lincoln', 'slavery', 'battle', 'gettysburg'],
    priorityTools: ['TALK TO HISTORY GPT', 'TIME MACHINE GPT', 'Historical Headlines GPT'],
    relatedCategories: ['History', 'American History']
  },

  renaissanceHistory: {
    triggers: ['renaissance', 'medieval history', 'middle ages', 'renaissance art', 'dark ages', 'medival'],
    keywords: ['renaissance', 'medieval', 'middle ages', 'art', 'europe', 'davinci', 'michelangelo'],
    priorityTools: ['TALK TO HISTORY GPT', 'TIME MACHINE GPT', 'Artwork & Vintage Appraisal GPT'],
    relatedCategories: ['History', 'Renaissance']
  },

  coldWarHistory: {
    triggers: ['cold war', 'soviet union', 'ussr', 'nuclear arms', 'iron curtain', 'cold war history'],
    keywords: ['cold war', 'soviet', 'ussr', 'nuclear', 'communist', 'capitalism', 'berlin wall'],
    priorityTools: ['TALK TO HISTORY GPT', 'TIME MACHINE GPT', 'Historical Headlines GPT'],
    relatedCategories: ['History', 'Cold War']
  },

  // ===== WEATHER & ENVIRONMENT =====
  climateChange: {
    triggers: ['climate change', 'global warming', 'environment', 'carbon footprint', 'sustainability', 'climate crisis', 'climat change'],
    keywords: ['climate', 'warming', 'carbon', 'environment', 'sustainable', 'emissions', 'greenhouse'],
    priorityTools: ['Sustainable Futures GPT', 'Data Research Analysis Report GPT'],
    relatedCategories: ['Science & Research', 'Environment']
  },

  weatherPrediction: {
    triggers: ['weather prediction', 'weather forecast', 'meteorology', 'weather help', 'whats the weather', 'storm forecast'],
    keywords: ['weather', 'forecast', 'meteorology', 'storm', 'rain', 'temperature', 'climate'],
    priorityTools: ['Probability GPT', 'Illuminous World Data Explorer GPT'],
    relatedCategories: ['Science & Research', 'Weather']
  },

  // ===== COMMUNICATION =====
  publicSpeaking: {
    triggers: ['public speaking', 'presentation tips', 'speech help', 'how to present', 'speech writing', 'overcome fear of speaking'],
    keywords: ['public speaking', 'speech', 'presentation', 'audience', 'stage', 'confidence', 'speak'],
    priorityTools: ['PPTx Powerpoint Maker GPT', 'LEARN ANY SKILL GPT'],
    relatedCategories: ['Communication', 'Public Speaking']
  },

  negotiationSkills: {
    triggers: ['negotiation skills', 'how to negotiate', 'negotiation tips', 'bargaining', 'deal making', 'salary negotiation'],
    keywords: ['negotiation', 'negotiate', 'bargain', 'deal', 'agreement', 'compromise', 'salary'],
    priorityTools: ['LEARN ANY SKILL GPT', 'Business Plan Generator GPT'],
    relatedCategories: ['Business & Productivity', 'Negotiation']
  },

  // ===== AIWEBTOOLS CUSTOM GPT BRAND/NAME RECOGNITION =====
  automobileGpt: {
    triggers: ['auto', 'autom', 'automo', 'automob', 'automobi', 'automobil', 'automobile', 'automobile gpt', 'car gpt', 'car ai', 'vehicle gpt', 'auto gpt'],
    keywords: ['automobile', 'car', 'vehicle', 'auto', 'dealership', 'repair'],
    priorityTools: ['AUTOMOBILE GPT'],
    relatedCategories: ['Automotive']
  },
  collegeDegreeGpt: {
    triggers: ['college', 'colleg', 'college d', 'college de', 'college deg', 'college degree', 'college degree gpt', 'free college', 'free degree', 'university gpt', 'degree gpt'],
    keywords: ['college', 'degree', 'university', 'class', 'course'],
    priorityTools: ['COLLEGE DEGREE GPT', 'LEARN ANY COURSE GPT', 'LEARN ANY SKILL GPT'],
    relatedCategories: ['Education & Learning']
  },
  movieMakerStudio: {
    triggers: ['movie', 'movi', 'movie m', 'movie ma', 'movie mak', 'movie make', 'movie maker', 'movie maker studio', 'film maker', 'filmmaker', 'film studio', 'ai movie', 'ai film', 'make a movie', 'make movie', 'film production'],
    keywords: ['movie', 'film', 'cinema', 'studio', 'maker', 'production'],
    priorityTools: ['Movie Maker Studio AI SUITE', 'Movie Script Writer GPT', 'Movie Scene Maker GPT'],
    relatedCategories: ['Video & Multimedia']
  },
  movieScriptWriter: {
    triggers: ['movie script', 'movie scrip', 'script writer', 'screenplay', 'screen play', 'movie script writer', 'film script', 'screenplay writer'],
    keywords: ['script', 'screenplay', 'movie', 'film', 'writer'],
    priorityTools: ['Movie Script Writer GPT', 'Movie Scene Maker GPT', '🎭 Playwriter GPT'],
    relatedCategories: ['Writing & Content']
  },
  survivalistGpt: {
    triggers: ['survival', 'surviv', 'survivalist', 'survivalist gpt', 'survival gpt', 'wilderness survival', 'doomsday prep', 'prepper', 'bushcraft'],
    keywords: ['survival', 'survivalist', 'wilderness', 'prepper', 'outdoor'],
    priorityTools: ['Survivalist GPT', 'Firefighter GPT', 'Firearms Safety Instructor GPT'],
    relatedCategories: ['Health & Wellness', 'Education & Learning']
  },
  stageMaster: {
    triggers: ['stage', 'stagem', 'stage master', 'stagemaster', 'stagemaster ai', 'theater ai', 'theatre ai', 'performing arts', 'broadway gpt'],
    keywords: ['stage', 'theater', 'theatre', 'performing arts', 'broadway'],
    priorityTools: ['STAGEMASTER AI SUITE FOR THE Preforming Arts', '🎭 Playwriter GPT'],
    relatedCategories: ['Creative & Media']
  },
  immortalizeMe: {
    triggers: ['immortal', 'immortalize', 'immortalize me', 'immortalizeme', 'digital clone', 'voice legacy', 'preserve voice', 'digital legacy'],
    keywords: ['immortal', 'clone', 'legacy', 'digital twin', 'voice clone'],
    priorityTools: ['ImmortalizeME'],
    relatedCategories: ['AI & Development']
  },
  illuminousExplorer: {
    triggers: ['illuminous', 'illumi', 'illumin', 'world data', 'data explorer', 'predictions gpt', 'predict the future'],
    keywords: ['illuminous', 'predictions', 'data', 'global', 'forecast'],
    priorityTools: ['Illuminous World Data Explorer GPT', 'Fortune Teller GPT', 'Probability GPT'],
    relatedCategories: ['Science & Research']
  },
  godmodeGpt: {
    triggers: ['godmode', 'god mode', 'g mode', 'g-mode', 'gmode', 'godmode gpt', 'g-mode gpt', 'ultimate gpt', 'all in one gpt'],
    keywords: ['godmode', 'g-mode', 'ultimate', 'omni', 'all-in-one'],
    priorityTools: ['GODMODE GPT', 'MULTITASKER GPT', 'Clarity Omni GPT'],
    relatedCategories: ['AI & Development']
  },
  musicVideoMaker: {
    triggers: ['music video', 'music vid', 'music video maker', 'music video studio', 'mv maker', 'music production'],
    keywords: ['music video', 'mv', 'music', 'video', 'production'],
    priorityTools: ['Music Video Maker AI Studio', 'Music Melodies & Lessons GPT'],
    relatedCategories: ['Video & Multimedia', 'Creative & Media']
  },
  bookWriterGpt: {
    triggers: ['book', 'book w', 'book wr', 'book wri', 'book writer', 'book writer gpt', 'novel writer', 'write a book', 'author gpt', 'novelist'],
    keywords: ['book', 'novel', 'writer', 'author', 'chapter'],
    priorityTools: ['BOOK WRITER GPT', "Children's Picture Book Maker GPT", 'Coloring Book Generator GPT'],
    relatedCategories: ['Writing & Content']
  },
  talkToHistory: {
    triggers: ['talk to history', 'talk history', 'historical figures', 'chat with history', 'history chat', 'historical conversation'],
    keywords: ['history', 'historical', 'figures', 'past', 'leaders'],
    priorityTools: ['TALK TO HISTORY GPT', 'TIME MACHINE GPT', 'Historical Headlines GPT'],
    relatedCategories: ['Education & Learning']
  },
  stellarisSpace: {
    triggers: ['stellaris', 'space explorer', 'space ai', 'space gpt', 'astronomy gpt', 'exoplanet', 'astrogation'],
    keywords: ['space', 'stellaris', 'astronomy', 'exoplanet', 'cosmos'],
    priorityTools: ['Stellaris: 🚀AI Space Explorer'],
    relatedCategories: ['Science & Research']
  },
  criminologistGpt: {
    triggers: ['criminologist', 'criminology', 'crime gpt', 'detective gpt', 'forensic gpt', 'criminal investigation'],
    keywords: ['criminology', 'crime', 'detective', 'forensic', 'investigation'],
    priorityTools: ['Criminologist GPT', 'Public Defender GPT'],
    relatedCategories: ['Legal & Government']
  },
  resurrectionGpt: {
    triggers: ['resurrection', 'resurrect', 'ressurect', 'resurect', 'reborn', 'digital resurrection', 'talk to deceased', 'talk to dead', 'talk to the dead', 'memorial gpt', 'grief chat', 'historical figure', 'talk to famous', 'dead philosopher', 'past voices'],
    keywords: ['digital resurrection', 'resurrection', 'memorial', 'grief', 'deceased'],
    priorityTools: ['Resurrection GPT', 'GPTPastVoices - Resurrection GPT', 'Titanic Resurrections GPT', 'TALK TO HISTORY GPT', 'ImmortalizeME'],
    relatedCategories: ['Health & Wellness']
  },
  perfectPromptEngine: {
    triggers: ['perfect prompt', 'prompt engine', 'prompt engineer', 'prompt optimizer', 'best prompt', 'prompt builder', 'prompt perfect'],
    keywords: ['prompt', 'engineer', 'optimize', 'engine'],
    priorityTools: ['PERFECT PROMPT ENGINE', 'Sora Prompt Assistant', 'Luma Dream Machine Prompt Assistant'],
    relatedCategories: ['AI & Development']
  },
  travelAdvisor: {
    triggers: ['travel advisor', 'travel agent', 'travel planner', 'vacation planner', 'trip planner', 'travel gpt'],
    keywords: ['travel', 'vacation', 'trip', 'advisor', 'agent'],
    priorityTools: ['Travel Advisor GPT'],
    relatedCategories: ['Travel']
  },
  clarityOmni: {
    triggers: ['clarity', 'clarity omni', 'omni gpt', 'rewrite ai', 'text rewriter', 'paraphraser gpt'],
    keywords: ['clarity', 'omni', 'rewrite', 'paraphrase'],
    priorityTools: ['Clarity Omni GPT', 'Article and Blog Rewriter GPT'],
    relatedCategories: ['Writing & Content']
  },
  engineeringGpt: {
    triggers: ['engineering', 'engineer', 'engineering gpt', 'mechanical engineer', 'electrical engineer', 'civil engineer', 'software engineer ai'],
    keywords: ['engineering', 'engineer', 'mechanical', 'electrical', 'civil'],
    priorityTools: ['Engineering GPT AI Suite', 'Solar Land Assessor GPT'],
    relatedCategories: ['Science & Research', 'AI & Development']
  },
  talkToGodsGpt: {
    triggers: ['talk to gods', 'talk to god', 'gods gpt', 'deities gpt', 'religion chat', 'mythology gpt'],
    keywords: ['gods', 'deities', 'religion', 'mythology'],
    priorityTools: ['TALK TO THE GODS GPT', '🕊️Mary Magdalene GPT', 'ALAN WATTS GPT', 'Sophia Aeterna AI'],
    relatedCategories: ['Spiritual & Philosophy']
  },
  phenomenonExplorer: {
    triggers: ['phenomenon', 'paranormal', 'ufo gpt', 'cryptid', 'ghost hunting', 'supernatural', 'unexplained'],
    keywords: ['phenomenon', 'paranormal', 'ufo', 'cryptid', 'ghost'],
    priorityTools: ['Phenomenon Explorer AI Suite'],
    relatedCategories: ['Mysterious & Unusual']
  },
  legislationWriter: {
    triggers: ['legislation', 'legislate', 'legislation writer', 'write a law', 'draft legislation', 'bill writer'],
    keywords: ['legislation', 'law', 'bill', 'statute', 'legal draft'],
    priorityTools: ['Legislation Writer GPT', 'Public Testimony Writer GPT', 'Legislator Link GPT'],
    relatedCategories: ['Legal & Government']
  },
  graphicDesignGpt: {
    triggers: ['graphic design', 'cover design', 'book cover', 'graphic designer', 'design gpt', 'cover designer'],
    keywords: ['graphic', 'design', 'cover', 'visual'],
    priorityTools: ['Graphic & Cover Design GPT', 'Tattoo Designer GPT', 'Sketch Artist GPT'],
    relatedCategories: ['Image & Design']
  },
  factCheckerGpt: {
    triggers: ['fact check', 'fact checker', 'fact-checker', 'misinformation', 'verify facts', 'truth check'],
    keywords: ['fact', 'truth', 'verify', 'misinformation', 'check'],
    priorityTools: ['FACT CHECKER GPT', 'Probability GPT'],
    relatedCategories: ['Investigative & Analysis']
  },
  sustainableFutures: {
    triggers: ['sustainable', 'sustainability', 'sustainable futures', 'climate gpt', 'green future', 'eco gpt'],
    keywords: ['sustainable', 'sustainability', 'climate', 'green', 'eco'],
    priorityTools: ['Sustainable Futures GPT'],
    relatedCategories: ['Science & Research']
  },
  teslaEinsteinGpt: {
    triggers: ['nikola tesla', 'tesla gpt', 'einstein', 'albert einstein', 'einstein gpt', 'tesla einstein', 'physicist gpt', 'physics gpt'],
    keywords: ['tesla', 'einstein', 'physics', 'scientist'],
    priorityTools: ['Nikola Tesla GPT', 'Albert Einstein GPT'],
    relatedCategories: ['Science & Research']
  },
  foodQualityInspector: {
    triggers: ['food quality', 'food inspector', 'food safety', 'grocery ai', 'ingredient checker'],
    keywords: ['food quality', 'food safety', 'inspector', 'grocery', 'ingredient'],
    priorityTools: ['Food Quality Inspector GPT'],
    relatedCategories: ['Food & Hospitality']
  },
  homeRenovator: {
    triggers: ['home renovator', 'home renovation', 'renovation gpt', 'home repair', 'home improvement', 'remodel', 'diy home'],
    keywords: ['home', 'renovation', 'repair', 'remodel', 'improvement'],
    priorityTools: ['Home Renovator GPT 🏡🔧'],
    relatedCategories: ['Professional Services']
  },
  fishermanGpt: {
    triggers: ['fisherman', 'fishing', 'fisher', 'fish gpt', 'fishing gpt', 'angling'],
    keywords: ['fishing', 'fisherman', 'angling', 'bait', 'tackle'],
    priorityTools: ['Fisherman GPT🎣😊'],
    relatedCategories: ['Recreation & Outdoors']
  },
  agronomus: {
    triggers: ['agronomus', 'farming', 'farming ai', 'farmer gpt', 'agriculture gpt', 'crop gpt'],
    keywords: ['farming', 'agriculture', 'agronomy', 'crop'],
    priorityTools: ['Agronomus AI Farming Expert'],
    relatedCategories: ['Science & Research']
  },
  antiqueAppraisal: {
    triggers: ['antique', 'antiques', 'collectible', 'collectibles', 'appraisal', 'appraise', 'coin appraisal', 'antique appraisal'],
    keywords: ['antique', 'collectible', 'appraisal', 'value'],
    priorityTools: ['Antique and Collectible Appraisal GPT', 'Artwork & Vintage Appraisal GPT', 'MATERIAL VALUATION GPT'],
    relatedCategories: ['Appraisal & Valuation']
  },
  oraculum: {
    triggers: ['oraculum', 'hidden truths', 'oracle gpt', 'reveal truth', 'hidden knowledge'],
    keywords: ['oraculum', 'oracle', 'hidden', 'truth', 'esoteric'],
    priorityTools: ['Oraculum – The Revealer of Hidden "Truths"'],
    relatedCategories: ['Spiritual & Philosophy']
  },
  triviaNight: {
    triggers: ['trivia', 'trivia night', 'quiz game', 'trivia gpt'],
    keywords: ['trivia', 'quiz', 'game', 'knowledge'],
    priorityTools: ['Trivia Night GPT', 'Quiz Maker Ai'],
    relatedCategories: ['Entertainment & Gaming']
  },
  veterinarianGpt: {
    triggers: ['veterinarian', 'vet gpt', 'pet care', 'animal doctor', 'pet health', 'pet doctor'],
    keywords: ['veterinarian', 'vet', 'pet', 'animal'],
    priorityTools: ['🐾Veterinarian GPT'],
    relatedCategories: ['Health & Wellness']
  },
  insuranceClaims: {
    triggers: ['insurance', 'insurance claim', 'insurance claims', 'claim gpt', 'damage claim'],
    keywords: ['insurance', 'claim', 'damage', 'policy'],
    priorityTools: ['🔒Insurance Claims GPT'],
    relatedCategories: ['Professional Services']
  },
  cannabisGpt: {
    triggers: ['cannabis', 'canabis', 'marijuana', 'weed gpt', 'cannabis gpt', 'hemp gpt', 'thc', 'cbd'],
    keywords: ['cannabis', 'marijuana', 'hemp', 'thc', 'cbd', 'strain'],
    priorityTools: ['Cannabis GPT', 'Fungus GPT – AI Mushroom Specialist'],
    relatedCategories: ['Health & Wellness']
  },
  probabilityGpt: {
    triggers: ['probability', 'probability gpt', 'odds calculator', 'truth probability', 'likelihood gpt'],
    keywords: ['probability', 'odds', 'likelihood', 'truth'],
    priorityTools: ['Probability GPT', 'Fortune Teller GPT'],
    relatedCategories: ['Science & Research']
  },
  learnAnyCourse: {
    triggers: ['learn any course', 'any course', 'learn course', 'free course', 'online class', 'self taught'],
    keywords: ['course', 'learn', 'class', 'lesson'],
    priorityTools: ['LEARN ANY COURSE GPT', 'COLLEGE DEGREE GPT', 'LEARN ANY SKILL GPT', 'Course Maker GPT'],
    relatedCategories: ['Education & Learning']
  },
  learnAnySkill: {
    triggers: ['learn any skill', 'learn skill', 'master a skill', 'skill learning', 'pick up a skill', 'new skill'],
    keywords: ['skill', 'learn', 'master', 'tutorial'],
    priorityTools: ['LEARN ANY SKILL GPT', 'LEARN ANY COURSE GPT'],
    relatedCategories: ['Education & Learning']
  },
  publicDefender: {
    triggers: ['public defender', 'defense lawyer', 'criminal defense', 'free lawyer', 'court defense', 'legal defense'],
    keywords: ['public defender', 'defense', 'lawyer', 'attorney', 'criminal'],
    priorityTools: ['Public Defender GPT', 'Legal Draftsmith GPT', 'Contract Review Bot'],
    relatedCategories: ['Legal & Government']
  },
  propertyDataFinder: {
    triggers: ['property data', 'property finder', 'property lookup', 'real estate data', 'home value', 'property info'],
    keywords: ['property', 'real estate', 'data', 'value', 'lookup'],
    priorityTools: ['Property Data Finder GPT', 'Predictive Credit Score Checker GPT', 'Solar Land Assessor GPT'],
    relatedCategories: ['Professional Services']
  },
  algebraicExpression: {
    triggers: ['algebra', 'algebraic', 'math gpt', 'algebra gpt', 'algebraic expression', 'math equation'],
    keywords: ['algebra', 'math', 'equation', 'expression'],
    priorityTools: ['Algebraic Expression Inventor GPT', 'King Blueberry GPT'],
    relatedCategories: ['Education & Learning']
  },
  multitaskerGpt: {
    triggers: ['multitasker', 'multi task', 'multi-task', 'multitask gpt', 'do many things'],
    keywords: ['multitask', 'multitasker', 'tasks', 'multiple'],
    priorityTools: ['MULTITASKER GPT', 'GODMODE GPT'],
    relatedCategories: ['AI & Development']
  },
  fortuneTellerGpt: {
    triggers: ['fortune teller', 'fortune', 'predict future', 'psychic gpt', 'forecast gpt'],
    keywords: ['fortune', 'prediction', 'psychic', 'forecast'],
    priorityTools: ['Fortune Teller GPT', 'Probability GPT', 'Illuminous World Data Explorer GPT'],
    relatedCategories: ['Spiritual & Philosophy']
  },
  materialValuation: {
    triggers: ['material valuation', 'metal value', 'gem value', 'material value', 'precious metal', 'gem appraisal'],
    keywords: ['material', 'valuation', 'metal', 'gem', 'value'],
    priorityTools: ['MATERIAL VALUATION GPT', 'Antique and Collectible Appraisal GPT'],
    relatedCategories: ['Appraisal & Valuation']
  },
  microSaasGpt: {
    triggers: ['microsaas', 'micro saas', 'micro-saas', 'saas idea', 'startup idea', 'saas builder'],
    keywords: ['saas', 'microsaas', 'startup', 'app idea'],
    priorityTools: ['MicroSaaS GPT', '🚀 Startup Validator GPT', '-Business Plan Generator GPT💼'],
    relatedCategories: ['Business & Productivity']
  },
  interpretis: {
    triggers: ['interpretis', 'etymology', 'etymological', 'word origin', 'word meaning', 'language origin'],
    keywords: ['etymology', 'etymological', 'word', 'origin', 'language'],
    priorityTools: ['Interpretis 🕰️'],
    relatedCategories: ['Education & Learning']
  },
  imaginationTraveler: {
    triggers: ['imagination', 'imagination traveler', 'imagine', 'alternate reality', 'fantasy traveler'],
    keywords: ['imagination', 'imagine', 'fantasy', 'alternate'],
    priorityTools: ['Imagination Traveler GPT', 'TIME MACHINE GPT'],
    relatedCategories: ['Entertainment & Gaming']
  },
  titanicResurrections: {
    triggers: ['titanic', 'titanic resurrections', 'titanic gpt', 'titanic survivors'],
    keywords: ['titanic', 'shipwreck', 'survivors', '1912'],
    priorityTools: ['Titanic Resurrections GPT', 'TALK TO HISTORY GPT'],
    relatedCategories: ['Education & Learning']
  },
  alchemistScientist: {
    triggers: ['alchemist', 'alchemy', 'alchemical', 'alchemist gpt', 'medieval chemistry'],
    keywords: ['alchemy', 'alchemist', 'chemistry', 'medieval'],
    priorityTools: ['Alchemist Scientist GPT', 'Historical Apothecary GPT'],
    relatedCategories: ['Spiritual & Philosophy']
  },
  doctorGpt: {
    triggers: ['doctor gpt', 'dr gpt', 'personal doctor', 'medical gpt', 'medicus', 'health gpt'],
    keywords: ['doctor', 'medical', 'medicus', 'health', 'physician'],
    priorityTools: ['Personalized DR. GPT (Doctor GPT)', 'Pharmaceutical Assistant GPT', 'Mental Wellness GPT'],
    relatedCategories: ['Health & Wellness']
  },
  traderGpt: {
    triggers: ['trader', 'trading gpt', 'day trader', 'stock trader', 'trader gpt', 'trading signals'],
    keywords: ['trading', 'trader', 'stock', 'market', 'signals'],
    priorityTools: ['Trader GPT', 'Predictive Credit Score Checker GPT'],
    relatedCategories: ['Business & Productivity']
  },
  indianaArcheologist: {
    triggers: ['indiana', 'archeologist', 'archaeologist', 'archeology', 'archaeology', 'indiana jones', 'ancient texts'],
    keywords: ['archeology', 'archaeology', 'ancient', 'artifacts', 'indiana'],
    priorityTools: ['Indiana Archeologist GPT', 'Historical Apothecary GPT', 'TALK TO HISTORY GPT'],
    relatedCategories: ['Education & Learning']
  },
  marriageMender: {
    triggers: ['marriage', 'marriage mender', 'couples therapy', 'relationship advice', 'marriage counseling', 'mend marriage'],
    keywords: ['marriage', 'couples', 'relationship', 'mediation'],
    priorityTools: ['Marriage Mender GPT'],
    relatedCategories: ['Health & Wellness']
  },
  trainingManual: {
    triggers: ['training manual', 'employee training', 'manual generator', 'onboarding manual', 'sop generator'],
    keywords: ['training', 'manual', 'onboarding', 'sop'],
    priorityTools: ['Training Manual Generator GPT', '-Business Plan Generator GPT💼'],
    relatedCategories: ['Business & Productivity']
  },
  alanWatts: {
    triggers: ['alan watts', 'alanwatts', 'philosophy gpt', 'free thinker', 'eastern philosophy'],
    keywords: ['alan watts', 'philosophy', 'eastern', 'liberation'],
    priorityTools: ['ALAN WATTS GPT', 'Sophia Aeterna AI', 'TALK TO THE GODS GPT'],
    relatedCategories: ['Spiritual & Philosophy']
  },
  solarLandAssessor: {
    triggers: ['solar', 'solar land', 'solar assessor', 'solar installer', 'solar panel', 'solar property'],
    keywords: ['solar', 'land', 'assessor', 'panel'],
    priorityTools: ['Solar Land Assessor GPT', 'Sustainable Futures GPT'],
    relatedCategories: ['Professional Services']
  },
  dataResearchAnalysis: {
    triggers: ['data research', 'data analysis', 'analysis report', 'research report', 'data analytics ai'],
    keywords: ['data', 'analysis', 'research', 'report', 'analytics'],
    priorityTools: ['Data Research Analysis Report GPT', 'Illuminous World Data Explorer GPT'],
    relatedCategories: ['Investigative & Analysis']
  },
  resumeJobFinder: {
    triggers: ['resume', 'resume gpt', 'job finder', 'job search', 'cv writer', 'job hunt', 'career coach', 'job coach'],
    keywords: ['resume', 'cv', 'job', 'career', 'finder'],
    priorityTools: ['The Resume & Job Finder Ai Suite', 'AI Interview Copilot'],
    relatedCategories: ['Business & Productivity']
  },
  playwriterGpt: {
    triggers: ['playwriter', 'playwright', 'theatrical play', 'stage play', 'write a play'],
    keywords: ['playwriter', 'playwright', 'play', 'theatrical', 'stage'],
    priorityTools: ['🎭 Playwriter GPT', 'STAGEMASTER AI SUITE FOR THE Preforming Arts'],
    relatedCategories: ['Creative & Media']
  },
  customGptMaker: {
    triggers: ['custom gpt', 'gpt maker', 'make a gpt', 'build a gpt', 'gpt builder', 'customizable gpt', 'gpt ideas'],
    keywords: ['custom gpt', 'gpt maker', 'gpt builder'],
    priorityTools: ['Customizable GPT Maker', 'Custom GPT Ideas & Brainstorming Assistant'],
    relatedCategories: ['AI & Development']
  },
  apothecaryGpt: {
    triggers: ['apothecary', 'historical apothecary', 'herbal remedies', 'herbalist gpt', 'tinctures'],
    keywords: ['apothecary', 'herbal', 'remedies', 'herbalist', 'tincture'],
    priorityTools: ['Historical Apothecary GPT', 'Alchemist Scientist GPT'],
    relatedCategories: ['Health & Wellness']
  },
  homeSchooling: {
    triggers: ['homeschool', 'home school', 'home-schooling', 'homeschooling', 'home education'],
    keywords: ['homeschool', 'home school', 'education', 'parent'],
    priorityTools: ['Home-Schooling Assistant GPT', 'LEARN ANY COURSE GPT'],
    relatedCategories: ['Education & Learning']
  },
  pharmaceuticalAssistant: {
    triggers: ['pharmaceutical', 'pharmacy gpt', 'pharma', 'rx ai', 'medication assistant', 'drug info', 'pharma research'],
    keywords: ['pharmaceutical', 'pharmacy', 'medication', 'drug', 'rx'],
    priorityTools: ['Pharmaceutical Assistant GPT', 'PHARMA RESEARCH PRO'],
    relatedCategories: ['Health & Wellness']
  },
  contractReviewBot: {
    triggers: ['contract review', 'review contract', 'contract bot', 'contract analysis', 'legal contract'],
    keywords: ['contract', 'review', 'legal', 'agreement'],
    priorityTools: ['Contract Review Bot', 'Legal Draftsmith GPT', 'Public Defender GPT'],
    relatedCategories: ['Legal & Government']
  },
  tattooDesigner: {
    triggers: ['tattoo', 'tattoo designer', 'tattoo artist', 'tattoo gpt', 'piercing gpt', 'body art'],
    keywords: ['tattoo', 'piercing', 'body art', 'design'],
    priorityTools: ['Tattoo Designer GPT', 'Sketch Artist GPT'],
    relatedCategories: ['Creative & Media']
  },
  firearmsSafety: {
    triggers: ['firearm', 'firearms', 'gun safety', 'firearm safety', 'shooting instructor', 'gun training'],
    keywords: ['firearm', 'gun', 'safety', 'shooting'],
    priorityTools: ['Firearms Safety Instructor GPT', 'Survivalist GPT'],
    relatedCategories: ['Education & Learning']
  },
  soraPromptAssistant: {
    triggers: ['sora prompt', 'sora gpt', 'sora ai', 'video prompt', 'text to video prompt'],
    keywords: ['sora', 'video prompt', 'text to video'],
    priorityTools: ['Sora Prompt Assistant', 'Luma Dream Machine Prompt Assistant'],
    relatedCategories: ['Video & Multimedia']
  },
  mixologistGpt: {
    triggers: ['mixologist', 'bartender', 'cocktail', 'cocktails', 'drink mixer', 'kenny mixology'],
    keywords: ['mixologist', 'bartender', 'cocktail', 'drink'],
    priorityTools: ['Mixologist GPT', 'Chef "Sizzle" AI Culinary Assistant', 'Restaurant Menu Maker GPT'],
    relatedCategories: ['Food & Hospitality']
  },
  chefSizzle: {
    triggers: ['chef sizzle', 'chef gpt', 'culinary assistant', 'recipe gpt', 'cooking assistant'],
    keywords: ['chef', 'culinary', 'recipe', 'cooking'],
    priorityTools: ['Chef "Sizzle" AI Culinary Assistant', 'Mixologist GPT', 'Restaurant Menu Maker GPT'],
    relatedCategories: ['Food & Hospitality']
  },
  restyleMe: {
    triggers: ['restyle', 'restyle me', 'restyleme', 'photo style', 'image style transfer', 'art style'],
    keywords: ['restyle', 'style', 'transform', 'image'],
    priorityTools: ['RESTYLE ME GPT', 'Graphic & Cover Design GPT'],
    relatedCategories: ['Image & Design']
  },
  celebrityChatline: {
    triggers: ['celebrity', 'celebrity chat', 'chat with celebrity', 'famous people chat', 'celebrity ai'],
    keywords: ['celebrity', 'famous', 'star', 'chat'],
    priorityTools: ['Celebrity Chatline GPT'],
    relatedCategories: ['Entertainment & Gaming']
  },
  firefighterGpt: {
    triggers: ['firefighter', 'fire fighter', 'wildfire', 'fire safety', 'firefighting'],
    keywords: ['firefighter', 'fire', 'wildfire', 'safety'],
    priorityTools: ['Firefighter GPT', 'Survivalist GPT'],
    relatedCategories: ['Health & Wellness']
  },
  binaryConverter: {
    triggers: ['binary', 'binary converter', 'binary text', 'text to binary', 'binary to text'],
    keywords: ['binary', 'converter', 'text'],
    priorityTools: ['Binary-Text-Image Converter GPT'],
    relatedCategories: ['Utility & Productivity']
  },
  lumaDreamMachine: {
    triggers: ['luma', 'luma dream', 'dream machine', 'luma ai', 'luma prompt'],
    keywords: ['luma', 'dream machine', 'video', 'prompt'],
    priorityTools: ['Luma Dream Machine Prompt Assistant', 'Sora Prompt Assistant'],
    relatedCategories: ['Video & Multimedia']
  },
  restaurantMenuMaker: {
    triggers: ['restaurant menu', 'menu maker', 'menu designer', 'restaurant menu gpt'],
    keywords: ['restaurant', 'menu', 'maker'],
    priorityTools: ['Restaurant Menu Maker GPT', 'Chef "Sizzle" AI Culinary Assistant'],
    relatedCategories: ['Food & Hospitality']
  },
  quizMakerAi: {
    triggers: ['quiz maker', 'quiz gpt', 'make a quiz', 'create quiz', 'test maker'],
    keywords: ['quiz', 'test', 'maker', 'questions'],
    priorityTools: ['Quiz Maker Ai', 'Trivia Night GPT'],
    relatedCategories: ['Education & Learning']
  },
  courseMakerGpt: {
    triggers: ['course maker', 'course creator', 'create course', 'build a course', 'online course maker'],
    keywords: ['course', 'maker', 'creator', 'curriculum'],
    priorityTools: ['Course Maker GPT', 'LEARN ANY COURSE GPT', 'Quiz Maker Ai'],
    relatedCategories: ['Education & Learning']
  },
  taxesGpt: {
    triggers: ['taxes', 'tax gpt', 'tax preparation', 'tax return', 'taxes gpt', 'tax filing'],
    keywords: ['taxes', 'tax', 'preparation', 'filing'],
    priorityTools: ['Taxes GPT'],
    relatedCategories: ['Business & Productivity']
  },
  genomeGpt: {
    triggers: ['genome', 'dna gpt', 'genetic gpt', 'genetics', 'dna analysis', 'genome gpt'],
    keywords: ['genome', 'dna', 'genetic', 'genomics'],
    priorityTools: ['Genome GPT'],
    relatedCategories: ['Science & Research']
  },
  gameDesignDocument: {
    triggers: ['game design', 'gdd', 'game design document', 'game developer gpt', 'video game design'],
    keywords: ['game design', 'gdd', 'developer', 'video game'],
    priorityTools: ['Game Design Document / Developer GPT'],
    relatedCategories: ['Entertainment & Gaming']
  },
  neoMatrixGpt: {
    triggers: ['matrix', 'neo matrix', 'enter the matrix', 'simulation theory', 'morpheus', 'red pill'],
    keywords: ['matrix', 'neo', 'morpheus', 'simulation'],
    priorityTools: ['ENTER THE MATRIX GPT (NEO👁️MATRIX GPT)'],
    relatedCategories: ['Mysterious & Unusual']
  },
  predictiveCreditScore: {
    triggers: ['credit score', 'credit check', 'predictive credit', 'creditworthiness'],
    keywords: ['credit', 'score', 'check', 'rating'],
    priorityTools: ['Predictive Credit Score Checker GPT', 'Property Data Finder GPT'],
    relatedCategories: ['Business & Productivity']
  },
  nameInsight: {
    triggers: ['name meaning', 'name insight', 'name predictor', 'whats my name', 'numerology name', 'name origin'],
    keywords: ['name', 'meaning', 'insight', 'numerology'],
    priorityTools: ['Name Insight Research & Predictor GPT', 'Interpretis 🕰️'],
    relatedCategories: ['Spiritual & Philosophy']
  },
  coloringBookGenerator: {
    triggers: ['coloring book', 'coloring page', 'coloring generator', 'kids coloring'],
    keywords: ['coloring book', 'coloring page'],
    priorityTools: ['Coloring Book Generator GPT', "Children's Picture Book Maker GPT"],
    relatedCategories: ['Creative & Media']
  },
  publicTestimonyBoost: {
    triggers: ['public testimony', 'testimony writer', 'write testimony', 'legislative testimony'],
    keywords: ['testimony', 'public', 'legislative'],
    priorityTools: ['Public Testimony Writer GPT', 'Legislator Link GPT', 'Legislation Writer GPT'],
    relatedCategories: ['Legal & Government']
  },
  cyberSecurityGpt: {
    triggers: ['cyber security', 'cybersecurity', 'hacking defender', 'infrastructure protection', 'network security ai'],
    keywords: ['cyber', 'security', 'hacking', 'defender'],
    priorityTools: ['Cyber Security GPT'],
    relatedCategories: ['Investigative & Analysis']
  },
  startupValidator: {
    triggers: ['startup validator', 'validate startup', 'startup idea', 'business validator'],
    keywords: ['startup', 'validator', 'validate', 'idea'],
    priorityTools: ['🚀 Startup Validator GPT', 'MicroSaaS GPT', '-Business Plan Generator GPT💼'],
    relatedCategories: ['Business & Productivity']
  },
  businessPlanGenerator: {
    triggers: ['business plan', 'business plan generator', 'create business plan', 'startup plan'],
    keywords: ['business plan', 'business', 'plan'],
    priorityTools: ['-Business Plan Generator GPT💼', '🚀 Startup Validator GPT', 'MicroSaaS GPT'],
    relatedCategories: ['Business & Productivity']
  },
  fungusGpt: {
    triggers: ['fungus', 'mushroom', 'mycology', 'mushroom specialist', 'fungus gpt', 'foraging mushrooms'],
    keywords: ['fungus', 'mushroom', 'mycology', 'foraging'],
    priorityTools: ['Fungus GPT – AI Mushroom Specialist'],
    relatedCategories: ['Science & Research']
  },
  drillBabyDrill: {
    triggers: ['drill baby drill', 'oil and gas', 'oil gas ai', 'drilling ai', 'petroleum'],
    keywords: ['oil', 'gas', 'drilling', 'petroleum'],
    priorityTools: ['Drill Baby Drill Ai Suite For Oil & Gas'],
    relatedCategories: ['Professional Services']
  },
  dreamInterpreter: {
    triggers: ['dream interpreter', 'interpret dreams', 'dream meaning', 'dream analysis', 'dream gpt'],
    keywords: ['dream', 'interpreter', 'meaning'],
    priorityTools: ['Dream Interpreter GPT', 'Fortune Teller GPT'],
    relatedCategories: ['Spiritual & Philosophy']
  },
  podcastScriptWriter: {
    triggers: ['podcast', 'podcast script', 'podcast writer', 'podcast gpt', 'podcast script writer'],
    keywords: ['podcast', 'script', 'writer', 'audio'],
    priorityTools: ['Podcast Script Writer GPT'],
    relatedCategories: ['Multimedia & Content']
  },
  personFinder: {
    triggers: ['person finder', 'find a person', 'people search', 'person info', 'background check'],
    keywords: ['person', 'finder', 'people', 'search'],
    priorityTools: ['Person Information Finder GPT'],
    relatedCategories: ['Investigative & Analysis']
  },
  pptxPowerpointMaker: {
    triggers: ['powerpoint', 'pptx', 'ppt maker', 'powerpoint maker', 'presentation maker', 'slide deck'],
    keywords: ['powerpoint', 'pptx', 'presentation', 'slides'],
    priorityTools: ['PPTx Powerpoint Maker GPT'],
    relatedCategories: ['Business & Productivity']
  },
  grantWriter: {
    triggers: ['grant writer', 'grant writing', 'write grant', 'grant proposal', 'grant gpt'],
    keywords: ['grant', 'writer', 'proposal', 'funding'],
    priorityTools: ['Grant Writer GPT'],
    relatedCategories: ['Writing & Content']
  },
  ubiStrategist: {
    triggers: ['ubi', 'universal basic income', 'basic income', 'ubi strategist'],
    keywords: ['ubi', 'universal basic income', 'income'],
    priorityTools: ['Universal Basic Income Strategist GPT'],
    relatedCategories: ['Legal & Government']
  },
  artworkVintage: {
    triggers: ['artwork', 'artwork appraisal', 'vintage appraisal', 'art valuation', 'art appraiser'],
    keywords: ['artwork', 'art', 'vintage', 'appraisal'],
    priorityTools: ['Artwork & Vintage Appraisal GPT', 'Antique and Collectible Appraisal GPT'],
    relatedCategories: ['Appraisal & Valuation']
  },
  hiddenHistoricalPatterns: {
    triggers: ['hidden patterns', 'historical patterns', 'pattern recognition', 'uncover history', 'hidden history'],
    keywords: ['hidden', 'historical', 'patterns'],
    priorityTools: ['Uncovering Hidden Historical Patterns GPT'],
    relatedCategories: ['Investigative & Analysis']
  },
  sketchArtist: {
    triggers: ['sketch artist', 'sketch gpt', 'sketch ai', 'pencil sketch', 'drawing ai'],
    keywords: ['sketch', 'artist', 'drawing'],
    priorityTools: ['Sketch Artist GPT', 'Graphic & Cover Design GPT'],
    relatedCategories: ['Image & Design']
  },
  aiToolsFinder: {
    triggers: ['ai tool finder', 'find ai tool', 'ai tools finder', 'tool finder', 'best ai tool'],
    keywords: ['ai tool', 'finder', 'tools'],
    priorityTools: ['AI Tools Finder GPT'],
    relatedCategories: ['AI & Development']
  },
  articleBlogRewriter: {
    triggers: ['article rewriter', 'blog rewriter', 'rewrite article', 'rewrite blog', 'content rewriter'],
    keywords: ['rewriter', 'article', 'blog', 'content'],
    priorityTools: ['Article and Blog Rewriter GPT', 'Clarity Omni GPT'],
    relatedCategories: ['Writing & Content']
  },
  videoAnalysis: {
    triggers: ['video analysis', 'analyze video', 'video second by second', 'frame analysis'],
    keywords: ['video', 'analysis', 'analyze'],
    priorityTools: ['Video Second-by-Second Analysis GPT'],
    relatedCategories: ['Video & Multimedia']
  },
  middleJourney: {
    triggers: ['middlejourney', 'midjourney prompt', 'midjourney assistant', 'mj prompt'],
    keywords: ['midjourney', 'middlejourney', 'prompt'],
    priorityTools: ['"MiddleJourney" Midjourney Prompting Assistant', 'Sora Prompt Assistant'],
    relatedCategories: ['Image & Design']
  },
  maryMagdalene: {
    triggers: ['mary magdalene', 'magdalene gpt', 'mary magdalene gpt'],
    keywords: ['mary magdalene', 'magdalene'],
    priorityTools: ['🕊️Mary Magdalene GPT', 'TALK TO THE GODS GPT'],
    relatedCategories: ['Spiritual & Philosophy']
  },
  snoopImageAi: {
    triggers: ['snoop image', 'snoop ai', 'ai image detector', 'detect ai image', 'is this ai'],
    keywords: ['snoop', 'detector', 'ai image'],
    priorityTools: ['Snoop Image Ai - Experimental AI Image Generation Detector', 'FACT CHECKER GPT'],
    relatedCategories: ['Investigative & Analysis']
  },
  legalDraftsmith: {
    triggers: ['legal draftsmith', 'legal draft', 'draft legal document', 'legal writer'],
    keywords: ['legal draft', 'draftsmith', 'legal'],
    priorityTools: ['Legal Draftsmith GPT', 'Public Defender GPT', 'Contract Review Bot'],
    relatedCategories: ['Legal & Government']
  },
  musicMelodies: {
    triggers: ['music melodies', 'music lessons', 'music gpt', 'music theory', 'learn music'],
    keywords: ['music', 'melodies', 'lessons', 'theory'],
    priorityTools: ['Music Melodies & Lessons GPT', 'Music Video Maker AI Studio'],
    relatedCategories: ['Multimedia & Content']
  },
  sophiaAeterna: {
    triggers: ['sophia', 'sophia aeterna', 'sophia ai', 'wisdom gpt'],
    keywords: ['sophia', 'aeterna', 'wisdom'],
    priorityTools: ['Sophia Aeterna AI', 'ALAN WATTS GPT'],
    relatedCategories: ['Spiritual & Philosophy']
  },
  childrensBookMaker: {
    triggers: ['children book', 'childrens book', "children's book", 'kids book', 'picture book'],
    keywords: ['children', 'kids', 'picture book'],
    priorityTools: ["Children's Picture Book Maker GPT", 'BOOK WRITER GPT', 'Coloring Book Generator GPT'],
    relatedCategories: ['Writing & Content']
  },
  movieSceneMaker: {
    triggers: ['movie scene', 'scene maker', 'film scene', 'cinematic scene'],
    keywords: ['scene', 'movie', 'film'],
    priorityTools: ['Movie Scene Maker GPT', 'Movie Maker Studio AI SUITE', 'Movie Script Writer GPT'],
    relatedCategories: ['Video & Multimedia']
  },
  mentalWellness: {
    triggers: ['mental wellness', 'mental health', 'wellness gpt', 'therapy gpt', 'anxiety help'],
    keywords: ['mental', 'wellness', 'health', 'therapy'],
    priorityTools: ['Mental Wellness GPT', 'Marriage Mender GPT'],
    relatedCategories: ['Health & Wellness']
  },
  legislatorLink: {
    triggers: ['legislator', 'legislator link', 'contact legislator', 'find legislator', 'representative gpt'],
    keywords: ['legislator', 'representative', 'contact'],
    priorityTools: ['Legislator Link GPT', 'Public Testimony Writer GPT', 'Legislation Writer GPT'],
    relatedCategories: ['Legal & Government']
  },
  mindmapMaestro: {
    triggers: [
      'mind', 'mindm', 'mindma', 'mindmap', 'mind map', 'mind mapping',
      'mindmaps', 'mind maps', 'maestro', 'mindmap maestro',
      'mindmap maestro gpt', 'concept map', 'visual thinking',
      'brainstorm map', 'idea map', 'knowledge map'
    ],
    keywords: [
      'mindmap', 'mind map', 'mind mapping', 'maestro', 'visual thinking',
      'brainstorm', 'concept map', 'knowledge graph', 'outline', 'organize ideas'
    ],
    priorityTools: ['Mindmap Maestro GPT'],
    relatedCategories: ['Utility & Productivity']
  },
  raybanMeta: {
    triggers: ['ray-ban', 'rayban', 'ray ban', 'ray-ban meta', 'meta glasses', 'meta smart glasses', 'meta wayfarer'],
    keywords: ['ray-ban meta', 'meta smart glasses', 'AI glasses', 'smart glasses'],
    priorityTools: ['Ray-Ban Meta Smart Glasses', 'Meta AI Glasses', 'Even Realities G1', 'Brilliant Labs Frame'],
    relatedCategories: ['AI Gadgets & Devices']
  },
  evenRealities: {
    triggers: ['even realities', 'even g1', 'g1 glasses', 'evenrealities'],
    keywords: ['even realities', 'g1', 'AI glasses', 'translation glasses'],
    priorityTools: ['Even Realities G1', 'Ray-Ban Meta Smart Glasses', 'Brilliant Labs Frame'],
    relatedCategories: ['AI Gadgets & Devices']
  },
  brilliantFrame: {
    triggers: ['brilliant labs', 'brilliant frame', 'frame glasses', 'noa ai'],
    keywords: ['brilliant labs', 'frame', 'noa', 'open source AI glasses'],
    priorityTools: ['Brilliant Labs Frame', 'Even Realities G1', 'Ray-Ban Meta Smart Glasses'],
    relatedCategories: ['AI Gadgets & Devices']
  },
  omiAi: {
    triggers: ['omi', 'omi ai', 'omi necklace', 'based hardware', 'omi pendant'],
    keywords: ['omi', 'omi necklace', 'AI necklace', 'AI pendant', 'second brain wearable'],
    priorityTools: ['Omi AI Necklace', 'Friend AI Pendant', 'Limitless Pendant', 'Rewind Pendant'],
    relatedCategories: ['AI Gadgets & Devices']
  },
  plaudNote: {
    triggers: ['plaud', 'plaud note', 'plaud ai', 'plaud recorder'],
    keywords: ['plaud', 'plaud note', 'AI voice recorder', 'AI transcription'],
    priorityTools: ['Plaud Note', 'Plaud NotePin'],
    relatedCategories: ['AI Gadgets & Devices']
  },
  insta360: {
    triggers: ['insta360', 'insta 360', 'go 3s', 'insta360 go', 'thumb camera'],
    keywords: ['insta360', 'go 3s', 'AI action camera', '4K mini camera', 'wearable camera'],
    priorityTools: ['Insta360 GO 3S'],
    relatedCategories: ['AI Gadgets & Devices']
  },
  looiRobot: {
    triggers: ['looi', 'looi robot', 'desktop robot', 'phone robot'],
    keywords: ['looi', 'desktop AI robot', 'phone robot', 'AI desk companion'],
    priorityTools: ['Looi Robot', 'Eilik', 'Loona Petbot'],
    relatedCategories: ['AI Gadgets & Devices']
  },
  eilikRobot: {
    triggers: ['eilik', 'energize lab', 'desk robot', 'desktop pet robot'],
    keywords: ['eilik', 'desk robot', 'AI desk companion', 'emotional robot'],
    priorityTools: ['Eilik', 'Looi Robot', 'Loona Petbot'],
    relatedCategories: ['AI Gadgets & Devices']
  },
  loonaPetbot: {
    triggers: ['loona', 'loona petbot', 'keyi', 'robot puppy', 'robot dog pet'],
    keywords: ['loona', 'KEYi', 'AI robot dog', 'robot puppy', 'AI pet robot'],
    priorityTools: ['Loona Petbot', 'Eilik', 'Looi Robot'],
    relatedCategories: ['AI Gadgets & Devices']
  },
  rewindPendant: {
    triggers: ['rewind', 'rewind pendant', 'rewind ai', 'memory pendant', 'life logger'],
    keywords: ['rewind', 'rewind pendant', 'AI memory pendant', 'AI life logger', 'second brain'],
    priorityTools: ['Rewind Pendant', 'Limitless Pendant', 'Friend AI Pendant', 'Omi AI Necklace'],
    relatedCategories: ['AI Gadgets & Devices']
  },
  oneMoreShotAi: {
    triggers: ['one more shot', 'onemoreshot', 'one more shot ai', 'music video ai', 'ai music video', 'cinematic music video', 'song to video', 'lyric video'],
    keywords: ['One More Shot AI', 'AI music video generator', 'cinematic music video', 'song to video', 'lyric video AI', 'music video maker'],
    priorityTools: ['One More Shot AI', 'Music Video Maker AI Studio', 'Movie Maker Studio AI SUITE'],
    relatedCategories: ['Video & Multimedia']
  },
  vidAi: {
    triggers: ['vid.ai', 'vid ai', 'vidai', 'faceless youtube', 'faceless channel', 'youtube shorts automation', 'tiktok automation', 'reels automation', 'short video automation', 'turn laziness into income', 'faceless ai channel'],
    keywords: ['Vid.ai', 'faceless YouTube Shorts', 'TikTok automation', 'AI short video generator', 'viral clips', 'faceless channel automation', 'monetize shorts'],
    priorityTools: ['Vid.ai', 'One More Shot AI', 'Music Video Maker AI Studio'],
    relatedCategories: ['Video & Multimedia']
  },
  cluely: {
    triggers: ['cluely', 'invisible ai', 'screen ai', 'meeting copilot', 'interview ai', 'stealth ai', 'ai overlay'],
    keywords: ['Cluely', 'invisible AI', 'screen-watching AI', 'real-time AI assistant', 'meeting copilot', 'interview assistant'],
    priorityTools: ['Cluely'],
    relatedCategories: ['AI Tools & Utilities']
  },
  feloAi: {
    triggers: ['felo', 'felo ai', 'multilingual search', 'multilingual ai search', 'cross language search'],
    keywords: ['Felo AI', 'multilingual AI search', 'global answer engine', 'cross-language search'],
    priorityTools: ['Felo AI', 'Perplexity AI Search Engine'],
    relatedCategories: ['Search & Productivity']
  },
  inflectionPi: {
    triggers: ['pi ai', 'inflection', 'inflection pi', 'pi.ai', 'empathetic ai', 'ai companion', 'ai friend'],
    keywords: ['Pi', 'Inflection Pi', 'empathetic AI', 'AI companion', 'kind AI'],
    priorityTools: ['Inflection Pi'],
    relatedCategories: ['AI Chat Platforms']
  },
  sambanova: {
    triggers: ['sambanova', 'samba nova', 'fast inference', 'rdu chip', 'fastest llm'],
    keywords: ['SambaNova', 'AI inference', 'fast LLM hosting', 'RDU chip', 'enterprise AI inference'],
    priorityTools: ['SambaNova', 'Groq', 'Cerebras'],
    relatedCategories: ['AI Tools & Development']
  },
  sameDev: {
    triggers: ['same.dev', 'same dev', 'website cloner', 'clone website ai', 'clone any website'],
    keywords: ['Same.dev', 'AI website cloner', 'pixel perfect clone', 'website to React'],
    priorityTools: ['Same.dev'],
    relatedCategories: ['AI Tools & Development']
  },
  lambdaLabs: {
    triggers: ['lambda labs', 'lambda gpu', 'lambda cloud', 'h100 cloud', 'h200 cloud', 'gpu cloud'],
    keywords: ['Lambda Labs', 'GPU cloud', 'H100 hosting', 'AI training compute'],
    priorityTools: ['Lambda Labs', 'RunPod', 'Together AI'],
    relatedCategories: ['AI Tools & Development']
  },
  motherduck: {
    triggers: ['motherduck', 'duckdb', 'serverless analytics', 'duck db'],
    keywords: ['MotherDuck', 'DuckDB', 'serverless data warehouse', 'AI analytics'],
    priorityTools: ['MotherDuck'],
    relatedCategories: ['AI Tools & Development']
  },
  milvus: {
    triggers: ['milvus', 'vector database', 'open source vector db', 'rag database', 'embedding database'],
    keywords: ['Milvus', 'vector database', 'RAG', 'semantic search', 'embedding store'],
    priorityTools: ['Milvus', 'Pinecone', 'Weaviate', 'Qdrant'],
    relatedCategories: ['AI Tools & Development']
  },
  heybossAi: {
    triggers: ['heyboss', 'hey boss', 'heyboss ai', 'ai app builder', 'text to app'],
    keywords: ['Heyboss AI', 'AI app builder', 'AI website builder', 'text to app'],
    priorityTools: ['Heyboss AI', 'Lovable', 'Bolt.new'],
    relatedCategories: ['AI Tools & Development']
  },
  multionAi: {
    triggers: ['multion', 'multi on', 'multion ai', 'web agent', 'browser agent', 'autonomous web agent', 'ai that browses'],
    keywords: ['MultiOn', 'autonomous web agent', 'AI browser agent', 'web automation agent'],
    priorityTools: ['MultiOn AI', 'Browser Use', 'Convergence'],
    relatedCategories: ['AI Agents']
  }
};

// Get matching phrase handler for a search term
export const getMatchingPhraseHandler = (searchTerm: string): PhraseHandler | null => {
  const lowerSearch = searchTerm.toLowerCase();
  
  for (const [key, handler] of Object.entries(COMMON_PHRASE_HANDLERS)) {
    if (handler.triggers.some(trigger => lowerSearch.includes(trigger))) {
      return handler;
    }
  }
  
  return null;
};

// Check if a tool matches a phrase handler
export const toolMatchesPhraseHandler = (
  tool: { title?: string; description?: string; category?: string; tags?: string[] },
  handler: PhraseHandler
): boolean => {
  const lowerTitle = (tool.title || '').toLowerCase();
  const lowerDesc = (tool.description || '').toLowerCase();
  const lowerCategory = (tool.category || '').toLowerCase();
  const lowerTags = (tool.tags || []).map(t => t.toLowerCase()).join(' ');
  const allText = `${lowerTitle} ${lowerDesc} ${lowerCategory} ${lowerTags}`;
  
  // Check if tool is in priority list
  if (handler.priorityTools.some(pt => lowerTitle.includes(pt.toLowerCase()))) {
    return true;
  }
  
  // Check if tool matches keywords
  if (handler.keywords.some(kw => allText.includes(kw))) {
    return true;
  }
  
  // Check if tool is in related categories
  if (handler.relatedCategories.some(cat => lowerCategory.includes(cat.toLowerCase()))) {
    return true;
  }
  
  return false;
};

// Score a tool based on phrase handler relevance
export const scorePhraseHandlerMatch = (
  tool: { title?: string; description?: string; category?: string; tags?: string[] },
  handler: PhraseHandler
): number => {
  let score = 0;
  const lowerTitle = (tool.title || '').toLowerCase();
  const lowerDesc = (tool.description || '').toLowerCase();
  const lowerCategory = (tool.category || '').toLowerCase();
  const lowerTags = (tool.tags || []).map(t => t.toLowerCase()).join(' ');
  
  // HIGHEST: Tool is in priority list (bidirectional partial match)
  for (let i = 0; i < handler.priorityTools.length; i++) {
    const priorityTool = handler.priorityTools[i].toLowerCase();
    // Match if title includes priority OR priority includes title (for short titles like "Sora", "Pika")
    if (lowerTitle.includes(priorityTool) || priorityTool.includes(lowerTitle) || lowerTitle === priorityTool) {
      score += 100000 - (i * 5000); // Higher priority for tools listed first
    }
  }
  
  // HIGH: Keywords in title
  const titleKeywordMatches = handler.keywords.filter(kw => lowerTitle.includes(kw));
  score += titleKeywordMatches.length * 30000;
  
  // MEDIUM: Keywords in description
  const descKeywordMatches = handler.keywords.filter(kw => lowerDesc.includes(kw));
  score += descKeywordMatches.length * 10000;
  
  // MEDIUM: Keywords in tags
  const tagKeywordMatches = handler.keywords.filter(kw => lowerTags.includes(kw));
  score += tagKeywordMatches.length * 8000;
  
  // LOWER: Related category match
  if (handler.relatedCategories.some(cat => lowerCategory.includes(cat.toLowerCase()))) {
    score += 5000;
  }
  
  return score;
};
