import React, { useEffect, useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import { CheckCircle, X } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

interface Order {
  id: string;
  total: number;
  status: string;
  payment_method: string;
  created_at: string;
}

const OrderConfirmation: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (error) throw error;
        setOrder(data);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Close button - positioned absolutely in top-right corner */}
      <button 
        onClick={() => navigate('/')} 
        className="fixed top-20 right-4 bg-white rounded-full p-2 shadow-lg border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 z-50"
        aria-label="Close order confirmation"
      >
        <X size={20} strokeWidth={2.5} />
      </button>

      <main className="flex-grow container mx-auto p-4 flex items-center justify-center">
        <Card className="p-8 text-center max-w-2xl w-full">
          <CheckCircle size={64} className="text-green-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-green-600 mb-4">Hurray! Order created successfully</h1>
          <p className="text-lg text-gray-700 mb-2">Thank you for your purchase.</p>
          {order && (
            <p className="text-md text-gray-600 mb-6">
              Your order <span className="font-semibold">#{order.id.slice(0, 8).toUpperCase()}</span> has been placed successfully.
            </p>
          )}

          {order && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Summary</h2>
              <p className="text-xl text-blue-600 font-semibold">Total: ₹{order.total.toFixed(2)}</p>
              <p className="text-sm text-gray-600 mt-2">Payment Method: {order.payment_method.toUpperCase()}</p>
              <p className="text-sm text-gray-600">Status: {order.status}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/shop">
              <Button variant="primary" size="large">Continue Shopping</Button>
            </Link>
            <Link to="/my-orders">
              <Button variant="secondary" size="large">View My Orders</Button>
            </Link>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default OrderConfirmation;
