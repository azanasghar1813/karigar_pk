import { useState, useContext } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  PhoneCall,
  Wrench,
  Star,
  LogOut,
  ArrowLeft,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react'
import { AuthContext } from '../context/AuthContext'

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/karigars', label: 'Karigars', icon: Users },
  { to: '/admin/users', label: 'Customers', icon: Users },
  { to: '/admin/bookings', label: 'Bookings', icon: ClipboardList },
  { to: '/admin/leads', label: 'Leads', icon: PhoneCall },
  { to: '/admin/services', label: 'Services', icon: Wrench },
  { to: '/admin/reviews', label: 'Reviews', icon: Star },
]

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-slate-900 border-r border-slate-800 z-40 flex flex-col transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:sticky md:z-auto`}
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center font-bold text-white text-sm">K</div>
            <div>
              <p className="font-poppins font-bold text-white text-sm">Karigar Admin</p>
              <p className="text-slate-500 text-xs truncate max-w-[120px]">{user?.email}</p>
            </div>
          </div>
          <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ to, label, icon: Icon, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group
                ${isActive
                  ? 'bg-secondary/15 text-secondary border border-secondary/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`
              }
            >
              <Icon size={18} />
              {label}
              <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-50 transition-opacity" />
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <ArrowLeft size={18} />
            Back to Site
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all w-full"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-0">
        {/* Top Bar */}
        <header className="bg-slate-900 border-b border-slate-800 px-4 md:px-6 py-3 flex items-center gap-4 sticky top-0 z-20">
          <button
            className="md:hidden text-slate-400 hover:text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>

          <div className="flex-1" />

          <Link
            to="/"
            className="hidden sm:flex items-center gap-2 text-sm text-slate-400 hover:text-secondary transition-colors font-medium"
          >
            <ArrowLeft size={15} />
            Back to Site
          </Link>

          <div className="flex items-center gap-2 pl-4 border-l border-slate-800">
            <div className="w-7 h-7 rounded-full bg-secondary/20 border border-secondary/40 flex items-center justify-center">
              <span className="text-secondary text-xs font-bold">
                {user?.fullName?.[0]?.toUpperCase() || 'A'}
              </span>
            </div>
            <span className="text-sm text-slate-300 font-medium hidden sm:block">
              {user?.fullName || 'Admin'}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
