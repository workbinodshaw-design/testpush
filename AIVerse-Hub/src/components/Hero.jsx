import React, { useCallback } from 'react';
import { Search } from 'lucide-react';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { motion } from "framer-motion";

const Hero = () => {
  const particlesInit = useCallback(async engine => {
    await loadSlim(engine);
  }, []);

  return (
    <div style={{
      backgroundColor: '#FFF9EB', // Vanilla Custard
      minHeight: '85vh',
      position: 'relative',
      overflow: 'hidden',
      color: '#2d3748',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      borderBottom: '1px solid rgba(159, 178, 172, 0.2)'
    }}>
      {/* 3D Particle Background - Vibrant & Interactive */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, opacity: 0.85 }}>
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            fullScreen: { enable: false, zIndex: 0 },
            fpsLimit: 120,
            interactivity: {
              events: { onHover: { enable: true, mode: "repulse" }, resize: true },
              modes: { repulse: { distance: 150, duration: 0.4 } },
            },
            particles: {
              color: { value: ["#9FB2AC", "#5D0D18", "#F5A623", "#2C3E50", "#E07A5F"] },
              links: { color: "#9FB2AC", distance: 150, enable: true, opacity: 0.4, width: 1 },
              move: { direction: "none", enable: true, outModes: { default: "bounce" }, random: true, speed: 1.5, straight: false },
              number: { density: { enable: true, area: 800 }, value: 65 },
              opacity: { value: 0.6 },
              shape: { type: "circle" },
              size: { value: { min: 1.5, max: 3.5 } },
            },
            detectRetina: true,
          }}
        />
      </div>

      {/* Background Blobs (Misty Sage) */}
      <motion.div 
        animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: 'absolute',
          top: '-15%',
          right: '-10%',
          width: '50vw',
          height: '50vw',
          background: '#9FB2AC',
          borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
          filter: 'blur(90px)',
          opacity: 0.35,
          zIndex: 0
        }}
      />
      {/* Background Blobs (Bloodstone) */}
      <motion.div 
        animate={{ y: [0, 25, 0], x: [0, -20, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: 'absolute',
          bottom: '-25%',
          right: '5%',
          width: '45vw',
          height: '45vw',
          background: '#5D0D18',
          borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
          filter: 'blur(110px)',
          opacity: 0.12,
          zIndex: 0
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1, height: '100%', paddingTop: 'clamp(4rem, 10vw, 8rem)', paddingBottom: '4rem' }}>
        <div className="hero-grid" style={{ gap: '4rem', alignItems: 'center' }}>
          
          {/* Left Column */}
          <div style={{ textAlign: 'left', zIndex: 2 }}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(159, 178, 172, 0.15)', border: '1px solid rgba(159, 178, 172, 0.4)', padding: '0.4rem 1.2rem', borderRadius: '2rem', marginBottom: '1.5rem', color: '#5D0D18', fontWeight: 600, fontSize: '0.85rem' }}
            >
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#5D0D18' }}></div>
              AIVerse Hub 2.0 is Live
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              style={{ fontSize: 'clamp(3rem, 6vw, 4.5rem)', fontWeight: 800, lineHeight: 1.05, marginBottom: '1.5rem', letterSpacing: '-0.03em', color: '#1a202c' }}
            >
              Discover the World's Best <br />
              <span style={{ 
                background: 'linear-gradient(135deg, #5D0D18, #9FB2AC)', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent',
                display: 'inline-block',
                paddingBottom: '0.1em'
              }}>
                Artificial Intelligence
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }}
              style={{ fontSize: '1.125rem', color: '#4a5568', marginBottom: '2.5rem', maxWidth: '540px', lineHeight: 1.6, fontWeight: 500 }}
            >
              Explore a curated database of 3,000+ top-tier AI tools, models, and agents. Find exactly what you need to 10x your workflow.
            </motion.p>
            
            {/* Search Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
              style={{ position: 'relative', maxWidth: '540px', borderRadius: '1rem', background: '#FFF9EB', border: '1px solid #9FB2AC', boxShadow: '0 4px 20px rgba(93, 13, 24, 0.05)', padding: '0.5rem', display: 'flex', alignItems: 'center', marginBottom: '3rem', transition: 'box-shadow 0.3s ease' }} 
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 8px 30px rgba(93, 13, 24, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 20px rgba(93, 13, 24, 0.05)'}
            >
              <Search size={20} style={{ color: '#9FB2AC', marginLeft: '1rem' }} />
              <input 
                type="text" 
                placeholder="Search for 'Video Generator', 'Coding Assistant'..." 
                style={{ flexGrow: 1, padding: '1rem', fontSize: '1rem', background: 'transparent', color: '#1a202c', border: 'none', outline: 'none', fontFamily: 'inherit', minWidth: 0 }} 
              />
              <button style={{ background: '#5D0D18', color: 'white', borderRadius: '14px', padding: '0.8rem 1.5rem', fontSize: '1rem', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 10px rgba(93, 13, 24, 0.2)' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.background = '#4a0a13'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = '#5D0D18'; }}
              >
                Search
              </button>
            </motion.div>

            {/* Trusted By */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.6 }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9FB2AC', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Trusted by innovators worldwide</p>
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', opacity: 0.6, filter: 'grayscale(100%)', flexWrap: 'wrap' }}>
                 <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#2d3748', letterSpacing: '-0.5px' }}>Google</span>
                 <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#2d3748', letterSpacing: '-0.5px' }}>Microsoft</span>
                 <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#2d3748', letterSpacing: '-0.5px' }}>OpenAI</span>
                 <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#2d3748', letterSpacing: '-0.5px' }}>Notion</span>
                 <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#2d3748', letterSpacing: '-0.5px' }}>Canva</span>
              </div>
            </motion.div>

          </div>

          {/* Right Column Abstract Art */}
          <div style={{ position: 'relative', height: '100%', minHeight: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="hero-abstract-art">
            <motion.div
              animate={{ y: [0, -15, 0], rotate: [0, 2, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              style={{ position: 'absolute', width: '120%', height: '120%', zIndex: 1 }}
            >
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', opacity: 0.9 }}>
                <path fill="#9FB2AC" d="M42.7,-73.4C55.9,-67.5,67.6,-56.9,76.5,-44.2C85.3,-31.5,91.3,-16.8,92.5,-1.7C93.7,13.4,90.2,28.9,81.8,41.9C73.4,54.9,60.1,65.4,45.8,71.2C31.5,77,16.2,78.1,0.9,76.5C-14.4,74.9,-29.7,70.6,-43.3,63C-56.9,55.4,-68.8,44.5,-75.6,31.2C-82.4,17.9,-84.1,2.2,-81.4,-12.7C-78.7,-27.6,-71.6,-41.7,-60.8,-52C-50,-62.3,-35.5,-68.8,-21.2,-73C-6.9,-77.2,7.2,-79.1,21.5,-77C35.8,-74.9,50.3,-68.8,42.7,-73.4Z" transform="translate(100 100)" />
              </svg>
            </motion.div>
            
            <motion.div
              animate={{ y: [0, 20, 0], scale: [1, 1.05, 1], rotate: [0, -3, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              style={{ position: 'absolute', width: '90%', height: '90%', zIndex: 2, right: '-10%', top: '10%' }}
            >
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', opacity: 0.95 }}>
                <path fill="#FFF9EB" d="M51.5,-63.9C65.5,-51.7,74.7,-33.5,78.5,-14.2C82.3,5.1,80.7,25.5,70.6,41.4C60.5,57.3,41.9,68.7,21.9,74.4C1.9,80.1,-19.5,80.1,-37.2,71.9C-54.9,63.7,-68.9,47.3,-76.3,28.7C-83.7,10.1,-84.5,-10.7,-77.6,-28.5C-70.7,-46.3,-56.1,-61.1,-40.1,-73.1C-24.1,-85.1,-6.7,-94.3,9.7,-91.3C26.1,-88.3,42.5,-73.1,51.5,-63.9Z" transform="translate(100 100)" />
              </svg>
            </motion.div>

            <motion.div
              animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              style={{ position: 'absolute', width: '50%', height: '50%', right: '5%', bottom: '5%', zIndex: 3 }}
            >
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', opacity: 0.9 }}>
                <path fill="#5D0D18" d="M37,-53.4C50.6,-45.7,66,-38.5,72.6,-25.9C79.2,-13.3,77,4.7,70,20.1C63,35.5,51.2,48.3,37.3,56C23.4,63.7,7.4,66.3,-7.4,64.2C-22.2,62.1,-35.8,55.3,-48.9,45.4C-62,35.5,-74.6,22.5,-78.9,6.7C-83.2,-9.1,-79.2,-27.7,-68.5,-41.8C-57.8,-55.9,-40.4,-65.5,-24.5,-69C-8.6,-72.5,5.8,-69.9,19.2,-64.1C32.6,-58.3,45,-49.3,37,-53.4Z" transform="translate(100 100)" />
              </svg>
            </motion.div>
            
            {/* Tiny accent dot */}
            <motion.div
              animate={{ y: [0, -8, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              style={{ position: 'absolute', width: '20px', height: '20px', left: '15%', top: '40%', background: '#F5A623', borderRadius: '50%', zIndex: 4, boxShadow: '0 0 15px rgba(245,166,35,0.4)' }}
            />
            {/* Small accent dot */}
            <motion.div
              animate={{ y: [0, 10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
              style={{ position: 'absolute', width: '35px', height: '35px', left: '25%', bottom: '25%', background: '#2C3E50', borderRadius: '50%', zIndex: 1 }}
            />
            {/* Medium accent dot */}
            <motion.div
              animate={{ y: [0, -15, 0], scale: [1, 1.15, 1], x: [0, 10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              style={{ position: 'absolute', width: '25px', height: '25px', right: '15%', top: '30%', background: '#E07A5F', borderRadius: '50%', zIndex: 3 }}
            />
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Hero;
