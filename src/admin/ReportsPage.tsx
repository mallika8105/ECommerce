import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import Dropdown from '../components/Dropdown';
import EmptyState from '../components/EmptyState';
import { Download, BarChart as BarChartIcon, LineChart as LineChartIcon } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../supabaseClient'; // Import supabase client

const dateFilterOptions = [
  { label: 'Last 7 Days', value: '7days' },
  { label: 'Last 30 Days', value: '30days' },
  { label: 'Last 90 Days', value: '90days' },
  { label: 'Custom Range', value: 'custom' },
];

interface ReportDataPoint {
  date: string;
  sales: number;
  revenue: number;
}

const ReportsPage: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('30days');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState<ReportDataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReportData();
  }, [selectedFilter, startDate, endDate]);

  const calculateDateRange = (filter: string) => {
    const today = new Date();
    let start = new Date();
    let end = today;

    switch (filter) {
      case '7days':
        start.setDate(today.getDate() - 7);
        break;
      case '30days':
        start.setDate(today.getDate() - 30);
        break;
      case '90days':
        start.setDate(today.getDate() - 90);
        break;
      case 'custom':
        start = startDate ? new Date(startDate) : new Date();
        end = endDate ? new Date(endDate) : today;
        break;
      default:
        break;
    }
    return { start, end };
  };

  const fetchReportData = async () => {
    setLoading(true);
    setError(null);
    setReportData([]);

    const { start, end } = calculateDateRange(selectedFilter);

    if (selectedFilter === 'custom' && (!startDate || !endDate)) {
      setLoading(false);
      return; // Don't fetch if custom range is incomplete
    }

    try {
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('created_at, total')
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString())
        .order('created_at', { ascending: true });

      if (ordersError) throw ordersError;

      const aggregatedData = aggregateOrdersByDate(orders);
      setReportData(aggregatedData);

    } catch (err: any) {
      console.error('Error fetching report data:', err.message);
      setError('Failed to fetch report data.');
    } finally {
      setLoading(false);
    }
  };

  const aggregateOrdersByDate = (orders: any[]): ReportDataPoint[] => {
    const dailyData: { [key: string]: { sales: number; revenue: number } } = {};

    orders.forEach(order => {
      const date = new Date(order.created_at).toISOString().split('T')[0]; // YYYY-MM-DD
      if (!dailyData[date]) {
        dailyData[date] = { sales: 0, revenue: 0 };
      }
      dailyData[date].sales += 1; // Count as one sale
      dailyData[date].revenue += order.total;
    });

    return Object.keys(dailyData)
      .sort()
      .map(date => ({
        date,
        sales: dailyData[date].sales,
        revenue: dailyData[date].revenue,
      }));
  };

  const handleFilterSelect = (value: string) => {
    setSelectedFilter(value);
    if (value !== 'custom') {
      setStartDate('');
      setEndDate('');
    }
  };

  const handleDownloadReport = () => {
    if (reportData.length === 0) {
      alert('No data to download.');
      return;
    }

    const csvHeader = 'Date,Sales,Revenue\n';
    const csvRows = reportData.map(row => `${row.date},${row.sales},${row.revenue.toFixed(2)}`).join('\n');
    const csvContent = csvHeader + csvRows;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `sales_report_${selectedFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow container mx-auto p-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Reports</h1>

        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Generate Reports</h2>
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
            <div className="w-full md:w-1/3">
              <Dropdown
                options={dateFilterOptions}
                onSelect={handleFilterSelect}
                placeholder="Select Date Range"
                className="w-full"
              />
            </div>
            {selectedFilter === 'custom' && (
              <>
                <Input
                  type="date"
                  label="Start Date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full md:w-1/3"
                />
                <Input
                  type="date"
                  label="End Date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full md:w-1/3"
                />
              </>
            )}
            <Button variant="primary" onClick={handleDownloadReport} className="w-full md:w-auto">
              <Download size={20} className="mr-2" /> Download Report
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {/* Sales Chart */}
            <Card className="p-6 h-80 flex flex-col shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales Over Time</h3>
              {loading ? (
                <div className="flex-grow flex items-center justify-center">Loading chart data...</div>
              ) : error ? (
                <div className="flex-grow flex items-center justify-center text-red-500">Error: {error}</div>
              ) : reportData.length === 0 ? (
                <EmptyState message="No sales data available for this period." />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#48bb78" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card>
            {/* Revenue Chart */}
            <Card className="p-6 h-80 flex flex-col shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue Over Time</h3>
              {loading ? (
                <div className="flex-grow flex items-center justify-center">Loading chart data...</div>
              ) : error ? (
                <div className="flex-grow flex items-center justify-center text-red-500">Error: {error}</div>
              ) : reportData.length === 0 ? (
                <EmptyState message="No revenue data available for this period." />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={reportData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#4299e1" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </Card>
          </div>
        </Card>

        {/* Other reports can be added here */}
        <EmptyState message="No detailed reports available yet. Generate a report above." />
      </main>
    </div>
  );
};

export default ReportsPage;
