'use client';
import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, ArrowLeft } from 'lucide-react';
import api from '../lib/api';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // STEP 1 — Email পাঠান
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/auth/forgot-password', { email });
      toast.success(`${email} এ Reset Code পাঠানো হয়েছে!`);
      setStep(2);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'সমস্যা হয়েছে!');
    } finally {
      setLoading(false);
    }
  };

  // STEP 2 — Code Verify করুন
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      toast.error('৬ সংখ্যার Code দিন!');
      return;
    }
    // Code ঠিক আছে কিনা Backend এ Check করার দরকার নেই এখানে
    // Step 3 এ গিয়ে Password দিলে তখন Check হবে
    setStep(3);
  };

  // STEP 3 — নতুন Password দিন
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error('Password কমপক্ষে ৬ অক্ষর হতে হবে!');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Password মিলছে না!');
      return;
    }
    setLoading(true);
    try {
      await api.post('/api/auth/reset-password', {
        email,
        code,
        newPassword,
      });
      toast.success('Password পরিবর্তন হয়েছে!');
      setStep(4);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'সমস্যা হয়েছে!');
      // Code ভুল হলে Step 2 এ ফিরে যান
      if (error.response?.status === 400) {
        setStep(2);
        setCode('');
      }
    } finally {
      setLoading(false);
    }
  };

  const stepTitles = [
    '',
    'Password ভুলে গেছেন?',
    'Code Verify করুন',
    'নতুন Password দিন',
    'সফল হয়েছে! 🎉',
  ];

  const stepSubtitles = [
    '',
    'Registered Email দিন, Code পাঠাব',
    `${email} এ Code পাঠানো হয়েছে`,
    'নতুন Password সেট করুন',
    'Password পরিবর্তন সফল হয়েছে',
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">{stepTitles[step]}</h1>
          <p className="text-gray-500 mt-1">{stepSubtitles[step]}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* Step Indicator */}
          <div className="flex items-center gap-2 mb-6">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className={`flex-1 h-2 rounded-full transition-colors ${
                step >= s ? 'bg-blue-600' : 'bg-gray-200'
              }`} />
            ))}
          </div>

          {/* STEP 1 — Email */}
          {step === 1 && (
            <form onSubmit={handleSendCode} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Registered Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="আপনার Registered Email দিন"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
                <p className="text-gray-400 text-xs mt-1">
                  ⚠️ শুধু Registered Email এ Code যাবে
                </p>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50">
                {loading ? '⏳ পাঠানো হচ্ছে...' : '📧 Code পাঠান'}
              </button>
            </form>
          )}

          {/* STEP 2 — Code Verify */}
          {step === 2 && (
            <form onSubmit={handleVerifyCode} className="space-y-5">
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <p className="text-blue-700 text-sm font-medium">
                  📧 <strong>{email}</strong> এ ৬ সংখ্যার Code পাঠানো হয়েছে
                </p>
                <p className="text-blue-500 text-xs mt-1">Gmail চেক করুন (Spam ও দেখুন)</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Verification Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="123456"
                  value={code}
                  onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  maxLength={6}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-center text-2xl font-bold tracking-widest"
                />
              </div>
              <button type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
                ✅ Code Verify করুন
              </button>
              <button type="button" onClick={() => { setStep(1); setCode(''); }}
                className="w-full py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                ← আগে যান
              </button>
            </form>
          )}

          {/* STEP 3 — নতুন Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <p className="text-green-700 text-sm font-medium">
                  ✅ Code Verify হয়েছে! এখন নতুন Password দিন
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  নতুন Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  placeholder="কমপক্ষে ৬ অক্ষর"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password নিশ্চিত করুন <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  placeholder="আবার Password দিন"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50">
                {loading ? '⏳ হচ্ছে...' : '🔐 Password পরিবর্তন করুন'}
              </button>
            </form>
          )}

          {/* STEP 4 — Success */}
          {step === 4 && (
            <div className="text-center space-y-4">
              <div className="text-6xl mb-4">🎉</div>
              <p className="text-gray-600">
                Password সফলভাবে পরিবর্তন হয়েছে!<br />
                এখন নতুন Password দিয়ে Login করুন।
              </p>
              <Link href="/login"
                className="block w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors text-center">
                Login করুন →
              </Link>
            </div>
          )}

          {step < 4 && (
            <div className="mt-6 text-center">
              <Link href="/login" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Login এ ফিরে যান
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}