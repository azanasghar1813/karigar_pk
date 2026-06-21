import { useState, useEffect } from 'react'
import { Plus, Pencil, ToggleLeft, ToggleRight, Wrench, X, Check } from 'lucide-react'
import api from '../../config/api'

const EMOJI_OPTIONS = ['🔧', '💡', '🚰', '🪚', '🎨', '❄️', '🔒', '📹', '🏠', '🛠️']

function ServiceCard({ service, onToggle, onEdit }) {
  return (
    <div className={`bg-slate-900 border rounded-xl p-4 transition-all ${service.active ? 'border-slate-700' : 'border-slate-800 opacity-50'}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{service.icon || '🔧'}</span>
          <div>
            <p className="text-white font-semibold">{service.name}</p>
            <p className="text-slate-500 text-xs mt-0.5">{service.description || 'No description'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onEdit(service)} className="text-slate-500 hover:text-white transition-colors p-1">
            <Pencil size={14} />
          </button>
          <button onClick={() => onToggle(service)} className={`transition-colors p-1 ${service.active ? 'text-emerald-400 hover:text-red-400' : 'text-slate-600 hover:text-emerald-400'}`}>
            {service.active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
          </button>
        </div>
      </div>
      <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${service.active ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-slate-700/30 text-slate-500 border-slate-700'}`}>
        {service.active ? 'Active' : 'Inactive'}
      </span>
    </div>
  )
}

function ServiceForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || { name: '', icon: '🔧', description: '', active: true })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!form.name.trim()) return
    setSaving(true)
    try { await onSave(form) }
    finally { setSaving(false) }
  }

  return (
    <div className="bg-slate-900 border border-secondary/30 rounded-xl p-5 space-y-4">
      <h3 className="text-white font-semibold">{initial ? 'Edit Service' : 'Add New Service'}</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-slate-400 text-xs font-semibold uppercase tracking-wide block mb-1">Service Name *</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Electrician"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-secondary"
          />
        </div>
        <div>
          <label className="text-slate-400 text-xs font-semibold uppercase tracking-wide block mb-1">Icon (emoji)</label>
          <div className="flex gap-2 flex-wrap">
            {EMOJI_OPTIONS.map((e) => (
              <button key={e} onClick={() => setForm({ ...form, icon: e })}
                className={`text-xl p-1.5 rounded-lg transition-all ${form.icon === e ? 'bg-secondary/20 border border-secondary/50' : 'hover:bg-slate-700'}`}>
                {e}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="text-slate-400 text-xs font-semibold uppercase tracking-wide block mb-1">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Short description of this service..."
          rows={2}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-secondary resize-none"
        />
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <div className={`w-10 h-6 rounded-full transition-colors relative ${form.active ? 'bg-emerald-600' : 'bg-slate-700'}`}
          onClick={() => setForm({ ...form, active: !form.active })}>
          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form.active ? 'left-5' : 'left-1'}`} />
        </div>
        <span className="text-slate-300 text-sm">{form.active ? 'Active' : 'Inactive'}</span>
      </label>

      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={!form.name.trim() || saving}
          className="flex items-center gap-2 bg-secondary hover:bg-orange-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          <Check size={14} /> {saving ? 'Saving...' : 'Save'}
        </button>
        <button onClick={onCancel} className="text-slate-400 hover:text-white text-sm px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors">
          Cancel
        </button>
      </div>
    </div>
  )
}

export default function AdminServices() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [toast, setToast] = useState('')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const fetchServices = () => {
    setLoading(true)
    api.get('/admin/services').then(({ data }) => setServices(data)).finally(() => setLoading(false))
  }

  useEffect(() => { fetchServices() }, [])

  const handleCreate = async (form) => {
    await api.post('/admin/services', form)
    showToast('✅ Service created')
    setShowForm(false)
    fetchServices()
  }

  const handleEdit = async (form) => {
    await api.put(`/admin/services/${editTarget._id}`, form)
    showToast('✅ Service updated')
    setEditTarget(null)
    fetchServices()
  }

  const handleToggle = async (service) => {
    await api.put(`/admin/services/${service._id}`, { active: !service.active })
    setServices((prev) => prev.map((s) => s._id === service._id ? { ...s, active: !s.active } : s))
  }

  return (
    <div>
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-slate-800 border border-slate-600 text-white text-sm px-4 py-3 rounded-lg shadow-xl">{toast}</div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white font-poppins">Services</h1>
          <p className="text-slate-400 text-sm mt-1">Manage service categories — add, edit, or deactivate</p>
        </div>
        {!showForm && !editTarget && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-secondary hover:bg-orange-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={16} /> Add Service
          </button>
        )}
      </div>

      {(showForm || editTarget) && (
        <div className="mb-6">
          <ServiceForm
            initial={editTarget}
            onSave={editTarget ? handleEdit : handleCreate}
            onCancel={() => { setShowForm(false); setEditTarget(null) }}
          />
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl h-28 animate-pulse" />)}
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <Wrench size={40} className="mx-auto mb-3 opacity-30" />
          <p>No services yet — add your first one</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {services.map((s) => (
            <ServiceCard
              key={s._id}
              service={s}
              onToggle={handleToggle}
              onEdit={(s) => { setEditTarget(s); setShowForm(false) }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
