import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Bot, Loader2 } from 'lucide-react';
import SuggestionButtons from './SuggestionButtons';
import RecommendationCard from './RecommendationCard';
import { getRecommendations } from '../utils/recommendationEngine';

const AssistantChat = ({ onNewSearch }) => {
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: 'Hi! I am the AIVerse Assistant. What kind of AI tool are you looking for today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (queryText) => {
    const text = queryText || inputValue;
    if (!text.trim()) return;

    // Add user message
    const userMsg = { id: Date.now(), type: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);
    
    // Save to local storage for recent searches
    if (onNewSearch) onNewSearch(text);

    // Simulate network delay for realism
    setTimeout(() => {
      const recommendations = getRecommendations(text);
      
      let botText = '';
      if (recommendations.length > 0) {
        botText = 'Here are the best tools I found for you:';
      } else {
        botText = "No exact match found. Try rephrasing your request, or use fewer keywords.";
      }

      const botMsg = { 
        id: Date.now() + 1, 
        type: 'bot', 
        text: botText,
        recommendations: recommendations
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '600px', background: 'var(--glass-bg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)', overflow: 'hidden' }}>
      
      {/* Chat Header */}
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ background: 'var(--accent-primary)', padding: '0.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Sparkles size={20} color="white" />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>AI Tool Recommender</h3>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ width: '8px', height: '8px', background: 'var(--success)', borderRadius: '50%', display: 'inline-block' }}></span> Online
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
                lineHeight: '1.5'
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
              <Loader2 size={16} className="animate-spin text-purple-400" /> <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Searching database...</span>
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
            placeholder="Describe what you need (e.g., 'Free AI tools for coding')..."
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
