import { useNavigate, Link } from 'react-router-dom'
import {
  PlaneTakeoff, ArrowRight, Search, Phone, Shield, FileText, Info, HelpCircle,
  Zap, Percent, Headphones, Award, Plane, Star, Download, Activity,
  MousePointerClick, Edit3, PhoneCall, CloudSun, ScrollText, Building2,
  AlertTriangle, ExternalLink
} from 'lucide-react'
import FlightSearchCard from '../components/FlightSearchCard.jsx'
import BookingCard from '../components/BookingCard.jsx'
import OfferCard from '../components/OfferCard.jsx'

import { useState, useEffect } from 'react'
import bookings from '../data/bookings.json'
import destinations from '../data/destinations.json'
import recentSearches from '../data/recentSearches.json'
import travelTips from '../data/travelTips.json'
import expenseData from '../data/expenses.json'
import { formatCurrency } from '../utils/formatters.js'
import { useAuth } from '../context/AuthContext.jsx'
import { apiFetch } from '../utils/api'
import { mapBooking } from '../utils/mappers'

const { internationalRoutes } = expenseData

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const firstName = user?.name?.split(' ')[0] || 'there'
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  const [offers, setOffers] = useState([])
  useEffect(() => {
    apiFetch('/offers')
      .then((res) => setOffers(res.data.offers))
      .catch(() => setOffers([])) // fail quietly here — the section just won't render
  }, [])

  const [bookings, setBookings] = useState([])
  const [bookingsLoading, setBookingsLoading] = useState(true)
  useEffect(() => {
    apiFetch('/bookings', { auth: true })
      .then((res) => setBookings(res.data.bookings.map(mapBooking)))
      .catch(() => setBookings([]))
      .finally(() => setBookingsLoading(false))
  }, [])

  const upcomingBooking = bookings.find(b => b.upcoming)
  const recentBookings = bookings.filter(b => !b.upcoming).slice(0, 4)

  return (
    <div className="space-y-8">

      {/* ── Welcome Section ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0F172A]">
            Hello, {firstName}! 👋
          </h1>
          <p className="text-[#64748B] mt-1">Ready for your next journey?</p>
          <p className="text-[#64748B] text-sm mt-0.5">{today}</p>
        </div>
        <button
          onClick={() => navigate('/search-results')}
          className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl shadow-md hover:shadow-lg hover:shadow-orange-200 transition-all active:scale-95 shrink-0"
        >
          <PlaneTakeoff size={18} />
          Book Flight
          <ArrowRight size={16} />
        </button>
      </div>

      {/* ── Search Card ─────────────────────────────────────── */}
      <FlightSearchCard />

      {/* Benefits Strip */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-sm">
        {[
          { icon: Shield, title: 'Secure Booking', desc: 'PCI DSS compliant' },
          { icon: Zap, title: 'Instant Confirm', desc: 'Real-time ticketing' },
          { icon: Percent, title: 'No Hidden Fees', desc: 'Full transparency' },
          { icon: Headphones, title: '24/7 Support', desc: 'Expert travel agents' },
          { icon: Award, title: 'Best Price', desc: 'Match guarantee' },
          { icon: Plane, title: '500+ Airlines', desc: 'Global coverage' },
        ].map((item, idx) => (
          <div key={idx} className="flex items-center gap-2.5 px-2 py-1">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <item.icon size={16} className="text-[#2563EB]" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-slate-800 leading-tight truncate">{item.title}</p>
              <p className="text-[9px] text-[#64748B] font-medium leading-tight truncate">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main layout ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Left column (2/3 wide) */}
        <div className="xl:col-span-2 space-y-8">

          {/* Upcoming Trip */}
          {upcomingBooking && (
            <section>
              <SectionHeader title="Upcoming Trip" link="View all trips" />
              <UpcomingTripCard booking={upcomingBooking} />
            </section>
          )}

          {/* Recent Searches */}
          <section>
            <SectionHeader title="Recent Searches" link="Clear all" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {recentSearches.map(s => (
                <div key={s.id} className="bg-white border border-[#E2E8F0] rounded-xl p-4 hover:shadow-md hover:border-[#2563EB]/30 transition-all cursor-pointer group">
                  <div className="flex items-center gap-2 mb-2">
                    <Search size={14} className="text-[#64748B] group-hover:text-[#2563EB] transition-colors" />
                    <span className="text-xs text-[#64748B]">{new Date(s.searchedOn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-extrabold text-[#0F172A] text-base">{s.fromCode}</span>
                    <ArrowRight size={14} className="text-[#64748B]" />
                    <span className="font-extrabold text-[#0F172A] text-base">{s.toCode}</span>
                  </div>
                  <p className="text-xs text-[#64748B] mb-3">{s.from} → {s.to}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#64748B]">{s.passengers} Pax · {s.class}</span>
                    <button className="text-xs font-bold text-[#2563EB] border border-[#DBEAFE] px-2.5 py-1 rounded-lg hover:bg-[#DBEAFE] transition-colors">
                      Search Again
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* My Bookings */}
          <section>
            <SectionHeader title="My Bookings" link="View all" />
            {bookingsLoading ? (
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-8 text-center text-sm text-slate-400 font-semibold">
                Loading your bookings...
              </div>
            ) : recentBookings.length === 0 ? (
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-8 text-center">
                <p className="text-sm text-slate-500 font-semibold">No bookings yet — book your first flight above.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recentBookings.map(b => (
                  <BookingCard key={b.id} booking={b} />
                ))}
              </div>
            )}
          </section>

          {/* Popular Destinations */}
          <section>
            <SectionHeader title="Popular Destinations" link="See all" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {destinations.map(d => (
                <DestinationCard key={d.id} destination={d} />
              ))}
            </div>
          </section>

          {/* Popular International Routes */}
          <section>
            <SectionHeader title="Popular International Routes" link="View all routes" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {internationalRoutes.map((r) => (
                <article
                  key={r.city}
                  className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:border-[#2563EB]/20 group"
                >
                  <div className="h-36 overflow-hidden relative">
                    <img
                      src={r.image}
                      alt={r.city}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-350"
                    />
                    <div className="absolute top-3 left-3 bg-[#2563EB] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                      12% Drop
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div>
                      <span className="text-[9px] font-bold text-[#2563EB] tracking-wider uppercase">Route Deal</span>
                      <h3 className="font-extrabold text-slate-800 text-xs mt-0.5 truncate">{r.city}</h3>
                      <p className="text-[10px] text-slate-400 font-semibold">{r.code}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2.5 border-t border-slate-50">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 block uppercase">Fares from</span>
                        <strong className="text-xs font-black text-slate-900">{formatCurrency(r.price)}</strong>
                      </div>
                      <Link
                        to="/search-results"
                        className="text-[10px] font-bold text-[#2563EB] hover:underline flex items-center gap-0.5"
                      >
                        View flights →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Special Offers */}
          <section>
            <SectionHeader title="Special Offers" link="View all offers" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {offers.map(o => (
                <OfferCard key={o.id} offer={o} />
              ))}
            </div>
          </section>

          {/* Travel Tips */}
          <section>
            <SectionHeader title="Travel Tips & Alerts" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {travelTips.map(t => (
                <TravelTipCard key={t.id} tip={t} />
              ))}
            </div>
          </section>

        </div>

        {/* Right column (1/3 wide) */}
        <div className="xl:col-span-1 space-y-6">
          <QuickActions />
        </div>
      </div>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="border-t border-[#E2E8F0] pt-6 mt-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-5">
            <a href="#" className="flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#2563EB] font-medium transition-colors">
              <HelpCircle size={13} />
              Need Help?
            </a>
            <a href="#" className="flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#2563EB] font-medium transition-colors">
              <Phone size={13} />
              Customer Support
            </a>
            <a href="#" className="flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#2563EB] font-medium transition-colors">
              <Shield size={13} />
              Privacy Policy
            </a>
            <a href="#" className="flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#2563EB] font-medium transition-colors">
              <FileText size={13} />
              Terms
            </a>
            <a href="#" className="flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#2563EB] font-medium transition-colors">
              <Info size={13} />
              About Us
            </a>
          </div>
          <p className="text-xs text-[#64748B]">© 2026 SkyDesk. All rights reserved.</p>
        </div>
      </footer>

    </div>
  )
}

function SectionHeader({ title, link }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-bold text-[#0F172A]">{title}</h2>
      {link && (
        <button className="text-sm text-[#2563EB] font-semibold hover:underline flex items-center gap-1">
          {link}
          <ArrowRight size={14} />
        </button>
      )}
    </div>
  )
}

function UpcomingTripCard({ booking }) {
  if (!booking) return null

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
    })
  }

  const statusStyles = {
    Confirmed: 'bg-emerald-100 text-emerald-800',
    Completed: 'bg-slate-100 text-slate-600',
    Cancelled: 'bg-red-100 text-red-700',
    Pending: 'bg-amber-100 text-amber-800',
  }

  return (
    <div className="bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] rounded-2xl text-white shadow-lg shadow-blue-200 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full translate-x-20 -translate-y-20 pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-28 h-28 bg-white/5 rounded-full translate-y-12 pointer-events-none" />

      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-blue-200 text-xs font-semibold uppercase tracking-wider mb-1">Upcoming Trip</p>
            <p className="text-white font-semibold text-sm">{formatDate(booking.date)}</p>
          </div>
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${statusStyles[booking.status]} shrink-0`}>
            {booking.status}
          </span>
        </div>

        <div className="flex items-center gap-4 mb-5">
          <div className="text-center">
            <p className="text-3xl font-extrabold text-white">{booking.fromCode}</p>
            <p className="text-blue-200 text-xs mt-0.5">{booking.from}</p>
            <p className="text-white font-bold text-sm mt-1">{booking.departure}</p>
          </div>

          <div className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex items-center">
              <div className="h-px flex-1 bg-white/30" />
              <Plane size={18} className="text-white mx-2 fill-white" />
              <div className="h-px flex-1 bg-white/30" />
            </div>
            <p className="text-blue-200 text-xs">{booking.flightNumber}</p>
          </div>

          <div className="text-center">
            <p className="text-3xl font-extrabold text-white">{booking.toCode}</p>
            <p className="text-blue-200 text-xs mt-0.5">{booking.to}</p>
            <p className="text-white font-bold text-sm mt-1">{booking.arrival}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-5 py-4 border-t border-b border-white/20">
          <div className="text-center">
            <p className="text-blue-200 text-xs mb-0.5">Terminal</p>
            <p className="text-white font-bold text-sm">{booking.terminal}</p>
          </div>
          <div className="text-center">
            <p className="text-blue-200 text-xs mb-0.5">Seat</p>
            <p className="text-white font-bold text-sm">{booking.seat}</p>
          </div>
          <div className="text-center">
            <p className="text-blue-200 text-xs mb-0.5">Gate</p>
            <p className="text-white font-bold text-sm">{booking.gate}</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-200 text-xs">{booking.airline}</p>
            <p className="text-white/70 text-xs mt-0.5">{booking.class} · {booking.passengers} Pax</p>
          </div>
          <button className="flex items-center gap-2 bg-white text-[#2563EB] font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-colors shadow-sm">
            View Ticket
            <ExternalLink size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

function DestinationCard({ destination }) {
  return (
    <div className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
      <div className="h-44 overflow-hidden">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={e => { e.target.src = `https://placehold.co/600x400/2563eb/white?text=${destination.name}` }}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      <div className="absolute top-3 left-3">
        <span className="bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-bold px-2.5 py-1 rounded-full">
          {destination.tag}
        </span>
      </div>

      <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
        <Star size={11} className="fill-yellow-400 text-yellow-400" />
        {destination.rating}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="text-white font-bold text-lg leading-tight">{destination.name}</p>
        <p className="text-white/70 text-xs mb-2">{destination.country} · {destination.flightDuration}</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/60 text-xs">Starting from</p>
            <p className="text-white font-extrabold text-base">₹{destination.startingPrice.toLocaleString()}</p>
          </div>
          <button className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors">
            Explore
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}

function TravelTipCard({ tip }) {
  const tipIconMap = {
    FileText: { Icon: ScrollText, label: 'Visa Information' },
    CloudRain: { Icon: CloudSun, label: 'Weather' },
    Luggage: { Icon: Building2, label: 'Airport Updates' },
    MapPin: { Icon: AlertTriangle, label: 'Travel Advisory' },
  }

  const colorConfig = {
    blue:   { bg: 'bg-[#DBEAFE]', icon: 'text-[#2563EB]', tag: 'bg-[#2563EB] text-white', border: 'border-[#DBEAFE]', iconBg: 'bg-white' },
    cyan:   { bg: 'bg-sky-50',   icon: 'text-sky-600',     tag: 'bg-sky-500 text-white',   border: 'border-sky-100',   iconBg: 'bg-white' },
    purple: { bg: 'bg-purple-50',icon: 'text-purple-600',  tag: 'bg-purple-500 text-white',border: 'border-purple-100',iconBg: 'bg-white' },
    orange: { bg: 'bg-orange-50',icon: 'text-[#F97316]',   tag: 'bg-[#F97316] text-white', border: 'border-orange-100',iconBg: 'bg-white' },
  }

  const mapping = tipIconMap[tip.icon] || tipIconMap.FileText
  const Icon = mapping.Icon
  const colors = colorConfig[tip.color] || colorConfig.blue

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 hover:shadow-sm transition-all cursor-pointer group">
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center shrink-0`}>
          <Icon size={18} className={colors.icon} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-[#0F172A] text-sm">{tip.title}</h4>
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${colors.tag} shrink-0`}>{tip.tag}</span>
          </div>
          <p className="text-xs text-[#64748B] leading-relaxed">{tip.description}</p>
        </div>
      </div>
    </div>
  )
}

function QuickActions() {
  const actions = [
    {
      id: 'download',
      label: 'Download Ticket',
      icon: Download,
      bg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      hoverBg: 'hover:bg-blue-100',
    },
    {
      id: 'flight-status',
      label: 'Flight Status',
      icon: Activity,
      bg: 'bg-green-50',
      iconColor: 'text-green-600',
      hoverBg: 'hover:bg-green-100',
    },
    {
      id: 'web-checkin',
      label: 'Web Check-In',
      icon: MousePointerClick,
      bg: 'bg-orange-50',
      iconColor: 'text-orange-600',
      hoverBg: 'hover:bg-orange-100',
    },
    {
      id: 'manage',
      label: 'Manage Booking',
      icon: Edit3,
      bg: 'bg-purple-50',
      iconColor: 'text-purple-600',
      hoverBg: 'hover:bg-purple-100',
    },
    {
      id: 'support',
      label: 'Customer Support',
      icon: PhoneCall,
      bg: 'bg-rose-50',
      iconColor: 'text-rose-600',
      hoverBg: 'hover:bg-rose-100',
    },
  ]

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <h3 className="font-bold text-slate-800 text-base mb-4">Quick Actions</h3>
      <div className="grid grid-cols-5 gap-3">
        {actions.map(({ id, label, icon: Icon, bg, iconColor, hoverBg }) => (
          <button
            key={id}
            className={`flex flex-col items-center gap-2 p-3 rounded-xl ${bg} ${hoverBg} transition-colors group`}
          >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
              <Icon size={18} className={iconColor} />
            </div>
            <span className="text-xs font-semibold text-slate-600 text-center leading-tight">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

