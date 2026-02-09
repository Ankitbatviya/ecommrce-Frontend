// components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children, requiredRole = 'user' }) => {
  const token = Cookies.get('authToken');

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    // Decode the JWT token to get user data
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      console.error('Invalid token format');
      Cookies.remove('authToken');
      return <Navigate to="/login" replace />;
    }
    
    const payload = JSON.parse(atob(tokenParts[1]));
    
    // Check token expiration
    const currentTime = Date.now() / 1000; // Convert to seconds
    if (payload.exp && payload.exp < currentTime) {
      // Token expired, clear it and redirect to login
      Cookies.remove('authToken');
      return <Navigate to="/login" replace />;
    }

    // Check role if required
    if (requiredRole === 'admin') {
      if (payload.role !== 'admin') {
        console.log("Role is not admin.... (" + payload.role + ")");
        return <Navigate to="/" replace />;
      }
    }

    return children;

  } catch (error) {
    console.error('Error decoding token:', error);
    // If token is invalid, clear it and redirect to login
    Cookies.remove('authToken');
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;