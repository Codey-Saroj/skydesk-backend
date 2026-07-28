// src/services/trip.service.js
// Trip retrieval logic.

import prisma from '../lib/prisma.js';

/**
 * Fetch all trips for a user with their linked booking and flight details.
 *
 * @param {number} userId
 * @returns {object[]}
 */
export const getUserTrips = async (userId) => {
  const trips = await prisma.trips.findMany({
    where: { user_id: userId },
    orderBy: [{ start_date: 'desc' }, { created_at: 'desc' }],
    select: {
      id: true,
      title: true,
      destination: true,
      start_date: true,
      end_date: true,
      status: true,
      created_at: true,
      bookings: {
        select: {
          booking_ref: true,
          pnr: true,
          status: true,
          flights: {
            select: {
              flight_number: true,
              airline: true,
              origin: true,
              destination: true,
              departure_time: true,
              arrival_time: true,
              cabin_class: true,
            },
          },
        },
      },
    },
  });

  return trips.map((trip) => ({
    ...trip,
    booking_ref: trip.bookings?.booking_ref ?? null,
    pnr: trip.bookings?.pnr ?? null,
    booking_status: trip.bookings?.status ?? null,
    flight_number: trip.bookings?.flights?.flight_number ?? null,
    airline: trip.bookings?.flights?.airline ?? null,
    origin: trip.bookings?.flights?.origin ?? null,
    flight_destination: trip.bookings?.flights?.destination ?? null,
    departure_time: trip.bookings?.flights?.departure_time ?? null,
    arrival_time: trip.bookings?.flights?.arrival_time ?? null,
    cabin_class: trip.bookings?.flights?.cabin_class ?? null,
  }));
};
