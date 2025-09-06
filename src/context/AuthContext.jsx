import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on component mount
    const checkAuthStatus = () => {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user_data');
      
      if (token) {
        // In a real app, you would validate the token with your backend
        setIsAuthenticated(true);
        if (userData) {
          setCurrentUser(JSON.parse(userData));
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
  const login = (userData, token) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_data', JSON.stringify(userData));
    setCurrentUser(userData);
    setIsAuthenticated(true);
    return true;
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  // For demo or development purposes
  const devLogin = () => {
    const mockUser = {
      id: 'user-123',
      name: 'Demo User',
      email: 'demo@example.com',
      profileImage: '',
    };
    const mockToken = 'demo-token-xyz';
    
    return login(mockUser, mockToken);
  };

  const value = {
    currentUser,
    isAuthenticated,
    isLoading,
    login,
    logout,
    devLogin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
