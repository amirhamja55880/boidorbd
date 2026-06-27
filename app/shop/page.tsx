'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Heart, Star, Zap, ArrowRight, Search } from 'lucide-react';
import ShopNavbar from './components/ShopNavbar';
import { useShop, Product } from '../context/ShopContext';
import toast from 'react-hot-toast';

const demoProducts: Product[] = [
  { id: '1', name: 'SSC Physics গাইড ২০২৫', price: 250, original_price: 350, category: 'বই', emoji: '📗', rating: 4.8, reviews: 124, in_stock: true, is_featured: true, discount_percent: 29 },
  { id: '2', name: 'HSC Chemistry Special', price: 320, original_price: 400, category: 'বই', emoji: '📘', rating: 4.6, reviews: 89, in_stock: true, is_new: true },
  { id: '3', name: 'BCS Preparation Guide', price: 450, original_price: 600, category: 'বই', emoji: '📕', rating: 4.9, reviews: 256, in_stock: true, is_featured: true, discount_percent: 25 },
  { id: '4', name: 'Premium School Bag', price: 850, original_price: 1200, category: 'ব্যাগ', emoji: '🎒', rating: 4.5, reviews: 67, in_stock: true, discount_percent: 29 },
  { id: '5', name: 'Pilot Fountain Pen Set', price: 180, original_price: 250, category: 'Stationery', emoji: '✒️', rating: 4.7, reviews: 143, in_stock: true, is_new: true },
  { id: '6', name: 'Scientific Calculator FX-991', price: 650, original_price: 800, category: 'Electronics', emoji: '🔢', rating: 4.8, reviews: 201, in_stock: true, is_featured: true },
  { id: '7', name: 'A4 Notebook Pack (5pcs)', price: 120, original_price: 150, category: 'Stationery', emoji: '📓', rating: 4.3, reviews: 312, in_stock: true },
  { id: '8', name: 'Admission Test Guide 2025', price: 380, original_price: 500, category: 'বই', emoji: '📒', rating: 4.7, reviews: 178, in_stock: true, is_new: true },
  { id: '9', name: 'Study Desk Lamp LED', price: 550, original_price: 750, category: 'Electronics', emoji: '💡', rating: 4.6, reviews: 92, in_stock: true },
  { id: '10', name: 'School Uniform Set', price: 680, original_price: 900, category: 'পোশাক', emoji: '👕', rating: 4.4, reviews: 55, in_stock: true, discount_percent: 24 },
  { id: '11', name: 'Flash Cards — English Vocab', price: 95, original_price: 120, category: 'Study Materials', emoji: '🃏', rating: 4.5, reviews: 88, in_stock: true, is_new: true },
  { id: '12', name: 'Geometry Box Premium', price: 145, original_price: 180, category: 'Stationery', emoji: '📐', rating: 4.2, reviews: 134, in_stock: true },
];

const categories = [
  { label: 'সব', emoji: '🏪' },
  { label: 'বই', emoji: '📚' },
  { label: 'Stationery', emoji: '✏️' },
  { label: 'ব্যাগ', emoji: '🎒' },
  { label: 'পোশাক', emoji: '👕' },
  { label: 'Electronics', emoji: '💻' },
  { label: 'Study Materials', emoji: '🖊️' },
];

