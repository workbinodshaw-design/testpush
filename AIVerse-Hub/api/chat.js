import Groq from 'groq-sdk';

export default async function handler(req, res) {
  // CORS Headers for local development, Vercel handles production CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // 1. Authenticate Request (Firebase ID Token verification would ideally go here)
    const authHeader = req.headers.authorization;

    // 2. Validate Input
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request payload' });
    }

    // 3. Initialize Groq securely using the server-side environment variable
    const apiKey = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY; // Fallback for local testing
    
    if (!apiKey) {
      console.error("Missing GROQ_API_KEY");
      return res.status(500).json({ error: "Server Configuration Error" });
    }

    const groq = new Groq({ apiKey });

    // 4. Make the secure request
    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: "llama-3.1-8b-instant",
      temperature: 0.5,
      max_tokens: 500,
    });

    // 5. Return the response
    return res.status(200).json({
      text: chatCompletion.choices[0]?.message?.content || "No response generated."
    });

  } catch (error) {
    console.error("Secure API Error:", error);
    // Never expose stack traces to the client
    return res.status(500).json({ error: "Internal Server Error during AI completion." });
  }
}
