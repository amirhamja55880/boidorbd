'use client';
import { useState, useEffect } from 'react';
import { BookMarked, ShoppingCart, Users, Bell, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import api from '../../lib/api';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalOrders: 0,
    totalUsers: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [booksRes, ordersRes, usersRes] = await Promise.all([
        api.get('/api/books?limit=1'),
        api.get('/api/orders'),
        api.get('/api/users'),
      ]);

      const orders = ordersRes.data.orders || [];
      const pending = orders.filter((o: any) => o.status === 'pending').length;
      const confirmed = orders.filter((o: any) => o.status === 'confirmed').length;
      const revenue = orders
        .filter((o: any) => o.status !== 'cancelled')
        .reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0);

      setStats({
        totalBooks: booksRes.data.count || 0,
        totalOrders: orders.length,
        totalUsers: usersRes.data.count || 0,
        pendingOrders: pending,
        confirmedOrders: confirmed,
        totalRevenue: revenue,
      });

      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: any = {
      pending: 'bg-yellow-900/30 text-yellow-400',
      confirmed: 'bg-blue-900/30 text-blue-400',
      delivered: 'bg-green-900/30 text-green-400',
      cancelled: 'bg-red-900/30 text-red-400',
    };
    const labels: any = {
      pending: '⏳ Pending',
      confirmed: '✅ Confirmed',
      delivered: '📦 Delivered',
      cancelled: '❌ Cancelled',
    };
    return { style: styles[status] || 'bg-gray-800 text-gray-400', label: labels[status] || status };
  };

  const statCards = [
    { icon: <BookMarked className="w-6 h-6" />, label: 'মোট বই', value: stats.totalBooks, color: 'text-blue-400', bg: 'bg-blue-900/20', href: '/admin/books' },
    { icon: <ShoppingCart className="w-6 h-6" />, label: 'মোট Orders', value: stats.totalOrders, color: 'text-amber-400', bg: 'bg-amber-900/20', href: '/admin/orders' },
    { icon: <Users className="w-6 h-6" />, label: 'মোট Users', value: stats.totalUsers, color: 'text-green-400', bg: 'bg-green-900/20', href: '/admin/users' },
    { icon: <Clock className="w-6 h-6" />, label: 'Pending Orders', value: stats.pendingOrders, color: 'text-yellow-400', bg: 'bg-yellow-900/20', href: '/admin/orders?status=pending' },
    { icon: <CheckCircle className="w-6 h-6" />, label: 'Confirmed', value: stats.confirmedOrders, color: 'text-teal-400', bg: 'bg-teal-900/20', href: '/admin/orders?status=confirmed' },
    { icon: <TrendingUp className="w-6 h-6" />, label: 'মোট আয়', value: `৳${stats.totalRevenue.toLocaleString()}`, color: 'text-purple-400', bg: 'bg-purple-900/20', href: '/admin/orders' },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white">🏠 Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">BoidorBD Admin Panel এ স্বাগতম!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map((card, i) => (
          <Link key={i} href={card.href}
            className="bg-gray-800 border border-gray-700 rounded-2xl p-5 hover:border-gray-600 transition-all">
            <div className={`w-12 h-12 ${card.bg} rounded-xl flex items-center justify-center ${card.color} mb-3`}>
              {card.icon}
            </div>
            <p className="text-gray-400 text-xs font-medium mb-1">{card.label}</p>
            <p className={`text-2xl font-black ${card.color}`}>{loading ? '...' : card.value}</p>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-700">
          <h2 className="font-black text-white">🛒 সাম্প্রতিক Orders</h2>
          <Link href="/admin/orders" className="text-blue-400 text-sm font-semibold hover:text-blue-300">
            সব দেখুন →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-semibold">Order ID</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-semibold">User</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-semibold">Amount</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-semibold">Payment</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-8 text-gray-500">লোড হচ্ছে...</td></tr>
              ) : recentOrders.length > 0 ? recentOrders.map((order: any) => {
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
                    <td className="px-5 py-3 text-gray-300 text-sm">{order.payment_method}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${badge.style}`}>
                        {badge.label}
                      </span>
                    </td>
                  </tr>
                );
              }) : (
                <tr><td colSpan={5} className="text-center py-8 text-gray-500">কোনো Order নেই</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}