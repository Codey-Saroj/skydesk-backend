// src/controllers/expense.controller.js
import { sendSuccess } from '../utils/response.js';
import * as expenseService from '../services/expense.service.js';
import { HTTP_STATUS } from '../constants/index.js';

export const getExpenses = async (req, res, next) => {
  try {
    const { category, status, trip_id } = req.query;
    const expenses = await expenseService.getUserExpenses(req.user.id, {
      category,
      status,
      trip_id: trip_id ? parseInt(trip_id, 10) : undefined,
    });
    sendSuccess(res, { expenses, count: expenses.length }, 'Expenses fetched successfully.');
  } catch (err) {
    next(err);
  }
};

export const createExpense = async (req, res, next) => {
  try {
    const expense = await expenseService.createExpense(req.user.id, req.body);
    sendSuccess(res, { expense }, 'Expense logged successfully.', HTTP_STATUS.CREATED);
  } catch (err) {
    next(err);
  }
};

export const getExpenseById = async (req, res, next) => {
  try {
    const expense = await expenseService.getExpenseById(
      req.user.id,
      parseInt(req.params.id, 10)
    );
    sendSuccess(res, { expense }, 'Expense fetched successfully.');
  } catch (err) {
    next(err);
  }
};
