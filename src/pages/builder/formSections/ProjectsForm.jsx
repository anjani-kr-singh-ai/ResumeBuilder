import React from 'react';
import { TextInput, TextArea } from '../SharedInputs';
import './FormSections.css';

const ProjectsForm = ({ items, onChange, onAdd, onRemove }) => {
  const handleChange = (id, field, value) => {
    onChange(id, field, value);
  };

  // Helper function to handle technologies array
  const handleTechnologiesChange = (id, value) => {
    const techArray = value.split(',').map(tech => tech.trim()).filter(Boolean);
    onChange(id, 'technologies', techArray);
  };

  return (
    <div className="form-section projects-form">
      <h3>Projects</h3>
      
      {items.length === 0 ? (
        <div className="empty-state">
          <p>No projects added yet. Showcase your work by adding relevant projects.</p>
          <button type="button" className="add-item-button" onClick={onAdd}>
            Add Project
          </button>
        </div>
      ) : (
        <>
          {items.map((item) => (
            <div key={item.id} className="item-container">
              <div className="item-header">
                <h4 className="item-title">
                  {item.title ? item.title : 'New Project'}
                </h4>
                <div className="item-actions">
                  <button
                    type="button"
                    className="remove-item-button"
                    onClick={() => onRemove(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
              
              <div className="form-row">
                <TextInput
                  label="Project Title"
                  name="title"
                  value={item.title || ''}
                  onChange={(e) => handleChange(item.id, 'title', e.target.value)}
                  placeholder="E-commerce Website"
                  required={true}
                />
              </div>
              
              <div className="form-row">
                <TextInput
                  label="Project URL"
                  name="link"
                  value={item.link || ''}
                  onChange={(e) => handleChange(item.id, 'link', e.target.value)}
                  placeholder="https://example.com"
                  type="url"
                />
              </div>
              
              <div className="form-row two-col">
                <TextInput
                  label="Start Date"
                  name="startDate"
                  type="date"
                  value={item.startDate || ''}
                  onChange={(e) => handleChange(item.id, 'startDate', e.target.value)}
                />
                
                <TextInput
                  label="End Date"
                  name="endDate"
                  type="date"
                  value={item.endDate || ''}
                  onChange={(e) => handleChange(item.id, 'endDate', e.target.value)}
                />
              </div>
              
              <div className="form-row">
                <TextArea
                  label="Description"
                  name="description"
                  value={item.description || ''}
                  onChange={(e) => handleChange(item.id, 'description', e.target.value)}
                  placeholder="Describe the project, your role, key features and accomplishments."
                  rows={4}
                />
              </div>
              
              <div className="form-row">
                <TextInput
                  label="Technologies Used"
                  name="technologies"
                  value={Array.isArray(item.technologies) ? item.technologies.join(', ') : ''}
                  onChange={(e) => handleTechnologiesChange(item.id, e.target.value)}
                  placeholder="React, Node.js, MongoDB (separate with commas)"
                />
              </div>
            </div>
          ))}
          
          <button type="button" className="add-item-button" onClick={onAdd}>
            Add Another Project
          </button>
        </>
      )}
      
      <div className="projects-tips">
        <h4>Tips for Project Descriptions:</h4>
        <ul>
          <li>Focus on your specific contributions and impact.</li>
          <li>Include measurable results whenever possible.</li>
          <li>List the technologies and methodologies used.</li>
          <li>Keep descriptions concise but informative.</li>
        </ul>
      </div>
    </div>
  );
};

export default ProjectsForm;
