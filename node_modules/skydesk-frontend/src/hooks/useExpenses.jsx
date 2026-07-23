import { createContext, useContext, useCallback, useEffect, useState } from 'react'
import { apiFetch } from '../utils/api'

// Maps a raw DB expense row (snake_case) into the flat shape the
// existing UI (AddExpense, ExpenseReport, ExpenseAnalytics) expects.
function mapExpense(e) {
  return {
    id: e.id,
    date: (e.expense_date || '').slice(0, 10),
    category: e.category,
    merchant: e.title,
    description: e.notes || '',
    amount: Number(e.amount) || 0,
    status: e.status ? e.status.charAt(0).toUpperCase() + e.status.slice(1) : 'Pending',
    tripId: e.trip_id || null,
    tripTitle: e.trip_title || null,
    persisted: true,
  }
}

// ── useExpenses hook ─────────────────────────

function useExpenses() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    apiFetch('/expenses', { auth: true })
      .then((res) => setExpenses(res.data.expenses.map(mapExpense)))
      .catch((err) => setError(err.message || 'Could not load expenses.'))
      .finally(() => setLoading(false))
  }, [])

  const addExpense = useCallback(async (entry) => {
    const res = await apiFetch('/expenses', {
      method: 'POST',
      auth: true,
      body: {
        title: entry.merchant,
        amount: entry.amount,
        category: entry.category,
        expense_date: entry.date,
        trip_id: entry.tripId || undefined,
        notes: entry.description || undefined,
      },
    })
    setExpenses((prev) => [mapExpense(res.data.expense), ...prev])
  }, [])

  // NOTE: the backend has no PATCH/DELETE endpoint for expenses yet, so
  // these only update local state — they do not persist to the database.
  // The UI marks entries changed this way so it's not misleading.
  const updateStatus = useCallback((id, status) => {
    setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, status, persisted: false } : e)))
  }, [])

  const removeExpense = useCallback((id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id))
  }, [])

  const totals = {
    total: expenses.reduce((s, e) => s + Number(e.amount || 0), 0),
    pending: expenses.filter((e) => e.status === 'Pending').reduce((s, e) => s + Number(e.amount || 0), 0),
    approved: expenses.filter((e) => e.status === 'Approved').reduce((s, e) => s + Number(e.amount || 0), 0),
    rejected: expenses.filter((e) => e.status === 'Rejected').reduce((s, e) => s + Number(e.amount || 0), 0),
  }

  return { expenses, loading, error, totals, addExpense, updateStatus, removeExpense }
}

// ── Context ──────────────────────────────────

const ExpenseContext = createContext(null)

export function ExpenseProvider({ children }) {
  const value = useExpenses()
  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
}

export function useExpenseStore() {
  const ctx = useContext(ExpenseContext)
  if (!ctx) throw new Error('useExpenseStore must be used inside ExpenseProvider')
  return ctx
}
