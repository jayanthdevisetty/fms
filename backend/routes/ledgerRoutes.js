import express from 'express';
import { getLedger, searchLedgers, upsertLedger } from '../controllers/ledgerController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireFields } from '../middleware/validate.js';

const router = express.Router();

router.use(protect);
router.get('/', searchLedgers);
router.post('/', requireFields('personName'), upsertLedger);
router.get('/:personName', getLedger);

export default router;
