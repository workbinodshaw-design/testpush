import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, CheckCircle, ExternalLink, ArrowLeft, ThumbsUp, ThumbsDown, Bookmark, BookmarkCheck } from 'lucide-react';
import toolsData from '../data/tools.json';
import ToolCard from '../components/ToolCard';

const ToolDetails = () => {
  const { id } = useParams();
  const tool = toolsData.find(t => t.id === id);

  useEffect(() => {
    if (tool) {
      const recentIds = JSON.parse(localStorage.getItem('recentlyViewedTools') || '[]');
      const updated = [tool.id, ...recentIds.filter(recentId => recentId !== tool.id)].slice(0, 10);
      localStorage.setItem('recentlyViewedTools', JSON.stringify(updated));
    }
  }, [tool]);

  if (!tool) {
    return (
      <div className="container section-padding" style={{ paddingTop: '120px', textAlign: 'center', minHeight: '80vh' }}>
        <h1>Tool Not Found</h1>
        <Link to="/tools" className="btn btn-primary" style={{ marginTop: '2rem' }}>Back to Tools</Link>
      </div>
    );
  }

  // Get alternatives from db
  const alternativeTools = tool.alternatives 
    ? toolsData.filter(t => tool.alternatives.map(a => a.id).includes(t.id)) 
    : [];

  return (
    <div className="container section-padding" style={{ paddingTop: '120px', minHeight: '80vh' }}>
      
      <Link to="/tools" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        <ArrowLeft size={16} /> Back to directory
      </Link>

      {/* Hero Header */}
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
                    <Star size={16} fill="currentColor" /> {tool.rating} <span style={{ color: 'var(--text-secondary)', fontWeight: '400' }}>({tool.reviews.toLocaleString()} reviews)</span>
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

      {/* Screenshots and Video Demo */}
      {(tool.screenshots || tool.videoDemo) && (
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.8rem' }}>Screenshots & Demo</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            {tool.videoDemo && (
              <iframe 
                width="100%" 
                height="250" 
                src={tool.videoDemo} 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
                style={{ borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}
              ></iframe>
            )}
            {tool.screenshots?.map((img, idx) => (
              <img key={idx} src={img} alt={`${tool.name} screenshot ${idx+1}`} style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }} />
            ))}
          </div>
        </div>
      )}

      {/* Pros and Cons */}
      {(tool.pros || tool.cons) && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '4rem' }}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--success)' }}>
              <ThumbsUp size={24} /> Pros
            </h2>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {tool.pros?.map((pro, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                  <CheckCircle size={20} className="text-green-400" /> {pro}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--danger)' }}>
              <ThumbsDown size={24} /> Cons
            </h2>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {tool.cons?.map((con, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                  <CheckCircle size={20} className="text-red-400" /> {con}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Alternatives */}
      {alternativeTools.length > 0 && (
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.8rem' }}>Alternatives to {tool.name}</h2>
          <div className="tools-grid">
            {alternativeTools.map(altTool => (
              <ToolCard key={altTool.id} tool={altTool} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default ToolDetails;
