import { formatCurrency, formatDate } from '../formatters'

// ── Small FAQ knowledge base ──
const FAQ = [
  {
    tags: ['baggage', 'luggage', 'bag allowance', 'check-in bag', 'checked bag'],
    answer:
      'Domestic economy fares include 15kg check-in + 7kg cabin baggage. Business class gets 25kg check-in. International allowances vary by route — I\'d recommend confirming on your specific booking\'s fare rules.',
  },
  {
    tags: ['refund', 'cancellation policy', 'cancel my flight', 'cancel policy'],
    answer:
      'Refunds depend on the fare type. Refundable fares are eligible for a full refund minus a cancellation fee if cancelled 24h+ before departure. Non-refundable fares typically only return statutory taxes. You can start a cancellation from the Bookings page.',
  },
  {
    tags: ['reschedule', 'change my flight', 'date change'],
    answer:
      'Date changes are allowed up to 2 hours before departure on most fares, subject to a change fee plus any fare difference. Head to Bookings → select the flight → Manage Booking to reschedule.',
  },
  {
    tags: ['web check-in', 'webcheckin', 'online check-in'],
    answer:
      'Web check-in opens 48 hours and closes 60 minutes before domestic departure (75 minutes for international). You can check in from the Bookings page once it\'s open for your flight.',
  },
  {
    tags: ['id proof', 'documents needed', 'passport', 'visa'],
    answer:
      'For domestic flights, any government photo ID (Aadhaar, PAN, driving licence) works. For international flights you\'ll need a valid passport, and a visa if your destination requires one for Indian passport holders — worth double-checking a few weeks out.',
  },
  {
    tags: ['seat selection', 'choose my seat', 'pick a seat'],
    answer:
      'Seat selection is free for window/aisle on most fares, with a small fee for extra-legroom or front-row seats. You can pick seats from Manage Booking on the Bookings page.',
  },
]

const DEST_TAG_ALIASES = {
  beach: ['beach'],
  mountain: ['mountains', 'mountain', 'hills'],
  city: ['city', 'urban'],
  luxury: ['luxury'],
  tropical: ['tropical'],
  romance: ['romance', 'romantic'],
}

const money = (n) => formatCurrency(Math.round(n))

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function includesAny(text, words) {
  return words.some((w) => text.includes(w))
}

// ── Intent handlers ─────────────────────────────────────

function intentGreeting(text) {
  if (/\b(hi|hello|hey|yo|namaste)\b/.test(text) && text.length < 25) {
    return {
      text: "Hey! I'm Skye, your SkyDesk assistant. I can check your flights, wallet, expenses, or suggest a destination. What do you need?",
      quickReplies: ['Next flight?', 'Wallet balance', 'Suggest a trip', 'My expenses this month'],
    }
  }
  return null
}

function intentThanks(text) {
  if (includesAny(text, ['thank you', 'thanks', 'thx', 'appreciate it'])) {
    return { text: "Anytime! Let me know if there's anything else about your trips or expenses." }
  }
  return null
}

function intentNextFlight(text, ctx) {
  if (!includesAny(text, ['next flight', 'upcoming flight', 'next trip', "what's my flight", 'when do i fly', 'when am i flying'])) {
    return null
  }
  const today = todayISO()
  const upcoming = ctx.bookings
    .filter((b) => b.date >= today && b.status !== 'Cancelled')
    .sort((a, b) => a.date.localeCompare(b.date))[0]

  if (!upcoming) {
    return {
      text: "You don't have any upcoming flights booked right now. Want me to suggest a destination?",
      quickReplies: ['Suggest a trip', 'Show offers'],
    }
  }
  return {
    text: `Your next flight is ${upcoming.airline} ${upcoming.flightNumber} — ${upcoming.from} → ${upcoming.to} on ${formatDate(upcoming.date)} at ${upcoming.departure}. Status: ${upcoming.status}, seat ${upcoming.seat}, gate ${upcoming.gate} (Terminal ${upcoming.terminal}).`,
    actions: [{ label: 'View booking', path: '/bookings' }],
    quickReplies: ['Any other bookings?', 'Web check-in info'],
  }
}

