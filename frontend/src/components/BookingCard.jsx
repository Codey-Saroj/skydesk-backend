import { Download, Eye, Plane } from 'lucide-react'

const statusConfig = {
  Confirmed: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-800',
    dot: 'bg-emerald-500',
    label: 'Confirmed',
    ring: 'ring-1 ring-emerald-200',
  },
  Completed: {
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    dot: 'bg-slate-500',
    label: 'Completed',
    ring: 'ring-1 ring-slate-200',
  },
  Cancelled: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    dot: 'bg-red-500',
    label: 'Cancelled',
    ring: 'ring-1 ring-red-200',
  },
  Pending: {
    bg: 'bg-amber-100',
    text: 'text-amber-800',
    dot: 'bg-amber-500',
    label: 'Pending',
    ring: 'ring-1 ring-amber-200',
  },
}

export default function BookingCard({ booking }) {
  const status = statusConfig[booking.status] || statusConfig.Pending

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    })
  }

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#DBEAFE] flex items-center justify-center shrink-0">
            <Plane size={14} className="text-[#2563EB]" />
          </div>
          <div>
            <p className="font-semibold text-[#0F172A] text-sm">{booking.flightNumber}</p>
            <p className="text-xs text-[#64748B]">{booking.bookingId}</p>
          </div>
        </div>
        {/* High-contrast status badge */}
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${status.bg} ${status.text} ${status.ring}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </div>

      {/* Route */}
      <div className="flex items-center gap-2 mb-3">
        <div>
          <p className="font-extrabold text-[#0F172A] text-lg leading-none">{booking.fromCode}</p>
          <p className="text-xs text-[#64748B]">{booking.from}</p>
        </div>
        <div className="flex-1 flex items-center gap-1">
          <div className="flex-1 h-px bg-slate-200" />
          <Plane size={12} className="text-slate-300 fill-slate-300" />
          <div className="flex-1 h-px bg-slate-200" />
        </div>
        <div className="text-right">
          <p className="font-extrabold text-[#0F172A] text-lg leading-none">{booking.toCode}</p>
          <p className="text-xs text-[#64748B]">{booking.to}</p>
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center justify-between text-xs text-[#64748B] mb-3 pb-3 border-b border-[#E2E8F0]">
        <span>{formatDate(booking.date)}</span>
        <span>{booking.class}</span>
        <span className="font-bold text-[#0F172A] text-sm">₹{booking.price.toLocaleString()}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#2563EB] border border-[#DBEAFE] rounded-lg py-2 hover:bg-[#DBEAFE] transition-colors">
          <Eye size={13} />
          View Details
        </button>
        {booking.status !== 'Cancelled' && (
          <button className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#64748B] border border-[#E2E8F0] rounded-lg py-2 hover:bg-slate-50 transition-colors">
            <Download size={13} />
            Download
          </button>
        )}
      </div>
    </div>
  )
}
