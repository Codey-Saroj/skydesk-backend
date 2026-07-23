import { useMemo, useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts'
import {
  Wallet, Receipt, CheckCircle2, Clock,
  TrendingUp, Filter, PlaneTakeoff
} from 'lucide-react'
import { useExpenseStore } from '../hooks/useExpenses'
import { useAdvances } from '../hooks/useAdvances'
import expenseData from '../data/expenses.json'
import { formatCurrency } from '../utils/formatters'
import StatusPill from '../components/StatusPill'

const {
  expenseCategories, flightBookings,
  spendByWeek, spendByMonth, spendByYear,
  categorySpendByWeek, categorySpendByMonth, categorySpendByYear
} = expenseData

const rangeOptions = [
  { key: 'week', label: 'Weekly', data: spendByWeek, caption: 'Last 8 weeks' },
  { key: 'month', label: 'Monthly', data: spendByMonth, caption: 'Last 6 months' },
  { key: 'year', label: 'Yearly', data: spendByYear, caption: 'Last 4 years' }
]

const categoryRangeOptions = [
  { key: 'week', label: 'Weekly', data: categorySpendByWeek, caption: 'Last 8 weeks' },
  { key: 'month', label: 'Monthly', data: categorySpendByMonth, caption: 'Last 6 months' },
  { key: 'year', label: 'Yearly', data: categorySpendByYear, caption: 'Last 4 years' }
]

function StatCard({ label, value, icon: Icon, iconBg, iconColor, sub }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">{label}</p>
          <p className="mt-1.5 text-2xl font-extrabold text-[#0F172A]">{value}</p>
          {sub && <p className="text-xs text-[#64748B] mt-1">{sub}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
          <Icon size={18} className={iconColor} />
        </div>
      </div>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-lg p-3 text-xs">
        <p className="font-bold text-[#0F172A] mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: {formatCurrency(p.value)}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function ExpenseAnalytics() {
  const { expenses, totals } = useExpenseStore()
  const { advances } = useAdvances()

  const outstandingAdvances = advances
    .filter((a) => a.status !== 'Settled')
    .reduce((sum, a) => sum + Number(a.amount) - Number(a.adjusted || 0), 0)

  const thisMonthSpend = useMemo(() => {
    const now = new Date()
    return expenses
      .filter((e) => {
        const d = new Date(e.date)
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      })
      .reduce((sum, e) => sum + Number(e.amount || 0), 0)
  }, [expenses])

  const [range, setRange] = useState('month')
  const [catRange, setCatRange] = useState('month')
  const [catFilter, setCatFilter] = useState('all')

  const activeRange = rangeOptions.find((r) => r.key === range)
  const activeCatRange = categoryRangeOptions.find((r) => r.key === catRange)

  const categoryBreakdown = useMemo(() => {
    return expenseCategories
      .map((cat) => ({
        ...cat,
        value: expenses
          .filter((e) => e.category === cat.key)
          .reduce((sum, e) => sum + Number(e.amount || 0), 0)
      }))
      .filter((c) => c.value > 0)
  }, [expenses])

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((e) => catFilter === 'all' || e.category === catFilter)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10)
  }, [expenses, catFilter])

  const upcomingFlights = flightBookings
    .filter((b) => b.type === 'flight' && b.status === 'Confirmed')
    .slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold text-[#2563EB] uppercase tracking-wider">Travel &amp; Expense</p>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] mt-1">Analytics</h1>
        <p className="text-[#64748B] text-sm mt-1">Visualize your travel spending patterns.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="This Month"
          value={formatCurrency(thisMonthSpend)}
          icon={Wallet}
          iconBg="bg-orange-50"
          iconColor="text-[#F97316]"
          sub="Spending so far"
        />
        <StatCard
          label="Total Logged"
          value={formatCurrency(totals.total)}
          icon={Receipt}
          iconBg="bg-blue-50"
          iconColor="text-[#2563EB]"
          sub={`${expenses.length} entries`}
        />
        <StatCard
          label="Approved"
          value={formatCurrency(totals.approved)}
          icon={CheckCircle2}
          iconBg="bg-green-50"
          iconColor="text-green-600"
          sub="Ready for reimbursement"
        />
        <StatCard
          label="Pending Review"
          value={formatCurrency(totals.pending)}
          icon={Clock}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          sub={outstandingAdvances > 0 ? `₹${(outstandingAdvances / 1000).toFixed(0)}k advances outstanding` : 'No outstanding advances'}
        />
      </div>

      {/* Spend Over Time */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div>
            <h2 className="font-bold text-[#0F172A]">Spend Over Time</h2>
            <p className="text-xs text-[#64748B] mt-0.5">{activeRange.caption}</p>
          </div>
          <div className="flex gap-1.5 bg-slate-100 rounded-xl p-1">
            {rangeOptions.map((r) => (
              <button
                key={r.key}
                onClick={() => setRange(r.key)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  range === r.key ? 'bg-white text-[#2563EB] shadow-sm' : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={activeRange.data}>
            <defs>
              <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="total"
              name="Total Spend"
              stroke="#2563EB"
              strokeWidth={2.5}
              fill="url(#spendGrad)"
              dot={{ r: 4, fill: '#2563EB' }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Category Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Stacked Bar */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <div>
              <h2 className="font-bold text-[#0F172A]">Spend by Category</h2>
              <p className="text-xs text-[#64748B] mt-0.5">{activeCatRange.caption}</p>
            </div>
            <div className="flex gap-1.5 bg-slate-100 rounded-xl p-1">
              {categoryRangeOptions.map((r) => (
                <button
                  key={r.key}
                  onClick={() => setCatRange(r.key)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    catRange === r.key ? 'bg-white text-[#2563EB] shadow-sm' : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={activeCatRange.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              {expenseCategories.map((cat) => (
                <Bar key={cat.key} dataKey={cat.key} name={cat.label} stackId="a" fill={cat.color} radius={cat.key === 'other' ? [4, 4, 0, 0] : [0, 0, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Breakdown */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
          <h2 className="font-bold text-[#0F172A] mb-1">All-Time Breakdown</h2>
          <p className="text-xs text-[#64748B] mb-4">By expense category (total logged)</p>
          {categoryBreakdown.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-sm text-[#64748B]">
              No expenses logged yet.
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="55%" height={180}>
                <PieChart>
                  <Pie data={categoryBreakdown} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={75} innerRadius={45}>
                    {categoryBreakdown.map((entry) => (
                      <Cell key={entry.key} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => formatCurrency(v)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {categoryBreakdown.map((cat) => (
                  <div key={cat.key} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                      <span className="text-[#64748B]">{cat.label}</span>
                    </div>
                    <span className="font-bold text-[#0F172A]">{formatCurrency(cat.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Flights */}
      {upcomingFlights.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
          <h2 className="font-bold text-[#0F172A] mb-4 flex items-center gap-2">
            <PlaneTakeoff size={18} className="text-[#2563EB]" />
            Upcoming Booked Flights
          </h2>
          <div className="space-y-3">
            {upcomingFlights.map((b) => (
              <div key={b.id} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3">
                <div>
                  <p className="font-semibold text-[#0F172A] text-sm">{b.airline} {b.flightNo} · {b.from} → {b.to}</p>
                  <p className="text-xs text-[#64748B] mt-0.5">{b.date} · {b.depart}–{b.arrive} · PNR: {b.pnr}</p>
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

      {/* Recent Expenses Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-bold text-[#0F172A]">Recent Expenses</h2>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-[#64748B]" />
            <select
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value)}
              className="text-xs border border-[#E2E8F0] rounded-lg px-3 py-2 text-[#64748B] bg-white focus:outline-none focus:border-[#2563EB]"
            >
              <option value="all">All Categories</option>
              {expenseCategories.map((c) => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="px-5 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Date</th>
                <th className="px-5 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Merchant</th>
                <th className="px-5 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Category</th>
                <th className="px-5 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Amount</th>
                <th className="px-5 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-[#64748B] text-sm">No expenses found.</td>
                </tr>
              ) : (
                filteredExpenses.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 text-[#64748B] text-xs">{e.date}</td>
                    <td className="px-5 py-3.5 font-semibold text-[#0F172A]">{e.merchant}</td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs bg-slate-100 text-[#64748B] px-2.5 py-1 rounded-full font-medium capitalize">{e.category}</span>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-[#0F172A]">{formatCurrency(Number(e.amount))}</td>
                    <td className="px-5 py-3.5"><StatusPill status={e.status} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
