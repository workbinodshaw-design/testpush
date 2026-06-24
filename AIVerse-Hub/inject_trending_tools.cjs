const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'src', 'data', 'tools.json');
let tools = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const generateId = () => Math.random().toString(36).substr(2, 9);

const trendingTools = [
  {
    id: generateId(),
    name: "ChatGPT-4o",
    description: "OpenAI's incredibly fast, natively multimodal flagship model. It can reason across audio, vision, and text in real time with near-zero latency.",
    category: "AI Chatbots",
    pricing: "Freemium",
    rating: "4.9",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
    featured: true,
    url: "https://chatgpt.com",
    reviews: 250000,
    badges: ["Trending", "Editor Choice"],
    pros: ["Real-time voice conversation", "Incredible vision capabilities", "Lightning fast"],
    cons: ["Strict message limits on free tier"]
  },
  {
    id: generateId(),
    name: "Grok",
    description: "xAI's conversational model integrated directly into X (Twitter). Known for having real-time knowledge of the world and a rebellious, uncensored streak.",
    category: "AI Chatbots",
    pricing: "Paid",
    rating: "4.5",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/X_logo_2023.svg/1200px-X_logo_2023.svg.png",
    featured: true,
    url: "https://grok.x.ai",
    reviews: 18000,
    badges: ["Trending"],
    pros: ["Real-time access to X data", "Less filtered than competitors", "Fun mode is highly engaging"],
    cons: ["Only available to X Premium+ subscribers"]
  },
  {
    id: generateId(),
    name: "Udio",
    description: "Viral AI music generator that competes directly with Suno. Known for incredibly crisp, high-fidelity audio output and complex musical composition.",
    category: "Audio & Voice",
    pricing: "Freemium",
    rating: "4.8",
    logo: "https://techcrunch.com/wp-content/uploads/2024/04/udio.jpg",
    featured: true,
    url: "https://www.udio.com",
    reviews: 21000,
    badges: ["Trending"],
    pros: ["Incredible audio fidelity", "Complex multi-part songs", "Generous free tier"],
    cons: ["UI is slightly unintuitive"]
  },
  {
    id: generateId(),
    name: "Poe",
    description: "Quora's incredibly popular platform that lets you chat with all the top AI models (GPT-4o, Claude 3.5, Gemini 1.5, Llama 3) in one single subscription.",
    category: "AI Chatbots",
    pricing: "Freemium",
    rating: "4.9",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/e/ef/Poe_AI_logo.svg/1200px-Poe_AI_logo.svg.png",
    featured: true,
    url: "https://poe.com",
    reviews: 65000,
    badges: ["Verified", "Editor Choice"],
    pros: ["Access to every premium model", "Create custom bots easily", "Great mobile app"],
    cons: ["Compute points system can be confusing"]
  },
  {
    id: generateId(),
    name: "Luma Dream Machine",
    description: "Next-generation AI video model capable of generating high-quality, realistic 5-second video clips from text and images. Highly viral.",
    category: "Video Editing",
    pricing: "Freemium",
    rating: "4.7",
    logo: "https://lumalabs.ai/static/images/logo.png",
    featured: true,
    url: "https://lumalabs.ai/dream-machine",
    reviews: 12000,
    badges: ["Trending"],
    pros: ["Very high quality motion", "Image-to-video is robust", "Fast generation speed"],
    cons: ["High demand causes queue delays"]
  },
  {
    id: generateId(),
    name: "Kling AI",
    description: "Kuaishou's astonishingly realistic AI video generator. It can generate up to 2-minute long videos with physics-accurate simulation and massive camera movement.",
    category: "Video Editing",
    pricing: "Free",
    rating: "4.8",
    logo: "https://kling.kuaishou.com/assets/logo-en.png",
    featured: true,
    url: "https://kling.kuaishou.com",
    reviews: 15500,
    badges: ["Trending", "Editor Choice"],
    pros: ["Incredible physics simulation", "Longer video generations", "Currently free"],
    cons: ["Chinese phone number required for login originally (changing soon)"]
  },
  {
    id: generateId(),
    name: "Gamma",
    description: "A new medium for presenting ideas. AI generates beautiful, interactive presentations, webpages, and documents instantly from a single text prompt.",
    category: "Productivity",
    pricing: "Freemium",
    rating: "4.8",
    logo: "https://assets-global.website-files.com/625593a881b8ebd169835ca5/625596b6537ce974244ab9eb_gamma%20logo.svg",
    featured: true,
    url: "https://gamma.app",
    reviews: 42000,
    badges: ["Trending", "Verified"],
    pros: ["Beautiful design templates", "Insanely fast presentation creation", "Easy to edit"],
    cons: ["Export to PowerPoint sometimes breaks formatting"]
  },
  {
    id: generateId(),
    name: "Opus Clip",
    description: "The #1 AI video repurposing tool. It automatically takes long-form podcasts or videos and cuts them into viral YouTube Shorts, TikToks, and Reels with captions.",
    category: "Video Editing",
    pricing: "Freemium",
    rating: "4.9",
    logo: "https://www.opus.pro/assets/images/logo.svg",
    featured: true,
    url: "https://www.opus.pro",
    reviews: 58000,
    badges: ["Trending", "Editor Choice"],
    pros: ["Viral score prediction", "Perfect auto-captions", "Saves hours of editing"],
    cons: ["Watermark on free tier", "AI sometimes cuts sentences early"]
  },
  {
    id: generateId(),
    name: "Magnific AI",
    description: "The most advanced AI image upscaler and enhancer. It reimagines and adds high-resolution details to low-res images, completely transforming them.",
    category: "Image Generation",
    pricing: "Paid",
    rating: "4.7",
    logo: "https://magnific.ai/assets/logo.png",
    featured: true,
    url: "https://magnific.ai",
    reviews: 9500,
    badges: ["Trending"],
    pros: ["Adds incredible micro-details", "Perfect for AI art upscaling", "Style transfer capabilities"],
    cons: ["Extremely expensive", "Can hallucinate details that weren't there"]
  },
  {
    id: generateId(),
    name: "Phind",
    description: "An AI search engine specifically built for developers. It connects to the internet to answer complex programming questions with high-quality code blocks.",
    category: "AI Coding",
    pricing: "Freemium",
    rating: "4.8",
    logo: "https://www.phind.com/images/logo.svg",
    featured: true,
    url: "https://www.phind.com",
    reviews: 22000,
    badges: ["Trending"],
    pros: ["Reads the web for documentation", "Excellent coding context", "Fast response times"],
    cons: ["Sometimes hallucinates library versions"]
  },
  {
    id: generateId(),
    name: "Krea AI",
    description: "Real-time AI image and video generation. You can draw shapes or move a webcam in real-time, and it instantly renders an AI masterpiece as you move.",
    category: "Image Generation",
    pricing: "Freemium",
    rating: "4.8",
    logo: "https://www.krea.ai/favicon.ico",
    featured: true,
    url: "https://www.krea.ai",
    reviews: 14000,
    badges: ["Trending"],
    pros: ["Zero latency real-time generation", "Incredible for brainstorming", "Video upscale features"],
    cons: ["Requires high internet bandwidth", "Pro plan needed for commercial use"]
  }
];

// Deduplicate existing
const existingNames = new Set(tools.map(t => t.name.toLowerCase()));
const toAdd = trendingTools.filter(t => !existingNames.has(t.name.toLowerCase()));

// Push to top
tools = [...toAdd, ...tools];

fs.writeFileSync(dbPath, JSON.stringify(tools, null, 2));
console.log(`Successfully injected ${toAdd.length} VIRAL trending tools into the database!`);
