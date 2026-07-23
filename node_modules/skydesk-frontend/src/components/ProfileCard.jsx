import { Star, Edit3, Wallet } from 'lucide-react'
import profile from '../data/profile.json'

export default function ProfileCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xl font-extrabold shrink-0">
          {profile.initials}
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-base leading-tight">{profile.name}</h3>
          <p className="text-slate-400 text-xs truncate">{profile.email}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <Star size={11} className="fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-bold text-yellow-700 bg-yellow-50 px-1.5 py-0.5 rounded-full">{profile.membership} Member</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="text-center p-2 bg-slate-50 rounded-xl">
          <p className="font-bold text-slate-800 text-lg">{profile.totalTrips}</p>
          <p className="text-xs text-slate-400 leading-tight">Total Trips</p>
        </div>
        <div className="text-center p-2 bg-blue-50 rounded-xl">
          <p className="font-bold text-blue-700 text-lg">{(profile.loyaltyPoints / 1000).toFixed(1)}k</p>
          <p className="text-xs text-slate-400 leading-tight">Loyalty Pts</p>
        </div>
        <div className="text-center p-2 bg-green-50 rounded-xl">
          <p className="font-bold text-green-700 text-lg">₹{(profile.totalSavings / 1000).toFixed(1)}k</p>
          <p className="text-xs text-slate-400 leading-tight">Total Saved</p>
        </div>
      </div>

      {/* Wallet */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl px-4 py-3 mb-4">
        <div className="flex items-center gap-2">
          <Wallet size={16} className="text-blue-200" />
          <div>
            <p className="text-blue-200 text-xs">Travel Wallet</p>
            <p className="text-white font-bold text-base">₹{profile.wallet.toLocaleString()}</p>
          </div>
        </div>
        <button className="text-xs font-bold text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors">
          Add Money
        </button>
      </div>

      <button className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-blue-600 border border-blue-200 rounded-xl py-2.5 hover:bg-blue-50 transition-colors">
        <Edit3 size={15} />
        Edit Profile
      </button>
    </div>
  )
}
