import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../utils/api';
import './ResumeList.css';

const ResumeList = ({ onCreateNew }) => {
  const { currentUser } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  
  // Fetch user resumes from backend
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await apiService.getUserResumes();
        setResumes(response.resumes || []);
      } catch (error) {
        console.error('Error fetching resumes:', error);
        setError('Failed to load resumes');
        setResumes([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser) {
      fetchResumes();
    }
  }, [currentUser]);
  
  // Filter resumes based on search term
  const filteredResumes = resumes.filter(resume => 
    resume.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) {
      return 'Unknown';
    }
    
    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Handle download resume
  const handleDownloadResume = async (resumeId, resumeName) => {
    try {
      const blob = await apiService.downloadResume(resumeId);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${resumeName}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading resume:', error);
      alert('Failed to download resume. Please try again.');
    }
  };

  // Handle delete resume
  const handleDeleteResume = async (resumeId) => {
    if (!window.confirm('Are you sure you want to delete this resume? This action cannot be undone.')) {
      return;
    }

    try {
      await apiService.deleteResume(resumeId);
      // Remove from local state
      setResumes(resumes.filter(resume => resume.id !== resumeId));
      alert('Resume deleted successfully');
    } catch (error) {
      console.error('Error deleting resume:', error);
      alert('Failed to delete resume. Please try again.');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    }
  };

  if (isLoading) {
    return (
      <div className="resume-list-container">
        <div className="loading-container">
          <div className="loading-spinner">Loading resumes...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="resume-list-container">
        <div className="error-container">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="resume-list-container">
      <div className="resume-list-header">
        <h2>My Resumes</h2>
        <div className="resume-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search resumes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>
      
      {filteredResumes.length === 0 ? (
        <motion.div 
          className="no-resumes"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="no-resumes-icon">📄</div>
          <h3>No resumes found</h3>
          <p>{resumes.length === 0 ? 'Create your first resume to get started!' : 'No resumes match your search.'}</p>
          {resumes.length === 0 && (
            <motion.button 
              className="create-resume-button"
              onClick={onCreateNew}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Create Resume
            </motion.button>
          )}
        </motion.div>
      ) : (
        <motion.div 
          className="resume-items-container list"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {filteredResumes.map(resume => (
              <motion.div 
                key={resume.id} 
                className="resume-item list"
                variants={itemVariants}
                layout
                whileHover={{ 
                  y: -2,
                  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.12)"
                }}
              >
                <div className="resume-icon">
                  <span>📄</span>
                </div>
                
                <div className="resume-details">
                  <h3>{resume.name}</h3>
                  <div className="resume-meta">
                    <span className="resume-template">{resume.template}</span>
                    <span className="resume-date">Modified: {formatDate(resume.updatedAt)}</span>
                    <span className="resume-size">
                      Size: {(resume.originalSize / 1024).toFixed(1)} KB 
                      (Compressed: {(resume.compressedSize / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                </div>
                
                <div className="resume-actions">
                  <motion.button 
                    className="action-button download"
                    onClick={() => handleDownloadResume(resume.id, resume.name)}
                    title="Download Resume"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Download
                  </motion.button>
                  <motion.button 
                    className="action-button delete"
                    onClick={() => handleDeleteResume(resume.id)}
                    title="Delete Resume"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default ResumeList;
