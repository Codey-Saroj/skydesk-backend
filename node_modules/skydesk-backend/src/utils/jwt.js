// src/utils/jwt.js
// Thin wrappers around jsonwebtoken so the secret/expiry config
// lives in one place and services never import 'jsonwebtoken' directly.

import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import AppError from './AppError.js';

/**
 * Sign a JWT.
 * @param {{ id: number, role: string }} payload
 * @returns {string} Signed token
 */
export const signToken = (payload) =>
  jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

/**
 * Verify a JWT and return its decoded payload.
 * Throws AppError 401 if the token is missing, expired, or invalid.
 * @param {string} token
 * @returns {{ id: number, role: string, iat: number, exp: number }}
 */
export const verifyToken = (token) => {
  if (!token) {
    throw new AppError('No token provided', 401);
  }
  try {
    return jwt.verify(token, env.jwtSecret);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new AppError('Token has expired. Please sign in again.', 401);
    }
    throw new AppError('Invalid token. Please sign in again.', 401);
  }
};
