import { Plane, ExternalLink } from 'lucide-react'

const statusStyles = {
  Confirmed: 'bg-emerald-100 text-emerald-800',
  Completed: 'bg-slate-100 text-slate-600',
  Cancelled: 'bg-red-100 text-red-700',
  Pending: 'bg-amber-100 text-amber-800',
}

export default function UpcomingTripCard({ booking }) {
  if (!booking) return null

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
    })
  }

  return (
    <div className="bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] rounded-2xl text-white shadow-lg shadow-blue-200 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full translate-x-20 -translate-y-20 pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-28 h-28 bg-white/5 rounded-full translate-y-12 pointer-events-none" />

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-blue-200 text-xs font-semibold uppercase tracking-wider mb-1">Upcoming Trip</p>
            <p className="text-white font-semibold text-sm">{formatDate(booking.date)}</p>
          </div>
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${statusStyles[booking.status]} shrink-0`}>
            {booking.status}
          </span>
        </div>

        {/* Flight route */}
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

        {/* Flight details */}
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

        {/* Airline + CTA */}
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
