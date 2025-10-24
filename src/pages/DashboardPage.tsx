import React from 'react';

const DashboardPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow container mx-auto p-4 md:p-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-6 md:mb-8 text-center">Dashboard</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-700">Welcome to your dashboard! Here you can view various details related to your account and orders.</p>
          {/* Add more dashboard content here */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-blue-100 p-4 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-blue-800">Recent Orders</h2>
              <p className="text-blue-700">View your latest orders and their status.</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-green-800">Wishlist</h2>
              <p className="text-green-700">Manage your saved items.</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-yellow-800">Account Settings</h2>
              <p className="text-yellow-700">Update your profile information.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
