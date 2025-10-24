import * as React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
const { useState, useEffect } = React;

interface ProtectedRouteProps {
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ adminOnly = false }) => {
  const { user, isAdmin, loading } = useAuth();
  const [showLoading, setShowLoading] = useState(true);

  // Add a delay before showing the loading indicator to prevent flash
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(loading);
    }, 500);

    return () => clearTimeout(timer);
  }, [loading]);

  // During initial load, show nothing to prevent flash
  if (loading && !showLoading) {
    return null;
  }

  // After brief delay, show loading indicator if still loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Handle authentication and authorization
  if (!user && adminOnly) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!user && !adminOnly) {
    return <Navigate to="/auth" replace />;
  }

  if (user && adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
