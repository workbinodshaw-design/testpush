import React, { useState } from 'react';
import { ArrowLeftRight, CheckCircle, XCircle } from 'lucide-react';
import toolsData from '../data/tools.json';

const Compare = () => {
  const [tool1Id, setTool1Id] = useState('');
  const [tool2Id, setTool2Id] = useState('');

  const tool1 = toolsData.find(t => t.id === tool1Id);
  const tool2 = toolsData.find(t => t.id === tool2Id);

  // Group tools by category for the select dropdown
  const categories = [...new Set(toolsData.map(t => t.category))].sort();

  return (
    <div className="container section-padding" style={{ paddingTop: '120px', minHeight: '80vh' }}>
      <div className="section-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="section-title">Tool <span className="gradient-text">Comparison Engine</span></h1>
        <p className="section-subtitle">Compare features, pricing, and ratings side-by-side to make the best choice.</p>
      </div>

      {/* Selectors */}
      <div className="glass-panel" style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '2rem', alignItems: 'center', marginBottom: '4rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Select First Tool</label>
          <select 
            value={tool1Id} 
            onChange={(e) => setTool1Id(e.target.value)}
            style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', fontSize: '1rem' }}
          >
            <option value="">-- Choose a tool --</option>
            {categories.map(cat => (
              <optgroup label={cat} key={cat}>
                {toolsData.filter(t => t.category === cat).map(t => (
                  <option key={`t1-${t.id}`} value={t.id}>{t.name}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div style={{ background: 'var(--glass-bg)', padding: '1rem', borderRadius: '50%', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ArrowLeftRight size={24} className="text-purple-400" />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Select Second Tool</label>
          <select 
            value={tool2Id} 
            onChange={(e) => setTool2Id(e.target.value)}
            style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', fontSize: '1rem' }}
          >
            <option value="">-- Choose a tool --</option>
            {categories.map(cat => (
              <optgroup label={cat} key={cat}>
                {toolsData.filter(t => t.category === cat).map(t => (
                  <option key={`t2-${t.id}`} value={t.id}>{t.name}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>

      {/* Comparison Grid */}
      {tool1 && tool2 ? (
        <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr 1fr', gap: '0', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          
          {/* Headers */}
          <div style={{ padding: '2rem', borderBottom: '1px solid var(--glass-border)', borderRight: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', fontWeight: 'bold' }}>Overview</div>
          <div style={{ padding: '2rem', borderBottom: '1px solid var(--glass-border)', borderRight: '1px solid var(--glass-border)', textAlign: 'center' }}>
            <img src={tool1.logo} alt="" style={{ width: '60px', height: '60px', borderRadius: '12px', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.5rem' }}>{tool1.name}</h3>
          </div>
          <div style={{ padding: '2rem', borderBottom: '1px solid var(--glass-border)', textAlign: 'center' }}>
            <img src={tool2.logo} alt="" style={{ width: '60px', height: '60px', borderRadius: '12px', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.5rem' }}>{tool2.name}</h3>
          </div>

          {/* Category */}
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', borderRight: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>Category</div>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', borderRight: '1px solid var(--glass-border)', textAlign: 'center' }}><span className="badge badge-category">{tool1.category}</span></div>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', textAlign: 'center' }}><span className="badge badge-category">{tool2.category}</span></div>

          {/* Pricing */}
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', borderRight: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>Pricing Model</div>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', borderRight: '1px solid var(--glass-border)', textAlign: 'center', fontWeight: 'bold' }}>{tool1.pricing}</div>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', textAlign: 'center', fontWeight: 'bold' }}>{tool2.pricing}</div>

          {/* Rating */}
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', borderRight: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>User Rating</div>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', borderRight: '1px solid var(--glass-border)', textAlign: 'center' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--warning)' }}>⭐ {tool1.rating}</span> <br/>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>({tool1.reviews} reviews)</span>
          </div>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', textAlign: 'center' }}>
             <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--warning)' }}>⭐ {tool2.rating}</span> <br/>
             <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>({tool2.reviews} reviews)</span>
          </div>

          {/* Pros */}
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', borderRight: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>Key Advantages</div>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', borderRight: '1px solid var(--glass-border)' }}>
             <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
               {tool1.pros?.map((pro, i) => <li key={i} style={{ display: 'flex', gap: '0.5rem' }}><CheckCircle size={16} className="text-green-400" style={{ flexShrink: 0 }}/> {pro}</li>)}
             </ul>
          </div>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
             <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
               {tool2.pros?.map((pro, i) => <li key={i} style={{ display: 'flex', gap: '0.5rem' }}><CheckCircle size={16} className="text-green-400" style={{ flexShrink: 0 }}/> {pro}</li>)}
             </ul>
          </div>

          {/* Cons */}
          <div style={{ padding: '1.5rem', borderRight: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>Limitations</div>
          <div style={{ padding: '1.5rem', borderRight: '1px solid var(--glass-border)' }}>
             <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
               {tool1.cons?.map((con, i) => <li key={i} style={{ display: 'flex', gap: '0.5rem' }}><XCircle size={16} className="text-red-400" style={{ flexShrink: 0 }}/> {con}</li>)}
             </ul>
          </div>
          <div style={{ padding: '1.5rem' }}>
             <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
               {tool2.cons?.map((con, i) => <li key={i} style={{ display: 'flex', gap: '0.5rem' }}><XCircle size={16} className="text-red-400" style={{ flexShrink: 0 }}/> {con}</li>)}
             </ul>
          </div>

        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)', border: '2px dashed var(--glass-border)', borderRadius: 'var(--radius-lg)' }}>
          <ArrowLeftRight size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
          <h3>Select two tools above to start comparison</h3>
        </div>
      )}

    </div>
  );
};

export default Compare;
