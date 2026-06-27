'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, CheckCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import api from '../lib/api';
import toast from 'react-hot-toast';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/api/notifications');
      setNotifications(res.data.notifications || []);
    } catch (error) {
      toast.error('লোড হয়নি!');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      // ✅ PUT → PATCH Fix
      await api.patch(`/api/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
    } catch (error) {
      // silent
    }
  };

  const markAllRead = async () => {
    try {
      // ✅ PUT → PATCH Fix
      await api.patch('/api/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      toast.success('সব পড়া হয়েছে!');
      window.dispatchEvent(new Event('authChange'));
    } catch (error) {
      toast.error('সমস্যা হয়েছে!');
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4 animate-bounce">🔔</div>
        <p className="text-gray-500">লোড হচ্ছে...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                <Bell className="w-6 h-6 text-blue-600" />
                Notifications
              </h1>
              {unreadCount > 0 && (
                <p className="text-sm text-gray-500">{unreadCount}টি না পড়া notification</p>
              )}
            </div>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-semibold hover:bg-blue-100 transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
              সব পড়া হয়েছে
            </button>
          )}
        </div>

        {/* Notifications List */}
        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => !notif.is_read && markAsRead(notif.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  notif.is_read
                    ? 'bg-white border-gray-100'
                    : 'bg-blue-50 border-blue-100 hover:bg-blue-100'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-gray-900">{notif.title}</p>
                      {!notif.is_read && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{notif.message}</p>
                    <p className="text-gray-400 text-xs mt-2">
                      {notif.created_at ? new Date(notif.created_at).toLocaleDateString('bn-BD') : ''}
                    </p>
                  </div>
                  {!notif.is_read && (
                    <span className="text-xs text-blue-600 font-semibold whitespace-nowrap flex-shrink-0">নতুন</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <Bell className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">কোনো Notification নেই</p>
            <p className="text-sm mt-1">নতুন notification আসলে এখানে দেখাবে</p>
          </div>
        )}
      </div>
    </div>
  );
}