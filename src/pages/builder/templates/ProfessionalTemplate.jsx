import React from 'react';
import './ProfessionalTemplate.css';

const ProfessionalTemplate = ({ data }) => {
  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return '';
    // Check if the date is already formatted (e.g. "2020 - Present")
    if (dateString.includes('-') || dateString.includes('–')) {
      return dateString;
    }
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch (e) {
      return dateString; // If parsing fails, return the original string
    }
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
    <div className="professional-template">
      {/* Header */}
      <div className="prof-header">
        {fullName && <h1>{fullName}</h1>}
        {jobTitle && <h2>{jobTitle}</h2>}
        
        <div className="prof-contact-info">
          {email && <span className="contact-item">{email}</span>}
          {phone && <span className="contact-item">{phone}</span>}
          {location && <span className="contact-item">{location}</span>}
          {linkedin && <span className="contact-item">{linkedin}</span>}
          {website && <span className="contact-item">{website}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="prof-section">
          <h3>Professional Summary</h3>
          <div className="prof-summary">
            <p>{summary}</p>
          </div>
        </div>
      )}

      {/* Work Experience */}
      {experience && experience.length > 0 && (
        <div className="prof-section">
          <h3>Work Experience</h3>
          {experience.map((exp, index) => (
            <div key={index} className="prof-item">
              <div className="prof-item-header">
                <div className="prof-item-title-group">
                  <h4>{exp.position}</h4>
                  <h5>{exp.company}</h5>
                </div>
                <div className="prof-item-date">
                  {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                </div>
              </div>
              {exp.location && <div className="prof-item-location">{exp.location}</div>}
              {exp.description && <p className="prof-item-description">{exp.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="prof-section">
          <h3>Education</h3>
          {education.map((edu, index) => (
            <div key={index} className="prof-item">
              <div className="prof-item-header">
                <div className="prof-item-title-group">
                  <h4>{edu.school}</h4>
                  <h5>
                    {edu.degree}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}
                  </h5>
                </div>
                <div className="prof-item-date">
                  {formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate)}
                </div>
              </div>
              {edu.location && <div className="prof-item-location">{edu.location}</div>}
              {edu.description && <p className="prof-item-description">{edu.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Skills & Technologies */}
      {skills && skills.length > 0 && (
        <div className="prof-section">
          <h3>Skills & Technologies</h3>
          <div className="prof-skills-list">
            {skills.map((skill, index) => (
              <div key={index} className="prof-skill-item">
                <span className="prof-skill-name">{skill.name}</span>
                <div className="prof-skill-level" data-level={skill.level}></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="prof-section">
          <h3>Projects & Portfolio</h3>
          {projects.map((project, index) => (
            <div key={index} className="prof-item">
              <div className="prof-item-header">
                <div className="prof-item-title-group">
                  <h4>{project.title}</h4>
                  {project.role && <h5>{project.role}</h5>}
                </div>
                {project.date && <div className="prof-item-date">{project.date}</div>}
              </div>
              {project.description && <p className="prof-item-description">{project.description}</p>}
              {project.technologies && (
                <div className="prof-item-technologies">
                  <span className="tech-label">Technologies:</span> {project.technologies}
                </div>
              )}
              {project.url && (
                <div className="prof-item-url">
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

export default ProfessionalTemplate;
