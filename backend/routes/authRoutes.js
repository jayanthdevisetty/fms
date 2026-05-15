import express from 'express';
import { login, me, register } from '../controllers/authController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';
import { requireFields } from '../middleware/validate.js';

const router = express.Router();

router.post('/login', requireFields('phone', 'password'), login);
router.post('/register', protect, authorize('Admin'), requireFields('name', 'phone', 'password'), register);
router.get('/me', protect, me);

export default router;
