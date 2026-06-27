'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Target, Heart, Users, Star, Award, Zap, Globe, ArrowRight, CheckCircle } from 'lucide-react';

// Animated counter hook
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

const stats = [
  { label: 'সক্রিয় শিক্ষার্থী', end: 10000, suffix: '+', icon: '👨‍🎓', gradient: 'from-violet-500 to-purple-600' },
  { label: 'মোট বই', end: 500, suffix: '+', icon: '📚', gradient: 'from-blue-500 to-cyan-500' },
  { label: 'পরীক্ষার সাজেশন', end: 200, suffix: '+', icon: '📝', gradient: 'from-amber-400 to-orange-500' },
  { label: 'স্কলারশিপ গাইড', end: 100, suffix: '+', icon: '🎓', gradient: 'from-emerald-500 to-green-600' },
];

const team = [
  { name: 'Amir Hamza', role: 'Founder & CEO', emoji: '👨‍💻', desc: 'Full Stack Developer এবং শিক্ষার প্রতি অনুরাগী।', gradient: 'from-blue-500 to-indigo-600' },
  { name: 'Content Team', role: 'শিক্ষা বিশেষজ্ঞ', emoji: '✍️', desc: 'মানসম্পন্ন শিক্ষা উপকরণ তৈরিতে নিবেদিত দল।', gradient: 'from-purple-500 to-pink-600' },
  { name: 'Support Team', role: 'Customer Support', emoji: '🤝', desc: '২৪/৭ শিক্ষার্থীদের সহায়তায় সদা প্রস্তুত।', gradient: 'from-emerald-500 to-teal-600' },
];

const values = [
  { icon: <Heart className="w-5 h-5" />, title: 'শিক্ষার প্রতি ভালোবাসা', desc: 'মানসম্মত শিক্ষা সবার অধিকার।', color: 'from-red-400 to-pink-500' },
  { icon: <Zap className="w-5 h-5" />, title: 'সহজলভ্যতা', desc: 'যেকোনো ডিভাইস থেকে যেকোনো সময়।', color: 'from-yellow-400 to-amber-500' },
  { icon: <Award className="w-5 h-5" />, title: 'মানসম্পন্ন কন্টেন্ট', desc: 'অভিজ্ঞ শিক্ষকদের তত্ত্বাবধানে তৈরি।', color: 'from-blue-400 to-indigo-500' },
  { icon: <Globe className="w-5 h-5" />, title: 'সারাদেশের জন্য', desc: 'শহর থেকে গ্রাম — সবার কাছে।', color: 'from-green-400 to-emerald-500' },
];

