'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BookOpen, LayoutDashboard, BookMarked, ShoppingCart, Users, FileText, GraduationCap, Bell, LogOut } from 'lucide-react';

const navItems = [
  { href: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
  { href: '/admin/books', icon: <BookMarked className="w-5 h-5" />, label: 'Books' },
  { href: '/admin/orders', icon: <ShoppingCart className="w-5 h-5" />, label: 'Orders' },
  { href: '/admin/users', icon: <Users className="w-5 h-5" />, label: 'Users' },
  { href: '/admin/suggestions', icon: <FileText className="w-5 h-5" />, label: 'Suggestions' },
  { href: '/admin/scholarships', icon: <GraduationCap className="w-5 h-5" />, label: 'Scholarships' },
  { href: '/admin/notifications', icon: <Bell className="w-5 h-5" />, label: 'Notifications' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/admin');
  };

  return (
    <aside className="w-64 min-h-screen bg-gray-900 border-r border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-black text-white text-sm">BoidorBD</p>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(item => (
          <Link key={item.href} href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
              pathname === item.href
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}>
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-800">
        <button onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all w-full">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}