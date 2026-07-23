import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Ticket, Calendar, ShieldCheck, Search, Plane, Trash2, CheckCircle2, XCircle, Clock, Loader2 } from 'lucide-react'
import { formatCurrency, formatDate } from '../utils/formatters'
import { apiFetch } from '../utils/api'
import { mapBooking } from '../utils/mappers'
import StatusPill from '../components/StatusPill'

const statusFilters = ['All', 'Confirmed', 'Completed', 'Cancelled']

export default function Bookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [cancellingId, setCancellingId] = useState(null)

  useEffect(() => {
    apiFetch('/bookings', { auth: true })
      .then((res) => setBookings(res.data.bookings.map(mapBooking)))
      .catch((err) => setError(err.message || 'Could not load your bookings.'))
      .finally(() => setLoading(false))
  }, [])

  const handleCancelBooking = (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return
    setCancellingId(bookingId)
    apiFetch(`/bookings/${bookingId}/cancel`, { method: 'PATCH', auth: true })
      .then(() => {
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status: 'Cancelled', upcoming: false } : b))
        )
      })
      .catch((err) => window.alert(err.message || 'Could not cancel this booking.'))
      .finally(() => setCancellingId(null))
  }

  const filteredBookings = bookings
    .filter(b => filter === 'All' || b.status === filter)
    .filter(b => {
      const q = search.toLowerCase()
      return (
        (b.from || '').toLowerCase().includes(q) ||
        (b.to || '').toLowerCase().includes(q) ||
        (b.flightNumber || '').toLowerCase().includes(q) ||
        (b.bookingId || '').toLowerCase().includes(q) ||
        (b.pnr || '').toLowerCase().includes(q)
      )
    })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#2563EB] uppercase tracking-wider">Manage Trips</p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] mt-1">Flight Bookings</h1>
          <p className="text-[#64748B] text-sm mt-1">View, track, or cancel your booked flight itineraries.</p>
        </div>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-orange-600 text-white font-bold px-5 py-3 rounded-xl shadow-md hover:shadow-orange-200 transition-all active:scale-95 shrink-0 text-sm"
        >
          <Search size={16} />
          Search New Flights
        </Link>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 flex flex-col md:flex-row gap-4 items-center shadow-sm">
        {/* Status filters */}
        <div className="flex flex-wrap gap-2 mr-auto">
          {statusFilters.map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === status
                  ? 'bg-[#2563EB] text-white shadow-sm shadow-blue-100'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="w-full md:w-80 flex items-center bg-slate-50 rounded-xl px-4 py-2.5 gap-2 border border-transparent focus-within:border-[#2563EB]/40 focus-within:bg-white transition-all">
          <Search size={16} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search city, PNR or flight #..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-xs text-slate-700 placeholder-slate-400 focus:outline-none w-full font-medium"
          />
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center shadow-sm flex items-center justify-center gap-2 text-slate-400">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm font-semibold">Loading your bookings...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-150 rounded-2xl p-6 text-center text-sm text-red-700 font-semibold">
            {error}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center shadow-sm">
            <Ticket size={32} className="text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-base">
              {bookings.length === 0 ? 'No Bookings Yet' : 'No Bookings Found'}
            </h3>
            <p className="text-slate-500 text-xs mt-1">
              {bookings.length === 0
                ? "You haven't booked any flights yet — search and book one to see it here."
                : 'There are no bookings matching your criteria.'}
            </p>
          </div>
        ) : (
          filteredBookings.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl border border-[#E2E8F0] p-5 md:p-6 shadow-sm hover:border-[#2563EB]/20 transition-all space-y-4 relative overflow-hidden"
            >
              {/* Header section of Booking Card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-slate-800 tracking-tighter text-xs">
                    {b.airlineCode}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">{b.airline}</h3>
                    <p className="text-[10px] text-slate-400 font-bold">Flight {b.flightNumber} · PNR: {b.pnr}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <StatusPill status={b.status} />
                  {b.upcoming && (
                    <span className="text-[9px] font-bold bg-blue-50 text-[#2563EB] px-2 py-0.5 rounded-full border border-blue-100 uppercase tracking-wider">
                      Upcoming
                    </span>
                  )}
                </div>
              </div>

              {/* Route timeline details */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                {/* Route times and codes */}
                <div className="md:col-span-2 flex items-center gap-4">
                  <div className="text-left">
                    <p className="text-xl font-black text-slate-900 leading-none">{b.departure}</p>
                    <p className="text-xs font-bold text-slate-800 mt-1">{b.from} ({b.fromCode})</p>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <span className="text-[9px] font-bold text-slate-400 mb-1">{formatDate(b.date)}</span>
                    <div className="w-full flex items-center gap-1.5">
                      <div className="flex-1 border-t-2 border-[#E2E8F0] border-dashed" />
                      <Plane size={14} className="text-[#2563EB] rotate-90" />
                      <div className="flex-1 border-t-2 border-[#E2E8F0] border-dashed" />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-slate-900 leading-none">{b.arrival}</p>
                    <p className="text-xs font-bold text-slate-800 mt-1">{b.to} ({b.toCode})</p>
                  </div>
                </div>

                {/* Baggage / Seat info */}
                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                  <div>
                    <span className="text-[8px] font-bold text-slate-400 block uppercase">Class</span>
                    <span className="text-xs font-extrabold text-slate-800">{b.class}</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-bold text-slate-400 block uppercase">Seat</span>
                    <span className="text-xs font-extrabold text-slate-800">{b.seat || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-bold text-slate-400 block uppercase">Gate</span>
                    <span className="text-xs font-extrabold text-slate-800">{b.gate || '—'}</span>
                  </div>
                </div>

                {/* Price / Cancel Button */}
                <div className="flex md:flex-col items-center md:items-end justify-between gap-3">
                  <div className="md:text-right">
                    <span className="text-[8px] font-bold text-slate-400 block uppercase leading-none mb-0.5">Paid Amount</span>
                    <strong className="text-lg font-black text-[#0F172A]">{formatCurrency(b.price)}</strong>
                  </div>
                  {b.status === 'Confirmed' && (
                    <button
                      onClick={() => handleCancelBooking(b.id)}
                      disabled={cancellingId === b.id}
                      className="border border-red-200 text-red-500 hover:bg-red-50 disabled:opacity-50 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 flex items-center gap-1"
                    >
                      <Trash2 size={13} />
                      {cancellingId === b.id ? 'Cancelling...' : 'Cancel Flight'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
