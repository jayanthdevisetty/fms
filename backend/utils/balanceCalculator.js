import CommonExpense from '../models/CommonExpense.js';
import Transaction from '../models/Transaction.js';
import { endOfDay, startOfDay } from './dateRange.js';

const signedTotals = async (match = {}) => {
  const rows = await Transaction.aggregate([
    { $match: match },
    {
      $group: {
        _id: { category: '$category', type: '$type' },
        total: { $sum: '$amount' }
      }
    }
  ]);

  return rows.reduce(
    (acc, row) => {
      const categoryKey = row._id.category === 'Tent House' ? 'tent' : 'chiti';
      const typeKey = row._id.type === 'Income' ? 'income' : 'expense';
      acc[categoryKey][typeKey] = row.total;
      return acc;
    },
    { tent: { income: 0, expense: 0 }, chiti: { income: 0, expense: 0 } }
  );
};

export const calculateBalances = async (match = {}, commonExpenseMatch = {}) => {
  const totals = await signedTotals(match);
  const paidCommonExpenses = await CommonExpense.aggregate([
    { $match: { ...commonExpenseMatch, status: 'Paid' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  const pendingCommonExpenses = await CommonExpense.aggregate([
    { $match: { ...commonExpenseMatch, status: 'Pending' } },
    { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
  ]);

  const paidCommon = paidCommonExpenses[0]?.total || 0;
  const tentHouseBalance = totals.tent.income - totals.tent.expense - paidCommon;
  const chitiBalance = totals.chiti.income - totals.chiti.expense;

  return {
    tentHouseBalance,
    chitiBalance,
    overallBalance: tentHouseBalance + chitiBalance,
    paidCommonExpenses: paidCommon,
    pendingExpensesAmount: pendingCommonExpenses[0]?.total || 0,
    pendingExpensesCount: pendingCommonExpenses[0]?.count || 0,
    totals
  };
};

export const calculateTodaySummary = async (date = new Date()) => {
  const match = { date: { $gte: startOfDay(date), $lte: endOfDay(date) } };
  const totals = await Transaction.aggregate([
    { $match: match },
    { $group: { _id: '$type', total: { $sum: '$amount' } } }
  ]);

  return {
    todayIncome: totals.find((x) => x._id === 'Income')?.total || 0,
    todayExpense: totals.find((x) => x._id === 'Expense')?.total || 0
  };
};
