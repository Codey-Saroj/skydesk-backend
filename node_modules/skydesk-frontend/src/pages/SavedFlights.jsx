import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Bookmark, Clock, Trash2, Search, Plane, Tag, Info, ArrowRight } from 'lucide-react'
import { formatCurrency } from '../utils/formatters'

export default function SavedFlights() {
  const navigate = useNavigate()
  const [saved, setSaved] = useState([
    {
      id: 'FL-2291',
      airline: 'IndiGo',
      flightNo: '6E 2291',
      from: 'DEL',
      to: 'BOM',
      depart: '06:15',
      arrive: '08:20',
      duration: '2h 05m',
      stops: 'Non-stop',
      price: 4820,
      cabin: 'Economy',
      savedOn: '2026-07-10'
    },
    {
      id: 'FL-INT1',
      airline: 'British Airways',
      code: 'BA 178',
      flightNo: 'BA 178',
      from: 'JFK',
      to: 'LHR',
      depart: '09:15',
      arrive: '21:30',
      duration: '7h 15m',
      stops: 'Non-stop',
      price: 33440,
      cabin: 'Economy',
      savedOn: '2026-07-12'
    }
  ])

  const handleRemove = (id) => {
    setSaved(prev => prev.filter(item => item.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#2563EB] uppercase tracking-wider">My Flights</p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] mt-1">Saved Flights</h1>
          <p className="text-[#64748B] text-sm mt-1">Track prices and quickly book flights you have shortlisted.</p>
        </div>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-orange-600 text-white font-bold px-5 py-3 rounded-xl shadow-md hover:shadow-orange-200 transition-all active:scale-95 shrink-0 text-sm"
        >
          <Search size={16} />
          Find Flights
        </Link>
      </div>

      {/* Main List */}
      <div className="space-y-4">
        {saved.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center shadow-sm">
            <Bookmark size={32} className="text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-base">No Saved Flights</h3>
            <p className="text-slate-500 text-xs mt-1">Shortlist flights from your searches to keep track of them here.</p>
          </div>
        ) : (
          saved.map((f) => (
            <div
              key={f.id}
              className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm hover:border-[#2563EB]/20 transition-all relative overflow-hidden group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                {/* Airline branding */}
                <div className="flex items-center gap-3 min-w-[160px]">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-slate-800 tracking-tighter text-sm">
                    {f.airline.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{f.airline}</h4>
                    <p className="text-[11px] text-slate-400 font-bold">{f.flightNo}</p>
                  </div>
                </div>

                {/* Route timeline details */}
                <div className="flex-1 flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-black text-slate-900 leading-none">{f.depart}</p>
                    <p className="text-xs font-extrabold text-slate-400 mt-1">{f.from}</p>
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="text-[10px] font-bold text-slate-400 mb-1 flex items-center gap-1">
                      <Clock size={10} />
                      {f.duration}
                    </div>
                    <div className="w-full flex items-center gap-1.5">
                      <div className="flex-1 border-t-2 border-[#E2E8F0] border-dashed" />
                      <div className="w-2 h-2 rounded-full border-2 border-[#2563EB] bg-white shrink-0" />
                      <div className="flex-1 border-t-2 border-[#E2E8F0] border-dashed" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 mt-1 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                      {f.stops}
                    </span>
                  </div>

                  <div>
                    <p className="text-lg font-black text-slate-900 leading-none">{f.arrive}</p>
                    <p className="text-xs font-extrabold text-slate-400 mt-1">{f.to}</p>
                  </div>
                </div>

                {/* Pricing / Actions */}
                <div className="flex items-center md:items-end justify-between md:flex-col gap-3 min-w-[150px] pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="md:text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-none mb-1">
                      {f.cabin}
                    </span>
                    <strong className="text-lg font-black text-[#2563EB]">{formatCurrency(f.price)}</strong>
                    <span className="text-[10px] text-slate-400 block font-semibold mt-0.5">Saved {f.savedOn}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRemove(f.id)}
                      className="border border-[#E2E8F0] hover:bg-red-50 hover:text-red-500 text-slate-400 p-2.5 rounded-xl transition-all shadow-sm"
                      title="Remove Flight"
                    >
                      <Trash2 size={14} />
                    </button>
                    <button
                      onClick={() => navigate(`/flights/${f.id}`)}
                      className="bg-[#2563EB] hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-sm hover:shadow-md hover:shadow-blue-100 transition-all flex items-center gap-1 active:scale-95 shrink-0"
                    >
                      Book Now
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
