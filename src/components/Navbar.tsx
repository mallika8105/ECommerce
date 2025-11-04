import React from "react";
import { ShoppingCart, User, Search, MapPin, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";
import LocationModal from "./LocationModal";
import SearchModal from "./SearchModal";
import "./Navbar.css"; // Import the custom CSS file

const Navbar: React.FC = () => {
  const { cartItems, toggleDrawer } = useCart();
  const totalItems = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState("Select location");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const handleLocationClick = () => {
    setIsLocationModalOpen(true);
  };

  const handleLocationUpdate = (newLocation: string) => {
    setDeliveryLocation(newLocation);
    setIsLocationModalOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when screen size is desktop (md breakpoint or larger)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // Tailwind's 'md' breakpoint
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Desktop Navigation and Utility Icons */}
        <div className="navbar-desktop-menu">
          <Link to="/" className="navbar-brand">
            NexBuy
          </Link>
          <Link to="/shop" className="navbar-link">
            Shop
          </Link>
          <Link to="/collections" className="navbar-link">
            Collections
          </Link>
          <Link to="/bestsellers" className="navbar-link">
            Bestsellers
          </Link>
          <Link to="/about-us" className="navbar-link">
            About us
          </Link>
          <div className="search-container" onClick={() => setIsSearchModalOpen(true)}>
            <input
              type="text"
              placeholder="Search products..."
              className="search-input"
              readOnly
            />
            <Search className="search-icon" size={20} />
          </div>
          <Link to="/auth" className="account-link">
            <User className="account-icon" size={24} />
            <span className="account-text">Account</span>
          </Link>
          <div className="cart-container" onClick={toggleDrawer}>
            <ShoppingCart className="cart-icon" size={24} />
            <span className="cart-text">Cart</span>
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </div>
          <div className="location-container" onClick={handleLocationClick}>
            <MapPin className="location-icon" size={20} />
            <div className="location-text-container">
              <span className="location-label">Deliver to</span>
              <span className="location-value">{deliveryLocation}</span>
            </div>
          </div>
        </div>

        {/* Mobile menu button, Brand, and Cart icon */}
        <div className="mobile-header-row">
          <button onClick={toggleMobileMenu} className="mobile-menu-button">
            {isMobileMenuOpen ? (
              <X className="close-icon" size={28} />
            ) : (
              <Menu className="menu-icon" size={28} />
            )}
          </button>
          <Link to="/" className="navbar-brand">
            NexBuy
          </Link>
          <div className="cart-container" onClick={toggleDrawer}>
            <ShoppingCart className="mobile-cart-icon" size={28} />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-content">
          <div className="relative w-full" onClick={() => setIsSearchModalOpen(true)}>
            <input
              type="text"
              placeholder="Search products..."
              className="mobile-search-input"
              readOnly
            />
            <Search className="mobile-search-icon" size={20} />
          </div>
          <Link to="/" className="mobile-nav-link">
            Home
          </Link>
          <Link to="/shop" className="mobile-nav-link">
            Shop
          </Link>
          <Link to="/collections" className="mobile-nav-link">
            Collections
          </Link>
          <Link to="/bestsellers" className="mobile-nav-link">
            Bestsellers
          </Link>
          <Link to="/about-us" className="mobile-nav-link">
            About us
          </Link>
          <Link to="/auth" className="mobile-account-link">
            <User className="mobile-account-icon" size={24} />
            <span className="mobile-account-text">Account</span>
          </Link>
          <div
            className="mobile-location-container"
            onClick={handleLocationClick}
          >
            <MapPin className="mobile-location-icon" size={20} />
            <div className="mobile-location-text-container">
              <span className="mobile-location-label">Deliver to</span>
              <span className="mobile-location-value">{deliveryLocation}</span>
            </div>
          </div>
        </div>
      )}

      {isLocationModalOpen && (
        <LocationModal
          onClose={() => setIsLocationModalOpen(false)}
          onLocationUpdate={handleLocationUpdate}
        />
      )}

      <SearchModal 
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </nav>
  );
};

export default Navbar;
