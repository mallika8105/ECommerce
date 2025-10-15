import React from 'react';
import { ShoppingCart, User, Search, MapPin, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';
import LocationModal from './LocationModal';

const Navbar: React.FC = () => {
  const { cartItems, toggleDrawer } = useCart();
  const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState('Select location');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      if (window.innerWidth >= 768) { // Tailwind's 'md' breakpoint
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav className="bg-gray-800 p-6 text-white shadow-lg relative z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-3xl font-extrabold text-orange-400 hover:text-orange-300 transition-colors duration-200">NexBuy</Link>

        {/* Desktop Navigation and Utility Icons */}
        <div className="hidden md:flex items-center flex-grow justify-end space-x-6">
          <Link to="/" className="text-lg hover:text-orange-300 transition-colors duration-200">Home</Link>
          <Link to="/shop" className="text-lg hover:text-orange-300 transition-colors duration-200">Shop</Link>
          <Link to="/collections" className="text-lg hover:text-orange-300 transition-colors duration-200">Collections</Link>
          <Link to="/best-sellers" className="text-lg hover:text-orange-300 transition-colors duration-200">Best Sellers</Link>
          <Link to="/about-us" className="text-lg hover:text-orange-300 transition-colors duration-200">About us</Link>
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="bg-gray-700 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-400"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <Link to="/profile" className="flex items-center space-x-2 hover:text-orange-300 transition-colors duration-200">
            <User size={24} />
            <span className="text-lg">Account</span>
          </Link>
          <div className="relative flex items-center space-x-2 cursor-pointer hover:text-orange-300 transition-colors duration-200" onClick={toggleDrawer}>
            <ShoppingCart size={24} />
            <span className="text-lg">Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1 cursor-pointer hover:text-gray-300 transition-colors duration-200" onClick={handleLocationClick}>
            <MapPin size={20} />
            <div className="flex flex-col text-sm">
              <span className="text-gray-400">Deliver to</span>
              <span className="font-bold">{deliveryLocation}</span>
            </div>
          </div>
        </div>

        {/* Mobile menu button and Cart icon */}
        <div className="md:hidden flex items-center space-x-4">
          <div className="relative flex items-center cursor-pointer text-white hover:text-orange-300 transition-colors duration-200" onClick={toggleDrawer}>
            <ShoppingCart size={28} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>
          <button onClick={toggleMobileMenu} className="text-white focus:outline-none">
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800 p-4 flex flex-col space-y-4 absolute top-full left-0 w-full z-40">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search products..."
              className="bg-gray-700 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-400 w-full"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <Link to="/" className="text-lg hover:text-orange-300 transition-colors duration-200">Home</Link>
          <Link to="/shop" className="text-lg hover:text-orange-300 transition-colors duration-200">Shop</Link>
          <Link to="/collections" className="text-lg hover:text-orange-300 transition-colors duration-200">Collections</Link>
          <Link to="/best-sellers" className="text-lg hover:text-orange-300 transition-colors duration-200">Best Sellers</Link>
          <Link to="/about-us" className="text-lg hover:text-orange-300 transition-colors duration-200">About us</Link>
          <Link to="/profile" className="flex items-center space-x-2 hover:text-orange-300 transition-colors duration-200">
            <User size={24} />
            <span className="text-lg">Account</span>
          </Link>
          <div className="flex items-center space-x-1 cursor-pointer hover:text-gray-300 transition-colors duration-200" onClick={handleLocationClick}>
            <MapPin size={20} />
            <div className="flex flex-col text-sm">
              <span className="text-gray-400">Deliver to</span>
              <span className="font-bold">{deliveryLocation}</span>
            </div>
          </div>
        </div>
      )}

      {isLocationModalOpen && <LocationModal onClose={() => setIsLocationModalOpen(false)} onLocationUpdate={handleLocationUpdate} />}
    </nav>
  );
};

export default Navbar;
