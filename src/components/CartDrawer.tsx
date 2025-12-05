import React from 'react';
import { X } from 'lucide-react'; // Trash2 is not used in this component
import Button from './Button';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import './CartDrawer.css'; // Import the custom CSS file

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      
      {/* Drawer Content */}
      <div className={`fixed right-0 top-0 mt-16 h-auto max-h-[calc(100vh-4rem)] w-80 sm:w-96 bg-white shadow-xl rounded-l-xl p-4 flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Close button - positioned absolutely in top-right corner */}
        <button 
          onClick={onClose} 
          className="absolute -top-2 -right-2 bg-white rounded-full p-2 shadow-lg border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 z-10"
          aria-label="Close cart"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        <div className="border-b border-gray-200 pb-2.5 mb-2.5">
          <h2 className="text-lg font-semibold text-gray-800">Your Cart</h2>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex-grow text-center flex flex-col items-center justify-center">
            <p className="text-lg text-gray-500 mb-3">Your cart is empty.</p>
            <Link to="/" onClick={onClose} className="text-orange-600 hover:underline text-sm font-medium">Start Shopping</Link>
          </div>
        ) : (
          <>
              <div className="flex-grow overflow-y-auto cart-items-scrollable">
              {cartItems.map((item, index) => (
                <div key={`${item.id}-${item.size || index}`} className="flex items-center gap-2 border-b border-gray-100 py-2">
                  <img src={item.image_url} alt={item.name} className="w-12 h-12 object-contain rounded" />
                  <div className="flex-grow min-w-0">
                    <h3 className="text-xs font-medium text-gray-800 truncate leading-tight">{item.name}</h3>
                    {item.size && (
                      <p className="text-gray-500 text-[10px] mt-0.5">Size: {item.size}</p>
                    )}
                    <p className="text-orange-600 font-semibold text-xs mt-0.5">₹{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="secondary"
                      onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1, item.size)}
                      disabled={(item.quantity || 1) <= 1}
                      className="quantity-button"
                    >-</Button>
                    <span className="text-xs font-medium text-gray-700 w-4 text-center">{(item.quantity || 1)}</span>
                    <Button
                      variant="secondary"
                      onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1, item.size)}
                      className="quantity-button"
                    >+</Button>
                    <button
                      onClick={() => removeFromCart(item.id, item.size)}
                      className="remove-item-button ml-0.5"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-2.5 mt-2">
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-xs text-gray-600">Total:</span>
                <span className="text-base font-bold text-gray-900">₹{calculateTotal().toFixed(2)}</span>
              </div>
              <Link to="/checkout" onClick={onClose}>
                <Button variant="primary" size="large" className="w-full bg-black text-white hover:bg-gray-800 transition-colors duration-200 text-xs py-2">
                  Proceed to Checkout
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
