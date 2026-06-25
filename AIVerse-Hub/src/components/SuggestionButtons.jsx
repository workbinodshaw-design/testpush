import React from 'react';
import { Sparkles, Video, Code, PenTool, BookOpen, Image, TrendingUp, Cpu } from 'lucide-react';

const suggestions = [
  { label: 'Video Editing', icon: Video, query: 'I need an AI tool for editing YouTube videos' },
  { label: 'AI Writing', icon: PenTool, query: 'Best AI writing assistants for blogs' },
  { label: 'Coding', icon: Code, query: 'Free AI tools for coding' },
  { label: 'Study', icon: BookOpen, query: 'Best AI tools for students' },
  { label: 'Image Gen', icon: Image, query: 'High quality AI image generators' },
  { label: 'Marketing', icon: TrendingUp, query: 'AI tools for digital marketing' },
  { label: 'Automation', icon: Cpu, query: 'Business automation tools' },
];

const SuggestionButtons = ({ onSelect }) => {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1rem', scrollbarWidth: 'none' }}>
      {suggestions.map((item, idx) => {
        const Icon = item.icon;
        return (
          <button
            key={idx}
            onClick={() => onSelect(item.query)}
            className="btn btn-secondary"
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: '20px',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              whiteSpace: 'nowrap',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--glass-border)',
              flexShrink: 0
            }}
          >
            <Icon size={14} className="text-purple-400" /> {item.label}
          </button>
        );
      })}
    </div>
  );
};

export default SuggestionButtons;
