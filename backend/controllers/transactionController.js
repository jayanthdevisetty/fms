import Transaction from '../models/Transaction.js';
import { AppError } from '../utils/appError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const buildQuery = (query) => {
  const filter = {};
  if (query.type) filter.type = query.type;
  if (query.category) filter.category = query.category;
  if (query.paymentMode) filter.paymentMode = query.paymentMode;
  if (query.from || query.to) {
    filter.date = {};
    if (query.from) filter.date.$gte = new Date(query.from);
    if (query.to) filter.date.$lte = new Date(query.to);
  }
  if (query.search) {
    filter.$or = [
      { personName: { $regex: query.search, $options: 'i' } },
      { notes: { $regex: query.search, $options: 'i' } }
    ];
  }
  return filter;
};

export const getTransactions = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 25, 100);
  const filter = buildQuery(req.query);
  const [items, total] = await Promise.all([
    Transaction.find(filter).populate('createdBy', 'name role').sort({ date: -1, createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Transaction.countDocuments(filter)
  ]);
  res.json({ items, total, page, pages: Math.ceil(total / limit) });
});

export const createTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json(transaction);
});

export const updateTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!transaction) throw new AppError('Transaction not found', 404);
  res.json(transaction);
});

export const deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findByIdAndDelete(req.params.id);
  if (!transaction) throw new AppError('Transaction not found', 404);
  res.json({ message: 'Transaction deleted' });
});
