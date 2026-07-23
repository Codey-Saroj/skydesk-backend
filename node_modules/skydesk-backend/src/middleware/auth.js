// src/middleware/auth.js
// JWT authentication + role-based authorization middleware.

import { verifyToken } from '../utils/jwt.js';
import AppError from '../utils/AppError.js';
import { query } from '../config/db.js';

/**
 * authenticate
 * Reads JWT from Authorization header (Bearer <token>), verifies it,
 * checks database for active user, and attaches user to req.user.
 * Returns 401 if missing, invalid, or expired.
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided.', 401);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new AppError('No token provided.', 401);
    }

    const decoded = verifyToken(token); // throws AppError with status 401 if invalid/expired

    // Fetch user row from DB to confirm user still exists
    const result = await query(
      'SELECT id, name, email, role, avatar_url, created_at, updated_at FROM users WHERE id = $1',
      [decoded.id]
    );

    if (result.rows.length === 0) {
      throw new AppError('User no longer exists.', 401);
    }

    req.user = result.rows[0];
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * authorize(...roles)
 * Restricts route access to specified user roles.
 */
export const authorize = (...roles) =>
  (req, _res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required.', 401));
    }
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          `Role '${req.user.role}' is not permitted to access this resource.`,
          403
        )
      );
    }
    next();
  };
