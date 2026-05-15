import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AppError } from '../utils/appError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.split(' ')[1] : null;
  if (!token) throw new AppError('Authentication required', 401);

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select('-password');
  if (!user || !user.isActive) throw new AppError('User no longer exists or is inactive', 401);

  req.user = user;
  next();
});

export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) throw new AppError('You do not have permission for this action', 403);
  next();
};
