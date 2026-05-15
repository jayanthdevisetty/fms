import { Pencil, Trash2 } from 'lucide-react';
import { currency, shortDate } from '../utils/format';

export const TransactionCard = ({ item, onEdit, onDelete }) => (
  <article className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-base font-black text-slate-950 dark:text-white">{item.personName || item.category}</p>
        <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">{item.category} • {item.paymentMode} • {shortDate(item.date)}</p>
      </div>
      <p className={`text-lg font-black ${item.type === 'Income' ? 'text-emerald-600' : 'text-red-600'}`}>
        {item.type === 'Income' ? '+' : '-'}{currency(item.amount)}
      </p>
    </div>
    {item.notes && <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-300">{item.notes}</p>}
    <div className="mt-3 flex justify-end gap-2">
      <button onClick={() => onEdit(item)} className="grid h-11 w-11 place-items-center rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200" aria-label="Edit">
        <Pencil className="h-4 w-4" />
      </button>
      <button onClick={() => onDelete(item)} className="grid h-11 w-11 place-items-center rounded-full bg-red-50 text-red-600 dark:bg-red-950/40" aria-label="Delete">
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  </article>
);
