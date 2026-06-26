import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Bot, Loader2, AlertCircle } from 'lucide-react';
import DOMPurify from 'dompurify';
import SuggestionButtons from './SuggestionButtons';
import RecommendationCard from './RecommendationCard';
import PromptRecommendationCard from './PromptRecommendationCard';
import toolsData from '../data/tools.json';
import promptsData from '../data/prompts.json';

const AssistantChat = ({ onNewSearch }) => {
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: 'Hello! I am the AIVerse Hub Assistant, powered by Groq & LLaMA 3. How can I help you find the perfect AI tool or AI Prompt today?' }
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
    let text = queryText || inputValue;
    text = DOMPurify.sanitize(text);
    if (!text.trim()) return;

    // Add user message to UI
    const userMsg = { id: Date.now(), type: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);
    
    // Save to local storage for recent searches
    if (onNewSearch) onNewSearch(text);

    try {
      // 1. LOCAL SEARCH (RAG): Find relevant tools AND prompts
      const keywords = text.toLowerCase().split(' ').filter(k => k.length > 2);
      
      // Search Tools
      let relevantTools = toolsData.filter(t => {
        const toolText = `${t.name} ${t.category} ${t.description}`.toLowerCase();
        return keywords.some(k => toolText.includes(k));
      });
      if (relevantTools.length === 0) relevantTools = toolsData.slice(0, 3); 
      relevantTools = relevantTools.slice(0, 5);
      
      // Search Prompts
      const isAskingForPrompt = text.toLowerCase().includes('prompt');
      let relevantPrompts = [];
      if (isAskingForPrompt || keywords.length > 0) {
        relevantPrompts = promptsData.filter(p => {
          const promptText = `${p.title} ${p.category} ${p.prompt}`.toLowerCase();
          return keywords.some(k => promptText.includes(k));
        });
        if (relevantPrompts.length === 0 && isAskingForPrompt) {
          relevantPrompts = promptsData.slice(0, 3); // fallback
        }
        relevantPrompts = relevantPrompts.slice(0, 5); // max 5 prompts
      }

      const toolsContext = relevantTools.length > 0 
        ? `\nAVAILABLE TOOLS:\n` + relevantTools.map(t => `- ${t.name}: ${t.description.substring(0, 200)} (Category: ${t.category})`).join('\n')
        : '';
        
      const promptsContext = relevantPrompts.length > 0 
        ? `\nAVAILABLE PROMPTS:\n` + relevantPrompts.map(p => `- ID: ${p.id} | Title: ${p.title} | Content: ${p.prompt.substring(0, 200)}...`).join('\n')
        : '';

      const systemInstruction = `You are the highly professional AI Assistant for AIVerse Hub, a premium directory for AI tools and AI Prompts. 
Your ONLY goal is to chat with users and recommend AI tools or AI prompts from our database.
I have searched our database and found these relevant items for the user's request:
${toolsContext}
${promptsContext}

CRITICAL RULES YOU MUST FOLLOW:
1. SHORT RESPONSES: Keep your answers extremely short and concise (1-3 sentences maximum). Never write long paragraphs.
2. ONLY USE DATABASE: Only recommend tools or prompts explicitly listed in the context above. If none match, apologize and say you couldn't find an exact match in our database.
3. NO MARKDOWN: Do NOT use any Markdown formatting (no asterisks, no bolding, no bullet points). Write in clear, plain text.
4. TOOL TAG FORMATTING: When recommending a tool, you MUST include the exact tool name wrapped in brackets like this: [RECOMMEND: Tool Name].
5. PROMPT TAG FORMATTING: When recommending a prompt, you MUST include the exact prompt ID wrapped in brackets like this: [PROMPT: ID]. For example: [PROMPT: p12]`;

      // Create new history array for the API call
      const updatedHistory = [...chatHistory, { role: 'user', content: text }];
      
      const payload = {
        messages: [
          { role: 'system', content: systemInstruction },
          ...updatedHistory
        ]
      };

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }

      const data = await response.json();
      const responseText = data.text;
      
      // Update history with the assistant's response for context in future messages
      setChatHistory([...updatedHistory, { role: 'assistant', content: responseText }]);
      
      // Parse Tool recommendations
      const recRegex = /\[RECOMMEND:\s*(.*?)\]/g;
      const recommendedNames = [];
      let match;
      while ((match = recRegex.exec(responseText)) !== null) {
        recommendedNames.push(match[1].trim().toLowerCase());
      }
      const recommendations = toolsData.filter(t => 
        recommendedNames.includes(t.name.toLowerCase())
      );
      
      // Parse Prompt recommendations
      const promptRegex = /\[PROMPT:\s*(.*?)\]/g;
      const recommendedPromptIds = [];
      let matchPrompt;
      while ((matchPrompt = promptRegex.exec(responseText)) !== null) {
        recommendedPromptIds.push(matchPrompt[1].trim().toLowerCase());
      }
      const recommendedPrompts = promptsData.filter(p => 
        recommendedPromptIds.includes(p.id.toLowerCase())
      );
      
      // Clean up the text to remove the ugly brackets for the user
      let cleanText = responseText.replace(/\[RECOMMEND:\s*(.*?)\]/g, '$1');
      cleanText = cleanText.replace(/\[PROMPT:\s*(.*?)\]/g, ''); // Hide the prompt ID completely

      const botMsg = { 
        id: Date.now() + 1, 
        type: 'bot', 
        text: cleanText.trim(),
        recommendations: recommendations,
        prompts: recommendedPrompts
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("API Fetch Error:", error);
      setMessages(prev => [...prev, { id: Date.now()+1, type: 'bot', text: 'I apologize, but I am having trouble connecting to my secure servers right now. Please try again later.'}]);
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
              
              {msg.prompts && msg.prompts.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {msg.prompts.map(prompt => (
                    <PromptRecommendationCard key={prompt.id} prompt={prompt} />
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
            placeholder="Ask Groq for tools or prompts..."
            style={{ flexGrow: 1, padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', outline: 'none' }}
          />
          <button 
            onClick={() => handleSend()}
            disabled={!inputValue.trim() || isTyping}
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
