// components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children, requiredRole = 'user' }) => {
  const token = Cookies.get('authToken');
  const userInfo = Cookies.get('userInfo');
  const userRole = Cookies.get('userRole');

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If no user info, also redirect to login
  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  // Check role if required
  if (requiredRole === 'admin') {
    if (userRole !== 'admin') {
      console.log("Role is not admin.... (" + userRole + ")")
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;