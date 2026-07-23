import { useState, useEffect } from 'react'
import { Tag, Calendar, Gift, Check, Copy, Loader2 } from 'lucide-react'
import { apiFetch } from '../utils/api'

// The DB doesn't store a card gradient — it's purely cosmetic, so we
// derive one from the badge text to keep cards visually varied.
const GRADIENTS = {
  HOT: 'from-orange-500 to-red-600',
  LIMITED: 'from-purple-600 to-indigo-700',
  NEW: 'from-emerald-500 to-teal-600',
  'BANK OFFER': 'from-blue-600 to-blue-800',
}

export default function Offers() {
  const [copiedCode, setCopiedCode] = useState(null)
  const [offersData, setOffersData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    apiFetch('/offers')
      .then((res) => setOffersData(res.data.offers))
      .catch((err) => setError(err.message || 'Could not load offers.'))
      .finally(() => setLoading(false))
  }, [])

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => {
      setCopiedCode(null)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold text-[#2563EB] uppercase tracking-wider">Promotions</p>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] mt-1">Special Offers</h1>
        <p className="text-[#64748B] text-sm mt-1">Exclusive discounts, cashback offers, and airline promo deals.</p>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center gap-2 text-slate-400 py-16">
          <Loader2 size={18} className="animate-spin" />
          <span className="text-sm font-semibold">Loading offers...</span>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-150 rounded-xl">
          {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && offersData.length === 0 && (
        <div className="p-8 text-center text-sm text-slate-400 bg-slate-50 rounded-2xl">
          No active offers right now — check back soon.
        </div>
      )}

      {/* Grid of Offers */}
      {!loading && !error && offersData.length > 0 && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {offersData.map((o) => (
          <div
            key={o.id}
            className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
          >
            {/* Top colored strip with discount badge */}
            <div className={`bg-gradient-to-r ${GRADIENTS[o.badge] || 'from-blue-600 to-blue-800'} p-5 text-white flex justify-between items-start`}>
              <div className="space-y-1">
                <span className="text-[9px] font-extrabold bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {o.badge || 'PROMO'}
                </span>
                <h3 className="font-extrabold text-base md:text-lg pt-1">{o.title}</h3>
              </div>
              <span className="text-sm font-black bg-white text-slate-800 px-3 py-1.5 rounded-xl shadow-sm tracking-tight">
                {o.discount}
              </span>
            </div>

            {/* Description & Code details */}
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <p className="text-xs text-slate-600 leading-relaxed font-semibold">{o.description}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-50 gap-4 flex-wrap">
                {/* Promo Code tag */}
                <div className="flex items-center gap-2">
                  <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl px-3 py-2 flex items-center gap-1.5">
                    <Tag size={13} className="text-slate-400" />
                    <span className="font-mono font-black text-slate-800 text-xs tracking-wider uppercase select-all">
                      {o.code}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(o.code)}
                    className="text-[#2563EB] hover:text-blue-700 hover:bg-blue-50 p-2 rounded-xl transition-all"
                    title="Copy Code"
                  >
                    {copiedCode === o.code ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                  </button>
                </div>

                {/* Expiry Details */}
                <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                  <Calendar size={11} />
                  Valid till: {o.valid_until ? new Date(o.valid_until).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Terms and conditions notice */}
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center gap-2.5">
        <Gift size={18} className="text-[#2563EB]" />
        <p className="text-xs text-slate-500 font-semibold leading-relaxed">
          Offers are subject to availability. Only one promo code can be applied per flight booking request.
        </p>
      </div>
    </div>
  )
}
