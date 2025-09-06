import React, { createContext, useState, useEffect, useContext } from 'react';
import apiService from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on component mount
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('auth_token');
      
      if (token) {
        try {
          // Verify token with backend and get user data
          const userData = await apiService.getUserProfile();
          setCurrentUser(userData.user);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Auth check failed:', error);
          // Token is invalid, clear it
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
          setIsAuthenticated(false);
          setCurrentUser(null);
        }
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
      
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      const response = await apiService.login(credentials);
      
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user_data', JSON.stringify(response.data.user));
      setCurrentUser(response.data.user);
      setIsAuthenticated(true);
      
      return { success: true, user: response.data.user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await apiService.register(userData);
      return { success: true, message: response.message };
    } catch (error) {
      console.error('Registration error:', error);
      // Handle specific validation errors from backend
      if (error.message && error.message.includes('validation')) {
        return { success: false, error: 'Please check your input and try again.' };
      }
      return { success: false, error: error.message };
    }
  };

  // Verify OTP function
  const verifyOTP = async (email, otp, registrationData) => {
    try {
      console.log('Verifying OTP:', { email, otp: String(otp), registrationData }); // Debug log
      
      const response = await apiService.verifyOTP(email, String(otp), registrationData);
      
      if (response && response.data) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user_data', JSON.stringify(response.data.user));
        setCurrentUser(response.data.user);
        setIsAuthenticated(true);
        
        return { success: true, user: response.data.user };
      } else {
        return { success: false, error: 'Invalid response from server' };
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      
      // Handle specific error messages
      if (error.message && error.message.includes('Invalid or expired OTP')) {
        return { success: false, error: 'The OTP you entered is invalid or has expired. Please request a new one.' };
      }
      
      return { success: false, error: error.message || 'OTP verification failed' };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  // Forgot password function
  const forgotPassword = async (email) => {
    try {
      const response = await apiService.forgotPassword(email);
      return { success: true, message: response.message };
    } catch (error) {
      console.error('Forgot password error:', error);
      return { success: false, error: error.message };
    }
  };

  // Reset password function
  const resetPassword = async (email, otp, newPassword) => {
    try {
      const response = await apiService.resetPassword(email, otp, newPassword);
      return { success: true, message: response.message };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    currentUser,
    isAuthenticated,
    isLoading,
    login,
    register,
    verifyOTP,
    logout,
    forgotPassword,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
