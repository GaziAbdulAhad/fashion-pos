import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gem, Eye, EyeOff } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuthStore } from '../../store/useAuthStore';
import { api } from '../../services/api';
import { toast } from '../../components/ui/Toast';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@fashionpos.com');
  const [password, setPassword] = useState('123456');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const login = useAuthStore(s => s.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.login(email, password);
      if (res.success && res.data) {
        login(res.data.user, res.data.token);
        toast.success(`Welcome, ${res.data.user.name}!`);
        navigate('/');
      } else {
        toast.error(res.message || 'Login failed');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 flex-col justify-between bg-primary-900 p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-500">
            <Gem className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Fashion & Glow</h1>
            <p className="text-sm text-primary-300">Emporium POS</p>
          </div>
        </div>
        <div>
          <h2 className="mb-4 text-3xl font-bold leading-tight">
            Complete POS for<br />
            <span className="text-accent-400">Fashion • Jewelry • Cosmetics</span>
          </h2>
          <p className="text-primary-300 leading-relaxed">
            Manage inventory with variants (size, color, purity, weight), track sales,
            customers, suppliers and generate professional reports — all in one place.
          </p>
        </div>
        <p className="text-xs text-primary-500">© 2026 Fashion & Glow Emporium</p>
      </div>
      <div className="flex w-full flex-col items-center justify-center px-6 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:text-left">
            <div className="mb-4 flex justify-center lg:hidden">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent-500">
                <Gem className="h-7 w-7 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Sign in</h2>
            <p className="mt-1 text-sm text-slate-500">Enter your credentials to access the POS</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@fashionpos.com"
              required
            />
            <div className="relative">
              <Input
                id="password"
                label="Password"
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-8 text-slate-400 hover:text-slate-600"
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Sign In
            </Button>
          </form>
          <div className="mt-6 rounded-lg bg-slate-50 p-4 text-xs text-slate-500 dark:bg-slate-800/50">
            <p className="mb-1 font-medium text-slate-700 dark:text-slate-300">Demo Credentials:</p>
            <p>Admin: admin@fashionpos.com / 123456</p>
            <p>Cashier: cashier@fashionpos.com / 123456</p>
            <p>Manager: manager@fashionpos.com / 123456</p>
          </div>
        </div>
      </div>
    </div>
  );
}
