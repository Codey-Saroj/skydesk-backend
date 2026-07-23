// ─────────────────────────────────────────────
//  Expense Module Data
//  Source: teammate's expense-module / mockData.js
//  Adapted for SkyDesk integration
// ─────────────────────────────────────────────

export const airports = [
  { code: 'DEL', city: 'Delhi' },
  { code: 'BOM', city: 'Mumbai' },
  { code: 'BLR', city: 'Bengaluru' },
  { code: 'PAT', city: 'Patna' },
  { code: 'HYD', city: 'Hyderabad' },
  { code: 'CCU', city: 'Kolkata' }
]

export const flights = [
  {
    id: 'FL-2291',
    airline: 'IndiGo',
    flightNo: '6E 2291',
    from: 'DEL',
    to: 'BOM',
    depart: '06:15',
    arrive: '08:20',
    duration: '2h 05m',
    stops: 'Non-stop',
    price: 4820,
    cabin: 'Economy',
    seatsLeft: 6
  },
  {
    id: 'FL-3107',
    airline: 'Air India',
    flightNo: 'AI 3107',
    from: 'DEL',
    to: 'BOM',
    depart: '09:40',
    arrive: '11:55',
    duration: '2h 15m',
    stops: 'Non-stop',
    price: 5640,
    cabin: 'Economy',
    seatsLeft: 12
  },
  {
    id: 'FL-8842',
    airline: 'Vistara',
    flightNo: 'UK 8842',
    from: 'DEL',
    to: 'BOM',
    depart: '14:05',
    arrive: '16:35',
    duration: '2h 30m',
    stops: '1 stop · BLR',
    price: 4110,
    cabin: 'Economy',
    seatsLeft: 3
  },
  {
    id: 'FL-1140',
    airline: 'IndiGo',
    flightNo: '6E 1140',
    from: 'DEL',
    to: 'BOM',
    depart: '19:20',
    arrive: '21:25',
    duration: '2h 05m',
    stops: 'Non-stop',
    price: 6215,
    cabin: 'Business',
    seatsLeft: 9
  }
]

export const trips = [
  {
    id: 'TRIP-001',
    title: 'Delhi Kickoff',
    destination: 'Delhi',
    startDate: '2026-06-30',
    endDate: '2026-07-02',
    status: 'Completed'
  },
  {
    id: 'TRIP-002',
    title: 'Mumbai Client Visit',
    destination: 'Mumbai',
    startDate: '2026-07-18',
    endDate: '2026-07-19',
    status: 'Upcoming'
  },
  {
    id: 'TRIP-003',
    title: 'Bengaluru Sprint Review',
    destination: 'Bengaluru',
    startDate: '2026-07-24',
    endDate: '2026-07-26',
    status: 'Upcoming'
  }
]

export const corporateBookings = [
  {
    id: 'BKG-10432',
    type: 'flight',
    tripId: 'TRIP-002',
    flightNo: '6E 2291',
    airline: 'IndiGo',
    from: 'DEL',
    to: 'BOM',
    date: '2026-07-18',
    depart: '06:15',
    arrive: '08:20',
    passenger: 'Arjun Mehta',
    status: 'Confirmed',
    price: 4820,
    pnr: 'X7QK9L'
  },
  {
    id: 'BKG-10289',
    type: 'flight',
    tripId: 'TRIP-003',
    flightNo: 'AI 5502',
    airline: 'Air India',
    from: 'BOM',
    to: 'BLR',
    date: '2026-07-24',
    depart: '11:10',
    arrive: '12:35',
    passenger: 'Arjun Mehta',
    status: 'Confirmed',
    price: 3990,
    pnr: 'M2FQ81'
  },
  {
    id: 'BKG-09981',
    type: 'flight',
    tripId: 'TRIP-001',
    flightNo: '6E 0873',
    airline: 'IndiGo',
    from: 'PAT',
    to: 'DEL',
    date: '2026-06-30',
    depart: '17:45',
    arrive: '19:35',
    passenger: 'Arjun Mehta',
    status: 'Completed',
    price: 3210,
    pnr: 'KL4729'
  }
]

