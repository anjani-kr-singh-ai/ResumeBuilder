import React, { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import './AuthStyles.css';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1 = email, 2 = OTP verification, 3 = reset password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const { forgotPassword, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const result = await forgotPassword(email);
      
      if (result.success) {
        setSuccessMessage(result.message);
        setStep(2); // Move to OTP verification
      } else {
        setError(result.error || 'Failed to send reset code. Please try again.');
      }
      
    } catch (error) {
      setError('Network error. Please check your connection and try again.');
      console.error('Forgot password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerification = (e) => {
    e.preventDefault();
    setError('');
    
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    
    setStep(3); // Move to reset password
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await resetPassword(email, otp, newPassword);
      
      if (result.success) {
        setSuccessMessage('Password reset successfully!');
        // Redirect to sign in page after 2 seconds
        setTimeout(() => {
          navigate('/signin');
        }, 2000);
      } else {
        setError(result.error || 'Failed to reset password. Please try again.');
      }
      
    } catch (error) {
      setError('Network error. Please check your connection and try again.');
      console.error('Reset password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Render different steps based on current step
  const renderStepContent = () => {
    switch (step) {
      case 1: // Email step
        return (
          <>
            <div className="auth-header">
              <h2>Forgot Password</h2>
              <p>Enter your email to receive a verification code</p>
            </div>
            <form onSubmit={handleEmailSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <motion.input
                  whileFocus={{ boxShadow: "0 0 0 2px rgba(13, 110, 253, 0.25)" }}
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              {error && (
                <motion.div 
                  className="auth-error"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {error}
                </motion.div>
              )}
              
              {successMessage && (
                <motion.div 
                  className="auth-success"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {successMessage}
                </motion.div>
              )}
              
              <motion.button 
                type="submit" 
                className="auth-button"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  'Send Verification Code'
                )}
              </motion.button>
            </form>
          </>
        );
      
      case 2: // OTP verification
        return (
          <>
            <div className="auth-header">
              <h2>Verify Email</h2>
              <p>Enter the OTP sent to {email}</p>
            </div>
            <form onSubmit={handleOtpVerification} className="auth-form">
              <div className="form-group">
                <label htmlFor="otp">OTP</label>
                <motion.input
                  whileFocus={{ boxShadow: "0 0 0 2px rgba(13, 110, 253, 0.25)" }}
                  type="text"
                  id="otp"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  required
                />
              </div>
              
              {error && (
                <motion.div 
                  className="auth-error"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {error}
                </motion.div>
              )}
              
              <div className="form-actions">
                <button type="button" className="back-button" onClick={() => setStep(1)}>
                  Back
                </button>
                <motion.button 
                  type="submit" 
                  className="auth-button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Verify OTP
                </motion.button>
              </div>
            </form>
            <p className="resend-otp">
              Didn't receive the code? <button type="button" onClick={handleEmailSubmit}>Resend</button>
            </p>
          </>
        );
      
      case 3: // Reset password
        return (
          <>
            <div className="auth-header">
              <h2>Reset Password</h2>
              <p>Create a new password for your account</p>
            </div>
            <form onSubmit={handleResetPassword} className="auth-form">
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <motion.input
                  whileFocus={{ boxShadow: "0 0 0 2px rgba(13, 110, 253, 0.25)" }}
                  type="password"
                  id="newPassword"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <motion.input
                  whileFocus={{ boxShadow: "0 0 0 2px rgba(13, 110, 253, 0.25)" }}
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <motion.div 
                  className="auth-error"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {error}
                </motion.div>
              )}
              
              {successMessage && (
                <motion.div 
                  className="auth-success"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {successMessage}
                </motion.div>
              )}

              <div className="form-actions">
                <button type="button" className="back-button" onClick={() => setStep(2)}>
                  Back
                </button>
                <motion.button 
                  type="submit" 
                  className="auth-button"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <div className="loading-spinner"></div>
                  ) : (
                    'Reset Password'
                  )}
                </motion.button>
              </div>
            </form>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="auth-container">
      <motion.div 
        className="auth-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {renderStepContent()}
        
        <motion.div 
          className="auth-redirect"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <p>Remember your password? <Link to="/signin">Sign In</Link></p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
