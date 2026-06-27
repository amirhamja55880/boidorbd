'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen } from 'lucide-react';
import api from '../../../lib/api';
import toast from 'react-hot-toast';

export default function ReadBookPage() {
  const { id } = useParams();
  const router = useRouter();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('বই পড়তে Login করুন!');
      router.push('/login');
      return;
    }

    const fetchPdfUrl = async () => {
      try {
        const res = await api.get(`/api/books/${id}/read`);
        setPdfUrl(res.data.url);
        setTitle(res.data.title);
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'বই লোড হয়নি!');
        router.push(`/books/${id}`);
      } finally {
        setLoading(false);
      }
    };
    fetchPdfUrl();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center text-white">
        <div className="text-5xl mb-4 animate-bounce">📚</div>
        <p>বই লোড হচ্ছে...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Reader Header */}
      <div className="bg-gray-800 px-4 py-3 flex items-center gap-4">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 flex-1">
          <BookOpen className="w-5 h-5 text-blue-400" />
          <span className="text-white font-semibold text-sm truncate">{title}</span>
        </div>
        <span className="text-gray-500 text-xs">২ ঘণ্টার জন্য Available</span>
      </div>

      {/* PDF Viewer */}
      {pdfUrl ? (
        <iframe
          src={`https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`}
          className="flex-1 w-full"
          style={{ minHeight: 'calc(100vh - 56px)' }}
          title={title}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          <p>PDF লোড হয়নি!</p>
        </div>
      )}
    </div>
  );
}
