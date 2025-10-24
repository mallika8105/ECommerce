import React from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrderConfirmation: React.FC = () => {
  const orderId = 'ORD123456789'; // Placeholder
  const totalAmount = '389.97'; // Placeholder

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto p-4 flex items-center justify-center">
        <Card className="p-8 text-center max-w-2xl w-full">
          <CheckCircle size={64} className="text-green-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Order Confirmed!</h1>
          <p className="text-lg text-gray-700 mb-2">Thank you for your purchase.</p>
          <p className="text-md text-gray-600 mb-6">Your order <span className="font-semibold">{orderId}</span> has been placed successfully.</p>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Summary</h2>
            <p className="text-xl text-blue-600 font-semibold">Total: ${totalAmount}</p>
            {/* More detailed order summary can be added here */}
          </div>

          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/products">
              <Button variant="primary" size="large">Continue Shopping</Button>
            </Link>
            <Link to="/orders">
              <Button variant="secondary" size="large">View My Orders</Button>
            </Link>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default OrderConfirmation;
