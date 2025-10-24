import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ adminOnly = false }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return <div>Loading authentication...</div>; // Or a spinner component
  }

  if (!user) {
    // User not authenticated, redirect to login page
    return <Navigate to="/auth" replace />;
  }

  if (adminOnly && !isAdmin) {
    // User is authenticated but not an admin, redirect to a non-admin dashboard or home
    return <Navigate to="/" replace />; // Or a specific unauthorized page
  }

  return <Outlet />;
};

export default ProtectedRoute;