export const expenseCategories = [
  { key: 'meals', label: 'Meals', color: '#F97316' },
  { key: 'transport', label: 'Transport', color: '#2563EB' },
  { key: 'accommodation', label: 'Accommodation', color: '#22C55E' },
  { key: 'communication', label: 'Communication', color: '#A855F7' },
  { key: 'other', label: 'Other', color: '#64748B' }
]

export const seedExpenses = [
  {
    id: 'EXP-0001',
    date: '2026-07-01',
    category: 'meals',
    merchant: 'Swiggy',
    description: 'Team dinner',
    amount: 1850,
    status: 'Approved',
    tripId: 'TRIP-001',
    bookingId: null
  },
  {
    id: 'EXP-0002',
    date: '2026-07-01',
    category: 'transport',
    merchant: 'Ola',
    description: 'Airport cab',
    amount: 620,
    status: 'Approved',
    tripId: 'TRIP-001',
    bookingId: null
  },
  {
    id: 'EXP-0003',
    date: '2026-07-02',
    category: 'accommodation',
    merchant: 'Taj Palace Hotel',
    description: '2-night stay',
    amount: 9400,
    status: 'Pending',
    tripId: 'TRIP-001',
    bookingId: null
  },
  {
    id: 'EXP-0004',
    date: '2026-07-02',
    category: 'meals',
    merchant: 'Zomato',
    description: 'Working lunch',
    amount: 540,
    status: 'Approved',
    tripId: 'TRIP-001',
    bookingId: null
  },
  {
    id: 'EXP-0005',
    date: '2026-07-18',
    category: 'transport',
    merchant: 'Rapido',
    description: 'Office to airport',
    amount: 280,
    status: 'Pending',
    tripId: 'TRIP-002',
    bookingId: null
  },
  {
    id: 'EXP-0006',
    date: '2026-07-18',
    category: 'meals',
    merchant: 'Airport Lounge',
    description: 'Breakfast',
    amount: 850,
    status: 'Rejected',
    tripId: 'TRIP-002',
    bookingId: null
  },
  {
    id: 'EXP-0007',
    date: '2026-07-19',
    category: 'communication',
    merchant: 'Airtel',
    description: 'Roaming recharge',
    amount: 299,
    status: 'Approved',
    tripId: 'TRIP-002',
    bookingId: null
  }
]

export const advances = [
  {
    id: 'ADV-0001',
    tripId: 'TRIP-001',
    purpose: 'Delhi trip advance',
    requestedOn: '2026-06-28',
    amount: 15000,
    adjusted: 12410,
    status: 'Settled'
  },
  {
    id: 'ADV-0002',
    tripId: 'TRIP-002',
    purpose: 'Mumbai visit advance',
    requestedOn: '2026-07-15',
    amount: 8000,
    adjusted: 0,
    status: 'Approved'
  }
]

export const currentUser = {
  name: 'Arjun Mehta',
  email: 'arjun.mehta@skydesk.in',
  department: 'Product',
  designation: 'Senior Product Manager',
  employeeId: 'EMP-00421',
  phone: '+91 98765 43210',
  manager: 'Priya Nair',
  travelClass: 'Economy',
  hotelBudget: '₹5,000/night',
  mealAllowance: '₹800/day',
  city: 'Bengaluru',
  timezone: 'Asia/Kolkata'
}

export const budgets = [
  { category: 'Meals', monthly: 5000, color: '#F97316' },
  { category: 'Transport', monthly: 3000, color: '#2563EB' },
  { category: 'Accommodation', monthly: 15000, color: '#22C55E' },
  { category: 'Communication', monthly: 1000, color: '#A855F7' },
  { category: 'Other', monthly: 2000, color: '#64748B' }
]

// ── Chart Data ────────────────────────────────

export const spendByWeek = [
  { label: 'W1', total: 3200 },
  { label: 'W2', total: 5800 },
  { label: 'W3', total: 2100 },
  { label: 'W4', total: 7400 },
  { label: 'W5', total: 4300 },
  { label: 'W6', total: 6100 },
  { label: 'W7', total: 3900 },
  { label: 'W8', total: 8200 }
]

