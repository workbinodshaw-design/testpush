import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import ToolCard from '../components/ToolCard';
import CategoryCard from '../components/CategoryCard';
import toolsData from '../data/tools.json';
import categoriesData from '../data/categories.json';

const Home = () => {
  const featuredTools = toolsData.filter(tool => tool.featured).slice(0, 6);

  return (
    <div className="home-page">
      <Hero />
      
      {/* Categories Section */}
      <section className="section-padding container">
        <div className="section-header">
          <h2 className="section-title">Popular Categories</h2>
          <p className="section-subtitle">Browse tools by what they can do for you.</p>
        </div>
        <div className="categories-grid">
          {categoriesData.map(category => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Featured Tools Section */}
      <section className="section-padding container">
        <div className="section-header">
          <h2 className="section-title">Featured <span className="gradient-text">AI Tools</span></h2>
          <p className="section-subtitle">Hand-picked top tier AI tools that you must try.</p>
        </div>
        <div className="tools-grid">
          {featuredTools.map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="section-padding container">
        <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', background: 'linear-gradient(to right, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))' }}>
          <h2 className="section-title">Stay Updated with Latest AI Tools</h2>
          <p className="section-subtitle" style={{ marginBottom: '2rem' }}>Get a weekly digest of the newest and most powerful AI tools delivered to your inbox.</p>
          <form style={{ display: 'flex', gap: '1rem', maxWidth: '500px', margin: '0 auto' }} onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              style={{ flexGrow: 1, padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              required
            />
            <button type="submit" className="btn btn-primary">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
