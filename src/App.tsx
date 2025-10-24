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
import CollectionsPage from './pages/CollectionsPage'; // Import CollectionsPage
import CategoryPage from './pages/CategoryPage'; // Import CategoryPage
import BestsellerPage from './pages/BestsellerPage'; // Import BestsellerPage
import AboutUsPage from './pages/AboutUsPage'; // Import AboutUsPage
import ContactUsPage from './pages/ContactUsPage'; // Import ContactUsPage
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'; // Import PrivacyPolicyPage
import TermsOfServicePage from './pages/TermsOfServicePage'; // Import TermsOfServicePage

// Admin Pages
import AdminDashboardHome from './admin/AdminDashboardHome';
import ProductManagement from './admin/ProductManagement';
import OrdersManagement from './admin/OrdersManagement';
import UserManagement from './admin/UserManagement';
import ReportsPage from './admin/ReportsPage';
import AdminDashboard from './admin/AdminDashboard'; // Import AdminDashboard
// import AdminSidebar from './admin/AdminSidebar'; // AdminSidebar is not directly used in App.tsx's main render
import { CartProvider, useCart } from './context/CartContext';
import CartDrawer from './components/CartDrawer'; // Import CartDrawer
import Layout from './components/Layout'; // Import Layout component
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
        <Route element={<Layout />}>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ProductListing />} />
          <Route path="/product/:productId" element={<ProductDetails />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/dashboard" element={<DashboardPage />} /> {/* Add route for DashboardPage */}
          <Route path="/collections" element={<CollectionsPage />} /> {/* Add route for CollectionsPage */}
          <Route path="/products/category/:categoryId" element={<CategoryPage />} /> {/* Dynamic route for categories */}
          <Route path="/bestsellers" element={<BestsellerPage />} /> {/* Add route for BestsellerPage */}
          <Route path="/about-us" element={<AboutUsPage />} /> {/* Add route for AboutUsPage */}
          <Route path="/contact-us" element={<ContactUsPage />} /> {/* Add route for ContactUsPage */}
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} /> {/* Add route for PrivacyPolicyPage */}
          <Route path="/terms-of-service" element={<TermsOfServicePage />} /> {/* Add route for TermsOfServicePage */}
        </Route>

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
