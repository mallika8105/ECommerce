import React from 'react';
import { Outlet } from 'react-router-dom'; // Import Outlet
import Navbar from './Navbar';
import Footer from './Footer';

// interface LayoutProps { // Not used directly as a prop type for Layout component
//   children: React.ReactNode;
// }

const Layout: React.FC = () => { // No longer needs LayoutProps
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet /> {/* Render child routes here */}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
