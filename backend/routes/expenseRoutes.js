import express from 'express';
import { createExpense, deleteExpense, getExpenses, updateExpense } from '../controllers/expenseController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';
import { requireFields } from '../middleware/validate.js';

const router = express.Router();

router.use(protect);
router.route('/').get(getExpenses).post(requireFields('expenseName', 'amount', 'month', 'year', 'status'), createExpense);
router.route('/:id').put(updateExpense).delete(authorize('Admin'), deleteExpense);

export default router;
