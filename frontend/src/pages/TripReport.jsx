import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  MapPin, ChevronDown, ChevronUp, PlaneTakeoff,
  ReceiptText, PlusCircle, Calendar, IndianRupee
} from 'lucide-react'
import { useExpenseStore } from '../hooks/useExpenses'
import expenseData from '../data/expenses.json'
import { formatCurrency, formatDate } from '../utils/formatters'
import StatusPill from '../components/StatusPill'

const { flightBookings, trips, expenseCategories } = expenseData

const tripStatusBadge = {
  Completed: 'bg-slate-100 text-slate-600',
  Upcoming: 'bg-blue-50 text-[#2563EB]',
  Active: 'bg-green-50 text-green-700'
}

export default function TripReport() {
  const { expenses } = useExpenseStore()
  const [expanded, setExpanded] = useState(trips[0]?.id ?? null)

  const tripData = useMemo(() => {
    return trips.map((trip) => {
      const tripBookings = flightBookings.filter((b) => b.tripId === trip.id)
      const tripExpenses = expenses.filter((e) => e.tripId === trip.id)
      const expenseTotal = tripExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0)
      const bookingTotal = tripBookings.reduce((sum, b) => sum + Number(b.price || 0), 0)
      const total = expenseTotal + bookingTotal

      const breakdown = expenseCategories
        .map((cat) => ({
          ...cat,
          value: tripExpenses
            .filter((e) => e.category === cat.key)
            .reduce((sum, e) => sum + Number(e.amount || 0), 0)
        }))
        .filter((c) => c.value > 0)

      return { ...trip, tripBookings, tripExpenses, expenseTotal, bookingTotal, total, breakdown }
    })
  }, [expenses])

  const grandTotal = tripData.reduce((sum, t) => sum + t.total, 0)

  function toggle(id) {
    setExpanded((prev) => (prev === id ? null : id))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#2563EB] uppercase tracking-wider">Travel &amp; Expense</p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] mt-1">My Trips</h1>
          <p className="text-[#64748B] text-sm mt-1">
            See flights, stay, and every logged expense in one place.
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E2E8F0] px-5 py-3 text-right shadow-sm shrink-0">
          <p className="text-xs text-[#64748B] font-medium uppercase tracking-wider">All trips, total</p>
          <p className="text-2xl font-extrabold text-[#0F172A] mt-0.5">{formatCurrency(grandTotal)}</p>
        </div>
      </div>

      {/* Trip Cards */}
      <div className="space-y-4">
        {tripData.map((trip) => {
          const isOpen = expanded === trip.id
          return (
            <div key={trip.id} className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
              {/* Trip Header */}
              <button
                onClick={() => toggle(trip.id)}
                className="w-full flex items-center gap-4 px-6 py-5 hover:bg-slate-50 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-[#2563EB]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-bold text-[#0F172A]">{trip.title}</h2>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${tripStatusBadge[trip.status] ?? tripStatusBadge.Upcoming}`}>
                      {trip.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1 text-xs text-[#64748B]">
                      <Calendar size={11} />
                      {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[#64748B]">
                      <MapPin size={11} />
                      {trip.destination}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-extrabold text-[#0F172A]">{formatCurrency(trip.total)}</p>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    {trip.tripExpenses.length} expense{trip.tripExpenses.length !== 1 ? 's' : ''}
                  </p>
                </div>
                {isOpen ? <ChevronUp size={18} className="text-[#64748B] shrink-0" /> : <ChevronDown size={18} className="text-[#64748B] shrink-0" />}
              </button>

              {/* Expanded Content */}
              {isOpen && (
                <div className="border-t border-[#E2E8F0] divide-y divide-[#E2E8F0]">
                  {/* Flights */}
                  {trip.tripBookings.length > 0 && (
                    <div className="px-6 py-4">
                      <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-3 flex items-center gap-2">
                        <PlaneTakeoff size={13} />
                        Flights
                      </h3>
                      <div className="space-y-2">
                        {trip.tripBookings.map((b) => (
                          <div key={b.id} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3">
                            <div>
                              <p className="text-sm font-semibold text-[#0F172A]">
                                {b.airline} {b.flightNo} · {b.from} → {b.to}
                              </p>
                              <p className="text-xs text-[#64748B] mt-0.5">
                                {formatDate(b.date)} · {b.depart} – {b.arrive} · PNR: {b.pnr}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <StatusPill status={b.status} />
                              <span className="font-bold text-[#0F172A] text-sm">{formatCurrency(b.price)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Expenses */}
                  <div className="px-6 py-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-wider flex items-center gap-2">
                        <ReceiptText size={13} />
                        Logged Expenses
                      </h3>
                      <Link
                        to="/expenses/new"
                        className="flex items-center gap-1 text-xs text-[#2563EB] font-semibold hover:underline"
                      >
                        <PlusCircle size={12} />
                        Add
                      </Link>
                    </div>
                    {trip.tripExpenses.length === 0 ? (
                      <p className="text-xs text-[#64748B] italic">No expenses logged for this trip.</p>
                    ) : (
                      <div className="space-y-2">
                        {trip.tripExpenses.map((e) => (
                          <div key={e.id} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3">
                            <div>
                              <p className="text-sm font-semibold text-[#0F172A]">{e.merchant}</p>
                              <p className="text-xs text-[#64748B] mt-0.5 capitalize">{e.category}{e.description ? ` · ${e.description}` : ''}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <StatusPill status={e.status} />
                              <span className="font-bold text-[#0F172A] text-sm">{formatCurrency(Number(e.amount))}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Category Breakdown */}
                  {trip.breakdown.length > 0 && (
                    <div className="px-6 py-4 bg-slate-50">
                      <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-3 flex items-center gap-2">
                        <IndianRupee size={13} />
                        Expense Breakdown
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {trip.breakdown.map((cat) => (
                          <div key={cat.key} className="flex items-center gap-2 bg-white rounded-xl border border-[#E2E8F0] px-3 py-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                            <span className="text-xs font-medium text-[#64748B]">{cat.label}</span>
                            <span className="text-xs font-bold text-[#0F172A]">{formatCurrency(cat.value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Trip Total */}
                  <div className="px-6 py-3 flex items-center justify-between bg-blue-50">
                    <span className="text-sm font-bold text-[#0F172A]">Trip Total</span>
                    <span className="text-lg font-extrabold text-[#2563EB]">{formatCurrency(trip.total)}</span>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
