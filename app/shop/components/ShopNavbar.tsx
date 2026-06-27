'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Search, Heart, ShoppingCart, Menu, X, ArrowLeft } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

const categories = ['সব', 'বই', 'Stationery', 'ব্যাগ', 'পোশাক', 'Electronics', 'Study Materials'];

export default function ShopNavbar({ onSearch }: { onSearch?: (q: string) => void }) {
  const { cartCount, wishlist } = useShop();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(search);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-4 h-16">
          {/* Back */}
          <Link href="/" className="flex items-center gap-1.5 text-gray-500 hover:text-orange-500 transition-colors text-sm font-medium flex-shrink-0">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden md:block">BoidorBD</span>
          </Link>

          {/* Logo */}
          <Link href="/shop" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center text-sm shadow-md">
              🏪
            </div>
            <span className="font-black text-gray-900 text-lg">
              Boidar<span className="text-orange-500">Shop</span>
            </span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-4 hidden md:flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="পণ্য খুঁজুন..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-orange-400 focus:bg-white transition-all"
              />
            </div>
            <button type="submit" className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm transition-colors">
              খুঁজুন
            </button>
          </form>

          {/* Right Icons */}
          <div className="flex items-center gap-2 ml-auto">
            <Link href="/shop/wishlist" className="relative p-2 text-gray-500 hover:text-pink-500 transition-colors">
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-pink-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link href="/shop/cart"
              className="relative flex items-center gap-2 px-3 py-2 bg-orange-500 text-white rounded-xl text-sm font-bold hover:bg-orange-600 transition-all shadow-sm">
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:block">Cart</span>
              {cartCount > 0 && (
                <span className="w-5 h-5 bg-white text-orange-600 text-xs rounded-full flex items-center justify-center font-black">
                  {cartCount}
                </span>
              )}
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-gray-500 hover:text-gray-700">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Category Bar Desktop */}
        <div className="hidden md:flex items-center gap-1 pb-2 overflow-x-auto">
          {categories.map(cat => (
            <Link key={cat} href={cat === 'সব' ? '/shop' : `/shop?category=${cat}`}
              className="flex-shrink-0 px-4 py-1.5 text-xs font-semibold rounded-full text-gray-600 hover:text-orange-500 hover:bg-orange-50 transition-all">
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="পণ্য খুঁজুন..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-orange-400" />
            </div>
            <button type="submit" className="px-4 py-2.5 bg-orange-500 text-white rounded-xl font-bold text-sm">
              খুঁজুন
            </button>
          </form>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <Link key={cat} href={cat === 'সব' ? '/shop' : `/shop?category=${cat}`}
                onClick={() => setMenuOpen(false)}
                className="px-3 py-1.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-orange-500 transition-all">
                {cat}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
