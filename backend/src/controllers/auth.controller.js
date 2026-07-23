// src/controllers/auth.controller.js
// Authentication controllers handling request parsing and sending responses.
// No SQL queries here — business logic is delegated to authService.

import * as authService from '../services/auth.service.js';

/**
 * POST /api/auth/signup
 */
export const signup = async (req, res, next) => {
  try {
    const { fullName, name, email, password } = req.body;
    const userName = fullName || name;
    await authService.signup(userName, email, password);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Legacy register controller alias.
 */
export const register = signup;

/**
 * POST /api/auth/signin
 */
export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await authService.signin(email, password);

    res.status(200).json({
      success: true,
      token,
      user,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Legacy login controller alias.
 */
export const login = signin;

/**
 * GET /api/auth/me
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user.id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/forgot-password
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    await authService.forgotPassword(email);

    res.status(200).json({
      success: true,
      message: 'If an account exists for this email, a reset link has been sent.',
    });
  } catch (err) {
    next(err);
  }
};
