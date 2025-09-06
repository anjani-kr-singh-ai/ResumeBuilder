import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ResumeList.css';

const ResumeList = ({ resumes, onEdit, onDownload, onDelete, onCreateNew }) => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter resumes based on search term
  const filteredResumes = resumes.filter(resume => 
    resume.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
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
          <div className="view-toggle">
            <button 
              className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              Grid
            </button>
            <button 
              className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              List
            </button>
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
          <p>Create your first resume to get started!</p>
          <motion.button 
            className="create-resume-button"
            onClick={onCreateNew}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Create Resume
          </motion.button>
        </motion.div>
      ) : (
        <motion.div 
          className={`resume-items-container ${viewMode}`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {filteredResumes.map(resume => (
              <motion.div 
                key={resume.id} 
                className={`resume-item ${viewMode}`}
                variants={itemVariants}
                layout
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 12px 25px rgba(0, 0, 0, 0.15)"
                }}
              >
                <div className="resume-thumbnail">
                  {resume.thumbnail ? (
                    <img src={resume.thumbnail} alt={resume.title} />
                  ) : (
                    <div className="thumbnail-placeholder">
                      <span>{resume.template[0]}</span>
                    </div>
                  )}
                </div>
                
                <div className="resume-details">
                  <h3>{resume.title}</h3>
                  <div className="resume-meta">
                    <span className="resume-template">{resume.template}</span>
                    <span className="resume-date">Last modified: {formatDate(resume.lastModified)}</span>
                  </div>
                </div>
                
                <div className="resume-actions">
                  <motion.button 
                    className="action-button edit"
                    onClick={() => onEdit(resume.id)}
                    title="Edit Resume"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Edit
                  </motion.button>
                  <motion.button 
                    className="action-button download"
                    onClick={() => onDownload(resume.id)}
                    title="Download Resume"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Download
                  </motion.button>
                  <motion.button 
                    className="action-button delete"
                    onClick={() => onDelete(resume.id)}
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
