import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs, updateDoc, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { Check, X, ShieldAlert, Loader, Edit2, Trash2, Users, Save, Calendar, BarChart2 } from 'lucide-react';
import DOMPurify from 'dompurify';

const AdminPanel = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'live'
  
  const [submissions, setSubmissions] = useState([]);
  const [liveTools, setLiveTools] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Analytics
  const [stats, setStats] = useState({
    total: 0,
    last30: 0,
    last90: 0,
    last365: 0,
    last730: 0
  });

  // Edit Modal State
  const [editingTool, setEditingTool] = useState(null);
  const [editForm, setEditForm] = useState({});

  const ADMIN_EMAIL = 'work.binodshaw@gmail.com';

  // Security Check
  if (!currentUser || currentUser.email !== ADMIN_EMAIL) {
    return <Navigate to="/" />;
  }

  // Real-time visitor listener (Global Total)
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'analytics', 'visitors'), (docSnap) => {
      if (docSnap.exists()) {
        setStats(prev => ({ ...prev, total: docSnap.data().totalVisitors || 0 }));
      }
    }, (error) => {
      console.error("Error listening to visitors:", error);
    });
    return () => unsub();
  }, []);

  // Historical Stats Fetcher
  useEffect(() => {
    const fetchHistoricalStats = async () => {
      try {
        const twoYearsAgo = new Date();
        twoYearsAgo.setDate(twoYearsAgo.getDate() - 730);
        const twoYearsAgoStr = twoYearsAgo.toISOString().split('T')[0];

        const q = query(collection(db, 'analytics_daily'), where('date', '>=', twoYearsAgoStr));
        const snapshot = await getDocs(q);
        
        let c30 = 0, c90 = 0, c365 = 0, c730 = 0;
        const now = new Date();
        now.setHours(0,0,0,0); // normalize today
        
        snapshot.forEach(doc => {
          const data = doc.data();
          const docDate = new Date(data.date);
          docDate.setHours(0,0,0,0);
          const diffTime = Math.abs(now - docDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays <= 30) c30 += data.count;
          if (diffDays <= 90) c90 += data.count;
          if (diffDays <= 365) c365 += data.count;
          if (diffDays <= 730) c730 += data.count;
        });

        setStats(prev => ({ ...prev, last30: c30, last90: c90, last365: c365, last730: c730 }));
      } catch (err) {
        console.error("Failed to fetch historical stats:", err);
      }
    };
    fetchHistoricalStats();
  }, []);

  // Fetch Data based on active tab
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === 'pending') {
          const q = query(collection(db, 'submissions'), where('status', '==', 'pending'));
          const snapshot = await getDocs(q);
          setSubmissions(snapshot.docs.map(d => ({ id: d.id, ...d.data(), source: 'submissions' })));
        } else if (activeTab === 'live') {
          const q = query(collection(db, 'tools'), where('isCommunitySubmitted', '==', true));
          const snapshot = await getDocs(q);
          setLiveTools(snapshot.docs.map(d => ({ id: d.id, ...d.data(), source: 'tools' })));
        } else if (activeTab === 'subscribers') {
          const snapshot = await getDocs(collection(db, 'subscribers'));
          setSubscribers(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);


  // APPROVE PENDING
  const handleApprove = async (sub) => {
    try {
      const toolId = sub.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(Math.random() * 1000);
      await setDoc(doc(db, 'tools', toolId), {
        name: sub.name,
        url: sub.url,
        category: sub.category,
        description: sub.description,
        pricing: sub.pricing,
        isCommunitySubmitted: true,
        upvotes: 0,
        createdAt: new Date().toISOString()
      });
      await updateDoc(doc(db, 'submissions', sub.id), { status: 'approved' });
      setSubmissions(prev => prev.filter(s => s.id !== sub.id));
      alert(`Approved ${sub.name}!`);
    } catch (err) {
      console.error("Failed to approve:", err);
      alert("Failed to approve. Check console.");
    }
  };

  // REJECT PENDING
  const handleReject = async (subId) => {
    try {
      if(window.confirm("Are you sure you want to reject this submission?")) {
        await updateDoc(doc(db, 'submissions', subId), { status: 'rejected' });
        setSubmissions(prev => prev.filter(s => s.id !== subId));
      }
    } catch (err) {
      console.error("Failed to reject:", err);
    }
  };

  // DELETE LIVE TOOL
  const handleDeleteLive = async (toolId) => {
    try {
      if(window.confirm("Are you sure you want to permanently delete this live tool?")) {
        await deleteDoc(doc(db, 'tools', toolId));
        setLiveTools(prev => prev.filter(t => t.id !== toolId));
      }
    } catch (err) {
      console.error("Failed to delete tool:", err);
    }
  };

  // EDIT MODAL LOGIC
  const openEditModal = (tool) => {
    setEditingTool(tool);
    setEditForm({ ...tool });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const saveEdit = async () => {
    try {
      const collectionName = editingTool.source; // 'submissions' or 'tools'
      const docRef = doc(db, collectionName, editingTool.id);
      
      const updateData = {
        name: DOMPurify.sanitize(editForm.name || ''),
        category: DOMPurify.sanitize(editForm.category || ''),
        pricing: DOMPurify.sanitize(editForm.pricing || ''),
        url: DOMPurify.sanitize(editForm.url || ''),
        description: DOMPurify.sanitize(editForm.description || '')
      };

      await updateDoc(docRef, updateData);
      
      // Update UI locally
      if (collectionName === 'submissions') {
        setSubmissions(prev => prev.map(s => s.id === editingTool.id ? { ...s, ...updateData } : s));
      } else {
        setLiveTools(prev => prev.map(t => t.id === editingTool.id ? { ...t, ...updateData } : t));
      }

      setEditingTool(null);
      alert("Saved successfully!");
    } catch (error) {
      console.error("Error saving edits:", error);
      alert("Failed to save changes.");
    }
  };


  return (
    <div className="container section-padding" style={{ paddingTop: '120px', minHeight: '80vh', position: 'relative' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <ShieldAlert className="text-red-500" size={32} />
        <h1 className="section-title" style={{ margin: 0 }}>Admin <span className="text-red-500">Panel</span></h1>
      </div>

      {/* ANALYTICS DASHBOARD */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BarChart2 size={20} /> Visitor Analytics
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          
          {/* ALL TIME LIVE */}
          <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', padding: '1.5rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '10px', height: '10px', background: '#4ade80', borderRadius: '50%', position: 'absolute' }} className="animate-ping"></div>
              <div style={{ width: '10px', height: '10px', background: '#4ade80', borderRadius: '50%' }}></div>
            </div>
            <span style={{ fontSize: '0.9rem', color: '#4ade80', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Total (Live)</span>
            <span style={{ fontSize: '2.5rem', color: 'white', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={28} className="text-green-400" />
              {stats.total.toLocaleString()}
            </span>
          </div>

          {/* HISTORICAL STATS */}
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Last 30 Days</span>
            <span style={{ fontSize: '2rem', color: 'white', fontWeight: '700' }}>{stats.last30.toLocaleString()}</span>
          </div>
          
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Last 90 Days</span>
            <span style={{ fontSize: '2rem', color: 'white', fontWeight: '700' }}>{stats.last90.toLocaleString()}</span>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Past Year</span>
            <span style={{ fontSize: '2rem', color: 'white', fontWeight: '700' }}>{stats.last365.toLocaleString()}</span>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Past 2 Years</span>
            <span style={{ fontSize: '2rem', color: 'white', fontWeight: '700' }}>{stats.last730.toLocaleString()}</span>
          </div>

        </div>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
        <button 
          onClick={() => setActiveTab('pending')}
          className={`btn ${activeTab === 'pending' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Pending Submissions ({activeTab === 'pending' && !loading ? submissions.length : '...'})
        </button>
        <button 
          onClick={() => setActiveTab('live')}
          className={`btn ${activeTab === 'live' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Live Community Tools ({activeTab === 'live' && !loading ? liveTools.length : '...'})
        </button>
        <button 
          onClick={() => setActiveTab('subscribers')}
          className={`btn ${activeTab === 'subscribers' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Newsletter Subscribers ({activeTab === 'subscribers' && !loading ? subscribers.length : '...'})
        </button>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><Loader className="animate-spin text-purple-400" size={32} /></div>
        ) : activeTab === 'pending' ? (
          
          /* PENDING SUBMISSIONS LIST */
          submissions.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {submissions.map(sub => (
                <div key={sub.id} style={{ background: 'var(--bg-tertiary)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: '1 1 300px' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {sub.name} <span style={{ fontSize: '0.75rem', background: 'rgba(168,85,247,0.2)', color: '#c084fc', padding: '0.2rem 0.5rem', borderRadius: '1rem' }}>{sub.category}</span>
                      <span style={{ fontSize: '0.75rem', background: 'rgba(234,179,8,0.2)', color: '#facc15', padding: '0.2rem 0.5rem', borderRadius: '1rem' }}>{sub.pricing}</span>
                    </h3>
                    <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{sub.description}</p>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <a href={sub.url} target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa' }}>{sub.url}</a>
                      <span>By: {sub.userEmail}</span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button onClick={() => openEditModal(sub)} className="btn btn-secondary" style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Edit2 size={16} /> Edit
                    </button>
                    <button onClick={() => handleApprove(sub)} className="btn" style={{ background: 'rgba(34,197,94,0.2)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.3)', padding: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Check size={16} /> Approve
                    </button>
                    <button onClick={() => handleReject(sub.id)} className="btn" style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', padding: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <X size={16} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem 0' }}>No pending submissions.</p>
          )

        ) : (

          /* LIVE TOOLS LIST */
          liveTools.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {liveTools.map(tool => (
                <div key={tool.id} style={{ background: 'var(--bg-tertiary)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: '1 1 300px' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {tool.name} <span style={{ fontSize: '0.75rem', background: 'rgba(168,85,247,0.2)', color: '#c084fc', padding: '0.2rem 0.5rem', borderRadius: '1rem' }}>{tool.category}</span>
                    </h3>
                    <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{tool.description}</p>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <a href={tool.url} target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa' }}>{tool.url}</a>
                      <span style={{ color: '#4ade80' }}>LIVE (Community)</span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => openEditModal(tool)} className="btn btn-secondary" style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Edit2 size={16} /> Edit
                    </button>
                    <button onClick={() => handleDeleteLive(tool.id)} className="btn" style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', padding: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem 0' }}>No community tools live right now.</p>
          )
        ) : activeTab === 'subscribers' ? (
            
            /* NEWSLETTER SUBSCRIBERS LIST */
            subscribers.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ background: 'var(--bg-tertiary)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                  <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Users size={20} /> Newsletter Audience
                  </h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                        <th style={{ padding: '0.75rem 0', color: 'var(--text-secondary)' }}>Email Address</th>
                        <th style={{ padding: '0.75rem 0', color: 'var(--text-secondary)' }}>Subscribed On</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscribers.map(sub => (
                        <tr key={sub.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '1rem 0', fontWeight: '500' }}>{sub.email}</td>
                          <td style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>
                            {sub.subscribedAt ? new Date(sub.subscribedAt.seconds * 1000).toLocaleDateString() : 'Unknown'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem 0' }}>No subscribers yet.</p>
            )

          ) : null
        )}
      </div>

      {/* EDIT MODAL */}
      {editingTool && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="glass-panel" style={{ background: 'var(--bg-primary)', padding: '2rem', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
              Edit {editingTool.source === 'submissions' ? 'Pending Submission' : 'Live Tool'}
              <button onClick={() => setEditingTool(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X /></button>
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Name</label>
                <input type="text" name="name" value={editForm.name || ''} onChange={handleEditChange} style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px' }} />
              </div>
              <div className="responsive-grid-2" style={{ gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Category</label>
                  <input type="text" name="category" value={editForm.category || ''} onChange={handleEditChange} style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Pricing</label>
                  <input type="text" name="pricing" value={editForm.pricing || ''} onChange={handleEditChange} style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>URL</label>
                <input type="text" name="url" value={editForm.url || ''} onChange={handleEditChange} style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description</label>
                <textarea name="description" value={editForm.description || ''} onChange={handleEditChange} rows="4" style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px' }}></textarea>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button onClick={() => setEditingTool(null)} className="btn btn-secondary">Cancel</button>
                <button onClick={saveEdit} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Save size={18} /> Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPanel;
