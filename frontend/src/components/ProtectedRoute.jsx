import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role, token: storedToken } = useSelector((state) => state.auth);
  const token = storedToken || localStorage.getItem('token');

  console.log("Auth State:", { isAuthenticated, role, allowedRoles, hasToken: !!token });
  if (!token || !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  
  return children;
};

export default ProtectedRoute;