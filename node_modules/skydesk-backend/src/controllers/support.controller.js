// src/controllers/support.controller.js
import { sendSuccess } from '../utils/response.js';
import * as supportService from '../services/support.service.js';
import { HTTP_STATUS } from '../constants/index.js';

export const createTicket = async (req, res, next) => {
  try {
    const { subject, message } = req.body;
    const ticket = await supportService.createTicket(req.user.id, subject, message);
    sendSuccess(res, { ticket }, 'Support ticket created successfully.', HTTP_STATUS.CREATED);
  } catch (err) {
    next(err);
  }
};

export const getTickets = async (req, res, next) => {
  try {
    const tickets = await supportService.getUserTickets(req.user.id);
    sendSuccess(res, { tickets, count: tickets.length }, 'Tickets fetched successfully.');
  } catch (err) {
    next(err);
  }
};
