import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProfileDetails from './ProfileDetails';
import ResumeList from './ResumeList';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, isLoading } = useAuth();
  
  // Authentication check
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  // Show loading or redirect if not authenticated
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }
  
  // State for user data (will be fetched from backend)
  const [user, setUser] = useState(currentUser || {
    name: 'Loading...',
    email: 'Loading...',
    age: null,
    profilePicture: null,
    joined: 'Loading...'
  });

  // Mock resume data - in a real app, this would come from an API
  const [resumes, setResumes] = useState([]);
  const [isLoadingResumes, setIsLoadingResumes] = useState(true);

  useEffect(() => {
    // Update user data when currentUser changes
    if (currentUser) {
      setUser({
        name: currentUser.name || currentUser.email?.split('@')[0] || 'User',
        email: currentUser.email,
        age: currentUser.age || null,
        profilePicture: currentUser.profilePicture || null,
        joined: currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long' 
        }) : 'Recently'
      });
    }
  }, [currentUser]);

  useEffect(() => {
    // Fetch user's resumes from backend
    const fetchResumes = async () => {
      try {
        // TODO: Replace with actual API call when resume endpoints are ready
        // const response = await apiService.getUserResumes();
        // setResumes(response.resumes);
        
        // For now, use mock data
        setTimeout(() => {
          setResumes([
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
          setIsLoadingResumes(false);
        }, 1000);
        
      } catch (error) {
        console.error('Error fetching resumes:', error);
        setIsLoadingResumes(false);
      }
    };

    if (isAuthenticated) {
      fetchResumes();
    }
  }, [isAuthenticated]);

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
    // TODO: Add API call to update user profile on backend
    // apiService.updateProfile(updatedUser);
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
          </motion.div>
          
          <motion.div 
            className="dashboard-main"
            variants={itemVariants}
          >
            <ResumeList 
              resumes={resumes} 
              isLoading={isLoadingResumes}
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
