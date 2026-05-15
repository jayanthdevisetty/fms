import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CheckCircle2, Clock, Pencil, Trash2 } from 'lucide-react';
import api from '../services/api';
import { BottomSheet } from '../components/BottomSheet';
import { Button } from '../components/Button';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Fab } from '../components/Fab';
import { FormField, inputClass } from '../components/FormField';
import { useFetch } from '../hooks/useFetch';
import { useToast } from '../context/ToastContext';
import { currency } from '../utils/format';

const names = ['Tent House Current Bill', 'KSR House Current Bill', 'Bike Petrol', 'Salary', 'Maintenance', 'Food', 'Other'];

const ExpenseForm = ({ initial, onSubmit, saving }) => {
  const now = new Date();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initial || { expenseName: names[0], amount: '', month: now.getMonth() + 1, year: now.getFullYear(), status: 'Pending', notes: '' }
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField label="Expense name"><select className={inputClass} {...register('expenseName')}>{names.map((name) => <option key={name}>{name}</option>)}</select></FormField>
      <div className="grid grid-cols-3 gap-3">
        <FormField label="Amount" error={errors.amount}><input className={inputClass} type="number" inputMode="decimal" {...register('amount', { required: 'Amount required', valueAsNumber: true })} /></FormField>
        <FormField label="Month"><input className={inputClass} type="number" min="1" max="12" {...register('month', { valueAsNumber: true })} /></FormField>
        <FormField label="Year"><input className={inputClass} type="number" {...register('year', { valueAsNumber: true })} /></FormField>
      </div>
      <FormField label="Status"><select className={inputClass} {...register('status')}><option>Pending</option><option>Paid</option></select></FormField>
      <FormField label="Notes"><textarea className={`${inputClass} min-h-24 py-3`} {...register('notes')} /></FormField>
      <Button className="w-full" disabled={saving}>{saving ? 'Saving...' : 'Save expense'}</Button>
    </form>
  );
};

export default function Expenses() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const { showToast } = useToast();
  const { data, loading, refresh } = useFetch(async () => (await api.get('/common-expenses')).data, []);

  const save = async (values) => {
    setSaving(true);
    try {
      if (editing) await api.put(`/common-expenses/${editing._id}`, values);
      else await api.post('/common-expenses', values);
      showToast(values.status === 'Paid' ? 'Expense saved and deducted' : 'Pending expense saved');
      setSheetOpen(false);
      setEditing(null);
      refresh();
    } catch (error) {
      showToast(error.response?.data?.message || 'Could not save expense', 'error');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    try {
      await api.delete(`/common-expenses/${deleting._id}`);
      showToast('Expense deleted');
      setDeleting(null);
      refresh();
    } catch (error) {
      showToast(error.response?.data?.message || 'Only admins can delete expenses', 'error');
    }
  };

  return (
    <div className="space-y-4">
      <div><h2 className="text-2xl font-black">Monthly bills</h2><p className="text-sm font-semibold text-slate-500">Paid bills reduce Tent House balance automatically.</p></div>
      {loading && <p className="rounded-2xl bg-white p-4 text-center font-bold text-slate-500 dark:bg-slate-900">Loading bills...</p>}
      <div className="space-y-3">
        {(data || []).map((item) => (
          <article key={item._id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-base font-black">{item.expenseName}</p>
                <p className="mt-1 text-sm font-bold text-slate-500">{item.month}/{item.year}</p>
              </div>
              <p className="text-xl font-black text-slate-950 dark:text-white">{currency(item.amount)}</p>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-black ${item.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40' : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40'}`}>
                {item.status === 'Paid' ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />} {item.status}
              </span>
              <div className="flex gap-2">
                <button onClick={() => { setEditing(item); setSheetOpen(true); }} className="grid h-11 w-11 place-items-center rounded-full bg-slate-100 dark:bg-slate-800"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => setDeleting(item)} className="grid h-11 w-11 place-items-center rounded-full bg-red-50 text-red-600 dark:bg-red-950/40"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </article>
        ))}
      </div>
      <Fab onClick={() => { setEditing(null); setSheetOpen(true); }} label="Add expense" />
      <BottomSheet open={sheetOpen} title={editing ? 'Edit bill' : 'Add bill'} onClose={() => setSheetOpen(false)}>
        <ExpenseForm initial={editing} onSubmit={save} saving={saving} />
      </BottomSheet>
      <ConfirmDialog open={Boolean(deleting)} title="Delete expense?" message="This will update Tent House balance if the expense was paid." onCancel={() => setDeleting(null)} onConfirm={remove} />
    </div>
  );
}
