const formatTime = (isoString) =>
  isoString
    ? new Date(isoString).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

const titleCase = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

// Booking mapper
export function mapBooking(b) {
  const flight = b.flights || {};

  const departureDate = flight.departure_time
    ? new Date(flight.departure_time)
    : null;

  const status = titleCase(b.status);

  return {
    id: b.id,
    bookingId: b.booking_ref,
    pnr: b.pnr,

    flightNumber: flight.flight_number,
    airline: flight.airline,

    airlineCode:
      (flight.airline || "")
        .replace(/[^A-Za-z]/g, "")
        .slice(0, 2)
        .toUpperCase() || "✈",

    status,

    upcoming:
      status === "Confirmed" &&
      departureDate &&
      departureDate > new Date(),

    from: flight.origin_city,
    fromCode: flight.origin,

    to: flight.destination_city,
    toCode: flight.destination,

    date: flight.departure_time,

    departure: formatTime(flight.departure_time),
    arrival: formatTime(flight.arrival_time),

    class: flight.cabin_class,

    seat: b.seat_number,
    gate: b.gate,
    terminal: b.terminal,

    price: parseFloat(b.total_price) || 0,

    passengers: b.passengers,
  };
}

// Flight mapper
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
  };
}

// Airport code helper
export function extractAirportCode(value) {
  const match = /\(([A-Za-z]{3})\)/.exec(value || "");
  return (match ? match[1] : value || "").toUpperCase().trim();
}