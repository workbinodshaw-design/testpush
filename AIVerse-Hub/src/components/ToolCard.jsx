import React, { useState, useEffect } from 'react';
import { Star, ExternalLink, Bookmark, CheckCircle, Flame, Award, Zap, Diamond, BookmarkCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const getBadgeIcon = (badge) => {
  switch(badge) {
    case 'Verified': return <CheckCircle size={12} className="text-blue-400" />;
    case 'Trending': return <Flame size={12} className="text-orange-400" />;
    case 'Editor Choice': return <Award size={12} className="text-yellow-400" />;
    case 'New': return <Zap size={12} className="text-green-400" />;
    case 'Premium': return <Diamond size={12} className="text-purple-400" />;
    case 'Sponsored': return <span style={{ fontSize: '10px' }}>AD</span>;
    default: return null;
  }
};

const getBadgeColor = (badge) => {
  switch(badge) {
    case 'Verified': return 'rgba(59, 130, 246, 0.1)';
    case 'Trending': return 'rgba(249, 115, 22, 0.1)';
    case 'Editor Choice': return 'rgba(234, 179, 8, 0.1)';
    case 'New': return 'rgba(34, 197, 94, 0.1)';
    case 'Premium': return 'rgba(168, 85, 247, 0.1)';
    case 'Sponsored': return 'rgba(255, 255, 255, 0.05)';
    default: return 'var(--glass-bg)';
  }
};

const ToolCard = ({ tool }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('bookmarkedTools') || '[]');
    setIsBookmarked(saved.includes(tool.id));
  }, [tool.id]);

  const toggleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    let saved = JSON.parse(localStorage.getItem('bookmarkedTools') || '[]');
    if (saved.includes(tool.id)) {
      saved = saved.filter(id => id !== tool.id);
      setIsBookmarked(false);
    } else {
      saved.push(tool.id);
      setIsBookmarked(true);
    }
    localStorage.setItem('bookmarkedTools', JSON.stringify(saved));
  };

  return (
    <div className="tool-card glass-panel" style={{ transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden' }}>
      <div className="tool-header">
        <div className="tool-logo-name">
          <img src={tool.logo} alt={tool.name} className="tool-logo" />
          <div>
            <h3 className="tool-name" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {tool.name}
            </h3>
            <div className="tool-badges" style={{ marginTop: '0.25rem' }}>
              <span className="badge badge-category">{tool.category}</span>
              <span className="badge badge-pricing">{tool.pricing}</span>
            </div>
          </div>
        </div>
        <button 
          onClick={toggleBookmark}
          className="btn btn-secondary" 
          style={{ padding: '0.5rem', borderRadius: '50%', color: isBookmarked ? 'var(--accent-primary)' : 'inherit', border: isBookmarked ? '1px solid var(--accent-primary)' : '' }} 
          title={isBookmarked ? "Remove Bookmark" : "Save Tool"}
        >
          {isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
        </button>
      </div>

      {/* Dynamic Visual Badges */}
      {tool.badges && tool.badges.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '1rem', marginBottom: '0.5rem' }}>
          {tool.badges.map(badge => (
            <span key={badge} style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.7rem',
              fontWeight: '600',
              padding: '0.2rem 0.5rem',
              borderRadius: '50px',
              background: getBadgeColor(badge),
              border: '1px solid var(--glass-border)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {getBadgeIcon(badge)}
              {badge}
            </span>
          ))}
        </div>
      )}
      
      <p className="tool-desc" style={{ marginTop: tool.badges?.length ? '0.5rem' : '1rem' }}>
        {tool.description}
      </p>
      
      <div className="tool-footer">
        <div className="tool-rating" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Star size={16} fill="var(--warning)" color="var(--warning)" />
          <span style={{ fontWeight: '600' }}>{tool.rating}</span>
          <span className="tool-reviews" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>({tool.reviews.toLocaleString()})</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link to={`/tool/${tool.id}`} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
            Details
          </Link>
          <a href={tool.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
            Visit <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ToolCard;
