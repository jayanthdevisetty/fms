import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import { Landmark } from 'lucide-react';
import { Button } from '../components/Button';
import { FormField, inputClass } from '../components/FormField';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const { login, isAuthenticated, booting } = useAuth();
  const { showToast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: { phone: '', password: '' } });

  if (isAuthenticated) return <Navigate to="/" replace />;

  const submit = async (values) => {
    try {
      await login(values);
      showToast('Welcome back');
    } catch (error) {
      showToast(error.response?.data?.message || 'Login failed', 'error');
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 p-5 dark:bg-slate-950">
      <form onSubmit={handleSubmit(submit)} className="w-full max-w-sm rounded-[32px] bg-white p-6 shadow-soft dark:bg-slate-900">
        <div className="mb-7">
          <div className="mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-brand-600 text-white">
            <Landmark className="h-8 w-8" />
          </div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-brand-600">FMS</p>
          <h1 className="mt-1 text-3xl font-black text-slate-950 dark:text-white">Sign in</h1>
          <p className="mt-2 text-base font-medium text-slate-500 dark:text-slate-400">Daily accounting for tent house and chiti work.</p>
        </div>
        <div className="space-y-4">
          <FormField label="Phone number" error={errors.phone}>
            <input className={inputClass} inputMode="tel" {...register('phone', { required: 'Phone is required' })} />
          </FormField>
          <FormField label="Password" error={errors.password}>
            <input className={inputClass} type="password" {...register('password', { required: 'Password is required' })} />
          </FormField>
          <Button className="w-full" disabled={booting}>{booting ? 'Signing in...' : 'Login'}</Button>
        </div>
      </form>
    </main>
  );
}
