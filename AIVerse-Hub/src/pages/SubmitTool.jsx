import React, { useState } from 'react';
import { Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import categoriesData from '../data/categories.json';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';

const SubmitTool = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    category: '',
    description: '',
    pricing: 'Freemium'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const sanitizedData = {
        name: DOMPurify.sanitize(formData.name),
        url: DOMPurify.sanitize(formData.url),
        category: DOMPurify.sanitize(formData.category),
        description: DOMPurify.sanitize(formData.description),
        pricing: DOMPurify.sanitize(formData.pricing)
      };

      await addDoc(collection(db, 'submissions'), {
        ...sanitizedData,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        status: 'pending', // Admins will review this in the Firebase console
        createdAt: serverTimestamp()
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Submission failed:", err);
      setError("Failed to submit. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="container section-padding" style={{ paddingTop: '120px', minHeight: '80vh', textAlign: 'center' }}>
        <div className="glass-panel animate-slide-up" style={{ maxWidth: '600px', margin: '0 auto', padding: '4rem 2rem' }}>
          <div style={{ display: 'inline-flex', background: 'rgba(34, 197, 94, 0.1)', color: '#4ade80', borderRadius: '50%', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <CheckCircle2 size={48} />
          </div>
          <h2 className="section-title">Submission <span className="gradient-text">Received!</span></h2>
          <p className="section-subtitle">Your tool has been sent directly to the moderation team. We will review it shortly and add it to the live database if approved!</p>
          <button onClick={() => { setSubmitted(false); setFormData({name:'', url:'', category:'', description:'', pricing:'Freemium'}); }} className="btn btn-primary" style={{ marginTop: '2rem' }}>
            Submit Another Tool
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container section-padding" style={{ paddingTop: '120px', minHeight: '80vh' }}>
      <div className="section-header animate-reveal">
        <h1 className="section-title">Submit a <span className="gradient-text">Tool</span></h1>
        <p className="section-subtitle">Created an awesome AI tool? Submit it to our directory for thousands of daily visitors to discover.</p>
      </div>

      <div className="glass-panel animate-slide-up" style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem' }}>
        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={20} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="responsive-grid-2" style={{ gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Tool Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required style={inputStyle} placeholder="e.g. ChatGPT" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Website URL</label>
              <input type="url" name="url" value={formData.url} onChange={handleChange} required style={inputStyle} placeholder="https://" />
            </div>
          </div>

          <div className="responsive-grid-2" style={{ gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Category</label>
              <select name="category" value={formData.category} onChange={handleChange} required style={inputStyle}>
                <option value="">Select a category</option>
                {categoriesData.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Pricing Model</label>
              <select name="pricing" value={formData.pricing} onChange={handleChange} required style={inputStyle}>
                <option value="Free">100% Free</option>
                <option value="Freemium">Freemium (Has free tier)</option>
                <option value="Paid">Paid / Premium</option>
                <option value="Open Source">Open Source</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Short Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" style={{ ...inputStyle, resize: 'vertical' }} placeholder="Describe what your AI tool does..."></textarea>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '1rem', alignSelf: 'flex-start', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Submitting...' : <><Send size={18} /> Submit for Review</>}
          </button>
        </form>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '1rem',
  borderRadius: '0.5rem',
  border: '1px solid var(--glass-border)',
  background: 'var(--bg-tertiary)',
  color: 'var(--text-primary)',
  fontSize: '1rem',
  outline: 'none'
};

export default SubmitTool;
