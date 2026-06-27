'use client';
import { useState } from 'react';
import { Send, Users, User } from 'lucide-react';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function AdminNotificationsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'one'>('all');
  const [sending, setSending] = useState(false);

  const [allForm, setAllForm] = useState({
    title: '',
    message: '',
    type: 'general',
    send_email: false,
  });

  const [oneForm, setOneForm] = useState({
    user_id: '',
    title: '',
    message: '',
    type: 'general',
    send_email: false,
  });

  const handleSendAll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allForm.title || !allForm.message) {
      toast.error('শিরোনাম এবং বার্তা দিন!');
      return;
    }
    setSending(true);
    try {
      const res = await api.post('/api/notifications/send-all', allForm);
      toast.success(res.data.message);
      setAllForm({ title: '', message: '', type: 'general', send_email: false });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'সমস্যা হয়েছে!');
    } finally {
      setSending(false);
    }
  };

  const handleSendOne = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oneForm.user_id || !oneForm.title || !oneForm.message) {
      toast.error('User ID, শিরোনাম এবং বার্তা দিন!');
      return;
    }
    setSending(true);
    try {
      const res = await api.post('/api/notifications/send-user', oneForm);
      toast.success(res.data.message);
      setOneForm({ user_id: '', title: '', message: '', type: 'general', send_email: false });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'সমস্যা হয়েছে!');
    } finally {
      setSending(false);
    }
  };

  const notificationTypes = [
    { value: 'general', label: '📢 General' },
    { value: 'order', label: '🛒 Order' },
    { value: 'book', label: '📚 Book' },
    { value: 'scholarship', label: '🎓 Scholarship' },
    { value: 'suggestion', label: '📝 Suggestion' },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white">🔔 Notification Management</h1>
        <p className="text-gray-400 text-sm mt-1">Users কে Notification পাঠান</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => setActiveTab('all')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
            activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
          }`}>
          <Users className="w-4 h-4" /> সবাইকে পাঠান
        </button>
        <button onClick={() => setActiveTab('one')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
            activeTab === 'one' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
          }`}>
          <User className="w-4 h-4" /> একজনকে পাঠান
        </button>
      </div>

      {/* Send To All */}
      {activeTab === 'all' && (
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="font-black text-white">সবাইকে Notification</h2>
              <p className="text-gray-400 text-xs">সকল Registered Users কে পাঠাবে</p>
            </div>
          </div>

          <form onSubmit={handleSendAll} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1.5">শিরোনাম *</label>
              <input type="text" placeholder="Notification এর শিরোনাম"
                value={allForm.title}
                onChange={e => setAllForm({ ...allForm, title: e.target.value })}
                required
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-xl focus:outline-none focus:border-blue-500 placeholder-gray-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1.5">বার্তা *</label>
              <textarea placeholder="Notification এর বিস্তারিত বার্তা..."
                value={allForm.message}
                onChange={e => setAllForm({ ...allForm, message: e.target.value })}
                required rows={4}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-xl focus:outline-none focus:border-blue-500 placeholder-gray-500 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1.5">Type</label>
              <select value={allForm.type}
                onChange={e => setAllForm({ ...allForm, type: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-xl focus:outline-none focus:border-blue-500">
                {notificationTypes.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <label className="flex items-center gap-3 cursor-pointer p-4 bg-gray-700/50 rounded-xl border border-gray-600 hover:border-blue-500 transition-colors">
              <input type="checkbox" checked={allForm.send_email}
                onChange={e => setAllForm({ ...allForm, send_email: e.target.checked })}
                className="w-4 h-4 accent-blue-600" />
              <div>
                <p className="text-white font-semibold text-sm">📧 Gmail এ পাঠান</p>
                <p className="text-gray-400 text-xs">সবার Gmail এ Email যাবে</p>
              </div>
            </label>

            {allForm.send_email && (
              <div className="bg-amber-900/20 border border-amber-800 rounded-xl p-3">
                <p className="text-amber-400 text-xs font-medium">
                  ⚠️ Gmail এ পাঠালে সময় বেশি লাগবে। Gmail এ দিনে ৫০০ Email Limit আছে।
                </p>
              </div>
            )}

            <button type="submit" disabled={sending}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              <Send className="w-4 h-4" />
              {sending ? '⏳ পাঠানো হচ্ছে...' : '📢 সবাইকে পাঠান'}
            </button>
          </form>
        </div>
      )}

      {/* Send To One */}
      {activeTab === 'one' && (
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-900/30 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="font-black text-white">একজনকে Notification</h2>
              <p className="text-gray-400 text-xs">নির্দিষ্ট একজন User কে পাঠাবে</p>
            </div>
          </div>

          <form onSubmit={handleSendOne} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1.5">User ID *</label>
              <input type="text" placeholder="User এর ID দিন (Users Page থেকে নিন)"
                value={oneForm.user_id}
                onChange={e => setOneForm({ ...oneForm, user_id: e.target.value })}
                required
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-xl focus:outline-none focus:border-blue-500 placeholder-gray-500 font-mono text-sm" />
              <p className="text-gray-500 text-xs mt-1">
                💡 Users Management Page এ গিয়ে User এর ID Copy করুন
              </p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1.5">শিরোনাম *</label>
              <input type="text" placeholder="Notification এর শিরোনাম"
                value={oneForm.title}
                onChange={e => setOneForm({ ...oneForm, title: e.target.value })}
                required
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-xl focus:outline-none focus:border-blue-500 placeholder-gray-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1.5">বার্তা *</label>
              <textarea placeholder="Notification এর বার্তা..."
                value={oneForm.message}
                onChange={e => setOneForm({ ...oneForm, message: e.target.value })}
                required rows={4}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-xl focus:outline-none focus:border-blue-500 placeholder-gray-500 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1.5">Type</label>
              <select value={oneForm.type}
                onChange={e => setOneForm({ ...oneForm, type: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-xl focus:outline-none focus:border-blue-500">
                {notificationTypes.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <label className="flex items-center gap-3 cursor-pointer p-4 bg-gray-700/50 rounded-xl border border-gray-600 hover:border-purple-500 transition-colors">
              <input type="checkbox" checked={oneForm.send_email}
                onChange={e => setOneForm({ ...oneForm, send_email: e.target.checked })}
                className="w-4 h-4 accent-purple-600" />
              <div>
                <p className="text-white font-semibold text-sm">📧 Gmail এ পাঠান</p>
                <p className="text-gray-400 text-xs">User এর Gmail এ Email যাবে</p>
              </div>
            </label>

            <button type="submit" disabled={sending}
              className="w-full py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              <Send className="w-4 h-4" />
              {sending ? '⏳ পাঠানো হচ্ছে...' : '📨 পাঠান'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
