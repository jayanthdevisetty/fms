import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

export const ConfirmDialog = ({ open, title, message, onCancel, onConfirm }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-5">
      <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl dark:bg-slate-900">
        <AlertTriangle className="mb-3 h-9 w-9 text-red-500" />
        <h3 className="text-xl font-black text-slate-950 dark:text-white">{title}</h3>
        <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">{message}</p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Button variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm}>Delete</Button>
        </div>
      </div>
    </div>
  );
};
