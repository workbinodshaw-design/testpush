import React from 'react';
import CategoryCard from '../components/CategoryCard';
import categoriesData from '../data/categories.json';

const Categories = () => {
  return (
    <div className="container section-padding" style={{ paddingTop: '120px', minHeight: '80vh' }}>
      <div className="section-header">
        <h1 className="section-title">All <span className="gradient-text">Categories</span></h1>
        <p className="section-subtitle">Browse our extensive collection of AI tools by category.</p>
      </div>

      <div className="categories-grid">
        {categoriesData.map(category => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
};

export default Categories;
