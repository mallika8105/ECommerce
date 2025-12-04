import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import Dropdown from '../components/Dropdown';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import { Eye, Package, Truck, CheckCircle, XCircle, Info } from 'lucide-react';
import { supabase } from '../supabaseClient';

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
  user_id: string;
  created_at: string;
  status: string;
  payment_method: string;
  payment_status: string;
  total: number;
  shipping_address: string;
  customer_name?: string;
  customer_email?: string;
  order_items: OrderItem[];
}

const statusOptions = [
  { label: 'Pending', value: 'pending' },
  { label: 'Processing', value: 'processing' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
];

const OrdersManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      // Fetch all orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      if (!ordersData || ordersData.length === 0) {
        setOrders([]);
        setIsLoading(false);
        return;
      }

      // Fetch order items and customer profiles for each order
      const ordersWithDetails = await Promise.all(
        ordersData.map(async (order) => {
          // Fetch order items
          const { data: itemsData, error: itemsError } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', order.id);

          if (itemsError) {
            console.error('Error fetching order items:', itemsError);
          }

          // Fetch customer profile
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('full_name, email')
            .eq('id', order.user_id)
            .single();

          if (profileError) {
            console.error('Error fetching customer profile:', profileError);
          }

          return {
            ...order,
            order_items: itemsData || [],
            customer_name: profileData?.full_name || 'Unknown Customer',
            customer_email: profileData?.email || '',
          };
        })
      );

      setOrders(ordersWithDetails);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      setErrorMessage('Failed to fetch orders. Please try again.');
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      // Update the local state immediately for better UX
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      // Also update selected order if it's open
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }

      setErrorMessage(null);
    } catch (error: any) {
      console.error('Error updating order status:', error);
      setErrorMessage('Failed to update order status.');
    }
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
      case 'cancelled':
        return <XCircle size={20} className="text-red-500" />;
      case 'pending':
      default:
        return <Info size={20} className="text-orange-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const parseShippingAddress = (addressJson: string) => {
    try {
      const address = JSON.parse(addressJson);
      return `${address.fullName}, ${address.phone}\n${address.addressLine1}${address.addressLine2 ? ', ' + address.addressLine2 : ''}\n${address.city}, ${address.state} ${address.zipCode}\n${address.country}`;
    } catch (error) {
      return 'Address not available';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow container mx-auto p-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Orders Management</h1>

        {errorMessage && (
          <Card className="p-6 bg-red-50 mb-4">
            <div className="text-red-600 text-center">
              <p className="text-lg font-medium">{errorMessage}</p>
              <Button 
                variant="secondary" 
                className="mt-4"
                onClick={fetchOrders}
              >
                Retry Loading
              </Button>
            </div>
          </Card>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : orders.length === 0 ? (
          <EmptyState message="No orders found." />
        ) : (
          <Card className="p-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.customer_name}</div>
                      <div className="text-xs text-gray-500">{order.customer_email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.order_items.length} item{order.order_items.length !== 1 ? 's' : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ₹{order.total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs">
                        <div className="font-medium text-gray-900 uppercase">{order.payment_method}</div>
                        <div className="text-gray-500 capitalize">{order.payment_status}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Dropdown
                        options={statusOptions}
                        onSelect={(value) => handleStatusChange(order.id, value)}
                        placeholder={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        className="w-36"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="secondary" size="small" onClick={() => handleViewDetails(order)}>
                        <Eye size={16} className="mr-1" /> View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </main>

      {selectedOrder && (
        <Modal isOpen={isModalOpen} onClose={handleModalClose} title={`Order #${selectedOrder.id.slice(0, 8).toUpperCase()}`}>
          <div className="space-y-4 text-gray-700">
            <div className="border-b pb-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-800">Order Information</h3>
                <button
                  onClick={handleModalClose}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-all duration-200"
                  aria-label="Close order details"
                >
                  <XCircle size={20} />
                </button>
              </div>
              <p className="text-sm"><strong>Order ID:</strong> {selectedOrder.id}</p>
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

            <div className="border-b pb-3">
              <h3 className="font-semibold text-gray-800 mb-2">Customer Details</h3>
              <p className="text-sm"><strong>Name:</strong> {selectedOrder.customer_name}</p>
              <p className="text-sm"><strong>Email:</strong> {selectedOrder.customer_email}</p>
            </div>

            <div className="border-b pb-3">
              <h3 className="font-semibold text-gray-800 mb-2">Shipping Address</h3>
              <p className="text-sm whitespace-pre-line">{parseShippingAddress(selectedOrder.shipping_address)}</p>
            </div>

            <div className="border-b pb-3">
              <h3 className="font-semibold text-gray-800 mb-2">Order Items</h3>
              <div className="space-y-3">
                {selectedOrder.order_items.map((item) => (
                  <div key={item.id} className="flex items-start space-x-3 bg-gray-50 p-3 rounded">
                    {item.product_image_url && (
                      <img 
                        src={item.product_image_url} 
                        alt={item.product_name}
                        className="w-16 h-16 object-contain rounded"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.product_name}</p>
                      <p className="text-xs text-gray-600">Code: {item.product_code}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Quantity: {item.quantity} × ₹{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        Subtotal: ₹{item.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <p className="text-lg font-bold text-gray-900">
                Order Total: ₹{selectedOrder.total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-semibold text-gray-800 mb-2">Update Order Status</h3>
              <Dropdown
                options={statusOptions}
                onSelect={(value) => handleStatusChange(selectedOrder.id, value)}
                placeholder={selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                className="w-full"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default OrdersManagement;
