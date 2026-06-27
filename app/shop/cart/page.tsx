'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useShop();
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);

  const delivery = cartTotal > 1000 ? 0 : 60;
  const total = cartTotal + delivery - discount;

  const applyCoupon = () => {
    if (coupon.toUpperCase() === 'BOIDORBD10') {
      setDiscount(Math.floor(cartTotal * 0.1));
      toast.success('Coupon applied! ১০% ছাড় পেয়েছেন 🎉');
    } else {
      toast.error('Invalid coupon code!');
    }
  };

  if (cart.length === 0) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl mb-6">🛒</div>
        <h2 className="text-2xl font-black text-white mb-3">Cart খালি আছে!</h2>
        <p className="text-gray-500 mb-8">কিছু পণ্য যোগ করুন</p>
        <Link href="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-black hover:from-orange-600 hover:to-orange-700 transition-all">
          🛍️ কেনাকাটা শুরু করুন <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-black text-white mb-8 flex items-center gap-3">
          <ShoppingBag className="w-8 h-8 text-orange-400" /> আপনার Cart
          <span className="text-gray-400 text-lg font-normal">({cart.length}টি পণ্য)</span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 items-center hover:border-purple-500/30 transition-colors">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-900/50 to-indigo-900/50 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                  {item.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-500 text-xs font-semibold">{item.category}</p>
                  <h3 className="text-white font-bold text-sm line-clamp-1">{item.name}</h3>
                  <p className="text-orange-400 font-black mt-1">৳{item.price}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-7 h-7 bg-gray-100 text-white rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-gray-900 font-black w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-7 h-7 bg-gray-100 text-white rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-white font-black">৳{item.price * item.quantity}</p>
                  <button onClick={() => { removeFromCart(item.id); toast.success('সরানো হয়েছে'); }}
                    className="text-red-400 hover:text-red-300 transition-colors mt-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="space-y-4">
            {/* Coupon */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="text-white font-black mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4 text-orange-400" /> Coupon Code
              </h3>
              <div className="flex gap-2">
                <input type="text" placeholder="BOIDORBD10"
                  value={coupon} onChange={e => setCoupon(e.target.value)}
                  className="flex-1 px-3 py-2.5 bg-[#2D1B69]/40 border border-purple-800/50 rounded-xl text-white placeholder-purple-500 text-sm focus:outline-none focus:border-purple-500 bg-white/5" />
                <button onClick={applyCoupon}
                  className="px-4 py-2.5 bg-purple-600 text-white rounded-xl font-bold text-sm hover:bg-purple-700 transition-colors">
                  Apply
                </button>
              </div>
              {discount > 0 && <p className="text-green-400 text-xs mt-2 font-semibold">✅ ৳{discount} ছাড় পেয়েছেন!</p>}
            </div>

            {/* Price Summary */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="text-white font-black mb-4">💰 মূল্য সারসংক্ষেপ</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>সাবটোটাল ({cart.length}টি)</span>
                  <span>৳{cartTotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>ডেলিভারি চার্জ</span>
                  <span className={delivery === 0 ? 'text-green-400 font-bold' : ''}>
                    {delivery === 0 ? 'বিনামূল্যে 🎉' : `৳${delivery}`}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Coupon ছাড়</span>
                    <span>-৳{discount}</span>
                  </div>
                )}
                {cartTotal < 1000 && (
                  <p className="text-gray-400 text-xs">৳{1000 - cartTotal} বেশি কিনলে ফ্রি ডেলিভারি!</p>
                )}
                <div className="border-t border-gray-100 pt-3 flex justify-between text-white font-black text-lg">
                  <span>মোট</span>
                  <span className="text-orange-400">৳{total}</span>
                </div>
              </div>
              <Link href="/shop/checkout"
                className="mt-4 w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-black hover:from-orange-600 hover:to-orange-700 transition-all shadow-xl shadow-orange-500/20">
                Checkout করুন <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/shop" className="mt-3 w-full flex items-center justify-center gap-2 py-3 bg-purple-900/30 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors">
                ← কেনাকাটা চালিয়ে যান
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
