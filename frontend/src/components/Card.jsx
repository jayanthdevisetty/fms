export const Card = ({ children, className = '' }) => (
  <section className={`rounded-2xl bg-white p-4 shadow-soft ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800 ${className}`}>{children}</section>
);
