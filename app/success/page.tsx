'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Truck, Mail } from 'lucide-react';
import { Suspense } from 'react';

function Confetti() {
  const [particles, setParticles] = useState<{ x: number; color: string; delay: number; size: number }[]>([]);
  useEffect(() => {
    setParticles(Array.from({ length: 40 }, () => ({
      x: Math.random() * 100,
      color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][Math.floor(Math.random() * 5)],
      delay: Math.random() * 3,
      size: Math.random() * 8 + 4,
    })));
  }, []);
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((p, i) => (
        <div key={i} className="absolute animate-bounce rounded-sm opacity-70"
          style={{
            left: `${p.x}%`, top: '-10px',
            backgroundColor: p.color,
            width: p.size, height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${1.5 + Math.random()}s`,
          }} />
      ))}
    </div>
  );
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id') || `BDB-${Date.now().toString().slice(-6)}`;
  const [show, setShow] = useState(false);
  useEffect(() => { setTimeout(() => setShow(true), 100); }, []);

  const steps = [
    { icon: <CheckCircle className="w-5 h-5" />, title: 'Payment Verify', desc: 'আমরা আপনার payment confirm করব', color: 'text-blue-600 bg-blue-50' },
    { icon: <Package className="w-5 h-5" />, title: 'Processing', desc: 'বই প্রস্তুত করা হবে', color: 'text-amber-600 bg-amber-50' },
    { icon: <Truck className="w-5 h-5" />, title: 'Delivery', desc: '৩-৫ কার্যদিবসে পৌঁছাবে', color: 'text-green-600 bg-green-50' },
    { icon: <Mail className="w-5 h-5" />, title: 'Email Confirmation', desc: 'Gmail এ জানানো হবে', color: 'text-purple-600 bg-purple-50' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <Confetti />
      <div className={`max-w-md w-full transition-all duration-700 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center">
          {/* Icon */}
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-200 animate-bounce" style={{ animationDuration: '2s' }}>
            <CheckCircle className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-3xl font-black text-gray-900 mb-2">🎉 Order সফল!</h1>
          <p className="text-gray-500 mb-6">আপনার order সফলভাবে গ্রহণ করা হয়েছে।</p>

          {/* Order ID */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6">
            <p className="text-blue-500 text-xs font-semibold mb-1">Order ID</p>
            <p className="text-blue-700 font-black text-xl tracking-wider">#{orderId}</p>
            <p className="text-blue-400 text-xs mt-1">এই ID টি সংরক্ষণ করুন</p>
          </div>

          {/* Steps */}
          <div className="space-y-3 mb-8 text-left">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${step.color}`}>
                  {step.icon}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{step.title}</p>
                  <p className="text-gray-500 text-xs">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Note */}
          <div className="bg-green-50 border border-green-100 rounded-xl p-4 mb-6">
            <p className="text-green-700 text-sm font-medium">
              📧 Order confirm হলে আপনার Gmail এ notification যাবে!
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <Link href="/dashboard"
              className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-black hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
              📊 Dashboard এ দেখুন
            </Link>
            <Link href="/books"
              className="w-full py-3.5 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors">
              📚 আরো বই দেখুন
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-5xl animate-bounce">🎉</div></div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