function intentBookingStatus(text, ctx) {
  if (!includesAny(text, ['booking status', 'flight status', 'status of my', 'is my flight', 'my booking'])) {
    return null
  }
  const cities = ['delhi', 'mumbai', 'bangalore', 'bengaluru', 'goa', 'dubai', 'jaipur', 'singapore', 'hyderabad']
  const mentioned = cities.filter((c) => text.includes(c))
  let matches = ctx.bookings
  if (mentioned.length) {
    matches = matches.filter((b) =>
      mentioned.some((c) => b.from.toLowerCase().includes(c) || b.to.toLowerCase().includes(c))
    )
  }
  if (!matches.length) {
    return { text: "I couldn't find a matching booking. Could you tell me the route, like 'Delhi to Mumbai'?" }
  }
  const lines = matches
    .slice(0, 3)
    .map((b) => `• ${b.flightNumber} ${b.from} → ${b.to} on ${formatDate(b.date)}: ${b.status}`)
  return {
    text: `Here's what I found:\n${lines.join('\n')}`,
    actions: [{ label: 'View all bookings', path: '/bookings' }],
  }
}

function intentAllBookings(text, ctx) {
  if (!includesAny(text, ['my bookings', 'all my flights', 'show bookings', 'list my flights', 'my flights'])) {
    return null
  }
  const total = ctx.bookings.length
  const confirmed = ctx.bookings.filter((b) => b.status === 'Confirmed').length
  const completed = ctx.bookings.filter((b) => b.status === 'Completed').length
  return {
    text: `You have ${total} bookings total — ${confirmed} confirmed/upcoming and ${completed} completed. Want the full list?`,
    actions: [{ label: 'Open Bookings', path: '/bookings' }],
  }
}

function intentWallet(text, ctx) {
  if (!includesAny(text, ['wallet', 'balance', 'how much money', 'loyalty point', 'reward point', 'membership'])) {
    return null
  }
  const p = ctx.profile
  return {
    text: `Your Travel Wallet balance is ${money(p.wallet)}, and you've got ${p.loyaltyPoints.toLocaleString('en-IN')} loyalty points as a ${p.membership} member. You've saved ${money(p.totalSavings)} across ${p.totalTrips} trips so far.`,
    actions: [{ label: 'Open Wallet', path: '/wallet' }],
  }
}

function intentExpenseSummary(text, ctx) {
  if (!includesAny(text, ['expense', 'spend', 'spent', 'how much did i'])) return null
  if (includesAny(text, ['add ', 'log ', 'record '])) return null // handled by intentLogExpense

  const { totals, expenses } = ctx
  const thisMonth = new Date().toISOString().slice(0, 7)
  const monthTotal = expenses
    .filter((e) => e.date.startsWith(thisMonth))
    .reduce((s, e) => s + Number(e.amount || 0), 0)

  return {
    text: `You've logged ${money(totals.total)} in total expenses (${money(totals.pending)} pending approval, ${money(totals.approved)} approved). This month alone: ${money(monthTotal)}.`,
    actions: [{ label: 'Open Expense Report', path: '/expenses' }],
    quickReplies: ['Check my budget', 'Log an expense'],
  }
}

function intentBudget(text, ctx) {
  if (!includesAny(text, ['budget', 'over budget', 'am i overspending'])) return null
  const { budgets, expenses } = ctx
  const thisMonth = new Date().toISOString().slice(0, 7)
  const lines = budgets.map((b) => {
    const key = b.category.toLowerCase()
    const spent = expenses
      .filter((e) => e.category === key && e.date.startsWith(thisMonth))
      .reduce((s, e) => s + Number(e.amount || 0), 0)
    const pct = Math.round((spent / b.monthly) * 100)
    const flag = pct >= 100 ? ' ⚠️ over' : pct >= 80 ? ' (close to limit)' : ''
    return `• ${b.category}: ${money(spent)} / ${money(b.monthly)}${flag}`
  })
  return {
    text: `Here's your budget status for this month:\n${lines.join('\n')}`,
    actions: [{ label: 'View Analytics', path: '/analytics' }],
  }
}

