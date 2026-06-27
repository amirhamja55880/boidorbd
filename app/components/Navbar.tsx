'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { BookOpen, Menu, X, Bell, User, LogOut, ChevronDown, Settings, LayoutDashboard } from 'lucide-react';
import api from '../lib/api';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const loadUser = () => {
    const userData = localStorage.getItem('user');
    setUser(userData ? JSON.parse(userData) : null);
  };

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await api.get('/api/notifications');
      const notifications = res.data.notifications || [];
      setUnreadCount(notifications.filter((n: any) => !n.is_read).length);
    } catch {}
  };

  useEffect(() => {
    loadUser();
    fetchUnreadCount();
    const handleAuth = () => { loadUser(); fetchUnreadCount(); };
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    window.addEventListener('storage', handleAuth);
    window.addEventListener('authChange', handleAuth);
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('storage', handleAuth);
      window.removeEventListener('authChange', handleAuth);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.cookie = 'token=; path=/; max-age=0';
    setUser(null);
    setUnreadCount(0);
    setDropdownOpen(false);
    window.dispatchEvent(new Event('authChange'));
    router.push('/');
  };

  const navLinks = [
    { href: '/books', label: 'বই', emoji: '📚' },
    { href: '/exam-prep', label: 'সাজেশন', emoji: '📝' },
    { href: '/scholarship', label: 'স্কলারশিপ', emoji: '🎓' },
    { href: '/shop', label: 'Shop', emoji: '🏪' },
    { href: '/about', label: 'আমরা', emoji: 'ℹ️' },
    { href: '/contact', label: 'যোগাযোগ', emoji: '📞' },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/98 backdrop-blur-md shadow-[0_2px_20px_rgba(0,0,0,0.08)]'
        : 'bg-white/95 backdrop-blur-sm border-b border-gray-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-md shadow-blue-200 group-hover:shadow-blue-300 transition-shadow">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-gray-900 tracking-tight">
              Boidar<span className="text-blue-600">BD</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive(link.href)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span>{link.emoji}</span>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                {/* Bell */}
                <Link href="/notifications"
                  className="relative p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold leading-none">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 pl-3 pr-2 py-2 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-600 rounded-xl font-semibold text-sm transition-all border border-gray-200 hover:border-blue-200"
                  >
                    {/* <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-black">
                      {user.name?.[0]?.toUpperCase()}
                    </div>
                    <span>{user?.avatar && (
                    <img src={user.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                    )}</span> */}
                    <div className="w-6 h-6 rounded-lg overflow-hidden flex items-center justify-center">
                    {user?.avatar ? (
                    <img src={user.avatar} alt="" className="w-full h-full object-cover" />) : (
                    <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white text-xs font-black">
                     {user.name?.[0]?.toUpperCase()}
                   </div>
                   )}
                      </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden py-1 animate-in fade-in slide-in-from-top-2 duration-150">
                      {/* User info */}
                      <div className="px-4 py-3 border-b border-gray-50">
                        <p className="font-bold text-gray-900 text-sm">{user.name}</p>
                        <p className="text-gray-400 text-xs truncate">{user.email}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold mt-1 inline-block ${
                          user.subscription_type === 'premium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {user.subscription_type === 'premium' ? '⭐ Premium' : '🆓 Free'}
                        </span>
                      </div>
                      <Link href="/dashboard" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium">
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </Link>
                      <Link href="/profile/edit" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium">
                        <Settings className="w-4 h-4" /> Profile Edit
                      </Link>
                      {user.role === 'admin' && (
                        <Link href="/admin" onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-purple-600 hover:bg-purple-50 transition-colors font-medium">
                          <User className="w-4 h-4" /> Admin Panel
                        </Link>
                      )}
                      <div className="border-t border-gray-50 mt-1">
                        <button onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors font-medium">
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/login"
                  className="px-4 py-2 text-gray-600 hover:text-blue-600 font-semibold text-sm transition-colors">
                  Login
                </Link>
                <Link href="/register"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm shadow-blue-200">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-3 border-t border-gray-100">
            {/* User info (mobile) */}
            {user && (
              <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-blue-50 rounded-xl mx-0">
                <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black">
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{user.name}</p>
                  <p className="text-gray-500 text-xs">{user.email}</p>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                    isActive(link.href)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span>{link.emoji}</span> {link.label}
                </Link>
              ))}

              <div className="border-t border-gray-100 my-2" />

              {user ? (
                <>
                  <Link href="/notifications" onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 font-medium text-sm">
                    <span className="flex items-center gap-2"><Bell className="w-4 h-4" /> Notifications</span>
                    {unreadCount > 0 && (
                      <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Link>
                  <Link href="/dashboard" onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 font-medium text-sm">
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                  <Link href="/profile/edit" onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 font-medium text-sm">
                    <Settings className="w-4 h-4" /> Profile Edit
                  </Link>
                  {user.role === 'admin' && (
                    <Link href="/admin" onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-purple-600 hover:bg-purple-50 font-medium text-sm">
                      <User className="w-4 h-4" /> Admin Panel
                    </Link>
                  )}
                  <button onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-red-500 hover:bg-red-50 font-medium text-sm w-full text-left">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 font-medium text-sm">
                    Login
                  </Link>
                  <Link href="/register" onClick={() => setIsOpen(false)}
                    className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm text-center hover:bg-blue-700 transition-colors">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}