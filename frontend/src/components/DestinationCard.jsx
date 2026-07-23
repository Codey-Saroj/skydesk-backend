import { Star, ArrowRight } from 'lucide-react'

export default function DestinationCard({ destination }) {
  return (
    <div className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
      {/* Image */}
      <div className="h-44 overflow-hidden">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={e => { e.target.src = `https://placehold.co/600x400/2563eb/white?text=${destination.name}` }}
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Tag badge */}
      <div className="absolute top-3 left-3">
        <span className="bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-bold px-2.5 py-1 rounded-full">
          {destination.tag}
        </span>
      </div>

      {/* Rating */}
      <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
        <Star size={11} className="fill-yellow-400 text-yellow-400" />
        {destination.rating}
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="text-white font-bold text-lg leading-tight">{destination.name}</p>
        <p className="text-white/70 text-xs mb-2">{destination.country} · {destination.flightDuration}</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/60 text-xs">Starting from</p>
            <p className="text-white font-extrabold text-base">₹{destination.startingPrice.toLocaleString()}</p>
          </div>
          <button className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors">
            Explore
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}
