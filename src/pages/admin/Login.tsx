import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { ApiClient } from '../../lib/api';
import { useSettings, useAuth } from '../../contexts';
import BrandIdentity from '../../components/common/BrandIdentity';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function Login() {
  const { settings } = useSettings();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await ApiClient.post<{user: any, token: string}>('/login', { email, password });
      
      login(res.data.token, res.data.user);
      
      navigate('/admin/dashboard');
    } catch (err: any) {
      console.error(err);
      // Let global interceptor handle 500s and network errors via toast.
      // We only handle client-side auth validation errors here.
      if (err.response && err.response.status >= 400 && err.response.status < 500) {
        setError(err.response?.data?.message || 'بيانات الدخول غير صحيحة.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>تسجيل الدخول - {settings?.siteName || 'العزكي تك'}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
        
        <div className="bg-gray-900 dark:bg-black p-8 text-center flex flex-col items-center">
          <BrandIdentity 
            className="justify-center mb-6"
            imageClassName="max-h-16"
            textClassName="text-white"
          />
          <h1 className="text-3xl font-bold text-white mb-2">تسجيل الدخول</h1>
          <p className="text-gray-400">لوحة تحكم إدارة نظام {settings?.siteName || 'العزكي تك'}</p>
        </div>

        <div className="p-8">
          {error && (
            <div 
              className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm font-medium text-center"
              role="alert"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">البريد الإلكتروني <span className="text-red-500" aria-hidden="true">*</span></label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-5 h-5" />}
                dir="ltr"
                placeholder="example@gmail.com"
                aria-invalid={!!error}
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">كلمة المرور <span className="text-red-500" aria-hidden="true">*</span></label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-5 h-5" />}
                dir="ltr"
                placeholder="••••••••"
                aria-invalid={!!error}
                autoComplete="current-password"
              />
            </div>

            <Button 
              type="submit" 
              loading={loading}
              fullWidth
              size="lg"
              className="py-4"
            >
              الدخول للوحة التحكم
            </Button>
          </form>
        </div>
        
      </div>
    </>
  );
}

