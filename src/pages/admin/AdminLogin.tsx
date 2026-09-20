import React from 'react';
import { Navigate } from 'react-router-dom';

export const AdminLogin: React.FC = () => {
  // Direct redirect to Admin Dashboard
  return <Navigate to="/admin" replace />;
};
