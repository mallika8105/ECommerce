import React from 'react';
import './AdminDashboard.css'; // Assuming AdminDashboard.css will be created

const AdminDashboard: React.FC = () => {
  return (
    <div className="admin-dashboard-container">
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <ul>
            <li><a href="#dashboard">Dashboard Overview</a></li>
            <li><a href="#products">Product Management</a></li>
            <li><a href="#orders">Order Management</a></li>
            <li><a href="#users">User Management</a></li>
            <li><a href="#analytics">Analytics & Reports</a></li>
            <li><a href="#settings">Settings</a></li>
          </ul>
        </nav>
      </aside>
      <main className="admin-content">
        <h1>Welcome to the Admin Dashboard</h1>
        <p>Select a section from the sidebar to manage your store.</p>
        {/* Placeholder for different admin sections */}
        <section id="dashboard" className="admin-section">
          <h2>Dashboard Overview</h2>
          <p>Summary of sales, orders, and inventory.</p>
        </section>
        <section id="products" className="admin-section">
          <h2>Product Management</h2>
          <p>Manage products, categories, and stock levels.</p>
        </section>
        <section id="orders" className="admin-section">
          <h2>Order Management</h2>
          <p>View and update customer orders.</p>
        </section>
        <section id="users" className="admin-section">
          <h2>User Management</h2>
          <p>Manage registered users.</p>
        </section>
        <section id="analytics" className="admin-section">
          <h2>Analytics & Reports</h2>
          <p>View sales data and performance reports.</p>
        </section>
        <section id="settings" className="admin-section">
          <h2>Settings & Configuration</h2>
          <p>Configure store settings.</p>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
