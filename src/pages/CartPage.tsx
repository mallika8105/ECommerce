import React from 'react';
import Button from '../components/Button';
import { useCart } from '../context/CartContext';
import { Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow container mx-auto p-6">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">Your Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center p-10 bg-white rounded-lg shadow-md">
            <p className="text-xl text-gray-600 mb-4">Your cart is empty.</p>
            <Link to="/" className="text-orange-600 hover:underline text-lg">Start Shopping</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center border-b border-gray-200 py-4 last:border-b-0">
                  <img src={item.image_url} alt={item.name} className="w-24 h-24 object-contain rounded-md mr-4" />
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-orange-600 font-bold text-lg">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="secondary"
                      onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                      disabled={(item.quantity || 1) <= 1}
                      className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    >-</Button>
                    <span className="text-lg font-medium text-gray-800 w-8 text-center">{(item.quantity || 1)}</span>
                    <Button
                      variant="secondary"
                      onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                      className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    >+</Button>
                    <Button
                      variant="danger"
                      onClick={() => removeFromCart(item.id)}
                      className="ml-4 p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      <Trash2 size={20} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Summary</h2>
              <div className="flex justify-between text-lg text-gray-700 mb-2">
                <span>Subtotal:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg text-gray-700 mb-4">
                <span>Shipping:</span>
                <span>Free</span> {/* For now, assuming free shipping */}
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 border-t border-gray-300 pt-4 mt-4">
                <span>Total:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              <Link to="/checkout">
                <Button variant="primary" size="large" className="w-full mt-6 bg-orange-600 text-white hover:bg-orange-700 transition-colors duration-200">
                  Proceed to Checkout
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CartPage;
