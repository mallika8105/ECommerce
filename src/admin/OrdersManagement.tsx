import React, { useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import Dropdown from '../components/Dropdown';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import { Eye, Package, Truck, CheckCircle, XCircle, Info } from 'lucide-react';

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

const sampleOrders: Order[] = [
  {
    id: 'ORD001',
    customerName: 'Jane Doe',
    date: '2025-10-01',
    status: 'Delivered',
    total: 289.98,
    items: [
      { productId: '1', productName: 'Premium Wireless Headphones', quantity: 1, price: 199.99 },
      { productId: '2', productName: 'Bluetooth Speaker', quantity: 1, price: 89.99 },
    ],
  },
  {
    id: 'ORD002',
    customerName: 'John Smith',
    date: '2025-09-15',
    status: 'Shipped',
    total: 129.99,
    items: [
      { productId: '3', productName: 'Smartwatch', quantity: 1, price: 129.99 },
    ],
  },
  {
    id: 'ORD003',
    customerName: 'Alice Brown',
    date: '2025-10-05',
    status: 'Pending',
    total: 50.00,
    items: [
      { productId: '4', productName: 'USB Cable', quantity: 2, price: 25.00 },
    ],
  },
];

const statusOptions = [
  { label: 'Pending', value: 'Pending' },
  { label: 'Processing', value: 'Processing' },
  { label: 'Shipped', value: 'Shipped' },
  { label: 'Delivered', value: 'Delivered' },
  { label: 'Cancelled', value: 'Cancelled' },
];

const OrdersManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus as Order['status'] } : order
      )
    );
    console.log(`Order ${orderId} status updated to ${newStatus}`);
    // Implement API call to update order status
  };

  const getStatusBadge = (status: Order['status']) => {
    let colorClass = '';
    switch (status) {
      case 'Delivered':
        colorClass = 'bg-green-100 text-green-800';
        break;
      case 'Shipped':
        colorClass = 'bg-blue-100 text-blue-800';
        break;
      case 'Processing':
        colorClass = 'bg-yellow-100 text-yellow-800';
        break;
      case 'Cancelled':
        colorClass = 'bg-red-100 text-red-800';
        break;
      case 'Pending':
      default:
        colorClass = 'bg-gray-100 text-gray-800';
        break;
    }
    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}>
        {status}
      </span>
    );
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
