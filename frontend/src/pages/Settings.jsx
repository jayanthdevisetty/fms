import { Moon, Sun, UserPlus, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { FormField, inputClass } from '../components/FormField';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useFetch } from '../hooks/useFetch';

export default function Settings() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const [dark, setDark] = useState(() => localStorage.getItem('fms_theme') === 'dark');
  const { register, handleSubmit, reset } = useForm({ defaultValues: { name: '', phone: '', password: '', role: 'Staff' } });
  const { data: users, refresh } = useFetch(async () => user?.role === 'Admin' ? (await api.get('/users')).data : [], [user?.role]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('fms_theme', dark ? 'dark' : 'light');
  }, [dark]);

  const addUser = async (values) => {
    try {
      await api.post('/users', values);
      reset();
      showToast('User added');
      refresh();
    } catch (error) {
      showToast(error.response?.data?.message || 'Could not add user', 'error');
    }
  };

  return (
    <div className="space-y-4">
      <div><h2 className="text-2xl font-black">Settings</h2><p className="text-sm font-semibold text-slate-500">{user?.name} • {user?.role}</p></div>
      <Card>
        <div className="flex items-center justify-between">
          <div><p className="font-black">Dark mode</p><p className="text-sm font-semibold text-slate-500">Comfortable at night</p></div>
          <button onClick={() => setDark(!dark)} className="grid h-14 w-14 place-items-center rounded-full bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-white">
            {dark ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
          </button>
        </div>
      </Card>
      {user?.role === 'Admin' && (
        <Card>
          <h3 className="mb-3 text-lg font-black">Multi-user access</h3>
          <form onSubmit={handleSubmit(addUser)} className="space-y-3">
            <FormField label="Name"><input className={inputClass} {...register('name', { required: true })} /></FormField>
            <FormField label="Phone"><input className={inputClass} inputMode="tel" {...register('phone', { required: true })} /></FormField>
            <FormField label="Password"><input className={inputClass} type="password" {...register('password', { required: true, minLength: 6 })} /></FormField>
            <FormField label="Role"><select className={inputClass} {...register('role')}><option>Staff</option><option>Admin</option></select></FormField>
            <Button className="w-full"><UserPlus className="h-5 w-5" />Add user</Button>
          </form>
          <div className="mt-4 space-y-2">
            {(users || []).map((item) => <div key={item._id} className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-950"><p className="font-black">{item.name}</p><p className="text-sm font-bold text-slate-500">{item.phone} • {item.role}</p></div>)}
          </div>
        </Card>
      )}
      <Button onClick={logout} variant="danger" className="w-full"><LogOut className="h-5 w-5" />Logout</Button>
    </div>
  );
}
