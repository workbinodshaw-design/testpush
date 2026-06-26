const fs = require('fs');
const path = require('path');

// Helper to pick random item
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ID generator
let currentId = 1;
const getId = () => `p${currentId++}`;

const prompts = [];

// ============================================
// CATEGORY 1: Instagram Trending Girls
// ============================================
const igSubjects = ['young woman', 'fashion model', 'beautiful girl', 'stylish female influencer', 'korean beauty', 'elegant woman'];
const igSettings = ['in a cozy coffee shop', 'walking down a neon-lit street in Tokyo', 'at a sun-drenched beach in Bali', 'in a modern minimalist apartment', 'at a rooftop bar at sunset'];
const igStyles = ['candid portrait', 'fashion photography', 'lifestyle photography', 'editorial shot', 'selfie style'];
const igLighting = ['golden hour lighting', 'soft natural window light', 'neon reflections', 'cinematic warm lighting', 'flash photography style'];
const igCameras = ['shot on 35mm lens', 'shot on iPhone 15 Pro Max', 'Fujifilm X100V, film simulation', '85mm f/1.4 lens depth of field', 'Polaroid vintage style'];
const igKeywords = ['trending on instagram', 'aesthetic', 'vsco girl', 'highly detailed', 'hyperrealistic', 'flawless skin'];

for(let i=0; i<150; i++) {
  const promptText = `${pick(igStyles)} of a ${pick(igSubjects)} ${pick(igSettings)}, ${pick(igLighting)}, ${pick(igCameras)}, ${pick(igKeywords)}, ${pick(igKeywords)}.`;
  prompts.push({
    id: getId(),
    title: `IG Portrait: ${pick(['Golden Hour', 'City Vibes', 'Aesthetic', 'Casual', 'Fashion'])} ${i+1}`,
    category: 'Instagram Portraits',
    prompt: promptText
  });
}

// ============================================
// CATEGORY 2: Cinematic Video Generation
// ============================================
const vidShots = ['sweeping drone shot', 'slow motion tracking shot', 'dynamic FPV drone flight', 'low angle push-in', 'handheld documentary style'];
const vidSubjects = ['a futuristic neon cyberpunk city', 'a lone astronaut exploring a red desert planet', 'a majestic medieval castle on a snowy mountain', 'a dense enchanted forest with glowing fairies', 'a high-speed car chase on a rainy highway'];
const vidAtmosphere = ['heavy rain pouring down', 'volumetric fog rolling in', 'lens flares and cinematic lighting', 'hyper-realistic water reflections', 'epic dramatic stormy skies'];
const vidDetails = ['4k resolution, 60fps', 'Unreal Engine 5 render, ray tracing', 'shot on RED Monstro 8K VV', 'cinematic color grading', 'IMAX 70mm aspect ratio'];

for(let i=0; i<100; i++) {
  const promptText = `A ${pick(vidShots)} of ${pick(vidSubjects)}, with ${pick(vidAtmosphere)}. ${pick(vidDetails)}, extremely detailed, cinematic masterpiece.`;
  prompts.push({
    id: getId(),
    title: `Cinematic Video: ${pick(['Cyberpunk', 'Space', 'Fantasy', 'Action', 'Nature'])} ${i+1}`,
    category: 'Cinematic Video',
    prompt: promptText
  });
}

// ============================================
// CATEGORY 3: Cartoon / Anime Video Generation
// ============================================
const cartStyles = ['Pixar style 3D animation', 'Studio Ghibli style anime', 'classic 90s Disney 2D animation', 'vibrant cel-shaded anime', 'cute claymation style'];
const cartSubjects = ['a red panda drinking boba tea', 'a tiny robot discovering a glowing flower', 'a magical cat riding a flying broomstick', 'a young wizard practicing spells in a messy room', 'a group of fluffy monsters baking a cake'];
const cartVibes = ['soft pastel lighting', 'vibrant saturated colors', 'dreamy magical atmosphere', 'warm cozy lighting', 'dynamic action poses'];

for(let i=0; i<100; i++) {
  const promptText = `${pick(cartStyles)} of ${pick(cartSubjects)}, ${pick(cartVibes)}. Highly detailed, cute, masterpiece animation sequence, 4k.`;
  prompts.push({
    id: getId(),
    title: `Animation: ${pick(['Cute Animal', 'Magic', 'Robot', 'Cozy', 'Action'])} ${i+1}`,
    category: 'Cartoon & Anime',
    prompt: promptText
  });
}

// ============================================
// CATEGORY 4: Image Enhancer / Upscaling
// ============================================
const enhTargets = ['low res portrait', 'old vintage photo', 'blurry landscape', 'pixelated anime screenshot', 'noisy night photo'];
const enhActions = ['upscale to 8k resolution', 'add extreme micro-details to the skin and eyes', 'remove all noise and artifacts', 'enhance the lighting and contrast', 'make it hyper-realistic and sharp'];
const enhDetails = ['hdr, intricate details', 'sharp focus, pristine clarity', 'masterpiece, best quality', 'perfectly symmetrical facial features', 'denoised, crystal clear'];

for(let i=0; i<100; i++) {
  const promptText = `Take this ${pick(enhTargets)} and ${pick(enhActions)}. Ensure ${pick(enhDetails)} and ${pick(enhDetails)}.`;
  prompts.push({
    id: getId(),
    title: `Enhance: ${pick(['Portrait', 'Landscape', 'Vintage', 'Anime', 'Night'])} ${i+1}`,
    category: 'Image Enhancer',
    prompt: promptText
  });
}

// ============================================
// CATEGORY 5: ChatGPT/Claude Text & Productivity
// ============================================
const textRoles = ['Expert SEO Copywriter', 'Senior Full Stack Developer', 'Chief Marketing Officer', 'Life Coach', 'Data Scientist'];
const textTasks = [
  'Write a comprehensive 1500-word blog post about [TOPIC].',
  'Refactor the following React code to use custom hooks and Tailwind CSS.',
  'Create a 30-day social media content calendar for a [NICHE] business.',
  'Develop a detailed workout and diet plan for someone who wants to lose 10lbs in a month.',
  'Analyze this dataset and provide the top 5 actionable insights in bullet points.'
];
const textTones = ['engaging and professional', 'witty and humorous', 'highly technical and precise', 'empathetic and motivating', 'concise and data-driven'];

for(let i=0; i<60; i++) {
  const promptText = `Act as an ${pick(textRoles)}. ${pick(textTasks)} Make sure the tone is ${pick(textTones)}.`;
  prompts.push({
    id: getId(),
    title: `Productivity: ${pick(['SEO', 'Coding', 'Marketing', 'Health', 'Data'])} ${i+1}`,
    category: 'Text & Productivity',
    prompt: promptText
  });
}

// Shuffle the prompts array so they aren't all grouped together
for (let i = prompts.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [prompts[i], prompts[j]] = [prompts[j], prompts[i]];
}

// Write to src/data/prompts.json
const outputPath = path.join(__dirname, 'src', 'data', 'prompts.json');
fs.writeFileSync(outputPath, JSON.stringify(prompts, null, 2));

console.log(`Successfully generated ${prompts.length} prompts to ${outputPath}`);
