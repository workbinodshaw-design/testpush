import React, { useState } from 'react';
import { Copy, CheckCircle, Search, Filter } from 'lucide-react';
import promptsData from '../data/prompts.json';

const Prompts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedId, setCopiedId] = useState(null);

  const categories = ['All', ...new Set(promptsData.map(p => p.category))];

  const filteredPrompts = promptsData.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="container section-padding" style={{ paddingTop: '120px', minHeight: '80vh' }}>
      <div className="section-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="section-title">Ultimate <span className="gradient-text">Prompt Library</span></h1>
        <p className="section-subtitle">Supercharge your workflow with our hand-curated collection of advanced prompts.</p>
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
            placeholder="Search prompts..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '100%' }}
          />
        </div>
      </div>

      {/* Prompts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
        {filteredPrompts.map(prompt => (
          <div key={prompt.id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
              <span className="badge badge-category" style={{ marginBottom: '1rem', display: 'inline-block' }}>{prompt.category}</span>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{prompt.title}</h3>
            </div>
            
            <div style={{ padding: '1.5rem', flexGrow: 1, background: 'var(--bg-tertiary)', position: 'relative' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                {prompt.prompt}
              </p>
            </div>
            
            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => handleCopy(prompt.id, prompt.prompt)}
                className="btn btn-secondary" 
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}
              >
                {copiedId === prompt.id ? (
                  <><CheckCircle size={16} className="text-green-400" /> Copied!</>
                ) : (
                  <><Copy size={16} /> Copy Prompt</>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredPrompts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
          <p>No prompts found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Prompts;
