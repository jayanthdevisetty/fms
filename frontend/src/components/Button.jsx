export const Button = ({ children, className = '', variant = 'primary', ...props }) => {
  const styles = {
    primary: 'bg-brand-600 text-white shadow-soft active:scale-[0.98]',
    secondary: 'bg-white text-slate-900 ring-1 ring-slate-200 active:scale-[0.98] dark:bg-slate-900 dark:text-white dark:ring-slate-800',
    danger: 'bg-red-600 text-white shadow-soft active:scale-[0.98]',
    ghost: 'bg-transparent text-slate-700 active:bg-slate-100 dark:text-slate-200 dark:active:bg-slate-800'
  };
  return (
    <button className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-4 text-base font-bold transition ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
