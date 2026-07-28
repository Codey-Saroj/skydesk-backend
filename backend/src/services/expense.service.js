// src/services/expense.service.js
// Expense retrieval and creation logic.

import prisma from '../lib/prisma.js';
import AppError from '../utils/AppError.js';

/**
 * Fetch expenses for a user with optional filters.
 *
 * @param {number} userId
 * @param {{ category?: string, status?: string, trip_id?: number }} filters
 * @returns {object[]}
 */
export const getUserExpenses = async (userId, { category, status, trip_id } = {}) => {
  const where = {
    user_id: userId,
  };

  if (category) {
    where.category = category;
  }

  if (status) {
    where.status = status;
  }

  if (trip_id) {
    where.trip_id = trip_id;
  }

  const expenses = await prisma.expenses.findMany({
    where,
    orderBy: [{ expense_date: 'desc' }, { created_at: 'desc' }],
    select: {
      id: true,
      title: true,
      amount: true,
      category: true,
      status: true,
      expense_date: true,
      receipt_url: true,
      notes: true,
      created_at: true,
      updated_at: true,
      trips: {
        select: {
          title: true,
        },
      },
    },
  });

  return expenses.map((expense) => ({
    ...expense,
    trip_title: expense.trips?.title ?? null,
  }));
};

/**
 * Create a new expense.
 *
 * @param {number} userId
 * @param {{ title: string, amount: number, category: string, expense_date: string, trip_id?: number, notes?: string }} data
 * @returns {object} Created expense row
 */
export const createExpense = async (userId, { title, amount, category, expense_date, trip_id, notes }) => {
  return prisma.expenses.create({
    data: {
      user_id: userId,
      title,
      amount,
      category,
      expense_date,
      trip_id: trip_id || null,
      notes: notes || null,
    },
  });
};

/**
 * Fetch a single expense, verifying ownership.
 *
 * @param {number} userId
 * @param {number} expenseId
 * @returns {object}
 */
export const getExpenseById = async (userId, expenseId) => {
  const expense = await prisma.expenses.findFirst({
    where: {
      id: expenseId,
      user_id: userId,
    },
  });

  if (!expense) {
    throw new AppError('Expense not found.', 404);
  }

  return expense;
};
