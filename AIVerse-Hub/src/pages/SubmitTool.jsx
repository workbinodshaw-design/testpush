import React, { useState } from 'react';
import { Send } from 'lucide-react';
import categoriesData from '../data/categories.json';

const SubmitTool = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
    }, 1000);
  };

  if (submitted) {
    return (
      <div className="container section-padding" style={{ paddingTop: '120px', minHeight: '80vh', textAlign: 'center' }}>
        <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto', padding: '4rem 2rem' }}>
          <h2 className="section-title gradient-text">Thank You!</h2>
          <p className="section-subtitle">Your tool has been submitted successfully and is pending admin approval. We will notify you once it's live.</p>
          <button onClick={() => setSubmitted(false)} className="btn btn-primary" style={{ marginTop: '2rem' }}>Submit Another Tool</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container section-padding" style={{ paddingTop: '120px', minHeight: '80vh' }}>
      <div className="section-header">
        <h1 className="section-title">Submit a <span className="gradient-text">Tool</span></h1>
        <p className="section-subtitle">Created an awesome AI tool? Submit it to our directory for thousands of daily visitors to discover.</p>
      </div>

      <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Tool Name</label>
              <input type="text" required style={inputStyle} placeholder="e.g. ChatGPT" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Website URL</label>
              <input type="url" required style={inputStyle} placeholder="https://" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Category</label>
              <select required style={inputStyle}>
                <option value="">Select a category</option>
                {categoriesData.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Your Email</label>
              <input type="email" required style={inputStyle} placeholder="For updates regarding your submission" />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Short Description</label>
            <textarea required rows="4" style={{ ...inputStyle, resize: 'vertical' }} placeholder="Describe what your AI tool does..."></textarea>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', alignSelf: 'flex-start' }}>
            <Send size={18} /> Submit for Review
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
  fontSize: '1rem'
};

export default SubmitTool;