function StatCard({ stat, index }: { stat: typeof stats[0], index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const count = useCounter(stat.end, 1800, visible);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}
      className="relative bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden group"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
      <div className={`w-14 h-14 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg`}>
        {stat.icon}
      </div>
      <p className="text-3xl font-black text-gray-900 text-center">
        {visible ? count.toLocaleString('bn-BD') : '০'}{stat.suffix}
      </p>
      <p className="text-gray-500 text-sm text-center mt-1 font-medium">{stat.label}</p>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">

      {/* ===== HERO ===== */}
      <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#050520] via-[#0a1040] to-[#150530]" />

        {/* Floating blobs — darker, behind text */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full filter blur-3xl opacity-15 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400 rounded-full filter blur-3xl opacity-15 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-400 rounded-full filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }} />

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

        {/* Floating cards */}
        <div className="absolute top-32 left-8 md:left-16 bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/20 text-white animate-bounce hidden md:block" style={{ animationDuration: '3s' }}>
          <p className="text-xs font-semibold opacity-70">নতুন বই</p>
          <p className="text-sm font-black">SSC Physics 2025 📚</p>
        </div>
        <div className="absolute top-48 right-8 md:right-16 bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/20 text-white animate-bounce hidden md:block" style={{ animationDuration: '4s', animationDelay: '1s' }}>
          <p className="text-xs font-semibold opacity-70">সাজেশন</p>
          <p className="text-sm font-black">HSC Special 🎯</p>
        </div>
        <div className="absolute bottom-40 left-12 bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/20 text-white animate-bounce hidden md:block" style={{ animationDuration: '5s', animationDelay: '0.5s' }}>
          <p className="text-xs font-semibold opacity-70">স্কলারশিপ</p>
          <p className="text-sm font-black">Deadline: July 30 🎓</p>
        </div>

        {/* Main content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center pt-20">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white px-5 py-2.5 rounded-full text-sm font-semibold mb-8 border border-white/20">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            বাংলাদেশের #১ শিক্ষামূলক প্ল্যাটফর্ম
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[1.1]">
            আমরা যারা<br />
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-300 bg-clip-text text-transparent">
                BoidorBD
              </span>
              <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 300 8">
                <path d="M0 6 Q75 0 150 4 Q225 8 300 2" stroke="#fbbf24" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            প্রতিটি শিক্ষার্থীর স্বপ্নকে বাস্তবে রূপ দিতে আমরা প্রতিদিন কাজ করে যাচ্ছি। বিনামূল্যে বই, সাজেশন এবং স্কলারশিপ গাইড — সবই এক জায়গায়।
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-700 rounded-2xl font-black text-sm hover:bg-blue-50 transition-all shadow-2xl hover:-translate-y-1 hover:shadow-white/20">
              ✨ বিনামূল্যে শুরু করুন
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/books"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/15 text-white rounded-2xl font-bold text-sm hover:bg-white/25 transition-all border border-white/30 backdrop-blur-sm">
              📚 বই দেখুন
            </Link>
          </div>

          {/* Trusted by */}
          <div className="mt-12 flex items-center justify-center gap-3">
            <div className="flex -space-x-2">
              {['🧑', '👩', '👨', '👧', '🧒'].map((e, i) => (
                <div key={i} className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full border-2 border-white flex items-center justify-center text-sm">
                  {e}
                </div>
              ))}
            </div>
            <p className="text-white/80 text-sm font-medium">
              <span className="text-white font-black">১০,০০০+</span> শিক্ষার্থী আমাদের বিশ্বাস করে
            </p>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80L60 66.7C120 53.3 240 26.7 360 20C480 13.3 600 26.7 720 33.3C840 40 960 40 1080 36.7C1200 33.3 1320 26.7 1380 23.3L1440 20V80H0Z" fill="white" />
          </svg>
        </div>
      </div>

      {/* ===== STATS ===== */}
      <div className="max-w-5xl mx-auto px-4 -mt-6 mb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => <StatCard key={i} stat={stat} index={i} />)}
        </div>
      </div>

      {/* ===== MISSION & VISION ===== */}
      <div className="max-w-5xl mx-auto px-4 mb-24">
        <div className="text-center mb-12">
          <span className="text-blue-600 font-bold text-sm uppercase tracking-widest">আমাদের উদ্দেশ্য</span>
          <h2 className="text-4xl font-black text-gray-900 mt-2">মিশন ও ভিশন</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 overflow-hidden text-white">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-10" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-5">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-black mb-4">আমাদের মিশন</h3>
              <p className="text-blue-100 leading-relaxed mb-5">
                বাংলাদেশের প্রতিটি শিক্ষার্থীর কাছে মানসম্মত শিক্ষা উপকরণ পৌঁছে দেওয়া। আর্থিক সীমাবদ্ধতা যেন কোনো শিক্ষার্থীর স্বপ্নের পথে বাধা না হয়।
              </p>
              <div className="space-y-2">
                {['বিনামূল্যে বই পড়ার সুযোগ', 'মানসম্পন্ন সাজেশন', 'স্কলারশিপ সহায়তা'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-blue-100">
                    <CheckCircle className="w-4 h-4 text-blue-300 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-8 overflow-hidden text-white">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-10" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-5">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-black mb-4">আমাদের ভিশন</h3>
              <p className="text-purple-100 leading-relaxed mb-5">
                ২০৩০ সালের মধ্যে বাংলাদেশের ১ কোটি শিক্ষার্থীর কাছে ডিজিটাল শিক্ষা পৌঁছে দেওয়া। একটি শিক্ষিত ও আলোকিত বাংলাদেশ গড়ে তোলা।
              </p>
              <div className="space-y-2">
                {['১ কোটি শিক্ষার্থী', 'সারাদেশে ডিজিটাল শিক্ষা', 'আলোকিত বাংলাদেশ'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-purple-100">
                    <CheckCircle className="w-4 h-4 text-purple-300 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== OUR STORY ===== */}
      <div className="relative bg-gradient-to-r from-gray-900 to-blue-950 py-20 px-4 mb-24 overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <span className="text-blue-400 font-bold text-sm uppercase tracking-widest">Our Story</span>
          <h2 className="text-4xl font-black text-white mt-2 mb-8">আমাদের যাত্রার গল্প</h2>
          <div className="space-y-5 text-gray-300 leading-relaxed text-left">
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0 mt-1">১</div>
              <p>২০২৪ সালে একটি ছোট্ট স্বপ্ন থেকে BoidorBD এর জন্ম। একজন তরুণ উদ্যোক্তা লক্ষ্য করেন বাংলাদেশের অনেক শিক্ষার্থী ভালো বই ও সাজেশনের অভাবে পিছিয়ে পড়ছে।</p>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0 mt-1">২</div>
              <p>সেই উপলব্ধি থেকেই শুরু হয় BoidorBD এর যাত্রা। আজ আমরা হাজার হাজার শিক্ষার্থীকে বিনামূল্যে বই, পরীক্ষার সাজেশন এবং স্কলারশিপ গাইড দিয়ে সাহায্য করছি।</p>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0 mt-1">৩</div>
              <p>আমাদের বিশ্বাস — সঠিক শিক্ষা উপকরণ পেলে বাংলাদেশের প্রতিটি শিক্ষার্থী তার স্বপ্ন পূরণ করতে পারবে। এই বিশ্বাস নিয়েই আমরা এগিয়ে যাচ্ছি।</p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== VALUES ===== */}
      <div className="max-w-5xl mx-auto px-4 mb-24">
        <div className="text-center mb-12">
          <span className="text-purple-600 font-bold text-sm uppercase tracking-widest">What We Believe</span>
          <h2 className="text-4xl font-black text-gray-900 mt-2">আমাদের মূল্যবোধ</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map((v, i) => (
            <div key={i}
              className="group relative bg-white rounded-3xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden cursor-default">
              <div className={`absolute inset-0 bg-gradient-to-br ${v.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              <div className={`w-12 h-12 bg-gradient-to-br ${v.color} rounded-2xl flex items-center justify-center text-white mb-4 shadow-md`}>
                {v.icon}
              </div>
              <h3 className="font-black text-gray-900 mb-2 text-sm">{v.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== TEAM ===== */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 py-20 px-4 mb-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-indigo-600 font-bold text-sm uppercase tracking-widest">Our Team</span>
            <h2 className="text-4xl font-black text-gray-900 mt-2">আমাদের টিম</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member, i) => (
              <div key={i}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className={`h-28 bg-gradient-to-br ${member.gradient} flex items-end justify-center pb-0 relative`}>
                  <div className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                  <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-4xl shadow-lg translate-y-10 relative z-10 border-4 border-white">
                    {member.emoji}
                  </div>
                </div>
                <div className="pt-12 pb-6 px-6 text-center">
                  <h3 className="font-black text-gray-900 text-lg">{member.name}</h3>
                  <p className={`bg-gradient-to-r ${member.gradient} bg-clip-text text-transparent font-bold text-sm mb-3`}>{member.role}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{member.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== CTA ===== */}
      <div className="max-w-4xl mx-auto px-4 pb-24">
        <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-10 md:p-16 overflow-hidden text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24" />
          <div className="relative z-10">
            <div className="text-5xl mb-4">🚀</div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">আজই শুরু করুন!</h2>
            <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
              হাজার হাজার শিক্ষার্থীর সাথে যোগ দিন এবং আপনার পড়াশোনাকে আরও সহজ করুন।
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-700 rounded-2xl font-black hover:bg-blue-50 transition-all shadow-xl hover:-translate-y-1">
                ✨ বিনামূল্যে যোগ দিন
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/15 text-white rounded-2xl font-bold hover:bg-white/25 transition-all border border-white/30">
                📞 যোগাযোগ করুন
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}