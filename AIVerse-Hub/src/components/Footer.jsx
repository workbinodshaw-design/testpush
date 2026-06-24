import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Globe, Mail, Share2 } from 'lucide-react';
import '../styles/footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          
          <div className="footer-brand">
            <h3>
              <div className="logo-icon" style={{ width: '30px', height: '30px' }}>
                <Sparkles size={16} />
              </div>
              AIVerse Hub
            </h3>
            <p>Your ultimate directory for discovering the most powerful and innovative AI tools to 10x your productivity.</p>
            <div className="social-links">
              <a href="#" className="social-link"><Globe size={18} /></a>
              <a href="#" className="social-link"><Share2 size={18} /></a>
              <a href="#" className="social-link"><Mail size={18} /></a>
            </div>
          </div>

          <div className="footer-links">
            <h4>Platform</h4>
            <ul>
              <li><Link to="/tools">Browse Tools</Link></li>
              <li><Link to="/categories">Categories</Link></li>
              <li><Link to="/submit">Submit Tool</Link></li>
              <li><Link to="/trending">Trending</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Resources</h4>
            <ul>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/help">Help Center</Link></li>
              <li><Link to="/api">API</Link></li>
              <li><Link to="/community">Community</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Legal</h4>
            <ul>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/cookies">Cookie Policy</Link></li>
            </ul>
          </div>
          
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} AIVerse Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
