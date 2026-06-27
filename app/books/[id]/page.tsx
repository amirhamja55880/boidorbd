'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingCart, BookOpen, Star } from 'lucide-react';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function BookDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await api.get(`/api/books/${id}`);
        setBook(res.data.book);
      } catch (error) {
        toast.error('বই পাওয়া যায়নি!');
        router.push('/books');
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4 animate-bounce">📚</div>
        <p className="text-gray-500">লোড হচ্ছে...</p>
      </div>
    </div>
  );

  if (!book) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back */}
        <Link href="/books" className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 font-medium transition-colors">
          <ArrowLeft className="w-5 h-5" /> সব বই
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Cover */}
              <div className="w-full md:w-48 h-64 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-2xl flex items-center justify-center text-7xl flex-shrink-0">
                📚
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-3">
                  {book.is_free && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">✓ বিনামূল্যে পড়ুন</span>}
                  {book.class_level && <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">{book.class_level}</span>}
                  {book.subject && <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-bold">{book.subject}</span>}
                </div>

                <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">{book.title}</h1>
                {book.author && <p className="text-gray-500 mb-4">✍️ {book.author}</p>}

                {book.description && (
                  <p className="text-gray-600 leading-relaxed mb-6">{book.description}</p>
                )}

                {/* Price */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-3xl font-black text-blue-600">৳{book.final_price || book.price}</span>
                  {book.discount_price && (
                    <span className="text-gray-400 line-through text-xl">৳{book.price}</span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {book.is_free && book.pdf_url && (
                    <Link href={`/books/${book.id}/read`}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition-colors">
                      <BookOpen className="w-5 h-5" /> এখনই পড়ুন
                    </Link>
                  )}
                  <Link href={`/order?book=${book.id}`}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
                    <ShoppingCart className="w-5 h-5" /> অর্ডার করুন
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
