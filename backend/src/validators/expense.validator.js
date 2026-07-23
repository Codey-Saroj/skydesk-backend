// src/validators/expense.validator.js
import { body, validationResult } from 'express-validator';
import { EXPENSE_CATEGORIES } from '../constants/index.js';

export const validate = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  const err = new Error('Validation failed');
  err.errors = result.array();
  err.statusCode = 422;
  next(err);
};

/** Rules for POST /api/v1/expenses */
export const createExpenseRules = [
  body('title')
    .trim()
    .notEmpty().withMessage('Merchant / title is required.')
    .isLength({ max: 200 }).withMessage('Title must be 200 characters or fewer.'),

  body('amount')
    .notEmpty().withMessage('Amount is required.')
    .isFloat({ gt: 0 }).withMessage('Amount must be a positive number.'),

  body('category')
    .notEmpty().withMessage('Category is required.')
    .isIn(EXPENSE_CATEGORIES).withMessage(`Category must be one of: ${EXPENSE_CATEGORIES.join(', ')}.`),

  body('expense_date')
    .notEmpty().withMessage('Expense date is required.')
    .isISO8601().withMessage('Expense date must be a valid date (YYYY-MM-DD).')
    .toDate(),

  body('trip_id')
    .optional({ nullable: true })
    .isInt({ gt: 0 }).withMessage('trip_id must be a positive integer.'),

  body('notes')
    .optional()
    .isLength({ max: 1000 }).withMessage('Notes must be 1000 characters or fewer.'),
];
