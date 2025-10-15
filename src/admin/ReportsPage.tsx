import React, { useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import Dropdown from '../components/Dropdown';
import EmptyState from '../components/EmptyState';
import { Download, BarChart, LineChart } from 'lucide-react';

const dateFilterOptions = [
  { label: 'Last 7 Days', value: '7days' },
  { label: 'Last 30 Days', value: '30days' },
  { label: 'Last 90 Days', value: '90days' },
  { label: 'Custom Range', value: 'custom' },
];

const ReportsPage: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('30days');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleFilterSelect = (value: string) => {
    setSelectedFilter(value);
    // Implement logic to fetch data based on filter
    console.log('Selected report filter:', value);
  };

  const handleDownloadReport = () => {
    console.log('Downloading report for:', selectedFilter, startDate, endDate);
    // Implement report download logic
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
            <Card className="p-6 h-80 flex items-center justify-center text-gray-500">
              <BarChart size={48} className="text-gray-400 mr-4" />
              <span>[Placeholder for Sales Chart]</span>
            </Card>
            {/* Revenue Chart */}
            <Card className="p-6 h-80 flex items-center justify-center text-gray-500">
              <LineChart size={48} className="text-gray-400 mr-4" />
              <span>[Placeholder for Revenue Chart]</span>
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
