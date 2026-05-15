import express from 'express';
import { createTransaction, deleteTransaction, getTransactions, updateTransaction } from '../controllers/transactionController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';
import { requireFields } from '../middleware/validate.js';

const router = express.Router();

router.use(protect);
router.route('/').get(getTransactions).post(requireFields('type', 'category', 'paymentMode', 'amount', 'date'), createTransaction);
router.route('/:id').put(updateTransaction).delete(authorize('Admin'), deleteTransaction);

export default router;
