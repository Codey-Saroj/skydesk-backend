// src/services/support.service.js
// Support ticket creation logic.

import { query } from '../config/db.js';

/**
 * Create a support ticket for the authenticated user.
 *
 * @param {number} userId
 * @param {string} subject
 * @param {string} message
 * @returns {object} Created ticket row
 */
export const createTicket = async (userId, subject, message) => {
  const result = await query(
    `INSERT INTO support_tickets (user_id, subject, message)
     VALUES ($1, $2, $3)
     RETURNING id, subject, message, status, created_at`,
    [userId, subject, message]
  );
  return result.rows[0];
};

/**
 * Fetch all support tickets for a user.
 *
 * @param {number} userId
 * @returns {object[]}
 */
export const getUserTickets = async (userId) => {
  const result = await query(
    `SELECT id, subject, message, status, created_at, updated_at
     FROM support_tickets
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows;
};
