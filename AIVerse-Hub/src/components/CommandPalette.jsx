import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Command, Code, PenTool, ImageIcon, Video, Box } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toolsData from '../data/tools.json';

const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    const handleCustomEvent = () => setIsOpen(true);
    window.addEventListener('open-command-palette', handleCustomEvent);
    return () => window.removeEventListener('open-command-palette', handleCustomEvent);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    } else {
      setSearchQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = toolsData.filter(tool => 
      tool.name.toLowerCase().includes(query) || 
      tool.description.toLowerCase().includes(query) ||
      tool.category.toLowerCase().includes(query)
    ).slice(0, 5); // Limit to 5 results for speed
    
    setResults(filtered);
  }, [searchQuery]);

  const handleSelect = (toolId) => {
    setIsOpen(false);
    navigate(`/tool/${toolId}`);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(4px)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      paddingTop: '10vh'
    }}>
      <div style={{
        background: 'var(--bg-secondary)',
        width: '100%',
        maxWidth: '600px',
        borderRadius: 'var(--radius-xl)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        border: '1px solid var(--glass-border)',
        overflow: 'hidden'
      }}>
        {/* Search Input */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
          <Search size={24} style={{ color: 'var(--text-secondary)', marginRight: '1rem' }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search tools, categories, or prompts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flexGrow: 1,
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '1.2rem',
              outline: 'none'
            }}
          />
          <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', background: 'var(--bg-tertiary)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>ESC</span>
            <X size={20} />
          </button>
        </div>

        {/* Results */}
        <div style={{ padding: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
          {results.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600', padding: '0.5rem', textTransform: 'uppercase' }}>Tools</p>
              {results.map(tool => (
                <div 
                  key={tool.id} 
                  onClick={() => handleSelect(tool.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    borderRadius: 'var(--radius-lg)',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <img src={tool.logo} alt="" style={{ width: '40px', height: '40px', borderRadius: '8px' }} />
                  <div>
                    <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.05rem' }}>{tool.name}</h4>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{tool.category} • {tool.pricing}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : searchQuery.trim() ? (
            <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No results found for "{searchQuery}"</p>
          ) : (
            <div style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
              <p style={{ fontSize: '0.85rem', fontWeight: '600', paddingBottom: '0.5rem', textTransform: 'uppercase' }}>Suggestions</p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span onClick={() => setSearchQuery('video')} style={{ background: 'var(--bg-tertiary)', padding: '0.5rem 1rem', borderRadius: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Video size={14}/> Video Generation</span>
                <span onClick={() => setSearchQuery('code')} style={{ background: 'var(--bg-tertiary)', padding: '0.5rem 1rem', borderRadius: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Code size={14}/> AI Coding</span>
                <span onClick={() => setSearchQuery('write')} style={{ background: 'var(--bg-tertiary)', padding: '0.5rem 1rem', borderRadius: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><PenTool size={14}/> AI Writing</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div style={{ padding: '0.75rem 1.5rem', background: 'var(--bg-tertiary)', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'center', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>Search by Name, Category, or Functionality</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
