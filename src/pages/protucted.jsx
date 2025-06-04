import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  // No token? Send to login
  if (!token) return <Navigate to="/" replace />;

  // Role-specific logic
  if (role === 'ADMIN' && userRole === 'ADMIN') {
    return children;
  }

  if (role === 'USER' && (userRole === 'USER' || userRole === 'ADMIN')) {
    return children;
  }

  // Role doesn't match
  return <Navigate to="/" replace />;
}
