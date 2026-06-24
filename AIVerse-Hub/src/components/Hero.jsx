import React from 'react';
import { Link } from 'react-router-dom';
import { Search, PlusCircle, Sparkles, Code, PenTool, Image as ImageIcon } from 'lucide-react';
import toolsData from '../data/tools.json';
import categoriesData from '../data/categories.json';

const Hero = () => {
  return (
    <section className="hero-section section-padding" style={{
      textAlign: 'center',
      minHeight: '90vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      paddingTop: '160px',
      overflow: 'hidden'
    }}>
      {/* Dynamic Animated Background Glows */}
      <div className="animate-pulse-glow" style={{
        position: 'absolute',
        top: '10%',
        left: '15%',
        width: '400px',
        height: '400px',
        background: 'var(--accent-primary)',
        filter: 'blur(120px)',
        borderRadius: '50%',
        zIndex: '-1'
      }}></div>
      <div className="animate-pulse-glow" style={{
        position: 'absolute',
        bottom: '10%',
        right: '15%',
        width: '350px',
        height: '350px',
        background: 'var(--accent-secondary)',
        filter: 'blur(120px)',
        borderRadius: '50%',
        zIndex: '-1',
        animationDelay: '2s'
      }}></div>
      
      <div className="container animate-reveal">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--glass-bg)', padding: '0.5rem 1rem', borderRadius: '50px', border: '1px solid var(--glass-border)', color: 'var(--accent-primary)', fontWeight: '600', marginBottom: '2rem', fontSize: '0.9rem' }}>
          <Sparkles size={16} /> Welcome to the Future of Work
        </div>

        <h1 className="section-title" style={{ fontSize: '4.5rem', maxWidth: '1000px', margin: '0 auto 1.5rem', letterSpacing: '-1.5px', lineHeight: '1.1' }}>
          Discover the Best <span className="gradient-text">AI Tools</span> for Every Task
        </h1>
        
        <p className="section-subtitle" style={{ fontSize: '1.25rem', marginBottom: '3rem', maxWidth: '700px', lineHeight: '1.7' }}>
          Find, compare, and review the top AI applications. Elevate your productivity with our curated directory of the world's most powerful AI models.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '5rem', flexWrap: 'wrap' }}>
          <Link to="/tools" className="btn btn-primary animate-float" style={{ padding: '1.2rem 2.5rem', fontSize: '1.1rem', borderRadius: '50px' }}>
            <Search size={20} />
            Explore {toolsData.length}+ Tools
          </Link>
          <Link to="/submit" className="btn btn-secondary" style={{ padding: '1.2rem 2.5rem', fontSize: '1.1rem', borderRadius: '50px' }}>
            <PlusCircle size={20} />
            Submit a Tool
          </Link>
        </div>

        {/* Dynamic Statistics Grid */}
        <div className="glass-panel" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          padding: '2.5rem',
          maxWidth: '900px',
          margin: '0 auto 5rem'
        }}>
          <div>
            <h3 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>{toolsData.length.toLocaleString()}+</h3>
            <p style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Curated AI Tools</p>
          </div>
          <div>
            <h3 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>{categoriesData.length}+</h3>
            <p style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Smart Categories</p>
          </div>
          <div>
            <h3 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>100%</h3>
            <p style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Community Driven</p>
          </div>
        </div>

        {/* Trusted By & Logos */}
        <div style={{ marginTop: '4rem' }}>
          <p style={{ color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.85rem', marginBottom: '2rem' }}>
            Trusted by Creators, Developers & Startups building with
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '3rem', flexWrap: 'wrap', opacity: '0.6', filter: 'grayscale(100%)', transition: 'all 0.3s ease' }}>
            {/* Fake Logos using standard fonts/icons for premium look */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
              <Sparkles /> OpenAI
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
              <Code /> Anthropic
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
              <Search /> Google
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
              <ImageIcon /> Midjourney
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
              <PenTool /> Runway
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
