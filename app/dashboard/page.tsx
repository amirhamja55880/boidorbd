'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, BookOpen, ShoppingCart, Bell, LogOut, Package, Pencil } from 'lucide-react';
import api from '../lib/api';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [savedBooks, setSavedBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, ordersRes, notifRes, savedRes] = await Promise.all([
        api.get('/api/auth/profile'),
        api.get('/api/orders/my'),
        api.get('/api/notifications'),
        api.get('/api/books/saved/list'),
      ]);
      setUser(profileRes.data.user);
      setOrders(ordersRes.data.orders || []);
      setNotifications(notifRes.data.notifications || []);
      setSavedBooks(savedRes.data.books || []);
    } catch (error) {
      toast.error('Data লোড হয়নি!');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.cookie = 'token=; path=/; max-age=0';
    router.push('/');
    toast.success('Logout হয়েছে!');
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      processing: 'bg-purple-100 text-purple-700',
      shipped: 'bg-indigo-100 text-indigo-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusText = (status: string) => {
    const texts: any = {
      pending: '⏳ Pending',
      confirmed: '✅ Confirmed',
      processing: '⚙️ Processing',
      shipped: '🚚 Shipped',
      delivered: '📦 Delivered',
      cancelled: '❌ Cancelled',
    };
    return texts[status] || status;
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4 animate-bounce">👤</div>
        <p className="text-gray-500">লোড হচ্ছে...</p>
      </div>
    </div>
  );

  const tabs = [
    { id: 'profile', icon: <User className="w-4 h-4" />, label: 'Profile' },
    { id: 'orders', icon: <ShoppingCart className="w-4 h-4" />, label: `Orders (${orders.length})` },
    { id: 'saved', icon: <BookOpen className="w-4 h-4" />, label: `Saved (${savedBooks.length})` },
    { id: 'notifications', icon: <Bell className="w-4 h-4" />, label: `Notifications (${notifications.length})` },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 pt-8 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-black text-white">
                {user?.avatar ? (
  <img 
    src={user.avatar} 
    alt="Profile" 
    className="w-full h-full object-cover rounded-2xl"
  />
) : (
  user?.name?.[0]?.toUpperCase()
)}
              </div>
              <div>
                <h1 className="text-2xl font-black text-white">{user?.name}</h1>
                <p className="text-blue-200 text-sm">{user?.email}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold mt-1 inline-block ${
                  user?.subscription_type === 'premium' ? 'bg-yellow-400 text-yellow-900' : 'bg-white/20 text-white'
                }`}>
                  {user?.subscription_type === 'premium' ? '⭐ Premium' : '🆓 Free'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/profile/edit" className="flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-xl hover:bg-white/30 transition-colors">
                <Pencil className="w-4 h-4" /> Edit
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-xl hover:bg-white/30 transition-colors">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Orders', value: orders.length, icon: '🛒' },
            { label: 'Saved Books', value: savedBooks.length, icon: '📚' },
            { label: 'Notifications', value: notifications.length, icon: '🔔' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm text-center border border-gray-100">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-black text-blue-600">{stat.value}</div>
              <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-100 overflow-x-auto">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-4">
                <h2 className="font-black text-gray-900 text-lg mb-4">👤 Profile তথ্য</h2>
                {[
                  { label: 'নাম', value: user?.name },
                  { label: 'Email', value: user?.email },
                  { label: 'Phone', value: user?.phone || 'যোগ করা হয়নি' },
                  { label: 'Role', value: user?.role },
                  { label: 'Subscription', value: user?.subscription_type },
                  { label: 'Join Date', value: user?.created_at ? new Date(user.created_at).toLocaleDateString('bn-BD') : 'N/A' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                    <span className="text-gray-500 text-sm font-medium">{item.label}</span>
                    <span className="text-gray-900 font-semibold text-sm">{item.value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="font-black text-gray-900 text-lg mb-4">🛒 আমার Orders</h2>
                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map(order => {
                      const statusSteps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
                      const currentStep = statusSteps.indexOf(order.status);
                      const stepLabels = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];
                      const stepEmojis = ['⏳', '✅', '📦', '🚚', '🎉'];
                      return (
                        <div key={order.id} className="border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-all">
                          {/* Header */}
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <span className="font-black text-gray-900">#{order.id.slice(0, 8).toUpperCase()}</span>
                              <p className="text-gray-400 text-xs mt-0.5">
                                {order.created_at ? new Date(order.created_at).toLocaleDateString('bn-BD') : ''}
                              </p>
                            </div>
                            <span className={`text-xs px-3 py-1.5 rounded-full font-bold ${getStatusColor(order.status)}`}>
                              {stepEmojis[currentStep] || '⏳'} {getStatusText(order.status)}
                            </span>
                          </div>

                          {/* Status Timeline */}
                          <div className="flex items-center gap-1 mb-4 overflow-x-auto pb-1">
                            {stepLabels.map((label, i) => (
                              <div key={i} className="flex items-center gap-1 flex-shrink-0">
                                <div className={`flex flex-col items-center gap-1`}>
                                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                                    i <= currentStep
                                      ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                      : 'bg-gray-100 text-gray-400'
                                  }`}>
                                    {i <= currentStep ? '✓' : i + 1}
                                  </div>
                                  <span className={`text-[10px] font-semibold ${i <= currentStep ? 'text-blue-600' : 'text-gray-400'}`}>
                                    {label}
                                  </span>
                                </div>
                                {i < stepLabels.length - 1 && (
                                  <div className={`w-6 h-0.5 mb-4 flex-shrink-0 ${i < currentStep ? 'bg-blue-600' : 'bg-gray-200'}`} />
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Order Details */}
                          <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                            <div className="bg-gray-50 rounded-xl p-3">
                              <p className="text-gray-400 text-xs">মোট পরিমাণ</p>
                              <p className="font-black text-blue-600 text-base">৳{order.total_amount}</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3">
                              <p className="text-gray-400 text-xs">Payment Method</p>
                              <p className="font-bold text-gray-700">{order.payment_method}</p>
                            </div>
                          </div>

                          {/* Order Items */}
                          {order.order_items?.length > 0 && (
                            <div className="border-t border-gray-50 pt-3 space-y-1">
                              <p className="text-xs text-gray-400 font-semibold mb-2">📦 পণ্য তালিকা:</p>
                              {order.order_items.map((item: any) => (
                                <div key={item.id} className="flex items-center justify-between text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                                  <span>📚 {item.books?.title || item.name || 'পণ্য'}</span>
                                  <span className="font-bold">× {item.quantity}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Delivery address */}
                          {order.delivery_address && (
                            <div className="mt-3 text-xs text-gray-500 flex items-start gap-1.5">
                              <span>🚚</span>
                              <span>{order.delivery_address}, {order.delivery_city}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="font-medium text-gray-600 mb-1">কোনো Order নেই</p>
                    <p className="text-sm text-gray-400 mb-4">বই order করুন এখান থেকে দেখতে পাবেন</p>
                    <Link href="/books" className="inline-flex items-center gap-1 text-blue-600 text-sm font-bold hover:underline">
                      📚 বই দেখুন →
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Saved Books Tab */}
            {activeTab === 'saved' && (
              <div>
                <h2 className="font-black text-gray-900 text-lg mb-4">📚 Saved Books</h2>
                {savedBooks.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {savedBooks.map((book: any) => (
                      <div key={book?.id} className="border border-gray-100 rounded-xl p-4 flex gap-3 items-center">
                        <div className="text-3xl">📚</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm truncate">{book?.title}</p>
                          <p className="text-gray-500 text-xs">{book?.class_level}</p>
                          <p className="font-bold text-blue-600 text-sm">৳{book?.price}</p>
                        </div>
                        <Link href={`/books/${book?.id}`} className="text-blue-600 text-xs font-semibold hover:underline">
                          দেখুন
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">কোনো Saved Book নেই</p>
                    <Link href="/books" className="text-blue-600 text-sm font-semibold hover:underline mt-2 inline-block">
                      বই দেখুন →
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div>
                <h2 className="font-black text-gray-900 text-lg mb-4">🔔 Notifications</h2>
                {notifications.length > 0 ? (
                  <div className="space-y-3">
                    {notifications.map(notif => (
                      <div key={notif.id} className={`p-4 rounded-xl border ${notif.is_read ? 'bg-white border-gray-100' : 'bg-blue-50 border-blue-100'}`}>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{notif.title}</p>
                            <p className="text-gray-600 text-sm mt-1">{notif.message}</p>
                            <p className="text-gray-400 text-xs mt-2">
                              {new Date(notif.created_at).toLocaleDateString('bn-BD')}
                            </p>
                          </div>
                          {!notif.is_read && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">কোনো Notification নেই</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}