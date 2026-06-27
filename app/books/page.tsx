'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, BookOpen, Eye, User } from 'lucide-react';
import api from '../lib/api';

interface Book {
  id: string;
  title: string;
  author: string;
  class_level: string;
  subject: string;
  price: number;
  final_price: number;
  is_free: boolean;
  total_reads: number;
}

const categories = [
  { label: 'সব', emoji: '📚', color: 'from-gray-500 to-gray-600' },
  { label: 'SSC', emoji: '📗', color: 'from-green-500 to-emerald-600' },
  { label: 'HSC', emoji: '📘', color: 'from-blue-500 to-indigo-600' },
  { label: 'Diploma', emoji: '📙', color: 'from-amber-500 to-orange-500' },
  { label: 'Literature', emoji: '📕', color: 'from-red-500 to-rose-600' },
];

const bookCovers = [
  'from-blue-400 to-indigo-600',
  'from-emerald-400 to-green-600',
  'from-amber-400 to-orange-500',
  'from-red-400 to-rose-600',
  'from-purple-400 to-violet-600',
  'from-teal-400 to-cyan-600',
  'from-pink-400 to-rose-500',
  'from-indigo-400 to-blue-600',
];

function BooksContent() {
  const searchParams = useSearchParams();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('সব');
  const [freeOnly, setFreeOnly] = useState(false);

  useEffect(() => {
    const cat = searchParams.get('category');
    const free = searchParams.get('is_free');
    if (cat) setCategory(cat);
    if (free === 'true') setFreeOnly(true);
  }, [searchParams]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      let url = '/api/books?limit=20';
      if (search) url += `&search=${search}`;
      if (category !== 'সব') url += `&category=${category}`;
      if (freeOnly) url += '&is_free=true';
      const res = await api.get(url);
      setBooks(res.data.books || []);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBooks(); }, [category, freeOnly]);

  const activeCategory = categories.find(c => c.label === category) || categories[0];

  return (
    <div className="min-h-screen bg-[#f0f4ff]">

      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#0d2044] to-[#0a0a2e] pt-24 pb-16 px-4">
        <div className="absolute top-10 left-10 w-64 h-64 bg-blue-600 rounded-full filter blur-[100px] opacity-20 animate-pulse" />
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-indigo-600 rounded-full filter blur-[100px] opacity-15 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-white/20">
            <BookOpen className="w-4 h-4" /> বইয়ের ভান্ডার
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
            📚 সকল <span className="bg-gradient-to-r from-yellow-300 to-amber-300 bg-clip-text text-transparent">বই</span>
          </h1>
          <p className="text-blue-200 mb-8 text-lg">হাজার হাজার বই থেকে আপনার পছন্দেরটি খুঁজে নিন</p>

          {/* Search */}
          <form onSubmit={e => { e.preventDefault(); fetchBooks(); }} className="flex gap-3 max-w-2xl">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="বইয়ের নাম, লেখক বা বিষয় লিখুন..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 placeholder-gray-400 bg-white text-sm shadow-xl"
              />
            </div>
            <button type="submit" className="px-6 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-bold transition-colors shadow-xl shadow-blue-500/30">
              খুঁজুন
            </button>
          </form>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none">
            <path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 28C1200 25 1320 20 1380 17L1440 15V60H0Z" fill="#f0f4ff" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Category Filter */}
        <div className="flex gap-3 flex-wrap mb-6">
          {categories.map(cat => (
            <button key={cat.label} onClick={() => setCategory(cat.label)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-200 ${
                category === cat.label
                  ? `bg-gradient-to-r ${cat.color} text-white shadow-lg scale-105`
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
              }`}>
              <span>{cat.emoji}</span> {cat.label}
            </button>
          ))}
          <button onClick={() => setFreeOnly(!freeOnly)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-200 ml-auto ${
              freeOnly
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}>
            🆓 বিনামূল্যে
          </button>
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-gray-500 text-sm mb-5 font-medium">
            {books.length > 0 ? `${books.length}টি বই পাওয়া গেছে` : ''}
            {category !== 'সব' && <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-bold">{category}</span>}
            {freeOnly && <span className="ml-2 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold">বিনামূল্যে</span>}
          </p>
        )}

        {/* Books Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden animate-pulse">
                <div className="h-44 bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded-full" />
                  <div className="h-3 bg-gray-100 rounded-full w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : books.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 pb-10">
            {books.map((book, i) => (
              <div key={book.id}
                className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                {/* Book Cover */}
                <div className={`relative h-44 bg-gradient-to-br ${bookCovers[i % bookCovers.length]} flex flex-col items-center justify-center p-4`}>
                  {book.is_free && (
                    <div className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-black shadow-lg">
                      FREE
                    </div>
                  )}
                  {book.final_price < book.price && book.price > 0 && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-black shadow-lg">
                      SALE
                    </div>
                  )}
                  <div className="text-5xl mb-2 group-hover:scale-110 transition-transform duration-300">📖</div>
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/30 to-transparent" />
                  {book.class_level && (
                    <div className="absolute bottom-2 left-3 bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                      {book.class_level}
                    </div>
                  )}
                </div>

                {/* Book Info */}
                <div className="p-4">
                  <h3 className="font-black text-gray-900 text-sm leading-snug mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {book.title}
                  </h3>
                  {book.author && (
                    <div className="flex items-center gap-1 text-gray-400 text-xs mb-2">
                      <User className="w-3 h-3" />
                      <span className="truncate">{book.author}</span>
                    </div>
                  )}
                  {book.total_reads > 0 && (
                    <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
                      <Eye className="w-3 h-3" />
                      <span>{book.total_reads.toLocaleString('bn-BD')} বার পড়া হয়েছে</span>
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-black text-blue-600 text-base">
                      {book.is_free ? 'বিনামূল্যে' : `৳${book.final_price || book.price}`}
                    </span>
                    {!book.is_free && book.final_price < book.price && book.price > 0 && (
                      <span className="text-gray-400 line-through text-xs">৳{book.price}</span>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    {book.is_free && (
                      <Link href={`/books/${book.id}/read`}
                        className="flex-1 text-center py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors">
                        📖 পড়ুন
                      </Link>
                    )}
                    <Link href={`/books/${book.id}`}
                      className="flex-1 text-center py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors">
                      বিস্তারিত
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="text-7xl mb-4">📭</div>
            <p className="text-xl font-bold text-gray-700 mb-2">কোনো বই পাওয়া যায়নি</p>
            <p className="text-gray-400 text-sm">অন্য keyword বা category দিয়ে চেষ্টা করুন</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BooksPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#f0f4ff]">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">📚</div>
          <p className="text-gray-500 font-medium">বই লোড হচ্ছে...</p>
        </div>
      </div>
    }>
      <BooksContent />
    </Suspense>
  );
}