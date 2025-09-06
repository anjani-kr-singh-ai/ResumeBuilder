import React, { useState } from 'react';
import { TextInput, SelectInput, ActionButton } from './SharedInputs';
import './Skills.css';

const Skills = ({ data, updateData }) => {
  const [newSkill, setNewSkill] = useState({ name: '', level: 'intermediate' });
  const [error, setError] = useState('');
  
  const skills = data.skills || [];
  
  const skillLevelOptions = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' }
  ];

  const handleNewSkillChange = (e) => {
    const { name, value } = e.target;
    setNewSkill({ ...newSkill, [name]: value });
    setError('');
  };

  const addSkill = () => {
    if (!newSkill.name.trim()) {
      setError('Skill name is required');
      return;
    }
    
    // Check if skill already exists
    if (skills.some(skill => skill.name.toLowerCase() === newSkill.name.toLowerCase())) {
      setError('This skill already exists');
      return;
    }
    
    updateData({
      ...data,
      skills: [...skills, newSkill]
    });
    
    setNewSkill({ name: '', level: 'intermediate' });
  };

  const removeSkill = (index) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    
    updateData({
      ...data,
      skills: updatedSkills
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="skills-form">
      <h3>Skills</h3>
      
      <div className="add-skill-form">
        <div className="add-skill-inputs">
          <TextInput
            label="Skill Name"
            name="name"
            value={newSkill.name}
            onChange={handleNewSkillChange}
            placeholder="e.g., JavaScript, Project Management, Photoshop"
            error={error}
            onKeyPress={handleKeyPress}
          />
          
          <SelectInput
            label="Proficiency Level"
            name="level"
            value={newSkill.level}
            onChange={handleNewSkillChange}
            options={skillLevelOptions}
          />
        </div>
        
        <ActionButton
          text="Add Skill"
          onClick={addSkill}
          variant="primary"
        />
      </div>
      
      {skills.length > 0 ? (
        <div className="skills-list">
          {skills.map((skill, index) => (
            <div key={index} className="skill-pill" data-level={skill.level}>
              <span className="skill-name">{skill.name}</span>
              <span className="skill-level">{skill.level}</span>
              <button 
                type="button"
                className="remove-skill"
                onClick={() => removeSkill(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No skills added yet. Add your professional skills to showcase your expertise.</p>
        </div>
      )}
      
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

export default Skills;
