// ─────────────────────────────────────────────
//  API → UI shape mappers
//
//  The backend returns snake_case DB rows (e.g. origin_city,
//  departure_time, total_price). The existing UI components were
//  built against hand-written mock JSON with different field names
//  (e.g. fromCode, depart, price). These mappers bridge the two so
//  components don't need to be rewritten field-by-field.
// ─────────────────────────────────────────────

const formatTime = (isoString) =>
  isoString
    ? new Date(isoString).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    : '—'

const titleCase = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s)

// A booking row from GET /api/bookings or /api/bookings/:id
// (already joined with its flight in the backend query).
export function mapBooking(b) {
  const departureDate = b.departure_time ? new Date(b.departure_time) : null
  const status = titleCase(b.status)
  return {
    id: b.id,
    bookingId: b.booking_ref,
    pnr: b.pnr,
    flightNumber: b.flight_number,
    airline: b.airline,
    airlineCode: (b.airline || '').replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase() || '✈',
    status,
    upcoming: status === 'Confirmed' && departureDate && departureDate > new Date(),
    from: b.origin_city,
    fromCode: b.origin,
    to: b.destination_city,
    toCode: b.destination,
    date: b.departure_time,
    departure: formatTime(b.departure_time),
    arrival: formatTime(b.arrival_time),
    class: b.cabin_class,
    seat: b.seat_number,
    gate: b.gate,
    terminal: b.terminal,
    price: parseFloat(b.total_price) || 0,
    passengers: b.passengers,
  }
}

// A flight row from GET /api/flights or /api/flights/:id
export function mapFlight(f) {
  return {
    id: f.id,
    airline: f.airline,
    code: f.flight_number,
    flightNo: f.flight_number,
    from: f.origin_city,
    fromCode: f.origin,
    to: f.destination_city,
    toCode: f.destination,
    depart: formatTime(f.departure_time),
    arrive: formatTime(f.arrival_time),
    duration: f.duration,
    stops: f.stops,
    price: parseFloat(f.price) || 0,
    cabin: f.cabin_class,
    seatsLeft: f.available_seats,
  }
}

// Pull a 3-letter airport code out of strings like "Delhi (DEL)".
// Falls back to the raw (uppercased) string if no parens are found,
// so typing a bare code like "DEL" still works.
export function extractAirportCode(value) {
  const match = /\(([A-Za-z]{3})\)/.exec(value || '')
  return (match ? match[1] : value || '').toUpperCase().trim()
}
