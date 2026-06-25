import React, { useState, useEffect } from 'react';
import ToolCard from '../components/ToolCard';
import toolsData from '../data/tools.json';
import { Bookmark, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { currentUser, userBookmarks } = useAuth();
  const [savedTools, setSavedTools] = useState([]);

  useEffect(() => {
    if (userBookmarks && userBookmarks.length > 0) {
      // Filter the static tools data using the live bookmark IDs!
      const bookmarked = toolsData.filter(t => userBookmarks.includes(t.id));
      setSavedTools(bookmarked);
    } else {
      setSavedTools([]);
    }
  }, [userBookmarks]);

  return (
    <div className="container section-padding" style={{ paddingTop: '120px', minHeight: '80vh' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2rem', fontWeight: 'bold' }}>
          {currentUser?.displayName ? currentUser.displayName.charAt(0).toUpperCase() : <Sparkles />}
        </div>
        <div>
          <h1 className="section-title" style={{ margin: 0 }}>Welcome, <span className="gradient-text">{currentUser?.displayName || 'Creator'}</span></h1>
          <p className="section-subtitle" style={{ margin: 0, textAlign: 'left' }}>{currentUser?.email}</p>
        </div>
      </div>
      
      <p style={{ marginBottom: '3rem', color: 'var(--text-secondary)' }}>Manage your bookmarks and custom tools toolkit here.</p>

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
          <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-secondary)', border: '1px dashed rgba(255,255,255,0.1)' }}>
            <Bookmark size={48} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Your toolkit is empty</h3>
            <p>You haven't saved any tools yet. Go explore the directory and click the bookmark icon on any tool to save it here forever!</p>
          </div>
        )}
      </section>

    </div>
  );
};

export default Dashboard;
