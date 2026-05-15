import { AppError } from '../utils/appError.js';

export const requireFields = (...fields) => (req, res, next) => {
  const missing = fields.filter((field) => req.body[field] === undefined || req.body[field] === '');
  if (missing.length) throw new AppError(`Missing required fields: ${missing.join(', ')}`, 400);
  next();
};
