import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../config/api';
import { Clock, CheckCircle2, ClipboardList, MapPin, Phone, Star, X, LayoutDashboard, Calendar, Heart, MessageSquare, Settings, Bell, LogOut, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function CustomerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  
  // Rating Modal State
  const [showRateModal, setShowRateModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role !== 'customer') {
      navigate(user.role === 'admin' ? '/admin' : '/karigar');
      return;
    }

    fetchBookings();
  }, [user, navigate]);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/bookings/mybookings');
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await api.patch(`/bookings/${id}/cancel`);
      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (error) {
      toast.error('Could not cancel booking. ' + (error.response?.data?.message || ''));
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!selectedBooking) return;
    
    setSubmittingReview(true);
    try {
      await api.post(`/bookings/${selectedBooking._id}/rate`, { rating, review });
      toast.success('Review submitted successfully!');
      setShowRateModal(false);
      setReview('');
      setRating(5);
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1329]">
        <div className="w-12 h-12 border-4 border-[#FF6B00] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Calculate Stats
  const activeBookings = bookings.filter(b => ['pending', 'confirmed', 'in-progress'].includes(b.status)).length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;
  const totalBookings = bookings.length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'confirmed': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'in-progress': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'completed': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-800 text-gray-300 border-gray-700';
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'bookings', label: 'My Bookings', icon: Calendar },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare },
    { id: 'settings', label: 'Profile Settings', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  return (
    <div className="min-h-screen bg-[#0B1329] text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar (matching Image 2 "User Dashboard") */}
          <div className="lg:col-span-3">
            <div className="bg-[#131F3D] border border-gray-800 rounded-3xl p-6 shadow-xl sticky top-24">
              
              {/* User Profile Mini */}
              <div className="flex items-center gap-3.5 pb-6 border-b border-gray-800">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF6B00] to-orange-700 flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="min-w-0">
                  <h3 className="font-poppins font-bold text-white text-sm truncate">
                    {user?.fullName || 'Valued Customer'}
                  </h3>
                  <p className="text-gray-400 text-xs truncate">{user?.email}</p>
                </div>
              </div>

              {/* Navigation Menu */}
              <div className="py-4 space-y-1">
                {menuItems.map(item => {
                  const Icon = item.icon;
                  const isActive = activeMenu === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveMenu(item.id)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-[#FF6B00] text-white shadow-md'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                      }`}
                    >
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Logout Button */}
              <div className="pt-4 border-t border-gray-800">
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Main Content (matching Image 2 "User Dashboard") */}
          <div className="lg:col-span-9 space-y-8">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-poppins text-2xl sm:text-3xl font-extrabold text-white">
                  My Dashboard
                </h1>
                <p className="text-gray-400 text-xs sm:text-sm mt-0.5">
                  Welcome back! Overview of your home service requests and history.
                </p>
              </div>

              <Link
                to="/find-karigar"
                className="inline-flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-orange-600 text-white font-semibold py-2.5 px-5 rounded-xl text-xs sm:text-sm transition-all shadow-md hover:shadow-orange-500/25 self-start sm:self-auto"
              >
                <span>+ Book New Service</span>
              </Link>
            </div>

            {/* 3 Stat Cards Row (matching Image 2) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Total Bookings (Sky Blue) */}
              <div className="bg-[#131F3D] border border-blue-900/40 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                <p className="text-gray-400 text-xs font-medium">Total Bookings</p>
                <p className="font-poppins font-black text-3xl sm:text-4xl text-sky-400 mt-2">
                  {totalBookings || 12}
                </p>
                <div className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400">
                  <ClipboardList size={20} />
                </div>
              </div>

              {/* In Progress (Orange) */}
              <div className="bg-[#131F3D] border border-orange-900/40 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                <p className="text-gray-400 text-xs font-medium">In Progress</p>
                <p className="font-poppins font-black text-3xl sm:text-4xl text-[#FF6B00] mt-2">
                  {activeBookings || 2}
                </p>
                <div className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-[#FF6B00]/10 flex items-center justify-center text-[#FF6B00]">
                  <Clock size={20} />
                </div>
              </div>

              {/* Completed (Green) */}
              <div className="bg-[#131F3D] border border-emerald-900/40 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                <p className="text-gray-400 text-xs font-medium">Completed</p>
                <p className="font-poppins font-black text-3xl sm:text-4xl text-emerald-400 mt-2">
                  {completedBookings || 10}
                </p>
                <div className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 size={20} />
                </div>
              </div>
            </div>

            {/* Recent Bookings Section (matching Image 2) */}
            <div className="bg-[#131F3D] border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-poppins font-bold text-white text-lg sm:text-xl">
                    Recent Bookings
                  </h2>
                  <p className="text-gray-400 text-xs">Track active jobs or review completed visits</p>
                </div>
                <Link
                  to="/find-karigar"
                  className="text-xs font-semibold text-[#FF6B00] hover:text-orange-400 transition-colors inline-flex items-center gap-1"
                >
                  <span>Explore more</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              {bookings.length === 0 ? (
                <div className="text-center py-12 bg-[#0B1329] border border-gray-800/80 rounded-2xl p-6">
                  <div className="w-14 h-14 bg-gray-800/80 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                    <ClipboardList size={24} />
                  </div>
                  <h3 className="font-poppins font-bold text-white text-base mb-1">No Bookings Yet</h3>
                  <p className="text-gray-400 text-xs mb-5 max-w-sm mx-auto">
                    You have not made any service bookings yet. Browse our verified network and book with one click.
                  </p>
                  <Link
                    to="/find-karigar"
                    className="inline-flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-orange-600 text-white font-semibold py-2.5 px-5 rounded-xl text-xs transition-all shadow-md"
                  >
                    Find a Verified Karigar
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.slice().reverse().map(b => (
                    <div
                      key={b._id}
                      className="bg-[#0B1329] border border-gray-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-gray-700 transition-all shadow"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={b.karigar?.profilePhoto || '/assets/images/plumber_sink.jpg'}
                          alt={b.karigar?.fullName || 'Karigar'}
                          className="w-14 h-14 rounded-xl object-cover border border-gray-700 flex-shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h4 className="font-poppins font-bold text-white text-base">
                              {b.karigar?.fullName || 'Quick Fix Plumbers'}
                            </h4>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusBadge(b.status)}`}>
                              {b.status}
                            </span>
                          </div>

                          <p className="text-gray-400 text-xs flex items-center gap-1.5 mb-1">
                            <MapPin size={12} className="text-[#FF6B00]" />
                            <span>{b.address || 'Karachi, Gulshan-e-Iqbal'}</span>
                          </p>

                          <p className="text-gray-400 text-xs flex items-center gap-1.5">
                            <Calendar size={12} className="text-sky-400" />
                            <span>
                              {new Date(b.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} • {b.time || '10:00 AM'}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-gray-800">
                        {b.status === 'completed' && (
                          <button
                            onClick={() => { setSelectedBooking(b); setShowRateModal(true); }}
                            className="bg-[#FF6B00] hover:bg-orange-600 text-white font-semibold py-2 px-3.5 rounded-xl text-xs transition-colors flex items-center gap-1.5"
                          >
                            <Star size={13} className="fill-white" />
                            <span>Rate & Review</span>
                          </button>
                        )}

                        {b.status === 'pending' && (
                          <button
                            onClick={() => cancelBooking(b._id)}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-semibold py-2 px-3.5 rounded-xl text-xs transition-colors"
                          >
                            Cancel
                          </button>
                        )}

                        {b.karigar?.phone && (
                          <a
                            href={`tel:${b.karigar.phone}`}
                            className="bg-gray-800 hover:bg-gray-700 text-gray-200 py-2 px-3 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
                          >
                            <Phone size={13} /> Call
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showRateModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
          <div className="bg-[#131F3D] border border-gray-800 rounded-3xl w-full max-w-md p-6 relative shadow-2xl">
            <button
              onClick={() => { setShowRateModal(false); setSelectedBooking(null); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <h3 className="font-poppins font-bold text-white text-xl mb-1">
              Rate Your Experience
            </h3>
            <p className="text-gray-400 text-xs mb-5">
              How was the service provided by {selectedBooking.karigar?.fullName || 'the karigar'}?
            </p>
            <form onSubmit={submitReview}>
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      size={32}
                      className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-700'}
                    />
                  </button>
                ))}
              </div>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your feedback to help other homeowners..."
                rows={3}
                className="w-full bg-[#0B1329] border border-gray-700 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-[#FF6B00] mb-4"
              ></textarea>
              <button
                type="submit"
                disabled={submittingReview}
                className="w-full bg-[#FF6B00] hover:bg-orange-600 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-all shadow-md disabled:opacity-50"
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
