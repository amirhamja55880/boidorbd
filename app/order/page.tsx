'use client';
import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Copy, CheckCircle } from 'lucide-react';
import api from '../lib/api';
import toast from 'react-hot-toast';

function OrderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookId = searchParams.get('book');

  const [book, setBook] = useState<any>(null);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState('');

  const [form, setForm] = useState({
    payment_method: '',
    transaction_id: '',
    delivery_name: '',
    delivery_phone: '',
    delivery_address: '',
    delivery_city: 'ঢাকা',
    notes: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Order করতে Login করুন!');
      router.push('/login');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [paymentRes] = await Promise.all([
        api.get('/api/orders/payment-info'),
      ]);
      setPaymentMethods(paymentRes.data.payment_methods || []);

      if (bookId) {
        const bookRes = await api.get(`/api/books/${bookId}`);
        setBook(bookRes.data.book);
      }
    } catch (error) {
      toast.error('Data লোড হয়নি!');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast.success(`${label} Copy হয়েছে!`);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.payment_method) {
      toast.error('Payment Method Select করুন!');
      return;
    }
    if (!form.transaction_id) {
      toast.error('Transaction ID দিন!');
      return;
    }

    setSubmitting(true);
    try {
      const orderData = {
        books: bookId ? [{ book_id: bookId, quantity: 1 }] : [],
        ...form,
      };

      const res = await api.post('/api/orders', orderData);
      toast.success(res.data.message || 'Order সফল হয়েছে!');
      const orderId = res.data.order?.id || res.data.order_id || '';
      router.push(`/order/success?order_id=${orderId}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Order হয়নি!');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4 animate-bounce">🛒</div>
        <p className="text-gray-500">লোড হচ্ছে...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back */}
        <Link href="/books" className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 font-medium transition-colors">
          <ArrowLeft className="w-5 h-5" /> বই দেখুন
        </Link>

        <h1 className="text-2xl font-black text-gray-900 mb-6">🛒 Order করুন</h1>

        {/* Book Info */}
        {book && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 flex gap-4 items-center">
            <div className="text-4xl">📚</div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">{book.title}</h3>
              <p className="text-gray-500 text-sm">{book.class_level} • {book.subject}</p>
            </div>
            <span className="font-black text-blue-600 text-xl">৳{book.final_price || book.price}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment Method */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-black text-gray-900 mb-4">💳 Payment Method</h2>
            <div className="space-y-3">
              {paymentMethods.map((method, i) => (
                <div key={i}>
                  <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    form.payment_method === method.name
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}>
                    <input
                      type="radio"
                      name="payment_method"
                      value={method.name}
                      onChange={e => setForm({ ...form, payment_method: e.target.value })}
                      className="hidden"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      form.payment_method === method.name ? 'border-blue-500' : 'border-gray-300'
                    }`}>
                      {form.payment_method === method.name && (
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900">{method.name}</div>
                      <div className="text-gray-500 text-sm">{method.instruction}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-gray-700">{method.number}</span>
                      <button type="button" onClick={() => handleCopy(method.number, method.name)}
                        className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
                        {copied === method.name
                          ? <CheckCircle className="w-4 h-4 text-green-500" />
                          : <Copy className="w-4 h-4 text-gray-500" />
                        }
                      </button>
                    </div>
                  </label>
                </div>
              ))}
            </div>

            {/* Payment Instructions */}
            {form.payment_method && (
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-amber-800 font-semibold text-sm mb-2">📋 Payment করার নিয়ম:</p>
                <ol className="text-amber-700 text-sm space-y-1 list-decimal list-inside">
                  <li>{form.payment_method} App খুলুন</li>
                  <li>"Send Money" Select করুন</li>
                  <li>Number Copy করে Paste করুন</li>
                  <li>Amount দিন এবং Send করুন</li>
                  <li>Transaction ID নিচে দিন</li>
                </ol>
              </div>
            )}

            {/* Transaction ID */}
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Transaction ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="যেমন: 8AB12CD34E"
                value={form.transaction_id}
                onChange={e => setForm({ ...form, transaction_id: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-mono"
              />
              <p className="text-gray-400 text-xs mt-1">Payment করার পর Transaction ID টা দিন</p>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-black text-gray-900 mb-4">🚚 Delivery তথ্য</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  নাম <span className="text-red-500">*</span>
                </label>
                <input type="text" placeholder="আপনার পুরো নাম"
                  value={form.delivery_name}
                  onChange={e => setForm({ ...form, delivery_name: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input type="tel" placeholder="01XXXXXXXXX"
                  value={form.delivery_phone}
                  onChange={e => setForm({ ...form, delivery_phone: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ঠিকানা <span className="text-red-500">*</span>
                </label>
                <textarea placeholder="সম্পূর্ণ ঠিকানা দিন"
                  value={form.delivery_address}
                  onChange={e => setForm({ ...form, delivery_address: e.target.value })}
                  required rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">শহর</label>
                <input type="text" placeholder="ঢাকা"
                  value={form.delivery_city}
                  onChange={e => setForm({ ...form, delivery_city: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">বিশেষ নোট</label>
                <textarea placeholder="কোনো বিশেষ তথ্য থাকলে লিখুন"
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" disabled={submitting}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-black text-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg">
            {submitting ? '⏳ Order হচ্ছে...' : '✅ Order Confirm করুন'}
          </button>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <p className="text-green-700 text-sm font-medium">
              🎉 Order করার পর আমরা কিছুক্ষণের মধ্যে Confirm করব এবং Gmail এ জানাব!
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function OrderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-5xl animate-bounce">📦</div>
      </div>
    }>
      <OrderContent />
    </Suspense>
  );
}