export const FormField = ({ label, error, children }) => (
  <label className="block">
    <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">{label}</span>
    {children}
    {error && <span className="mt-1 block text-sm font-semibold text-red-600">{error.message || error}</span>}
  </label>
);

export const inputClass =
  'min-h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base font-semibold text-slate-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:ring-brand-900/40';
