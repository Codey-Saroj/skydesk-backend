import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ChevronLeft, PlaneTakeoff, PlaneLanding, Clock, Users,
  ShieldCheck, CheckCircle2, ArrowRight, Tag, Loader2
} from 'lucide-react'
import { formatCurrency } from '../utils/formatters'
import { apiFetch } from '../utils/api'
import { mapFlight } from '../utils/mappers'
import { useAuth } from '../context/AuthContext.jsx'

const airlineLogos = {
  IndiGo: '6E',
  'Air India': 'AI',
  Vistara: 'UK',
  'British Airways': 'BA',
  'Virgin Atlantic': 'VS',
  'American Airlines': 'AA'
}

const cabinBadge = {
  Economy: 'bg-blue-50 text-[#2563EB] border border-blue-200',
  Business: 'bg-amber-50 text-amber-700 border border-amber-200',
  'First Class': 'bg-purple-50 text-purple-700 border border-purple-200'
}

export default function FlightDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const [flight, setFlight] = useState(null)
  const [loadingFlight, setLoadingFlight] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    apiFetch(`/flights/${id}`, { auth: true })
      .then((res) => setFlight(mapFlight(res.data.flight)))
      .catch((err) => setLoadError(err.message || 'Could not load this flight.'))
      .finally(() => setLoadingFlight(false))
  }, [id])

  const [booked, setBooked] = useState(false)
  const [bookingResult, setBookingResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [bookError, setBookError] = useState('')

  const [fareClass, setFareClass] = useState('Economy Flex')
  const [selectedSeat, setSelectedSeat] = useState('14C')
  const [selectedExtras, setSelectedExtras] = useState([])

  if (loadingFlight) {
    return (
      <div className="flex items-center justify-center gap-2 text-slate-400 py-24">
        <Loader2 size={20} className="animate-spin" />
        <span className="text-sm font-semibold">Loading flight...</span>
      </div>
    )
  }

  if (loadError || !flight) {
    return (
      <div className="max-w-lg mx-auto bg-white rounded-2xl border border-[#E2E8F0] p-10 text-center shadow-sm">
        <p className="text-red-600 font-semibold text-sm">{loadError || 'Flight not found.'}</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 bg-[#2563EB] text-white font-semibold px-5 py-2.5 rounded-xl text-sm"
        >
          Back to Dashboard
        </button>
      </div>
    )
  }
  
  const fares = [
    { name: 'Economy Lite', price: Math.round(flight.price * 0.9), description: 'Cabin baggage 7kg, non-refundable' },
    { name: 'Economy Flex', price: flight.price, description: 'Cabin bag + 15kg check-in, free seat selection' },
    { name: 'Business Class', price: Math.round(flight.price * 3), description: '2 x 23kg check-in, business cabin, refund free, lounge access' }
  ]
  
  const selectedFareObj = fares.find(f => f.name === fareClass) || fares[1]
  const baseFare = selectedFareObj.price
  
  // Seat charge is 999 INR for premium row 1-3 seats
  const seatCharge = selectedSeat && (selectedSeat.startsWith('1') || selectedSeat.startsWith('2') || selectedSeat.startsWith('3')) ? 999 : 0
  
  const addOns = [
    { key: 'bag', label: 'Extra Checked Bag', price: 1500, description: 'Add 15kg extra checked bag' },
    { key: 'insurance', label: 'Travel Insurance', price: 499, description: 'Comprehensive travel coverage' },
    { key: 'boarding', label: 'Priority Boarding', price: 350, description: 'Board the aircraft first' },
    { key: 'lounge', label: 'Lounge Access', price: 1200, description: 'Relax at airport lounges' }
  ]
  
  const extrasTotal = selectedExtras.reduce((sum, key) => {
    const extra = addOns.find(a => a.key === key)
    return sum + (extra ? extra.price : 0)
  }, 0)

  const taxes = Math.round(baseFare * 0.12)
  const convFee = 299
  const total = baseFare + seatCharge + extrasTotal + taxes + convFee

  const toggleExtra = (key) => {
    setSelectedExtras(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    )
  }

  function handleBook() {
    if (!isAuthenticated) {
      navigate('/signin', { state: { from: `/flights/${id}` } })
      return
    }
    setBookError('')
    setLoading(true)
    apiFetch('/bookings', {
      method: 'POST',
      auth: true,
      body: { flight_id: flight.id, passengers: 1 },
    })
      .then((res) => {
        setBookingResult(res.data.booking)
        setBooked(true)
      })
      .catch((err) => setBookError(err.message || 'Booking failed. Please try again.'))
      .finally(() => setLoading(false))
  }

  if (booked) {
    return (
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-10 flex flex-col items-center text-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
            <CheckCircle2 size={32} className="text-green-600" />
          </div>
          <h1 className="text-xl font-bold text-[#0F172A]">Booking Confirmed!</h1>
          <p className="text-[#64748B] text-sm mt-2 leading-relaxed">
            {flight.airline} {flight.flightNo} · {flight.from} → {flight.to} has been added to your
            bookings.
          </p>
          <div className="mt-4 bg-slate-50 border border-[#E2E8F0] rounded-xl px-5 py-3 text-sm text-[#64748B] font-semibold">
            PNR: <span className="font-mono font-black text-[#0F172A] tracking-widest">
              {bookingResult?.pnr}
            </span>
          </div>
          <div className="mt-6 flex gap-3">
            <Link
              to="/bookings"
              className="bg-[#2563EB] hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-sm"
            >
              View My Trips
            </Link>
            <button
              onClick={() => navigate('/dashboard')}
              className="border border-[#E2E8F0] text-[#64748B] hover:bg-slate-50 font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Back to search */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#0F172A] transition-colors font-semibold"
      >
        <ChevronLeft size={16} />
        Back
      </button>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Config Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Flight Card */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-sm">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#2563EB] to-blue-500 px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{airlineLogos[flight.airline] ?? '✈'}</span>
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg leading-tight">{flight.airline}</p>
                    <p className="text-blue-100 text-sm font-medium">{flight.flightNo}</p>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${cabinBadge[flight.cabin] ?? cabinBadge.Economy}`}>
                  {flight.cabin}
                </span>
              </div>
            </div>

            {/* Route */}
            <div className="px-6 py-6 flex items-center gap-4">
              <div className="text-center">
                <p className="text-3xl font-extrabold text-[#0F172A]">{flight.depart}</p>
                <p className="text-sm font-bold text-[#64748B] mt-1">{flight.from}</p>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1">
                <div className="flex items-center gap-2 w-full">
                  <div className="flex-1 border-t-2 border-dashed border-[#E2E8F0]" />
                  <PlaneTakeoff size={18} className="text-[#2563EB]" />
                  <div className="flex-1 border-t-2 border-dashed border-[#E2E8F0]" />
                </div>
                <div className="flex items-center gap-1 text-xs text-[#64748B] font-semibold">
                  <Clock size={12} />
                  <span>{flight.duration}</span>
                </div>
                <span className="text-xs font-medium text-[#64748B]">{flight.stops}</span>
              </div>
              <div className="text-center">
                <p className="text-3xl font-extrabold text-[#0F172A]">{flight.arrive}</p>
                <p className="text-sm font-bold text-[#64748B] mt-1">{flight.to}</p>
              </div>
            </div>

            {/* Amenities */}
            <div className="px-6 pb-4 flex flex-wrap gap-2">
              {['Cabin baggage 7kg', '15kg check-in', 'Meal included', 'Web check-in'].map((a) => (
                <span key={a} className="text-xs bg-slate-50 border border-[#E2E8F0] text-[#64748B] px-3 py-1.5 rounded-full font-semibold">
                  {a}
                </span>
              ))}
            </div>

            {/* Seat availability */}
            <div className="mx-6 mb-5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 flex items-center gap-2">
              <Tag size={14} className="text-amber-600 shrink-0" />
              <p className="text-xs font-semibold text-amber-700">
                Only {flight.seatsLeft || 5} seats left at this price
              </p>
            </div>
          </div>

          {/* Section 1: Choose Your Fare */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm space-y-4">
            <div>
              <h2 className="text-lg font-bold text-[#0F172A]">Choose Your Fare</h2>
              <p className="text-xs text-[#64748B]">Select the fare tier that best fits your requirements</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {fares.map((f) => (
                <button
                  key={f.name}
                  onClick={() => setFareClass(f.name)}
                  className={`border rounded-2xl p-4 text-left transition-all ${
                    fareClass === f.name
                      ? 'border-[#2563EB] bg-blue-50/40 ring-1 ring-[#2563EB]'
                      : 'border-[#E2E8F0] hover:border-slate-300'
                  }`}
                >
                  <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">{f.name}</p>
                  <p className="text-xl font-extrabold text-[#0F172A] mt-1">{formatCurrency(f.price)}</p>
                  <p className="text-[10px] text-[#64748B] mt-2 leading-relaxed">{f.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Seat Selection */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm space-y-4">
            <div>
              <h2 className="text-lg font-bold text-[#0F172A]">Select Your Seat</h2>
              <p className="text-xs text-[#64748B]">Click an available seat to select. Selected seat: <span className="font-extrabold text-[#2563EB]">{selectedSeat}</span></p>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-xl border border-[#E2E8F0] overflow-x-auto">
              <div className="min-w-[340px] space-y-2">
                {Array.from({ length: 10 }, (_, i) => {
                  const row = i + 1
                  return (
                    <div key={row} className="flex items-center justify-between gap-1 max-w-sm mx-auto">
                      <span className="w-5 text-[10px] font-bold text-slate-400 text-center">{row}</span>
                      
                      <div className="flex gap-1">
                        {['A', 'B', 'C'].map((col, j) => {
                          const code = `${row}${col}`
                          const isOccupied = (row * 7 + j) % 4 === 0
                          const isSelected = selectedSeat === code
                          const isBusiness = row <= 3
                          return (
                            <button
                              key={code}
                              disabled={isOccupied}
                              onClick={() => setSelectedSeat(code)}
                              className={`h-7 w-7 text-[10px] font-bold rounded-lg transition-all ${
                                isOccupied
                                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                  : isSelected
                                  ? 'bg-[#2563EB] text-white shadow-sm ring-2 ring-blue-300'
                                  : isBusiness
                                  ? 'bg-amber-100 hover:bg-amber-200 text-amber-800 border border-amber-300'
                                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                              }`}
                            >
                              {col}
                            </button>
                          )
                        })}
                      </div>

                      {/* Aisle */}
                      <span className="text-[9px] font-extrabold text-slate-300 uppercase px-1">Aisle</span>

                      <div className="flex gap-1">
                        {['D', 'E', 'F'].map((col, j) => {
                          const code = `${row}${col}`
                          const isOccupied = (row * 5 + j + 2) % 4 === 0
                          const isSelected = selectedSeat === code
                          const isBusiness = row <= 3
                          return (
                            <button
                              key={code}
                              disabled={isOccupied}
                              onClick={() => setSelectedSeat(code)}
                              className={`h-7 w-7 text-[10px] font-bold rounded-lg transition-all ${
                                isOccupied
                                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                  : isSelected
                                  ? 'bg-[#2563EB] text-white shadow-sm ring-2 ring-blue-300'
                                  : isBusiness
                                  ? 'bg-amber-100 hover:bg-amber-200 text-amber-800 border border-amber-300'
                                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                              }`}
                            >
                              {col}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs font-semibold text-[#64748B] border-t border-slate-100 pt-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 bg-white border border-slate-200 rounded-md" />
                  <span>Standard</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 bg-amber-100 border border-amber-300 rounded-md" />
                  <span>Premium (Rows 1-3)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 bg-[#2563EB] rounded-md" />
                  <span>Selected</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 bg-slate-200 rounded-md" />
                  <span>Occupied</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Travel Extras */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm space-y-4">
            <div>
              <h2 className="text-lg font-bold text-[#0F172A]">Enhance Your Journey</h2>
              <p className="text-xs text-[#64748B]">Add travel extras to make your flight more comfortable</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {addOns.map((add) => {
                const isSelected = selectedExtras.includes(add.key)
                return (
                  <button
                    key={add.key}
                    onClick={() => toggleExtra(add.key)}
                    className={`border rounded-2xl p-4 text-left transition-all flex justify-between items-start gap-4 ${
                      isSelected
                        ? 'border-[#2563EB] bg-blue-50/40 ring-1 ring-[#2563EB]'
                        : 'border-[#E2E8F0] hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{add.label}</h4>
                      <p className="text-[10px] text-[#64748B] mt-1 leading-normal">{add.description}</p>
                    </div>
                    <span className={`text-xs font-extrabold shrink-0 px-2.5 py-1 rounded-lg transition-all ${
                      isSelected ? 'bg-[#2563EB] text-white' : 'bg-slate-100 text-[#0F172A]'
                    }`}>
                      +{formatCurrency(add.price)}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Sticky Summary Column */}
        <div className="space-y-4 lg:sticky lg:top-20">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
            <h2 className="font-bold text-[#0F172A] mb-4 text-base">Price Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-[#64748B]">Base fare ({fareClass})</span>
                <span className="font-semibold text-[#0F172A]">{formatCurrency(baseFare)}</span>
              </div>
              {seatCharge > 0 && (
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-[#64748B]">Premium Seat ({selectedSeat})</span>
                  <span className="font-semibold text-[#0F172A]">{formatCurrency(seatCharge)}</span>
                </div>
              )}
              {extrasTotal > 0 && (
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-[#64748B]">Travel Extras</span>
                  <span className="font-semibold text-slate-800">{formatCurrency(extrasTotal)}</span>
                </div>
              )}
              <div className="flex justify-between text-xs font-medium">
                <span className="text-[#64748B]">Taxes & fees (12%)</span>
                <span className="font-semibold text-[#0F172A]">{formatCurrency(taxes)}</span>
              </div>
              <div className="flex justify-between text-xs font-medium">
                <span className="text-[#64748B]">Convenience fee</span>
                <span className="font-semibold text-[#0F172A]">{formatCurrency(convFee)}</span>
              </div>
              
              <div className="border-t border-[#E2E8F0] pt-3 mt-1 flex justify-between items-center">
                <span className="font-bold text-slate-900 text-sm">Total Price</span>
                <span className="font-black text-[#2563EB] text-xl">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-2 text-[11px] text-[#64748B] font-semibold">
            <ShieldCheck size={14} className="text-green-500 shrink-0" />
            <span>Secure checkout. PCI-DSS compliant. No hidden fees.</span>
          </div>

          <p className="px-2 text-[10px] text-slate-400 leading-relaxed">
            Note: seat selection and add-ons are shown for preview only — checkout books the base fare for this flight.
          </p>

          {bookError && (
            <div className="px-4 py-3 text-xs text-red-700 bg-red-50 border border-red-150 rounded-xl font-semibold">
              {bookError}
            </div>
          )}

          <button
            onClick={handleBook}
            disabled={loading}
            className="w-full bg-[#F97316] hover:bg-orange-600 disabled:opacity-70 text-white font-bold py-4 rounded-2xl shadow-md hover:shadow-lg hover:shadow-orange-200 transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing Booking…
              </>
            ) : (
              <>
                <PlaneTakeoff size={18} />
                Book Now — {formatCurrency(flight.price)}
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
