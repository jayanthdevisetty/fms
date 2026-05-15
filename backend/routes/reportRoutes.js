import express from 'express';
import { exportReport, getReport } from '../controllers/reportController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/', getReport);
router.get('/export.csv', exportReport);

export default router;
