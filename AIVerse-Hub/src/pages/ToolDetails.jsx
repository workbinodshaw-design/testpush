import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, CheckCircle, ExternalLink, ArrowLeft } from 'lucide-react';
import toolsData from '../data/tools.json';

const ToolDetails = () => {
  const { id } = useParams();
  const tool = toolsData.find(t => t.id === id);

  if (!tool) {
    return (
      <div className="container section-padding" style={{ paddingTop: '120px', textAlign: 'center', minHeight: '80vh' }}>
        <h1>Tool Not Found</h1>
        <Link to="/tools" className="btn btn-primary" style={{ marginTop: '2rem' }}>Back to Tools</Link>
      </div>
    );
  }

  return (
    <div className="container section-padding" style={{ paddingTop: '120px', minHeight: '80vh' }}>
      
      <Link to="/tools" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        <ArrowLeft size={16} /> Back to directory
      </Link>

      <div className="glass-panel" style={{ padding: '3rem', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <img src={tool.logo} alt={tool.name} style={{ width: '120px', height: '120px', borderRadius: '20px', background: 'var(--bg-secondary)', padding: '1rem', border: '1px solid var(--glass-border)' }} />
          
          <div style={{ flexGrow: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{tool.name}</h1>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
                  <span className="badge badge-category">{tool.category}</span>
                  <span className="badge badge-pricing">{tool.pricing}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--warning)', fontWeight: '600' }}>
                    <Star size={16} fill="currentColor" /> {tool.rating} <span style={{ color: 'var(--text-secondary)', fontWeight: '400' }}>({tool.reviews} reviews)</span>
                  </div>
                </div>
              </div>
              <a href={tool.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
                Visit Website <ExternalLink size={18} />
              </a>
            </div>
            
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '800px', lineHeight: '1.8' }}>
              {tool.description}
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Key Features</h2>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {['Incredibly fast processing', 'Intuitive and easy to use UI', 'Seamless integration with existing workflows', '24/7 customer support'].map((feature, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                <CheckCircle size={20} color="var(--success)" /> {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Pricing</h2>
          <div style={{ background: 'var(--bg-tertiary)', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid var(--glass-border)' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>{tool.pricing}</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Check official website for detailed tier pricing.</p>
            <a href={tool.url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ width: '100%' }}>View Pricing Plans</a>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ToolDetails;
