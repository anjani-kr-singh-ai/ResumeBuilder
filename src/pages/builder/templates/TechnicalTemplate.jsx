import React from 'react';
import './TechnicalTemplate.css';

const TechnicalTemplate = ({ data }) => {
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

  // Function to group skills by level
  const groupSkillsByLevel = () => {
    if (!skills || skills.length === 0) return {};
    
    return skills.reduce((acc, skill) => {
      const level = skill.level || 'other';
      if (!acc[level]) {
        acc[level] = [];
      }
      acc[level].push(skill.name);
      return acc;
    }, {});
  };

  const skillsByLevel = groupSkillsByLevel();

  return (
    <div className="technical-template">
      {/* Header */}
      <header className="tech-header">
        <div className="tech-name-title">
          {fullName && <h1>{fullName}</h1>}
          {jobTitle && <h2>{jobTitle}</h2>}
        </div>
        
        <div className="tech-contact">
          {email && <div className="tech-contact-item">{email}</div>}
          {phone && <div className="tech-contact-item">{phone}</div>}
          {location && <div className="tech-contact-item">{location}</div>}
          {linkedin && <div className="tech-contact-item">{linkedin}</div>}
          {website && <div className="tech-contact-item">{website}</div>}
        </div>
      </header>

      {/* Two Column Layout */}
      <div className="tech-layout">
        {/* Left Column */}
        <div className="tech-left-column">
          {/* Skills Section */}
          {skills && skills.length > 0 && (
            <section className="tech-section">
              <h3 className="tech-section-title">Technical Skills</h3>
              
              {skillsByLevel.expert && skillsByLevel.expert.length > 0 && (
                <div className="tech-skill-category">
                  <h4>Expert</h4>
                  <div className="tech-skill-tags">
                    {skillsByLevel.expert.map((skill, index) => (
                      <span key={index} className="tech-skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              )}
              
              {skillsByLevel.advanced && skillsByLevel.advanced.length > 0 && (
                <div className="tech-skill-category">
                  <h4>Advanced</h4>
                  <div className="tech-skill-tags">
                    {skillsByLevel.advanced.map((skill, index) => (
                      <span key={index} className="tech-skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              )}
              
              {skillsByLevel.intermediate && skillsByLevel.intermediate.length > 0 && (
                <div className="tech-skill-category">
                  <h4>Intermediate</h4>
                  <div className="tech-skill-tags">
                    {skillsByLevel.intermediate.map((skill, index) => (
                      <span key={index} className="tech-skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              )}
              
              {skillsByLevel.beginner && skillsByLevel.beginner.length > 0 && (
                <div className="tech-skill-category">
                  <h4>Familiar</h4>
                  <div className="tech-skill-tags">
                    {skillsByLevel.beginner.map((skill, index) => (
                      <span key={index} className="tech-skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              )}
              
              {skillsByLevel.other && skillsByLevel.other.length > 0 && (
                <div className="tech-skill-category">
                  <h4>Other Skills</h4>
                  <div className="tech-skill-tags">
                    {skillsByLevel.other.map((skill, index) => (
                      <span key={index} className="tech-skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Education Section */}
          {education && education.length > 0 && (
            <section className="tech-section">
              <h3 className="tech-section-title">Education</h3>
              {education.map((edu, index) => (
                <div key={index} className="tech-education-item">
                  <div className="tech-edu-header">
                    <h4>{edu.school}</h4>
                    <div className="tech-edu-date">
                      {formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate)}
                    </div>
                  </div>
                  <div className="tech-edu-degree">
                    {edu.degree}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}
                  </div>
                  {edu.location && <div className="tech-edu-location">{edu.location}</div>}
                  {edu.description && <p className="tech-edu-description">{edu.description}</p>}
                </div>
              ))}
            </section>
          )}

          {/* Projects Section */}
          {projects && projects.length > 0 && (
            <section className="tech-section">
              <h3 className="tech-section-title">Projects</h3>
              {projects.map((project, index) => (
                <div key={index} className="tech-project-item">
                  <div className="tech-project-header">
                    <h4>{project.title}</h4>
                    {project.date && <div className="tech-project-date">{project.date}</div>}
                  </div>
                  
                  {project.role && <div className="tech-project-role">{project.role}</div>}
                  
                  {project.description && <p className="tech-project-description">{project.description}</p>}
                  
                  {project.technologies && (
                    <div className="tech-project-tech">
                      <strong>Tech:</strong> {project.technologies}
                    </div>
                  )}
                  
                  {project.url && (
                    <div className="tech-project-url">
                      <a href={project.url} target="_blank" rel="noopener noreferrer">{project.url}</a>
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}
        </div>

        {/* Right Column */}
        <div className="tech-right-column">
          {/* Summary Section */}
          {summary && (
            <section className="tech-section tech-summary-section">
              <p>{summary}</p>
            </section>
          )}

          {/* Experience Section */}
          {experience && experience.length > 0 && (
            <section className="tech-section">
              <h3 className="tech-section-title">Professional Experience</h3>
              {experience.map((exp, index) => (
                <div key={index} className="tech-experience-item">
                  <div className="tech-exp-header">
                    <h4>{exp.position}</h4>
                    <div className="tech-exp-date">
                      {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </div>
                  </div>
                  
                  <div className="tech-exp-company">{exp.company}</div>
                  {exp.location && <div className="tech-exp-location">{exp.location}</div>}
                  
                  {exp.description && (
                    <div className="tech-exp-description">
                      <p>{exp.description}</p>
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechnicalTemplate;
