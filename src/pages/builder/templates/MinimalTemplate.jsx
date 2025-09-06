import React from 'react';
import './MinimalTemplate.css';

const MinimalTemplate = ({ data }) => {
  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Check if data exists
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="empty-template">
        <p>Add information in the form sections to see your resume preview.</p>
      </div>
    );
  }

  const { 
    fullName, 
    jobTitle, 
    email, 
    phone, 
    location, 
    linkedin, 
    website, 
    summary,
    experience,
    education,
    skills,
    projects 
  } = data;

  return (
    <div className="minimal-template">
      {/* Header */}
      <div className="min-header">
        {fullName && <h1>{fullName}</h1>}
        {jobTitle && <h2>{jobTitle}</h2>}
        
        <div className="min-contact-info">
          {email && <span className="contact-item">{email}</span>}
          {phone && <span className="contact-item">{phone}</span>}
          {location && <span className="contact-item">{location}</span>}
          {linkedin && <span className="contact-item">{linkedin}</span>}
          {website && <span className="contact-item">{website}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="min-section">
          <h3>About</h3>
          <div className="min-summary">
            <p>{summary}</p>
          </div>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="min-section">
          <h3>Experience</h3>
          {experience.map((exp, index) => (
            <div key={index} className="min-item">
              <div className="min-item-header">
                <h4>{exp.position} • {exp.company}</h4>
                <span className="min-item-date">
                  {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}
                </span>
              </div>
              {exp.location && <div className="min-item-location">{exp.location}</div>}
              {exp.description && <p className="min-item-description">{exp.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="min-section">
          <h3>Education</h3>
          {education.map((edu, index) => (
            <div key={index} className="min-item">
              <div className="min-item-header">
                <h4>{edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}</h4>
                <span className="min-item-date">
                  {formatDate(edu.startDate)} — {edu.current ? 'Present' : formatDate(edu.endDate)}
                </span>
              </div>
              <div className="min-item-school">{edu.school}</div>
              {edu.location && <div className="min-item-location">{edu.location}</div>}
              {edu.description && <p className="min-item-description">{edu.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div className="min-section">
          <h3>Skills</h3>
          <div className="min-skills-list">
            {skills.map((skill, index) => (
              <span key={index} className="min-skill-item">
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="min-section">
          <h3>Projects</h3>
          {projects.map((project, index) => (
            <div key={index} className="min-item">
              <div className="min-item-header">
                <h4>{project.title}</h4>
                {project.date && <span className="min-item-date">{project.date}</span>}
              </div>
              {project.role && <div className="min-item-role">{project.role}</div>}
              {project.description && <p className="min-item-description">{project.description}</p>}
              {project.technologies && (
                <div className="min-item-technologies">
                  {project.technologies}
                </div>
              )}
              {project.url && (
                <div className="min-item-url">
                  <a href={project.url} target="_blank" rel="noopener noreferrer">{project.url}</a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MinimalTemplate;
