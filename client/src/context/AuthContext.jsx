import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Validate session on app mount
  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await API.get('/auth/me');
        if (response.data.success) {
          setAdmin(response.data.data);
        } else {
          localStorage.removeItem('adminToken');
        }
      } catch (error) {
        console.error('Session verification failed:', error.message);
        localStorage.removeItem('adminToken');
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminUser', JSON.stringify(user));
        setAdmin(user);
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      return { success: false, error: message };
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await API.post('/auth/logout');
    } catch (error) {
      console.error('API logout error:', error.message);
    } finally {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      setAdmin(null);
      window.location.href = '/admin/login';
    }
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
