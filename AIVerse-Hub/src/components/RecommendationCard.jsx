import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ExternalLink } from 'lucide-react';

const RecommendationCard = ({ tool }) => {
  return (
    <div style={{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--glass-border)',
      borderRadius: 'var(--radius-md)',
      padding: '1rem',
      display: 'flex',
      gap: '1rem',
      alignItems: 'center',
      marginBottom: '0.75rem',
      transition: 'transform 0.2s, border-color 0.2s',
      cursor: 'pointer',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.borderColor = 'var(--accent-primary)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'none';
      e.currentTarget.style.borderColor = 'var(--glass-border)';
    }}
    >
      <img src={tool.logo} alt={tool.name} style={{ width: '50px', height: '50px', borderRadius: '10px', background: 'var(--bg-tertiary)', padding: '0.2rem' }} />
      
      <div style={{ flexGrow: 1 }}>
        <h4 style={{ fontSize: '1.1rem', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {tool.name}
          <span className="badge badge-pricing" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>{tool.pricing}</span>
        </h4>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <span>{tool.category}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--warning)' }}>
            <Star size={12} fill="currentColor" /> {tool.rating}
          </span>
        </div>
      </div>

      <Link to={`/tool/${tool.id}`} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
        View Details
      </Link>
    </div>
  );
};

export default RecommendationCard;
