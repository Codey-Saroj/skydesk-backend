// src/middleware/errorHandler.js
// Centralized error-handling middleware.
// Must be registered LAST in app.js (after all routes).
// Express identifies it as an error handler because it accepts 4 arguments (err, req, res, next).
//
// Handles four distinct error categories:
//   1. AppError           — Operational errors thrown intentionally by services
//   2. express-validator  — Validation failures with field-level detail
//   3. PostgreSQL errors  — Constraint violations translated to meaningful HTTP codes
//   4. Unexpected errors  — Programming bugs; never expose internals to the client

import { env } from '../config/env.js';

// PostgreSQL error codes we handle explicitly
const PG_UNIQUE_VIOLATION = '23505';
const PG_FK_VIOLATION = '23503';
const PG_NOT_NULL_VIOLATION = '23502';

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // ── 1. Logging ───────────────────────────────────────────────
  if (env.isDev) {
    console.error('🔥  Error:', err.stack || err);
  } else {
    // Production: log enough to diagnose but don't expose internals
    console.error(`🔥  [${new Date().toISOString()}] ${req.method} ${req.originalUrl} — ${err.message}`);
  }

  // ── 2. express-validator ValidationError array ───────────────
  // express-validator passes errors as an array on err.errors
  if (err.type === 'field' || Array.isArray(err.errors)) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed. Check the errors array for details.',
      errors: Array.isArray(err.errors)
        ? err.errors.map((e) => ({ field: e.path || e.param, message: e.msg }))
        : [{ message: err.message }],
      data: null,
    });
  }

  // ── 3. PostgreSQL constraint errors ──────────────────────────
  if (err.code === PG_UNIQUE_VIOLATION) {
    return res.status(409).json({
      success: false,
      message: 'A record with this value already exists.',
      errors: null,
      data: null,
    });
  }

  if (err.code === PG_FK_VIOLATION) {
    return res.status(400).json({
      success: false,
      message: 'Referenced record does not exist.',
      errors: null,
      data: null,
    });
  }

  if (err.code === PG_NOT_NULL_VIOLATION) {
    return res.status(400).json({
      success: false,
      message: `Field '${err.column}' is required.`,
      errors: null,
      data: null,
    });
  }

  // ── 4. Operational errors (AppError) ─────────────────────────
  // isOperational = true means we threw it intentionally from a service
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: null,
      data: null,
    });
  }

  // ── 5. Unexpected / programming errors ───────────────────────
  // Never expose internal details to the client in production
  return res.status(500).json({
    success: false,
    message: env.isDev ? err.message : 'An unexpected error occurred. Please try again later.',
    errors: null,
    data: null,
  });
};

export default errorHandler;
