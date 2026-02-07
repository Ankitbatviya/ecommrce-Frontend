// components/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children, requiredRole = 'user' }) => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Small delay to ensure cookies are available
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '80vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  // Get cookies
  const token = Cookies.get('authToken');
  const userInfo = Cookies.get('userInfo');
  const userRole = Cookies.get('userRole');

  console.log('ProtectedRoute Check:', {
    path: location.pathname,
    token: token ? 'Exists' : 'Missing',
    userInfo: userInfo ? 'Exists' : 'Missing',
    userRole,
    requiredRole
  });

  // If no token, redirect to login
  if (!token) {
    console.log('No token, redirecting to login');
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Check user info
  let parsedUserInfo = null;
  if (userInfo) {
    try {
      parsedUserInfo = JSON.parse(userInfo);
    } catch (error) {
      console.error('Error parsing userInfo:', error);
      // Clear corrupted cookie
      Cookies.remove('userInfo');
      return <Navigate to="/login" replace />;
    }
  }

  // Check role if required
  if (requiredRole === 'admin') {
    // Determine actual role from cookies or parsed info
    const actualRole = userRole || parsedUserInfo?.role;
    
    console.log('Admin check:', {
      requiredRole,
      actualRole,
      isAdmin: actualRole === 'admin'
    });

    if (actualRole !== 'admin') {
      console.log('Not admin, redirecting to home');
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;