import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ClipboardList, ChevronDown, ChevronUp, MapPin } from 'lucide-react'
import api from '../../config/api'
import { formatPhone, getTelLink } from '../../utils/format'

const STATUS_BADGE = {
  pending: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  confirmed: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  completed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  cancelled: 'bg-red-500/15 text-red-400 border-red-500/30',
}

function BookingRow({ booking, karigars, onStatusChange, onReassign }) {
  const [expanded, setExpanded] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [selectedKarigar, setSelectedKarigar] = useState(booking.karigar?._id || '')

  const handleStatus = async (status) => {
    setUpdating(true)
    try {
      await onStatusChange(booking._id, status)
    } finally {
      setUpdating(false)
    }
  }

  const handleReassign = async () => {
    if (!selectedKarigar || selectedKarigar === booking.karigar?._id) return
    setUpdating(true)
    try {
      await onReassign(booking._id, selectedKarigar)
      alert('Booking reassigned successfully!')
    } catch (error) {
      alert('Failed to reassign booking')
    } finally {
      setUpdating(false)
    }
  }

  return (
    <>
      <tr className="hover:bg-slate-800/30 transition-colors cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <td className="px-4 py-3">
          <p className="text-white font-medium">{booking.customer?.fullName || '—'}</p>
          {booking.customer?.phone && (
            <a href={getTelLink(booking.customer.phone)} onClick={(e) => e.stopPropagation()} className="text-slate-500 text-xs hover:text-orange-400 transition-colors">
              {formatPhone(booking.customer.phone)}
            </a>
          )}
        </td>
        <td className="px-4 py-3 hidden md:table-cell">
          <p className="text-slate-300">{booking.karigar?.fullName || 'Unassigned'}</p>
          {booking.karigar?.phone && (
            <a href={getTelLink(booking.karigar.phone)} onClick={(e) => e.stopPropagation()} className="text-slate-500 text-xs hover:text-orange-400 transition-colors">
              {formatPhone(booking.karigar.phone)}
            </a>
          )}
        </td>
        <td className="px-4 py-3 text-slate-300 hidden sm:table-cell">{booking.serviceType}</td>
        <td className="px-4 py-3 text-slate-400 text-xs hidden lg:table-cell">
          {new Date(booking.createdAt).toLocaleString('en-PK', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
          })}
        </td>
        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
          <select
            value={booking.status}
            onChange={(e) => handleStatus(e.target.value)}
            disabled={updating}
            className={`text-xs px-2 py-1 rounded border bg-slate-900 font-semibold cursor-pointer focus:outline-none ${STATUS_BADGE[booking.status]} disabled:opacity-50`}
          >
            {['pending', 'confirmed', 'completed', 'cancelled'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </td>
        <td className="px-4 py-3 text-slate-500">
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </td>
      </tr>
      {expanded && (
        <tr className="bg-slate-800/30">
          <td colSpan={6} className="px-4 py-4 border-b border-slate-800">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-slate-300 font-semibold flex items-center gap-2">
                  <ClipboardList size={16} className="text-secondary" /> Job Details
                </h4>
                <div className="bg-slate-900 rounded-lg p-3 text-slate-400 text-sm border border-slate-700 whitespace-pre-wrap">
                  {booking.description || 'No specific description provided.'}
                </div>
                <div className="flex items-start gap-2 text-slate-400 text-sm mt-2">
                  <MapPin size={16} className="text-slate-500 shrink-0 mt-0.5" />
                  <span>{booking.address}</span>
                </div>
                <div className="text-slate-400 text-sm mt-2 pl-6">
                  <strong>Scheduled For:</strong> {new Date(booking.date).toLocaleDateString('en-PK')} at {booking.time}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-slate-300 font-semibold">Reassign Karigar</h4>
                <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                  <p className="text-xs text-slate-400 mb-2">Change the karigar assigned to this job. (Will reset status to pending)</p>
                  <div className="flex gap-2">
                    <select
                      value={selectedKarigar}
                      onChange={(e) => setSelectedKarigar(e.target.value)}
                      className="bg-slate-950 border border-slate-800 text-slate-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-secondary flex-1"
                    >
                      <option value="">Select a Karigar...</option>
                      {karigars.map(k => (
                        <option key={k._id} value={k._id}>{k.fullName} ({k.serviceType})</option>
                      ))}
                    </select>
                    <button
                      onClick={handleReassign}
                      disabled={updating || !selectedKarigar || selectedKarigar === booking.karigar?._id}
                      className="bg-secondary hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50 font-medium whitespace-nowrap"
                    >
                      {updating ? 'Wait...' : 'Reassign'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

export default function AdminBookings() {
  const [searchParams, setSearchParams] = useSearchParams()
  const statusFilter = searchParams.get('status') || ''
  const searchFilter = searchParams.get('search') || ''
  const pageFilter = parseInt(searchParams.get('page') || '1', 10)
  
  const [bookings, setBookings] = useState([])
  const [approvedKarigars, setApprovedKarigars] = useState([])
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [loading, setLoading] = useState(true)

  // Fetch approved karigars for reassignment dropdown
  useEffect(() => {
    api.get('/admin/karigars?status=approved').then(({ data }) => setApprovedKarigars(data))
  }, [])

  const fetchBookings = useCallback(() => {
    const params = new URLSearchParams()
    if (statusFilter) params.set('status', statusFilter)
    if (searchFilter) params.set('search', searchFilter)
    params.set('page', pageFilter)
    params.set('limit', '10')

    setLoading(true)
    api.get(`/admin/bookings?${params}`)
      .then(({ data }) => {
        if (data.data) {
          setBookings(data.data)
          setPagination({ page: data.page, pages: data.pages, total: data.total })
        } else {
          setBookings(data)
        }
      })
      .finally(() => setLoading(false))
  }, [statusFilter, searchFilter, pageFilter])

  useEffect(() => { fetchBookings() }, [fetchBookings])

  const handleStatusChange = async (id, status) => {
    await api.put(`/admin/bookings/${id}/status`, { status })
    setBookings((prev) => prev.map((b) => b._id === id ? { ...b, status } : b))
  }

  const handleReassign = async (id, karigarId) => {
    const { data } = await api.put(`/admin/bookings/${id}/reassign`, { karigarId })
    setBookings((prev) => prev.map((b) => b._id === id ? data.booking : b))
  }

  const setFilter = (key, value) => {
    const p = new URLSearchParams(searchParams)
    if (value) p.set(key, value)
    else p.delete(key)
    
    if (key !== 'page') p.delete('page')
    setSearchParams(p)
  }

  const [searchInput, setSearchInput] = useState(searchFilter)
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setFilter('search', searchInput)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white font-poppins">Bookings Oversight</h1>
        <p className="text-slate-400 text-sm mt-1">All platform bookings — update status, reassign karigars, resolve disputes</p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
          <input 
            type="text" 
            placeholder="Search service, customer, karigar, address..." 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-secondary flex-1 max-w-md"
          />
          <button type="submit" className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
            Search
          </button>
        </form>

        <div className="flex flex-wrap gap-3">
          <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
            {['', 'pending', 'confirmed', 'completed', 'cancelled'].map((s) => (
              <button key={s} onClick={() => setFilter('status', s)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${statusFilter === s ? 'bg-secondary text-white' : 'text-slate-400 hover:text-white'}`}>
                {s || 'All Status'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl h-14 animate-pulse" />)}</div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <ClipboardList size={40} className="mx-auto mb-3 opacity-30" />
          <p>No bookings found</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/50">
                  <th className="text-left text-slate-500 font-semibold px-4 py-3 text-xs uppercase tracking-wide">Customer</th>
                  <th className="text-left text-slate-500 font-semibold px-4 py-3 text-xs uppercase tracking-wide hidden md:table-cell">Karigar</th>
                  <th className="text-left text-slate-500 font-semibold px-4 py-3 text-xs uppercase tracking-wide hidden sm:table-cell">Service</th>
                  <th className="text-left text-slate-500 font-semibold px-4 py-3 text-xs uppercase tracking-wide hidden lg:table-cell">Requested Time</th>
                  <th className="text-left text-slate-500 font-semibold px-4 py-3 text-xs uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {bookings.map((b) => (
                  <BookingRow 
                    key={b._id} 
                    booking={b} 
                    karigars={approvedKarigars} 
                    onStatusChange={handleStatusChange} 
                    onReassign={handleReassign}
                  />
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800 bg-slate-950/50">
              <span className="text-sm text-slate-500">
                Showing page {pagination.page} of {pagination.pages} ({pagination.total} total)
              </span>
              <div className="flex gap-2">
                <button 
                  disabled={pagination.page <= 1}
                  onClick={() => setFilter('page', (pagination.page - 1).toString())}
                  className="px-3 py-1 rounded bg-slate-800 text-slate-300 text-sm disabled:opacity-50 hover:bg-slate-700"
                >
                  Prev
                </button>
                <button 
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => setFilter('page', (pagination.page + 1).toString())}
                  className="px-3 py-1 rounded bg-slate-800 text-slate-300 text-sm disabled:opacity-50 hover:bg-slate-700"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
