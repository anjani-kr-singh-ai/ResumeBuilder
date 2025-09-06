import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './AuthStyles.css';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1 = email, 2 = OTP verification, 3 = reset password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would send OTP to the email
    console.log('Sending OTP to:', email);
    setStep(2); // Move to OTP verification
  };

  const handleOtpVerification = (e) => {
    e.preventDefault();
    // Verify OTP
    console.log('Verifying OTP:', otp);
    setStep(3); // Move to reset password
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    // Reset password
    console.log('Resetting password for:', email);
    // Redirect to sign in page after successful password reset
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
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="auth-button">
                Send Verification Code
              </button>
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
                <input
                  type="text"
                  id="otp"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" className="back-button" onClick={() => setStep(1)}>
                  Back
                </button>
                <button type="submit" className="auth-button">
                  Verify OTP
                </button>
              </div>
            </form>
            <p className="resend-otp">
              Didn't receive the code? <button type="button">Resend</button>
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
                <input
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
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="button" className="back-button" onClick={() => setStep(2)}>
                  Back
                </button>
                <button type="submit" className="auth-button">
                  Reset Password
                </button>
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
      <div className="auth-card">
        {renderStepContent()}
        
        <div className="auth-redirect">
          <p>Remember your password? <Link to="/signin">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
