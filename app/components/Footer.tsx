import Link from 'next/link';
import { BookOpen, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & About */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black text-white">
                Boidar<span className="text-blue-400">BD</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              বাংলাদেশের সেরা শিক্ষামূলক প্ল্যাটফর্ম। বিনামূল্যে বই পড়ুন, পরীক্ষার সাজেশন পান এবং স্কলারশিপ গাইড পান।
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>boidorbd.official@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400" />
                <span>01748985357</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>বাংলাদেশ</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Quick Links</h3>
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/books" className="hover:text-blue-400 transition-colors">📚 সকল বই</Link>
              <Link href="/exam-prep" className="hover:text-blue-400 transition-colors">📝 পরীক্ষার সাজেশন</Link>
              <Link href="/scholarship" className="hover:text-blue-400 transition-colors">🎓 স্কলারশিপ গাইড</Link>
              <Link href="/about" className="hover:text-blue-400 transition-colors">ℹ️ আমাদের সম্পর্কে</Link>
              <Link href="/contact" className="hover:text-blue-400 transition-colors">📞 যোগাযোগ</Link>
              <Link href="/login" className="hover:text-blue-400 transition-colors">🔐 Login</Link>
              <Link href="/register" className="hover:text-blue-400 transition-colors">✨ Register</Link>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-bold mb-4">বিভাগ</h3>
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/books?category=SSC" className="hover:text-blue-400 transition-colors">SSC বই</Link>
              <Link href="/books?category=HSC" className="hover:text-blue-400 transition-colors">HSC বই</Link>
              <Link href="/books?category=Diploma" className="hover:text-blue-400 transition-colors">Diploma বই</Link>
              <Link href="/books?category=BCS" className="hover:text-blue-400 transition-colors">BCS গাইড</Link>
              <Link href="/books?is_free=true" className="hover:text-blue-400 transition-colors">বিনামূল্যে বই</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-500">
          <p>© 2025 BoidorBD. সর্বস্বত্ব সংরক্ষিত।</p>
        </div>
      </div>
    </footer>
  );
}