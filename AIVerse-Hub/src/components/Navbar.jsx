import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, Sparkles, UserCircle, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          {currentUser?.email === 'work.binodshaw@gmail.com' && (
            <Link 
              to="/admin" 
              className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: '#ef4444', fontWeight: 'bold' }}
            >
              Admin Panel
            </Link>
          )}
          <Link 
            to="/ai-assistant" 
            className={`nav-link ${location.pathname === '/ai-assistant' ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-primary)', fontWeight: 'bold' }}
          >
            <Sparkles size={16} /> AI Assistant
          </Link>
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
            <span className="hide-mobile" style={{ fontSize: '0.9rem' }}>Search...</span>
            <span className="hide-mobile" style={{ fontSize: '0.7rem', background: 'var(--bg-secondary)', padding: '0.1rem 0.3rem', borderRadius: '4px', border: '1px solid var(--glass-border)' }}>Ctrl+K</span>
          </button>

          <Link to="/submit" className="btn btn-primary hide-mobile" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem', borderRadius: '20px' }}>
            Submit Tool
          </Link>

          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: '500' }}>
                <UserCircle size={20} style={{ color: 'var(--accent-primary)' }} />
                <span className="hide-mobile">{currentUser.displayName || 'User'}</span>
              </div>
              <button 
                onClick={() => logout()}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                title="Log Out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem', borderRadius: '20px', marginLeft: '0.5rem' }}>
              Log In
            </Link>
          )}
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
