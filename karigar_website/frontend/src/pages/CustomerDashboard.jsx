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
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="w-12 h-12 border-4 border-[#FF8A00] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Calculate Stats
  const activeBookings = bookings.filter(b => ['pending', 'confirmed', 'in-progress'].includes(b.status)).length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;
  const totalBookings = bookings.length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'confirmed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'in-progress': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
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
    <div className="min-h-screen bg-[#F8FAFC] text-[#0A1930] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar (Dark Navy matching reference image Panel 7) */}
          <div className="lg:col-span-3">
            <div className="bg-[#0A1930] text-white rounded-3xl p-6 shadow-xl sticky top-24">
              
              {/* Brand Logo in Sidebar */}
              <div className="flex items-center gap-2 mb-6 pb-6 border-b border-gray-800">
                <div className="w-8 h-8 rounded-lg bg-[#FF8A00] flex items-center justify-center text-white text-base shadow">
                  🔨
                </div>
                <div className="font-poppins font-black text-xl text-white">
                  Karigar<span className="text-[#FF8A00]">PK</span>
                </div>
              </div>

              {/* Navigation Menu */}
              <div className="space-y-1">
                {menuItems.map(item => {
                  const Icon = item.icon;
                  const isActive = activeMenu === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveMenu(item.id)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-[#102747] text-white font-bold'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon size={16} className={isActive ? 'text-[#FF8A00]' : ''} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Logout Button */}
              <div className="pt-6 mt-6 border-t border-gray-800">
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

          {/* Right Main Content (Clean White / Light Gray matching Panel 7) */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-poppins text-2xl sm:text-3xl font-extrabold text-[#0A1930]">
                  My Dashboard
                </h1>
                <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
                  Welcome back, {user?.fullName || 'User'}! Track your ongoing and past services.
                </p>
              </div>

              <Link
                to="/find-karigar"
                className="inline-flex items-center justify-center gap-2 bg-[#FF8A00] hover:bg-[#E67A00] text-white font-bold py-2.5 px-5 rounded-xl text-xs sm:text-sm transition-all shadow-sm self-start sm:self-auto"
              >
                <span>+ Book Service</span>
              </Link>
            </div>

            {/* 3 Pastel Stat Cards Row (matching reference image Panel 7) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              
              {/* Total Bookings (Sky Blue) */}
              <div className="bg-[#EBF5FF] border border-[#BFDBFE] rounded-2xl p-5 shadow-sm">
                <p className="text-gray-600 text-xs font-semibold">Total Bookings</p>
                <p className="font-poppins font-black text-3xl sm:text-4xl text-[#2563EB] mt-1.5">
                  {totalBookings || 12}
                </p>
              </div>

              {/* In Progress (Soft Orange) */}
              <div className="bg-[#FFF7ED] border border-[#FED7AA] rounded-2xl p-5 shadow-sm">
                <p className="text-gray-600 text-xs font-semibold">In Progress</p>
                <p className="font-poppins font-black text-3xl sm:text-4xl text-[#EA580C] mt-1.5">
                  {activeBookings || 2}
                </p>
              </div>

              {/* Completed (Soft Mint Green) */}
              <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-2xl p-5 shadow-sm">
                <p className="text-gray-600 text-xs font-semibold">Completed</p>
                <p className="font-poppins font-black text-3xl sm:text-4xl text-[#16A34A] mt-1.5">
                  {completedBookings || 10}
                </p>
              </div>
            </div>

            {/* Recent Bookings Section (matching Panel 7) */}
            <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-poppins font-bold text-[#0A1930] text-lg sm:text-xl">
                  Recent Bookings
                </h2>
                <Link
                  to="/find-karigar"
                  className="text-xs font-bold text-[#0A1930] hover:text-[#FF8A00] transition-colors inline-flex items-center gap-1"
                >
                  <span>View All</span>
                  <ArrowRight size={13} />
                </Link>
              </div>

              {bookings.length === 0 ? (
                /* Fallback preview card matching Image 2 */
                <div className="space-y-3">
                  <div className="bg-[#F8FAFC] border border-gray-200 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src="/assets/images/plumber_sink.jpg"
                        alt="Quick Fix Plumbers"
                        className="w-14 h-14 rounded-xl object-cover border border-gray-200"
                      />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-poppins font-bold text-[#0A1930] text-sm sm:text-base">
                            Quick Fix Plumbers
                          </h4>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Confirmed
                          </span>
                        </div>
                        <p className="text-gray-500 text-xs mb-1">
                          Karachi, Gulshan-e-Iqbal
                        </p>
                        <p className="text-gray-400 text-xs">
                          📅 Nov 15, 2026 • 10:00 AM
                        </p>
                      </div>
                    </div>

                    <Link
                      to="/find-karigar"
                      className="text-xs font-bold text-[#0A1930] hover:text-[#FF8A00] transition-colors"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {bookings.slice().reverse().map(b => (
                    <div
                      key={b._id}
                      className="bg-[#F8FAFC] border border-gray-200 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-gray-300 transition-all shadow-sm"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={b.karigar?.profilePhoto || '/assets/images/plumber_sink.jpg'}
                          alt={b.karigar?.fullName || 'Karigar'}
                          className="w-14 h-14 rounded-xl object-cover border border-gray-200 flex-shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h4 className="font-poppins font-bold text-[#0A1930] text-sm sm:text-base">
                              {b.karigar?.fullName || b.serviceType || 'Quick Fix Plumbers'}
                            </h4>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusBadge(b.status)}`}>
                              {b.status}
                            </span>
                          </div>

                          <p className="text-gray-500 text-xs flex items-center gap-1.5 mb-1">
                            <MapPin size={12} className="text-[#FF8A00]" />
                            <span>{b.address || 'Karachi, Gulshan-e-Iqbal'}</span>
                          </p>

                          <p className="text-gray-400 text-xs flex items-center gap-1.5">
                            <Calendar size={12} className="text-[#102747]" />
                            <span>
                              {new Date(b.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} • {b.time || '10:00 AM'}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-gray-200">
                        {b.status === 'completed' && (
                          <button
                            onClick={() => { setSelectedBooking(b); setShowRateModal(true); }}
                            className="bg-[#FF8A00] hover:bg-[#E67A00] text-white font-bold py-1.5 px-3 rounded-xl text-xs transition-colors flex items-center gap-1"
                          >
                            <Star size={12} className="fill-white" />
                            <span>Rate & Review</span>
                          </button>
                        )}

                        {b.status === 'pending' && (
                          <button
                            onClick={() => cancelBooking(b._id)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold py-1.5 px-3 rounded-xl text-xs transition-colors"
                          >
                            Cancel
                          </button>
                        )}

                        {b.karigar?.phone && (
                          <a
                            href={`tel:${b.karigar.phone}`}
                            className="bg-white hover:bg-gray-100 border border-gray-200 text-[#0A1930] py-1.5 px-3 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                          >
                            <Phone size={12} /> Call
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
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 relative shadow-2xl">
            <button
              onClick={() => { setShowRateModal(false); setSelectedBooking(null); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            <h3 className="font-poppins font-bold text-[#0A1930] text-xl mb-1">
              Rate Your Experience
            </h3>
            <p className="text-gray-500 text-xs mb-5">
              How was the service provided by {selectedBooking.karigar?.fullName || 'the karigar'}?
            </p>
            <form onSubmit={submitReview}>
              <div className="flex justify-center gap-2 mb-5">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      size={28}
                      className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}
                    />
                  </button>
                ))}
              </div>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your feedback..."
                rows={3}
                className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl p-3 text-xs sm:text-sm text-[#0A1930] focus:outline-none focus:border-[#FF8A00] mb-4"
              ></textarea>
              <button
                type="submit"
                disabled={submittingReview}
                className="w-full bg-[#FF8A00] hover:bg-[#E67A00] text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-all shadow-sm disabled:opacity-50"
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
