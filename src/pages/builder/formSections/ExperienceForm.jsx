import React from 'react';
import { TextInput, TextArea, CheckboxInput } from '../SharedInputs';
import './FormSections.css';

const ExperienceForm = ({ items, onChange, onAdd, onRemove }) => {
  const handleChange = (id, field, value) => {
    onChange(id, field, value);
  };

  const handleCheckboxChange = (id, field, e) => {
    onChange(id, field, e.target.checked);
  };

  return (
    <div className="form-section experience-form">
      <h3>Work Experience</h3>
      
      {items.length === 0 ? (
        <div className="empty-state">
          <p>No work experience entries yet. Add your professional background.</p>
          <button type="button" className="add-item-button" onClick={onAdd}>
            Add Experience
          </button>
        </div>
      ) : (
        <>
          {items.map((item) => (
            <div key={item.id} className="item-container">
              <div className="item-header">
                <h4 className="item-title">
                  {item.position ? (
                    <>
                      {item.position} {item.company ? `at ${item.company}` : ''}
                    </>
                  ) : (
                    'New Experience Entry'
                  )}
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
                  label="Company/Organization"
                  name="company"
                  value={item.company || ''}
                  onChange={(e) => handleChange(item.id, 'company', e.target.value)}
                  placeholder="Company Name"
                  required={true}
                />
              </div>
              
              <div className="form-row">
                <TextInput
                  label="Position/Title"
                  name="position"
                  value={item.position || ''}
                  onChange={(e) => handleChange(item.id, 'position', e.target.value)}
                  placeholder="Job Title"
                  required={true}
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
                
                <div className="date-input-group">
                  <TextInput
                    label="End Date"
                    name="endDate"
                    type="date"
                    value={item.endDate || ''}
                    onChange={(e) => handleChange(item.id, 'endDate', e.target.value)}
                    disabled={item.current}
                  />
                  <CheckboxInput
                    label="Currently Working Here"
                    name="current"
                    checked={item.current || false}
                    onChange={(e) => handleCheckboxChange(item.id, 'current', e)}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <TextInput
                  label="Location"
                  name="location"
                  value={item.location || ''}
                  onChange={(e) => handleChange(item.id, 'location', e.target.value)}
                  placeholder="City, Country"
                />
              </div>
              
              <div className="form-row">
                <TextArea
                  label="Description"
                  name="description"
                  value={item.description || ''}
                  onChange={(e) => handleChange(item.id, 'description', e.target.value)}
                  placeholder="Describe your responsibilities, achievements, and projects. Use bullet points for better readability."
                  rows={5}
                />
              </div>
              
              {/* We could add an achievements list here if needed */}
            </div>
          ))}
          
          <button type="button" className="add-item-button" onClick={onAdd}>
            Add Another Experience
          </button>
        </>
      )}
    </div>
  );
};

export default ExperienceForm;
