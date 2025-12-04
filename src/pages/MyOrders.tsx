import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import { Package, Truck, CheckCircle, Info } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  product_code: string;
  product_image_url: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Order {
  id: string;
  created_at: string;
  status: string;
  payment_method: string;
  payment_status: string;
  total: number;
  shipping_address: string;
  order_items: OrderItem[];
}

const MyOrders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Fetch orders for the current user
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (ordersError) {
          console.error('Error fetching orders:', ordersError);
          setLoading(false);
          return;
        }

        if (!ordersData || ordersData.length === 0) {
          setOrders([]);
          setLoading(false);
          return;
        }

        // Fetch order items for each order
        const ordersWithItems = await Promise.all(
          ordersData.map(async (order) => {
            const { data: itemsData, error: itemsError } = await supabase
              .from('order_items')
              .select('*')
              .eq('order_id', order.id);

            if (itemsError) {
              console.error('Error fetching order items:', itemsError);
              return { ...order, order_items: [] };
            }

            return { ...order, order_items: itemsData || [] };
          })
        );

        setOrders(ordersWithItems);
      } catch (error) {
        console.error('Error in fetchOrders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const getStatusIcon = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case 'delivered':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'shipped':
        return <Truck size={20} className="text-blue-500" />;
      case 'processing':
        return <Package size={20} className="text-yellow-500" />;
      case 'pending':
        return <Info size={20} className="text-orange-500" />;
      case 'cancelled':
        return <Info size={20} className="text-red-500" />;
      default:
        return <Info size={20} className="text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const parseShippingAddress = (addressJson: string) => {
    try {
      const address = JSON.parse(addressJson);
      return `${address.addressLine1}${address.addressLine2 ? ', ' + address.addressLine2 : ''}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`;
    } catch (error) {
      return 'Address not available';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto p-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">My Orders</h1>

        {!user ? (
          <EmptyState message="Please log in to view your orders." />
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Order History</h2>
            <p className="text-gray-600 mb-2">Your past orders will appear here.</p>
            <p className="text-gray-500">No orders found yet.</p>
          </div>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            {orders.map((order) => (
              <Card key={order.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Order #{order.id.slice(0, 8).toUpperCase()}</h2>
                  <p className="text-gray-600">Date: {formatDate(order.created_at)}</p>
                  <div className="flex items-center mt-1">
                    {getStatusIcon(order.status)}
                    <span className="ml-2 text-gray-700 font-semibold capitalize">{order.status}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Payment: {order.payment_method.toUpperCase()} - <span className="capitalize">{order.payment_status}</span>
                  </p>
                  <p className="text-lg font-bold text-gray-800 mt-2">Total: ₹{order.total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {order.order_items.length} item{order.order_items.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <Button variant="secondary" className="mt-4 md:mt-0" onClick={() => handleViewDetails(order)}>
                  View Details
                </Button>
              </Card>
            ))}
          </div>
        )}
      </main>

      {selectedOrder && (
        <Modal isOpen={isModalOpen} onClose={handleModalClose} title={`Order Details #${selectedOrder.id.slice(0, 8).toUpperCase()}`}>
          <div className="space-y-4 text-gray-700">
            <div>
              <p className="font-semibold text-gray-800">Order Information</p>
              <p className="text-sm mt-1"><strong>Order ID:</strong> {selectedOrder.id}</p>
              <p className="text-sm"><strong>Date:</strong> {formatDate(selectedOrder.created_at)}</p>
              <p className="text-sm flex items-center">
                <strong>Status:</strong> 
                <span className="ml-2 flex items-center capitalize">
                  {getStatusIcon(selectedOrder.status)} 
                  <span className="ml-1">{selectedOrder.status}</span>
                </span>
              </p>
              <p className="text-sm">
                <strong>Payment Method:</strong> {selectedOrder.payment_method.toUpperCase()}
              </p>
              <p className="text-sm">
                <strong>Payment Status:</strong> <span className="capitalize">{selectedOrder.payment_status}</span>
              </p>
            </div>

            <div>
              <p className="font-semibold text-gray-800">Shipping Address</p>
              <p className="text-sm text-gray-600 mt-1">{parseShippingAddress(selectedOrder.shipping_address)}</p>
            </div>

            <div>
              <p className="font-semibold text-gray-800">Order Items</p>
              <div className="space-y-3 mt-2">
                {selectedOrder.order_items.map((item) => (
                  <div key={item.id} className="flex items-start space-x-3 border-b pb-3">
                    {item.product_image_url && (
                      <img 
                        src={item.product_image_url} 
                        alt={item.product_name}
                        className="w-16 h-16 object-contain rounded-md"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{item.product_name}</p>
                      <p className="text-sm text-gray-600">Code: {item.product_code}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-sm text-gray-600">Price: ₹{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} each</p>
                      <p className="text-sm font-semibold text-gray-800">
                        Subtotal: ₹{item.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-3">
              <p className="text-lg font-bold text-gray-800">
                Order Total: ₹{selectedOrder.total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MyOrders;
