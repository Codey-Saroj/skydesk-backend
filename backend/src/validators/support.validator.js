// src/validators/support.validator.js
import { body, validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  const err = new Error('Validation failed');
  err.errors = result.array();
  err.statusCode = 422;
  next(err);
};

/** Rules for POST /api/v1/support */
export const createTicketRules = [
  body('subject')
    .trim()
    .notEmpty().withMessage('Subject is required.')
    .isLength({ max: 300 }).withMessage('Subject must be 300 characters or fewer.'),

  body('message')
    .trim()
    .notEmpty().withMessage('Message is required.')
    .isLength({ min: 10 }).withMessage('Please provide at least 10 characters of detail.'),
];
