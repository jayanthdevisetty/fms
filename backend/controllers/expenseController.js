import CommonExpense from '../models/CommonExpense.js';
import { AppError } from '../utils/appError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const buildQuery = (query) => {
  const filter = {};
  if (query.status) filter.status = query.status;
  if (query.month) filter.month = Number(query.month);
  if (query.year) filter.year = Number(query.year);
  return filter;
};

export const getExpenses = asyncHandler(async (req, res) => {
  const items = await CommonExpense.find(buildQuery(req.query)).sort({ year: -1, month: -1, createdAt: -1 });
  res.json(items);
});

export const createExpense = asyncHandler(async (req, res) => {
  const expense = await CommonExpense.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json(expense);
});

export const updateExpense = asyncHandler(async (req, res) => {
  const expense = await CommonExpense.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!expense) throw new AppError('Expense not found', 404);
  res.json(expense);
});

export const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await CommonExpense.findByIdAndDelete(req.params.id);
  if (!expense) throw new AppError('Expense not found', 404);
  res.json({ message: 'Expense deleted' });
});
