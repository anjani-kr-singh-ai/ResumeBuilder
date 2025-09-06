import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProfileDetails from './ProfileDetails';
import ResumeList from './ResumeList';
// Removed Analytics import since we're removing the Activity Summary section
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Mock user data - in a real app, this would come from an API or authentication context
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    age: 28,
    profilePicture: null,
    joined: 'August 2025'
  });

  // Mock resume data - in a real app, this would come from an API
  const [resumes, setResumes] = useState([
    {
      id: 1,
      title: 'Software Developer Resume',
      lastModified: '2025-09-01T14:30:00',
      template: 'Professional',
      thumbnail: null
    },
    {
      id: 2,
      title: 'UI/UX Designer CV',
      lastModified: '2025-08-25T10:15:00',
      template: 'Creative',
      thumbnail: null
    },
    {
      id: 3,
      title: 'Project Manager Resume',
      lastModified: '2025-08-20T09:45:00',
      template: 'Minimal',
      thumbnail: null
    }
  ]);

  // Handler functions for resume actions
  const handleEditResume = (id) => {
    console.log(`Editing resume with ID: ${id}`);
    // Navigate to resume builder with edit mode
    navigate(`/builder/edit/${id}`);
  };

  const handleDownloadResume = (id) => {
    console.log(`Downloading resume with ID: ${id}`);
    // In a real app, this would trigger a download
  };

  const handleDeleteResume = (id) => {
    console.log(`Deleting resume with ID: ${id}`);
    // Remove the resume from the list
    setResumes(resumes.filter(resume => resume.id !== id));
  };

  const handleCreateResume = () => {
    // Navigate to resume builder for new resume
    navigate('/builder');
  };

  // Function to update user profile
  const updateUserProfile = (updatedUser) => {
    setUser({ ...user, ...updatedUser });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <>
      <Navbar />
      <motion.div 
        className="dashboard-container"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div 
          className="dashboard-header"
          variants={itemVariants}
        >
          <div className="header-content">
            <div className="header-text">
              <h1>Welcome back, {user.name.split(' ')[0]}!</h1>
              <p>Manage your resumes and track your progress</p>
            </div>
            <motion.button 
              className="create-resume-btn"
              onClick={handleCreateResume}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="btn-icon">+</span>
              Create New Resume
            </motion.button>
          </div>
        </motion.div>
        
        <motion.div 
          className="dashboard-content"
          variants={containerVariants}
        >
          <motion.div 
            className="dashboard-sidebar"
            variants={itemVariants}
          >
            <ProfileDetails user={user} onUpdateProfile={updateUserProfile} />
            {/* Removed Analytics component - Activity Summary section */}
          </motion.div>
          
          <motion.div 
            className="dashboard-main"
            variants={itemVariants}
          >
            <ResumeList 
              resumes={resumes} 
              onEdit={handleEditResume}
              onDownload={handleDownloadResume}
              onDelete={handleDeleteResume}
              onCreateNew={handleCreateResume}
            />
          </motion.div>
        </motion.div>
      </motion.div>
      <Footer />
    </>
  );
};

export default Dashboard;
