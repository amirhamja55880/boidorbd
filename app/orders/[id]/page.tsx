'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, CheckCircle, Truck, Clock } from 'lucide-react';
import api from '../../lib/api';
import toast from 'react-hot-toast';

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    processing: 'bg-purple-100 text-purple-700',
    shipped: 'bg-orange-100 text-orange-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
}

function getStatusText(status: string) {
  const texts: Record<string, string> = {
    pending: 'Pending — অপেক্ষায়',
    confirmed: 'Confirmed — নিশ্চিত',
    processing: 'Processing — প্রস্তুত হচ্ছে',
    shipped: 'Shipped — পাঠানো হয়েছে',
    delivered: 'Delivered — পৌঁছে গেছে',
    cancelled: 'Cancelled — বাতিল',
  };
  return texts[status] || status;
}

const statusSteps = [
  { key: 'pending', label: 'Pending', emoji: '⏳', icon: <Clock className="w-4 h-4" /> },
  { key: 'confirmed', label: 'Confirmed', emoji: '✅', icon: <CheckCircle className="w-4 h-4" /> },
  { key: 'processing', label: 'Processing', emoji: '📦', icon: <Package className="w-4 h-4" /> },
  { key: 'shipped', label: 'Shipped', emoji: '🚚', icon: <Truck className="w-4 h-4" /> },
  { key: 'delivered', label: 'Delivered', emoji: '🎉', icon: <CheckCircle className="w-4 h-4" /> },
];

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/api/orders/${id}`);
      setOrder(res.data.order);
    } catch {
      toast.error('Order পাওয়া যায়নি!');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-5xl animate-bounce">📦</div>
    </div>
  );

  if (!order) return null;

  const currentStep = statusSteps.findIndex(s => s.key === order.status);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back */}
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-6 font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </Link>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black text-gray-900">
            Order #{order.id?.slice(0, 8).toUpperCase()}
          </h1>
          <span className={`text-xs px-3 py-1.5 rounded-full font-bold ${getStatusColor(order.status)}`}>
            {getStatusText(order.status)}
          </span>
        </div>

        <div className="space-y-4">
          {/* Status Timeline */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-black text-gray-900 mb-5">📍 Order Status</h2>
            <div className="relative">
              {statusSteps.map((step, i) => {
                const isDone = i <= currentStep;
                const isCurrent = i === currentStep;
                return (
                  <div key={step.key} className="flex items-start gap-4 mb-4 last:mb-0">
                    <div className="flex flex-col items-center">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 transition-all ${
                        isDone ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'bg-gray-100 text-gray-400'
                      } ${isCurrent ? 'ring-4 ring-blue-100' : ''}`}>
                        {isDone ? '✓' : step.emoji}
                      </div>
                      {i < statusSteps.length - 1 && (
                        <div className={`w-0.5 h-8 mt-1 ${i < currentStep ? 'bg-blue-600' : 'bg-gray-200'}`} />
                      )}
                    </div>
                    <div className="pt-1.5">
                      <p className={`font-bold text-sm ${isDone ? 'text-gray-900' : 'text-gray-400'}`}>
                        {step.label}
                        {isCurrent && <span className="ml-2 text-blue-600 text-xs font-semibold animate-pulse">← এখন এখানে</span>}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-black text-gray-900 mb-4">📦 পণ্য তালিকা</h2>
            <div className="space-y-3">
              {order.order_items?.map((item: any) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                    📚
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm truncate">{item.books?.title || item.name || 'পণ্য'}</p>
                    <p className="text-gray-400 text-xs">× {item.quantity}</p>
                  </div>
                  <p className="font-black text-blue-600">৳{item.price * item.quantity}</p>
                </div>
              ))}
              <div className="border-t border-gray-100 pt-3 flex justify-between font-black text-gray-900">
                <span>মোট</span>
                <span className="text-blue-600 text-lg">৳{order.total_amount}</span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-black text-gray-900 mb-4">💳 Payment তথ্য</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Method</span>
                <span className="font-bold text-gray-900">{order.payment_method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Transaction ID</span>
                <span className="font-mono font-bold text-gray-900">{order.transaction_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className={`font-bold px-2 py-0.5 rounded-full text-xs ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          {order.delivery_address && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-black text-gray-900 mb-4">🚚 Delivery ঠিকানা</h2>
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-bold text-gray-900">নাম:</span> {order.delivery_name}</p>
                <p><span className="font-bold text-gray-900">Phone:</span> {order.delivery_phone}</p>
                <p><span className="font-bold text-gray-900">ঠিকানা:</span> {order.delivery_address}, {order.delivery_city}</p>
                {order.notes && <p><span className="font-bold text-gray-900">নোট:</span> {order.notes}</p>}
              </div>
            </div>
          )}

          {/* Email Note */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center">
            <p className="text-blue-700 text-sm font-medium">
              📧 Order এর status update হলে আপনার Gmail এ notification যাবে!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
