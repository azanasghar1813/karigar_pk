import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, ClipboardList, PhoneCall, Clock, CheckCircle, XCircle, TrendingUp, ArrowRight } from 'lucide-react'
import api from '../../config/api'

function StatCard({ icon: Icon, label, value, sub, color, to }) {
  const card = (
    <div className={`bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-600 transition-all group ${to ? 'cursor-pointer' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
        {to && <ArrowRight size={16} className="text-slate-600 group-hover:text-slate-400 transition-colors" />}
      </div>
      <p className="text-2xl font-bold text-white font-poppins">{value ?? '—'}</p>
      <p className="text-slate-400 text-sm mt-1">{label}</p>
      {sub && <p className="text-slate-500 text-xs mt-1">{sub}</p>}
    </div>
  )
  return to ? <Link to={to}>{card}</Link> : card
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [activeUsers, setActiveUsers] = useState({ users: [], karigars: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      api.get('/admin/stats'),
      api.get('/admin/active-users')
    ])
      .then(([statsRes, activeRes]) => {
        setStats(statsRes.data)
        setActiveUsers(activeRes.data)
      })
      .catch(() => setError('Failed to load dashboard data'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white font-poppins">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Platform overview — what needs your attention today</p>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6">{error}</div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5 animate-pulse h-28" />
          ))}
        </div>
      ) : stats && (
        <>
          {/* Priority Actions */}
          {stats.karigars.pending > 0 && (
            <div className="bg-amber-900/20 border border-amber-700/50 rounded-xl p-4 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock size={20} className="text-amber-400" />
                <div>
                  <p className="text-amber-300 font-semibold text-sm">
                    {stats.karigars.pending} karigar{stats.karigars.pending !== 1 ? 's' : ''} waiting for approval
                  </p>
                  <p className="text-amber-500 text-xs">Review their CNIC and profile photo</p>
                </div>
              </div>
              <Link to="/admin/karigars?status=pending" className="bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
                Review Now
              </Link>
            </div>
          )}

          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard icon={Clock} label="Pending Approvals" value={stats.karigars.pending} color="bg-amber-500" to="/admin/karigars?status=pending" />
            <StatCard icon={CheckCircle} label="Approved Karigars" value={stats.karigars.approved} color="bg-emerald-600" to="/admin/karigars?status=approved" />
            <StatCard icon={PhoneCall} label="New Leads This Week" value={stats.leads.newThisWeek} color="bg-blue-600" to="/admin/leads" />
            <StatCard icon={ClipboardList} label="Total Bookings" value={stats.bookings.total} color="bg-purple-600" to="/admin/bookings" />
          </div>

          {/* Booking Breakdown */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-secondary" />
              Bookings Breakdown
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Pending', value: stats.bookings.pending, color: 'text-amber-400', bg: 'bg-amber-500/10', status: 'pending' },
                { label: 'Confirmed', value: stats.bookings.confirmed, color: 'text-blue-400', bg: 'bg-blue-500/10', status: 'confirmed' },
                { label: 'Completed', value: stats.bookings.completed, color: 'text-emerald-400', bg: 'bg-emerald-500/10', status: 'completed' },
                { label: 'Cancelled', value: stats.bookings.cancelled, color: 'text-red-400', bg: 'bg-red-500/10', status: 'cancelled' },
              ].map(({ label, value, color, bg, status }) => (
                <Link key={status} to={`/admin/bookings?status=${status}`}
                  className={`${bg} rounded-lg p-3 text-center hover:opacity-80 transition-opacity`}>
                  <p className={`text-xl font-bold ${color} font-poppins`}>{value}</p>
                  <p className="text-slate-400 text-xs mt-1">{label}</p>
                </Link>
              ))}
            </div>
          </div>
          {/* Active Users Widget */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mt-6">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Users size={18} className="text-emerald-400" />
              Online Now (Last 15 mins)
            </h2>
            
            {activeUsers.users.length === 0 && activeUsers.karigars.length === 0 ? (
              <p className="text-slate-500 text-sm">No one is currently online.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xs text-slate-400 uppercase font-semibold mb-3 tracking-wider">Customers / Admins ({activeUsers.users.length})</h3>
                  <div className="space-y-2">
                    {activeUsers.users.map(u => (
                      <div key={u._id} className="flex items-center gap-2 bg-slate-800/50 p-2 rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                        <span className="text-sm text-slate-300 truncate">{u.fullName}</span>
                        <span className="text-xs text-slate-500 ml-auto bg-slate-800 px-2 py-0.5 rounded">{u.role}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs text-slate-400 uppercase font-semibold mb-3 tracking-wider">Karigars ({activeUsers.karigars.length})</h3>
                  <div className="space-y-2">
                    {activeUsers.karigars.map(k => (
                      <div key={k._id} className="flex items-center gap-2 bg-slate-800/50 p-2 rounded-lg">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${k.isOnline ? 'bg-emerald-500' : 'bg-amber-500'}`} title={k.isOnline ? 'Available' : 'Unavailable'} />
                        <span className="text-sm text-slate-300 truncate">{k.fullName}</span>
                        <span className={`text-xs ml-auto px-2 py-0.5 rounded ${
                          k.verificationStatus === 'approved' ? 'text-emerald-400 bg-emerald-400/10' : 'text-amber-400 bg-amber-400/10'
                        }`}>
                          {k.verificationStatus}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
