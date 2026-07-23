// src/middleware/rateLimiter.js
// Rate limiting middleware powered by express-rate-limit.
//
// Two limiters:
//   authLimiter  — applied to /api/v1/auth/* to prevent brute force
//   apiLimiter   — applied globally to all /api/* routes

import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

/**
 * Auth limiter: stricter — 10 attempts per 15 minutes.
 * Protects login and register endpoints from brute-force attacks.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,  // Return rate limit info in RateLimit-* headers
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
    data: null,
  },
  skip: () => env.isDev, // Disable in development so it doesn't interfere with testing
});

/**
 * General API limiter: 200 requests per 15 minutes per IP.
 * Applied to all API routes as a baseline protection.
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Rate limit exceeded. Please slow down your requests.',
    data: null,
  },
});
