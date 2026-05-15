import express from 'express';
import { createUser, getUsers, updateUser } from '../controllers/userController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';
import { requireFields } from '../middleware/validate.js';

const router = express.Router();

router.use(protect, authorize('Admin'));
router.route('/').get(getUsers).post(requireFields('name', 'phone', 'password', 'role'), createUser);
router.route('/:id').put(updateUser);

export default router;
