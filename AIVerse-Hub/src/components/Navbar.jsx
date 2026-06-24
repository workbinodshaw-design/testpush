import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Moon, Sun, Menu, X, Search, Sparkles, UserCircle } from 'lucide-react';
import '../styles/navbar.css';

const Navbar = () => {
  const [isDark, setIsDark] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
  };

  const openPalette = () => {
    window.dispatchEvent(new Event('open-command-palette'));
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'AI Tools', path: '/tools' },
    { name: 'Prompts', path: '/prompts' },
    { name: 'Compare', path: '/compare' },
    { name: 'Dashboard', path: '/dashboard' },
  ];

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <Link to="/" className="logo-container">
          <div className="logo-icon">
            <Sparkles size={20} />
          </div>
          <span>AIVerse Hub</span>
        </Link>

        <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="nav-actions">
          {/* CMD+K Trigger Button */}
          <button 
            onClick={openPalette}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.5rem', 
              background: 'var(--bg-tertiary)', borderRadius: '20px', 
              padding: '0.4rem 1rem', border: '1px solid var(--glass-border)',
              color: 'var(--text-secondary)', cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
          >
            <Search size={16} />
            <span style={{ fontSize: '0.9rem' }}>Search...</span>
            <span style={{ fontSize: '0.7rem', background: 'var(--bg-secondary)', padding: '0.1rem 0.3rem', borderRadius: '4px', border: '1px solid var(--glass-border)' }}>Ctrl+K</span>
          </button>

          <Link to="/submit" className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem', borderRadius: '20px' }}>
            Submit Tool
          </Link>

          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
