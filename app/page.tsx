'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { BookOpen, ArrowRight, Star, ChevronRight, Zap, Shield, Smartphone, Truck, Tag, Target, Play, CheckCircle } from 'lucide-react';
import api from './lib/api';

interface Book {
  id: string;
  title: string;
  class_level: string;
  subject: string;
  price: number;
  final_price: number;
  is_free: boolean;
}

// Animated counter
function useCounter(end: number, duration: number = 2000, start: boolean = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, start]);
  return count;
}

function StatItem({ end, suffix, label, icon }: { end: number, suffix: string, label: string, icon: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const count = useCounter(end, 2000, visible);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-3xl md:text-4xl font-black text-white">
        {visible ? count.toLocaleString('bn-BD') : '০'}{suffix}
      </div>
      <div className="text-blue-200 text-sm font-medium mt-1">{label}</div>
    </div>
  );
}

const categories = [
  { label: 'SSC', emoji: '📗', desc: 'মাধ্যমিক', color: 'from-green-400 to-emerald-500', link: '/books?category=SSC' },
  { label: 'HSC', emoji: '📘', desc: 'উচ্চ মাধ্যমিক', color: 'from-blue-400 to-indigo-500', link: '/books?category=HSC' },
  { label: 'Diploma', emoji: '📙', desc: 'ডিপ্লোমা', color: 'from-amber-400 to-orange-500', link: '/books?category=Diploma' },
  { label: 'Literature', emoji: '📕', desc: 'সাহিত্য পড়ুন', color: 'from-red-400 to-pink-500', link: '/books?category=Literature' },
  // { label: 'Admission', emoji: '📓', desc: 'ভর্তি পরীক্ষা', color: 'from-purple-400 to-violet-500', link: '/books?category=Admission' },
  { label: 'বিনামূল্যে', emoji: '🆓', desc: 'ফ্রি বই', color: 'from-teal-400 to-cyan-500', link: '/books?is_free=true' },
];

const testimonials = [
  { name: 'রাহেলা বেগম', class: 'HSC পরীক্ষার্থী', text: 'BoidorBD এর সাজেশন ফলো করে HSC তে A+ পেয়েছি! সত্যিই অসাধারণ প্ল্যাটফর্ম।', rating: 5, avatar: '👩‍🎓' },
  { name: 'মোঃ রাকিব হাসান', class: 'BCS প্রস্তুতি', text: 'বিনামূল্যে এত ভালো BCS গাইড পাবো ভাবিনি। প্রতিদিন এখানে পড়াশোনা করি।', rating: 5, avatar: '👨‍💻' },
  { name: 'তানজিলা আক্তার', class: 'SSC পরীক্ষার্থী', text: 'বাসায় বসে অর্ডার করলাম, পরদিনই বই পেয়ে গেলাম। দাম অনেক কম!', rating: 5, avatar: '👧' },
];

const features = [
  { icon: <Zap className="w-6 h-6" />, title: 'বিনামূল্যে পড়ুন', desc: 'হাজার হাজার বই সম্পূর্ণ বিনামূল্যে', color: 'from-yellow-400 to-amber-500' },
  { icon: <Shield className="w-6 h-6" />, title: 'সম্পূর্ণ নিরাপদ', desc: 'আপনার তথ্য সুরক্ষিত থাকবে', color: 'from-green-400 to-emerald-500' },
  { icon: <Smartphone className="w-6 h-6" />, title: 'যেকোনো ডিভাইস', desc: 'Mobile, Tablet, Computer সব ডিভাইসে', color: 'from-blue-400 to-indigo-500' },
  { icon: <Truck className="w-6 h-6" />, title: 'দ্রুত ডেলিভারি', desc: 'সারা বাংলাদেশে হোম ডেলিভারি', color: 'from-purple-400 to-violet-500' },
  { icon: <Tag className="w-6 h-6" />, title: 'সাশ্রয়ী মূল্য', desc: 'সর্বনিম্ন মূল্যে সেরা বই', color: 'from-pink-400 to-rose-500' },
  { icon: <Target className="w-6 h-6" />, title: 'সঠিক সাজেশন', desc: 'অভিজ্ঞ শিক্ষকদের তৈরি', color: 'from-teal-400 to-cyan-500' },
];

