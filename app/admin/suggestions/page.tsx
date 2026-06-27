'use client';
import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, X } from 'lucide-react';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function AdminSuggestionsPage() {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: '', content: '', exam_type: 'SSC',
    subject: '', class_level: '', year: '',
    is_important: false, is_premium: false,
  });

  const examTypes = ['SSC', 'HSC', 'Diploma', 'BCS', 'Admission'];

  useEffect(() => { fetchSuggestions(); }, []);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const url = search ? `/api/suggestions?search=${search}&limit=50` : '/api/suggestions?limit=50';
      const res = await api.get(url);
      setSuggestions(res.data.suggestions || []);
    } catch { toast.error('লোড হয়নি!'); }
    finally { setLoading(false); }
  };

  const openAdd = () => {
    setEditItem(null);
    setForm({ title: '', content: '', exam_type: 'SSC', subject: '', class_level: '', year: '', is_important: false, is_premium: false });
    setShowModal(true);
  };

  const openEdit = (item: any) => {
    setEditItem(item);
    setForm({
      title: item.title || '', content: item.content || '',
      exam_type: item.exam_type || 'SSC', subject: item.subject || '',
      class_level: item.class_level || '', year: item.year || '',
      is_important: item.is_important || false, is_premium: item.is_premium || false,
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) { toast.error('শিরোনাম দিন!'); return; }
    setSaving(true);
    try {
      if (editItem) {
        await api.put(`/api/suggestions/${editItem.id}`, form);
        toast.success('Suggestion Update হয়েছে!');
      } else {
        await api.post('/api/suggestions', form);
        toast.success('Suggestion যোগ হয়েছে!');
      }
      setShowModal(false);
      fetchSuggestions();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'সমস্যা হয়েছে!');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete করবেন?')) return;
    try {
      await api.delete(`/api/suggestions/${id}`);
      toast.success('Delete হয়েছে!');
      fetchSuggestions();
    } catch { toast.error('Delete হয়নি!'); }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">📝 Suggestion Management</h1>
          <p className="text-gray-400 text-sm mt-1">পরীক্ষার সাজেশন যোগ করুন ও পরিচালনা করুন</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" /> নতুন Suggestion
        </button>
      </div>

      {/* Search */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="text" placeholder="Suggestion খুঁজুন..."
            value={search} onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchSuggestions()}
            className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-xl focus:outline-none focus:border-blue-500 placeholder-gray-500" />
        </div>
        <button onClick={fetchSuggestions}
          className="px-5 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors font-medium">
          খুঁজুন
        </button>
      </div>

      {/* Table */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-semibold">শিরোনাম</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-semibold">Exam</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-semibold">Subject</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-semibold">Flag</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-10 text-gray-500">লোড হচ্ছে...</td></tr>
              ) : suggestions.length > 0 ? suggestions.map(s => (
                <tr key={s.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                  <td className="px-5 py-3 text-white text-sm font-medium">{s.title}</td>
                  <td className="px-5 py-3">
                    <span className="bg-amber-900/30 text-amber-400 text-xs px-2 py-1 rounded-full font-semibold">
                      {s.exam_type}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-400 text-sm">{s.subject || '-'}</td>
                  <td className="px-5 py-3">
                    <div className="flex gap-1">
                      {s.is_important && <span className="bg-red-900/30 text-red-400 text-xs px-2 py-0.5 rounded-full">⭐ Important</span>}
                      {s.is_premium && <span className="bg-yellow-900/30 text-yellow-400 text-xs px-2 py-0.5 rounded-full">💎 Premium</span>}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(s)}
                        className="p-2 bg-blue-900/30 text-blue-400 rounded-lg hover:bg-blue-900/50 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(s.id)}
                        className="p-2 bg-red-900/30 text-red-400 rounded-lg hover:bg-red-900/50 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="text-center py-10 text-gray-500">কোনো Suggestion নেই</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-700">
              <h2 className="font-black text-white">{editItem ? 'Suggestion Edit' : 'নতুন Suggestion'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1.5">শিরোনাম *</label>
                <input type="text" placeholder="Suggestion এর শিরোনাম" value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })} required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-xl focus:outline-none focus:border-blue-500 placeholder-gray-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1.5">Exam Type</label>
                  <select value={form.exam_type} onChange={e => setForm({ ...form, exam_type: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-xl focus:outline-none focus:border-blue-500">
                    {examTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1.5">Subject</label>
                  <input type="text" placeholder="বিষয়" value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-xl focus:outline-none focus:border-blue-500 placeholder-gray-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1.5">Class/Level</label>
                  <input type="text" placeholder="SSC/HSC" value={form.class_level}
                    onChange={e => setForm({ ...form, class_level: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-xl focus:outline-none focus:border-blue-500 placeholder-gray-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1.5">Year</label>
                  <input type="text" placeholder="2025" value={form.year}
                    onChange={e => setForm({ ...form, year: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-xl focus:outline-none focus:border-blue-500 placeholder-gray-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1.5">Content</label>
                <textarea placeholder="Suggestion এর বিষয়বস্তু..." value={form.content}
                  onChange={e => setForm({ ...form, content: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-xl focus:outline-none focus:border-blue-500 placeholder-gray-500 resize-none" />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_important}
                    onChange={e => setForm({ ...form, is_important: e.target.checked })}
                    className="w-4 h-4 accent-red-500" />
                  <span className="text-gray-300 text-sm font-medium">⭐ Important</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_premium}
                    onChange={e => setForm({ ...form, is_premium: e.target.checked })}
                    className="w-4 h-4 accent-yellow-500" />
                  <span className="text-gray-300 text-sm font-medium">💎 Premium</span>
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-3 bg-gray-700 text-gray-300 rounded-xl font-semibold hover:bg-gray-600 transition-colors">
                  বাতিল
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50">
                  {saving ? '⏳ Save হচ্ছে...' : editItem ? '✅ Update' : '✅ যোগ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}