import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import Login from './pages/Login';
import { useAuth } from './context/AuthContext';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Transactions = lazy(() => import('./pages/Transactions'));
const Expenses = lazy(() => import('./pages/Expenses'));
const Ledgers = lazy(() => import('./pages/Ledgers'));
const Reports = lazy(() => import('./pages/Reports'));
const Settings = lazy(() => import('./pages/Settings'));

const Protected = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 p-5 text-base font-black text-slate-600 dark:bg-slate-950 dark:text-slate-200">Loading FMS...</div>}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <Protected>
              <AppLayout />
            </Protected>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="ledgers" element={<Ledgers />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
