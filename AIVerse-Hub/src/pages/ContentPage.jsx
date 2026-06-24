import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import pagesContent from '../data/pagesContent.json';

const ContentPage = ({ pageKey }) => {
  const content = pagesContent[pageKey] || {
    title: "Page Not Found",
    description: "The page you are looking for does not exist.",
    paragraphs: ["Please navigate back to the home page."]
  };

  return (
    <div className="container section-padding" style={{ paddingTop: '120px', minHeight: '80vh' }}>
      <div className="glass-panel" style={{ padding: '4rem', maxWidth: '800px', margin: '0 auto' }}>
        
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <h1 className="section-title gradient-text" style={{ textAlign: 'left' }}>{content.title}</h1>
        <p className="section-subtitle" style={{ marginBottom: '3rem', textAlign: 'left' }}>
          {content.description}
        </p>

        <div style={{ color: 'var(--text-primary)', lineHeight: '1.8', fontSize: '1.1rem' }}>
          {content.paragraphs.map((p, index) => (
            <p key={index} style={{ marginBottom: '1.5rem' }}>{p}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentPage;
