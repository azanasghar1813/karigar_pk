import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CheckCircle, XCircle, Clock, Eye, X, ChevronDown, Users, MessageSquare, Ban, Trash2 } from 'lucide-react'
import api from '../../config/api'

const STATUS_TABS = [
  { key: '', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
]

const STATUS_BADGE = {
  pending: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  approved: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  rejected: 'bg-red-500/15 text-red-400 border-red-500/30',
}

function KarigarModal({ karigar, onClose, onApprove, onReject, onRestrict, onDelete, onUpdateRate, loading }) {
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [newRate, setNewRate] = useState(karigar.hourlyRate || '')
  const BASE = 'http://localhost:5000'

  if (!karigar) return null

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl my-8 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <h2 className="text-white font-bold text-lg font-poppins">{karigar.fullName}</h2>
            <p className="text-slate-400 text-sm">{karigar.email} · {karigar.city}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs px-2 py-1 rounded border font-semibold ${STATUS_BADGE[karigar.verificationStatus]}`}>
              {karigar.verificationStatus?.toUpperCase()}
            </span>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Photos Row */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'CNIC Front', src: karigar.cnicFront },
              { label: 'CNIC Back', src: karigar.cnicBack },
              { label: 'Profile Photo', src: karigar.profilePhoto },
            ].map(({ label, src }) => (
              <div key={label} className="space-y-2">
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide">{label}</p>
                {src ? (
                  <a href={src.startsWith('http') ? src : `${BASE}/${src}`} target="_blank" rel="noopener noreferrer">
                    <img
                      src={src.startsWith('http') ? src : `${BASE}/${src}`}
                      alt={label}
                      className="w-full h-36 object-cover rounded-lg border border-slate-700 hover:border-slate-500 cursor-zoom-in transition-colors"
                    />
                  </a>
                ) : (
                  <div className="w-full h-36 rounded-lg border border-slate-700 bg-slate-800 flex items-center justify-center text-slate-600 text-sm">
                    No image
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: 'Phone', value: karigar.phone },
              { label: 'CNIC Number', value: karigar.cnicNumber },
              { label: 'City', value: karigar.city },
              { label: 'Experience', value: karigar.experience ? `${karigar.experience} years` : '—' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-slate-800 rounded-lg p-3">
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide">{label}</p>
                <p className="text-white text-sm mt-1 font-medium">{value || '—'}</p>
              </div>
            ))}

            <div className="bg-slate-800 rounded-lg p-3 flex flex-col justify-between">
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Hourly Rate (Rs)</p>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="number"
                  value={newRate}
                  onChange={(e) => setNewRate(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-white text-sm rounded px-2 py-1 w-24 focus:outline-none"
                />
                <button
                  onClick={() => onUpdateRate(newRate)}
                  disabled={loading || newRate == karigar.hourlyRate}
                  className="text-xs bg-secondary hover:bg-orange-600 text-white px-3 py-1.5 rounded transition-colors disabled:opacity-50 font-medium"
                >
                  Save
                </button>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-3">
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Registered</p>
              <p className="text-white text-sm mt-1 font-medium">{new Date(karigar.createdAt).toLocaleDateString('en-PK')}</p>
            </div>
          </div>

          {/* Services */}
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2">Services Offered</p>
            <div className="flex flex-wrap gap-2">
              {karigar.services?.map((s) => (
                <span key={s} className="bg-slate-800 text-slate-300 text-xs px-3 py-1 rounded-full border border-slate-700">{s}</span>
              ))}
            </div>
          </div>

          {/* Bio */}
          {karigar.bio && (
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2">Bio</p>
              <p className="text-slate-300 text-sm bg-slate-800 rounded-lg p-3">{karigar.bio}</p>
            </div>
          )}

          {/* Approval Message */}
          {karigar.approvalMessage && karigar.verificationStatus === 'pending' && (
            <div className="bg-blue-900/20 border border-blue-700/40 rounded-lg p-3">
              <p className="text-blue-400 text-xs font-semibold uppercase tracking-wide mb-1 flex items-center gap-2">
                <MessageSquare size={14} /> Message from Karigar
              </p>
              <p className="text-blue-100 text-sm italic">"{karigar.approvalMessage}"</p>
            </div>
          )}

          {/* Audit trail */}
          {karigar.approvedBy && (
            <div className="bg-slate-800/50 rounded-lg p-3 text-xs text-slate-500">
              {karigar.verificationStatus === 'approved' ? '✅ Approved' : '❌ Rejected'} by {karigar.approvedBy?.fullName || 'Admin'} on {new Date(karigar.approvedAt).toLocaleString('en-PK')}
              {karigar.rejectionReason && <p className="text-red-400 mt-1">Reason: {karigar.rejectionReason}</p>}
            </div>
          )}

          {/* Rejection form */}
          {showRejectForm && (
            <div className="bg-red-900/20 border border-red-700/40 rounded-lg p-4 space-y-3">
              <p className="text-red-300 text-sm font-semibold">Rejection Reason (will be shown to karigar)</p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                placeholder="e.g. CNIC photo too blurry, profile photo not clear..."
                className="w-full bg-slate-900 border border-red-700/40 rounded-lg px-3 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
              <div className="flex gap-2">
                <button
                  disabled={!rejectionReason.trim() || loading}
                  onClick={() => onReject(rejectionReason)}
                  className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  {loading ? 'Rejecting...' : 'Confirm Reject'}
                </button>
                <button onClick={() => setShowRejectForm(false)} className="text-slate-400 hover:text-white text-sm px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Footer */}
        {karigar.verificationStatus === 'pending' && !showRejectForm && (
          <div className="px-6 py-4 border-t border-slate-800 flex gap-3 justify-end">
            <button
              onClick={() => setShowRejectForm(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/10 text-sm font-semibold transition-colors"
            >
              <XCircle size={16} /> Reject
            </button>
            <button
              disabled={loading}
              onClick={onApprove}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-colors disabled:opacity-50"
            >
              <CheckCircle size={16} /> {loading ? 'Approving...' : 'Approve'}
            </button>
          </div>
        )}

        {karigar.verificationStatus === 'approved' && (
          <div className="px-6 py-4 border-t border-slate-800 flex gap-3 justify-end bg-slate-900/50">
            <button
              disabled={loading}
              onClick={onRestrict}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg border text-sm font-semibold transition-colors disabled:opacity-50 ${
                karigar.isRestricted 
                  ? 'border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10' 
                  : 'border-amber-500/50 text-amber-400 hover:bg-amber-500/10'
              }`}
            >
              <Ban size={16} /> {karigar.isRestricted ? 'Unrestrict' : 'Restrict'}
            </button>
            <button
              disabled={loading}
              onClick={onDelete}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-colors disabled:opacity-50"
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AdminKarigars() {
  const [searchParams, setSearchParams] = useSearchParams()
  const statusFilter = searchParams.get('status') || ''
  const [karigars, setKarigars] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [selected, setSelected] = useState(null)
  const [toast, setToast] = useState('')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const fetchKarigars = useCallback(() => {
    setLoading(true)
    const params = statusFilter ? `?status=${statusFilter}` : ''
    api.get(`/admin/karigars${params}`)
      .then(({ data }) => setKarigars(data))
      .finally(() => setLoading(false))
  }, [statusFilter])

  useEffect(() => { fetchKarigars() }, [fetchKarigars])

  const handleApprove = async () => {
    setActionLoading(true)
    try {
      await api.put(`/admin/karigars/${selected._id}/approve`)
      showToast('✅ Karigar approved!')
      setSelected(null)
      fetchKarigars()
    } catch {
      showToast('❌ Approval failed')
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async (reason) => {
    setActionLoading(true)
    try {
      await api.put(`/admin/karigars/${selected._id}/reject`, { reason })
      showToast('Karigar rejected.')
      setSelected(null)
      fetchKarigars()
    } catch {
      showToast('❌ Rejection failed')
    } finally {
      setActionLoading(false)
    }
  }

  const handleRestrict = async () => {
    if (!window.confirm(`Are you sure you want to ${selected.isRestricted ? 'unrestrict' : 'restrict'} this karigar?`)) return;
    setActionLoading(true)
    try {
      await api.put(`/admin/karigars/${selected._id}/restrict`)
      showToast(selected.isRestricted ? '✅ Karigar unrestricted' : 'Karigar restricted')
      setSelected(null)
      fetchKarigars()
    } catch {
      showToast('❌ Failed to update restriction')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to permanently delete this karigar and all their data? This cannot be undone.')) return;
    setActionLoading(true)
    try {
      await api.delete(`/admin/karigars/${selected._id}`)
      showToast('✅ Karigar and associated data deleted.')
      setSelected(null)
      fetchKarigars()
    } catch {
      showToast('❌ Deletion failed')
    } finally {
      setActionLoading(false)
    }
  }

  const handleUpdateRate = async (rate) => {
    setActionLoading(true)
    try {
      await api.put(`/admin/karigars/${selected._id}/rate`, { rate })
      showToast('✅ Hourly rate updated!')
      setSelected((prev) => ({ ...prev, hourlyRate: rate }))
      fetchKarigars()
    } catch {
      showToast('❌ Failed to update rate')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div>
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-slate-800 border border-slate-600 text-white text-sm px-4 py-3 rounded-lg shadow-xl">
          {toast}
        </div>
      )}

      {selected && (
        <KarigarModal
          karigar={selected}
          onClose={() => setSelected(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          onRestrict={handleRestrict}
          onDelete={handleDelete}
          onUpdateRate={handleUpdateRate}
          loading={actionLoading}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white font-poppins">Karigars</h1>
          <p className="text-slate-400 text-sm mt-1">Review, approve, or reject karigar applications</p>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-800 pb-4">
        {STATUS_TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setSearchParams(key ? { status: key } : {})}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              statusFilter === key
                ? 'bg-secondary text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl h-16 animate-pulse" />
          ))}
        </div>
      ) : karigars.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <Users size={40} className="mx-auto mb-3 opacity-30" />
          <p>No karigars found</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/50">
                  <th className="text-left text-slate-500 font-semibold px-4 py-3 text-xs uppercase tracking-wide">Karigar</th>
                  <th className="text-left text-slate-500 font-semibold px-4 py-3 text-xs uppercase tracking-wide hidden md:table-cell">Phone</th>
                  <th className="text-left text-slate-500 font-semibold px-4 py-3 text-xs uppercase tracking-wide hidden sm:table-cell">City</th>
                  <th className="text-left text-slate-500 font-semibold px-4 py-3 text-xs uppercase tracking-wide hidden lg:table-cell">Services</th>
                  <th className="text-left text-slate-500 font-semibold px-4 py-3 text-xs uppercase tracking-wide">Status</th>
                  <th className="text-left text-slate-500 font-semibold px-4 py-3 text-xs uppercase tracking-wide hidden md:table-cell">Registered</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {karigars.map((k) => (
                  <tr key={k._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-white font-medium">{k.fullName}</p>
                        <p className="text-slate-500 text-xs">{k.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300 hidden md:table-cell">{k.phone}</td>
                    <td className="px-4 py-3 text-slate-300 hidden sm:table-cell">{k.city}</td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {k.services?.slice(0, 2).map((s) => (
                          <span key={s} className="bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded">{s}</span>
                        ))}
                        {k.services?.length > 2 && <span className="text-slate-600 text-xs">+{k.services.length - 2}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded border font-semibold ${STATUS_BADGE[k.verificationStatus]}`}>
                        {k.verificationStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs hidden md:table-cell">
                      {new Date(k.createdAt).toLocaleDateString('en-PK')}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelected(k)}
                        className="flex items-center gap-1 text-xs text-slate-400 hover:text-white hover:bg-slate-700 px-2 py-1.5 rounded-lg transition-colors"
                      >
                        <Eye size={14} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
