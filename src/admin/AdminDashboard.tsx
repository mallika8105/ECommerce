import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar'; // Import the new AdminSidebar

const AdminDashboard: React.FC = () => {
  return (
    <div className="flex"> {/* Use flex to arrange sidebar and main content */}
      <AdminSidebar /> {/* Render the sidebar */}
      <div className="flex-1 ml-64"> {/* Main content area, offset by sidebar width */}
        {/* Header for the main content area */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <div className="text-gray-600 text-sm">
            Pages / <span className="font-semibold">Dashboard</span>
          </div>
          {/* Placeholder for user profile/settings if needed */}
        </header>
        <main className="flex-grow bg-gray-100 min-h-screen">
          <Outlet /> {/* This will render the nested admin routes */}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
