// src/services/support.service.js
// Support ticket creation logic.

import prisma from '../lib/prisma.js';

/**
 * Create a support ticket for the authenticated user.
 *
 * @param {number} userId
 * @param {string} subject
 * @param {string} message
 * @returns {object} Created ticket row
 */
export const createTicket = async (userId, subject, message) => {
  return prisma.support_tickets.create({
    data: {
      user_id: userId,
      subject,
      message,
    },
    select: {
      id: true,
      subject: true,
      message: true,
      status: true,
      created_at: true,
    },
  });
};

/**
 * Fetch all support tickets for a user.
 *
 * @param {number} userId
 * @returns {object[]}
 */
export const getUserTickets = async (userId) => {
  return prisma.support_tickets.findMany({
    where: { user_id: userId },
    orderBy: { created_at: 'desc' },
    select: {
      id: true,
      subject: true,
      message: true,
      status: true,
      created_at: true,
      updated_at: true,
    },
  });
};
