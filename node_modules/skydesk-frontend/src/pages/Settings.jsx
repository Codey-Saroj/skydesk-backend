import { useMemo, useState } from 'react'
import { User, MapPin, Settings2, Wallet, ShieldCheck, ChevronRight } from 'lucide-react'
import { currentUser, budgets, expenseCategories } from '../data/expenseData'
import { useExpenseStore } from '../hooks/useExpenses.jsx'
import { formatCurrency } from '../utils/formatters'

const tabs = [
  { id: 'basic', label: 'Basic Information', icon: User },
  { id: 'travel', label: 'Travel Details', icon: MapPin },
  { id: 'preferences', label: 'Preferences', icon: Settings2 },
  { id: 'budgets', label: 'Budgets', icon: Wallet }
]

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#E2E8F0] last:border-0">
      <span className="text-sm text-[#64748B]">{label}</span>
      <span className="text-sm font-semibold text-[#0F172A]">{value || '—'}</span>
    </div>
  )
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState('basic')
  const { expenses } = useExpenseStore()

  const spendByCategory = useMemo(() => {
    const totals = {}
    expenses.forEach((e) => {
      const key = e.category
      totals[key] = (totals[key] || 0) + Number(e.amount || 0)
    })
    return totals
  }, [expenses])

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold text-[#2563EB] uppercase tracking-wider">Travel &amp; Expense</p>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] mt-1">Settings</h1>
        <p className="text-[#64748B] text-sm mt-1">Manage your profile and travel preferences.</p>
      </div>

      {/* Profile Banner */}
      <div className="bg-gradient-to-r from-[#2563EB] to-blue-500 rounded-2xl p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
          <span className="text-white text-2xl font-extrabold">
            {currentUser.name.split(' ').map((n) => n[0]).join('')}
          </span>
        </div>
        <div>
          <h2 className="font-extrabold text-white text-xl">{currentUser.name}</h2>
          <p className="text-blue-100 text-sm mt-0.5">{currentUser.designation} · {currentUser.department}</p>
          <p className="text-blue-100 text-xs mt-1">{currentUser.email}</p>
        </div>
        <div className="ml-auto hidden sm:flex items-center gap-2 bg-white/20 rounded-xl px-4 py-2 text-white text-xs font-semibold cursor-pointer hover:bg-white/30 transition-colors">
          <ShieldCheck size={14} />
          Verified Employee
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="flex flex-wrap border-b border-[#E2E8F0]">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold transition-colors relative ${
                activeTab === id
                  ? 'text-[#2563EB]'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <Icon size={15} />
              {label}
              {activeTab === id && (
                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#2563EB] rounded-t" />
              )}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Basic Information */}
          {activeTab === 'basic' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-bold text-[#0F172A] mb-3">Personal Details</h3>
                <div className="bg-slate-50 rounded-xl px-4 divide-y divide-[#E2E8F0]">
                  <InfoRow label="Full Name" value={currentUser.name} />
                  <InfoRow label="Employee ID" value={currentUser.employeeId} />
                  <InfoRow label="Email" value={currentUser.email} />
                  <InfoRow label="Phone" value={currentUser.phone} />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0F172A] mb-3">Organisation</h3>
                <div className="bg-slate-50 rounded-xl px-4 divide-y divide-[#E2E8F0]">
                  <InfoRow label="Department" value={currentUser.department} />
                  <InfoRow label="Designation" value={currentUser.designation} />
                  <InfoRow label="Reporting Manager" value={currentUser.manager} />
                  <InfoRow label="Base City" value={currentUser.city} />
                </div>
              </div>
            </div>
          )}

          {/* Travel Details */}
          {activeTab === 'travel' && (
            <div>
              <h3 className="text-sm font-bold text-[#0F172A] mb-3">Travel Policy</h3>
              <div className="bg-slate-50 rounded-xl px-4 divide-y divide-[#E2E8F0]">
                <InfoRow label="Default Travel Class" value={currentUser.travelClass} />
                <InfoRow label="Hotel Budget" value={currentUser.hotelBudget} />
                <InfoRow label="Meal Allowance" value={currentUser.mealAllowance} />
                <InfoRow label="Timezone" value={currentUser.timezone} />
              </div>
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl px-5 py-4 flex items-start gap-3">
                <ShieldCheck size={16} className="text-[#2563EB] shrink-0 mt-0.5" />
                <p className="text-xs text-[#2563EB] leading-relaxed">
                  Travel policy limits are enforced automatically. Expenses exceeding per-diem limits require manager approval.
                </p>
              </div>
            </div>
          )}

          {/* Preferences */}
          {activeTab === 'preferences' && (
            <div>
              <h3 className="text-sm font-bold text-[#0F172A] mb-3">App Preferences</h3>
              <div className="space-y-3">
                {[
                  { label: 'Email notifications for expense approvals', enabled: true },
                  { label: 'SMS alerts for flight status', enabled: true },
                  { label: 'Auto-categorise expenses using AI', enabled: false },
                  { label: 'Dark mode', enabled: false }
                ].map(({ label, enabled }) => (
                  <div key={label} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3">
                    <span className="text-sm text-[#0F172A]">{label}</span>
                    <div
                      className={`relative w-10 h-5 rounded-full transition-colors ${enabled ? 'bg-[#2563EB]' : 'bg-slate-300'}`}
                    >
                      <div
                        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0.5'}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Budgets */}
          {activeTab === 'budgets' && (
            <div>
              <h3 className="text-sm font-bold text-[#0F172A] mb-1">Monthly Budgets</h3>
              <p className="text-xs text-[#64748B] mb-4">Your expense allowance per category per month.</p>
              <div className="space-y-4">
                {budgets.map((b) => {
                  const catKey = expenseCategories.find((c) => c.label === b.category)?.key
                  const spent = spendByCategory[catKey] ?? 0
                  const pct = Math.min((spent / b.monthly) * 100, 100)
                  const isOver = spent > b.monthly
                  return (
                    <div key={b.category}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: b.color }} />
                          <span className="text-sm font-semibold text-[#0F172A]">{b.category}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className={isOver ? 'text-red-500 font-bold' : 'text-[#64748B]'}>
                            {formatCurrency(spent)} spent
                          </span>
                          <span className="text-slate-300">/</span>
                          <span className="text-[#64748B]">{formatCurrency(b.monthly)} budget</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: isOver ? '#EF4444' : b.color
                          }}
                        />
                      </div>
                      {isOver && (
                        <p className="text-xs text-red-500 font-semibold mt-1">
                          Over budget by {formatCurrency(spent - b.monthly)}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
