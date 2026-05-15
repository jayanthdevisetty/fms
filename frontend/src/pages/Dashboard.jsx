import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { ArrowDownCircle, ArrowUpCircle, RefreshCw, Wallet, WalletCards } from 'lucide-react';
import api from '../services/api';
import { Card } from '../components/Card';
import { Skeleton } from '../components/Skeleton';
import { Button } from '../components/Button';
import { currency, shortDate } from '../utils/format';
import { useFetch } from '../hooks/useFetch';

const Stat = ({ title, value, tone, icon: Icon }) => (
  <Card className="min-h-32">
    <div className={`mb-4 grid h-11 w-11 place-items-center rounded-2xl ${tone}`}>
      <Icon className="h-6 w-6" />
    </div>
    <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{title}</p>
    <p className="mt-1 text-2xl font-black text-slate-950 dark:text-white">{currency(value)}</p>
  </Card>
);

export default function Dashboard() {
  const { data, loading, refresh } = useFetch(async () => (await api.get('/dashboard')).data, []);

  if (loading && !data) {
    return <div className="grid gap-4"><Skeleton className="h-36" /><Skeleton className="h-72" /><Skeleton className="h-48" /></div>;
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[28px] bg-slate-950 p-5 text-white shadow-soft dark:bg-brand-700">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-white/70">Overall balance</p>
            <h2 className="mt-1 text-4xl font-black">{currency(data?.overallBalance)}</h2>
          </div>
          <button onClick={refresh} className="grid h-12 w-12 place-items-center rounded-full bg-white/10" aria-label="Refresh">
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white/10 p-3">
            <p className="text-xs font-bold text-white/70">Tent House</p>
            <p className="text-lg font-black">{currency(data?.tentHouseBalance)}</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-3">
            <p className="text-xs font-bold text-white/70">Chiti</p>
            <p className="text-lg font-black">{currency(data?.chitiBalance)}</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4">
        <Stat title="Today Income" value={data?.todayIncome} tone="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40" icon={ArrowUpCircle} />
        <Stat title="Today Expense" value={data?.todayExpense} tone="bg-red-50 text-red-600 dark:bg-red-950/40" icon={ArrowDownCircle} />
        <Stat title="Pending Bills" value={data?.pendingExpensesAmount} tone="bg-amber-50 text-amber-600 dark:bg-amber-950/40" icon={WalletCards} />
        <Stat title="Paid Common" value={data?.paidCommonExpenses} tone="bg-sky-50 text-sky-600 dark:bg-sky-950/40" icon={Wallet} />
      </div>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-black">Monthly summary</h3>
          <span className="text-xs font-black text-slate-400">6 months</span>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.monthlySummary || []}>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(value) => currency(value)} />
              <Bar dataKey="income" fill="#10b981" radius={[8, 8, 0, 0]} />
              <Bar dataKey="expense" fill="#ef4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-black">Recent entries</h3>
          <Button variant="ghost" onClick={refresh} className="min-h-10 px-3 text-sm">Refresh</Button>
        </div>
        <div className="space-y-3">
          {(data?.recentTransactions || []).map((item) => (
            <div key={item._id} className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-slate-950">
              <div>
                <p className="font-black">{item.personName || item.category}</p>
                <p className="text-xs font-bold text-slate-500">{shortDate(item.date)} • {item.paymentMode}</p>
              </div>
              <p className={`font-black ${item.type === 'Income' ? 'text-emerald-600' : 'text-red-600'}`}>{currency(item.amount)}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
