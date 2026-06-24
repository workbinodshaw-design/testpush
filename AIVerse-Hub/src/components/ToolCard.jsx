import React from 'react';
import { Star, ExternalLink, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';

const ToolCard = ({ tool }) => {
  return (
    <div className="tool-card glass-panel">
      <div className="tool-header">
        <div className="tool-logo-name">
          <img src={tool.logo} alt={tool.name} className="tool-logo" />
          <div>
            <h3 className="tool-name">{tool.name}</h3>
            <div className="tool-badges">
              <span className="badge badge-category">{tool.category}</span>
              <span className="badge badge-pricing">{tool.pricing}</span>
            </div>
          </div>
        </div>
        <button className="btn btn-secondary" style={{ padding: '0.5rem', borderRadius: '50%' }}>
          <Bookmark size={16} />
        </button>
      </div>
      
      <p className="tool-desc">{tool.description}</p>
      
      <div className="tool-footer">
        <div className="tool-rating">
          <Star size={16} fill="currentColor" />
          <span>{tool.rating}</span>
          <span className="tool-reviews">({tool.reviews})</span>
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
