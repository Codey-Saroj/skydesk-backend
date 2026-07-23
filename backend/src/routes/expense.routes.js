// src/routes/expense.routes.js

import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import * as expenseController from '../controllers/expense.controller.js';
import { createExpenseRules, validate } from '../validators/expense.validator.js';

const router = Router();

router.use(authenticate);

router.get('/',    expenseController.getExpenses);
router.post('/',   createExpenseRules, validate, expenseController.createExpense);
router.get('/:id', expenseController.getExpenseById);

export default router;
