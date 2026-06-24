import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Filter, Star, ArrowDownAZ, ArrowUpAZ, Loader } from 'lucide-react';
import ToolCard from '../components/ToolCard';
import toolsData from '../data/tools.json';
import categoriesData from '../data/categories.json';

const Tools = () => {
  const location = useLocation();
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minRating, setMinRating] = useState(0);
  const [sortOption, setSortOption] = useState('default');
  const [visibleCount, setVisibleCount] = useState(24);

  // Read from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('query');
    if (query) {
      setSearchInput(query);
      setSearchTerm(query);
    }
  }, [location.search]);

  // Debounce search input to fix lag when typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setVisibleCount(24); // Reset pagination on new search
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(24);
  }, [selectedCategory, minRating, sortOption]);

  // Apply Filtering
  let filteredTools = toolsData.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    const matchesRating = parseFloat(tool.rating) >= minRating;
    return matchesSearch && matchesCategory && matchesRating;
  });

  // Apply Sorting
  if (sortOption === 'rating-desc') {
    filteredTools.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
  } else if (sortOption === 'rating-asc') {
    filteredTools.sort((a, b) => parseFloat(a.rating) - parseFloat(b.rating));
  } else if (sortOption === 'reviews-desc') {
    filteredTools.sort((a, b) => b.reviews - a.reviews);
  }

  const visibleTools = filteredTools.slice(0, visibleCount);
  const hasMore = visibleCount < filteredTools.length;

  return (
    <div className="container section-padding" style={{ paddingTop: '120px', minHeight: '80vh' }}>
      <div className="section-header">
        <h1 className="section-title">Discover <span className="gradient-text">AI Tools</span></h1>
        <p className="section-subtitle">Search, filter, and compare {toolsData.length}+ AI tools to find exactly what you need.</p>
      </div>

      <div className="search-filters glass-panel" style={{ padding: '1.5rem', marginBottom: '3rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        {/* Top Row: Search */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="search-bar" style={{ flex: '1', display: 'flex', alignItems: 'center', background: 'var(--bg-tertiary)', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
            <Search size={20} style={{ color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search tools by keywords..." 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', marginLeft: '0.75rem', outline: 'none', width: '100%', fontSize: '1rem' }}
            />
          </div>
        </div>

        {/* Bottom Row: Filters & Sorting */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          
          {/* Category Filter */}
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-tertiary)', borderRadius: '12px', padding: '0.5rem 1rem', border: '1px solid var(--glass-border)', flex: '1', minWidth: '150px' }}>
            <Filter size={16} style={{ color: 'var(--text-secondary)', marginRight: '0.5rem' }} />
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer', width: '100%' }}
            >
              <option value="All" style={{ background: 'var(--bg-primary)' }}>All Categories</option>
              {categoriesData.map(cat => (
                <option key={cat.id} value={cat.name} style={{ background: 'var(--bg-primary)' }}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Rating Filter */}
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-tertiary)', borderRadius: '12px', padding: '0.5rem 1rem', border: '1px solid var(--glass-border)', flex: '1', minWidth: '150px' }}>
            <Star size={16} style={{ color: 'var(--text-secondary)', marginRight: '0.5rem' }} />
            <select 
              value={minRating} 
              onChange={(e) => setMinRating(parseFloat(e.target.value))}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer', width: '100%' }}
            >
              <option value={0} style={{ background: 'var(--bg-primary)' }}>Any Rating</option>
              <option value={4.0} style={{ background: 'var(--bg-primary)' }}>4.0 & Up</option>
              <option value={4.5} style={{ background: 'var(--bg-primary)' }}>4.5 & Up</option>
            </select>
          </div>

          {/* Sort Options */}
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-tertiary)', borderRadius: '12px', padding: '0.5rem 1rem', border: '1px solid var(--glass-border)', flex: '1', minWidth: '150px' }}>
            <ArrowDownAZ size={16} style={{ color: 'var(--text-secondary)', marginRight: '0.5rem' }} />
            <select 
              value={sortOption} 
              onChange={(e) => setSortOption(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer', width: '100%' }}
            >
              <option value="default" style={{ background: 'var(--bg-primary)' }}>Sort: Default</option>
              <option value="rating-desc" style={{ background: 'var(--bg-primary)' }}>Rating: High to Low</option>
              <option value="rating-asc" style={{ background: 'var(--bg-primary)' }}>Rating: Low to High</option>
              <option value="reviews-desc" style={{ background: 'var(--bg-primary)' }}>Most Reviews</option>
            </select>
          </div>

        </div>
      </div>

      <div className="tools-grid">
        {visibleTools.length > 0 ? (
          visibleTools.map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 0' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No tools found</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      {hasMore && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
          <button 
            className="btn btn-primary" 
            onClick={() => setVisibleCount(prev => prev + 24)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            Load More <ArrowDownAZ size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Tools;