export const spendByMonth = [
  { label: 'Feb', total: 18500 },
  { label: 'Mar', total: 24300 },
  { label: 'Apr', total: 19800 },
  { label: 'May', total: 31200 },
  { label: 'Jun', total: 22600 },
  { label: 'Jul', total: 13840 }
]

export const spendByYear = [
  { label: '2023', total: 198000 },
  { label: '2024', total: 245000 },
  { label: '2025', total: 312000 },
  { label: '2026', total: 130000 }
]

export const categorySpendByWeek = [
  { label: 'W1', meals: 1200, transport: 800, accommodation: 0, communication: 200, other: 1000 },
  { label: 'W2', meals: 1800, transport: 1400, accommodation: 2000, communication: 300, other: 300 },
  { label: 'W3', meals: 900, transport: 600, accommodation: 0, communication: 400, other: 200 },
  { label: 'W4', meals: 2200, transport: 1000, accommodation: 3500, communication: 500, other: 200 },
  { label: 'W5', meals: 1500, transport: 900, accommodation: 1200, communication: 400, other: 300 },
  { label: 'W6', meals: 2100, transport: 1300, accommodation: 1800, communication: 600, other: 300 },
  { label: 'W7', meals: 1400, transport: 700, accommodation: 1500, communication: 200, other: 100 },
  { label: 'W8', meals: 2800, transport: 1600, accommodation: 2500, communication: 800, other: 500 }
]

export const categorySpendByMonth = [
  { label: 'Feb', meals: 4500, transport: 3200, accommodation: 7800, communication: 1200, other: 1800 },
  { label: 'Mar', meals: 6200, transport: 4100, accommodation: 9800, communication: 1600, other: 2600 },
  { label: 'Apr', meals: 5100, transport: 2900, accommodation: 7200, communication: 1400, other: 3200 },
  { label: 'May', meals: 8400, transport: 5200, accommodation: 12000, communication: 2100, other: 3500 },
  { label: 'Jun', meals: 5800, transport: 3600, accommodation: 8500, communication: 1800, other: 2900 },
  { label: 'Jul', meals: 3240, transport: 1750, accommodation: 5800, communication: 2550, other: 500 }
]

export const categorySpendByYear = [
  { label: '2023', meals: 45000, transport: 32000, accommodation: 78000, communication: 18000, other: 25000 },
  { label: '2024', meals: 58000, transport: 41000, accommodation: 98000, communication: 22000, other: 26000 },
  { label: '2025', meals: 72000, transport: 52000, accommodation: 128000, communication: 28000, other: 32000 },
  { label: '2026', meals: 30000, transport: 18000, accommodation: 58000, communication: 12000, other: 12000 }
]

export const internationalFlights = [
  { id: 'FL-INT1', airline: 'British Airways', code: 'BA 178', from: 'JFK', to: 'LHR', depart: '09:15', arrive: '21:30', duration: '7h 15m', price: 33440, stops: 'Non-stop', tag: 'Best Value' },
  { id: 'FL-INT2', airline: 'Virgin Atlantic', code: 'VS 026', from: 'JFK', to: 'LHR', depart: '11:10', arrive: '23:20', duration: '7h 10m', price: 35600, stops: 'Non-stop', tag: 'Fastest' },
  { id: 'FL-INT3', airline: 'American Airlines', code: 'AA 100', from: 'JFK', to: 'LHR', depart: '18:25', arrive: '06:35', duration: '7h 10m', price: 31120, stops: 'Non-stop', tag: 'Lowest Fare' }
]

export const internationalRoutes = [
  { city: 'New York → London', code: 'JFK ↔ LHR', price: 31120, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=900&q=80' },
  { city: 'Los Angeles → Tokyo', code: 'LAX ↔ NRT', price: 48960, image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=900&q=80' },
  { city: 'Chicago → Paris', code: 'ORD ↔ CDG', price: 35600, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80' }
]
