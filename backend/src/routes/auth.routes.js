// src/routes/auth.routes.js

import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import * as authController from '../controllers/auth.controller.js';
import {
  registerRules,
  loginRules,
  forgotPasswordRules,
  validate,
} from '../validators/auth.validator.js';

const router = Router();

// Apply auth rate limiter
router.use(authLimiter);

// Public authentication routes
router.post('/signup',          registerRules,       validate, authController.signup);
router.post('/signin',          loginRules,          validate, authController.signin);

// Compatibility alias routes
router.post('/register',        registerRules,       validate, authController.signup);
router.post('/login',           loginRules,          validate, authController.signin);
router.post('/forgot-password', forgotPasswordRules, validate, authController.forgotPassword);

// Protected route
router.get('/me',               authenticate,                  authController.getMe);

export default router;
