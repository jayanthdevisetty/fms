import User from '../models/User.js';
import { AppError } from '../utils/appError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
});

export const createUser = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json({ id: user._id, name: user.name, phone: user.phone, role: user.role, isActive: user.isActive });
});

export const updateUser = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (!payload.password) delete payload.password;
  const user = await User.findById(req.params.id).select('+password');
  if (!user) throw new AppError('User not found', 404);
  Object.assign(user, payload);
  await user.save();
  res.json({ id: user._id, name: user.name, phone: user.phone, role: user.role, isActive: user.isActive });
});
