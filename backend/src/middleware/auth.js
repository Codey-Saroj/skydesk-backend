// src/middleware/auth.js
// JWT authentication + role-based authorization middleware.

import prisma from '../lib/prisma.js';
import { verifyToken } from '../utils/jwt.js';
import AppError from '../utils/AppError.js';

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

    const user = await prisma.users.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar_url: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!user) {
      throw new AppError('User no longer exists.', 401);
    }

    req.user = user;
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
