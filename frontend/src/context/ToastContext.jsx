import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import { createContext, useContext, useMemo, useState } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
    window.setTimeout(() => setToast(null), 2600);
  };

  const value = useMemo(() => ({ showToast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed left-4 right-4 top-5 z-50 mx-auto flex max-w-md items-center gap-3 rounded-2xl bg-slate-950 px-4 py-3 text-white shadow-soft dark:bg-white dark:text-slate-950"
          >
            {toast.type === 'error' ? <XCircle className="h-5 w-5 text-red-400" /> : <CheckCircle2 className="h-5 w-5 text-emerald-400" />}
            <span className="text-sm font-semibold">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
