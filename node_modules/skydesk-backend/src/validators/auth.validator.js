// src/validators/auth.validator.js
// express-validator rule chains for auth endpoints.

import { body, validationResult } from 'express-validator';

/**
 * validate
 * Runs validationResult and, if there are errors, creates a structured
 * error object that our errorHandler recognizes as a validation error.
 */
export const validate = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const err = new Error('Validation failed');
  err.errors = result.array();
  err.statusCode = 422;
  next(err);
};

/** Rules for POST /api/auth/signup */
export const registerRules = [
  body().custom((value, { req }) => {
    const name = req.body.fullName || req.body.name;
    if (!name || typeof name !== 'string' || !name.trim()) {
      throw new Error('Full name is required.');
    }
    if (name.length > 150) {
      throw new Error('Full name must be 150 characters or fewer.');
    }
    return true;
  }),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Enter a valid email address.')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required.')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters.'),
];

/** Rules for POST /api/auth/signin */
export const loginRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Enter a valid email address.')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required.'),
];

/** Rules for POST /api/auth/forgot-password */
export const forgotPasswordRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Enter a valid email address.')
    .normalizeEmail(),
];
