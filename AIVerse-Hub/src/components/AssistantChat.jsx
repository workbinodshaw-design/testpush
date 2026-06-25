import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Bot, Loader2, AlertCircle } from 'lucide-react';
import Groq from 'groq-sdk';
import SuggestionButtons from './SuggestionButtons';
import RecommendationCard from './RecommendationCard';
import toolsData from '../data/tools.json';

// Initialize Groq
const apiKey = import.meta.env.VITE_GROQ_API_KEY;
const groq = apiKey ? new Groq({ apiKey: apiKey, dangerouslyAllowBrowser: true }) : null;

const AssistantChat = ({ onNewSearch }) => {
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: 'Hello! I am the AIVerse Hub Assistant, powered by Groq & LLaMA 3. How can I help you find the perfect AI tool today?' }
  ]);
  const [chatHistory, setChatHistory] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (queryText) => {
    const text = queryText || inputValue;
    if (!text.trim()) return;

    // Add user message to UI
    const userMsg = { id: Date.now(), type: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);
    
    // Save to local storage for recent searches
    if (onNewSearch) onNewSearch(text);

    if (!groq) {
      setMessages(prev => [...prev, { id: Date.now()+1, type: 'bot', text: 'Error: Groq API is not configured properly. Please check your .env file.' }]);
      setIsTyping(false);
      return;
    }

    try {
      // 1. LOCAL SEARCH (RAG): Find relevant tools from the massive 5MB database
      const keywords = text.toLowerCase().split(' ').filter(k => k.length > 2);
      let relevantTools = toolsData.filter(t => {
        const toolText = `${t.name} ${t.category} ${t.description}`.toLowerCase();
        return keywords.some(k => toolText.includes(k));
      });
      
      // If no direct matches, just pass a few popular tools
      if (relevantTools.length === 0) relevantTools = toolsData.slice(0, 5); 
      
      // Slice to max 10 to ensure we stay well below Groq's 6,000 Token Per Minute limit
      relevantTools = relevantTools.slice(0, 10);
      const dynamicContext = relevantTools.map(t => `- ${t.name}: ${t.description.substring(0, 200)} (Category: ${t.category}, Pricing: ${t.pricing})`).join('\\n');

      const systemInstruction = `You are the highly professional AI Assistant for AIVerse Hub, a premium directory for AI tools. 
Your ONLY goal is to chat with users and recommend AI tools from our database.
I have searched our database and found these relevant tools for the user's request:
${dynamicContext}

CRITICAL RULES YOU MUST FOLLOW:
1. SHORT RESPONSES: Keep your answers extremely short and concise (1-3 sentences maximum). Never write long paragraphs.
2. ONLY USE DATABASE: Only recommend tools that are explicitly listed in the context above. If no relevant tools are in the context, apologize and say you couldn't find an exact match in our database. Do not hallucinate or recommend outside tools.
3. NO MARKDOWN: Do NOT use any Markdown formatting (no asterisks, no bolding, no bullet points). Write in clear, plain text.
4. TAG FORMATTING: When recommending a tool, you MUST include the exact tool name wrapped in brackets like this: [RECOMMEND: Tool Name].`;

      // Create new history array for the API call
      const updatedHistory = [...chatHistory, { role: 'user', content: text }];
      
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemInstruction },
          ...updatedHistory
        ],
        model: "llama-3.1-8b-instant",
        temperature: 0.2,
      });

      const responseText = chatCompletion.choices[0]?.message?.content || "I couldn't process that request.";
      
      // Update history with the assistant's response for context in future messages
      setChatHistory([...updatedHistory, { role: 'assistant', content: responseText }]);
      
      // Parse recommendations
      const recRegex = /\[RECOMMEND:\s*(.*?)\]/g;
      const recommendedNames = [];
      let match;
      while ((match = recRegex.exec(responseText)) !== null) {
        recommendedNames.push(match[1].trim().toLowerCase());
      }
      
      // Find actual tool objects
      const recommendations = toolsData.filter(t => 
        recommendedNames.includes(t.name.toLowerCase())
      );
      
      // Clean up the text to remove the ugly brackets for the user
      const cleanText = responseText.replace(/\[RECOMMEND:\s*(.*?)\]/g, '$1');

      const botMsg = { 
        id: Date.now() + 1, 
        type: 'bot', 
        text: cleanText,
        recommendations: recommendations
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Groq Error:", error);
      setMessages(prev => [...prev, { id: Date.now()+1, type: 'bot', text: 'I apologize, but I am having trouble connecting to my servers right now. Please try again later.'}]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="chat-phone-mockup">
      
      {/* Chat Header */}
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ background: 'var(--accent-primary)', padding: '0.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Sparkles size={20} color="white" />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>AIVerse AI Brain</h3>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ width: '8px', height: '8px', background: 'var(--success)', borderRadius: '50%', display: 'inline-block' }}></span> Powered by Groq (LLaMA 3)
          </p>
        </div>
      </div>

      {!groq && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
          <AlertCircle size={16} /> API Key missing in .env
        </div>
      )}

      {/* Chat Messages */}
      <div style={{ flexGrow: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ display: 'flex', gap: '1rem', flexDirection: msg.type === 'user' ? 'row-reverse' : 'row' }}>
            <div style={{ 
              width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              background: msg.type === 'user' ? 'var(--bg-tertiary)' : 'rgba(168, 85, 247, 0.2)',
              color: msg.type === 'user' ? 'var(--text-primary)' : 'var(--accent-primary)'
            }}>
              {msg.type === 'user' ? <User size={18} /> : <Bot size={18} />}
            </div>
            
            <div style={{ maxWidth: '80%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ 
                padding: '1rem', 
                borderRadius: '1rem',
                borderTopRightRadius: msg.type === 'user' ? '0' : '1rem',
                borderTopLeftRadius: msg.type === 'bot' ? '0' : '1rem',
                background: msg.type === 'user' ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                color: msg.type === 'user' ? 'white' : 'var(--text-primary)',
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap'
              }}>
                {msg.text}
              </div>

              {msg.recommendations && msg.recommendations.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {msg.recommendations.map(tool => (
                    <RecommendationCard key={tool.id} tool={tool} />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(168, 85, 247, 0.2)', color: 'var(--accent-primary)' }}>
              <Bot size={18} />
            </div>
            <div style={{ padding: '1rem', borderRadius: '1rem', borderTopLeftRadius: '0', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Loader2 size={16} className="animate-spin text-purple-400" /> <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Groq is thinking...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--glass-border)', background: 'var(--bg-secondary)' }}>
        <SuggestionButtons onSelect={(query) => handleSend(query)} />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Groq anything..."
            style={{ flexGrow: 1, padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', outline: 'none' }}
          />
          <button 
            onClick={() => handleSend()}
            disabled={!inputValue.trim() || isTyping || !groq}
            className="btn btn-primary"
            style={{ padding: '0 1.5rem', borderRadius: 'var(--radius-md)' }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>

    </div>
  );
};

export default AssistantChat;
