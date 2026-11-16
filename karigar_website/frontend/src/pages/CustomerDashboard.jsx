import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import api from '../config/api'
import { Clock, CheckCircle2, ClipboardList, MapPin, Phone, Star, X, LayoutDashboard, Calendar, Heart, MessageSquare, Settings, Bell, LogOut, ArrowRight, Bookmark, Headphones, AlertCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'
import BrandLogo from '../components/BrandLogo'
import UserAvatar from '../components/UserAvatar'

export default function CustomerDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeMenu, setActiveMenu] = useState('dashboard') // 'dashboard', 'bookings', 'saved', 'reviews', 'settings'
  const [bookingFilter, setBookingFilter] = useState('all') // 'all', 'upcoming', 'past'

  // Rating Modal State
  const [showRateModal, setShowRateModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [rating, setRating] = useState(5)
  const [review, setReview] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    
    if (user.role !== 'customer') {
      navigate(user.role === 'admin' ? '/admin' : '/karigar')
      return
    }

    fetchBookings()
  }, [user, navigate])

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/bookings/mybookings')
      setBookings(Array.isArray(data) ? data : [])
    } catch (error) {
      console.warn('Error fetching bookings:', error)
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  const cancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return
    try {
      await api.patch(`/bookings/${id}/cancel`)
      toast.success('Booking cancelled successfully')
      fetchBookings()
    } catch (error) {
      toast.error('Could not cancel booking. ' + (error.response?.data?.message || ''))
    }
  }

  const submitReview = async (e) => {
    e.preventDefault()
    if (!selectedBooking) return
    
    setSubmittingReview(true)
    try {
      await api.post(`/bookings/${selectedBooking._id}/rate`, { rating, review })
      toast.success('Review submitted successfully!')
      setShowRateModal(false)
      setReview('')
      setRating(5)
      fetchBookings()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review')
    } finally {
      setSubmittingReview(false)
    }
  }

  // Calculate Real Stats from API Data
  const inProgressBookings = bookings.filter(b => ['pending', 'confirmed', 'in-progress'].includes(b.status)).length
  const completedBookings = bookings.filter(b => b.status === 'completed').length
  const totalBookings = bookings.length

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-50 text-[#22C55E] border-emerald-200'
      case 'in-progress':
        return 'bg-amber-50 text-[#FF7A00] border-amber-200'
      case 'completed':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'cancelled':
        return 'bg-red-50 text-red-600 border-red-200'
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200'
    }
  }

  const formatStatus = (status) => {
    if (status === 'in-progress') return 'In Progress'
    if (status === 'confirmed') return 'Confirmed'
    if (status === 'completed') return 'Completed'
    if (status === 'cancelled') return 'Cancelled'
    return 'Pending'
  }

  const upcomingBookings = bookings.filter(b => ['pending', 'confirmed', 'in-progress'].includes(b.status))
  const pastBookings = bookings.filter(b => ['completed', 'cancelled'].includes(b.status))

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'bookings', label: 'My Bookings', icon: Calendar },
    { id: 'saved', label: 'Saved Businesses', icon: Bookmark },
    { id: 'favorites', label: 'Favourites', icon: Heart },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare },
    { id: 'settings', label: 'Profile Settings', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'support', label: 'Support', icon: Headphones }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FB]">
        <div className="w-12 h-12 border-4 border-[#FF7A00] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#0E1E3A]">
      <div className="max-w-[1240px] mx-auto py-6 sm:py-8 px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* LEFT SIDEBAR: Navy Dark matching Reference 2 "User Dashboard" */}
          <div className="md:col-span-3 bg-[#061530] rounded-3xl p-5 text-white shadow-xl">
            {/* Sidebar Logo */}
            <div className="pb-5 border-b border-white/10 mb-4 px-2">
              <BrandLogo variant="dark" size="sm" />
            </div>

            {/* User Profile Mini */}
            <div className="flex items-center gap-3 px-2 py-3 mb-4 bg-white/5 rounded-2xl border border-white/10">
              <div className="w-10 h-10 rounded-full bg-[#FF7A00] flex items-center justify-center text-white font-black text-sm">
                {user.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-xs text-white truncate">{user.name || 'Customer'}</p>
                <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
              </div>
            </div>

            {/* Menu Links */}
            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = activeMenu === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveMenu(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                      isActive
                        ? 'bg-[#FF7A00] text-white shadow-md shadow-orange-500/20'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Logout Button */}
            <div className="pt-4 mt-6 border-t border-white/10">
              <button
                onClick={() => {
                  logout()
                  navigate('/')
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors"
              >
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* RIGHT CONTENT AREA */}
          <div className="md:col-span-9 space-y-6">
            
            {activeMenu === 'dashboard' ? (
              <>
                {/* Dashboard Home Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="font-poppins text-2xl sm:text-3xl font-extrabold text-[#0A1F44]">
                      My Dashboard
                    </h1>
                    <p className="text-xs text-[#5A6B84] mt-0.5">
                      Welcome back, {user.name}! Overview of your verified bookings.
                    </p>
                  </div>
                  <Link
                    to="/find-karigar"
                    className="hidden sm:inline-flex items-center gap-1.5 bg-[#FF7A00] hover:bg-[#F06400] text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md shadow-orange-500/20"
                  >
                    <span>Book New Service</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>

                {/* 3 Pastel Stat Cards (Sky Blue, Orange, Mint Green - Reference 2) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  {/* Total Bookings Card (Sky Blue Tint) */}
                  <div className="bg-[#EBF5FF] border border-[#D0E7FF] rounded-2xl p-5 shadow-sm">
                    <span className="text-xs font-bold text-[#1E429F] block mb-1">Total Bookings</span>
                    <span className="font-poppins font-black text-3xl text-[#1E429F] block">
                      {totalBookings}
                    </span>
                  </div>

                  {/* In Progress Card (Orange Tint) */}
                  <div className="bg-[#FFF8F0] border border-[#FFE4CC] rounded-2xl p-5 shadow-sm">
                    <span className="text-xs font-bold text-[#C25E00] block mb-1">In Progress</span>
                    <span className="font-poppins font-black text-3xl text-[#FF7A00] block">
                      {inProgressBookings}
                    </span>
                  </div>

                  {/* Completed Card (Mint Green Tint) */}
                  <div className="bg-[#EAF8F1] border border-[#C6F0DB] rounded-2xl p-5 shadow-sm">
                    <span className="text-xs font-bold text-[#0E7044] block mb-1">Completed</span>
                    <span className="font-poppins font-black text-3xl text-[#22C55E] block">
                      {completedBookings}
                    </span>
                  </div>

                </div>

                {/* Recent Bookings List Card */}
                <div className="bg-white border border-[#E4EAF2] rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-poppins font-bold text-base sm:text-lg text-[#0A1F44]">
                      Recent Bookings
                    </h2>
                    <button
                      type="button"
                      onClick={() => setActiveMenu('bookings')}
                      className="text-xs font-bold text-[#0A1F44] hover:text-[#FF7A00] inline-flex items-center gap-1 transition-colors"
                    >
                      <span>View All</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>

                  {bookings.length > 0 ? (
                    <div className="space-y-3">
                      {bookings.slice(0, 5).map((b) => (
                        <div
                          key={b._id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#F7F9FC] border border-[#E4EAF2] hover:border-gray-300 transition-all"
                        >
                          <div className="flex items-center gap-3.5">
                            <UserAvatar
                              src={b.karigar?.profilePhoto}
                              name={b.karigar?.fullName || 'Karigar'}
                              className="w-12 h-12 rounded-xl object-cover bg-[#0A1F44]"
                              textClassName="text-sm font-bold text-white"
                            />
                            <div>
                              <h4 className="font-poppins font-bold text-sm text-[#0A1F44]">
                                {b.karigar?.fullName || 'Assigned Karigar'}
                              </h4>
                              <p className="text-xs text-[#5A6B84]">
                                {b.serviceType} • {b.address || 'Address provided'}
                              </p>
                              <div className="flex items-center gap-2 mt-1 text-[11px] text-[#5A6B84]">
                                <Calendar size={12} className="text-[#FF7A00]" />
                                <span>{b.date || 'Scheduled'} at {b.time || '10:00 AM'}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center">
                            <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${getStatusBadge(b.status)}`}>
                              {formatStatus(b.status)}
                            </span>
                            {b.status === 'completed' && !b.isRated && (
                              <button
                                onClick={() => {
                                  setSelectedBooking(b)
                                  setShowRateModal(true)
                                }}
                                className="bg-[#FF7A00] hover:bg-[#F06400] text-white text-[11px] font-bold px-3 py-1 rounded-lg"
                              >
                                Rate
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center">
                      <div className="w-14 h-14 rounded-full bg-orange-50 text-[#FF7A00] flex items-center justify-center mx-auto mb-3">
                        <Calendar size={26} />
                      </div>
                      <h3 className="font-poppins font-bold text-sm text-[#0A1F44] mb-1">
                        No Bookings Yet
                      </h3>
                      <p className="text-xs text-[#5A6B84] mb-4">
                        You have not placed any service orders yet. Browse verified technicians across your city!
                      </p>
                      <Link
                        to="/find-karigar"
                        className="inline-flex items-center gap-1.5 bg-[#FF7A00] hover:bg-[#F06400] text-white font-bold text-xs px-5 py-2.5 rounded-full transition-all shadow-md"
                      >
                        <span>Find a Karigar</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* MY BOOKINGS TAB (Grouped Upcoming / Past) */
              <div className="bg-white border border-[#E4EAF2] rounded-3xl p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="font-poppins font-bold text-xl text-[#0A1F44]">
                      My Bookings
                    </h2>
                    <p className="text-xs text-[#5A6B84] mt-0.5">
                      All your active and completed service history
                    </p>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setBookingFilter('all')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                        bookingFilter === 'all'
                          ? 'bg-[#0A1F44] text-white'
                          : 'bg-[#F7F9FC] text-[#5A6B84] hover:text-[#0A1F44]'
                      }`}
                    >
                      All ({bookings.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setBookingFilter('upcoming')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                        bookingFilter === 'upcoming'
                          ? 'bg-[#0A1F44] text-white'
                          : 'bg-[#F7F9FC] text-[#5A6B84] hover:text-[#0A1F44]'
                      }`}
                    >
                      Upcoming ({upcomingBookings.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setBookingFilter('past')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                        bookingFilter === 'past'
                          ? 'bg-[#0A1F44] text-white'
                          : 'bg-[#F7F9FC] text-[#5A6B84] hover:text-[#0A1F44]'
                      }`}
                    >
                      Past ({pastBookings.length})
                    </button>
                  </div>
                </div>

                {/* Bookings List */}
                {((bookingFilter === 'upcoming' ? upcomingBookings : bookingFilter === 'past' ? pastBookings : bookings)).length > 0 ? (
                  <div className="space-y-4">
                    {((bookingFilter === 'upcoming' ? upcomingBookings : bookingFilter === 'past' ? pastBookings : bookings)).map((b) => (
                      <div
                        key={b._id}
                        className="p-5 rounded-2xl bg-[#F7F9FC] border border-[#E4EAF2] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-start gap-4">
                          <UserAvatar
                            src={b.karigar?.profilePhoto}
                            name={b.karigar?.fullName || 'Karigar'}
                            className="w-14 h-14 rounded-2xl object-cover bg-[#0A1F44]"
                            textClassName="text-base font-bold text-white"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-poppins font-bold text-sm sm:text-base text-[#0A1F44]">
                                {b.karigar?.fullName || 'Assigned Karigar'}
                              </h4>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(b.status)}`}>
                                {formatStatus(b.status)}
                              </span>
                            </div>
                            <p className="text-xs text-[#5A6B84] mt-0.5">
                              {b.serviceType} • {b.address}
                            </p>
                            <p className="text-xs font-semibold text-[#0A1F44] mt-1">
                              📅 {b.date} ({b.time}) • Total: <span className="text-[#FF7A00] font-black">PKR {b.totalAmount || 550}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          {['pending', 'confirmed'].includes(b.status) && (
                            <button
                              type="button"
                              onClick={() => cancelBooking(b._id)}
                              className="text-xs text-red-600 hover:text-red-700 font-bold px-3 py-1.5 rounded-xl border border-red-200 hover:bg-red-50 transition-colors"
                            >
                              Cancel Booking
                            </button>
                          )}
                          {b.status === 'completed' && !b.isRated && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedBooking(b)
                                setShowRateModal(true)
                              }}
                              className="text-xs text-white bg-[#FF7A00] hover:bg-[#F06400] font-bold px-4 py-1.5 rounded-xl shadow-sm transition-all"
                            >
                              Rate Service
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-10 text-center text-xs text-[#5A6B84]">
                    No bookings found under this filter.
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      </div>

      {/* RATING MODAL */}
      {showRateModal && selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setShowRateModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-[#0A1F44]"
            >
              <X size={20} />
            </button>

            <h3 className="font-poppins font-bold text-lg text-[#0A1F44] mb-1">
              Rate Your Experience
            </h3>
            <p className="text-xs text-[#5A6B84] mb-4">
              How was the service provided by {selectedBooking.karigar?.fullName || 'the technician'}?
            </p>

            <form onSubmit={submitReview} className="space-y-4">
              <div className="flex items-center justify-center gap-2 py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      size={28}
                      className={star <= rating ? 'fill-[#FFB800] text-[#FFB800]' : 'text-gray-300'}
                    />
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0A1F44] mb-1">
                  Your Review (Optional)
                </label>
                <textarea
                  rows={3}
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Share details about punctuality, skill, and professionalism..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E4EAF2] bg-[#F7F9FC] text-[#0E1E3A] focus:outline-none focus:border-[#FF7A00] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="w-full bg-[#FF7A00] hover:bg-[#F06400] text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md"
              >
                {submittingReview ? 'Submitting...' : 'Submit Rating'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
