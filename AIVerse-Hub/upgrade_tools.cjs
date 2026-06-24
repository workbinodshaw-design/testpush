const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/data/tools.json');
const tools = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

const samplePros = ["High quality output", "Intuitive interface", "Lightning fast processing", "Excellent community support", "API available", "Regular updates"];
const sampleCons = ["Can be expensive for teams", "Steep learning curve initially", "Requires constant internet", "Limited free tier capabilities"];

// We will use the first 20 tools as a pool of realistic alternatives
const alternativesPool = tools.slice(0, 20).map(t => ({ id: t.id, name: t.name, logo: t.logo, category: t.category, rating: t.rating, pricing: t.pricing }));

const upgradedTools = tools.map((tool, index) => {
  // Randomly assign some badges to make the UI look dynamic
  const badges = [];
  if (Math.random() > 0.6) badges.push('Verified');
  if (Math.random() > 0.85) badges.push('Trending');
  if (tool.featured || Math.random() > 0.95) badges.push('Editor Choice');
  if (Math.random() > 0.9) badges.push('New');
  if (tool.pricing === 'Paid' && Math.random() > 0.7) badges.push('Premium');
  if (Math.random() > 0.98) badges.push('Sponsored');
  
  // Assign pros/cons
  const pros = [samplePros[index % 6], samplePros[(index + 1) % 6], samplePros[(index + 2) % 6]];
  const cons = [sampleCons[index % 4], sampleCons[(index + 1) % 4]];
  
  // Assign 3 alternatives (randomized from top 20)
  const alternatives = alternativesPool
    .filter(a => a.id !== tool.id && a.category === tool.category)
    .slice(0, 3);
    
  if (alternatives.length < 3) {
    // fallback if no category match
    alternatives.push(...alternativesPool.filter(a => a.id !== tool.id).slice(0, 3 - alternatives.length));
  }
  
  // Screenshots & Video
  const screenshots = [
    `https://placehold.co/1200x675/1a1a24/6366f1?text=${encodeURIComponent(tool.name)}+Dashboard`,
    `https://placehold.co/1200x675/12121a/8b5cf6?text=${encodeURIComponent(tool.name)}+Features`,
    `https://placehold.co/1200x675/0a0a0f/ffffff?text=${encodeURIComponent(tool.name)}+Analytics`
  ];
  const videoDemo = "https://www.youtube.com/embed/dQw4w9WgXcQ"; // Standard placeholder video
  
  return {
    ...tool,
    badges,
    pros,
    cons,
    alternatives,
    screenshots,
    videoDemo
  };
});

fs.writeFileSync(filePath, JSON.stringify(upgradedTools, null, 2));
console.log(`Successfully upgraded ${upgradedTools.length} tools!`);
