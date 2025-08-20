import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../config/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return setLoading(false);
        const { data } = await api.get('/auth/me');
        const normalizedUser = { ...data.user, full_name: data.user.fullName };
        setUser(normalizedUser);
      } catch (err) {
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, []);

  // No-op placeholder removed: user profile is loaded via /auth/me on bootstrap

  const signUp = async (email, password, fullName) => {
    const { data } = await api.post('/auth/signup', { email, password, fullName });
    localStorage.setItem('token', data.token);
    const normalizedUser = { ...data.user, full_name: data.user.fullName };
    setUser(normalizedUser);
    return data;
  };

  const signIn = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    const normalizedUser = { ...data.user, full_name: data.user.fullName };
    setUser(normalizedUser);
    return data;
  };

  const signOut = async () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};