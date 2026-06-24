import toolsData from '../data/tools.json';

// Advanced synonym map to catch misspellings and intent
const synonymMap = {
  'gemenai': 'gemini',
  'gemani': 'gemini',
  'chatgpt': 'gpt',
  'gpt4': 'gpt',
  'image': 'image generation',
  'images': 'image generation',
  'picture': 'image generation',
  'drawing': 'image generation',
  'art': 'image generation',
  'code': 'coding',
  'program': 'coding',
  'developer': 'coding',
  'video': 'video editing',
  'automate': 'automation',
  'workflow': 'automation',
  'make': 'make',
  'n8n': 'n8n',
  'flux': 'flux',
  'claude': 'claude',
  'write': 'writing',
  'blog': 'writing',
  'music': 'audio & voice',
  'song': 'audio & voice',
  'voice': 'audio & voice',
  'speech': 'audio & voice',
  'sound': 'audio & voice'
};

const getKeywords = (text) => {
  if (!text) return [];
  const stopWords = ['a','an','the','and','or','but','for','of','with','in','on','at','to','is','are','was','were','it','this','that','i','you','he','she','we','they','need','want','looking','find','best','tool','tools','ai', 'like', 'some'];
  
  return text.toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .split(' ')
    .filter(word => word.length > 1 && !stopWords.includes(word))
    .map(word => synonymMap[word] || word); // Apply synonym correction
};

export const getRecommendations = (query) => {
  const queryLower = query.toLowerCase();
  const keywords = getKeywords(queryLower);
  
  // 1. Intent Extraction
  let pricingIntent = null;
  if (queryLower.includes('free') || queryLower.includes('no cost') || queryLower.includes('cheap') || queryLower.includes('open source')) {
    pricingIntent = 'Free';
  } else if (queryLower.includes('premium') || queryLower.includes('enterprise') || queryLower.includes('paid')) {
    pricingIntent = 'Paid';
  }

  // 2. Score Tools
  const scoredTools = toolsData.map(tool => {
    let score = 0;
    const toolCategoryLower = tool.category.toLowerCase();
    const toolNameLower = tool.name.toLowerCase();
    const toolDescLower = tool.description.toLowerCase();

    // MASSIVE BONUS: Exact Tool Name Mentioned (e.g. user asks for "n8n" or "flux")
    if (keywords.some(kw => toolNameLower === kw)) {
      score += 200; // Instantly push to top
    } else if (keywords.some(kw => toolNameLower.includes(kw) && kw.length > 2)) {
      score += 50; // Partial name match
    }

    // 40% Category Match
    if (keywords.some(kw => toolCategoryLower.includes(kw))) {
      score += 40;
    }

    // 30% Description Keyword Density Match
    const descMatches = keywords.filter(kw => toolDescLower.includes(kw));
    score += (descMatches.length * 15);

    // Contextual Category Bonuses based on Synonyms
    if (toolCategoryLower.includes('automation') && keywords.includes('automation')) score += 50;
    if (toolCategoryLower.includes('image') && keywords.includes('image generation')) score += 50;
    if (toolCategoryLower.includes('video') && keywords.includes('video editing')) score += 50;
    if (toolCategoryLower.includes('coding') && keywords.includes('coding')) score += 50;

    // 15% Rating Score
    score += (tool.rating / 5) * 15;

    // Trending Badge Bonus
    if (tool.badges && tool.badges.includes("Trending")) {
      score += 10;
    }

    // Pricing Intent Filtering
    if (pricingIntent === 'Free' && tool.pricing === 'Paid') {
      score -= 100; // Penalize paid if they asked for free
    } else if (pricingIntent === 'Free' && (tool.pricing === 'Free' || tool.pricing === 'Freemium')) {
      score += 20; // Bonus for free/freemium
    }

    return { ...tool, score };
  });

  // 3. Sort and Filter out bad matches
  // A score of ~15 is just rating. Need at least 25 to be somewhat relevant.
  const validTools = scoredTools.filter(t => t.score > 25);
  validTools.sort((a, b) => b.score - a.score);

  return validTools.slice(0, 8); // Return top 8 most relevant tools
};
