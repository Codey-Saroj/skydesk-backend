import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Search, Plane, ChevronDown, Menu, X, CheckCheck } from 'lucide-react'
import profile from '../data/profile.json'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar({ onMenuToggle, menuOpen }) {
  const navigate = useNavigate()
  const { user, signout } = useAuth()
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Your flight 6E-2341 is confirmed for July 18.', time: '2h ago', unread: true },
    { id: 2, text: 'Exclusive offer: 20% off international flights!', time: '5h ago', unread: true },
    { id: 3, text: 'Web check-in opens for your Delhi–Mumbai flight.', time: '1d ago', unread: false },
  ])
  const displayName = user?.name || profile.name
  const displayFirstName = user?.name?.split(' ')[0] || profile.firstName
  const displayEmail = user?.email || profile.email
  const initials = user?.name
    ? user.name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
    : profile.initials
  const unreadCount = notifications.filter(n => n.unread).length

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 h-16 flex items-center px-4 gap-4 shadow-sm">
      {/* Sidebar toggle (mobile) */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
        aria-label="Toggle sidebar"
      >
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Logo */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
          <Plane size={16} className="text-white fill-white" />
        </div>
        <span className="text-xl font-bold text-slate-900 hidden sm:block">
          Sky<span className="text-[#2563EB]">Desk</span>
        </span>
      </div>

      {/* Search bar */}
      <div className="flex-1 max-w-md mx-auto hidden md:flex items-center bg-slate-100 rounded-full px-4 py-2 gap-2 border border-transparent focus-within:border-[#2563EB]/40 focus-within:bg-white transition-colors">
        <Search size={16} className="text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Search flights, cities or booking ID..."
          className="bg-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none w-full"
        />
      </div>

      {/* Right side: Notifications + Profile with 24px gap */}
      <div className="flex items-center gap-6 ml-auto">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false) }}
            className="relative p-2 rounded-full text-slate-500 hover:bg-slate-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F97316] rounded-full border-2 border-white" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800 text-sm">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-xs bg-[#DBEAFE] text-[#2563EB] px-2 py-0.5 rounded-full font-medium">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-xs text-[#2563EB] font-semibold hover:underline"
                >
                  <CheckCheck size={13} />
                  Mark all as read
                </button>
              </div>
              <div className="divide-y divide-slate-50">
                {notifications.map(n => (
                  <div key={n.id} className={`px-4 py-3 flex gap-3 hover:bg-slate-50 cursor-pointer ${n.unread ? 'bg-[#DBEAFE]/40' : ''}`}>
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.unread ? 'bg-[#2563EB]' : 'bg-slate-300'}`} />
                    <div>
                      <p className="text-xs text-slate-700 leading-relaxed">{n.text}</p>
                      <p className="text-xs text-slate-400 mt-1">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-slate-100">
                <button className="text-xs text-[#2563EB] font-semibold hover:underline w-full text-center">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile — 24px gap from notifications achieved via gap-6 above */}
        <div className="relative">
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false) }}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center text-white text-xs font-bold shrink-0">
              {initials}
            </div>
            <span className="text-sm font-semibold text-slate-700 hidden sm:block">{displayFirstName}</span>
            <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="font-semibold text-slate-800 text-sm">{displayName}</p>
                <p className="text-xs text-slate-400 truncate">{displayEmail}</p>
              </div>
              {[
                { name: 'My Trips', path: '/my-trips' },
                { name: 'My Bookings', path: '/bookings' },
                { name: 'Travel Wallet', path: '/wallet' },
                { name: 'My Expenses', path: '/expenses' },
                { name: 'Sign Out', path: '/signin', signOut: true }
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    setProfileOpen(false)
                    if (item.signOut) signout()
                    navigate(item.path)
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors ${item.name === 'Sign Out' ? 'text-red-500 font-medium' : 'text-slate-600'}`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
