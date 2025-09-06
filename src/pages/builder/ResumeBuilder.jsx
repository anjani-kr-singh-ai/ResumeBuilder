import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import TemplateSelector from './TemplateSelector';
import ResumeForm from './ResumeForm';
import ResumePreview from './ResumePreview';
import AIAssistant from './AIAssistant';
import ExportOptions from './ExportOptions';
import './ResumeBuilder.css';

// AI suggestions state is now handled inside AIAssistant component

const ResumeBuilder = () => {
  // Selected template
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  // Track what field was last updated for highlighting
  const [lastUpdated, setLastUpdated] = useState(null);
  // Toggle split view on mobile
  const [showPreview, setShowPreview] = useState(false);
  
  // Resume data state
  const [resumeData, setResumeData] = useState({
    personal: {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@example.com',
      phone: '(555) 123-4567',
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      title: 'Senior Software Engineer',
      summary: 'Experienced software engineer with over 8 years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies. Passionate about creating efficient, scalable solutions and mentoring junior developers.',
      linkedin: 'linkedin.com/in/johnsmith',
      website: 'johnsmith.dev',
    },
    education: [
      {
        id: 'edu-1',
        institution: 'University of Technology',
        degree: 'Master of Science',
        field: 'Computer Science',
        startDate: '2010-09-01',
        endDate: '2012-05-30',
        location: 'Boston, MA',
        description: 'Specialized in Artificial Intelligence and Machine Learning. Completed thesis on neural network optimization.',
        gpa: '3.8',
      },
      {
        id: 'edu-2',
        institution: 'State University',
        degree: 'Bachelor of Science',
        field: 'Computer Engineering',
        startDate: '2006-09-01',
        endDate: '2010-05-30',
        location: 'Chicago, IL',
        description: 'Graduated with honors. Active member of the ACM student chapter.',
        gpa: '3.7',
      }
    ],
    experience: [
      {
        id: 'exp-1',
        company: 'Tech Solutions Inc.',
        position: 'Senior Software Engineer',
        startDate: '2019-03-01',
        endDate: '',
        current: true,
        location: 'New York, NY',
        description: 'Lead developer for the company\'s flagship product, a cloud-based enterprise resource planning system.',
        achievements: [
          'Reduced application load time by 40% through code optimization and implementing lazy loading techniques',
          'Mentored junior developers and established code review best practices that improved code quality by 30%',
          'Led migration from monolithic architecture to microservices, resulting in improved scalability and deployment frequency'
        ],
      },
      {
        id: 'exp-2',
        company: 'WebDev Experts',
        position: 'Full Stack Developer',
        startDate: '2016-06-01',
        endDate: '2019-02-28',
        current: false,
        location: 'Boston, MA',
        description: 'Worked on multiple client projects developing responsive web applications using React and Node.js.',
        achievements: [
          'Developed and maintained 15+ client websites and web applications',
          'Implemented CI/CD pipelines that reduced deployment time by 65%',
          'Created a reusable component library that accelerated development time by 25%'
        ],
      }
    ],
    skills: [
      {
        id: 'skill-1',
        name: 'JavaScript/TypeScript',
        level: 'expert',
      },
      {
        id: 'skill-2',
        name: 'React & React Native',
        level: 'expert',
      },
      {
        id: 'skill-3',
        name: 'Node.js',
        level: 'expert',
      },
      {
        id: 'skill-4',
        name: 'AWS/Azure Cloud Services',
        level: 'advanced',
      },
      {
        id: 'skill-5',
        name: 'GraphQL',
        level: 'intermediate',
      },
      {
        id: 'skill-6',
        name: 'Docker & Kubernetes',
        level: 'advanced',
      }
    ],
    projects: [
      {
        id: 'proj-1',
        title: 'E-Commerce Platform',
        role: 'Lead Developer',
        date: '2020 - 2021',
        description: 'Developed a full-featured e-commerce platform with product management, payment processing, and order tracking capabilities.',
        technologies: 'React, Node.js, MongoDB, Stripe API, AWS S3',
        url: 'github.com/johnsmith/ecommerce-platform'
      },
      {
        id: 'proj-2',
        title: 'Healthcare Analytics Dashboard',
        role: 'Frontend Developer',
        date: '2019',
        description: 'Built an interactive dashboard for healthcare professionals to visualize patient data and treatment outcomes.',
        technologies: 'React, D3.js, Material UI, Jest, Firebase',
        url: 'healthanalyticsdemo.com'
      }
    ],
    achievements: [
      {
        id: 'ach-1',
        title: '',
        issuer: '',
        date: '',
        description: '',
      }
    ],
  });

  // AI suggestions state is now handled inside AIAssistant component

  // Handle resume data changes
  const handleResumeDataChange = (section, data) => {
    setResumeData({
      ...resumeData,
      [section]: data,
    });
  };

  // Handle specific field change
  const handleFieldChange = (section, id, field, value) => {
    // Track what was updated to highlight in preview
    setLastUpdated({ section, id, field, timestamp: Date.now() });
    
    // Mobile: Show preview when a change is made
    if (window.innerWidth <= 1200) {
      setShowPreview(true);
      
      // Auto hide preview after 3 seconds
      setTimeout(() => {
        setShowPreview(false);
      }, 3000);
    }
    
    if (section === 'personal') {
      setResumeData({
        ...resumeData,
        personal: {
          ...resumeData.personal,
          [field]: value,
        },
      });
    } else {
      // For arrays like education, experience, etc.
      const updatedItems = resumeData[section].map(item => 
        item.id === id ? { ...item, [field]: value } : item
      );
      
      handleResumeDataChange(section, updatedItems);
    }
  };

  // Add item to a section array
  const handleAddItem = (section) => {
    const newId = `${section.slice(0, 3)}-${resumeData[section].length + 1}`;
    let newItem;
    
    switch(section) {
      case 'education':
        newItem = {
          id: newId,
          institution: '',
          degree: '',
          field: '',
          startDate: '',
          endDate: '',
          location: '',
          description: '',
          gpa: '',
        };
        break;
      case 'experience':
        newItem = {
          id: newId,
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          current: false,
          location: '',
          description: '',
          achievements: [],
        };
        break;
      case 'skills':
        newItem = {
          id: newId,
          name: '',
          level: 'Intermediate',
        };
        break;
      case 'projects':
        newItem = {
          id: newId,
          title: '',
          link: '',
          startDate: '',
          endDate: '',
          description: '',
          technologies: [],
        };
        break;
      case 'achievements':
        newItem = {
          id: newId,
          title: '',
          issuer: '',
          date: '',
          description: '',
        };
        break;
      default:
        newItem = { id: newId };
    }
    
    setResumeData({
      ...resumeData,
      [section]: [...resumeData[section], newItem],
    });
  };

  // Remove item from a section array
  const handleRemoveItem = (section, id) => {
    // Don't remove if it's the last item
    if (resumeData[section].length <= 1) return;
    
    const updatedItems = resumeData[section].filter(item => item.id !== id);
    setResumeData({
      ...resumeData,
      [section]: updatedItems,
    });
  };

  // AI suggestions are now handled inside the AIAssistant component

  // AI suggestion generation is now handled inside the AIAssistant component

  return (
    <>
      <Navbar />
      <div className="resume-builder-container">
        <h1 className="builder-title">Resume Builder</h1>
        
        <div className="template-selection-section">
          <h2>Choose a Template</h2>
          <TemplateSelector 
            selectedTemplate={selectedTemplate} 
            onSelectTemplate={setSelectedTemplate} 
          />
        </div>
        
        <div className={`resume-editor-section ${showPreview ? 'show-preview-mobile' : ''}`}>
          <div className="form-container">
            <ResumeForm 
              resumeData={resumeData}
              onFieldChange={handleFieldChange}
              onAddItem={handleAddItem}
              onRemoveItem={handleRemoveItem}
              lastUpdated={lastUpdated}
            />
          </div>
          
          <div className="preview-container">
            <div className="preview-sticky">
              <ResumePreview 
                template={selectedTemplate}
                data={resumeData}
                lastUpdated={lastUpdated}
              />
              
              <ExportOptions 
                resumeData={resumeData}
                template={selectedTemplate}
              />
            </div>
          </div>
        </div>
        
        <div className="ai-assistant-section">
          <AIAssistant 
            resumeData={resumeData}
            onApplySuggestion={(section, id, field, value) => 
              handleFieldChange(section, id, field, value)
            }
          />
        </div>
        
        {/* Mobile toggle button for split view */}
        <button 
          className="split-view-toggle" 
          onClick={() => setShowPreview(!showPreview)}
          aria-label={showPreview ? "Hide Preview" : "Show Preview"}
        >
          {showPreview ? "✏️" : "👁️"}
        </button>
      </div>
      <Footer />
    </>
  );
};

export default ResumeBuilder;
