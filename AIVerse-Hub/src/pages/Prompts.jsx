import React, { useState, useMemo } from 'react';
import { Copy, CheckCircle, Search, Filter, ChevronDown } from 'lucide-react';
import promptsData from '../data/prompts.json';

const ITEMS_PER_PAGE = 20;

const Prompts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedId, setCopiedId] = useState(null);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const categories = ['All', ...new Set(promptsData.map(p => p.category))];

  const filteredPrompts = useMemo(() => {
    return promptsData.filter(p => {
      const query = searchQuery.toLowerCase();
      // Enhanced search checks title, prompt, and category
      const matchesSearch = p.title.toLowerCase().includes(query) || 
                            p.prompt.toLowerCase().includes(query) ||
                            p.category.toLowerCase().includes(query);
      const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  const visiblePrompts = filteredPrompts.slice(0, visibleCount);

  // Reset pagination when filters change
  React.useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [searchQuery, selectedCategory]);

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + ITEMS_PER_PAGE);
  };

  return (
    <div className="container section-padding" style={{ paddingTop: '120px', minHeight: '80vh' }}>
      <div className="section-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="section-title">Ultimate <span className="gradient-text">Prompt Library</span></h1>
        <p className="section-subtitle">Supercharge your workflow with our massive curated collection of {promptsData.length}+ advanced prompts.</p>
      </div>

      {/* Filters and Search */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '3rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.5rem 1rem', borderRadius: '20px', whiteSpace: 'nowrap' }}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-tertiary)', padding: '0.5rem 1rem', borderRadius: '20px', border: '1px solid var(--glass-border)', flexGrow: 1, maxWidth: '400px' }}>
          <Search size={18} style={{ color: 'var(--text-secondary)', marginRight: '0.5rem' }} />
          <input 
            type="text" 
            placeholder="Search thousands of prompts..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '100%' }}
          />
        </div>
      </div>

      {/* Prompts Grid */}
      <div className="tools-grid">
        {visiblePrompts.map(prompt => (
          <div key={prompt.id} className="glass-panel hover-glow" style={{ display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
              <span className="badge badge-category" style={{ marginBottom: '1rem', display: 'inline-block' }}>{prompt.category}</span>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{prompt.title}</h3>
            </div>
            
            <div style={{ padding: '1.5rem', flexGrow: 1, background: 'var(--bg-tertiary)', position: 'relative' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                {prompt.prompt}
              </p>
            </div>
            
            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'flex-end', background: 'var(--bg-secondary)' }}>
              <button 
                onClick={() => handleCopy(prompt.id, prompt.prompt)}
                className="btn btn-secondary" 
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', transition: 'all 0.2s ease' }}
              >
                {copiedId === prompt.id ? (
                  <><CheckCircle size={16} className="text-green-400" /> <span style={{color: '#4ade80'}}>Copied!</span></>
                ) : (
                  <><Copy size={16} /> Copy Prompt</>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Load More Button */}
      {visibleCount < filteredPrompts.length && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
          <button 
            onClick={handleLoadMore}
            className="btn btn-primary"
            style={{ padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}
          >
            <ChevronDown size={20} /> Load More Prompts
          </button>
        </div>
      )}

      {/* Empty State */}
      {filteredPrompts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <Search size={48} style={{ opacity: 0.5 }} />
          </div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No prompts found</h2>
          <p>Try adjusting your search or selecting a different category.</p>
        </div>
      )}
    </div>
  );
};

export default Prompts;
