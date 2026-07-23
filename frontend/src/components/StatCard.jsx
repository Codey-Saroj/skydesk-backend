import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

export default function StatCard({ title, value, change, isPositive, timeframe, icon: Icon }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center justify-between">
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
          {title}
        </span>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
          {value}
        </h3>
        <div className="flex items-center gap-1.5 text-xs font-medium">
          <span
            className={`inline-flex items-center gap-0.5 font-bold ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {isPositive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {change}
          </span>
          <span className="text-slate-400 font-semibold">{timeframe}</span>
        </div>
      </div>
      <div className="w-12 h-12 bg-slate-50 border border-slate-150 rounded-lg flex items-center justify-center text-slate-700">
        <Icon size={20} strokeWidth={2} />
      </div>
    </div>
  )
}
