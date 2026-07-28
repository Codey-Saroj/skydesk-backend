// src/services/booking.service.js
// Booking creation, retrieval, and cancellation.
// All mutations that touch multiple tables run inside a transaction.

import prisma from '../lib/prisma.js';
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

  return await prisma.bookings.findMany({
    where: {
      user_id: userId,
    },
    include: {
      flights: true,
    },
    orderBy: {
      booking_date: 'desc',
    },
  });

};

/**
 * Fetch a single booking, verifying ownership.
 *
 * @param {number} userId
 * @param {number} bookingId
 * @returns {object}
 */
export const getBookingById = async (userId, bookingId) => {

  const booking = await prisma.bookings.findFirst({
    where: {
      id: bookingId,
      user_id: userId,
    },
    include: {
      flights: true,
    },
  });

  if (!booking) {
    throw new AppError('Booking not found.', 404);
  }

  return booking;
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
export const createBooking = async (
  userId,
  flightId,
  passengers = 1,
  bookingData = {}
) => {
  return await prisma.$transaction(async (tx) => {

    // Get flight
    const flight = await tx.flights.findUnique({
      where: {
        id: flightId,
      },
    });

    if (!flight) {
      throw new AppError('Flight not found.', 404);
    }

    // Check seat availability
    if (flight.available_seats < passengers) {
      throw new AppError(
        `Not enough seats available. Only ${flight.available_seats} seat(s) left.`,
        409
      );
    }

    const totalPrice =
  bookingData.total_price ??
  Number(flight.price) * passengers;
    const bookingRef = generateBookingRef();
    const pnr = generatePNR();

    // Deduct seats
    await tx.flights.update({
      where: {
        id: flightId,
      },
      data: {
        available_seats: {
          decrement: passengers,
        },
      },
    });

    // Create booking
    const booking = await tx.bookings.create({
      data: {
  user_id: userId,
  flight_id: flightId,

  booking_ref: bookingRef,
  pnr,

  passengers,

  total_price: totalPrice,

  seat_number: bookingData.seat_number,

  cabin_class: bookingData.cabin_class,
},
    });

    return booking;
  });
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
  return await prisma.$transaction(async (tx) => {

    const booking = await tx.bookings.findFirst({
      where: {
        id: bookingId,
        user_id: userId,
      },
    });

    if (!booking) {
      throw new AppError('Booking not found.', 404);
    }

    if (booking.status === BOOKING_STATUS.CANCELLED) {
      throw new AppError('Booking is already cancelled.', 409);
    }

    if (booking.status === BOOKING_STATUS.COMPLETED) {
      throw new AppError('Completed bookings cannot be cancelled.', 409);
    }

    // Restore seats
    await tx.flights.update({
      where: {
        id: booking.flight_id,
      },
      data: {
        available_seats: {
          increment: booking.passengers,
        },
      },
    });

    // Cancel booking
    const updatedBooking = await tx.bookings.update({
      where: {
        id: bookingId,
      },
      data: {
        status: BOOKING_STATUS.CANCELLED,
        updated_at: new Date(),
      },
    });

    return updatedBooking;
  });
};
