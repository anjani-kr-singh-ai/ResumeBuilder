import React from 'react';
import './TemplateSelector.css';

const TemplateSelector = ({ selectedTemplate, onSelectTemplate }) => {
  const templates = [
    {
      id: 'professional',
      name: 'Professional',
      description: 'Clean and corporate style for traditional industries',
      thumbnail: null
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Bold design for creative professionals',
      thumbnail: null
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Simple and elegant for a modern look',
      thumbnail: null
    },
    {
      id: 'technical',
      name: 'Technical',
      description: 'Focused on skills and technical expertise',
      thumbnail: null
    }
  ];

  return (
    <div className="template-selector">
      <div className="templates-grid">
        {templates.map(template => (
          <div 
            key={template.id} 
            className={`template-card ${selectedTemplate === template.id ? 'selected' : ''}`}
            onClick={() => onSelectTemplate(template.id)}
          >
            <div className="template-preview">
              <div className="template-thumbnail">
                {template.thumbnail ? (
                  <img src={template.thumbnail} alt={template.name} />
                ) : (
                  <div className="thumbnail-placeholder">
                    <span>{template.name[0]}</span>
                  </div>
                )}
              </div>
              {selectedTemplate === template.id && (
                <div className="selected-overlay">
                  <div className="checkmark"></div>
                </div>
              )}
            </div>
            <div className="template-info">
              <h3>{template.name}</h3>
              <p>{template.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;
