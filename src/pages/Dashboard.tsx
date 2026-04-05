import { TrendingUp, ShoppingBag, Users, DollarSign } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import type { AnalyticsData } from '../types';

const Dashboard = () => {
  const analytics: AnalyticsData = {
    salesByMonth: [
      { month: 'Jan', sales: 4500 },
      { month: 'Feb', sales: 5200 },
      { month: 'Mar', sales: 4800 },
      { month: 'Apr', sales: 6100 },
      { month: 'May', sales: 7200 },
      { month: 'Jun', sales: 6800 },
    ],
    ordersByStatus: [
      { status: 'Pending', count: 12 },
      { status: 'Processing', count: 8 },
      { status: 'Shipped', count: 15 },
      { status: 'Delivered', count: 45 },
    ],
    topProducts: [
      { name: 'Wireless Headphones', sales: 120 },
      { name: 'Smart Watch', sales: 98 },
      { name: 'Laptop Stand', sales: 85 },
      { name: 'USB-C Hub', sales: 72 },
      { name: 'Mechanical Keyboard', sales: 68 },
    ],
    revenue: 34520,
    totalOrders: 156,
    totalProducts: 48,
    totalCustomers: 89,
  };

  const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444'];

  const stats = [
    { icon: DollarSign, label: 'Total Revenue', value: `₹${analytics.revenue.toLocaleString()}`, trend: '+12%' },
    { icon: ShoppingBag, label: 'Total Orders', value: analytics.totalOrders.toString(), trend: '+8%' },
    { icon: Users, label: 'Customers', value: analytics.totalCustomers.toString(), trend: '+15%' },
    { icon: TrendingUp, label: 'Products', value: analytics.totalProducts.toString(), trend: '+5%' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h2>
        <span className="text-gray-500">Last updated: {new Date().toLocaleDateString()}</span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <stat.icon size={24} className="text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-green-600 mt-2">{stat.trend} from last month</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Sales</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.salesByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders by Status */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Orders by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.ordersByStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {analytics.ordersByStatus.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Selling Products</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analytics.topProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
