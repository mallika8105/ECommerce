import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../supabaseClient'; // Import supabase client

interface StatCardProps {
  title: string;
  value: string;
  percentage: string;
  percentageColor: string;
  period: string;
  trendValue?: string;
  icon?: React.ReactNode;
  bgColor?: string;
}

interface SummaryChartDataItem {
  name: string;
  order: number;
  incomeGrowth: number;
}

interface MostSellingProduct {
  image: string;
  name: string;
  id: string;
  sales: string;
}

interface RecentOrder {
  productImage: string;
  productName: string;
  customer: string;
  orderId: string;
  date: string;
  status: string;
  statusColor: string;
}

interface WeeklyTopCustomer {
  avatar: string;
  name: string;
  orders: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, percentage, percentageColor, trendValue }) => (
  <Card className="p-4 flex flex-col justify-between h-32 rounded-lg shadow-sm border border-gray-200">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-3xl font-bold text-gray-900">{value}</p>
    <div className="flex items-center text-xs mt-2">
      {percentageColor === 'text-green-500' ? <ArrowUp size={12} className="text-green-500 mr-1" /> : <ArrowDown size={12} className="text-red-500 mr-1" />}
      <span className={`font-bold ${percentageColor}`}>{percentage}</span>
      {trendValue && <span className="text-gray-500 ml-1">({trendValue})</span>}
    </div>
  </Card>
);

