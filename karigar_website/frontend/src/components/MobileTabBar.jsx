import { NavLink } from 'react-router-dom'
import { Home, Compass, CalendarCheck, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function MobileTabBar() {
  const { user } = useAuth()

  const tabs = [
    { label: 'Home', to: '/', icon: Home },
    { label: 'Explore', to: '/find-karigar', icon: Compass },
    { label: 'Bookings', to: user ? '/customer-dashboard' : '/login', icon: CalendarCheck },
    { label: 'Profile', to: user ? '/customer-dashboard' : '/login', icon: User }
  ]

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-gray-200/90 py-1 px-2 shadow-[0_-4px_20px_rgba(10,31,68,0.08)]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <NavLink
              key={tab.label}
              to={tab.to}
              end={tab.to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center min-w-[48px] min-h-[48px] px-2 rounded-xl transition-all duration-150 ${
                  isActive
                    ? 'text-[#FF7A00] font-bold scale-105'
                    : 'text-[#5A6B84] hover:text-[#0A1F44] font-medium'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={20}
                    className={`transition-colors ${
                      isActive ? 'stroke-[2.5px] text-[#FF7A00]' : 'stroke-[1.75px]'
                    }`}
                  />
                  <span className="text-[11px] mt-0.5 tracking-tight">{tab.label}</span>
                </>
              )}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
