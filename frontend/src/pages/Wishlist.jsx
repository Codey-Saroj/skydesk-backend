import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, Search, MapPin, Tag, Trash2, ArrowRight } from 'lucide-react'
import { formatCurrency } from '../utils/formatters'

export default function Wishlist() {
  const navigate = useNavigate()
  const [wishlist, setWishlist] = useState([
    {
      id: 'w1',
      destination: 'Paris, France',
      code: 'PAR',
      price: 35600,
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80',
      reason: 'Dream vacation',
      priceDropped: true,
      dropAmount: 4200
    },
    {
      id: 'w2',
      destination: 'Tokyo, Japan',
      code: 'TYO',
      price: 48960,
      image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=900&q=80',
      reason: 'Spring Cherry Blossoms',
      priceDropped: false
    },
    {
      id: 'w3',
      destination: 'Sydney, Australia',
      code: 'SYD',
      price: 42300,
      image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=900&q=80',
      reason: 'New Year Celebrations',
      priceDropped: true,
      dropAmount: 3100
    }
  ])

  const handleRemove = (id) => {
    setWishlist(prev => prev.filter(item => item.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#2563EB] uppercase tracking-wider">Dream Trips</p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] mt-1">My Wishlist</h1>
          <p className="text-[#64748B] text-sm mt-1">Shortlisted destinations with price drop alerts and cheap flight checks.</p>
        </div>
      </div>

      {/* Grid of Wishlist Items */}
      {wishlist.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center shadow-sm">
          <Heart size={32} className="text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-base">Wishlist is Empty</h3>
          <p className="text-slate-500 text-xs mt-1">Add destinations to your wishlist to track price changes.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {wishlist.map((w) => (
            <div
              key={w.id}
              className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:border-[#2563EB]/20 group"
            >
              <div className="h-40 overflow-hidden relative">
                <img
                  src={w.image}
                  alt={w.destination}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-350"
                />
                <button
                  onClick={() => handleRemove(w.id)}
                  className="absolute top-3 right-3 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 p-2 rounded-xl transition-all shadow-md"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 size={14} />
                </button>
                {w.priceDropped && (
                  <div className="absolute top-3 left-3 bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    Price Drop
                  </div>
                )}
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">Dream Destination</span>
                  <h3 className="font-extrabold text-slate-800 text-sm mt-0.5 truncate">{w.destination}</h3>
                  <p className="text-[10px] text-slate-400 font-semibold">{w.code} Airport</p>
                  {w.reason && (
                    <p className="text-[10px] text-slate-500 italic mt-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100/50">
                      "{w.reason}"
                    </p>
                  )}
                </div>

                <div className="flex items-end justify-between pt-3 border-t border-slate-100">
                  <div>
                    <span className="text-[8px] font-bold text-slate-400 block uppercase">Est. lowest fare</span>
                    <strong className="text-sm font-black text-slate-900">{formatCurrency(w.price)}</strong>
                    {w.priceDropped && (
                      <span className="text-[9px] text-emerald-600 font-bold block mt-0.5">
                        Down by {formatCurrency(w.dropAmount)}!
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => navigate('/search-results')}
                    className="bg-[#2563EB] hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-sm hover:shadow-md hover:shadow-blue-100 transition-all flex items-center gap-1 active:scale-95 shrink-0"
                  >
                    Find Flights
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
