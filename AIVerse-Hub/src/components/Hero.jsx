import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, PlusCircle } from 'lucide-react';

const Hero = () => {
  return (
    <section className="hero-section section-padding" style={{
      textAlign: 'center',
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      paddingTop: '120px'
    }}>
      {/* Background glow effects */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '20%',
        width: '300px',
        height: '300px',
        background: 'var(--accent-primary)',
        filter: 'blur(100px)',
        opacity: '0.2',
        borderRadius: '50%',
        zIndex: '-1'
      }}></div>
      
      <div className="container">
        <h1 className="section-title" style={{ fontSize: '4rem', maxWidth: '900px', margin: '0 auto 1.5rem' }}>
          Discover the Best <span className="gradient-text">AI Tools</span> for Every Task
        </h1>
        
        <p className="section-subtitle" style={{ fontSize: '1.25rem', marginBottom: '3rem', maxWidth: '700px' }}>
          Find, compare, and review the top AI tools for writing, coding, image generation, video creation, productivity, and marketing.
        </p>

        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          marginBottom: '4rem'
        }}>
          <Link to="/tools" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
            <Search size={20} />
            Explore 5000+ Tools
          </Link>
          <Link to="/submit" className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
            <PlusCircle size={20} />
            Submit a Tool
          </Link>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '3rem',
          padding: '2rem',
          background: 'var(--glass-bg)',
          borderTop: '1px solid var(--glass-border)',
          borderBottom: '1px solid var(--glass-border)',
          backdropFilter: 'blur(10px)'
        }}>
          <div>
            <h3 style={{ fontSize: '2rem', color: 'var(--accent-primary)' }}>5000+</h3>
            <p style={{ color: 'var(--text-secondary)' }}>AI Tools Listed</p>
          </div>
          <div>
            <h3 style={{ fontSize: '2rem', color: 'var(--accent-secondary)' }}>100+</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Categories</p>
          </div>
          <div>
            <h3 style={{ fontSize: '2rem', color: 'var(--success)' }}>50K+</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Monthly Visitors</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
