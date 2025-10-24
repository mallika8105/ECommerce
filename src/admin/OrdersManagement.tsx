import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import Dropdown from '../components/Dropdown';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import { Eye, Package, Truck, CheckCircle, XCircle, Info } from 'lucide-react';
import { supabase } from '../supabaseClient'; // Import supabase client

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  date: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
  items: OrderItem[];
}

const statusOptions = [
  { label: 'Pending', value: 'Pending' },
  { label: 'Processing', value: 'Processing' },
  { label: 'Shipped', value: 'Shipped' },
  { label: 'Delivered', value: 'Delivered' },
  { label: 'Cancelled', value: 'Cancelled' },
];

const OrdersManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('orders').select('*'); // Assuming 'orders' table
    if (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders.');
      setOrders([]);
    } else {
      setOrders(data as Order[]);
      setError(null);
    }
    setLoading(false);
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
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order status:', error);
      setError('Failed to update order status.');
    } else {
      fetchOrders(); // Re-fetch orders to get the updated list
      setError(null);
    }
  };


  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'Shipped':
        return <Truck size={20} className="text-blue-500" />;
      case 'Processing':
        return <Package size={20} className="text-yellow-500" />;
      case 'Cancelled':
        return <XCircle size={20} className="text-red-500" />;
      case 'Pending':
      default:
        return <Info size={20} className="text-gray-500" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow container mx-auto p-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Orders Management</h1>

        {orders.length === 0 ? (
          <EmptyState message="No orders found." />
        ) : (
          <Card className="p-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.customerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${order.total.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Dropdown
                        options={statusOptions}
                        onSelect={(value) => handleStatusChange(order.id, value)}
                        placeholder={order.status}
                        className="w-36"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="secondary" size="small" onClick={() => handleViewDetails(order)}>
                        <Eye size={16} />
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
        <Modal isOpen={isModalOpen} onClose={handleModalClose} title={`Order Details #${selectedOrder.id}`}>
          <div className="space-y-4 text-gray-700">
            <p><strong>Customer:</strong> {selectedOrder.customerName}</p>
            <p><strong>Date:</strong> {selectedOrder.date}</p>
            <p className="flex items-center">
              <strong>Status:</strong> <span className="ml-2 flex items-center">{getStatusIcon(selectedOrder.status)} {selectedOrder.status}</span>
            </p>
            <p><strong>Total:</strong> ${selectedOrder.total.toFixed(2)}</p>
            <h3 className="text-lg font-bold mt-4">Items:</h3>
            <ul className="list-disc pl-5 space-y-1">
              {selectedOrder.items.map((item) => (
                <li key={item.productId}>
                  {item.productName} (x{item.quantity}) - ${item.price.toFixed(2)} each
                </li>
              ))}
            </ul>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default OrdersManagement;
