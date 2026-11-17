import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import api from '../config/api'
import {
  Clock, CheckCircle2, ClipboardList, MapPin, Phone, Star, X,
  LayoutDashboard, Calendar, Heart, MessageSquare, Settings, Bell,
  LogOut, ArrowRight, Bookmark, Headphones, AlertCircle, Trash2,
  ExternalLink, ShieldCheck, Mail
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import BrandLogo from '../components/BrandLogo'
import UserAvatar from '../components/UserAvatar'
import RatingBadge from '../components/RatingBadge'
import { getFavorites, removeFavorite } from '../utils/favorites'
import { SITE_PHONE_DISPLAY, SITE_PHONE_E164, SITE_PHONE_WA, SITE_EMAIL } from '../config/site'

export default function CustomerDashboard() {
  const { user, logout, updateUser, setUser } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [savedBusinesses, setSavedBusinesses] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeMenu, setActiveMenu] = useState('dashboard') // 'dashboard' | 'bookings' | 'saved' | 'favorites' | 'reviews' | 'settings' | 'notifications' | 'support'
  const [bookingFilter, setBookingFilter] = useState('all') // 'all' | 'upcoming' | 'past'

  // Profile Settings Form State
  const [profileForm, setProfileForm] = useState({
    name: user?.fullName || user?.name || '',
    phone: user?.phone || '',
    city: user?.city || user?.address || 'Karachi'
  })
  const [savingProfile, setSavingProfile] = useState(false)

  // Keep form in sync when user state hydrates
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.fullName || user.name || '',
        phone: user.phone || '',
        city: user.city || user.address || 'Karachi'
      })
    }
  }, [user])

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
    loadSavedBusinesses()

    const handleFavChange = () => {
      loadSavedBusinesses()
    }
    window.addEventListener('karigar_favorites_changed', handleFavChange)
    return () => window.removeEventListener('karigar_favorites_changed', handleFavChange)
  }, [user, navigate])

  const loadSavedBusinesses = () => {
    setSavedBusinesses(getFavorites())
  }

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

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setSavingProfile(true)
    try {
      const payload = {
        name: profileForm.name.trim(),
        fullName: profileForm.name.trim(),
        phone: profileForm.phone.trim(),
        city: profileForm.city,
        address: profileForm.city
      }
      const { data } = await api.put('/auth/profile', payload)
      const mergedUser = {
        ...user,
        ...data,
        fullName: data.fullName || data.name || profileForm.name.trim(),
        name: data.fullName || data.name || profileForm.name.trim(),
        phone: data.phone || profileForm.phone.trim(),
        city: data.city || profileForm.city
      }
      if (updateUser) {
        updateUser(mergedUser)
      } else if (setUser) {
        localStorage.setItem('karigarUser', JSON.stringify(mergedUser))
        setUser(mergedUser)
      }
      toast.success('Profile updated successfully!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setSavingProfile(false)
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
  const displayName = user?.fullName || user?.name || (user?.email ? user.email.split('@')[0] : 'User')

  // Navy Sidebar Menu Items
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'bookings', label: 'My Bookings', icon: Calendar, badge: totalBookings },
    { id: 'saved', label: 'Saved / Favourites', icon: Heart, badge: savedBusinesses.length },
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
    <div className="min-h-screen bg-[#F5F7FB] text-[#0E1E3A] pb-28 md:pb-8">
      <div className="max-w-[1280px] mx-auto py-4 sm:py-8 px-4 sm:px-6">
        
        {/* Mobile Header Banner (< md) */}
        <div className="md:hidden mb-4 bg-white rounded-2xl border border-[#E4EAF2] p-3.5 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-[#0A1F44] text-[#FF7A00] flex items-center justify-center font-black text-sm flex-shrink-0 shadow-xs">
              {displayName[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <h2 className="font-poppins font-bold text-sm text-[#0A1F44] truncate">{displayName}</h2>
              <p className="text-[11px] text-[#5A6B84] truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => {
              logout()
              navigate('/')
            }}
            className="flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-600 bg-red-50 px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer flex-shrink-0"
          >
            <LogOut size={13} />
            <span>Logout</span>
          </button>
        </div>

        {/* Mobile Horizontal Navigation Tabs (< md) */}
        <div className="md:hidden flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 mb-5 -mx-4 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeMenu === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#0A1F44] text-white shadow-sm'
                    : 'bg-white border border-[#E4EAF2] text-[#5A6B84] hover:text-[#0A1F44]'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-[#FF7A00]' : ''} />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    isActive ? 'bg-[#FF7A00] text-white' : 'bg-gray-100 text-[#0A1F44]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* LEFT SIDEBAR: Navy Dark matching Reference Design (Desktop only) */}
          <div className="hidden md:block md:col-span-3 bg-[#061530] rounded-3xl p-5 text-white shadow-xl sticky top-20">
            {/* Sidebar Logo */}
            <div className="pb-4 border-b border-white/10 mb-4 px-2">
              <BrandLogo variant="dark" size="sm" />
            </div>

            {/* User Profile Mini */}
            <div className="flex items-center gap-3 px-2 py-3 mb-4 bg-white/5 rounded-2xl border border-white/10">
              <div className="w-10 h-10 rounded-full bg-[#FF7A00] flex items-center justify-center text-white font-black text-sm">
                {displayName[0].toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-xs text-white truncate">{displayName}</p>
                <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
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
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
                      isActive
                        ? 'bg-[#FF7A00] text-white shadow-md shadow-orange-500/20'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-white text-[#FF7A00]' : 'bg-white/10 text-gray-300'
                      }`}>
                        {item.badge}
                      </span>
                    )}
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
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* RIGHT CONTENT AREA */}
          <div className="md:col-span-9 space-y-6">
            
            {/* 1. DASHBOARD HOME VIEW */}
            {activeMenu === 'dashboard' && (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="font-poppins text-2xl sm:text-3xl font-extrabold text-[#0A1F44]">
                      My Dashboard
                    </h1>
                    <p className="text-xs text-[#5A6B84] mt-0.5">
                      Welcome back, {displayName}! Overview of your verified bookings.
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

                {/* 3 Pastel Stat Cards from Real API Data */}
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
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono font-bold text-[11px] bg-orange-50 text-[#FF7A00] px-1.5 py-0.5 rounded-md border border-orange-200">
                                  {b.bookingReference || (b._id ? `BK-${b._id.slice(-6).toUpperCase()}` : 'BK-N/A')}
                                </span>
                                <h4 className="font-poppins font-bold text-sm text-[#0A1F44]">
                                  {b.karigar?.fullName || 'Karigar'}
                                </h4>
                              </div>
                              <p className="text-xs text-[#5A6B84]">
                                {b.serviceType} • {b.address || 'Address provided'}
                              </p>
                              <div className="flex items-center gap-2 mt-1 text-[11px] text-[#5A6B84]">
                                <Calendar size={12} className="text-[#FF7A00]" />
                                <span>{b.date ? new Date(b.date).toLocaleDateString() : 'Scheduled'} at {b.time || 'Scheduled'}</span>
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
                                className="bg-[#FF7A00] hover:bg-[#F06400] text-white text-[11px] font-bold px-3 py-1 rounded-lg transition-colors"
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
            )}

            {/* 2. MY BOOKINGS VIEW (Grouped Upcoming / Past + Cancel Action) */}
            {activeMenu === 'bookings' && (
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
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono font-bold text-xs bg-orange-50 text-[#FF7A00] px-2 py-0.5 rounded-lg border border-orange-200">
                                {b.bookingReference || (b._id ? `BK-${b._id.slice(-6).toUpperCase()}` : 'BK-N/A')}
                              </span>
                              <h4 className="font-poppins font-bold text-sm sm:text-base text-[#0A1F44]">
                                {b.karigar?.fullName || 'Karigar'}
                              </h4>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(b.status)}`}>
                                {formatStatus(b.status)}
                              </span>
                            </div>
                            <p className="text-xs text-[#5A6B84] mt-0.5">
                              {b.serviceType} • {b.address}
                            </p>
                            <p className="text-xs font-semibold text-[#0A1F44] mt-1">
                              📅 {b.date ? new Date(b.date).toLocaleDateString() : 'Scheduled'} ({b.time || 'Scheduled'}) • Total: <span className="text-[#FF7A00] font-black">PKR {b.totalAmount || (b.karigar?.hourlyRate ? b.karigar.hourlyRate + 50 : 550)}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          {['pending', 'confirmed'].includes(b.status) && (
                            <button
                              type="button"
                              onClick={() => cancelBooking(b._id)}
                              className="text-xs text-red-600 hover:text-red-700 font-bold px-3 py-1.5 rounded-xl border border-red-200 hover:bg-red-50 transition-colors cursor-pointer"
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
                              className="text-xs text-white bg-[#FF7A00] hover:bg-[#F06400] font-bold px-4 py-1.5 rounded-xl shadow-sm transition-all cursor-pointer"
                            >
                              Rate Service
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-xs text-[#5A6B84]">
                    No bookings found under this filter.
                  </div>
                )}
              </div>
            )}

            {/* 3 & 4. SAVED BUSINESSES & FAVOURITES VIEW */}
            {(activeMenu === 'saved' || activeMenu === 'favorites') && (
              <div className="bg-white border border-[#E4EAF2] rounded-3xl p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="font-poppins font-bold text-xl text-[#0A1F44]">
                      Saved / Favourites
                    </h2>
                    <p className="text-xs text-[#5A6B84] mt-0.5">
                      Your bookmarked service professionals and local business directory listings
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#FF7A00] bg-orange-50 px-3 py-1 rounded-full">
                    {savedBusinesses.length} Saved
                  </span>
                </div>

                {savedBusinesses.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {savedBusinesses.map((item) => {
                      const id = item.id || item._id
                      const isKarigar = item.type === 'karigar'
                      const targetUrl = isKarigar ? `/worker/${id}` : `/listing/${id}`

                      return (
                        <div
                          key={id}
                          className="p-4 rounded-2xl bg-[#F7F9FC] border border-[#E4EAF2] flex flex-col justify-between hover:border-gray-300 transition-all"
                        >
                          <div>
                            <div className="flex items-start gap-3.5 mb-3">
                              <img
                                src={item.photo || '/assets/images/electrician_work.webp'}
                                alt={item.name}
                                className="w-14 h-14 rounded-xl object-cover bg-[#0A1F44] flex-shrink-0"
                                onError={(e) => {
                                  e.target.onerror = null
                                  e.target.src = '/assets/images/electrician_work.webp'
                                }}
                              />
                              <div className="min-w-0 flex-1">
                                <h4 className="font-poppins font-bold text-sm text-[#0A1F44] truncate" title={item.name}>
                                  {item.name}
                                </h4>
                                <p className="text-xs text-[#5A6B84] truncate">
                                  {item.service}
                                </p>
                                <div className="flex items-center gap-1 text-[11px] text-[#5A6B84] mt-1 truncate">
                                  <MapPin size={11} className="text-[#FF7A00] flex-shrink-0" />
                                  <span className="truncate">{item.area ? `${item.area}, ` : ''}{item.city}</span>
                                </div>
                              </div>

                              {/* Remove Heart Button */}
                              <button
                                type="button"
                                onClick={() => removeFavorite(id)}
                                className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-red-500 hover:bg-red-50 border border-gray-100 shadow-xs flex-shrink-0"
                                title="Remove from saved"
                              >
                                <Heart size={14} className="fill-red-500" />
                              </button>
                            </div>
                          </div>

                          {/* Quick Actions Bar */}
                          <div className="pt-3 border-t border-[#E4EAF2] flex items-center gap-2">
                            {isKarigar ? (
                              <Link
                                to={`/book?karigarId=${id}&service=${encodeURIComponent(item.service)}`}
                                className="flex-1 bg-[#FF7A00] hover:bg-[#F06400] text-white text-xs font-bold py-2 px-3 rounded-xl text-center shadow-xs transition-colors"
                              >
                                Book Now
                              </Link>
                            ) : item.phone ? (
                              <a
                                href={`tel:${item.phone}`}
                                className="flex-1 bg-[#0A1F44] hover:bg-[#102747] text-white text-xs font-bold py-2 px-3 rounded-xl text-center shadow-xs transition-colors flex items-center justify-center gap-1"
                              >
                                <Phone size={12} />
                                <span>Call {item.phone}</span>
                              </a>
                            ) : null}

                            <Link
                              to={targetUrl}
                              className="px-3 py-2 rounded-xl border border-gray-200 hover:border-gray-300 bg-white text-[#0A1F44] text-xs font-bold transition-colors inline-flex items-center gap-1"
                            >
                              <span>Profile</span>
                              <ExternalLink size={12} />
                            </Link>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-3">
                      <Heart size={26} />
                    </div>
                    <h3 className="font-poppins font-bold text-sm text-[#0A1F44] mb-1">
                      No Saved Businesses Yet
                    </h3>
                    <p className="text-xs text-[#5A6B84] mb-4 max-w-sm mx-auto">
                      Click the heart icon on any service card or directory listing to save it here for instant one-click booking and contact.
                    </p>
                    <Link
                      to="/find-karigar"
                      className="inline-flex items-center gap-1.5 bg-[#FF7A00] hover:bg-[#F06400] text-white font-bold text-xs px-5 py-2.5 rounded-full transition-all shadow-md"
                    >
                      <span>Explore Businesses</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* 5. REVIEWS VIEW */}
            {activeMenu === 'reviews' && (
              <div className="bg-white border border-[#E4EAF2] rounded-3xl p-6 sm:p-8 shadow-sm">
                <div className="mb-6">
                  <h2 className="font-poppins font-bold text-xl text-[#0A1F44]">
                    My Reviews
                  </h2>
                  <p className="text-xs text-[#5A6B84] mt-0.5">
                    Reviews and ratings you have shared for service professionals
                  </p>
                </div>

                {bookings.filter(b => b.isRated).length > 0 ? (
                  <div className="space-y-4">
                    {bookings.filter(b => b.isRated).map((b) => (
                      <div
                        key={b._id}
                        className="p-5 rounded-2xl bg-[#F7F9FC] border border-[#E4EAF2] space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-[#0A1F44]">
                            {b.karigar?.fullName || 'Karigar'}
                          </h4>
                          <div className="flex items-center gap-1 text-[#FF7A00]">
                            <Star size={14} className="fill-[#FF7A00]" />
                            <span className="text-xs font-bold text-[#0A1F44]">{b.rating || 5}.0</span>
                          </div>
                        </div>
                        <p className="text-xs text-[#5A6B84]">
                          {b.serviceType} • Completed on {b.date ? new Date(b.date).toLocaleDateString() : 'Date'}
                        </p>
                        {b.review && (
                          <p className="text-xs text-[#0E1E3A] italic bg-white p-3 rounded-xl border border-gray-100">
                            "{b.review}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-xs text-[#5A6B84]">
                    <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                      <MessageSquare size={26} />
                    </div>
                    <h3 className="font-poppins font-bold text-sm text-[#0A1F44] mb-1">
                      No Reviews Yet
                    </h3>
                    <p className="max-w-xs mx-auto text-xs text-[#5A6B84]">
                      When your completed service bookings are finished, you can rate and leave feedback here.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 6. PROFILE SETTINGS VIEW */}
            {activeMenu === 'settings' && (
              <div className="bg-white border border-[#E4EAF2] rounded-3xl p-6 sm:p-8 shadow-sm">
                <div className="mb-6">
                  <h2 className="font-poppins font-bold text-xl text-[#0A1F44]">
                    Profile Settings
                  </h2>
                  <p className="text-xs text-[#5A6B84] mt-0.5">
                    Manage your personal account details and communication preferences
                  </p>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-lg">
                  <div>
                    <label className="block text-xs font-bold text-[#0A1F44] mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      required
                      className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E4EAF2] bg-[#F7F9FC] text-[#0E1E3A] focus:outline-none focus:border-[#FF7A00]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0A1F44] mb-1.5">
                      Email Address (Read Only)
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E4EAF2] bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0A1F44] mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      placeholder="0300-1234567"
                      className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E4EAF2] bg-[#F7F9FC] text-[#0E1E3A] focus:outline-none focus:border-[#FF7A00]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0A1F44] mb-1.5">
                      Preferred City
                    </label>
                    <input
                      type="text"
                      value={profileForm.city}
                      onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                      placeholder="e.g. Lahore, Karachi, Islamabad"
                      className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E4EAF2] bg-[#F7F9FC] text-[#0E1E3A] focus:outline-none focus:border-[#FF7A00]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="bg-[#FF7A00] hover:bg-[#F06400] text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-all shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {savingProfile ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {/* 7. NOTIFICATIONS VIEW */}
            {activeMenu === 'notifications' && (
              <div className="bg-white border border-[#E4EAF2] rounded-3xl p-6 sm:p-8 shadow-sm">
                <div className="mb-6">
                  <h2 className="font-poppins font-bold text-xl text-[#0A1F44]">
                    Notifications
                  </h2>
                  <p className="text-xs text-[#5A6B84] mt-0.5">
                    Real-time updates regarding your service bookings and account alerts
                  </p>
                </div>

                {bookings.length > 0 ? (
                  <div className="space-y-3">
                    {bookings.map((b) => (
                      <div
                        key={b._id}
                        className="p-4 rounded-2xl bg-[#F7F9FC] border border-[#E4EAF2] flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                            <Bell size={18} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#0A1F44]">
                              Booking Status: {formatStatus(b.status)}
                            </p>
                            <p className="text-[11px] text-[#5A6B84]">
                              Your appointment for {b.serviceType} with {b.karigar?.fullName || 'Karigar'} is currently {formatStatus(b.status).toLowerCase()}.
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap">
                          {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : 'Recent'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-xs text-[#5A6B84]">
                    <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                      <Bell size={26} />
                    </div>
                    <h3 className="font-poppins font-bold text-sm text-[#0A1F44] mb-1">
                      No Notifications
                    </h3>
                    <p>You have no pending notifications at this time.</p>
                  </div>
                )}
              </div>
            )}

            {/* 8. SUPPORT VIEW */}
            {activeMenu === 'support' && (
              <div className="bg-white border border-[#E4EAF2] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <h2 className="font-poppins font-bold text-xl text-[#0A1F44]">
                    Customer Help & Support
                  </h2>
                  <p className="text-xs text-[#5A6B84] mt-0.5">
                    Need help with a booking or a technician? We're available 24/7 across Pakistan.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Phone Helpline */}
                  <div className="p-5 rounded-2xl bg-[#F7F9FC] border border-[#E4EAF2] text-center space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF7A00] flex items-center justify-center mx-auto">
                      <Phone size={18} />
                    </div>
                    <h4 className="font-bold text-sm text-[#0A1F44]">Call Helpline</h4>
                    <p className="text-[11px] text-[#5A6B84]">Direct customer care assistance</p>
                    <a
                      href={`tel:${SITE_PHONE_E164}`}
                      className="inline-block text-xs font-extrabold text-[#FF7A00] hover:underline"
                    >
                      {SITE_PHONE_DISPLAY}
                    </a>
                  </div>

                  {/* WhatsApp Support */}
                  <div className="p-5 rounded-2xl bg-[#F7F9FC] border border-[#E4EAF2] text-center space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#22C55E] flex items-center justify-center mx-auto">
                      <Headphones size={18} />
                    </div>
                    <h4 className="font-bold text-sm text-[#0A1F44]">WhatsApp Help</h4>
                    <p className="text-[11px] text-[#5A6B84]">Instant messaging support</p>
                    <a
                      href={`https://wa.me/${SITE_PHONE_WA}?text=${encodeURIComponent('Hello KarigarPK Support, I need help with my booking.')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-xs font-extrabold text-[#22C55E] hover:underline"
                    >
                      Chat on WhatsApp →
                    </a>
                  </div>

                  {/* Email Support */}
                  <div className="p-5 rounded-2xl bg-[#F7F9FC] border border-[#E4EAF2] text-center space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                      <Mail size={18} />
                    </div>
                    <h4 className="font-bold text-sm text-[#0A1F44]">Email Us</h4>
                    <p className="text-[11px] text-[#5A6B84]">Queries, feedback, and disputes</p>
                    <a
                      href={`mailto:${SITE_EMAIL}`}
                      className="inline-block text-xs font-extrabold text-blue-600 hover:underline"
                    >
                      {SITE_EMAIL}
                    </a>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs text-[#0A1F44] flex items-center gap-3">
                  <ShieldCheck size={20} className="text-[#FF7A00] flex-shrink-0" />
                  <span>
                    <strong>Customer Satisfaction Guarantee:</strong> All bookings through KarigarPK are subject to verified rate cards. Never pay more than the agreed total amount shown in your booking summary.
                  </span>
                </div>
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
                className="w-full bg-[#FF7A00] hover:bg-[#F06400] text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md cursor-pointer"
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
