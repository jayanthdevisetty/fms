import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

export const BottomSheet = ({ open, title, onClose, children }) => (
  <AnimatePresence>
    {open && (
      <div className="fixed inset-0 z-40">
        <motion.button
          aria-label="Close"
          className="absolute inset-0 bg-slate-950/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="absolute inset-x-0 bottom-0 max-h-[92vh] overflow-y-auto rounded-t-[28px] bg-slate-50 p-4 pb-8 shadow-2xl dark:bg-slate-950"
        >
          <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-300 dark:bg-slate-700" />
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-950 dark:text-white">{title}</h2>
            <button onClick={onClose} className="grid h-11 w-11 place-items-center rounded-full bg-white text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-100">
              <X className="h-5 w-5" />
            </button>
          </div>
          {children}
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);
