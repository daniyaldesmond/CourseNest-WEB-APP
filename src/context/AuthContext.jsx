import React, { createContext, useState, useContext, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Persistence logic on page mount/refresh
  useEffect(() => {
    const verifyUserSession = async () => {
      const token = localStorage.getItem('coursenest_token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await apiService.getMe();
        setUser({ ...userData, originalRole: userData.role });
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Session verification failed, logging out:', error.message);
        localStorage.removeItem('coursenest_token');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyUserSession();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await apiService.login(email, password);
      localStorage.setItem('coursenest_token', data.token);
      setUser({ ...data.user, originalRole: data.user.role });
      setIsAuthenticated(true);
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Login error:', error);
      const errMsg = error.response?.data?.message || 'Login failed. Please check credentials.';
      return { success: false, message: errMsg };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const data = await apiService.signup(name, email, password);
      localStorage.setItem('coursenest_token', data.token);
      setUser({ ...data.user, originalRole: data.user.role });
      setIsAuthenticated(true);
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Signup error:', error);
      const errMsg = error.response?.data?.message || 'Signup failed. Please try again.';
      return { success: false, message: errMsg };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('coursenest_token');
  };

  const updateProfile = async (profileData) => {
    try {
      const data = await apiService.updateProfile(profileData);
      // Backend returns { token, user: updatedUser }
      if (data.token) {
        localStorage.setItem('coursenest_token', data.token);
      }
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Update profile error:', error);
      const errMsg = error.response?.data?.message || 'Profile update failed.';
      return { success: false, message: errMsg };
    }
  };

  const uploadAvatar = async (file) => {
    try {
      const data = await apiService.uploadAvatar(file);
      if (data.token) {
        localStorage.setItem('coursenest_token', data.token);
      }
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Upload avatar error:', error);
      const errMsg = error.response?.data?.message || 'Avatar upload failed.';
      return { success: false, message: errMsg };
    }
  };

  const removeAvatar = async () => {
    try {
      const data = await apiService.removeAvatar();
      if (data.token) {
        localStorage.setItem('coursenest_token', data.token);
      }
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Remove avatar error:', error);
      const errMsg = error.response?.data?.message || 'Avatar removal failed.';
      return { success: false, message: errMsg };
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, signup, logout, updateProfile, uploadAvatar, removeAvatar }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

export const useAuth = () => useContext(AuthContext);
