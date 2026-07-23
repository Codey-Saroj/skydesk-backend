// src/services/auth.service.js
// Authentication business logic.
// Interacts with database via db.query() using parameterized SQL only.

import bcrypt from 'bcryptjs';
import { query } from '../config/db.js';
import { signToken } from '../utils/jwt.js';
import AppError from '../utils/AppError.js';

/**
 * Register a new user.
 * 
 * @param {string} name
 * @param {string} email
 * @param {string} password  Plain-text password (will be hashed)
 * @returns {Promise<{ user: object }>}
 */
export const signup = async (name, email, password) => {
  // Check for existing duplicate email
  const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length > 0) {
    throw new AppError('An account with this email already exists.', 409);
  }

  // Hash password with bcrypt
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Insert user into users table with parameterized query
  const result = await query(
    `INSERT INTO users (name, email, password)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, role, avatar_url, created_at, updated_at`,
    [name, email, hashedPassword]
  );

  const user = result.rows[0];
  return { user };
};

/**
 * Legacy register method signature for backward compatibility.
 */
export const register = signup;

/**
 * Authenticate user with email and password.
 * 
 * @param {string} email
 * @param {string} password  Plain-text password
 * @returns {Promise<{ token: string, user: object }>}
 */
export const signin = async (email, password) => {
  // Fetch user including password hash for bcrypt compare
  const result = await query(
    'SELECT id, name, email, password, role, avatar_url, created_at, updated_at FROM users WHERE email = $1',
    [email]
  );

  const INVALID_CREDENTIALS_MSG = 'Invalid email or password.';

  if (result.rows.length === 0) {
    throw new AppError(INVALID_CREDENTIALS_MSG, 401);
  }

  const user = result.rows[0];
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError(INVALID_CREDENTIALS_MSG, 401);
  }

  // Strip password hash from returned user object
  const { password: _pwd, ...userWithoutPassword } = user;

  // Generate JWT token
  const token = signToken({
    id: userWithoutPassword.id,
    email: userWithoutPassword.email,
    role: userWithoutPassword.role,
  });

  return {
    token,
    user: userWithoutPassword,
  };
};

/**
 * Legacy login method signature for backward compatibility.
 */
export const login = signin;

/**
 * Fetch profile by user ID.
 * 
 * @param {number} userId
 * @returns {Promise<object>} User object without password
 */
export const getProfile = async (userId) => {
  const result = await query(
    'SELECT id, name, email, role, avatar_url, created_at, updated_at FROM users WHERE id = $1',
    [userId]
  );

  if (result.rows.length === 0) {
    throw new AppError('User not found.', 404);
  }

  return result.rows[0];
};

/**
 * Password reset request stub.
 * 
 * @param {string} email
 */
export const forgotPassword = async (email) => {
  console.log(`[AUTH] Password reset requested for: ${email}`);
  return true;
};
