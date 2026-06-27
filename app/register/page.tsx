'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, Eye, EyeOff } from 'lucide-react';
import api from '../lib/api';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/auth/register', form);
      toast.success(`${form.email} এ Verification Code পাঠানো হয়েছে!`);
      setStep(2);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Register হয়নি!');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/api/auth/verify-email', {
        email: form.email,
        code,
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      document.cookie = `token=${res.data.token}; path=/; max-age=${7 * 24 * 60 * 60}`;
      toast.success('Account তৈরি হয়েছে! স্বাগতম!');
      window.dispatchEvent(new Event('authChange'));
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Verify হয়নি!');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await api.post('/api/auth/resend-code', { email: form.email });
      toast.success('নতুন Code পাঠানো হয়েছে!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'সমস্যা হয়েছে!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">
            {step === 1 ? 'Account তৈরি করুন' : 'Email Verify করুন'}
          </h1>
          <p className="text-gray-500 mt-1">
            {step === 1 ? 'সম্পূর্ণ বিনামূল্যে!' : `${form.email} এ Code পাঠানো হয়েছে`}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* Step Indicator */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`flex-1 h-2 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <div className={`flex-1 h-2 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
          </div>

          {step === 1 ? (
            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">আপনার নাম</label>
                <input
                  type="text"
                  placeholder="আপনার পুরো নাম"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  placeholder="আপনার Email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="কমপক্ষে ৬ অক্ষর"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all pr-12"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50">
                {loading ? '⏳ Loading...' : 'Register করুন →'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-5">
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <p className="text-blue-700 text-sm font-medium">
                  📧 আপনার Gmail চেক করুন এবং ৬ সংখ্যার Code দিন
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Verification Code</label>
                <input
                  type="text"
                  placeholder="123456"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  required
                  maxLength={6}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-center text-2xl font-bold tracking-widest"
                />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50">
                {loading ? '⏳ Loading...' : '✅ Verify করুন'}
              </button>
              <button type="button" onClick={handleResend}
                className="w-full py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                🔄 নতুন Code পাঠান
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-gray-500">
            আগেই Account আছে?{' '}
            <Link href="/login" className="text-blue-600 font-semibold hover:underline">Login করুন</Link>
          </div>
        </div>
      </div>
    </div>
  );
}