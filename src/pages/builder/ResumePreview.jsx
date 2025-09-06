import React, { useState, useEffect, useRef } from 'react';
import ProfessionalTemplate from './templates/ProfessionalTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import TechnicalTemplate from './templates/TechnicalTemplate';
import './ResumePreview.css';

const ResumePreview = ({ template, data, lastUpdated }) => {
  const [scale, setScale] = useState(1);
  const [isUpdating, setIsUpdating] = useState(false);
  const previewRef = useRef(null);
  
  // Handle resize to fit preview - A4 size
  useEffect(() => {
    const handleResize = () => {
      if (previewRef.current) {
        const containerWidth = previewRef.current.offsetWidth;
        // A4 width in mm (210mm) converted to pixels at approx 3.78px/mm
        const a4Width = 210 * 3.78; 
        // Calculate scale with padding allowance
        const newScale = Math.min(0.95, (containerWidth - 40) / a4Width);
        setScale(newScale);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Show update animation
  useEffect(() => {
    if (lastUpdated) {
      setIsUpdating(true);
      const timer = setTimeout(() => setIsUpdating(false), 600);
      return () => clearTimeout(timer);
    }
  }, [data, lastUpdated]);
  
  // Transform resume data to template format
  const formatDataForTemplate = () => {
    if (!data) return {};
    
    // Extract personal info
    const { personal, education, experience, skills, projects } = data;
    
    // Format experience with proper dates
    const formattedExperience = experience ? experience.map(exp => ({
      ...exp,
      startDate: exp.startDate,
      endDate: exp.current ? 'Present' : exp.endDate
    })) : [];
    
    // Create formatted data object
    const formattedData = {
      // Personal info
      fullName: `${personal.firstName || ''} ${personal.lastName || ''}`.trim(),
      jobTitle: personal.title || '',
      email: personal.email || '',
      phone: personal.phone || '',
      location: personal.city || personal.state ? `${personal.city || ''}${personal.city && personal.state ? ', ' : ''}${personal.state || ''}${(personal.city || personal.state) && personal.zipCode ? ' ' : ''}${personal.zipCode || ''}`.trim() : '',
      linkedin: personal.linkedin || '',
      website: personal.website || '',
      summary: personal.summary || '',
      
      // Pass other sections with formatting
      education: education || [],
      experience: formattedExperience,
      skills: skills || [],
      projects: projects || []
    };
    
    return formattedData;
  };
  
  const renderTemplate = () => {
    const formattedData = formatDataForTemplate();
    
    switch (template) {
      case 'professional':
        return <ProfessionalTemplate data={formattedData} />;
      case 'creative':
        return <CreativeTemplate data={formattedData} />;
      case 'minimal':
        return <MinimalTemplate data={formattedData} />;
      case 'technical':
        return <TechnicalTemplate data={formattedData} />;
      default:
        return <ProfessionalTemplate data={formattedData} />;
    }
  };

  return (
    <div className={`resume-preview ${isUpdating ? 'updating' : ''}`}>
      <div className="preview-header">
        <h3>Live Preview</h3>
        <span className="preview-label">A4 PDF Format</span>
      </div>
      
      <div className="preview-document" ref={previewRef}>
        <div className="resume-template-wrapper" style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}>
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
