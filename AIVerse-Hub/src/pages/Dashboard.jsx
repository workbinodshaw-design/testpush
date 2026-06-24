import React, { useState, useEffect } from 'react';
import ToolCard from '../components/ToolCard';
import toolsData from '../data/tools.json';
import { Bookmark, Clock } from 'lucide-react';

const Dashboard = () => {
  const [savedTools, setSavedTools] = useState([]);
  const [recentTools, setRecentTools] = useState([]);

  useEffect(() => {
    // Load from LocalStorage
    const savedIds = JSON.parse(localStorage.getItem('bookmarkedTools') || '[]');
    const recentIds = JSON.parse(localStorage.getItem('recentlyViewedTools') || '[]');
    
    setSavedTools(toolsData.filter(t => savedIds.includes(t.id)));
    setRecentTools(toolsData.filter(t => recentIds.includes(t.id)));
  }, []);

  return (
    <div className="container section-padding" style={{ paddingTop: '120px', minHeight: '80vh' }}>
      <h1 className="section-title" style={{ marginBottom: '1rem' }}>Your <span className="gradient-text">Dashboard</span></h1>
      <p className="section-subtitle" style={{ margin: '0 0 3rem 0', textAlign: 'left' }}>Manage your bookmarks and view your browsing history.</p>

      {/* Saved Tools Section */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', fontSize: '1.8rem' }}>
          <Bookmark className="text-purple-400" size={28} /> Saved Tools ({savedTools.length})
        </h2>
        
        {savedTools.length > 0 ? (
          <div className="tools-grid">
            {savedTools.map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <p>You haven't saved any tools yet. Click the bookmark icon on any tool card to save it here.</p>
          </div>
        )}
      </section>

      {/* Recently Viewed Section */}
      <section>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', fontSize: '1.8rem' }}>
          <Clock className="text-blue-400" size={28} /> Recently Viewed
        </h2>
        
        {recentTools.length > 0 ? (
          <div className="tools-grid">
            {recentTools.map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <p>Your browsing history will appear here.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
