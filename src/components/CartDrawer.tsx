import React from 'react';
import { X, Trash2 } from 'lucide-react';
import Button from './Button';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

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
    <div
      className={`fixed inset-0 z-50 transform ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } transition-transform duration-300 ease-in-out`}
    >
      {/* Overlay */}
      {isOpen && (
        <div className="absolute inset-0 bg-gray-900/50" onClick={onClose}></div>
      )}

      {/* Drawer Content */}
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-lg p-6 flex flex-col">
        <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex-grow text-center flex flex-col items-center justify-center">
            <p className="text-xl text-gray-600 mb-4">Your cart is empty.</p>
            <Link to="/" onClick={onClose} className="text-orange-600 hover:underline text-lg">Start Shopping</Link>
          </div>
        ) : (
          <>
            <div className="flex-grow overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center border-b border-gray-200 py-4">
                  <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-contain rounded-md mr-4" />
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-orange-600 font-bold text-md">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="secondary"
                      onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                      disabled={(item.quantity || 1) <= 1}
                      className="px-2 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm"
                    >-</Button>
                    <span className="text-md font-medium text-gray-800 w-6 text-center">{(item.quantity || 1)}</span>
                    <Button
                      variant="secondary"
                      onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                      className="px-2 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm"
                    >+</Button>
                    <Button
                      variant="danger"
                      onClick={() => removeFromCart(item.id)}
                      className="ml-2 p-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex justify-between text-lg font-bold text-gray-900 mb-4">
                <span>Total:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              <Link to="/checkout" onClick={onClose}>
                <Button variant="primary" size="large" className="w-full bg-orange-600 text-white hover:bg-orange-700 transition-colors duration-200">
                  Proceed to Checkout
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