function FlashSaleTimer() {
  const [time, setTime] = useState({ h: 5, m: 30, s: 0 });
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return { h: 5, m: 30, s: 0 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    <div className="flex items-center gap-1.5">
      {[pad(time.h), pad(time.m), pad(time.s)].map((t, i) => (
        <span key={i} className="flex items-center gap-1">
          <span className="bg-gray-900 text-white font-black text-sm px-2 py-1 rounded-lg min-w-[2rem] text-center tabular-nums">
            {t}
          </span>
          {i < 2 && <span className="text-white font-black">:</span>}
        </span>
      ))}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isInWishlist, isInCart } = useShop();
  const inWishlist = isInWishlist(product.id);
  const inCart = isInCart(product.id);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Image */}
      <div className="relative h-44 bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.discount_percent && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-black">-{product.discount_percent}%</span>
          )}
          {product.is_new && (
            <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-black">NEW</span>
          )}
        </div>
        {/* Wishlist */}
        <button onClick={() => toggleWishlist(product)}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm ${
            inWishlist ? 'bg-pink-500 text-white' : 'bg-white text-gray-400 hover:text-pink-500'
          }`}>
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-white' : ''}`} />
        </button>
        <span className="text-6xl group-hover:scale-110 transition-transform duration-300">{product.emoji}</span>
        {/* Quick add overlay */}
        {product.in_stock && (
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
            <button onClick={() => { addToCart(product); toast.success('Cart এ যোগ হয়েছে! 🛒'); }}
              className="bg-orange-500 text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-orange-600 transition-colors transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200 shadow-lg">
              + Cart এ যোগ করুন
            </button>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-orange-500 text-xs font-semibold mb-1">{product.category}</p>
        <h3 className="text-gray-900 font-bold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-orange-500 transition-colors">
          {product.name}
        </h3>
        {product.rating && (
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-gray-700 text-xs font-bold">{product.rating}</span>
            <span className="text-gray-400 text-xs">({product.reviews})</span>
          </div>
        )}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-orange-500 font-black text-lg">৳{product.price}</span>
          {product.original_price && (
            <span className="text-gray-400 line-through text-xs">৳{product.original_price}</span>
          )}
        </div>
        <button
          onClick={() => { addToCart(product); toast.success('Cart এ যোগ হয়েছে! 🛒'); }}
          disabled={!product.in_stock}
          className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            inCart
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : product.in_stock
                ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-sm'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}>
          <ShoppingCart className="w-4 h-4" />
          {inCart ? '✓ Cart এ আছে' : product.in_stock ? 'Cart এ যোগ করুন' : 'Stock নেই'}
        </button>
      </div>
    </div>
  );
}

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState('সব');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = demoProducts.filter(p => {
    const matchCategory = selectedCategory === 'সব' || p.category === selectedCategory;
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const featured = demoProducts.filter(p => p.is_featured);
  const newArrivals = demoProducts.filter(p => p.is_new);

  return (
    <div className="min-h-screen bg-gray-50">
      <ShopNavbar onSearch={setSearchQuery} />

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 pt-20 pb-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <Zap className="w-4 h-4 text-yellow-300" /> বাংলাদেশের সেরা Educational Store
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-3 leading-tight">
                সেরা পণ্য,<br />
                <span className="text-yellow-300">সেরা দামে!</span>
              </h1>
              <p className="text-orange-100 mb-6">বই, Stationery, Electronics সহ সব শিক্ষা উপকরণ এক জায়গায়।</p>
              <Link href="#products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-orange-600 rounded-xl font-black hover:bg-orange-50 transition-all shadow-lg">
                🛍️ কেনাকাটা শুরু করুন <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: '📦', label: 'মোট পণ্য', value: '৫০০+' },
                { icon: '🚚', label: 'সারাদেশে ডেলিভারি', value: '৬৪ জেলা' },
                { icon: '⭐', label: 'সন্তুষ্ট ক্রেতা', value: '১০,০০০+' },
                { icon: '💳', label: 'পেমেন্ট', value: 'bKash/Nagad' },
              ].map((s, i) => (
                <div key={i} className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
                  <div className="text-3xl mb-1">{s.icon}</div>
                  <div className="text-white font-black">{s.value}</div>
                  <div className="text-orange-100 text-xs">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Flash Sale */}
      <div className="bg-gray-900 px-4 py-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400 animate-pulse" />
            <span className="text-white font-black text-lg">⚡ FLASH SALE!</span>
            <span className="text-gray-400 text-sm">সীমিত সময়ের অফার</span>
          </div>
          <FlashSaleTimer />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Categories */}
        <div className="mb-10">
          <h2 className="text-xl font-black text-gray-900 mb-4">📂 Categories</h2>
          <div className="flex gap-3 flex-wrap">
            {categories.map(cat => (
              <button key={cat.label} onClick={() => setSelectedCategory(cat.label)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold transition-all ${
                  selectedCategory === cat.label
                    ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-500'
                }`}>
                <span>{cat.emoji}</span> {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Result */}
        {searchQuery && (
          <div className="mb-6 flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <p className="text-gray-600 text-sm">
              "<span className="font-bold text-gray-900">{searchQuery}</span>" এর জন্য {filtered.length}টি পণ্য পাওয়া গেছে
            </p>
            <button onClick={() => setSearchQuery('')} className="text-orange-500 text-sm font-bold hover:underline ml-2">
              Clear
            </button>
          </div>
        )}

        {/* Featured */}
        {!searchQuery && selectedCategory === 'সব' && (
          <div className="mb-10">
            <h2 className="text-xl font-black text-gray-900 mb-4">⭐ Featured Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {featured.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}

        {/* New Arrivals */}
        {!searchQuery && selectedCategory === 'সব' && (
          <div className="mb-10">
            <h2 className="text-xl font-black text-gray-900 mb-4">🆕 New Arrivals</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {newArrivals.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}

        {/* All Products */}
        <div id="products">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-gray-900">
              {searchQuery ? '🔍 Search Results' : selectedCategory === 'সব' ? '🛍️ সকল পণ্য' : `${categories.find(c => c.label === selectedCategory)?.emoji} ${selectedCategory}`}
            </h2>
            <span className="text-gray-400 text-sm">{filtered.length}টি পণ্য</span>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pb-10">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-xl font-bold text-gray-700 mb-2">কোনো পণ্য পাওয়া যায়নি</p>
              <p className="text-gray-400 text-sm">অন্য keyword বা category দিয়ে চেষ্টা করুন</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
