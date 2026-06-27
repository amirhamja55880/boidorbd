'use client';
import Link from 'next/link';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useShop();

  if (wishlist.length === 0) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl mb-6">❤️</div>
        <h2 className="text-2xl font-black text-white mb-3">Wishlist খালি!</h2>
        <p className="text-gray-500 mb-8">পছন্দের পণ্য wishlist এ যোগ করুন</p>
        <Link href="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-black hover:from-orange-600 hover:to-orange-700 transition-all">
          🛍️ Shop এ যান
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-black text-white mb-8 flex items-center gap-3">
          <Heart className="w-8 h-8 text-pink-400 fill-pink-400" /> Wishlist
          <span className="text-gray-500 text-lg font-normal">({wishlist.length}টি)</span>
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlist.map(item => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-pink-500/30 transition-all">
              <div className="h-36 bg-gradient-to-br from-purple-900/50 to-indigo-900/50 flex items-center justify-center text-5xl relative">
                {item.emoji}
                <button onClick={() => { toggleWishlist(item); toast.success('Wishlist থেকে সরানো হয়েছে'); }}
                  className="absolute top-2 right-2 w-7 h-7 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center hover:bg-red-500/40 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="p-4">
                <p className="text-gray-500 text-xs font-semibold">{item.category}</p>
                <h3 className="text-gray-900 font-bold text-sm line-clamp-2 mt-1 mb-2">{item.name}</h3>
                <p className="text-orange-400 font-black mb-3">৳{item.price}</p>
                <button onClick={() => { addToCart(item); toast.success('Cart এ যোগ হয়েছে! 🛒'); }}
                  className="w-full py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl text-xs font-black hover:from-orange-600 hover:to-orange-700 transition-all flex items-center justify-center gap-1.5">
                  <ShoppingCart className="w-3.5 h-3.5" /> Cart এ যোগ করুন
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
