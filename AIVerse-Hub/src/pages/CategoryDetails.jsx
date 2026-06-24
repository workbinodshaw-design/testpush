import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowDownAZ } from 'lucide-react';
import ToolCard from '../components/ToolCard';
import toolsData from '../data/tools.json';
import categoriesData from '../data/categories.json';

const CategoryDetails = () => {
  const { id } = useParams();
  const [visibleCount, setVisibleCount] = useState(24);
  
  // Find category to get the exact name (e.g. from "writing" to "AI Writing")
  const category = categoriesData.find(c => c.id === id);
  const categoryName = category ? category.name : "Unknown Category";
  
  // Filter tools by this exact category name
  const categoryTools = toolsData.filter(tool => tool.category === categoryName);
  const visibleTools = categoryTools.slice(0, visibleCount);
  const hasMore = visibleCount < categoryTools.length;

  if (!category) {
    return (
      <div className="container section-padding" style={{ paddingTop: '120px', minHeight: '80vh', textAlign: 'center' }}>
        <h1>Category Not Found</h1>
        <Link to="/categories" className="btn btn-primary" style={{ marginTop: '2rem' }}>Back to Categories</Link>
      </div>
    );
  }

  return (
    <div className="container section-padding" style={{ paddingTop: '120px', minHeight: '80vh' }}>
      
      <Link to="/categories" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        <ArrowLeft size={16} /> All Categories
      </Link>

      <div className="section-header">
        <h1 className="section-title"><span className="gradient-text">{category.name}</span> Tools</h1>
        <p className="section-subtitle">Showing {categoryTools.length} tools in this category.</p>
      </div>

      <div className="tools-grid">
        {visibleTools.length > 0 ? (
          visibleTools.map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 0' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No tools yet</h3>
            <p style={{ color: 'var(--text-secondary)' }}>We are still adding tools to this category.</p>
          </div>
        )}
      </div>

      {hasMore && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
          <button 
            className="btn btn-primary" 
            onClick={() => setVisibleCount(prev => prev + 24)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            Load More <ArrowDownAZ size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryDetails;
