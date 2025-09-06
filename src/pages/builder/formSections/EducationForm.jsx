import React from 'react';
import { TextInput, TextArea, CheckboxInput } from '../SharedInputs';
import './FormSections.css';

const EducationForm = ({ items, onChange, onAdd, onRemove }) => {
  const handleChange = (id, field, value) => {
    onChange(id, field, value);
  };

  const handleCheckboxChange = (id, field, e) => {
    onChange(id, field, e.target.checked);
  };

  return (
    <div className="form-section education-form">
      <h3>Education</h3>
      
      {items.length === 0 ? (
        <div className="empty-state">
          <p>No education entries yet. Add your educational background.</p>
          <button type="button" className="add-item-button" onClick={onAdd}>
            Add Education
          </button>
        </div>
      ) : (
        <>
          {items.map((item) => (
            <div key={item.id} className="item-container">
              <div className="item-header">
                <h4 className="item-title">
                  {item.institution ? item.institution : 'New Education Entry'}
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
                  label="Institution/School"
                  name="institution"
                  value={item.institution || ''}
                  onChange={(e) => handleChange(item.id, 'institution', e.target.value)}
                  placeholder="University of Example"
                  required={true}
                />
              </div>
              
              <div className="form-row two-col">
                <TextInput
                  label="Degree"
                  name="degree"
                  value={item.degree || ''}
                  onChange={(e) => handleChange(item.id, 'degree', e.target.value)}
                  placeholder="Bachelor of Science"
                />
                
                <TextInput
                  label="Field of Study"
                  name="field"
                  value={item.field || ''}
                  onChange={(e) => handleChange(item.id, 'field', e.target.value)}
                  placeholder="Computer Science"
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
                    label="Currently Studying"
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
              
              <div className="form-row two-col">
                <TextInput
                  label="GPA"
                  name="gpa"
                  value={item.gpa || ''}
                  onChange={(e) => handleChange(item.id, 'gpa', e.target.value)}
                  placeholder="3.8/4.0"
                />
                
                <div></div> {/* Empty div for grid alignment */}
              </div>
              
              <div className="form-row">
                <TextArea
                  label="Description"
                  name="description"
                  value={item.description || ''}
                  onChange={(e) => handleChange(item.id, 'description', e.target.value)}
                  placeholder="Describe your educational experience, achievements, relevant coursework, etc."
                  rows={3}
                />
              </div>
            </div>
          ))}
          
          <button type="button" className="add-item-button" onClick={onAdd}>
            Add Another Education
          </button>
        </>
      )}
    </div>
  );
};

export default EducationForm;
