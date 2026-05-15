import { Plus } from 'lucide-react';

export const Fab = ({ onClick, label = 'Add' }) => (
  <button
    onClick={onClick}
    className="fixed bottom-24 right-5 z-30 inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-600 text-white shadow-2xl shadow-brand-600/30 transition active:scale-95"
    aria-label={label}
  >
    <Plus className="h-8 w-8" />
  </button>
);
