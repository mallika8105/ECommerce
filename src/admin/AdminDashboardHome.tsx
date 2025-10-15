import React from 'react';
import Card from '../components/Card';
import { DollarSign, Users, ShoppingBag, CheckCircle, TrendingUp, Package, CreditCard, LayoutGrid, Settings, Megaphone, ArrowUp, ArrowDown } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

interface StatCardProps {
  title: string;
  value: string;
  percentage: string;
  percentageColor: string;
  period: string;
  trendValue?: string;
  icon?: React.ReactNode; // Make icon optional as some cards don't have it
  bgColor?: string; // Make bgColor optional as it's not always a direct prop
}

interface SummaryChartData {
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

const summaryChartData = [
  { name: 'Sep 07', order: 5000, incomeGrowth: 3000 },
  { name: 'Sep 08', order: 7000, incomeGrowth: 5000 },
  { name: 'Sep 09', order: 6000, incomeGrowth: 4000 },
  { name: 'Sep 10', order: 8000, incomeGrowth: 6000 },
  { name: 'Sep 11', order: 7500, incomeGrowth: 5500 },
  { name: 'Sep 12', order: 9000, incomeGrowth: 7000 },
  { name: 'Sep 13', order: 8500, incomeGrowth: 6500 },
];

const mostSellingProducts = [
  { image: 'https://via.placeholder.com/40', name: 'Snicker Vento', id: '2441310', sales: '128' },
  { image: 'https://via.placeholder.com/40', name: 'Blue Backpack', id: '1241318', sales: '401' },
  { image: 'https://via.placeholder.com/40', name: 'Water Bottle', id: '8441573', sales: '1K+' },
];

const recentOrders = [
  { productImage: 'https://via.placeholder.com/32', productName: 'Water Bottle', customer: 'Peterson Jack', orderId: '#8441573', date: '27 Jun 2025', status: 'Pending', statusColor: 'bg-yellow-100 text-yellow-800' },
  { productImage: 'https://via.placeholder.com/32', productName: 'Iphone 15 Pro', customer: 'Michel Datta', orderId: '#2457841', date: '26 Jun 2025', status: 'Canceled', statusColor: 'bg-red-100 text-red-800' },
  { productImage: 'https://via.placeholder.com/32', productName: 'Headphone', customer: 'Jesiya Rose', orderId: '#1024784', date: '20 Jun 2025', status: 'Shipped', statusColor: 'bg-green-100 text-green-800' },
];

const weeklyTopCustomers = [
  { avatar: 'https://via.placeholder.com/40', name: 'Marks Hoverson', orders: 25 },
  { avatar: 'https://via.placeholder.com/40', name: 'Marks Hoverson', orders: 15 },
  { avatar: 'https://via.placeholder.com/40', name: 'Jhony Peters', orders: 23 },
];

const AdminDashboardHome: React.FC = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Welcome Back, Mahfuzul!</h1>
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
          value="$245,450"
          percentage="14.9%"
          percentageColor="text-green-500"
          period=""
          trendValue="+43.21%"
        />
        <StatCard
          title="New Customers"
          value="684"
          percentage="8.6%"
          percentageColor="text-red-500"
          period=""
          trendValue="-8.6%"
        />
        <StatCard
          title="Repeat Purchase Rate"
          value="75.12 %"
          percentage="25.4%"
          percentageColor="text-green-500"
          period=""
          trendValue="+20.11%"
        />
        <StatCard
          title="Average Order Value"
          value="$2,412.23"
          percentage="35.2%"
          percentageColor="text-green-500"
          period=""
          trendValue="+$754"
        />
        <StatCard
          title="Conversion rate"
          value="32.65 %"
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
