import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PlusCircle, Trash2, Filter, Receipt, CheckCircle2, Clock, XCircle } from 'lucide-react'
import { useExpenseStore } from '../hooks/useExpenses'
import expenseData from '../data/expenses.json'
import { formatCurrency, formatDate } from '../utils/formatters'
import StatusPill from '../components/StatusPill'

const { expenseCategories } = expenseData

const statusFilters = ['All', 'Pending', 'Approved', 'Rejected']

function SummaryCard({ label, amount, icon: Icon, iconBg, iconColor }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">{label}</p>
          <p className="mt-1.5 text-2xl font-extrabold text-[#0F172A]">{formatCurrency(amount)}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
          <Icon size={18} className={iconColor} />
        </div>
      </div>
    </div>
  )
}

export default function ExpenseReport() {
  const { expenses, loading, error, updateStatus, removeExpense, totals } = useExpenseStore()
  const [status, setStatus] = useState('All')
  const [category, setCategory] = useState('all')

  const filtered = useMemo(() => {
    return expenses
      .filter((e) => status === 'All' || e.status === status)
      .filter((e) => category === 'all' || e.category === category)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [expenses, status, category])

  const filteredTotal = filtered.reduce((sum, e) => sum + Number(e.amount), 0)

  const categoryLabel = (key) =>
    expenseCategories.find((c) => c.key === key)?.label ?? key

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#2563EB] uppercase tracking-wider">Travel &amp; Expense</p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] mt-1">Expense Report</h1>
          <p className="text-[#64748B] text-sm mt-1">Track and manage your travel reimbursements.</p>
        </div>
        <Link
          to="/expenses/new"
          className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-orange-600 text-white font-bold px-5 py-3 rounded-xl shadow-md hover:shadow-orange-200 transition-all active:scale-95 shrink-0"
        >
          <PlusCircle size={16} />
          Add Expense
        </Link>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          label="Total Logged"
          amount={totals.total}
          icon={Receipt}
          iconBg="bg-blue-50"
          iconColor="text-[#2563EB]"
        />
        <SummaryCard
          label="Pending"
          amount={totals.pending}
          icon={Clock}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        <SummaryCard
          label="Approved"
          amount={totals.approved}
          icon={CheckCircle2}
          iconBg="bg-green-50"
          iconColor="text-green-600"
        />
        <SummaryCard
          label="Rejected"
          amount={totals.rejected}
          icon={XCircle}
          iconBg="bg-red-50"
          iconColor="text-red-500"
        />
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-[#E2E8F0] flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-medium">
            <Filter size={14} />
            Filter:
          </div>
          {/* Status Pills */}
          <div className="flex gap-1.5 flex-wrap">
            {statusFilters.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  status === s
                    ? 'bg-[#2563EB] text-white shadow-sm'
                    : 'bg-slate-100 text-[#64748B] hover:bg-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          {/* Category Select */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="ml-auto text-xs border border-[#E2E8F0] rounded-lg px-3 py-2 text-[#64748B] bg-white focus:outline-none focus:border-[#2563EB] cursor-pointer"
          >
            <option value="all">All Categories</option>
            {expenseCategories.map((c) => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="px-5 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Date</th>
                <th className="px-5 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Merchant</th>
                <th className="px-5 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Category</th>
                <th className="px-5 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Amount</th>
                <th className="px-5 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#64748B] text-sm">
                    Loading your expenses...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-red-600 text-sm font-semibold">
                    {error}
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#64748B] text-sm">
                    {expenses.length === 0 ? 'No expenses logged yet — add your first one above.' : 'No expenses found.'}
                  </td>
                </tr>
              ) : (
                filtered.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 text-[#64748B]">{formatDate(e.date)}</td>
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-[#0F172A]">{e.merchant}</p>
                      {e.description && (
                        <p className="text-xs text-[#64748B] mt-0.5">{e.description}</p>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs bg-slate-100 text-[#64748B] px-2.5 py-1 rounded-full font-medium">
                        {categoryLabel(e.category)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-[#0F172A]">{formatCurrency(Number(e.amount))}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <StatusPill status={e.status} />
                        {!e.persisted && (
                          <span className="text-[9px] text-amber-500 font-semibold" title="This status change is local-only — the backend doesn't support updating expense status yet.">
                            unsaved
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        {e.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => updateStatus(e.id, 'Approved')}
                              className="text-xs text-green-600 hover:text-green-700 font-semibold hover:underline"
                            >
                              Approve
                            </button>
                            <span className="text-slate-300">|</span>
                            <button
                              onClick={() => updateStatus(e.id, 'Rejected')}
                              className="text-xs text-red-500 hover:text-red-600 font-semibold hover:underline"
                            >
                              Reject
                            </button>
                            <span className="text-slate-300">|</span>
                          </>
                        )}
                        <button
                          onClick={() => removeExpense(e.id)}
                          className="text-slate-400 hover:text-red-500 transition-colors"
                          title="Removes from this view only — the backend doesn't support deleting expenses yet."
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {filtered.length > 0 && (
          <div className="px-5 py-3.5 border-t border-[#E2E8F0] bg-slate-50 flex items-center justify-between">
            <span className="text-xs text-[#64748B]">{filtered.length} record{filtered.length !== 1 ? 's' : ''}</span>
            <span className="text-sm font-bold text-[#0F172A]">
              Total: {formatCurrency(filteredTotal)}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
