// src/controllers/chat.controller.js
import { sendSuccess } from '../utils/response.js';
import * as chatService from '../services/chat.service.js';
import AppError from '../utils/AppError.js';

export const handleChat = async (req, res, next) => {
  try {
    const { message, context, history } = req.body;

    if (!message || typeof message !== 'string') {
      throw new AppError('Message is required and must be a string.', 400);
    }

    if (!context || typeof context !== 'object') {
      throw new AppError('Context object is required.', 400);
    }

    const reply = await chatService.getBotResponse(message, context, history || []);
    sendSuccess(res, { reply }, 'Chat response generated successfully.');
  } catch (err) {
    // If it's a configuration issue, return a specific error that the frontend can handle to fall back
    if (err.message === 'GEMINI_API_KEY_NOT_CONFIGURED') {
      return next(new AppError('Gemini API is not configured on this server.', 503));
    }
    next(err);
  }
};
