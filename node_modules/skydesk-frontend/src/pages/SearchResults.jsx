import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { Calendar, Filter, ArrowRight, ArrowLeftRight, Clock, ShieldCheck, Tag, Info, Loader2 } from 'lucide-react'
import { formatCurrency } from '../utils/formatters'
import { apiFetch } from '../utils/api'
import { mapFlight } from '../utils/mappers'

export default function SearchResults() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const origin = searchParams.get('origin') || ''
  const destination = searchParams.get('destination') || ''
  const date = searchParams.get('date') || ''
  const cabinClass = searchParams.get('cabin_class') || ''
  const passengers = searchParams.get('passengers') || '1'

  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [sort, setSort] = useState('Best')
  const [maxPrice, setMaxPrice] = useState(50000)
  const [selectedStops, setSelectedStops] = useState([])
  const [selectedAirlines, setSelectedAirlines] = useState([])

  useEffect(() => {
    setLoading(true)
    setError('')
    const params = new URLSearchParams()
    if (origin) params.set('origin', origin)
    if (destination) params.set('destination', destination)
    if (date) params.set('date', date)
    if (cabinClass) params.set('cabin_class', cabinClass)

    apiFetch(`/flights?${params.toString()}`, { auth: true })
      .then((res) => {
        const mapped = res.data.flights.map(mapFlight)
        setFlights(mapped)
        // Reset the price filter to comfortably fit whatever came back
        if (mapped.length > 0) {
          setMaxPrice(Math.max(...mapped.map((f) => f.price)))
        }
      })
      .catch((err) => setError(err.message || 'Could not load flights.'))
      .finally(() => setLoading(false))
  }, [origin, destination, date, cabinClass])

  // Airlines available in this result set — built from real data instead
  // of a hardcoded list, since different routes have different airlines.
  const availableAirlines = useMemo(
    () => [...new Set(flights.map((f) => f.airline))],
    [flights]
  )

  // Filter list of flights
  const filteredFlights = useMemo(() => {
    return flights
      .filter((f) => f.price <= maxPrice)
      .filter((f) => {
        if (selectedStops.length === 0) return true
        return selectedStops.includes(f.stops)
      })
      .filter((f) => {
        if (selectedAirlines.length === 0) return true
        return selectedAirlines.includes(f.airline)
      })
  }, [flights, maxPrice, selectedStops, selectedAirlines])

  // Sort list of flights
  const sortedFlights = useMemo(() => {
    const list = [...filteredFlights]
    if (sort === 'Cheapest') {
      return list.sort((a, b) => a.price - b.price)
    } else if (sort === 'Fastest') {
      // Parse duration e.g. "7h 15m" to minutes
      const toMins = (dur) => {
        const parts = dur.split(' ')
        let mins = 0
        parts.forEach((p) => {
          if (p.includes('h')) mins += parseInt(p) * 60
          if (p.includes('m')) mins += parseInt(p)
        })
        return mins
      }
      return list.sort((a, b) => toMins(a.duration) - toMins(b.duration))
    }
    // "Best" is default order
    return list
  }, [filteredFlights, sort])

  const toggleStop = (stop) => {
    setSelectedStops((prev) =>
      prev.includes(stop) ? prev.filter((s) => s !== stop) : [...prev, stop]
    )
  }

  const toggleAirline = (airline) => {
    setSelectedAirlines((prev) =>
      prev.includes(airline) ? prev.filter((a) => a !== airline) : [...prev, airline]
    )
  }

  return (
    <div className="space-y-6">
      {/* ── Summary Bar ──────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-700">
          <span className="font-bold flex items-center gap-1">
            {origin || '—'} <ArrowLeftRight size={14} className="text-slate-400" /> {destination || '—'}
          </span>
          <span className="text-slate-300">|</span>
          <span className="font-medium">{date ? new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Any date'}</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full text-xs font-semibold">
            {passengers} {parseInt(passengers, 10) === 1 ? 'Adult' : 'Adults'} · {cabinClass || 'Any class'}
          </span>
        </div>
        <Link
          to="/dashboard"
          className="text-xs font-bold text-[#2563EB] hover:text-blue-700 border border-[#DBEAFE] px-4 py-2 rounded-xl hover:bg-[#DBEAFE]/30 transition-colors shrink-0 text-center"
        >
          Modify Search
        </Link>
      </div>

      {/* ── Main Layout (Sidebar + Results) ─────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Filters Sidebar */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Filter size={16} className="text-slate-400" /> Filters
            </span>
            <button
              onClick={() => {
                setMaxPrice(50000)
                setSelectedStops([])
                setSelectedAirlines([])
              }}
              className="text-xs text-[#2563EB] font-bold hover:underline"
            >
              Reset All
            </button>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-500 uppercase tracking-wider">Price Range</span>
              <span className="text-[#2563EB]">{formatCurrency(maxPrice)} max</span>
            </div>
            <input
              type="range"
              min="30000"
              max="50000"
              step="1000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#2563EB]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
              <span>{formatCurrency(30000)}</span>
              <span>{formatCurrency(50000)}</span>
            </div>
          </div>

          {/* Stops Filter */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Stops</span>
            <div className="space-y-2">
              {['Non-stop', '1 stop', '2+ stops'].map((stop) => (
                <label key={stop} className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={selectedStops.includes(stop)}
                    onChange={() => toggleStop(stop)}
                    className="w-4 h-4 rounded text-[#2563EB] border-slate-300 focus:ring-[#2563EB]"
                  />
                  <span>{stop}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Airlines Filter */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Airlines</span>
            <div className="space-y-2">
              {availableAirlines.map((airline) => (
                <label key={airline} className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={selectedAirlines.includes(airline)}
                    onChange={() => toggleAirline(airline)}
                    className="w-4 h-4 rounded text-[#2563EB] border-slate-300 focus:ring-[#2563EB]"
                  />
                  <span>{airline}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Flight List */}
        <div className="lg:col-span-3 space-y-4">
          {/* Sorting / Showing bar */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Showing {sortedFlights.length} of {flights.length} flight{flights.length !== 1 ? 's' : ''}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 font-bold mr-1">Sort by:</span>
              {['Best', 'Cheapest', 'Fastest'].map((x) => (
                <button
                  key={x}
                  onClick={() => setSort(x)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    sort === x
                      ? 'bg-[#2563EB] text-white shadow-sm shadow-blue-100'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {x}
                </button>
              ))}
            </div>
          </div>

          {/* Flight Card List */}
          {loading ? (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center shadow-sm flex items-center justify-center gap-2 text-slate-400">
              <Loader2 size={18} className="animate-spin" />
              <span className="text-sm font-semibold">Searching flights...</span>
            </div>
          ) : error ? (
            <div className="bg-white rounded-2xl border border-red-150 bg-red-50 p-6 text-center shadow-sm">
              <p className="text-sm text-red-700 font-semibold">{error}</p>
            </div>
          ) : sortedFlights.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center shadow-sm">
              <Info size={32} className="text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 text-lg">No Flights Match Your Filters</h3>
              <p className="text-slate-500 text-sm mt-1">Try resetting your filters, or search a different route/date.</p>
            </div>
          ) : (
            sortedFlights.map((f) => (
              <div
                key={f.id}
                className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm hover:border-[#2563EB]/30 transition-all hover:shadow-md relative overflow-hidden group"
              >
                {/* Accent strip left */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#2563EB] to-blue-300 opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Top Badge */}
                {f.tag && (
                  <div className="absolute top-0 right-0 bg-blue-50 text-[#2563EB] text-[10px] font-extrabold px-3 py-1 rounded-bl-xl border-l border-b border-[#DBEAFE] uppercase tracking-wider flex items-center gap-1 shadow-sm">
                    <Tag size={10} className="fill-current" /> {f.tag}
                  </div>
                )}

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  {/* Airline Branding */}
                  <div className="flex items-center gap-3 min-w-[160px]">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-slate-800 tracking-tighter text-sm">
                      {f.airline.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{f.airline}</h4>
                      <p className="text-[11px] text-slate-400 font-bold">{f.code}</p>
                    </div>
                  </div>

                  {/* Route Timeline */}
                  <div className="flex-1 flex items-center gap-4">
                    {/* Departure */}
                    <div className="text-right">
                      <p className="text-lg font-black text-slate-900 leading-none">{f.depart}</p>
                      <p className="text-xs font-extrabold text-slate-400 mt-1">{f.from}</p>
                    </div>

                    {/* Timeline bar */}
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

                    {/* Arrival */}
                    <div>
                      <p className="text-lg font-black text-slate-900 leading-none">{f.arrive}</p>
                      <p className="text-xs font-extrabold text-slate-400 mt-1">{f.to}</p>
                    </div>
                  </div>

                  {/* Pricing and Action */}
                  <div className="flex items-center md:items-end justify-between md:flex-col gap-3 min-w-[140px] pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="md:text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-none mb-1">
                        Economy
                      </span>
                      <strong className="text-xl font-black text-[#2563EB]">
                        {formatCurrency(f.price)}
                      </strong>
                      <span className="text-[10px] text-slate-400 block font-semibold mt-0.5">
                        incl. taxes & fees
                      </span>
                    </div>

                    <button
                      onClick={() => navigate(`/flights/${f.id}`)}
                      className="bg-[#2563EB] hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-sm hover:shadow-md hover:shadow-blue-100 transition-all flex items-center gap-1.5 active:scale-95 shrink-0"
                    >
                      Select Flight
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Secure booking guarantee banner */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-start sm:items-center gap-3">
            <ShieldCheck className="text-emerald-500 shrink-0 mt-0.5 sm:mt-0" size={18} />
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Prices match policy guarantee. PCI-DSS secure booking with 256-bit SSL encryption. Zero hidden fees.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
