// src/services/trip.service.js
// Trip retrieval logic.

import { query } from '../config/db.js';

/**
 * Fetch all trips for a user with their linked booking and flight details.
 *
 * @param {number} userId
 * @returns {object[]}
 */
export const getUserTrips = async (userId) => {
  const result = await query(
    `SELECT
       t.id,
       t.title,
       t.destination,
       t.start_date,
       t.end_date,
       t.status,
       t.created_at,
       b.booking_ref,
       b.pnr,
       b.status AS booking_status,
       f.flight_number,
       f.airline,
       f.origin,
       f.destination  AS flight_destination,
       f.departure_time,
       f.arrival_time,
       f.cabin_class
     FROM trips t
     LEFT JOIN bookings b ON b.id = t.booking_id
     LEFT JOIN flights  f ON f.id = b.flight_id
     WHERE t.user_id = $1
     ORDER BY t.start_date DESC NULLS LAST`,
    [userId]
  );
  return result.rows;
};
