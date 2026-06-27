'use client';
import { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, Eye, Star, Lock } from 'lucide-react';
import api from '../lib/api';

interface Suggestion {
  id: string;
  title: string;
  content: string;
  exam_type: string;
  subject: string;
  class_level: string;
  year: string;
  is_important: boolean;
  is_premium: boolean;
  views: number;
}

const examTypes = [
  { label: 'সব', emoji: '📚', color: 'from-gray-500 to-gray-600' },
  { label: 'SSC', emoji: '📗', color: 'from-green-500 to-emerald-600' },
  { label: 'HSC', emoji: '📘', color: 'from-blue-500 to-indigo-600' },
  { label: 'Diploma', emoji: '📙', color: 'from-amber-500 to-orange-500' },
  { label: 'BCS', emoji: '📕', color: 'from-red-500 to-rose-600' },
  { label: 'Admission', emoji: '📓', color: 'from-purple-500 to-violet-600' },
];

function getSubjectColor(subject: string): string {
  const colors: Record<string, string> = {
    'বাংলা': 'bg-green-100 text-green-700',
    'English': 'bg-blue-100 text-blue-700',
    'গণিত': 'bg-purple-100 text-purple-700',
    'বিজ্ঞান': 'bg-cyan-100 text-cyan-700',
    'পদার্থবিজ্ঞান': 'bg-indigo-100 text-indigo-700',
    'রসায়ন': 'bg-pink-100 text-pink-700',
    'জীববিজ্ঞান': 'bg-emerald-100 text-emerald-700',
  };
  return colors[subject] || 'bg-gray-100 text-gray-600';
}

interface SuggestionCardProps {
  s: Suggestion;
  selected: string | null;
  onToggle: (id: string) => void;
  important?: boolean;
}

function SuggestionCard({ s, selected, onToggle, important }: SuggestionCardProps) {
  const isOpen = selected === s.id;
  return (
    <div className={`bg-white rounded-2xl border overflow-hidden transition-all duration-200 hover:shadow-lg ${
      important ? 'border-yellow-200 hover:border-yellow-300' : 'border-gray-100 hover:border-amber-200'
    }`}>
      <div className="flex">
        <div className={`w-1.5 flex-shrink-0 ${important ? 'bg-gradient-to-b from-yellow-400 to-orange-500' : 'bg-gradient-to-b from-amber-400 to-amber-500'}`} />
        <div className="flex-1">
          <div onClick={() => onToggle(s.id)} className="p-5 cursor-pointer flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-2">
                {s.exam_type && (
                  <span className="bg-amber-100 text-amber-700 text-xs px-2.5 py-0.5 rounded-full font-bold">{s.exam_type}</span>
                )}
                {s.subject && (
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${getSubjectColor(s.subject)}`}>
                    {s.subject}
                  </span>
                )}
                {s.year && (
                  <span className="bg-gray-100 text-gray-500 text-xs px-2.5 py-0.5 rounded-full font-semibold">{s.year}</span>
                )}
                {s.is_premium && (
                  <span className="bg-yellow-100 text-yellow-700 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Premium
                  </span>
                )}
              </div>
              <h3 className="font-bold text-gray-900 leading-snug">{s.title}</h3>
              {s.views > 0 && (
                <div className="flex items-center gap-1 text-gray-400 text-xs mt-1.5">
                  <Eye className="w-3 h-3" />
                  <span>{s.views} বার দেখা হয়েছে</span>
                </div>
              )}
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
              isOpen ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-400'
            }`}>
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>

          {isOpen && (
            <div className="px-5 pb-5">
              <div className="border-t border-gray-100 pt-4">
                {s.is_premium ? (
                  <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-6 text-center">
                    <Lock className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
                    <p className="font-black text-yellow-800 text-lg mb-1">Premium Content</p>
                    <p className="text-yellow-600 text-sm">এই সাজেশনটি দেখতে Premium Member হন</p>
                  </div>
                ) : s.content ? (
                  <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
                    <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm font-medium">
                      {s.content}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-2xl p-5 text-center text-gray-400">
                    <p className="text-sm">এই সাজেশনের বিস্তারিত content শীঘ্রই যোগ হবে।</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ExamPrepPage() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [examType, setExamType] = useState('সব');
  const [selected, setSelected] = useState<string | null>(null);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      let url = '/api/suggestions?limit=20';
      if (search) url += `&search=${search}`;
      if (examType !== 'সব') url += `&exam_type=${examType}`;
      const res = await api.get(url);
      setSuggestions(res.data.suggestions || []);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSuggestions(); }, [examType]);

  const important = suggestions.filter(s => s.is_important);
  const normal = suggestions.filter(s => !s.is_important);

  return (
    <div className="min-h-screen bg-[#fffbf0]">

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1a0a00] via-[#2d1500] to-[#1a0800] pt-24 pb-16 px-4">
        <div className="absolute top-10 left-10 w-72 h-72 bg-amber-500 rounded-full filter blur-[120px] opacity-15 animate-pulse" />
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-orange-500 rounded-full filter blur-[120px] opacity-10 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-white/20">
            📝 পরীক্ষার প্রস্তুতি
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
            পরীক্ষার <span className="bg-gradient-to-r from-yellow-300 to-amber-300 bg-clip-text text-transparent">সাজেশন</span>
          </h1>
          <p className="text-amber-200 mb-8 text-lg">অভিজ্ঞ শিক্ষকদের তৈরি গুরুত্বপূর্ণ সাজেশন</p>

          <form onSubmit={e => { e.preventDefault(); fetchSuggestions(); }} className="flex gap-3 max-w-2xl">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="সাজেশন খুঁজুন..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-0 focus:outline-none text-gray-800 placeholder-gray-400 bg-white text-sm shadow-xl" />
            </div>
            <button type="submit" className="px-6 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-bold transition-colors shadow-xl shadow-amber-500/30">
              খুঁজুন
            </button>
          </form>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none">
            <path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 28C1200 25 1320 20 1380 17L1440 15V60H0Z" fill="#fffbf0" />
          </svg>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Filter */}
        <div className="flex gap-3 flex-wrap mb-8">
          {examTypes.map(type => (
            <button key={type.label} onClick={() => setExamType(type.label)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-200 ${
                examType === type.label
                  ? `bg-gradient-to-r ${type.color} text-white shadow-lg scale-105`
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}>
              {type.emoji} {type.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl h-24 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : suggestions.length > 0 ? (
          <div className="space-y-8 pb-10">
            {important.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <h2 className="font-black text-gray-900 text-lg">গুরুত্বপূর্ণ সাজেশন</h2>
                  <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-bold">{important.length}টি</span>
                </div>
                <div className="space-y-3">
                  {important.map(s => (
                    <SuggestionCard key={s.id} s={s} selected={selected} onToggle={setSelected} important />
                  ))}
                </div>
              </div>
            )}
            {normal.length > 0 && (
              <div>
                {important.length > 0 && (
                  <h2 className="font-black text-gray-900 text-lg mb-4">অন্যান্য সাজেশন</h2>
                )}
                <div className="space-y-3">
                  {normal.map(s => (
                    <SuggestionCard key={s.id} s={s} selected={selected} onToggle={setSelected} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="text-7xl mb-4">📭</div>
            <p className="text-xl font-bold text-gray-700 mb-2">কোনো সাজেশন পাওয়া যায়নি</p>
            <p className="text-gray-400 text-sm">অন্য category বা keyword দিয়ে চেষ্টা করুন</p>
          </div>
        )}
      </div>
    </div>
  );
}