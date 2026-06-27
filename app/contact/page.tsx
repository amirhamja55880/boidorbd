'use client';
import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import api from '../lib/api';
import toast from 'react-hot-toast';

const contactInfo = [
  {
    icon: <Mail className="w-5 h-5" />,
    label: 'Email',
    value: 'boidorbd.official@gmail.com',
    href: 'mailto:boidorbd.official@gmail.com',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: <Phone className="w-5 h-5" />,
    label: 'Phone',
    value: '01748985357',
    href: 'tel:+8801748985357',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: <MapPin className="w-5 h-5" />,
    label: 'Address',
    value: 'বাংলাদেশ',
    href: null,
    color: 'bg-red-50 text-red-500',
  },
];

const socials = [
  {
    icon: '👍',
    label: 'Facebook',
    href: 'https://facebook.com/boidorbd',
    color: 'bg-blue-600 hover:bg-blue-700',
  },
  {
    icon: '▶️',
    label: 'YouTube',
    href: 'https://youtube.com/@boidorbd',
    color: 'bg-red-600 hover:bg-red-700',
  },
  {
    icon: '💬',
    label: 'WhatsApp',
    href: 'https://wa.me/8801748985357',
    color: 'bg-green-500 hover:bg-green-600',
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('নাম, Email এবং বার্তা দিন!');
      return;
    }
    setSending(true);
    try {
      await api.post('/api/contact', form);
      toast.success('বার্তা পাঠানো হয়েছে! আমরা শীঘ্রই যোগাযোগ করব।');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      window.location.href = `mailto:boidorbd.official@gmail.com?subject=${encodeURIComponent(form.subject || 'Contact from ' + form.name)}&body=${encodeURIComponent(`নাম: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n\n${form.message}`)}`;
      toast.success('Email app খুলছে...');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 pt-24 pb-20 px-4">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Mail className="w-4 h-4" /> যোগাযোগ করুন
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            আমাদের সাথে <span className="text-yellow-300">কথা বলুন</span>
          </h1>
          <p className="text-emerald-100 text-lg">
            যেকোনো প্রশ্ন, সমস্যা বা পরামর্শের জন্য আমরা সবসময় প্রস্তুত।
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-10">

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-6">বার্তা পাঠান</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  আপনার নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="আপনার পুরো নাম"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="আপনার Email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
                />
              </div>

              {/* ✅ নতুন Phone Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">বিষয়</label>
                <input
                  type="text"
                  placeholder="বার্তার বিষয়"
                  value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  বার্তা <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="আপনার বার্তা লিখুন..."
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md shadow-emerald-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {sending ? 'পাঠানো হচ্ছে...' : 'বার্তা পাঠান'}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-6">যোগাযোগের তথ্য</h2>
            <div className="space-y-4 mb-8">
              {contactInfo.map((info, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                  <div className={`w-10 h-10 ${info.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    {info.icon}
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">{info.label}</p>
                    {info.href ? (
                      <a href={info.href} className="font-semibold text-gray-800 hover:text-emerald-600 transition-colors">
                        {info.value}
                      </a>
                    ) : (
                      <p className="font-semibold text-gray-800">{info.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social Media */}
            <div>
              <h3 className="font-black text-gray-900 mb-4">সোশ্যাল মিডিয়া</h3>
              <div className="flex gap-3 flex-wrap">
                {socials.map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-4 py-2.5 ${social.color} text-white rounded-xl font-semibold text-sm transition-colors`}
                  >
                    <span>{social.icon}</span>
                    {social.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Response Time */}
            <div className="mt-8 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-100">
              <h3 className="font-bold text-gray-900 mb-2">⏰ Response Time</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Email</span>
                  <span className="font-semibold text-emerald-600">২৪ ঘণ্টার মধ্যে</span>
                </div>
                <div className="flex justify-between">
                  <span>Facebook</span>
                  <span className="font-semibold text-emerald-600">২-৪ ঘণ্টা</span>
                </div>
                <div className="flex justify-between">
                  <span>WhatsApp</span>
                  <span className="font-semibold text-emerald-600">১-২ ঘণ্টা</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}