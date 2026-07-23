// src/services/expense.service.js
// Expense retrieval and creation logic.

import { query } from '../config/db.js';
import AppError from '../utils/AppError.js';

/**
 * Fetch expenses for a user with optional filters.
 *
 * @param {number} userId
 * @param {{ category?: string, status?: string, trip_id?: number }} filters
 * @returns {object[]}
 */
export const getUserExpenses = async (userId, { category, status, trip_id } = {}) => {
  const conditions = ['e.user_id = $1'];
  const params = [userId];

  if (category) {
    params.push(category);
    conditions.push(`e.category = $${params.length}`);
  }

  if (status) {
    params.push(status);
    conditions.push(`e.status = $${params.length}`);
  }

  if (trip_id) {
    params.push(trip_id);
    conditions.push(`e.trip_id = $${params.length}`);
  }

  const result = await query(
    `SELECT
       e.id,
       e.title,
       e.amount,
       e.category,
       e.status,
       e.expense_date,
       e.receipt_url,
       e.notes,
       e.created_at,
       e.updated_at,
       t.title AS trip_title
     FROM expenses e
     LEFT JOIN trips t ON t.id = e.trip_id
     WHERE ${conditions.join(' AND ')}
     ORDER BY e.expense_date DESC, e.created_at DESC`,
    params
  );

  return result.rows;
};

/**
 * Create a new expense.
 *
 * @param {number} userId
 * @param {{ title: string, amount: number, category: string, expense_date: string, trip_id?: number, notes?: string }} data
 * @returns {object} Created expense row
 */
export const createExpense = async (userId, { title, amount, category, expense_date, trip_id, notes }) => {
  const result = await query(
    `INSERT INTO expenses (user_id, title, amount, category, expense_date, trip_id, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [userId, title, amount, category, expense_date, trip_id || null, notes || null]
  );

  return result.rows[0];
};

/**
 * Fetch a single expense, verifying ownership.
 *
 * @param {number} userId
 * @param {number} expenseId
 * @returns {object}
 */
export const getExpenseById = async (userId, expenseId) => {
  const result = await query(
    'SELECT * FROM expenses WHERE id = $1 AND user_id = $2',
    [expenseId, userId]
  );

  if (result.rows.length === 0) {
    throw new AppError('Expense not found.', 404);
  }

  return result.rows[0];
};
