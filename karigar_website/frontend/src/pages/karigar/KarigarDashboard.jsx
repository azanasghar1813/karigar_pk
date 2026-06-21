import React, { useState, useEffect } from 'react';
import { ClipboardList, Calendar, Wallet, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../config/api';

export default function KarigarDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/karigar-portal/stats');
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats', error);
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleOnline = async () => {
    if (toggling) return;
    setToggling(true);
    try {
      const { data } = await api.put('/karigar-portal/availability');
      setStats((prev) => ({ ...prev, isOnline: data.isOnline }));
      toast.success(`You are now ${data.isOnline ? 'Online' : 'Offline'}`);
    } catch (error) {
      console.error('Toggle failed', error);
      toast.error(error.response?.data?.message || 'Failed to toggle availability');
    } finally {
      setToggling(false);
    }
  };

  if (loading) {
    return <div className="p-8 flex justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto font-poppins">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 mt-1">Here's a quick overview of your business.</p>
        </div>

        {/* Online Toggle */}
        <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-800">Available for Bookings</span>
            <span className="text-xs text-slate-500">{stats.isOnline ? 'You are visible to customers' : 'You are currently offline'}</span>
          </div>
          <button
            onClick={handleToggleOnline}
            disabled={toggling}
            className={`relative w-14 h-7 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-1 ${
              stats.isOnline ? 'bg-secondary' : 'bg-slate-300'
            }`}
          >
            <span
              className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow-md transition-transform pointer-events-none ${
                stats.isOnline ? 'translate-x-7' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="New Requests" 
          value={stats.newRequests} 
          icon={<ClipboardList className="w-6 h-6 text-blue-600" />} 
          bg="bg-blue-50" 
        />
        <StatCard 
          title="Scheduled Today" 
          value={stats.scheduledToday} 
          icon={<Calendar className="w-6 h-6 text-amber-600" />} 
          bg="bg-amber-50" 
        />
        <StatCard 
          title="Estimated Earnings" 
          value={`Rs. ${stats.estimatedEarnings.toLocaleString()}`} 
          subtitle="This month"
          icon={<Wallet className="w-6 h-6 text-emerald-600" />} 
          bg="bg-emerald-50" 
        />
        {stats.reviewsCount === 0 ? (
          <StatCard 
            title="Current Rating" 
            value="No ratings yet" 
            icon={<Star className="w-6 h-6 text-purple-600" />} 
            bg="bg-purple-50" 
            to="/karigar/reviews"
          />
        ) : (
          <StatCard 
            title="Current Rating" 
            value={stats.rating.toFixed(1)} 
            icon={<Star className="w-6 h-6 text-purple-600" />} 
            bg="bg-purple-50"
            to="/karigar/reviews" 
          />
        )}
      </div>
    </div>
  );
}

const StatCard = ({ title, value, subtitle, icon, bg, to }) => {
  const content = (
    <>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${bg}`}>
        {icon}
      </div>
      <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
    </>
  );

  const className = "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all h-full block";

  if (to) {
    return <Link to={to} className={className}>{content}</Link>;
  }

  return <div className={className}>{content}</div>;
};