function intentLogExpense(text, ctx) {
  if (!includesAny(text, ['add expense', 'log expense', 'record expense', 'log an expense']) &&
      !/^(add|log|record)\s+\d/.test(text) &&
      !/spent\s+\d/.test(text)) {
    return null
  }
  const amountMatch = text.match(/(?:₹|rs\.?|inr)?\s*(\d{2,7})/i)
  if (!amountMatch) {
    return {
      text: "Sure — how much was it, and for what? Try something like: 'log 500 for lunch' or 'add expense 1200 for cab'.",
    }
  }
  const amount = Number(amountMatch[1])

  const categoryMap = {
    meals: 'meals', food: 'meals', lunch: 'meals', dinner: 'meals', breakfast: 'meals',
    cab: 'transport', taxi: 'transport', transport: 'transport', uber: 'transport', ola: 'transport',
    hotel: 'accommodation', stay: 'accommodation', accommodation: 'accommodation',
    call: 'communication', roaming: 'communication', sim: 'communication', communication: 'communication'
  }
  let category = 'other'
  for (const [word, cat] of Object.entries(categoryMap)) {
    if (text.includes(word)) { category = cat; break }
  }

  if (!ctx.addExpense) {
    return { text: "I can help you log that, but I need to be on a page where expense tracking is active. Head to Add Expense and I'll pre-fill it." }
  }

  ctx.addExpense({
    date: todayISO(),
    category,
    merchant: 'Chat entry',
    description: text.charAt(0).toUpperCase() + text.slice(1, 60),
    amount,
  })

  return {
    text: `Logged ${money(amount)} under "${category}" as Pending approval. You can edit the details on the Expense Report page.`,
    actions: [{ label: 'Open Expense Report', path: '/expenses' }],
  }
}

function intentAdvances(text, ctx) {
  if (!includesAny(text, ['advance', 'reimbursement pending'])) return null
  const pending = ctx.advances.filter((a) => a.status !== 'Settled')
  if (!pending.length) return { text: 'All your travel advances are settled. Nothing pending.' }
  const lines = pending.map((a) => `• ${a.purpose}: ${money(a.amount)} (${a.status})`)
  return { text: `You have ${pending.length} advance(s) not yet settled:\n${lines.join('\n')}` }
}

function intentDestinationSuggestion(text, ctx) {
  if (!includesAny(text, ['suggest', 'recommend', 'where should i', 'destination', 'idea for a trip', 'plan a trip'])) {
    return null
  }
  let pool = [...ctx.destinations]
  let matchedTag = null
  for (const [tag, aliases] of Object.entries(DEST_TAG_ALIASES)) {
    if (includesAny(text, aliases)) { matchedTag = tag; break }
  }
  if (matchedTag) {
    pool = pool.filter((d) => d.tag.toLowerCase().includes(matchedTag) || DEST_TAG_ALIASES[matchedTag].some(a => d.tag.toLowerCase().includes(a)))
  }
  if (includesAny(text, ['cheap', 'budget', 'affordable', 'low cost'])) {
    pool = pool.sort((a, b) => a.startingPrice - b.startingPrice)
  } else if (includesAny(text, ['luxury', 'premium', 'expensive'])) {
    pool = pool.sort((a, b) => b.startingPrice - a.startingPrice)
  } else {
    pool = pool.sort((a, b) => b.rating - a.rating)
  }
  const picks = pool.slice(0, 3)
  if (!picks.length) {
    return { text: "I couldn't find a destination matching that, but check the Destinations section on your Dashboard for the full list." }
  }
  const lines = picks.map((d) => `• ${d.name}, ${d.country} — from ${money(d.startingPrice)}, ${d.flightDuration} flight, rated ${d.rating}★`)
  return {
    text: `Here's what I'd suggest:\n${lines.join('\n')}`,
    actions: [{ label: 'Explore Destinations', path: '/dashboard' }],
  }
}

