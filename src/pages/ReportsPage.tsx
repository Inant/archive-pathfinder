
import React, { useState } from 'react';
import MainNavigation from '@/components/MainNavigation';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { CalendarIcon, Download } from 'lucide-react';

// Mock financial data
const financialData = [
  { month: 'Jan', revenue: 35000, costs: 22000, profit: 13000 },
  { month: 'Feb', revenue: 42000, costs: 25000, profit: 17000 },
  { month: 'Mar', revenue: 48000, costs: 28000, profit: 20000 },
  { month: 'Apr', revenue: 52000, costs: 30000, profit: 22000 },
  { month: 'May', revenue: 61000, costs: 35000, profit: 26000 },
  { month: 'Jun', revenue: 68000, costs: 38000, profit: 30000 },
];

// Mock customer data
const customerData = [
  { month: 'Jan', bookings: 120, inquiries: 230 },
  { month: 'Feb', bookings: 145, inquiries: 260 },
  { month: 'Mar', bookings: 175, inquiries: 290 },
  { month: 'Apr', bookings: 190, inquiries: 310 },
  { month: 'May', bookings: 220, inquiries: 340 },
  { month: 'Jun', bookings: 250, inquiries: 380 },
];

// Mock channel distribution data
const channelData = [
  { name: 'JVTO', value: 55 },
  { name: 'Klook', value: 30 },
  { name: 'TWT', value: 15 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const ReportsPage: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedQuarter, setSelectedQuarter] = useState('Q1-Q2');

  const handleDownloadReport = () => {
    alert('Downloading report...');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <MainNavigation />

      <div className="flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">Reports & Analytics</h1>
          <p className="text-gray-600">View financial reports and customer statistics</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6 flex flex-wrap items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <select 
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value="2024">2024</option>
                <option value="2025">2025</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
              <select 
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedQuarter}
                onChange={(e) => setSelectedQuarter(e.target.value)}
              >
                <option value="Q1-Q2">Q1-Q2 (Jan-Jun)</option>
                <option value="Q3-Q4">Q3-Q4 (Jul-Dec)</option>
                <option value="Full">Full Year</option>
              </select>
            </div>
          </div>
          <div className="flex items-center mt-4 md:mt-0">
            <button
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mr-3"
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              Custom Range
            </button>
            <button
              onClick={handleDownloadReport}
              className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </button>
          </div>
        </div>

        {/* Financial Reports */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
          <h2 className="text-xl font-medium text-gray-800 mb-4">Financial Reports</h2>
          
          <div className="h-80 mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={financialData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value}`} />
                <Legend />
                <Bar dataKey="revenue" fill="#4F46E5" name="Revenue" />
                <Bar dataKey="costs" fill="#F97316" name="Costs" />
                <Bar dataKey="profit" fill="#10B981" name="Profit" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Costs</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Margin</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {financialData.map((row) => (
                  <tr key={row.month}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.month}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${row.revenue.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${row.costs.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${row.profit.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {Math.round((row.profit / row.revenue) * 100)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-medium text-gray-800 mb-4">Booking Trends</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={customerData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="bookings" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }}
                    name="Bookings"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="inquiries" 
                    stroke="#82ca9d"
                    name="Inquiries" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-medium text-gray-800 mb-4">Channel Distribution</h2>
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channelData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {channelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-white border-t border-gray-100 py-3 px-6 text-center text-sm text-gray-500">
        <p>Java Volcano Tour Operator - Archive Pathfinder © 2025</p>
      </footer>
    </div>
  );
};

export default ReportsPage;
