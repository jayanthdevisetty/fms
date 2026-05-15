import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AppError } from '../utils/appError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const authResponse = (user, token) => ({
  token,
  user: { id: user._id, name: user.name, phone: user.phone, role: user.role }
});

export const register = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json(authResponse(user, signToken(user._id)));
});

export const login = asyncHandler(async (req, res) => {
  const { phone, password } = req.body;
  const user = await User.findOne({ phone }).select('+password');
  if (!user || !(await user.comparePassword(password))) throw new AppError('Invalid phone or password', 401);
  if (!user.isActive) throw new AppError('Account is inactive', 403);
  res.json(authResponse(user, signToken(user._id)));
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});
