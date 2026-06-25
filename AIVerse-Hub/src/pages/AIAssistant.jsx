import React, { useState, useEffect } from 'react';
import { History, TrendingUp, Sparkles } from 'lucide-react';
import AssistantChat from '../components/AssistantChat';

const AIAssistant = () => {
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('aiAssistantSearches') || '[]');
    setRecentSearches(saved);
  }, []);

  const handleNewSearch = (query) => {
    const updated = [query, ...recentSearches.filter(q => q !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('aiAssistantSearches', JSON.stringify(updated));
  };

  return (
    <div className="container section-padding" style={{ paddingTop: '120px', minHeight: '80vh' }}>
      
      <div className="section-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="section-title">AI Tool <span className="gradient-text">Recommendation Assistant</span></h1>
        <p className="section-subtitle">Describe what you need, and our intelligent engine will find the perfect AI tools for your workflow.</p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-start' }}>
        
        {/* Main Chat Interface */}
        <div style={{ order: 1, flex: '1 1 400px', minWidth: '0' }}>
          <AssistantChat onNewSearch={handleNewSearch} />
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', order: 2, flex: '1 1 300px', minWidth: '0' }}>
          
          {/* Trending Searches */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '1.1rem' }}>
              <TrendingUp size={18} className="text-purple-400" /> Trending Today
            </h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', cursor: 'pointer' }} className="hover:text-purple-400 transition-colors">Best AI Coding Tool</li>
              <li style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', cursor: 'pointer' }} className="hover:text-purple-400 transition-colors">Free AI Video Generators</li>
              <li style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', cursor: 'pointer' }} className="hover:text-purple-400 transition-colors">ChatGPT Alternatives</li>
              <li style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', cursor: 'pointer' }} className="hover:text-purple-400 transition-colors">AI for Digital Marketing</li>
            </ul>
          </div>

          {/* Recent Searches */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '1.1rem' }}>
              <History size={18} className="text-purple-400" /> Recent Searches
            </h3>
            {recentSearches.length > 0 ? (
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', listStyle: 'none', padding: 0, margin: 0 }}>
                {recentSearches.map((search, idx) => (
                  <li key={idx} style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    "{search}"
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No recent searches.</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
