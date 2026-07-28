

import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma.js';
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

  const existing = await prisma.users.findUnique({
    where: {
      email,
    },
  });

  if (existing) {
    throw new AppError('An account with this email already exists.', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.users.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
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

  const user = await prisma.users.findUnique({
    where: {
      email,
    },
  });

  const INVALID_CREDENTIALS_MSG = 'Invalid email or password.';

  if (!user) {
    throw new AppError(INVALID_CREDENTIALS_MSG, 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError(INVALID_CREDENTIALS_MSG, 401);
  }

  const { password: _pwd, ...userWithoutPassword } = user;

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

  const user = await prisma.users.findUnique({
    where: {
      id: Number(userId),
    },
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
    throw new AppError('User not found.', 404);
  }

  return user;
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
