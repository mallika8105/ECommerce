import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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
import AccountPage from './pages/AccountPage';
import MyOrders from './pages/MyOrders';
import WishlistPage from './pages/WishlistPage';
import CollectionsPage from './pages/CollectionsPage'; // Import CollectionsPage
import CategoryPage from './pages/CategoryPage'; // Import CategoryPage
import BestsellerPage from './pages/BestsellerPage'; // Import BestsellerPage
import SubCategoriesPage from './pages/SubCategoriesPage'; // Sub-categories listing
import AboutUsPage from './pages/AboutUsPage'; // Import AboutUsPage
import ContactUsPage from './pages/ContactUsPage'; // Import ContactUsPage
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'; // Import PrivacyPolicyPage
import TermsOfServicePage from './pages/TermsOfServicePage'; // Import TermsOfServicePage

// Admin Pages
import AdminDashboardHome from './admin/AdminDashboardHome';
import ProductManagement from './admin/ProductManagement';
import CategoryManagement from './admin/CategoryManagement';
import OrdersManagement from './admin/OrdersManagement';
import UserManagement from './admin/UserManagement';
import ReportsPage from './admin/ReportsPage';
import AdminDashboard from './admin/AdminDashboard'; // Import AdminDashboard
import ProtectedRoute from './admin/ProtectedRoute'; // Import ProtectedRoute
import AdminLoginPage from './admin/AdminLoginPage';
// import AdminSidebar from './admin/AdminSidebar'; // AdminSidebar is not directly used in App.tsx's main render
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import CartDrawer from './components/CartDrawer'; // Import CartDrawer
import Layout from './components/Layout'; // Import Layout component
function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider> {/* Wrap with AuthProvider */}
          <CartProvider>
            <AppContent />
          </CartProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

const AppContent: React.FC = () => {
  const { isDrawerOpen, toggleDrawer } = useCart();

  return (
    <>
      <Routes>
        {/* Admin Login Route - Outside protection */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        
        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute adminOnly={true} />}>
          <Route element={<AdminDashboard />}>
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<AdminDashboardHome />} />
            <Route path="/admin/products" element={<ProductManagement />} />
            <Route path="/admin/categories" element={<CategoryManagement />} />
            <Route path="/admin/orders" element={<OrdersManagement />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/reports" element={<ReportsPage />} />
          </Route>
        </Route>

        {/* Public Routes - With header/footer layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ProductListing />} />
          <Route path="/categories/:categoryId/subcategories" element={<SubCategoriesPage />} />
          <Route path="/products/subcategory/:subcategoryId" element={<ProductListing />} />
          <Route path="/product/:productId" element={<ProductDetails />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation/:orderId?" element={<OrderConfirmation />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/products/category/:categoryId" element={<CategoryPage />} />
          <Route path="/bestsellers" element={<BestsellerPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/contact-us" element={<ContactUsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
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
    </>
  );
}

export default App;
