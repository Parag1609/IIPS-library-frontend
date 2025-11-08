import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    if (authService.isAuthenticated()) {
      try {
        const data = await authService.getMe();
        setAdmin(data.admin);
      } catch (error) {
        console.error('Auth check failed:', error);
        setAdmin(null);
      }
    }
    setLoading(false);
  };

  const login = async (username, password) => {
    const data = await authService.login(username, password);
    setAdmin(data.admin);
    return data;
  };

  const logout = async () => {
    await authService.logout();
    setAdmin(null);
  };

  const value = {
    admin,
    loading,
    login,
    logout,
    isAuthenticated: !!admin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
