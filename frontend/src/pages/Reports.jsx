import { useState } from 'react';
import jsPDF from 'jspdf';
import { Download, FileText, Printer, Share2 } from 'lucide-react';
import api from '../services/api';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { FormField, inputClass } from '../components/FormField';
import { useFetch } from '../hooks/useFetch';
import { currency, shortDate } from '../utils/format';
import { useToast } from '../context/ToastContext';

export default function Reports() {
  const now = new Date();
  const [filters, setFilters] = useState({ period: 'monthly', date: now.toISOString().slice(0, 10), month: now.getMonth() + 1, year: now.getFullYear() });
  const { showToast } = useToast();
  const { data, refresh } = useFetch(async () => (await api.get('/reports', { params: filters })).data, [filters.period, filters.date, filters.month, filters.year]);

  const downloadCsv = async () => {
    try {
      const response = await api.get('/reports/export.csv', { params: filters, responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([response.data], { type: 'text/csv' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'fms-report.csv';
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      showToast('Could not export CSV', 'error');
    }
  };

  const downloadPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('FMS Report', 14, 18);
    doc.setFontSize(11);
    doc.text(`Period: ${data?.period || filters.period}`, 14, 28);
    doc.text(`Overall: ${currency(data?.summary?.overallBalance || 0)}`, 14, 36);
    let y = 48;
    (data?.transactions || []).slice(0, 28).forEach((item) => {
      doc.text(`${shortDate(item.date)} ${item.type} ${item.category} ${item.personName || ''} ${currency(item.amount)}`, 14, y);
      y += 7;
    });
    doc.save('fms-report.pdf');
  };

  const shareWhatsApp = () => {
    const text = `FMS Report%0AOverall: ${currency(data?.summary?.overallBalance || 0)}%0ATent House: ${currency(data?.summary?.tentHouseBalance || 0)}%0AChiti: ${currency(data?.summary?.chitiBalance || 0)}`;
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-4">
      <div><h2 className="text-2xl font-black">Reports</h2><p className="text-sm font-semibold text-slate-500">Daily, monthly, and yearly reports with export options.</p></div>
      <Card className="no-print">
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Period"><select className={inputClass} value={filters.period} onChange={(e) => setFilters({ ...filters, period: e.target.value })}><option value="daily">Daily</option><option value="monthly">Monthly</option><option value="yearly">Yearly</option></select></FormField>
          {filters.period === 'daily' ? (
            <FormField label="Date"><input className={inputClass} type="date" value={filters.date} onChange={(e) => setFilters({ ...filters, date: e.target.value })} /></FormField>
          ) : (
            <FormField label="Year"><input className={inputClass} type="number" value={filters.year} onChange={(e) => setFilters({ ...filters, year: e.target.value })} /></FormField>
          )}
          {filters.period === 'monthly' && <FormField label="Month"><input className={inputClass} type="number" min="1" max="12" value={filters.month} onChange={(e) => setFilters({ ...filters, month: e.target.value })} /></FormField>}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Button onClick={refresh} variant="secondary"><FileText className="h-5 w-5" />Generate</Button>
          <Button onClick={() => window.print()} variant="secondary"><Printer className="h-5 w-5" />Print</Button>
          <Button onClick={downloadCsv} variant="secondary"><Download className="h-5 w-5" />CSV</Button>
          <Button onClick={downloadPdf}><Download className="h-5 w-5" />PDF</Button>
        </div>
        <Button onClick={shareWhatsApp} className="mt-3 w-full" variant="secondary"><Share2 className="h-5 w-5" />WhatsApp share</Button>
      </Card>

      <Card>
        <p className="text-sm font-bold text-slate-500">Report balance</p>
        <h3 className="mt-1 text-3xl font-black">{currency(data?.summary?.overallBalance)}</h3>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-950"><p className="text-xs font-black text-slate-500">Tent House</p><p className="font-black">{currency(data?.summary?.tentHouseBalance)}</p></div>
          <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-950"><p className="text-xs font-black text-slate-500">Chiti</p><p className="font-black">{currency(data?.summary?.chitiBalance)}</p></div>
        </div>
      </Card>

      <div className="space-y-3">
        {(data?.transactions || []).map((item) => (
          <article key={item._id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
            <div className="flex justify-between gap-3">
              <div><p className="font-black">{item.personName || item.category}</p><p className="text-sm font-bold text-slate-500">{shortDate(item.date)} • {item.category}</p></div>
              <p className={`font-black ${item.type === 'Income' ? 'text-emerald-600' : 'text-red-600'}`}>{currency(item.amount)}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
