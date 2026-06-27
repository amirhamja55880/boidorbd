'use client';
import { useState, useEffect } from 'react';
import { Search, Eye, CheckCircle, X } from 'lucide-react';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => { fetchOrders(); }, [status]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url = status ? `/api/orders?status=${status}` : '/api/orders';
      const res = await api.get(url);
      setOrders(res.data.orders || []);
    } catch { toast.error('লোড হয়নি!'); }
    finally { setLoading(false); }
  };

  const handleConfirm = async (id: string) => {
    setConfirming(true);
    try {
      await api.patch(`/api/orders/${id}/confirm`);
      toast.success('Order Confirm হয়েছে! Gmail পাঠানো হয়েছে!');
      setSelectedOrder(null);
      fetchOrders();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'সমস্যা হয়েছে!');
    } finally { setConfirming(false); }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/api/orders/${id}/status`, { status: newStatus });
      toast.success(`Status "${newStatus}" করা হয়েছে!`);
      fetchOrders();
      if (selectedOrder?.id === id) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch { toast.error('সমস্যা হয়েছে!'); }
  };

  const getStatusBadge = (status: string) => {
    const styles: any = {
      pending: 'bg-yellow-900/30 text-yellow-400 border-yellow-800',
      confirmed: 'bg-blue-900/30 text-blue-400 border-blue-800',
      processing: 'bg-purple-900/30 text-purple-400 border-purple-800',
      shipped: 'bg-indigo-900/30 text-indigo-400 border-indigo-800',
      delivered: 'bg-green-900/30 text-green-400 border-green-800',
      cancelled: 'bg-red-900/30 text-red-400 border-red-800',
    };
    const labels: any = {
      pending: '⏳ Pending',
      confirmed: '✅ Confirmed',
      processing: '⚙️ Processing',
      shipped: '🚚 Shipped',
      delivered: '📦 Delivered',
      cancelled: '❌ Cancelled',
    };
    return { style: styles[status] || 'bg-gray-800 text-gray-400 border-gray-700', label: labels[status] || status };
  };

  const filteredOrders = orders.filter(o =>
    !search ||
    o.id?.toLowerCase().includes(search.toLowerCase()) ||
    o.users?.name?.toLowerCase().includes(search.toLowerCase()) ||
    o.transaction_id?.toLowerCase().includes(search.toLowerCase())
  );

  const statusFilters = ['', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
  const statusLabels: any = { '': 'সব', pending: 'Pending', confirmed: 'Confirmed', processing: 'Processing', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled' };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white">🛒 Order Management</h1>
        <p className="text-gray-400 text-sm mt-1">সব Orders দেখুন এবং Confirm করুন</p>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 flex-wrap mb-4">
        {statusFilters.map(s => (
          <button key={s} onClick={() => setStatus(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              status === s ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            }`}>
            {statusLabels[s]}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input type="text" placeholder="Order ID, User নাম বা Transaction ID দিয়ে খুঁজুন..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-xl focus:outline-none focus:border-blue-500 placeholder-gray-500" />
      </div>

      {/* Orders Table */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-semibold">Order ID</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-semibold">User</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-semibold">Amount</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-semibold">Payment</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-semibold">Status</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-10 text-gray-500">লোড হচ্ছে...</td></tr>
              ) : filteredOrders.length > 0 ? filteredOrders.map(order => {
                const badge = getStatusBadge(order.status);
                return (
                  <tr key={order.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                    <td className="px-5 py-3 text-gray-300 text-sm font-mono">
                      #{order.id?.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-white text-sm font-medium">{order.users?.name}</p>
                      <p className="text-gray-500 text-xs">{order.users?.email}</p>
                    </td>
                    <td className="px-5 py-3 text-amber-400 font-bold">৳{order.total_amount}</td>
                    <td className="px-5 py-3">
                      <p className="text-gray-300 text-sm">{order.payment_method}</p>
                      <p className="text-gray-500 text-xs font-mono">{order.transaction_id}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold border ${badge.style}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => setSelectedOrder(order)}
                          className="p-2 bg-blue-900/30 text-blue-400 rounded-lg hover:bg-blue-900/50 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        {order.status === 'pending' && (
                          <button onClick={() => handleConfirm(order.id)}
                            className="p-2 bg-green-900/30 text-green-400 rounded-lg hover:bg-green-900/50 transition-colors">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr><td colSpan={6} className="text-center py-10 text-gray-500">কোনো Order নেই</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-700">
              <h2 className="font-black text-white">
                Order #{selectedOrder.id?.slice(0, 8).toUpperCase()}
              </h2>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {/* User Info */}
              <div className="bg-gray-700/50 rounded-xl p-4">
                <h3 className="text-gray-400 text-xs font-semibold mb-2">👤 User তথ্য</h3>
                <p className="text-white font-semibold">{selectedOrder.users?.name}</p>
                <p className="text-gray-400 text-sm">{selectedOrder.users?.email}</p>
              </div>

              {/* Payment Info */}
              <div className="bg-gray-700/50 rounded-xl p-4">
                <h3 className="text-gray-400 text-xs font-semibold mb-2">💳 Payment তথ্য</h3>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Method:</span>
                    <span className="text-white font-semibold">{selectedOrder.payment_method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Transaction ID:</span>
                    <span className="text-amber-400 font-mono text-sm">{selectedOrder.transaction_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">মোট:</span>
                    <span className="text-green-400 font-black text-lg">৳{selectedOrder.total_amount}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="bg-gray-700/50 rounded-xl p-4">
                <h3 className="text-gray-400 text-xs font-semibold mb-2">🚚 Delivery তথ্য</h3>
                <p className="text-white font-semibold">{selectedOrder.delivery_name}</p>
                <p className="text-gray-400 text-sm">{selectedOrder.delivery_phone}</p>
                <p className="text-gray-400 text-sm">{selectedOrder.delivery_address}, {selectedOrder.delivery_city}</p>
              </div>

              {/* Books */}
              {selectedOrder.order_items?.length > 0 && (
                <div className="bg-gray-700/50 rounded-xl p-4">
                  <h3 className="text-gray-400 text-xs font-semibold mb-2">📚 বই</h3>
                  {selectedOrder.order_items.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center py-1">
                      <span className="text-white text-sm">{item.books?.title}</span>
                      <span className="text-amber-400 font-semibold text-sm">৳{item.price} × {item.quantity}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Status Update */}
              <div>
                <h3 className="text-gray-400 text-xs font-semibold mb-2">📋 Status পরিবর্তন</h3>
                <div className="grid grid-cols-2 gap-2">
                  {['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                    <button key={s} onClick={() => handleStatusUpdate(selectedOrder.id, s)}
                      disabled={selectedOrder.status === s}
                      className={`py-2 rounded-xl text-sm font-semibold transition-colors ${
                        selectedOrder.status === s
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Confirm Button */}
              {selectedOrder.status === 'pending' && (
                <button onClick={() => handleConfirm(selectedOrder.id)} disabled={confirming}
                  className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors disabled:opacity-50">
                  {confirming ? '⏳ হচ্ছে...' : '✅ Order Confirm করুন (Gmail যাবে)'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}