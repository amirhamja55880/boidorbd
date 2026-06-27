'use client';
import { useState, useEffect, useRef } from 'react';
import { Plus, Search, Edit, Trash2, X, Upload } from 'lucide-react';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function AdminBooksPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editBook, setEditBook] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const pdfRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: '', author: '', description: '',
    category: 'SSC', class_level: '', subject: '',
    price: '', is_free: false, stock: '100',
  });
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const categories = ['SSC', 'HSC', 'Diploma', 'Literature'];

  useEffect(() => { fetchBooks(); }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const url = search ? `/api/books?search=${search}&limit=50` : '/api/books?limit=50';
      const res = await api.get(url);
      setBooks(res.data.books || []);
    } catch { toast.error('লোড হয়নি!'); }
    finally { setLoading(false); }
  };

  const openAdd = () => {
    setEditBook(null);
    setForm({ title: '', author: '', description: '', category: 'SSC', class_level: '', subject: '', price: '', is_free: false, stock: '100' });
    setPdfFile(null); setCoverFile(null);
    setShowModal(true);
  };

  const openEdit = (book: any) => {
    setEditBook(book);
    setForm({
      title: book.title || '', author: book.author || '',
      description: book.description || '', category: book.category || 'SSC',
      class_level: book.class_level || '', subject: book.subject || '',
      price: book.price || '', is_free: book.is_free || false, stock: book.stock || '100',
    });
    setPdfFile(null); setCoverFile(null);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) { toast.error('বইয়ের নাম দিন!'); return; }
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, String(v)));
      if (pdfFile) formData.append('pdf', pdfFile);
      if (coverFile) formData.append('cover', coverFile);

      if (editBook) {
        await api.put(`/api/books/${editBook.id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('বই Update হয়েছে!');
      } else {
        await api.post('/api/books', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('বই যোগ হয়েছে!');
      }
      setShowModal(false);
      fetchBooks();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'সমস্যা হয়েছে!');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`"${title}" Delete করবেন?`)) return;
    try {
      await api.delete(`/api/books/${id}`);
      toast.success('বই Delete হয়েছে!');
      fetchBooks();
    } catch { toast.error('Delete হয়নি!'); }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">📚 Book Management</h1>
          <p className="text-gray-400 text-sm mt-1">সব বই দেখুন, যোগ করুন, Edit করুন</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" /> নতুন বই
        </button>
      </div>

      {/* Search */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="text" placeholder="বই খুঁজুন..." value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchBooks()}
            className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-xl focus:outline-none focus:border-blue-500 placeholder-gray-500" />
        </div>
        <button onClick={fetchBooks}
          className="px-5 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors font-medium">
          খুঁজুন
        </button>
      </div>

      {/* Books Table */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-semibold">বই</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-semibold">Category</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-semibold">মূল্য</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-semibold">PDF</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-10 text-gray-500">লোড হচ্ছে...</td></tr>
              ) : books.length > 0 ? books.map(book => (
                <tr key={book.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                  <td className="px-5 py-3">
                    <p className="text-white font-medium text-sm">{book.title}</p>
                    <p className="text-gray-500 text-xs">{book.author}</p>
                  </td>
                  <td className="px-5 py-3">
                    <span className="bg-blue-900/30 text-blue-400 text-xs px-2 py-1 rounded-full font-semibold">
                      {book.category}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {book.is_free ? (
                      <span className="bg-green-900/30 text-green-400 text-xs px-2 py-1 rounded-full font-semibold">বিনামূল্যে</span>
                    ) : (
                      <span className="text-amber-400 font-bold">৳{book.price}</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    {book.pdf_url ? (
                      <span className="bg-green-900/30 text-green-400 text-xs px-2 py-1 rounded-full">✅ আছে</span>
                    ) : (
                      <span className="bg-red-900/30 text-red-400 text-xs px-2 py-1 rounded-full">❌ নেই</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(book)}
                        className="p-2 bg-blue-900/30 text-blue-400 rounded-lg hover:bg-blue-900/50 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(book.id, book.title)}
                        className="p-2 bg-red-900/30 text-red-400 rounded-lg hover:bg-red-900/50 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="text-center py-10 text-gray-500">কোনো বই নেই</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-700">
              <h2 className="font-black text-white">{editBook ? 'বই Edit করুন' : 'নতুন বই যোগ করুন'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1.5">বইয়ের নাম *</label>
                <input type="text" placeholder="বইয়ের নাম" value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })} required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-xl focus:outline-none focus:border-blue-500 placeholder-gray-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1.5">লেখক</label>
                <input type="text" placeholder="লেখকের নাম" value={form.author}
                  onChange={e => setForm({ ...form, author: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-xl focus:outline-none focus:border-blue-500 placeholder-gray-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1.5">Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-xl focus:outline-none focus:border-blue-500">
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1.5">Class/Level</label>
                  <input type="text" placeholder="যেমন: SSC, HSC" value={form.class_level}
                    onChange={e => setForm({ ...form, class_level: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-xl focus:outline-none focus:border-blue-500 placeholder-gray-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1.5">Subject</label>
                <input type="text" placeholder="বিষয়" value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-xl focus:outline-none focus:border-blue-500 placeholder-gray-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1.5">মূল্য (৳)</label>
                  <input type="number" placeholder="0" value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    disabled={form.is_free}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-xl focus:outline-none focus:border-blue-500 placeholder-gray-500 disabled:opacity-50" />
                </div>
                <div className="flex items-end pb-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.is_free}
                      onChange={e => setForm({ ...form, is_free: e.target.checked, price: e.target.checked ? '0' : form.price })}
                      className="w-4 h-4 accent-blue-600" />
                    <span className="text-gray-300 font-medium text-sm">বিনামূল্যে</span>
                  </label>
                </div>
              </div>

              {/* PDF Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1.5">PDF File</label>
                <div onClick={() => pdfRef.current?.click()}
                  className="border-2 border-dashed border-gray-600 rounded-xl p-4 text-center cursor-pointer hover:border-blue-500 transition-colors">
                  <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                  <p className="text-gray-400 text-sm">
                    {pdfFile ? pdfFile.name : 'PDF File Click করে Upload করুন'}
                  </p>
                </div>
                <input ref={pdfRef} type="file" accept=".pdf" className="hidden"
                  onChange={e => setPdfFile(e.target.files?.[0] || null)} />
              </div>

              {/* Cover Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1.5">Cover Image</label>
                <div onClick={() => coverRef.current?.click()}
                  className="border-2 border-dashed border-gray-600 rounded-xl p-4 text-center cursor-pointer hover:border-blue-500 transition-colors">
                  <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                  <p className="text-gray-400 text-sm">
                    {coverFile ? coverFile.name : 'Cover Image Click করে Upload করুন'}
                  </p>
                </div>
                <input ref={coverRef} type="file" accept="image/*" className="hidden"
                  onChange={e => setCoverFile(e.target.files?.[0] || null)} />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-3 bg-gray-700 text-gray-300 rounded-xl font-semibold hover:bg-gray-600 transition-colors">
                  বাতিল
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50">
                  {saving ? '⏳ Save হচ্ছে...' : editBook ? '✅ Update করুন' : '✅ যোগ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}