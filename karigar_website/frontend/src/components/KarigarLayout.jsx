import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, ClipboardList, Calendar, History, Wallet, User, LogOut, Star, HelpCircle, Menu, X } from 'lucide-react';
import { SITE_PHONE_WA } from '../config/site';
import api from '../config/api';

const KarigarLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);

  useEffect(() => {
    // Only fetch if not pending verification
    if (user && user.verificationStatus === 'approved') {
      fetchPendingRequests();
    }
  }, [user]);

  const fetchPendingRequests = async () => {
    try {
      const { data } = await api.get('/karigar-portal/stats');
      setPendingRequestsCount(data.newRequests || 0);
    } catch (error) {
      console.error('Failed to fetch pending requests count', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/karigar', icon: Home, end: true },
    { name: 'New Requests', path: '/karigar/requests', icon: ClipboardList, badge: pendingRequestsCount },
    { name: 'Schedule', path: '/karigar/schedule', icon: Calendar },
    { name: 'History', path: '/karigar/history', icon: History },
    { name: 'Reviews', path: '/karigar/reviews', icon: Star },
    { name: 'Profile', path: '/karigar/profile', icon: User },
  ];

  const supportLink = `https://wa.me/${SITE_PHONE_WA.replace('+', '')}`;

  const isPending = user?.verificationStatus === 'pending' || user?.verificationStatus === 'rejected';

  return (
    <div className="flex h-screen bg-slate-50 font-poppins text-slate-800 overflow-hidden">
      {/* Mobile Topbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-30 flex items-center justify-between px-4">
        <h2 className="text-xl font-bold text-primary">Karigar Portal</h2>
        <button onClick={() => setSidebarOpen(true)} className="p-2 -mr-2 text-slate-600">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-slate-900/50 z-40 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed md:static inset-y-0 left-0 w-64 bg-white border-r border-slate-200 z-50 flex flex-col transition-transform duration-300 transform 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <div className="p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary">Karigar Portal</h2>
            <p className="text-xs text-slate-500 mt-1">{user?.fullName}</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto pb-4">
          {!isPending ? (
            <>
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-4 py-3 rounded-lg transition-colors font-medium ${
                      isActive
                        ? 'bg-secondary text-white shadow-md shadow-secondary/20'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </div>
                  {item.badge > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
              
              <div className="my-4 border-t border-slate-100" />
              
              <a
                href={supportLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors font-medium"
              >
                <HelpCircle className="w-5 h-5" />
                Help & Support
              </a>
            </>
          ) : (
            <NavLink
              to="/karigar/pending"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium bg-secondary text-white shadow-md shadow-secondary/20`
              }
            >
              <User className="w-5 h-5" />
              Pending Status
            </NavLink>
          )}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto pt-16 md:pt-0 bg-slate-50 relative">
        <Outlet />
      </main>
    </div>
  );
};

export default KarigarLayout;