const AdminDashboardHome: React.FC = () => {
  const [summaryChartData, setSummaryChartData] = useState<SummaryChartDataItem[]>([]);
  const [mostSellingProducts, setMostSellingProducts] = useState<MostSellingProduct[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [weeklyTopCustomers, setWeeklyTopCustomers] = useState<WeeklyTopCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch summary chart data (example: total sales and new users over time)
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('created_at, total')
        .order('created_at', { ascending: true });

      const { data: usersData, error: usersError } = await supabase
        .from('profiles') // Assuming 'profiles' table has user creation date
        .select('created_at')
        .order('created_at', { ascending: true });

      if (ordersError) throw ordersError;
      if (usersError) throw usersError;

      // Process data for summary chart
      const processedChartData = processChartData(ordersData, usersData);
      setSummaryChartData(processedChartData);

      // Fetch most selling products (example: top 3 products by quantity sold)
      const { data: productSalesData, error: productSalesError } = await supabase
        .from('order_items') // Assuming an 'order_items' table links orders to products
        .select('product_id, quantity, products(name, image_url)') // Join with products table
        .limit(3);

      if (productSalesError) throw productSalesError;

      const processedMostSellingProducts = processMostSellingProducts(productSalesData);
      setMostSellingProducts(processedMostSellingProducts);

      // Fetch recent orders
      const { data: recentOrdersData, error: recentOrdersError } = await supabase
        .from('orders')
        .select('id, customer_name, created_at, status, total, order_items(product_id, product_name, quantity, price)')
        .order('created_at', { ascending: false })
        .limit(3);

      if (recentOrdersError) throw recentOrdersError;

      const processedRecentOrders = processRecentOrders(recentOrdersData);
      setRecentOrders(processedRecentOrders);

      // Fetch weekly top customers (example: customers with most orders in the last 7 days)
      const { data: topCustomersData, error: topCustomersError } = await supabase
        .from('orders')
        .select('customer_id, profiles(name, avatar_url)') // Assuming customer_id links to profiles
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()); // Last 7 days

      if (topCustomersError) throw topCustomersError;

      const processedTopCustomers = processTopCustomers(topCustomersData);
      setWeeklyTopCustomers(processedTopCustomers);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  // Helper functions to process data (implement these based on your data structure)
  const processChartData = (_orders: Array<{ created_at: string; total: number }>, _users: Array<{ created_at: string }>) => {
    // This is a simplified example. You'd aggregate sales and new users by day/week.
    return [
      { name: 'Day 1', order: 100, incomeGrowth: 50 },
      { name: 'Day 2', order: 150, incomeGrowth: 70 },
      { name: 'Day 3', order: 120, incomeGrowth: 60 },
      { name: 'Day 4', order: 200, incomeGrowth: 90 },
      { name: 'Day 5', order: 180, incomeGrowth: 80 },
    ];
  };

  const processMostSellingProducts = (_productSales: unknown[]) => {
    // Aggregate sales for each product and sort
    return [
      { image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40"%3E%3Crect width="40" height="40" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%23999"%3EA%3C/text%3E%3C/svg%3E', name: 'Product A', id: '1', sales: '150' },
      { image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40"%3E%3Crect width="40" height="40" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%23999"%3EB%3C/text%3E%3C/svg%3E', name: 'Product B', id: '2', sales: '120' },
      { image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40"%3E%3Crect width="40" height="40" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%23999"%3EC%3C/text%3E%3C/svg%3E', name: 'Product C', id: '3', sales: '90' },
    ];
  };

  const processRecentOrders = (orders: Array<{ id: string; customer_name: string; created_at: string; status: string; total: number; order_items: Array<{ product_name?: string; product_image_url?: string }> }>) => {
    return orders.map((order) => ({
      productImage: order.order_items[0]?.product_image_url || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32"%3E%3Crect width="32" height="32" fill="%23ddd"/%3E%3C/svg%3E', // Assuming first item's image
      productName: order.order_items[0]?.product_name || 'N/A',
      customer: order.customer_name,
      orderId: `#${order.id}`,
      date: new Date(order.created_at).toLocaleDateString(),
      status: order.status,
      statusColor: getStatusColor(order.status),
    }));
  };

  const processTopCustomers = (_customers: unknown[]) => {
    // Aggregate orders by customer
    return [
      { avatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40"%3E%3Ccircle cx="20" cy="20" r="20" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%23999"%3EX%3C/text%3E%3C/svg%3E', name: 'Customer X', orders: 10 },
      { avatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40"%3E%3Ccircle cx="20" cy="20" r="20" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%23999"%3EY%3C/text%3E%3C/svg%3E', name: 'Customer Y', orders: 8 },
      { avatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40"%3E%3Ccircle cx="20" cy="20" r="20" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%23999"%3EZ%3C/text%3E%3C/svg%3E', name: 'Customer Z', orders: 7 },
    ];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'Pending':
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Welcome Back, Admin!</h1>
          <p className="text-sm text-gray-600">Here's what happening with your store today</p>
        </div>
        <div className="flex items-center space-x-4">
          <select className="border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500">
            <option>Previous Year</option>
            <option>Current Year</option>
          </select>
          <button className="bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 transition-colors">View All Time</button>
        </div>
      </div>

      {/* Overview Metrics */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard
          title="Ecommerce Revenue"
          value="₹20,50,450" // This should also be dynamic
          percentage="14.9%"
          percentageColor="text-green-500"
          period=""
          trendValue="+43.21%"
        />
        <StatCard
          title="New Customers"
          value="684" // This should also be dynamic
          percentage="8.6%"
          percentageColor="text-red-500"
          period=""
          trendValue="-8.6%"
        />
        <StatCard
          title="Repeat Purchase Rate"
          value="75.12 %" // This should also be dynamic
          percentage="25.4%"
          percentageColor="text-green-500"
          period=""
          trendValue="+20.11%"
        />
        <StatCard
          title="Average Order Value"
          value="₹2,412" // This should also be dynamic
          percentage="35.2%"
          percentageColor="text-green-500"
          period=""
          trendValue="+₹754"
        />
        <StatCard
          title="Conversion rate"
          value="32.65 %" // This should also be dynamic
          percentage="12.42%"
          percentageColor="text-red-500"
          period=""
          trendValue="-12.42%"
        />
      </section>

      {/* Summary Chart and Product/Customer Lists */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        {/* Summary Chart */}
        <Card className="lg:col-span-2 p-4 h-96 flex flex-col shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Summary</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span> Order
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span> Income Growth
              </div>
              <select className="border border-gray-300 rounded-md p-1 text-sm focus:ring-blue-500 focus:border-blue-500">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
              </select>
            </div>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={summaryChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="order" stroke="#48bb78" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="incomeGrowth" stroke="#4299e1" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Most Selling Products */}
        <Card className="p-4 flex flex-col shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Most Selling Products</h2>
            <button className="text-gray-500 hover:text-gray-700">...</button>
          </div>
          <ul>
            {mostSellingProducts.map((product, index) => (
              <li key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded-md" />
                  <div>
                    <p className="font-semibold text-gray-800">{product.name}</p>
                    <p className="text-xs text-gray-500">ID: {product.id}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-600">{product.sales} Sales</span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* Recent Orders and Weekly Top Customers */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        {/* Recent Orders */}
        <Card className="p-4 shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
            <button className="text-blue-500 text-sm hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex items-center">
                        <img src={order.productImage} alt={order.productName} className="w-8 h-8 object-cover rounded-md mr-2" />
                        <span className="text-sm font-medium text-gray-900">{order.productName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-blue-500 hover:underline cursor-pointer">{order.customer}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{order.orderId}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.statusColor}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table >
          </div>
        </Card>

        {/* Weekly Top Customers */}
        <Card className="p-4 shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Weekly Top Customers</h2>
            <button className="text-gray-500 hover:text-gray-700">...</button>
          </div>
          <ul>
            {weeklyTopCustomers.map((customer, index) => (
              <li key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <img src={customer.avatar} alt={customer.name} className="w-10 h-10 object-cover rounded-full" />
                  <div>
                    <p className="font-semibold text-gray-800">{customer.name}</p>
                    <p className="text-xs text-gray-500">{customer.orders} Orders</p>
                  </div>
                </div>
                <button className="text-blue-500 text-sm px-3 py-1 border border-blue-500 rounded-md hover:bg-blue-50 transition-colors">View</button>
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </div>
  );
};

export default AdminDashboardHome;
