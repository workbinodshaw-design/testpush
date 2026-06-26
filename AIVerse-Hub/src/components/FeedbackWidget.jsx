import React, { useState } from 'react';
import { MessageSquare, X, Send, CheckCircle, Loader2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

const FeedbackWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState('General');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setStatus('loading');
    try {
      await addDoc(collection(db, 'feedback'), {
        type: feedbackType,
        message: message.trim(),
        email: email.trim() || user?.email || 'Anonymous',
        userId: user?.uid || null,
        createdAt: serverTimestamp(),
      });
      setStatus('success');
      setTimeout(() => {
        setIsOpen(false);
        setStatus('idle');
        setMessage('');
        setFeedbackType('General');
      }, 3000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setStatus('error');
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-primary"
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          borderRadius: '50px',
          padding: '0.75rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          boxShadow: '0 10px 25px rgba(168, 85, 247, 0.4)',
          zIndex: 999,
          transform: isOpen ? 'scale(0)' : 'scale(1)',
          transition: 'transform 0.3s ease',
        }}
      >
        <MessageSquare size={20} />
        <span style={{ fontWeight: '500' }}>Feedback</span>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
          onClick={() => setIsOpen(false)}
        >
          {/* Modal Content */}
          <div 
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '450px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--glass-border)',
              borderRadius: '16px',
              overflow: 'hidden',
              animation: 'slideUp 0.3s ease forwards',
            }}
            onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
          >
            {/* Header */}
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageSquare size={20} className="text-purple-400" /> We'd love your feedback!
              </h3>
              <button 
                onClick={() => setIsOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.25rem' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '1.5rem' }}>
              {status === 'success' ? (
                <div style={{ textAlign: 'center', padding: '2rem 0', animation: 'fadeIn 0.5s ease' }}>
                  <CheckCircle size={48} style={{ color: '#4ade80', margin: '0 auto 1rem' }} />
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Thank You!</h4>
                  <p style={{ color: 'var(--text-secondary)' }}>Your feedback helps us improve AIVerse Hub.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Feedback Type</label>
                    <select 
                      value={feedbackType}
                      onChange={(e) => setFeedbackType(e.target.value)}
                      className="form-control"
                      style={{ background: 'var(--bg-tertiary)', width: '100%' }}
                    >
                      <option value="General">General Feedback</option>
                      <option value="Feature Request">Feature Request</option>
                      <option value="Bug Report">Bug Report</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Message <span style={{ color: 'var(--accent-primary)' }}>*</span></label>
                    <textarea 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us what you think, what we can improve, or what features you'd like to see next!"
                      className="form-control"
                      style={{ background: 'var(--bg-tertiary)', minHeight: '120px', resize: 'vertical', width: '100%' }}
                      required
                    />
                  </div>

                  {!user && (
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Email (Optional)</label>
                      <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="So we can follow up with you"
                        className="form-control"
                        style={{ background: 'var(--bg-tertiary)', width: '100%' }}
                      />
                    </div>
                  )}

                  {status === 'error' && (
                    <div style={{ color: '#ef4444', fontSize: '0.9rem', padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '4px' }}>
                      Something went wrong. Please try again.
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={status === 'loading' || !message.trim()}
                    style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
                  >
                    {status === 'loading' ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                    Submit Feedback
                  </button>

                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}} />
    </>
  );
};

export default FeedbackWidget;
