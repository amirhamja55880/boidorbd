'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

function Confetti() {
  const [particles, setParticles] = useState<{ x: number; color: string; delay: number; size: number }[]>([]);
  useEffect(() => {
    setParticles(Array.from({ length: 50 }, () => ({
      x: Math.random() * 100,
      color: ['#FF6B35', '#6C2BD9', '#FFD700', '#FF69B4', '#00CED1'][Math.floor(Math.random() * 5)],
      delay: Math.random() * 3,
      size: Math.random() * 8 + 4,
    })));
  }, []);
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((p, i) => (
        <div key={i} className="absolute animate-bounce rounded-sm"
          style={{
            left: `${p.x}%`,
            top: '-10px',
            backgroundColor: p.color,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${1.5 + Math.random()}s`,
          }} />
      ))}
    </div>
  );
}

export default function OrderSuccessPage() {
  const orderId = `BDB-${Date.now().toString().slice(-6)}`;
  const [show, setShow] = useState(false);
  useEffect(() => { setShow(true); }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Confetti />
      <div className={`max-w-md w-full text-center transition-all duration-700 ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <div className="bg-white rounded-3xl border border-gray-100 p-10">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-500/30 animate-bounce" style={{ animationDuration: '2s' }}>
            <CheckCircle className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-3xl font-black text-gray-900 mb-2">🎉 Order সফল!</h1>
          <p className="text-gray-600 mb-6">আপনার order সফলভাবে গ্রহণ করা হয়েছে।</p>

          {/* Order ID */}
          <div className="bg-black/30 rounded-2xl p-4 mb-6">
            <p className="text-gray-500 text-xs font-semibold mb-1">Order ID</p>
            <p className="text-orange-400 font-black text-xl tracking-wider">#{orderId}</p>
          </div>

          {/* Info */}
          <div className="space-y-3 mb-8">
            {[
              { icon: '📱', text: 'Payment verify করা হবে' },
              { icon: '📦', text: 'Processing শুরু হবে' },
              { icon: '🚚', text: '৩-৫ কার্যদিবসে ডেলিভারি' },
              { icon: '📞', text: 'ডেলিভারির আগে call করা হবে' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-left bg-orange-50 rounded-xl px-4 py-2.5">
                <span className="text-xl">{item.icon}</span>
                <p className="text-gray-700 text-sm font-medium">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <Link href="/shop"
              className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-black hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg">
              🛍️ আরো কেনাকাটা করুন
            </Link>
            <Link href="/dashboard"
              className="w-full py-3.5 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-purple-900/50 transition-colors">
              Dashboard দেখুন
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
