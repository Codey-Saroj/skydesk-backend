// src/validators/booking.validator.js
import { body, validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  const err = new Error('Validation failed');
  err.errors = result.array();
  err.statusCode = 422;
  next(err);
};

/** Rules for POST /api/v1/bookings */
export const createBookingRules = [
  body('flight_id')
    .notEmpty().withMessage('flight_id is required.')
    .isInt({ gt: 0 }).withMessage('flight_id must be a positive integer.'),

  body('passengers')
    .optional()
    .isInt({ gt: 0, max: 9 }).withMessage('passengers must be between 1 and 9.'),
];
