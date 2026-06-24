import React from 'react';
import { Flame, Zap, Award } from 'lucide-react';
import Hero from '../components/Hero';
import ToolCard from '../components/ToolCard';
import CategoryCard from '../components/CategoryCard';
import toolsData from '../data/tools.json';
import categoriesData from '../data/categories.json';

const Home = () => {
  // Extract lists based on the newly added dynamic badges
  const trendingTools = toolsData.filter(tool => tool.badges?.includes('Trending')).slice(0, 6);
  const newTools = toolsData.filter(tool => tool.badges?.includes('New')).slice(0, 6);
  const editorPicks = toolsData.filter(tool => tool.badges?.includes('Editor Choice')).slice(0, 6);

  return (
    <div className="home-page">
      <Hero />
      
      {/* Editor's Choice Section */}
      <section className="section-padding container animate-reveal">
        <div className="section-header">
          <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
            <Award className="text-yellow-400" size={32} /> Editor's Choice
          </h2>
          <p className="section-subtitle">Hand-selected premium AI tools that our team uses daily.</p>
        </div>
        <div className="tools-grid">
          {editorPicks.map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* Trending Today Section */}
      <section className="section-padding container animate-reveal" style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-xl)' }}>
        <div className="section-header">
          <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
            <Flame className="text-orange-400" size={32} /> Trending Today
          </h2>
          <p className="section-subtitle">The most popular and highly-viewed AI tools right now.</p>
        </div>
        <div className="tools-grid">
          {trendingTools.map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* New This Week Section */}
      <section className="section-padding container animate-reveal">
        <div className="section-header">
          <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
            <Zap className="text-green-400" size={32} /> New This Week
          </h2>
          <p className="section-subtitle">Freshly added, cutting-edge AI models discovered this week.</p>
        </div>
        <div className="tools-grid">
          {newTools.map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="section-padding container animate-reveal">
        <div className="section-header">
          <h2 className="section-title">Explore Categories</h2>
          <p className="section-subtitle">Browse tools by what they can do for you.</p>
        </div>
        <div className="categories-grid">
          {categoriesData.map(category => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="section-padding container animate-reveal">
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
