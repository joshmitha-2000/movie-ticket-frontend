import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (!token) return <Navigate to="/" />;

  if (role === 'USER' && (userRole === 'USER' || userRole === 'ADMIN')) return children;

  if (role === 'ADMIN' && userRole === 'ADMIN') return children;

  return <Navigate to="/" />;
}
