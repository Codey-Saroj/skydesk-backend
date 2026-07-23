import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRightLeft, Calendar, Users, ChevronDown, Search } from 'lucide-react'
import { extractAirportCode } from '../utils/mappers'

const cabinClasses = ['Economy', 'Premium Economy', 'Business', 'First Class']

const tripTypes = [
  { id: 'one-way', label: 'One Way' },
  { id: 'round', label: 'Round Trip' },
  { id: 'multi', label: 'Multi-City' },
]

export default function SearchFlightCard() {
  const navigate = useNavigate()
  const [tripType, setTripType] = useState('round')
  const [from, setFrom] = useState('Delhi (DEL)')
  const [to, setTo] = useState('Mumbai (BOM)')
  const [departure, setDeparture] = useState('2026-07-18')
  const [returnDate, setReturnDate] = useState('2026-07-22')
  const [passengers, setPassengers] = useState(1)
  const [cabinClass, setCabinClass] = useState('Economy')
  const [classOpen, setClassOpen] = useState(false)
  const [travOpen, setTravOpen] = useState(false)

  const swapCities = () => {
    const temp = from
    setFrom(to)
    setTo(temp)
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-[#E2E8F0] overflow-visible">

      {/* ── Top row: Trip type + Economy + Travellers ─────────── */}
      <div className="flex flex-wrap items-center gap-1 px-6 pt-5 pb-0 border-b border-slate-100">
        {/* Trip type tabs */}
        <div className="flex items-center gap-0.5 mr-4">
          {tripTypes.map(t => (
            <button
              key={t.id}
              onClick={() => setTripType(t.id)}
              className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-all border-b-2 pb-3
                ${tripType === t.id
                  ? 'text-[#2563EB] border-[#2563EB]'
                  : 'text-slate-400 border-transparent hover:text-slate-600 hover:border-slate-200'
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-auto pb-3">
          {/* Economy dropdown */}
          <div className="relative">
            <button
              onClick={() => { setClassOpen(!classOpen); setTravOpen(false) }}
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 border border-[#E2E8F0] rounded-lg px-3 py-1.5 hover:bg-slate-50 transition-colors"
            >
              {cabinClass}
              <ChevronDown size={14} className="text-slate-400" />
            </button>
            {classOpen && (
              <div className="absolute top-full right-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-30 overflow-hidden">
                {cabinClasses.map(c => (
                  <button
                    key={c}
                    onClick={() => { setCabinClass(c); setClassOpen(false) }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[#DBEAFE] transition-colors ${c === cabinClass ? 'text-[#2563EB] font-semibold bg-[#DBEAFE]' : 'text-slate-700'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Travellers dropdown */}
          <div className="relative">
            <button
              onClick={() => { setTravOpen(!travOpen); setClassOpen(false) }}
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 border border-[#E2E8F0] rounded-lg px-3 py-1.5 hover:bg-slate-50 transition-colors"
            >
              <Users size={14} className="text-slate-500" />
              {passengers} Traveller{passengers > 1 ? 's' : ''}
              <ChevronDown size={14} className="text-slate-400" />
            </button>
            {travOpen && (
              <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-30 p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Travellers</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">Adults</span>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setPassengers(Math.max(1, passengers - 1))} className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-[#2563EB] hover:text-[#2563EB] font-bold text-lg leading-none transition-colors">−</button>
                    <span className="text-slate-800 font-bold text-sm w-4 text-center">{passengers}</span>
                    <button onClick={() => setPassengers(Math.min(9, passengers + 1))} className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-[#2563EB] hover:text-[#2563EB] font-bold text-lg leading-none transition-colors">+</button>
                  </div>
                </div>
                <button onClick={() => setTravOpen(false)} className="mt-4 w-full bg-[#2563EB] text-white text-xs font-bold py-2 rounded-lg hover:bg-[#1D4ED8] transition-colors">Done</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 pt-5">
        {/* ── From / To row ────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row items-stretch gap-3 mb-5 relative">
          {/* From */}
          <div className="flex-1 relative">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">From</label>
            <div className="border-2 border-[#E2E8F0] rounded-xl px-4 py-3 focus-within:border-[#2563EB] transition-colors bg-[#F8FAFC] focus-within:bg-white">
              <input
                type="text"
                value={from}
                onChange={e => setFrom(e.target.value)}
                className="w-full bg-transparent text-[#0F172A] font-semibold text-base focus:outline-none placeholder-slate-300"
                placeholder="City or Airport"
              />
              <p className="text-xs text-[#64748B] mt-0.5">Indira Gandhi International</p>
            </div>
          </div>

          {/* Swap button — circular, centred */}
          <div className="flex items-end justify-center pb-1 shrink-0 md:relative md:z-10">
            <button
              onClick={swapCities}
              className="w-10 h-10 rounded-full bg-white border-2 border-[#E2E8F0] flex items-center justify-center text-[#2563EB] hover:bg-[#DBEAFE] hover:border-[#2563EB] transition-all shadow-sm"
              aria-label="Swap cities"
            >
              <ArrowRightLeft size={16} />
            </button>
          </div>

          {/* To */}
          <div className="flex-1 relative">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">To</label>
            <div className="border-2 border-[#E2E8F0] rounded-xl px-4 py-3 focus-within:border-[#2563EB] transition-colors bg-[#F8FAFC] focus-within:bg-white">
              <input
                type="text"
                value={to}
                onChange={e => setTo(e.target.value)}
                className="w-full bg-transparent text-[#0F172A] font-semibold text-base focus:outline-none placeholder-slate-300"
                placeholder="City or Airport"
              />
              <p className="text-xs text-[#64748B] mt-0.5">Chhatrapati Shivaji International</p>
            </div>
          </div>
        </div>

        {/* ── Dates row ────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          {/* Departure */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              <Calendar size={11} className="inline mr-1" />Departure
            </label>
            <div className="border-2 border-[#E2E8F0] rounded-xl px-4 py-3 focus-within:border-[#2563EB] transition-colors bg-[#F8FAFC] focus-within:bg-white">
              <input
                type="date"
                value={departure}
                onChange={e => setDeparture(e.target.value)}
                className="w-full bg-transparent text-[#0F172A] font-semibold text-sm focus:outline-none"
              />
            </div>
          </div>

          {/* Return */}
          <div className={tripType === 'one-way' ? 'opacity-40 pointer-events-none' : ''}>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              <Calendar size={11} className="inline mr-1" />Return
            </label>
            <div className="border-2 border-[#E2E8F0] rounded-xl px-4 py-3 focus-within:border-[#2563EB] transition-colors bg-[#F8FAFC] focus-within:bg-white">
              <input
                type="date"
                value={returnDate}
                onChange={e => setReturnDate(e.target.value)}
                className="w-full bg-transparent text-[#0F172A] font-semibold text-sm focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* ── Search button ────────────────────────────────────── */}
        <button
          onClick={() => {
            const params = new URLSearchParams({
              origin: extractAirportCode(from),
              destination: extractAirportCode(to),
              date: departure,
              cabin_class: cabinClass,
              passengers: String(passengers),
            })
            navigate(`/search-results?${params.toString()}`)
          }}
          className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white py-4 rounded-xl font-bold text-base flex items-center justify-center gap-3 transition-all shadow-md hover:shadow-lg hover:shadow-blue-200 active:scale-[0.99]"
        >
          <Search size={20} />
          Search Flights
        </button>
      </div>
    </div>
  )
}