export default function HomePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(0);

  useEffect(() => {
    api.get('/api/books?limit=6').then(res => setBooks(res.data.books || [])).catch(() => {}).finally(() => setLoading(false));
    const interval = setInterval(() => setActiveCategory(p => (p + 1) % categories.length), 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen overflow-hidden">

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Deep dark background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#020818] via-[#0a1628] to-[#0d0a2e]" />

        {/* Animated blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 rounded-full filter blur-[120px] opacity-20 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600 rounded-full filter blur-[120px] opacity-20 animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500 rounded-full filter blur-[100px] opacity-10 animate-pulse" style={{ animationDelay: '3s' }} />

        {/* Star dots */}
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        {/* Floating UI cards */}
        <div className="absolute top-28 left-6 md:left-20 animate-bounce hidden md:block" style={{ animationDuration: '4s' }}>
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl px-4 py-3 border border-white/20 text-white">
            <p className="text-xs text-white/60 font-medium">🔥 নতুন সাজেশন</p>
            <p className="text-sm font-black">HSC 2025 Special 📝</p>
          </div>
        </div>
        <div className="absolute top-40 right-6 md:right-20 animate-bounce hidden md:block" style={{ animationDuration: '5s', animationDelay: '1s' }}>
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl px-4 py-3 border border-white/20 text-white">
            <p className="text-xs text-white/60 font-medium">✨ বিনামূল্যে</p>
            <p className="text-sm font-black">SSC Physics 2025 📚</p>
          </div>
        </div>
        <div className="absolute bottom-48 left-10 md:left-24 animate-bounce hidden md:block" style={{ animationDuration: '6s', animationDelay: '2s' }}>
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl px-4 py-3 border border-white/20 text-white">
            <p className="text-xs text-white/60 font-medium">🎓 স্কলারশিপ</p>
            <p className="text-sm font-black">Deadline: July 30</p>
          </div>
        </div>
        <div className="absolute bottom-36 right-10 md:right-28 animate-bounce hidden md:block" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
          <div className="bg-green-500/20 backdrop-blur-xl rounded-2xl px-4 py-3 border border-green-400/30 text-white">
            <p className="text-xs text-green-300 font-medium">✅ নতুন অর্ডার</p>
            <p className="text-sm font-black">বই ডেলিভারি হয়েছে 🎉</p>
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-5 py-2.5 rounded-full text-sm font-semibold mb-8 border border-white/20">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            বাংলাদেশের সেরা শিক্ষামূলক প্ল্যাটফর্ম 
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[1.05]">
            জ্ঞানের আলোয়<br />
            <span className="relative">
              <span className="bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-300 bg-clip-text text-transparent">
                আলোকিত হোন
              </span>
              <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 400 8">
                <path d="M0 6 Q100 0 200 4 Q300 8 400 2" stroke="#fbbf24" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          <p className="text-blue-200 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            বিনামূল্যে বই পড়ুন, পরীক্ষার সাজেশন পান, স্কলারশিপ গাইড পান — সবই এক জায়গায়।
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-black text-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-2xl shadow-blue-500/30 hover:-translate-y-1 hover:shadow-blue-500/50">
              ✨ বিনামূল্যে শুরু করুন
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/books"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white rounded-2xl font-bold text-lg hover:bg-white/20 transition-all border border-white/20 backdrop-blur-sm hover:-translate-y-1">
              <BookOpen className="w-5 h-5" /> বই দেখুন
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="flex -space-x-2">
              {['🧑', '👩', '👨', '👧', '🧒', '👦'].map((e, i) => (
                <div key={i} className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full border-2 border-white/20 flex items-center justify-center text-sm shadow-lg">
                  {e}
                </div>
              ))}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                <span className="text-yellow-400 font-bold text-sm ml-1">4.9</span>
              </div>
              <p className="text-white/70 text-sm"><span className="text-white font-black">১০,০০০+</span> শিক্ষার্থী ব্যবহার করছে</p>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 100L60 83C120 67 240 33 360 25C480 17 600 33 720 42C840 50 960 50 1080 46C1200 42 1320 33 1380 29L1440 25V100H0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 py-16 px-4 -mt-1">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatItem end={10000} suffix="+" label="শিক্ষার্থী" icon="👨‍🎓" />
            <StatItem end={500} suffix="+" label="বই সংগ্রহ" icon="📚" />
            <StatItem end={150} suffix="+" label="সাজেশন" icon="📝" />
            <StatItem end={100} suffix="+" label="স্কলারশিপ গাইড" icon="🎓" />
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-bold text-sm uppercase tracking-widest">Browse By Category</span>
            <h2 className="text-4xl font-black text-gray-900 mt-2 mb-3">বিভাগ অনুযায়ী খুঁজুন</h2>
            <p className="text-gray-500">আপনার ক্লাস বা পরীক্ষা অনুযায়ী বই বেছে নিন</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <Link key={i} href={cat.link}
                className="group relative bg-white rounded-2xl p-5 text-center border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                <div className={`w-14 h-14 bg-gradient-to-br ${cat.color} rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                  {cat.emoji}
                </div>
                <p className="font-black text-gray-900 text-sm">{cat.label}</p>
                <p className="text-gray-400 text-xs mt-0.5">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== QUICK ACCESS ===== */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-indigo-600 font-bold text-sm uppercase tracking-widest">Quick Access</span>
            <h2 className="text-4xl font-black text-gray-900 mt-2 mb-3">⚡ দ্রুত অ্যাক্সেস</h2>
            <p className="text-gray-500">আপনার প্রয়োজনীয় সব কিছু এক জায়গায়</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '📖', title: 'বিনামূল্যে বই', desc: 'SSC, HSC, Diploma, BCS', points: ['PDF পড়ুন', 'Download করুন', 'Bookmark করুন'], color: 'from-blue-500 to-indigo-600', link: '/books?is_free=true' },
              { icon: '📝', title: 'পরীক্ষার সাজেশন', desc: 'সকল পরীক্ষার সাজেশন', points: ['SSC সাজেশন', 'HSC সাজেশন', 'BCS সাজেশন'], color: 'from-amber-500 to-orange-500', link: '/exam-prep' },
              { icon: '🎓', title: 'স্কলারশিপ গাইড', desc: 'দেশে ও বিদেশে', points: ['দেশীয় বৃত্তি', 'বিদেশি বৃত্তি', 'Apply Guide'], color: 'from-emerald-500 to-green-600', link: '/scholarship' },
              { icon: '🛒', title: 'বই অর্ডার করুন', desc: 'হোম ডেলিভারি সুবিধা', points: ['সারাদেশে ডেলিভারি', 'bKash/Nagad পেমেন্ট', 'সাশ্রয়ী মূল্য'], color: 'from-purple-500 to-violet-600', link: '/books' },
            ].map((item, i) => (
              <Link key={i} href={item.link}
                className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className={`h-2 bg-gradient-to-r ${item.color}`} />
                <div className="p-6">
                  <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </div>
                  <h3 className="font-black text-gray-900 text-lg mb-1">{item.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{item.desc}</p>
                  <div className="space-y-1.5">
                    {item.points.map((p, j) => (
                      <div key={j} className="flex items-center gap-2 text-gray-500 text-xs">
                        <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                        {p}
                      </div>
                    ))}
                  </div>
                  <div className={`mt-4 flex items-center gap-1 bg-gradient-to-r ${item.color} bg-clip-text text-transparent font-bold text-sm`}>
                    দেখুন <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-blue-500" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== POPULAR BOOKS ===== */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-red-500 font-bold text-sm uppercase tracking-widest">Most Popular</span>
              <h2 className="text-4xl font-black text-gray-900 mt-2 mb-2">🔥 জনপ্রিয় বই</h2>
              <p className="text-gray-500">সবচেয়ে বেশি পঠিত বইগুলো</p>
            </div>
            <Link href="/books" className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition-colors text-sm">
              সব দেখুন <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <div key={i} className="bg-gray-100 rounded-3xl h-52 animate-pulse" />)}
            </div>
          ) : books.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book, i) => (
                <div key={book.id} className="group bg-white border border-gray-100 rounded-3xl p-5 hover:shadow-xl transition-all duration-300 hover:border-blue-100 hover:-translate-y-1 relative overflow-hidden">
                  {i === 0 && <div className="absolute top-4 right-4 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">#১ জনপ্রিয়</div>}
                  <div className="flex gap-4 items-start">
                    <div className="w-16 h-20 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                      📚
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 mb-1 line-clamp-2 text-sm leading-snug">{book.title}</h3>
                      <p className="text-gray-400 text-xs mb-2">{book.class_level} • {book.subject}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        {book.is_free && <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-bold">বিনামূল্যে</span>}
                        <span className="font-black text-blue-600 text-sm">৳{book.final_price || book.price}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    {book.is_free && (
                      <Link href={`/books/${book.id}/read`} className="flex-1 text-center py-2.5 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors">
                        📖 পড়ুন
                      </Link>
                    )}
                    <Link href={`/books/${book.id}`} className="flex-1 text-center py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors">
                      বিস্তারিত →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-lg font-medium">শীঘ্রই বই যোগ হবে!</p>
            </div>
          )}

          <div className="text-center mt-8 md:hidden">
            <Link href="/books" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
              সব বই দেখুন <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-blue-950 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <span className="text-blue-400 font-bold text-sm uppercase tracking-widest">Why Choose Us</span>
            <h2 className="text-4xl font-black text-white mt-2 mb-3">কেন BoidorBD বেছে নেবেন?</h2>
            <p className="text-gray-400">আমরা কেন সেরা তা জানুন</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div key={i} className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1">
                <div className={`w-12 h-12 bg-gradient-to-br ${f.color} rounded-xl flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="font-black text-white mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-purple-600 font-bold text-sm uppercase tracking-widest">Testimonials</span>
            <h2 className="text-4xl font-black text-gray-900 mt-2 mb-3">শিক্ষার্থীরা কী বলছেন?</h2>
            <p className="text-gray-500">আমাদের হাজার হাজার সন্তুষ্ট শিক্ষার্থীর কথা</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-6 border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-xl">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-black text-gray-900 text-sm">{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.class}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-10 md:p-16 overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24" />
            <div className="absolute inset-0 opacity-5"
              style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
            <div className="relative z-10">
              <div className="text-5xl mb-4">🚀</div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                আজই বিনামূল্যে যোগ দিন!
              </h2>
              <p className="text-blue-100 text-lg mb-4 max-w-xl mx-auto">
                ১0,000+ শিক্ষার্থীর সাথে যোগ দিন। কোনো ক্রেডিট কার্ড লাগবে না।
              </p>
              <div className="flex flex-wrap justify-center gap-3 text-sm text-blue-200 mb-8">
                {['✅ সম্পূর্ণ বিনামূল্যে', '✅ কোনো Hidden Charge নেই', '✅ যেকোনো সময় Cancel করুন'].map((t, i) => (
                  <span key={i}>{t}</span>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-700 rounded-2xl font-black hover:bg-blue-50 transition-all shadow-xl hover:-translate-y-1">
                  ✨ বিনামূল্যে Register করুন
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/books"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/15 text-white rounded-2xl font-bold hover:bg-white/25 transition-all border border-white/30">
                  📚 বই দেখুন
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}