function intentOffers(text, ctx) {
  if (!includesAny(text, ['offer', 'discount', 'coupon', 'promo code', 'deal'])) return null
  const codeMatch = text.match(/\b([A-Z]{4,10}\d{0,3})\b/)
  if (codeMatch) {
    const found = ctx.offers.find((o) => o.code.toLowerCase() === codeMatch[1].toLowerCase())
    if (found) {
      return { text: `${found.code} — ${found.title}: ${found.description} Valid until ${formatDate(found.validUntil)}.` }
    }
  }
  const lines = ctx.offers.slice(0, 4).map((o) => `• ${o.code} — ${o.discount}: ${o.title}`)
  return {
    text: `Current offers:\n${lines.join('\n')}`,
    actions: [{ label: 'View all Offers', path: '/offers' }],
  }
}

function intentTravelTips(text, ctx) {
  if (!includesAny(text, ['weather', 'visa update', 'travel guideline', 'travel tip', 'airport info', 'monsoon'])) {
    return null
  }
  const found = ctx.travelTips.find((t) =>
    text.includes(t.tag.toLowerCase()) || t.title.toLowerCase().split(' ').some((w) => text.includes(w))
  )
  if (found) return { text: `${found.title}: ${found.description}` }
  const lines = ctx.travelTips.map((t) => `• ${t.title}: ${t.description}`)
  return { text: `Latest travel tips:\n${lines.join('\n')}` }
}

function intentFAQ(text) {
  for (const item of FAQ) {
    if (includesAny(text, item.tags)) {
      return { text: item.answer }
    }
  }
  return null
}

function intentNavigate(text) {
  const routes = {
    'settings': '/settings', 'profile': '/settings',
    'wallet': '/wallet', 'wishlist': '/wishlist',
    'saved flight': '/saved-flights', 'offers': '/offers',
    'support': '/support', 'my trips': '/my-trips',
    'analytics': '/analytics', 'bookings': '/bookings',
    'expenses': '/expenses', 'dashboard': '/dashboard',
  }
  if (!includesAny(text, ['open ', 'go to ', 'take me to ', 'navigate to '])) return null
  for (const [word, path] of Object.entries(routes)) {
    if (text.includes(word)) {
      return { text: `Sure, opening ${word}.`, actions: [{ label: `Go to ${word}`, path, auto: true }] }
    }
  }
  return null
}

function intentFallback() {
  return {
    text: "I'm not sure about that one yet — I'm best with flights, wallet, expenses, budgets, offers, and destination ideas. Try one of these, or rephrase?",
    quickReplies: ['Next flight?', 'Wallet balance', 'My expenses this month', 'Suggest a trip', 'Show offers'],
  }
}

const ACTION_INTENTS = [intentLogExpense, intentNavigate]

const FALLBACK_INTENTS = [
  intentGreeting,
  intentThanks,
  intentNextFlight,
  intentBookingStatus,
  intentAllBookings,
  intentWallet,
  intentBudget,
  intentExpenseSummary,
  intentAdvances,
  intentDestinationSuggestion,
  intentOffers,
  intentTravelTips,
  intentFAQ,
]

/**
 * Runs client-side action intents (logging, navigation).
 * Returns response object if matched, or null.
 */
export function runClientAction(input, ctx) {
  const text = input.toLowerCase().trim()
  for (const intent of ACTION_INTENTS) {
    const result = intent(text, ctx)
    if (result) return result
  }
  return null
}

/**
 * Runs local rules fallback engine.
 */
export function runLocalFallback(input, ctx) {
  const text = input.toLowerCase().trim()
  for (const intent of FALLBACK_INTENTS) {
    const result = intent(text, ctx)
    if (result) return result
  }
  return intentFallback()
}

export const STARTER_SUGGESTIONS = [
  "What's my next flight?",
  'Wallet balance',
  'My expenses this month',
  'Suggest a trip',
]
