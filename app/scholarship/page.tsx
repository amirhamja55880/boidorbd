'use client';
import { useState, useEffect } from 'react';
import { Search, ExternalLink, Clock, AlertCircle } from 'lucide-react';
import api from '../lib/api';

interface Scholarship {
  id: string;
  title: string;
  country: string;
  university: string;
  level: string;
  amount: string;
  scholarship_type: string;
  deadline: string;
  application_link: string;
}

const countries = [
  { label: 'সব', flag: '🌍' },
  { label: 'Japan', flag: '🇯🇵' },
  { label: 'UK', flag: '🇬🇧' },
  { label: 'USA', flag: '🇺🇸' },
  { label: 'Turkey', flag: '🇹🇷' },
  { label: 'Australia', flag: '🇦🇺' },
  { label: 'China', flag: '🇨🇳' },
  { label: 'Canada', flag: '🇨🇦' },
];

const levelColors: Record<string, string> = {
  'Bachelor': 'bg-blue-100 text-blue-700',
  'Masters': 'bg-purple-100 text-purple-700',
  'PhD': 'bg-red-100 text-red-700',
  'Diploma': 'bg-amber-100 text-amber-700',
};

function getDaysLeft(deadline: string) {
  if (!deadline) return null;
  const diff = new Date(deadline).getTime() - new Date().getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getCountryFlag(country: string) {
  return countries.find(c => c.label === country)?.flag || '🌍';
}

export default function ScholarshipPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('সব');

  const fetchScholarships = async () => {
    setLoading(true);
    try {
      let url = '/api/scholarships?limit=20';
      if (search) url += `&search=${search}`;
      if (country !== 'সব') url += `&country=${country}`;
      const res = await api.get(url);
      setScholarships(res.data.scholarships || []);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchScholarships(); }, [country]);

  const active = scholarships.filter(s => getDaysLeft(s.deadline) === null || getDaysLeft(s.deadline)! > 0);
  const expired = scholarships.filter(s => getDaysLeft(s.deadline) !== null && getDaysLeft(s.deadline)! <= 0);

  return (
    <div className="min-h-screen bg-[#f0fff8]">

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#001a0d] via-[#002d1a] to-[#001a10] pt-24 pb-16 px-4">
        <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-500 rounded-full filter blur-[120px] opacity-15 animate-pulse" />
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-green-500 rounded-full filter blur-[120px] opacity-10 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-white/20">
            🎓 স্কলারশিপ গাইড
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
            স্বপ্নের <span className="bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">স্কলারশিপ</span> খুঁজুন
          </h1>
          <p className="text-emerald-200 mb-8 text-lg">দেশে ও বিদেশে সেরা স্কলারশিপের সম্পূর্ণ গাইড</p>

          <form onSubmit={e => { e.preventDefault(); fetchScholarships(); }} className="flex gap-3 max-w-2xl">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="দেশ, বিশ্ববিদ্যালয় বা স্কলারশিপ খুঁজুন..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-0 focus:outline-none text-gray-800 placeholder-gray-400 bg-white text-sm shadow-xl" />
            </div>
            <button type="submit" className="px-6 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold transition-colors shadow-xl shadow-emerald-500/30">
              খুঁজুন
            </button>
          </form>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none">
            <path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 28C1200 25 1320 20 1380 17L1440 15V60H0Z" fill="#f0fff8" />
          </svg>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Country Filter */}
        <div className="flex gap-3 flex-wrap mb-8">
          {countries.map(c => (
            <button key={c.label} onClick={() => setCountry(c.label)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all duration-200 ${
                country === c.label
                  ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}>
              <span className="text-base">{c.flag}</span> {c.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl h-56 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : scholarships.length > 0 ? (
          <div className="space-y-10 pb-10">

            {/* Active Scholarships */}
            {active.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <h2 className="font-black text-gray-900 text-xl">সক্রিয় স্কলারশিপ</h2>
                  <span className="bg-green-100 text-green-700 text-xs px-2.5 py-0.5 rounded-full font-bold">{active.length}টি</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {active.map(s => <ScholarshipCard key={s.id} s={s} />)}
                </div>
              </div>
            )}

            {/* Expired Scholarships */}
            {expired.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <AlertCircle className="w-5 h-5 text-gray-400" />
                  <h2 className="font-black text-gray-500 text-xl">শেষ হয়ে গেছে</h2>
                  <span className="bg-gray-100 text-gray-500 text-xs px-2.5 py-0.5 rounded-full font-bold">{expired.length}টি</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 opacity-60">
                  {expired.map(s => <ScholarshipCard key={s.id} s={s} expired />)}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="text-7xl mb-4">🎓</div>
            <p className="text-xl font-bold text-gray-700 mb-2">কোনো স্কলারশিপ পাওয়া যায়নি</p>
            <p className="text-gray-400 text-sm">অন্য দেশ বা keyword দিয়ে চেষ্টা করুন</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ScholarshipCard({ s, expired }: { s: Scholarship, expired?: boolean }) {
  const daysLeft = getDaysLeft(s.deadline);
  const flag = getCountryFlag(s.country);

  return (
    <div className={`bg-white rounded-3xl border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
      expired ? 'border-gray-200 grayscale' : 'border-gray-100 hover:border-emerald-200'
    }`}>
      {/* Card Header */}
      <div className={`relative p-5 pb-4 ${expired ? 'bg-gray-50' : 'bg-gradient-to-br from-emerald-50 to-green-50'}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="text-4xl">{flag}</div>
          <div className="flex flex-col items-end gap-1">
            {s.country && (
              <span className="bg-white text-gray-700 text-xs px-2.5 py-1 rounded-full font-bold border border-gray-200">
                {s.country}
              </span>
            )}
            {s.level && (
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${levelColors[s.level] || 'bg-gray-100 text-gray-600'}`}>
                {s.level}
              </span>
            )}
          </div>
        </div>
        <h3 className="font-black text-gray-900 mt-3 leading-snug text-sm line-clamp-2">{s.title}</h3>
        {s.university && <p className="text-gray-500 text-xs mt-1">🏫 {s.university}</p>}
      </div>

      {/* Card Body */}
      <div className="p-5 pt-4 space-y-2">
        {s.amount && (
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 font-black text-sm">💰 {s.amount}</span>
          </div>
        )}
        {s.scholarship_type && (
          <p className="text-gray-500 text-xs">📋 {s.scholarship_type}</p>
        )}

        {/* Deadline */}
        {s.deadline && (
          <div className={`flex items-center gap-2 text-xs font-bold rounded-xl px-3 py-2 ${
            expired
              ? 'bg-gray-100 text-gray-500'
              : daysLeft !== null && daysLeft <= 7
                ? 'bg-red-50 text-red-600'
                : daysLeft !== null && daysLeft <= 30
                  ? 'bg-orange-50 text-orange-600'
                  : 'bg-green-50 text-green-600'
          }`}>
            <Clock className="w-3.5 h-3.5" />
            {expired
              ? 'আবেদন শেষ হয়েছে'
              : daysLeft !== null
                ? daysLeft <= 0
                  ? 'শেষ হয়েছে'
                  : daysLeft === 1
                    ? '⚠️ মাত্র ১ দিন বাকি!'
                    : daysLeft <= 7
                      ? `⚠️ মাত্র ${daysLeft} দিন বাকি!`
                      : `${daysLeft} দিন বাকি আছে`
                : `Deadline: ${new Date(s.deadline).toLocaleDateString('bn-BD')}`
            }
          </div>
        )}

        {/* Apply Button */}
        {s.application_link && !expired && (
          <a href={s.application_link} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 justify-center w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl text-sm font-black hover:from-emerald-600 hover:to-green-700 transition-all shadow-md shadow-emerald-200 hover:shadow-emerald-300 mt-3">
            আবেদন করুন <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
}