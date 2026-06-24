import React from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import toolsData from '../data/tools.json';

const CategoryCard = ({ category }) => {
  // Dynamically calculate the accurate number of tools in this category
  const actualToolCount = toolsData.filter(tool => tool.category === category.name).length;
  const IconComponent = Icons[category.icon] || Icons.HelpCircle;

  return (
    <Link to={`/categories/${category.id}`} className="category-card glass-panel">
      <div className="category-icon">
        <IconComponent size={32} />
      </div>
      <h3 className="category-name">{category.name}</h3>
      <span className="category-count">{actualToolCount} Tools</span>
    </Link>
  );
};

export default CategoryCard;
