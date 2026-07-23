// src/services/booking.service.js
// Booking creation, retrieval, and cancellation.
// All mutations that touch multiple tables run inside a transaction.

import { query } from '../config/db.js';
import pool from '../config/db.js';
import AppError from '../utils/AppError.js';
import { BOOKING_STATUS } from '../constants/index.js';

/**
 * Generate a unique booking reference like "SKD-20240718-A3F2".
 */
const generateBookingRef = () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SKD-${date}-${rand}`;
};

/**
 * Generate a random PNR like "X7QK9L".
 */
const generatePNR = () =>
  Math.random().toString(36).substring(2, 8).toUpperCase();

/**
 * Fetch all bookings for a user (with joined flight details).
 *
 * @param {number} userId
 * @returns {object[]}
 */
export const getUserBookings = async (userId) => {
  const result = await query(
    `SELECT
       b.id,
       b.booking_ref,
       b.pnr,
       b.status,
       b.passengers,
       b.total_price,
       b.seat_number,
       b.terminal,
       b.gate,
       b.booking_date,
       b.updated_at,
       f.id           AS flight_id,
       f.flight_number,
       f.airline,
       f.origin,
       f.destination,
       f.origin_city,
       f.destination_city,
       f.departure_time,
       f.arrival_time,
       f.duration,
       f.stops,
       f.cabin_class
     FROM bookings b
     JOIN flights f ON f.id = b.flight_id
     WHERE b.user_id = $1
     ORDER BY b.booking_date DESC`,
    [userId]
  );
  return result.rows;
};

/**
 * Fetch a single booking, verifying ownership.
 *
 * @param {number} userId
 * @param {number} bookingId
 * @returns {object}
 */
export const getBookingById = async (userId, bookingId) => {
  const result = await query(
    `SELECT b.*, f.flight_number, f.airline, f.origin, f.destination,
            f.origin_city, f.destination_city, f.departure_time, f.arrival_time,
            f.duration, f.stops, f.cabin_class
     FROM bookings b
     JOIN flights f ON f.id = b.flight_id
     WHERE b.id = $1 AND b.user_id = $2`,
    [bookingId, userId]
  );

  if (result.rows.length === 0) {
    throw new AppError('Booking not found.', 404);
  }

  return result.rows[0];
};

/**
 * Create a new booking.
 * Runs inside a transaction:
 *   1. Lock the flight row
 *   2. Check seat availability
 *   3. Deduct seats
 *   4. Insert booking
 *
 * @param {number} userId
 * @param {number} flightId
 * @param {number} passengers
 * @returns {object} Newly created booking row
 */
export const createBooking = async (userId, flightId, passengers = 1) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Lock the flight row to prevent race conditions on seat updates
    const flightResult = await client.query(
      'SELECT id, price, available_seats FROM flights WHERE id = $1 FOR UPDATE',
      [flightId]
    );

    if (flightResult.rows.length === 0) {
      throw new AppError('Flight not found.', 404);
    }

    const flight = flightResult.rows[0];

    if (flight.available_seats < passengers) {
      throw new AppError(
        `Not enough seats available. Only ${flight.available_seats} seat(s) left.`,
        409
      );
    }

    const totalPrice = parseFloat(flight.price) * passengers;
    const bookingRef = generateBookingRef();
    const pnr = generatePNR();

    // Deduct seats
    await client.query(
      'UPDATE flights SET available_seats = available_seats - $1 WHERE id = $2',
      [passengers, flightId]
    );

    // Insert booking
    const bookingResult = await client.query(
      `INSERT INTO bookings
         (user_id, flight_id, booking_ref, pnr, passengers, total_price)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [userId, flightId, bookingRef, pnr, passengers, totalPrice]
    );

    await client.query('COMMIT');

    return bookingResult.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err; // Re-throw so the errorHandler catches it
  } finally {
    client.release();
  }
};

/**
 * Cancel a booking.
 * Restores the seats to the flight inside a transaction.
 * Only the booking owner may cancel (userId check).
 * Only confirmed/pending bookings can be cancelled.
 *
 * @param {number} userId
 * @param {number} bookingId
 * @returns {object} Updated booking
 */
export const cancelBooking = async (userId, bookingId) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const bookingResult = await client.query(
      'SELECT id, flight_id, passengers, status FROM bookings WHERE id = $1 AND user_id = $2 FOR UPDATE',
      [bookingId, userId]
    );

    if (bookingResult.rows.length === 0) {
      throw new AppError('Booking not found.', 404);
    }

    const booking = bookingResult.rows[0];

    if (booking.status === BOOKING_STATUS.CANCELLED) {
      throw new AppError('Booking is already cancelled.', 409);
    }

    if (booking.status === BOOKING_STATUS.COMPLETED) {
      throw new AppError('Completed bookings cannot be cancelled.', 409);
    }

    // Restore seats
    await client.query(
      'UPDATE flights SET available_seats = available_seats + $1 WHERE id = $2',
      [booking.passengers, booking.flight_id]
    );

    // Update booking status
    const updated = await client.query(
      `UPDATE bookings SET status = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [BOOKING_STATUS.CANCELLED, bookingId]
    );

    await client.query('COMMIT');

    return updated.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};
