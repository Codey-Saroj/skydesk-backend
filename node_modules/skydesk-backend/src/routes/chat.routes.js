// src/routes/chat.routes.js
import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import * as chatController from '../controllers/chat.controller.js';

const router = Router();

// Secure chatbot access using the authentication middleware
router.post('/', authenticate, chatController.handleChat);

export default router;
