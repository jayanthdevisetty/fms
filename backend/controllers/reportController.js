import CommonExpense from '../models/CommonExpense.js';
import Transaction from '../models/Transaction.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { calculateBalances } from '../utils/balanceCalculator.js';
import { endOfDay, monthRange, startOfDay, yearRange } from '../utils/dateRange.js';

const rangeFromQuery = (query) => {
  if (query.period === 'daily') return { start: startOfDay(query.date || new Date()), end: endOfDay(query.date || new Date()) };
  if (query.period === 'yearly') return yearRange(query.year || new Date().getFullYear());
  return monthRange(query.year || new Date().getFullYear(), query.month || new Date().getMonth() + 1);
};

export const getReport = asyncHandler(async (req, res) => {
  const { start, end } = rangeFromQuery(req.query);
  const match = { date: { $gte: start, $lte: end } };
  const commonExpenseFilter =
    req.query.period === 'monthly'
      ? { month: Number(req.query.month || new Date().getMonth() + 1), year: Number(req.query.year || new Date().getFullYear()) }
      : req.query.period === 'yearly'
        ? { year: Number(req.query.year || new Date().getFullYear()) }
        : {};

  const [transactions, summary, commonExpenses] = await Promise.all([
    Transaction.find(match).sort({ date: -1 }),
    calculateBalances(match, commonExpenseFilter),
    CommonExpense.find(commonExpenseFilter)
  ]);

  res.json({ period: req.query.period || 'monthly', start, end, summary, transactions, commonExpenses });
});

export const exportReport = asyncHandler(async (req, res) => {
  const { start, end } = rangeFromQuery(req.query);
  const rows = await Transaction.find({ date: { $gte: start, $lte: end } }).sort({ date: -1 }).lean();
  const header = ['Date', 'Type', 'Category', 'Person Name', 'Payment Mode', 'Amount', 'Notes'];
  const csv = [
    header.join(','),
    ...rows.map((row) =>
      [
        new Date(row.date).toISOString().slice(0, 10),
        row.type,
        row.category,
        row.personName || '',
        row.paymentMode,
        row.amount,
        (row.notes || '').replaceAll('"', '""')
      ].map((value) => `"${value}"`).join(',')
    )
  ].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="fms-report.csv"');
  res.send(csv);
});
