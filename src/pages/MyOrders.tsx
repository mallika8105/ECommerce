import React, { useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import { Package, Truck, CheckCircle, Info } from 'lucide-react';

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  date: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
  items: OrderItem[];
}

const sampleOrders: Order[] = [
  {
    id: 'ORD001',
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
    date: '2025-09-15',
    status: 'Shipped',
    total: 129.99,
    items: [
      { productId: '3', productName: 'Smartwatch', quantity: 1, price: 129.99 },
    ],
  },
];

const MyOrders: React.FC = () => {
  const [orders] = useState<Order[]>(sampleOrders); // setOrders is not used
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

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'Shipped':
        return <Truck size={20} className="text-blue-500" />;
      case 'Processing':
        return <Package size={20} className="text-yellow-500" />;
      default:
        return <Info size={20} className="text-gray-500" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto p-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">My Orders</h1>

        {orders.length === 0 ? (
          <EmptyState message="You haven't placed any orders yet." />
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            {orders.map((order) => (
              <Card key={order.id} className="p-6 flex flex-col md:flex-row justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Order #{order.id}</h2>
                  <p className="text-gray-600">Date: {order.date}</p>
                  <div className="flex items-center mt-1">
                    {getStatusIcon(order.status)}
                    <span className="ml-2 text-gray-700 font-semibold">{order.status}</span>
                  </div>
                  <p className="text-lg font-bold text-gray-800 mt-2">Total: ₹{order.total.toFixed(2)}</p>
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
        <Modal isOpen={isModalOpen} onClose={handleModalClose} title={`Order Details #${selectedOrder.id}`}>
          <div className="space-y-4 text-gray-700">
            <p><strong>Date:</strong> {selectedOrder.date}</p>
            <p className="flex items-center">
              <strong>Status:</strong> <span className="ml-2 flex items-center">{getStatusIcon(selectedOrder.status)} {selectedOrder.status}</span>
            </p>
            <p><strong>Total:</strong> ₹{selectedOrder.total.toFixed(2)}</p>
            <h3 className="text-lg font-bold mt-4">Items:</h3>
            <ul className="list-disc pl-5 space-y-1">
              {selectedOrder.items.map((item) => (
                <li key={item.productId}>
                  {item.productName} (x{item.quantity}) - ₹{item.price.toFixed(2)} each
                </li>
              ))}
            </ul>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MyOrders;
