import React, { useState } from 'react';
import PersonalInfoForm from './formSections/PersonalInfoForm';
import EducationForm from './formSections/EducationForm';
import ExperienceForm from './formSections/ExperienceForm';
import SkillsForm from './formSections/SkillsForm';
import ProjectsForm from './formSections/ProjectsForm';
import AchievementsForm from './formSections/AchievementsForm';
import './ResumeForm.css';

const ResumeForm = ({ resumeData, onFieldChange, onAddItem, onRemoveItem }) => {
  const [activeSection, setActiveSection] = useState('personal');
  
  const formSections = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'education', label: 'Education' },
    { id: 'experience', label: 'Work Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'achievements', label: 'Achievements' },
  ];
  
  const renderForm = () => {
    switch (activeSection) {
      case 'personal':
        return (
          <PersonalInfoForm 
            data={resumeData.personal}
            onChange={(field, value) => onFieldChange('personal', null, field, value)}
          />
        );
      case 'education':
        return (
          <EducationForm 
            items={resumeData.education}
            onChange={(id, field, value) => onFieldChange('education', id, field, value)}
            onAdd={() => onAddItem('education')}
            onRemove={id => onRemoveItem('education', id)}
          />
        );
      case 'experience':
        return (
          <ExperienceForm 
            items={resumeData.experience}
            onChange={(id, field, value) => onFieldChange('experience', id, field, value)}
            onAdd={() => onAddItem('experience')}
            onRemove={id => onRemoveItem('experience', id)}
          />
        );
      case 'skills':
        return (
          <SkillsForm 
            items={resumeData.skills}
            onChange={(id, field, value) => onFieldChange('skills', id, field, value)}
            onAdd={() => onAddItem('skills')}
            onRemove={id => onRemoveItem('skills', id)}
          />
        );
      case 'projects':
        return (
          <ProjectsForm 
            items={resumeData.projects}
            onChange={(id, field, value) => onFieldChange('projects', id, field, value)}
            onAdd={() => onAddItem('projects')}
            onRemove={id => onRemoveItem('projects', id)}
          />
        );
      case 'achievements':
        return (
          <AchievementsForm 
            items={resumeData.achievements}
            onChange={(id, field, value) => onFieldChange('achievements', id, field, value)}
            onAdd={() => onAddItem('achievements')}
            onRemove={id => onRemoveItem('achievements', id)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="resume-form">
      <div className="form-tabs">
        {formSections.map(section => (
          <button 
            key={section.id}
            className={`form-tab ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => setActiveSection(section.id)}
          >
            {section.label}
          </button>
        ))}
      </div>
      
      <div className="form-content">
        {renderForm()}
      </div>
    </div>
  );
};

export default ResumeForm;
