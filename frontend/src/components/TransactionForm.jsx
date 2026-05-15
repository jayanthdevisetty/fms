import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from './Button';
import { FormField, inputClass } from './FormField';
import { isoDate } from '../utils/format';

const paymentModes = ['Cash', 'PhonePe', 'Google Pay', 'Bank Transfer'];

export const TransactionForm = ({ initial, onSubmit, saving }) => {
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
    defaultValues: initial || {
      type: 'Income',
      category: 'Tent House',
      paymentMode: 'Cash',
      amount: '',
      date: isoDate(),
      personName: '',
      notes: ''
    }
  });
  const paymentMode = watch('paymentMode');

  useEffect(() => {
    if (initial) reset({ ...initial, date: isoDate(initial.date) });
  }, [initial, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Type">
          <select className={inputClass} {...register('type')}><option>Income</option><option>Expense</option></select>
        </FormField>
        <FormField label="Category">
          <select className={inputClass} {...register('category')}><option>Tent House</option><option>Chiti</option></select>
        </FormField>
      </div>
      <FormField label="Payment mode">
        <select className={inputClass} {...register('paymentMode')}>{paymentModes.map((mode) => <option key={mode}>{mode}</option>)}</select>
      </FormField>
      {paymentMode && (
        <FormField label="Person name">
          <input className={inputClass} placeholder="Customer, worker, member" {...register('personName')} />
        </FormField>
      )}
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Amount" error={errors.amount}>
          <input className={inputClass} inputMode="decimal" type="number" min="0" {...register('amount', { required: 'Amount is required', valueAsNumber: true })} />
        </FormField>
        <FormField label="Date" error={errors.date}>
          <input className={inputClass} type="date" {...register('date', { required: 'Date is required' })} />
        </FormField>
      </div>
      <FormField label="Notes">
        <textarea className={`${inputClass} min-h-24 py-3`} {...register('notes')} />
      </FormField>
      <Button className="w-full" disabled={saving}>{saving ? 'Saving...' : 'Save entry'}</Button>
    </form>
  );
};
