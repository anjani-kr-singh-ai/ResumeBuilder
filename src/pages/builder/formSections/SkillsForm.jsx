import React from 'react';
import { TextInput, SelectInput } from '../SharedInputs';
import './FormSections.css';

const SkillsForm = ({ items, onChange, onAdd, onRemove }) => {
  const handleChange = (id, field, value) => {
    onChange(id, field, value);
  };

  const skillLevelOptions = [
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' },
    { value: 'Expert', label: 'Expert' }
  ];

  return (
    <div className="form-section skills-form">
      <h3>Skills</h3>
      
      <div className="skills-list">
        {items.length === 0 ? (
          <div className="empty-state">
            <p>No skills added yet. Add your professional skills to showcase your expertise.</p>
            <button type="button" className="add-item-button" onClick={onAdd}>
              Add Skill
            </button>
          </div>
        ) : (
          <>
            {items.map((item) => (
              <div key={item.id} className="skill-item-container">
                <div className="skill-input-group">
                  <TextInput
                    label="Skill"
                    name="name"
                    value={item.name || ''}
                    onChange={(e) => handleChange(item.id, 'name', e.target.value)}
                    placeholder="e.g., JavaScript, Project Management, Photoshop"
                    required={true}
                  />
                  
                  <SelectInput
                    label="Proficiency Level"
                    name="level"
                    value={item.level || 'Intermediate'}
                    onChange={(e) => handleChange(item.id, 'level', e.target.value)}
                    options={skillLevelOptions}
                  />
                  
                  <button
                    type="button"
                    className="remove-skill-button"
                    onClick={() => onRemove(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            
            <button type="button" className="add-item-button" onClick={onAdd}>
              Add Another Skill
            </button>
          </>
        )}
      </div>
      
      <div className="skills-tips">
        <h4>Tips:</h4>
        <ul>
          <li>Include both technical and soft skills relevant to the job you're applying for.</li>
          <li>Be honest about your proficiency level.</li>
          <li>Focus on quality over quantity - include your most relevant skills.</li>
        </ul>
      </div>
    </div>
  );
};

export default SkillsForm;
