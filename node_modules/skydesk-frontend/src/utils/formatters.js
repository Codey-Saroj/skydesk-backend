// ─────────────────────────────────────────────
//  Formatters utility
// ─────────────────────────────────────────────

export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value)

export const formatDate = (isoDate) =>
  new Date(isoDate).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })

export const formatShortDate = (isoDate) =>
  new Date(isoDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short'
  })
