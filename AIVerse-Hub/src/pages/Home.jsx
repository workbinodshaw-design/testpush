import React, { useState, useEffect } from 'react';
import { Flame, Zap, Award, Loader2 } from 'lucide-react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import Hero from '../components/Hero';
import ToolCard from '../components/ToolCard';
import CategoryCard from '../components/CategoryCard';
import categoriesData from '../data/categories.json';
import { motion } from 'framer-motion';

const Home = () => {
  const [trendingTools, setTrendingTools] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dynamically fetch the Top 12 Tools from Firestore (Production RAG)
  useEffect(() => {
    const fetchTools = async () => {
      try {
        const toolsRef = collection(db, 'tools');
        // Sort by upvotes (highest first), limit to 12 to save Firestore quota
        const q = query(toolsRef, orderBy('upvotes', 'desc'), limit(12));
        
        const snapshot = await getDocs(q);
        const liveTools = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTrendingTools(liveTools);
      } catch (error) {
        console.error("Error fetching tools from cloud:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTools();
  }, []);

  return (
    <div className="home-page">
      <Hero />
      
      {/* Trending Today Section (LIVE CLOUD DATA) */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="section-padding container" 
        style={{ position: 'relative', zIndex: 1 }}
      >
        <div className="section-header">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(93, 13, 24, 0.1)', color: '#5D0D18', padding: '0.5rem 1rem', borderRadius: '2rem', fontWeight: 600, marginBottom: '1rem' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#5D0D18', animation: 'pulse-glow 2s infinite' }}></span>
            LIVE CLOUD DATABASE
          </div>
          <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
            <Flame style={{ color: '#5D0D18' }} size={40} /> Trending Today
          </h2>
          <p className="section-subtitle">The most upvoted and popular AI tools around the globe right now.</p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <Loader2 className="animate-spin" style={{ color: '#5D0D18' }} size={48} />
          </div>
        ) : (
          <div className="tools-grid">
            {trendingTools.map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}
      </motion.section>

      {/* Categories Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="section-padding container"
      >
        <div className="section-header">
          <h2 className="section-title">Explore Categories</h2>
          <p className="section-subtitle">Browse over 3,000 tools by what they can do for you.</p>
        </div>
        <div className="categories-grid">
          {categoriesData.map(category => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </motion.section>
      
      {/* Premium Newsletter Section */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="section-padding container"
      >
        <div className="glass-panel" style={{ 
          padding: 'clamp(3rem, 8vw, 5rem) clamp(1.5rem, 5vw, 3rem)', 
          textAlign: 'center', 
          background: 'linear-gradient(135deg, rgba(93, 13, 24, 0.03) 0%, rgba(159, 178, 172, 0.1) 100%)',
          border: '1px solid var(--accent-secondary)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative blur inside newsletter */}
          <div style={{ position: 'absolute', top: '-50%', left: '-10%', width: '100%', height: '200%', background: 'radial-gradient(circle, rgba(93,13,24,0.05) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }}></div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 className="section-title" style={{ color: 'var(--text-primary)' }}>Stay Updated with Latest AI Tools</h2>
            <p className="section-subtitle" style={{ marginBottom: '2.5rem' }}>Get a weekly digest of the newest and most powerful AI tools delivered to your inbox.</p>
            <form style={{ display: 'flex', gap: '1rem', maxWidth: '550px', margin: '0 auto', position: 'relative', flexDirection: 'column' }} onSubmit={(e) => e.preventDefault()}>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  style={{ 
                    flexGrow: 1, 
                    padding: '1.2rem 1.5rem', 
                    borderRadius: '3rem', 
                    border: '1px solid var(--glass-border)', 
                    background: 'var(--card-bg)', 
                    color: 'var(--text-primary)', 
                    fontFamily: 'inherit',
                    outline: 'none', 
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    minWidth: '0'
                  }}
                  required
                />
                <button type="submit" className="btn btn-primary" style={{ flexGrow: 1, padding: '1.2rem 2.5rem', fontSize: '1.1rem' }}>Subscribe</button>
              </div>
            </form>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
