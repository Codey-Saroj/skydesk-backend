import { createContext, useContext, useState } from 'react'
import expenseData from '../data/expenses.json'

const { advances: seedAdvances } = expenseData

const AdvancesContext = createContext(null)

export function AdvancesProvider({ children }) {
  const [advanceList, setAdvanceList] = useState(seedAdvances)

  const addAdvance = (entry) => {
    setAdvanceList((prev) => {
      const id = `ADV-${String(prev.length + 1).padStart(4, '0')}`
      return [{ id, status: 'Pending', adjusted: 0, ...entry }, ...prev]
    })
  }

  const updateAdvanceStatus = (id, status) => {
    setAdvanceList((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)))
  }

  return (
    <AdvancesContext.Provider value={{ advances: advanceList, addAdvance, updateAdvanceStatus }}>
      {children}
    </AdvancesContext.Provider>
  )
}

export function useAdvances() {
  const ctx = useContext(AdvancesContext)
  if (!ctx) throw new Error('useAdvances must be used inside AdvancesProvider')
  return ctx
}
