import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axiosInstance from '../utils/axiosInstance';
import DashboardCard from '../components/DashboardCard';
import Loader from '../components/Loader';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get('/admin/dashboard');
        setStats(res.data);
      } catch (error) {
        console.error("Error fetching stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loader />;

  // Construct chart data dynamically from backend stats if available, otherwise structural
  const chartData = [
    { name: 'Pending', bookings: stats?.pendingBookings || 0 },
    { name: 'Completed', bookings: stats?.completedBookings || 0 },
    { name: 'Total', bookings: stats?.totalBookings || 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard title="Total Bookings" value={stats?.totalBookings} color="bg-blue-500" icon={<span>📅</span>} />
        <DashboardCard title="Pending" value={stats?.pendingBookings} color="bg-yellow-500" icon={<span>⏳</span>} />
        <DashboardCard title="Revenue" value={`₹${stats?.revenue}`} color="bg-green-500" icon={<span>💰</span>} />
        <DashboardCard title="Total Users" value={stats?.usersCount} color="bg-purple-500" icon={<span>👥</span>} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Bookings Overview</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Bar dataKey="bookings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;