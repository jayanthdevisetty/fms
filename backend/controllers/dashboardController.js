import CommonExpense from '../models/CommonExpense.js';
import Transaction from '../models/Transaction.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { calculateBalances, calculateTodaySummary } from '../utils/balanceCalculator.js';

export const getDashboard = asyncHandler(async (req, res) => {
  const [balances, today, recentTransactions, chartRows, pendingExpenses] = await Promise.all([
    calculateBalances(),
    calculateTodaySummary(),
    Transaction.find().sort({ date: -1, createdAt: -1 }).limit(8),
    Transaction.aggregate([
      {
        $group: {
          _id: { month: { $month: '$date' }, year: { $year: '$date' }, type: '$type' },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 24 }
    ]),
    CommonExpense.find({ status: 'Pending' }).sort({ year: -1, month: -1 }).limit(5)
  ]);

  const monthlyMap = new Map();
  chartRows.forEach((row) => {
    const key = `${row._id.year}-${String(row._id.month).padStart(2, '0')}`;
    const item = monthlyMap.get(key) || { month: key, income: 0, expense: 0 };
    item[row._id.type === 'Income' ? 'income' : 'expense'] = row.total;
    monthlyMap.set(key, item);
  });

  res.json({
    ...today,
    ...balances,
    recentTransactions,
    pendingExpenses,
    monthlySummary: Array.from(monthlyMap.values()).slice(-6)
  });
});
