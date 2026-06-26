import React, { useState } from 'react';
import { Copy, CheckCircle } from 'lucide-react';

const PromptRecommendationCard = ({ prompt }) => {
  const [copied, setCopied] = useState(false);

  if (!prompt) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      background: 'var(--bg-primary)',
      border: '1px solid var(--glass-border)',
      borderRadius: '8px',
      padding: '1rem',
      marginTop: '0.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{prompt.title}</h4>
        <span className="badge badge-category" style={{ fontSize: '0.7rem' }}>{prompt.category}</span>
      </div>
      
      <p style={{ 
        margin: 0, 
        fontSize: '0.85rem', 
        color: 'var(--text-secondary)', 
        fontFamily: 'monospace',
        background: 'var(--bg-tertiary)',
        padding: '0.75rem',
        borderRadius: '4px',
        whiteSpace: 'pre-wrap',
        maxHeight: '150px',
        overflowY: 'auto'
      }}>
        {prompt.prompt}
      </p>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
        <button 
          onClick={handleCopy}
          className="btn btn-secondary" 
          style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
        >
          {copied ? <><CheckCircle size={14} className="text-green-400" /> Copied</> : <><Copy size={14} /> Copy</>}
        </button>
      </div>
    </div>
  );
};

export default PromptRecommendationCard;
