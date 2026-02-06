// utils/auth.js
import Cookies from 'js-cookie';

// Get auth token from cookie
export const getAuthToken = () => {
  return Cookies.get('authToken');
};

// Get user info from cookie
export const getUserInfo = () => {
  const userInfo = Cookies.get('userInfo');
  return userInfo ? JSON.parse(userInfo) : null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!Cookies.get('authToken');
};

// Logout user
export const logout = () => {
  Cookies.remove('authToken');
  Cookies.remove('userInfo');
  window.location.href = '/login';
};

// Set up axios interceptor to automatically add token to requests
import axios from 'axios';

axios.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);