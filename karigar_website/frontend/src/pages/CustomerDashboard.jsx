import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';

export default function CustomerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Admin and Karigar have their own dashboards
    if (user.role !== 'user') {
      navigate(user.role === 'admin' ? '/admin' : '/karigar');
      return;
    }

    fetchBookings();
  }, [user, navigate]);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/bookings/mybookings');
      setBookings(data.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await api.patch(`/bookings/${id}/cancel`);
      fetchBookings(); // Refresh
    } catch (error) {
      alert('Could not cancel booking. ' + (error.response?.data?.message || ''));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {user?.name}</p>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">My Bookings</h2>
          </div>
          
          {bookings.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No Bookings Yet</h3>
              <p className="text-gray-500 mb-6">You haven't made any service bookings yet.</p>
              <button
                onClick={() => navigate('/services')}
                className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
              >
                Book a Service
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="p-4 font-semibold text-gray-600 text-sm">Service</th>
                    <th className="p-4 font-semibold text-gray-600 text-sm">Karigar</th>
                    <th className="p-4 font-semibold text-gray-600 text-sm">Date & Time</th>
                    <th className="p-4 font-semibold text-gray-600 text-sm">Status</th>
                    <th className="p-4 font-semibold text-gray-600 text-sm text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{booking.serviceType}</div>
                        <div className="text-sm text-gray-500 mt-0.5">{booking.address}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{booking.karigar?.name}</div>
                        <div className="text-sm text-gray-500 mt-0.5">{booking.karigar?.phone}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-gray-900">{new Date(booking.date).toLocaleDateString()}</div>
                        <div className="text-sm text-gray-500 mt-0.5">{booking.time}</div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                          booking.status === 'in-progress' ? 'bg-purple-100 text-purple-800' :
                          booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {booking.status === 'pending' && (
                          <button
                            onClick={() => cancelBooking(booking._id)}
                            className="text-sm text-red-600 hover:text-red-700 font-medium"
                          >
                            Cancel
                          </button>
                        )}
                        {booking.status === 'completed' && (
                          <button
                            onClick={() => {/* Rate modal can go here */}}
                            className="text-sm text-primary hover:text-primary-dark font-medium"
                          >
                            Rate Review
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
