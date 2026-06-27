'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Eye, EyeOff } from 'lucide-react';
import api from '../lib/api';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', form);
      const user = res.data.user;

      if (user.role !== 'admin') {
        toast.error('Admin Access নেই!');
        return;
      }

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(user));
      toast.success('Admin Login সফল!');
      router.push('/admin/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login হয়নি!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white">BoidorBD Admin</h1>
          <p className="text-gray-400 mt-1">Admin Panel এ Login করুন</p>
        </div>

        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Email</label>
              <input
                type="email"
                placeholder="Admin Email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-xl focus:outline-none focus:border-blue-500 transition-all placeholder-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-xl focus:outline-none focus:border-blue-500 transition-all placeholder-gray-500 pr-12"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50">
              {loading ? '⏳ Login হচ্ছে...' : '🔐 Login করুন'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}