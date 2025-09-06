import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import './AuthStyles.css';

const SignUp = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const emailForRegistration = formData.email.toLowerCase().trim();
      setRegisteredEmail(emailForRegistration);
      
      await register({
        name: formData.name,
        email: emailForRegistration,
        password: formData.password
      });
      
      setStep(2);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: registeredEmail,
          otp: otp.toString(),
          name: formData.name,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('User registered successfully');
        setError('');
        
        setTimeout(() => {
          navigate('/signin');
        }, 2000);
      } else {
        setError(data.message || 'OTP verification failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderSignUpForm = () => (
    <motion.div 
      className="auth-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="auth-header">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Create Account
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Join us today! Create your account to get started
        </motion.p>
      </div>

      <motion.form 
        onSubmit={handleSignUp} 
        className="auth-form"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
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
        
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <motion.input
            whileFocus={{ boxShadow: "0 0 0 2px rgba(13, 110, 253, 0.25)" }}
            type="text"
            id="name"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <motion.input
            whileFocus={{ boxShadow: "0 0 0 2px rgba(13, 110, 253, 0.25)" }}
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <motion.input
            whileFocus={{ boxShadow: "0 0 0 2px rgba(13, 110, 253, 0.25)" }}
            type="password"
            id="password"
            name="password"
            placeholder="Create a strong password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <span className="password-hint">
            Must contain at least 6 characters with uppercase, lowercase, and number
          </span>
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <motion.input
            whileFocus={{ boxShadow: "0 0 0 2px rgba(13, 110, 253, 0.25)" }}
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        
        <motion.button 
          type="submit" 
          className="auth-button" 
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            <div className="loading-spinner"></div>
          ) : (
            'Create Account'
          )}
        </motion.button>
      </motion.form>

      <motion.div 
        className="auth-redirect"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <p>Already have an account? <Link to="/signin">Sign In</Link></p>
      </motion.div>
    </motion.div>
  );

  const renderOTPForm = () => (
    <motion.div 
      className="auth-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="auth-header">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Verify Your Email
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          We've sent a verification code to <strong>{registeredEmail}</strong>
        </motion.p>
      </div>

      <motion.form 
        onSubmit={handleOTPVerification} 
        className="auth-form"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
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
        
        {success && (
          <motion.div 
            className="success-message"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="success-icon">✓</div>
            <h3>Registration Successful!</h3>
            <p>Redirecting you to sign in...</p>
          </motion.div>
        )}
        
        {!success && (
          <>
            <div className="form-group">
              <label htmlFor="otp">Verification Code</label>
              <motion.input
                whileFocus={{ boxShadow: "0 0 0 2px rgba(13, 110, 253, 0.25)" }}
                type="text"
                id="otp"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  setError('');
                }}
                required
                maxLength="6"
                style={{
                  textAlign: 'center',
                  fontSize: '1.2rem',
                  letterSpacing: '0.5rem',
                  fontWeight: 'bold'
                }}
              />
            </div>
            
            <motion.button 
              type="submit" 
              className="auth-button" 
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <div className="loading-spinner"></div>
              ) : (
                'Verify Code'
              )}
            </motion.button>
            
            <div className="form-actions" style={{ marginTop: '1rem' }}>
              <motion.button 
                type="button" 
                onClick={() => setStep(1)}
                className="back-button"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Back to Registration
              </motion.button>
            </div>
          </>
        )}
      </motion.form>
    </motion.div>
  );

  return (
    <div className="auth-container">
      {step === 1 ? renderSignUpForm() : renderOTPForm()}
    </div>
  );
};

export default SignUp;
