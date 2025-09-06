const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const { sendOTPEmail } = require('../utils/sendEmail');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Generate random OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Set JWT cookie
const setTokenCookie = (res, token) => {
  const cookieOptions = {
    expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRE) * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };
  
  res.cookie('token', token, cookieOptions);
};

// Register user (Step 1: Send OTP)
const register = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, password } = req.body;
    
    // Process email (preserve dots, only trim and lowercase)
    const processedEmail = email.toLowerCase().trim();
    console.log('Registration request:', { name, email: processedEmail });

    // Check if user already exists
    const existingUser = await User.findByEmail(processedEmail);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Store OTP
    await User.storeOTP(processedEmail, otp, 'registration');
    
    // Send OTP email
    await sendOTPEmail(processedEmail, otp, 'registration');
    
    res.status(200).json({
      success: true,
      message: 'OTP sent to your email. Please verify to complete registration.'
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp, name, password } = req.body;
    
    // Process email (preserve dots, only trim and lowercase)
    const processedEmail = email.toLowerCase().trim();
    
    console.log('OTP verification request:', { email: processedEmail, otp, name: !!name, password: !!password });
    
    if (!processedEmail || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }
    
    // Verify OTP
    const isValidOTP = await User.verifyOTP(processedEmail, otp, 'registration');
    
    if (!isValidOTP) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }
    
    // Create user with processed email
    const newUser = new User({ name, email: processedEmail, password });
    const userId = await newUser.save();
    
    // Mark user as verified
    await User.verifyUser(processedEmail);
    
    // Clean up used OTPs
    await User.cleanExpiredOTPs();
    
    // Generate token
    const token = generateToken(userId);
    setTokenCookie(res, token);
    
    // Get user data (without password)
    const userData = await User.findById(userId);
    delete userData.password;
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: userData
    });
    
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;
    
    // Process email (preserve dots, only trim and lowercase)
    const processedEmail = email.toLowerCase().trim();
    console.log('Login attempt for:', processedEmail);

    // Find user by email
    const user = await User.findByEmail(processedEmail);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user is verified
    if (!user.is_verified) {
      return res.status(401).json({
        success: false,
        message: 'Please verify your email before logging in'
      });
    }

    // Verify password
    const isValidPassword = await User.comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token and set cookie
    const token = generateToken(user.id);
    setTokenCookie(res, token);

    // Remove password from user data
    delete user.password;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Forgot password (Step 1: Send OTP)
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    // Check if user exists
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found with this email'
      });
    }
    
    // Generate and store OTP
    const otp = generateOTP();
    await User.storeOTP(email, otp, 'password_reset');
    
    // Send OTP email
    await sendOTPEmail(email, otp, 'password_reset');
    
    res.status(200).json({
      success: true,
      message: 'Password reset OTP sent to your email'
    });
    
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Reset password (Step 2: Verify OTP and update password)
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    
    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email, OTP, and new password are required'
      });
    }
    
    // Verify OTP
    const isValidOTP = await User.verifyOTP(email, otp, 'password_reset');
    if (!isValidOTP) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }
    
    // Update password
    await User.updatePassword(email, newPassword);
    
    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });
    
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Logout user
const logout = async (req, res) => {
  try {
    res.cookie('token', '', {
      expires: new Date(0),
      httpOnly: true
    });
    
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  register,
  verifyOTP,
  login,
  forgotPassword,
  resetPassword,
  logout,
  getCurrentUser
};