import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ReceiptText, CheckCircle2, ChevronLeft, AlertCircle } from 'lucide-react'
import { useExpenseStore } from '../hooks/useExpenses'
import expenseData from '../data/expenses.json'

const { expenseCategories, trips } = expenseData

const today = () => new Date().toISOString().slice(0, 10)

const emptyForm = {
  date: today(),
  category: 'meals',
  merchant: '',
  description: '',
  amount: '',
  tripId: ''
}

function FormField({ label, required, error, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
          <AlertCircle size={12} />
          {error}
        </p>
      )}
    </div>
  )
}

const inputCls =
  'w-full border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm text-[#0F172A] placeholder-slate-400 bg-white focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-colors'

export default function AddExpense() {
  const { addExpense } = useExpenseStore()
  const navigate = useNavigate()
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [confirmed, setConfirmed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const validate = () => {
    const next = {}
    if (!form.merchant.trim()) next.merchant = 'Add a merchant or vendor name.'
    if (!form.amount || Number(form.amount) <= 0) next.amount = 'Enter an amount greater than 0.'
    if (!form.date) next.date = 'Pick a date.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitError('')
    setSubmitting(true)
    try {
      await addExpense({
        date: form.date,
        category: form.category,
        merchant: form.merchant.trim(),
        description: form.description.trim(),
        amount: Number(form.amount),
        tripId: form.tripId || null
      })
      setForm(emptyForm)
      setErrors({})
      setConfirmed(true)
      setTimeout(() => setConfirmed(false), 3500)
    } catch (err) {
      setSubmitError(err.message || 'Could not save this expense. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#0F172A] transition-colors font-medium"
      >
        <ChevronLeft size={16} />
        Back
      </button>

      {/* Header */}
      <div>
        <p className="text-xs font-semibold text-[#2563EB] uppercase tracking-wider">Travel &amp; Expense</p>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] mt-1">Add Expense</h1>
        <p className="text-[#64748B] text-sm mt-1">
          Log a travel cost for reimbursement. Entries start as{' '}
          <span className="font-semibold text-amber-600">Pending</span> until reviewed.
        </p>
      </div>

      {/* Success Banner */}
      {confirmed && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-2xl px-5 py-4">
          <CheckCircle2 size={20} className="shrink-0" />
          <div>
            <p className="font-semibold text-sm">Expense logged!</p>
            <p className="text-xs mt-0.5">Your expense has been submitted for review.</p>
          </div>
          <Link to="/expenses" className="ml-auto text-xs font-bold underline shrink-0">
            View report
          </Link>
        </div>
      )}

      {/* Submit Error */}
      {submitError && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-4">
          <AlertCircle size={20} className="shrink-0" />
          <p className="font-semibold text-sm">{submitError}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-[#E2E8F0]">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
              <ReceiptText size={18} className="text-[#2563EB]" />
            </div>
            <h2 className="font-bold text-[#0F172A]">Expense Details</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Date */}
            <FormField label="Date" required error={errors.date}>
              <input
                type="date"
                value={form.date}
                onChange={update('date')}
                max={today()}
                className={`${inputCls} ${errors.date ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : ''}`}
              />
            </FormField>

            {/* Category */}
            <FormField label="Category" required>
              <select
                value={form.category}
                onChange={update('category')}
                className={inputCls}
              >
                {expenseCategories.map((c) => (
                  <option key={c.key} value={c.key}>{c.label}</option>
                ))}
              </select>
            </FormField>

            {/* Merchant */}
            <FormField label="Merchant / Vendor" required error={errors.merchant}>
              <input
                type="text"
                placeholder="e.g. Swiggy, Ola, Hotel Taj"
                value={form.merchant}
                onChange={update('merchant')}
                className={`${inputCls} ${errors.merchant ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : ''}`}
              />
            </FormField>

            {/* Amount */}
            <FormField label="Amount (₹)" required error={errors.amount}>
              <input
                type="number"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={update('amount')}
                className={`${inputCls} ${errors.amount ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : ''}`}
              />
            </FormField>
          </div>

          {/* Description */}
          <FormField label="Description">
            <input
              type="text"
              placeholder="Brief note about this expense (optional)"
              value={form.description}
              onChange={update('description')}
              className={inputCls}
            />
          </FormField>

          {/* Trip Link */}
          <FormField label="Link to Trip">
            <select
              value={form.tripId}
              onChange={update('tripId')}
              className={inputCls}
            >
              <option value="">Not linked to a trip</option>
              {trips.map((t) => (
                <option key={t.id} value={t.id}>{t.title} · {t.destination}</option>
              ))}
            </select>
          </FormField>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-5">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-[#2563EB] hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors active:scale-95 shadow-md hover:shadow-blue-200"
          >
            {submitting ? 'Submitting...' : 'Submit Expense'}
          </button>
          <button
            type="button"
            onClick={() => { setForm(emptyForm); setErrors({}) }}
            className="border border-[#E2E8F0] text-[#64748B] hover:bg-slate-50 font-semibold px-6 py-3.5 rounded-xl transition-colors"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  )
}
