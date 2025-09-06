import React from 'react';
import { TextInput, TextArea } from '../SharedInputs';
import './FormSections.css';

const AchievementsForm = ({ items, onChange, onAdd, onRemove }) => {
  const handleChange = (id, field, value) => {
    onChange(id, field, value);
  };

  return (
    <div className="form-section achievements-form">
      <h3>Achievements & Awards</h3>
      
      {items.length === 0 ? (
        <div className="empty-state">
          <p>No achievements added yet. Add certifications, awards, and other accomplishments.</p>
          <button type="button" className="add-item-button" onClick={onAdd}>
            Add Achievement
          </button>
        </div>
      ) : (
        <>
          {items.map((item) => (
            <div key={item.id} className="item-container">
              <div className="item-header">
                <h4 className="item-title">
                  {item.title ? item.title : 'New Achievement'}
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
                  label="Achievement Title"
                  name="title"
                  value={item.title || ''}
                  onChange={(e) => handleChange(item.id, 'title', e.target.value)}
                  placeholder="AWS Certified Solutions Architect"
                  required={true}
                />
              </div>
              
              <div className="form-row two-col">
                <TextInput
                  label="Issuing Organization"
                  name="issuer"
                  value={item.issuer || ''}
                  onChange={(e) => handleChange(item.id, 'issuer', e.target.value)}
                  placeholder="Amazon Web Services"
                />
                
                <TextInput
                  label="Date"
                  name="date"
                  type="date"
                  value={item.date || ''}
                  onChange={(e) => handleChange(item.id, 'date', e.target.value)}
                />
              </div>
              
              <div className="form-row">
                <TextArea
                  label="Description"
                  name="description"
                  value={item.description || ''}
                  onChange={(e) => handleChange(item.id, 'description', e.target.value)}
                  placeholder="Describe the achievement, requirements, and its relevance to your career."
                  rows={3}
                />
              </div>
            </div>
          ))}
          
          <button type="button" className="add-item-button" onClick={onAdd}>
            Add Another Achievement
          </button>
        </>
      )}
      
      <div className="achievements-tips">
        <h4>Tips:</h4>
        <ul>
          <li>Include certifications relevant to your target role.</li>
          <li>Mention awards that demonstrate your skills and dedication.</li>
          <li>Add community recognition and leadership positions.</li>
          <li>Include notable publications or presentations.</li>
        </ul>
      </div>
    </div>
  );
};

export default AchievementsForm;
