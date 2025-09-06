import React from 'react';
import './CreativeTemplate.css';

const CreativeTemplate = ({ data }) => {
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
    <div className="creative-template">
      <div className="cr-layout">
        {/* Sidebar */}
        <div className="cr-sidebar">
          <div className="cr-profile">
            <div className="cr-profile-avatar">
              {fullName && fullName.charAt(0).toUpperCase()}
            </div>
            <div className="cr-profile-name">
              {fullName && <h1>{fullName}</h1>}
              {jobTitle && <h2>{jobTitle}</h2>}
            </div>
          </div>

          <div className="cr-contact-section">
            <h3>Contact</h3>
            <ul className="cr-contact-list">
              {email && <li className="cr-contact-item email">{email}</li>}
              {phone && <li className="cr-contact-item phone">{phone}</li>}
              {location && <li className="cr-contact-item location">{location}</li>}
              {linkedin && <li className="cr-contact-item linkedin">{linkedin}</li>}
              {website && <li className="cr-contact-item website">{website}</li>}
            </ul>
          </div>

          {skills && skills.length > 0 && (
            <div className="cr-skills-section">
              <h3>Skills</h3>
              <div className="cr-skills-list">
                {skills.map((skill, index) => (
                  <div key={index} className="cr-skill-item">
                    <span className="cr-skill-name">{skill.name}</span>
                    <div className="cr-skill-bar">
                      <div 
                        className="cr-skill-progress" 
                        style={{ 
                          width: 
                            skill.level === 'beginner' ? '25%' : 
                            skill.level === 'intermediate' ? '50%' : 
                            skill.level === 'advanced' ? '75%' : '100%' 
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="cr-main">
          {summary && (
            <div className="cr-section summary-section">
              <h3>About Me</h3>
              <div className="cr-summary">
                <p>{summary}</p>
              </div>
            </div>
          )}

          {experience && experience.length > 0 && (
            <div className="cr-section">
              <h3>Experience</h3>
              <div className="cr-timeline">
                {experience.map((exp, index) => (
                  <div key={index} className="cr-timeline-item">
                    <div className="cr-timeline-marker"></div>
                    <div className="cr-timeline-content">
                      <div className="cr-item-header">
                        <h4>{exp.position}</h4>
                        <span className="cr-company">{exp.company}</span>
                      </div>
                      <div className="cr-item-meta">
                        <span className="cr-item-date">
                          {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}
                        </span>
                        {exp.location && <span className="cr-item-location">{exp.location}</span>}
                      </div>
                      {exp.description && <p className="cr-item-description">{exp.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {education && education.length > 0 && (
            <div className="cr-section">
              <h3>Education</h3>
              <div className="cr-timeline">
                {education.map((edu, index) => (
                  <div key={index} className="cr-timeline-item">
                    <div className="cr-timeline-marker"></div>
                    <div className="cr-timeline-content">
                      <div className="cr-item-header">
                        <h4>{edu.school}</h4>
                        <span className="cr-degree">
                          {edu.degree}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}
                        </span>
                      </div>
                      <div className="cr-item-meta">
                        <span className="cr-item-date">
                          {formatDate(edu.startDate)} — {edu.current ? 'Present' : formatDate(edu.endDate)}
                        </span>
                        {edu.location && <span className="cr-item-location">{edu.location}</span>}
                      </div>
                      {edu.description && <p className="cr-item-description">{edu.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {projects && projects.length > 0 && (
            <div className="cr-section">
              <h3>Projects</h3>
              <div className="cr-projects-grid">
                {projects.map((project, index) => (
                  <div key={index} className="cr-project-card">
                    <h4>{project.title}</h4>
                    {project.role && <div className="cr-project-role">{project.role}</div>}
                    {project.date && <div className="cr-project-date">{project.date}</div>}
                    {project.description && <p className="cr-project-description">{project.description}</p>}
                    {project.technologies && (
                      <div className="cr-project-technologies">
                        {project.technologies.split(',').map((tech, i) => (
                          <span key={i} className="cr-tech-tag">{tech.trim()}</span>
                        ))}
                      </div>
                    )}
                    {project.url && (
                      <a href={project.url} target="_blank" rel="noopener noreferrer" className="cr-project-link">
                        View Project
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreativeTemplate;
