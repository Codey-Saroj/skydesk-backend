import { NavLink } from 'react-router-dom'
import {
  Home, MapPin, Ticket, Tag, HeadphonesIcon, LogOut,
  ChevronRight, Receipt, TrendingUp
} from 'lucide-react'

const navItems = [
  { label: 'Home', icon: Home, path: '/dashboard' },
  { label: 'My Trips', icon: MapPin, path: '/my-trips' },
  { label: 'Bookings', icon: Ticket, path: '/bookings' },
  { label: 'Expenses', icon: Receipt, path: '/expenses' },
  { label: 'Analytics', icon: TrendingUp, path: '/analytics' },
  { label: 'Offers', icon: Tag, path: '/offers' },
]

const bottomItems = [
  { label: 'Support', icon: HeadphonesIcon, path: '/support' },
]

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar — 242px wide */}
      <aside className={`
        fixed top-16 left-0 bottom-0 z-40 bg-white border-r border-slate-100 flex flex-col
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `} style={{ width: '242px' }}>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-0.5">
            {navItems.map(({ label, icon: Icon, path }) => (
              <NavLink
                key={path}
                to={path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group
                  ${isActive
                    ? 'bg-[#2563EB] text-white shadow-sm shadow-blue-200'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'} />
                    <span className="flex-1">{label}</span>
                    {isActive && <ChevronRight size={14} />}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 space-y-0.5">
            {bottomItems.map(({ label, icon: Icon, path }) => (
              <NavLink
                key={path}
                to={path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group
                  ${isActive
                    ? 'bg-[#2563EB] text-white shadow-sm shadow-blue-200'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'} />
                    <span>{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-slate-100">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}
