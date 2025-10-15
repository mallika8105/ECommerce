import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';

// Public Pages
import HomePage from './pages/HomePage';
import ProductListing from './pages/ProductListing';
import ProductDetails from './pages/ProductDetails';
import AuthPage from './pages/AuthPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmation from './pages/OrderConfirmation';
import ProfilePage from './pages/ProfilePage';
import MyOrders from './pages/MyOrders';
import WishlistPage from './pages/WishlistPage';
import DashboardPage from './pages/DashboardPage'; // Import the new DashboardPage

// Admin Pages
import AdminDashboardHome from './admin/AdminDashboardHome';
import ProductManagement from './admin/ProductManagement';
import OrdersManagement from './admin/OrdersManagement';
import UserManagement from './admin/UserManagement';
import ReportsPage from './admin/ReportsPage';
import AdminDashboard from './admin/AdminDashboard'; // Import AdminDashboard
import AdminSidebar from './admin/AdminSidebar'; // Import AdminSidebar
import { CartProvider, useCart } from './context/CartContext';
import CartDrawer from './components/CartDrawer'; // Import CartDrawer

function App() {
  return (
    <ErrorBoundary>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </ErrorBoundary>
  );
}

const AppContent: React.FC = () => {
  const { isDrawerOpen, toggleDrawer } = useCart();

  return (
    <Router>
      <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListing />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/dashboard" element={<DashboardPage />} /> {/* Add route for DashboardPage */}

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />}>
            <Route index element={<AdminDashboardHome />} /> {/* Default admin route */}
            <Route path="dashboard" element={<AdminDashboardHome />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="orders" element={<OrdersManagement />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="reports" element={<ReportsPage />} />
          </Route>

          {/* Fallback for unknown routes */}
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
              <p className="text-lg text-gray-600">The page you are looking for does not exist.</p>
              <a href="/" className="mt-6 text-blue-600 hover:underline">Go to Home</a>
            </div>
          } />
        </Routes>
      <CartDrawer isOpen={isDrawerOpen} onClose={toggleDrawer} />
    </Router>
  );
}

export default App;
