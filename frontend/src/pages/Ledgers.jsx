import { useState } from 'react';
import { Search } from 'lucide-react';
import api from '../services/api';
import { Card } from '../components/Card';
import { FormField, inputClass } from '../components/FormField';
import { useFetch } from '../hooks/useFetch';
import { currency, shortDate } from '../utils/format';

export default function Ledgers() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const { data: people } = useFetch(async () => (await api.get('/ledgers', { params: { search } })).data, [search]);
  const { data: ledger } = useFetch(async () => selected ? (await api.get(`/ledgers/${encodeURIComponent(selected)}`)).data : null, [selected]);

  return (
    <div className="space-y-4">
      <div><h2 className="text-2xl font-black">Person ledger</h2><p className="text-sm font-semibold text-slate-500">Search any person and see received, spent, and remaining balance.</p></div>
      <FormField label="Search person">
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-900">
          <Search className="h-5 w-5 text-slate-400" />
          <input className="min-h-12 flex-1 bg-transparent font-semibold outline-none" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name" />
        </div>
      </FormField>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(people || []).map((person) => (
          <button key={person.personName} onClick={() => setSelected(person.personName)} className={`min-h-12 shrink-0 rounded-full px-4 text-sm font-black ${selected === person.personName ? 'bg-brand-600 text-white' : 'bg-white text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-200'}`}>
            {person.personName}
          </button>
        ))}
      </div>
      {ledger && (
        <>
          <Card>
            <p className="text-sm font-bold text-slate-500">{ledger.personName}</p>
            <h3 className="mt-1 text-3xl font-black">{currency(ledger.remainingBalance)}</h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-emerald-50 p-3 dark:bg-emerald-950/40"><p className="text-xs font-black text-emerald-700">Received</p><p className="font-black">{currency(ledger.totalReceived)}</p></div>
              <div className="rounded-2xl bg-red-50 p-3 dark:bg-red-950/40"><p className="text-xs font-black text-red-700">Spent</p><p className="font-black">{currency(ledger.totalSpent)}</p></div>
            </div>
          </Card>
          <div className="space-y-3">
            {ledger.transactions.map((item) => (
              <div key={item._id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
                <div className="flex justify-between gap-3">
                  <div><p className="font-black">{item.category}</p><p className="text-sm font-bold text-slate-500">{shortDate(item.date)} • {item.paymentMode}</p></div>
                  <p className={`font-black ${item.type === 'Income' ? 'text-emerald-600' : 'text-red-600'}`}>{currency(item.amount)}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
