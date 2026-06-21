import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PhoneCall, ChevronDown, ChevronUp, Globe, MessageSquare } from 'lucide-react'
import api from '../../config/api'
import { formatPhone, getTelLink } from '../../utils/format'

const SOURCE_BADGE = {
  homepage: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  contact_page: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  other: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
}

const STATUS_OPTIONS = ['new', 'contacted', 'closed']

const STATUS_BADGE = {
  new: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  contacted: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  closed: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
}

function LeadRow({ lead, onStatusChange }) {
  const [expanded, setExpanded] = useState(false)
  const [updating, setUpdating] = useState(false)

  const [notes, setNotes] = useState(lead.adminNotes || '')

  const handleStatus = async (status) => {
    setUpdating(true)
    try {
      await onStatusChange(lead._id, status)
    } finally {
      setUpdating(false)
    }
  }

  const handleSaveNotes = async () => {
    setUpdating(true)
    try {
      await api.put(`/admin/leads/${lead._id}/notes`, { notes })
      // Ideally we update the parent state too, but keeping it simple as it's saved to DB
      lead.adminNotes = notes
      alert('Notes saved successfully!')
    } catch (error) {
      alert('Failed to save notes')
    } finally {
      setUpdating(false)
    }
  }

  return (
    <>
      <tr className="hover:bg-slate-800/40 transition-colors cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <td className="px-4 py-3">
          <div>
            <p className="text-white font-medium text-sm">{lead.name}</p>
            {lead.email && !lead.email.includes('@phone.local') && <p className="text-slate-500 text-xs">{lead.email}</p>}
          </div>
        </td>
        <td className="px-4 py-3 hidden sm:table-cell">
          {lead.phone ? (
            <a href={getTelLink(lead.phone)} onClick={(e) => e.stopPropagation()} className="text-secondary hover:text-orange-400 text-sm font-medium transition-colors">
              {formatPhone(lead.phone)}
            </a>
          ) : <span className="text-slate-600 text-sm">—</span>}
        </td>
        <td className="px-4 py-3 hidden md:table-cell">
          <span className={`text-xs px-2 py-1 rounded border font-semibold whitespace-nowrap ${SOURCE_BADGE[lead.source] || SOURCE_BADGE.other}`}>
            {lead.source === 'homepage' ? '🏠 Homepage' : lead.source === 'callback_fab' ? '💬 Callback FAB' : '📋 Contact Page'}
          </span>
        </td>
        <td className="px-4 py-3 hidden lg:table-cell">
          <p className="text-slate-300 text-sm truncate max-w-[200px]">{lead.message}</p>
        </td>
        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
          <select
            value={lead.status}
            onChange={(e) => handleStatus(e.target.value)}
            disabled={updating}
            className={`text-xs px-2 py-1 rounded border bg-slate-900 font-semibold cursor-pointer focus:outline-none ${STATUS_BADGE[lead.status]} disabled:opacity-50`}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </td>
        <td className="px-4 py-3 text-slate-500 text-xs hidden md:table-cell">
          {new Date(lead.createdAt).toLocaleString('en-PK', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
          })}
        </td>
        <td className="px-4 py-3 text-slate-500">
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </td>
      </tr>
      {expanded && (
        <tr className="bg-slate-800/30">
          <td colSpan={7} className="px-4 py-4">
            <div className="space-y-2">
              {lead.subject && (
                <p className="text-slate-400 text-xs"><span className="font-semibold text-slate-300">Subject:</span> {lead.subject}</p>
              )}
              <div className="bg-slate-900 rounded-lg p-3 text-slate-300 text-sm leading-relaxed border border-slate-700 whitespace-pre-wrap">
                {lead.message}
              </div>
              
              <div className="mt-4">
                <p className="text-slate-400 text-xs font-semibold mb-1">Admin Notes</p>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Jot down details from your call... (e.g. quoted Rs. 800, will confirm tomorrow)"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-secondary mb-2 min-h-[60px]"
                />
                <button 
                  onClick={handleSaveNotes}
                  disabled={updating || notes === (lead.adminNotes || '')}
                  className="text-xs bg-secondary hover:bg-orange-600 text-white px-4 py-1.5 rounded transition-colors disabled:opacity-50 font-medium"
                >
                  {updating ? 'Saving...' : 'Save Notes'}
                </button>
              </div>

              {lead.phone && (
                <div className="flex gap-3 mt-4 pt-4 border-t border-slate-700/50">
                  <a href={getTelLink(lead.phone)} className="flex items-center gap-2 text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg transition-colors font-semibold">
                    <PhoneCall size={12} /> Call Now
                  </a>
                  <a href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg transition-colors font-semibold">
                    <MessageSquare size={12} /> WhatsApp
                  </a>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

export default function AdminLeads() {
  const [searchParams, setSearchParams] = useSearchParams()
  const statusFilter = searchParams.get('status') || ''
  const sourceFilter = searchParams.get('source') || ''
  const searchFilter = searchParams.get('search') || ''
  const pageFilter = parseInt(searchParams.get('page') || '1', 10)
  
  const [leads, setLeads] = useState([])
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [loading, setLoading] = useState(true)

  const fetchLeads = useCallback(() => {
    const params = new URLSearchParams()
    if (statusFilter) params.set('status', statusFilter)
    if (sourceFilter) params.set('source', sourceFilter)
    if (searchFilter) params.set('search', searchFilter)
    params.set('page', pageFilter)
    params.set('limit', '10')

    setLoading(true)
    api.get(`/admin/leads?${params}`)
      .then(({ data }) => {
        // Handle new paginated response structure vs old array structure to be safe
        if (data.data) {
          setLeads(data.data)
          setPagination({ page: data.page, pages: data.pages, total: data.total })
        } else {
          setLeads(data)
        }
      })
      .finally(() => setLoading(false))
  }, [statusFilter, sourceFilter, searchFilter, pageFilter])

  useEffect(() => { fetchLeads() }, [fetchLeads])

  const handleStatusChange = async (id, status) => {
    await api.put(`/admin/leads/${id}/status`, { status })
    setLeads((prev) => prev.map((l) => l._id === id ? { ...l, status } : l))
  }

  const setFilter = (key, value) => {
    const p = new URLSearchParams(searchParams)
    if (value) p.set(key, value)
    else p.delete(key)
    
    // Reset to page 1 if changing other filters
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
        <h1 className="text-2xl font-bold text-white font-poppins">Leads Inbox</h1>
        <p className="text-slate-400 text-sm mt-1">Homepage "Request a Call" + Contact page submissions — your manual sales queue</p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
          <input 
            type="text" 
            placeholder="Search name, phone..." 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-secondary flex-1 max-w-sm"
          />
          <button type="submit" className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
            Search
          </button>
        </form>

        <div className="flex flex-wrap gap-3">
          <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
            {['', 'new', 'contacted', 'closed'].map((s) => (
              <button key={s} onClick={() => setFilter('status', s)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${statusFilter === s ? 'bg-secondary text-white' : 'text-slate-400 hover:text-white'}`}>
                {s || 'All Status'}
              </button>
            ))}
          </div>
          <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
            {[{ v: '', l: 'All Sources' }, { v: 'homepage', l: '🏠 Homepage' }, { v: 'contact_page', l: '📋 Contact Page' }].map(({ v, l }) => (
              <button key={v} onClick={() => setFilter('source', v)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${sourceFilter === v ? 'bg-secondary text-white' : 'text-slate-400 hover:text-white'}`}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl h-14 animate-pulse" />)}</div>
      ) : leads.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <PhoneCall size={40} className="mx-auto mb-3 opacity-30" />
          <p>No leads found</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/50">
                  <th className="text-left text-slate-500 font-semibold px-4 py-3 text-xs uppercase tracking-wide">Name</th>
                  <th className="text-left text-slate-500 font-semibold px-4 py-3 text-xs uppercase tracking-wide hidden sm:table-cell">Phone</th>
                  <th className="text-left text-slate-500 font-semibold px-4 py-3 text-xs uppercase tracking-wide hidden md:table-cell">Source</th>
                  <th className="text-left text-slate-500 font-semibold px-4 py-3 text-xs uppercase tracking-wide hidden lg:table-cell">Message</th>
                  <th className="text-left text-slate-500 font-semibold px-4 py-3 text-xs uppercase tracking-wide">Status</th>
                  <th className="text-left text-slate-500 font-semibold px-4 py-3 text-xs uppercase tracking-wide hidden md:table-cell">Date</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {leads.map((lead) => (
                  <LeadRow key={lead._id} lead={lead} onStatusChange={handleStatusChange} />
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
