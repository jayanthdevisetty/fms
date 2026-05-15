import Ledger from '../models/Ledger.js';
import Transaction from '../models/Transaction.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const searchLedgers = asyncHandler(async (req, res) => {
  const search = req.query.search || '';
  const transactionNames = await Transaction.aggregate([
    { $match: { personName: { $regex: search, $options: 'i' } } },
    { $group: { _id: '$personName', lastDate: { $max: '$date' } } },
    { $sort: { lastDate: -1 } },
    { $limit: 20 }
  ]);
  const manualLedgers = await Ledger.find({ personName: { $regex: search, $options: 'i' } }).limit(20);
  const names = new Map();
  manualLedgers.forEach((item) => names.set(item.personName, { personName: item.personName, openingBalance: item.openingBalance }));
  transactionNames.forEach((item) => {
    if (item._id) names.set(item._id, { personName: item._id, lastDate: item.lastDate });
  });
  res.json(Array.from(names.values()));
});

export const getLedger = asyncHandler(async (req, res) => {
  const personName = decodeURIComponent(req.params.personName);
  const [ledger, transactions, totals] = await Promise.all([
    Ledger.findOne({ personName }),
    Transaction.find({ personName }).sort({ date: -1, createdAt: -1 }),
    Transaction.aggregate([
      { $match: { personName } },
      { $group: { _id: '$type', total: { $sum: '$amount' } } }
    ])
  ]);

  const totalReceived = totals.find((x) => x._id === 'Income')?.total || 0;
  const totalSpent = totals.find((x) => x._id === 'Expense')?.total || 0;
  const openingBalance = ledger?.openingBalance || 0;

  res.json({
    personName,
    openingBalance,
    totalReceived,
    totalSpent,
    remainingBalance: openingBalance + totalReceived - totalSpent,
    transactions
  });
});

export const upsertLedger = asyncHandler(async (req, res) => {
  const ledger = await Ledger.findOneAndUpdate(
    { personName: req.body.personName },
    req.body,
    { new: true, upsert: true, runValidators: true }
  );
  res.status(201).json(ledger);
});
