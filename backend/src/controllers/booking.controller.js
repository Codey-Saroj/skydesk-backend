// src/controllers/booking.controller.js
import { sendSuccess } from '../utils/response.js';
import * as bookingService from '../services/booking.service.js';
import { HTTP_STATUS } from '../constants/index.js';

export const getBookings = async (req, res, next) => {
  try {
    const bookings = await bookingService.getUserBookings(req.user.id);
    sendSuccess(res, { bookings, count: bookings.length }, 'Bookings fetched successfully.');
  } catch (err) {
    next(err);
  }
};

export const getBookingById = async (req, res, next) => {
  try {
    const booking = await bookingService.getBookingById(
      req.user.id,
      parseInt(req.params.id, 10)
    );
    sendSuccess(res, { booking }, 'Booking fetched successfully.');
  } catch (err) {
    next(err);
  }
};

export const createBooking = async (req, res, next) => {
  try {
    const { flight_id, passengers } = req.body;
    const booking = await bookingService.createBooking(
      req.user.id,
      parseInt(flight_id, 10),
      parseInt(passengers, 10) || 1
    );
    sendSuccess(res, { booking }, 'Booking confirmed successfully.', HTTP_STATUS.CREATED);
  } catch (err) {
    next(err);
  }
};

export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.cancelBooking(
      req.user.id,
      parseInt(req.params.id, 10)
    );
    sendSuccess(res, { booking }, 'Booking cancelled successfully.');
  } catch (err) {
    next(err);
  }
};
