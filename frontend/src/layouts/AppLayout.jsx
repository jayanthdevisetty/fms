import { motion } from 'framer-motion';
import { BarChart3, Home, ReceiptText, Settings, Users, WalletCards } from 'lucide-react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/transactions', label: 'Entries', icon: ReceiptText },
  { to: '/expenses', label: 'Bills', icon: WalletCards },
  { to: '/ledgers', label: 'Ledger', icon: Users },
  { to: '/reports', label: 'Reports', icon: BarChart3 }
];

export const AppLayout = () => {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-slate-50/90 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-600">FMS</p>
            <h1 className="text-lg font-black">Financial Management</h1>
          </div>
          <NavLink to="/settings" className="grid h-11 w-11 place-items-center rounded-full bg-white text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-200">
            <Settings className="h-5 w-5" />
          </NavLink>
        </div>
      </header>

      <main className="safe-bottom mx-auto max-w-3xl px-4 py-4">
        <motion.div key={location.pathname} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
          <Outlet context={{ user }} />
        </motion.div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] pt-2 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
        <div className="mx-auto grid max-w-3xl grid-cols-5 gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex min-h-16 flex-col items-center justify-center gap-1 rounded-2xl text-[11px] font-black transition ${
                  isActive ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-100' : 'text-slate-500 dark:text-slate-400'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};
