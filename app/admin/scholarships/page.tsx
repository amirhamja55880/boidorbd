'use client';
import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, X, ExternalLink } from 'lucide-react';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function AdminScholarshipsPage() {
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: '', description: '', country: '',
    university: '', level: '', amount: '',
    scholarship_type: '', deadline: '',
    requirements: '', application_link: '',
  });

  const levels = ['Undergraduate', 'Masters', 'PhD', 'Diploma', 'Others'];

  useEffect(() => { fetchScholarships(); }, []);

  const fetchScholarships = async () => {
    setLoading(true);
    try {
      const url = search ? `/api/scholarships?search=${search}&limit=50` : '/api/scholarships?limit=50';
      const res = await api.get(url);
      setScholarships(res.data.scholarships || []);
    } catch { toast.error('লোড হয়নি!'); }
    finally { setLoading(false); }
  };

  const openAdd = () => {
    setEditItem(null);
    setForm({ title: '', description: '', country: '', university: '', level: '', amount: '', scholarship_type: '', deadline: '', requirements: '', application_link: '' });
    setShowModal(true);
  };

  const openEdit = (item: any) => {
    setEditItem(item);
    setForm({
      title: item.title || '', description: item.description || '',
      country: item.country || '', university: item.university || '',
      level: item.level || '', amount: item.amount || '',
      scholarship_type: item.scholarship_type || '',
      deadline: item.deadline ? item.deadline.split('T')[0] : '',
      requirements: item.requirements || '',
      application_link: item.application_link || '',
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.country) { toast.error('শিরোনাম ও দেশ দিন!'); return; }
    setSaving(true);
    try {
      if (editItem) {
        await api.put(`/api/scholarships/${editItem.id}`, form);
        toast.success('Scholarship Update হয়েছে!');
      } else {
        await api.post('/api/scholarships', form);
        toast.success('Scholarship যোগ হয়েছে!');
      }
      setShowModal(false);
      fetchScholarships();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'সমস্যা হয়েছে!');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete করবেন?')) return;
    try {
      await api.delete(`/api/scholarships/${id}`);
      toast.success('Delete হয়েছে!');
      fetchScholarships();
    } catch { toast.error('Delete হয়নি!'); }
  };

  const isExpired = (date: string) => date && new Date(date) < new Date();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">🎓 Scholarship Management</h1>
          <p className="text-gray-400 text-sm mt-1">স্কলারশিপ যোগ করুন ও পরিচালনা করুন</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" /> নতুন Scholarship
        </button>
      </div>

      {/* Search */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="text" placeholder="Scholarship খুঁজুন..."
            value={search} onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchScholarships()}
            className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-xl focus:outline-none focus:border-blue-500 placeholder-gray-500" />
        </div>
        <button onClick={fetchScholarships}
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
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-semibold">দেশ</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-semibold">Level</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-semibold">Deadline</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-10 text-gray-500">লোড হচ্ছে...</td></tr>
              ) : scholarships.length > 0 ? scholarships.map(s => (
                <tr key={s.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                  <td className="px-5 py-3">
                    <p className="text-white text-sm font-medium">{s.title}</p>
                    <p className="text-gray-500 text-xs">{s.university}</p>
                  </td>
                  <td className="px-5 py-3">
                    <span className="bg-emerald-900/30 text-emerald-400 text-xs px-2 py-1 rounded-full font-semibold">
                      🌍 {s.country}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-400 text-sm">{s.level || '-'}</td>
                  <td className="px-5 py-3">
                    {s.deadline ? (
                      <span className={`text-xs font-semibold ${isExpired(s.deadline) ? 'text-red-400' : 'text-orange-400'}`}>
                        {isExpired(s.deadline) ? '❌ ' : '📅 '}
                        {new Date(s.deadline).toLocaleDateString('bn-BD')}
                      </span>
                    ) : <span className="text-gray-600 text-xs">N/A</span>}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      {s.application_link && (
                        <a href={s.application_link} target="_blank" rel="noopener noreferrer"
                          className="p-2 bg-green-900/30 text-green-400 rounded-lg hover:bg-green-900/50 transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
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
                <tr><td colSpan={5} className="text-center py-10 text-gray-500">কোনো Scholarship নেই</td></tr>
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
              <h2 className="font-black text-white">{editItem ? 'Scholarship Edit' : 'নতুন Scholarship'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1.5">শিরোনাম *</label>
                <input type="text" placeholder="Scholarship এর নাম" value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })} required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-xl focus:outline-none focus:border-blue-500 placeholder-gray-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1.5">দেশ *</label>
                  <input type="text" placeholder="Japan, UK..." value={form.country}
                    onChange={e => setForm({ ...form, country: e.target.value })} required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-xl focus:outline-none focus:border-blue-500 placeholder-gray-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1.5">University</label>
                  <input type="text" placeholder="University নাম" value={form.university}
                    onChange={e => setForm({ ...form, university: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-xl focus:outline-none focus:border-blue-500 placeholder-gray-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1.5">Level</label>
                  <select value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-xl focus:outline-none focus:border-blue-500">
                    <option value="">Select করুন</option>
                    {levels.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1.5">Amount</label>
                  <input type="text" placeholder="৳ বা $ পরিমাণ" value={form.amount}
                    onChange={e => setForm({ ...form, amount: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-xl focus:outline-none focus:border-blue-500 placeholder-gray-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1.5">Type</label>
                  <input type="text" placeholder="Full/Partial..." value={form.scholarship_type}
                    onChange={e => setForm({ ...form, scholarship_type: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-xl focus:outline-none focus:border-blue-500 placeholder-gray-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1.5">Deadline</label>
                  <input type="date" value={form.deadline}
                    onChange={e => setForm({ ...form, deadline: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-xl focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1.5">Application Link</label>
                <input type="url" placeholder="https://..." value={form.application_link}
                  onChange={e => setForm({ ...form, application_link: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-xl focus:outline-none focus:border-blue-500 placeholder-gray-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1.5">Description</label>
                <textarea placeholder="বিস্তারিত বিবরণ..." value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-xl focus:outline-none focus:border-blue-500 placeholder-gray-500 resize-none" />
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