'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, CheckCircle, Clock } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import api from '../../lib/api';
import toast from 'react-hot-toast';

const steps = ['📦 Delivery', '💳 Payment', '✅ Confirm'];

const paymentMethods = [
  { id: 'bkash', name: 'bKash', emoji: '💗', number: '01748985357', color: 'from-pink-500 to-pink-600' },
  { id: 'nagad', name: 'Nagad', emoji: '🟠', number: '01748985357', color: 'from-orange-500 to-orange-600' },
  { id: 'rocket', name: 'Rocket', emoji: '💜', number: '01748985357', color: 'from-purple-500 to-purple-600' },
];

function PaymentTimer() {
  const [seconds, setSeconds] = useState(15 * 60);
  useEffect(() => {
    const t = setInterval(() => setSeconds(s => s > 0 ? s - 1 : 0), 1000);
    return () => clearInterval(t);
  }, []);
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const urgent = seconds < 300;
  return (
    <div className={`flex items-center gap-2 text-sm font-bold px-3 py-2 rounded-xl ${urgent ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-600'}`}>
      <Clock className="w-4 h-4 animate-pulse" />
      {String(m).padStart(2, '0')}:{String(s).padStart(2, '0')} বাকি
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useShop();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [delivery, setDelivery] = useState({ name: '', phone: '', address: '', city: '', note: '' });
  const [payment, setPayment] = useState({ method: 'bkash', transaction_id: '' });

  const deliveryCharge = cartTotal > 1000 ? 0 : 60;
  const total = cartTotal + deliveryCharge;
  const selectedMethod = paymentMethods.find(m => m.id === payment.method)!;

  const copyNumber = () => {
    navigator.clipboard.writeText(selectedMethod.number);
    setCopied(true);
    toast.success('Number copy হয়েছে!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOrder = async () => {
    setLoading(true);
    try {
      await api.post('/api/orders', {
        items: cart.map(i => ({ product_id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
        delivery_info: delivery,
        payment_method: payment.method,
        transaction_id: payment.transaction_id,
        total_amount: total,
        delivery_charge: deliveryCharge,
      });
      clearCart();
      router.push('/shop/order/success');
    } catch {
      toast.error('সমস্যা হয়েছে! আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) { router.push('/shop'); return null; }

  const inputClass = "w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all";

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4 pb-10">
      <div className="max-w-2xl mx-auto">

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                i === step ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' :
                i < step ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {i < step ? <CheckCircle className="w-4 h-4" /> : null} {s}
              </div>
              {i < steps.length - 1 && (
                <div className={`w-8 h-0.5 ${i < step ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">

          {/* Step 1: Delivery */}
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-black text-gray-900 mb-5">📦 Delivery তথ্য</h2>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">পুরো নাম *</label>
                <input type="text" placeholder="আপনার নাম" value={delivery.name}
                  onChange={e => setDelivery({ ...delivery, name: e.target.value })}
                  className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone নম্বর *</label>
                <input type="text" placeholder="01XXXXXXXXX" value={delivery.phone}
                  onChange={e => setDelivery({ ...delivery, phone: e.target.value })}
                  className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">শহর/জেলা *</label>
                <input type="text" placeholder="যেমন: ঢাকা, চট্টগ্রাম, খুলনা" value={delivery.city}
                  onChange={e => setDelivery({ ...delivery, city: e.target.value })}
                  className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">সম্পূর্ণ ঠিকানা *</label>
                <input type="text" placeholder="বাড়ি নং, রাস্তা, এলাকা" value={delivery.address}
                  onChange={e => setDelivery({ ...delivery, address: e.target.value })}
                  className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">অতিরিক্ত নোট</label>
                <input type="text" placeholder="বিশেষ কোনো নির্দেশনা" value={delivery.note}
                  onChange={e => setDelivery({ ...delivery, note: e.target.value })}
                  className={inputClass} />
              </div>
              <button onClick={() => {
                if (!delivery.name || !delivery.phone || !delivery.address || !delivery.city) {
                  toast.error('সব তথ্য পূরণ করুন!'); return;
                }
                setStep(1);
              }}
                className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-black transition-all shadow-lg mt-2">
                পরবর্তী ধাপ →
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-gray-900">💳 Payment</h2>
                <PaymentTimer />
              </div>

              {/* Method Select */}
              <div className="grid grid-cols-3 gap-3">
                {paymentMethods.map(m => (
                  <button key={m.id} onClick={() => setPayment({ ...payment, method: m.id })}
                    className={`p-3 rounded-xl border-2 font-bold text-sm transition-all ${
                      payment.method === m.id
                        ? 'border-orange-400 bg-orange-50 text-orange-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-orange-200'
                    }`}>
                    <div className="text-2xl mb-1">{m.emoji}</div>
                    {m.name}
                  </button>
                ))}
              </div>

              {/* Payment Instructions */}
              <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                <p className="text-gray-700 text-sm font-semibold mb-3">📱 {selectedMethod.name} নম্বরে Send Money করুন:</p>
                <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 mb-3 border border-orange-100">
                  <span className="text-gray-900 font-black text-lg flex-1">{selectedMethod.number}</span>
                  <button onClick={copyNumber}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      copied ? 'bg-green-500 text-white' : 'bg-orange-500 text-white hover:bg-orange-600'
                    }`}>
                    <Copy className="w-3 h-3" />
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="space-y-1.5 text-xs text-gray-500">
                  <p>• "Send Money" অপশন ব্যবহার করুন</p>
                  <p>• পরিমাণ: <span className="text-orange-500 font-black">৳{total}</span></p>
                  <p>• Transaction ID সংরক্ষণ করুন</p>
                </div>
              </div>

              {/* Transaction ID */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Transaction ID *</label>
                <input type="text" placeholder="যেমন: 8N7A6K5F4D"
                  value={payment.transaction_id}
                  onChange={e => setPayment({ ...payment, transaction_id: e.target.value })}
                  className={inputClass + " font-mono"} />
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(0)}
                  className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                  ← পেছনে
                </button>
                <button onClick={() => {
                  if (!payment.transaction_id) { toast.error('Transaction ID দিন!'); return; }
                  setStep(2);
                }}
                  className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-black hover:bg-orange-600 transition-all">
                  Confirm করুন →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-black text-gray-900 mb-5">✅ Order নিশ্চিত করুন</h2>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
                <h3 className="text-gray-700 text-sm font-bold mb-3">📦 পণ্য তালিকা</h3>
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-700">{item.emoji} {item.name} × {item.quantity}</span>
                    <span className="text-orange-500 font-bold">৳{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-2 mt-2 space-y-1">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>ডেলিভারি</span>
                    <span>{deliveryCharge === 0 ? 'বিনামূল্যে' : `৳${deliveryCharge}`}</span>
                  </div>
                  <div className="flex justify-between text-gray-900 font-black">
                    <span>মোট</span>
                    <span className="text-orange-500">৳{total}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 text-sm space-y-1">
                <h3 className="text-gray-700 font-bold mb-2">🚚 Delivery ঠিকানা</h3>
                <p className="text-gray-800 font-medium">{delivery.name} — {delivery.phone}</p>
                <p className="text-gray-500">{delivery.address}, {delivery.city}</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 text-sm">
                <h3 className="text-gray-700 font-bold mb-2">💳 Payment</h3>
                <p className="text-gray-800">{selectedMethod.name} — TxID: <span className="font-mono font-bold">{payment.transaction_id}</span></p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)}
                  className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                  ← পেছনে
                </button>
                <button onClick={handleOrder} disabled={loading}
                  className="flex-1 py-3 bg-green-500 text-white rounded-xl font-black hover:bg-green-600 transition-all shadow-lg disabled:opacity-50">
                  {loading ? '⏳ হচ্ছে...' : '🎉 Order করুন!'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}