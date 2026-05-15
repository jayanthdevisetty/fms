import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import api from '../services/api';
import { BottomSheet } from '../components/BottomSheet';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Fab } from '../components/Fab';
import { FormField, inputClass } from '../components/FormField';
import { TransactionCard } from '../components/TransactionCard';
import { TransactionForm } from '../components/TransactionForm';
import { useFetch } from '../hooks/useFetch';
import { useToast } from '../context/ToastContext';

export default function Transactions() {
  const [filters, setFilters] = useState({ search: '', type: '', category: '' });
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const { showToast } = useToast();

  const { data, loading, refresh } = useFetch(async () => {
    const { data } = await api.get('/transactions', { params: { ...filters, limit: 50 } });
    return data.items;
  }, [filters.search, filters.type, filters.category]);

  const save = async (values) => {
    setSaving(true);
    try {
      if (editing) await api.put(`/transactions/${editing._id}`, values);
      else await api.post('/transactions', values);
      showToast('Entry saved');
      setSheetOpen(false);
      setEditing(null);
      refresh();
    } catch (error) {
      showToast(error.response?.data?.message || 'Could not save entry', 'error');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    try {
      await api.delete(`/transactions/${deleting._id}`);
      showToast('Entry deleted');
      setDeleting(null);
      refresh();
    } catch (error) {
      showToast(error.response?.data?.message || 'Only admins can delete entries', 'error');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-black">Entries</h2>
        <p className="text-sm font-semibold text-slate-500">Income and expenses for Tent House and Chiti.</p>
      </div>
      <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5 text-slate-400" />
          <input className="min-h-11 flex-1 bg-transparent text-base font-semibold outline-none" placeholder="Search person or notes" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
          <SlidersHorizontal className="h-5 w-5 text-slate-400" />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <select className={inputClass} value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
            <option value="">All types</option><option>Income</option><option>Expense</option>
          </select>
          <select className={inputClass} value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
            <option value="">All categories</option><option>Tent House</option><option>Chiti</option>
          </select>
        </div>
      </div>
      <div className="space-y-3">
        {loading && <p className="rounded-2xl bg-white p-4 text-center font-bold text-slate-500 dark:bg-slate-900">Loading entries...</p>}
        {(data || []).map((item) => <TransactionCard key={item._id} item={item} onEdit={(x) => { setEditing(x); setSheetOpen(true); }} onDelete={setDeleting} />)}
      </div>
      <Fab onClick={() => { setEditing(null); setSheetOpen(true); }} />
      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title={editing ? 'Edit entry' : 'Add entry'}>
        <TransactionForm initial={editing} onSubmit={save} saving={saving} />
      </BottomSheet>
      <ConfirmDialog open={Boolean(deleting)} title="Delete entry?" message="This entry will be removed from all balance calculations." onCancel={() => setDeleting(null)} onConfirm={remove} />
    </div>
  );
}
