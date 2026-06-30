import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../config/api';
import { Clock, CheckCircle, ClipboardList, MapPin, Phone, Star, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function CustomerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
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
    
    if (user.role !== 'user') {
      navigate(user.role === 'admin' ? '/admin' : '/karigar');
      return;
    }

    fetchBookings();
  }, [user, navigate]);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/bookings/mybookings');
      // Fix: The backend returns an array directly in data, not data.data
      setBookings(data);
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
      fetchBookings(); // Refresh
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
      fetchBookings(); // Refresh to ensure state is updated
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Calculate Stats
  const activeBookings = bookings.filter(b => ['pending', 'confirmed', 'in-progress'].includes(b.status)).length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;
  const totalBookings = bookings.length;

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-poppins">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-gray-600 mt-1">Manage your service requests and bookings.</p>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="px-5 py-2.5 bg-white border border-gray-200 text-red-600 rounded-xl font-semibold shadow-sm hover:bg-red-50 hover:border-red-200 transition-all"
          >
            Logout
          </button>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Active Bookings" value={activeBookings} icon={<Clock className="w-6 h-6 text-blue-600" />} bg="bg-blue-50" />
          <StatCard title="Completed Services" value={completedBookings} icon={<CheckCircle className="w-6 h-6 text-green-600" />} bg="bg-green-50" />
          <StatCard title="Total Bookings" value={totalBookings} icon={<ClipboardList className="w-6 h-6 text-purple-600" />} bg="bg-purple-50" />
        </div>

        {/* Bookings List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Booking History</h2>
            <Link to="/find-karigar" className="text-sm font-semibold text-primary hover:text-primary-dark">
              + Book New Service
            </Link>
          </div>
          
          {bookings.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <ClipboardList className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Bookings Yet</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">You haven't made any service bookings yet. When you book a karigar, it will appear here.</p>
              <Link
                to="/find-karigar"
                className="px-8 py-3 bg-secondary text-white rounded-xl font-bold shadow-md hover:bg-orange-600 transition-all"
              >
                Book a Service Now
              </Link>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {bookings.slice().reverse().map((booking) => (
                <div key={booking._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-500 font-medium">
                        {new Date(booking.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} at {booking.time}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{booking.serviceType}</h3>
                    
                    <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold">
                          {booking.karigar?.name?.charAt(0)?.toUpperCase() || 'K'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{booking.karigar?.name || 'Unassigned'}</p>
                          {booking.karigar?.profession && <p className="text-xs text-gray-500">{booking.karigar.profession}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={18} className="text-gray-400" />
                        <span className="font-medium">{booking.address}</span>
                      </div>
                      {booking.karigar?.phone && (
                        <div className="flex items-center gap-2">
                          <Phone size={18} className="text-gray-400" />
                          <span className="font-medium">{booking.karigar.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex lg:flex-col gap-3 justify-end pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-100 mt-2 lg:mt-0">
                    {booking.status === 'pending' && (
                      <button
                        onClick={() => cancelBooking(booking._id)}
                        className="px-5 py-2.5 border-2 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 rounded-xl font-semibold transition-all w-full lg:w-auto text-center"
                      >
                        Cancel Booking
                      </button>
                    )}
                    {booking.status === 'completed' && (
                      <button
                        onClick={() => { setSelectedBooking(booking); setShowRateModal(true); }}
                        className="px-5 py-2.5 bg-primary text-white rounded-xl font-semibold shadow-md hover:bg-primary-dark transition-all w-full lg:w-auto text-center flex items-center justify-center gap-2"
                      >
                        <Star size={16} className="fill-current" />
                        Rate & Review
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Rating Modal */}
      {showRateModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
            <button 
              onClick={() => { setShowRateModal(false); setSelectedBooking(null); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-1">Rate your experience</h3>
            <p className="text-sm text-gray-500 mb-6">How was the service provided by {selectedBooking.karigar?.name || 'the karigar'}?</p>
            
            <form onSubmit={submitReview}>
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      size={40}
                      className={`${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
                    />
                  </button>
                ))}
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Leave a review (optional)</label>
                <textarea
                  rows="4"
                  className="w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Share details of your experience..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={submittingReview}
                className="w-full bg-secondary text-white py-3 rounded-xl font-bold shadow-md hover:bg-orange-600 transition-all disabled:opacity-70 flex justify-center items-center"
              >
                {submittingReview ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Submit Review'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Reusable Stat Card Component
const StatCard = ({ title, value, icon, bg }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${bg}`}>
      {icon}
    </div>
    <div>
      <h3 className="text-sm font-semibold text-gray-500 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);
