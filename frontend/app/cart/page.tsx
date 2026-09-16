'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  Gift,
  CheckCircle2,
  Tag,
  ArrowLeft,
} from 'lucide-react';
import { useBloomoraStore } from '@/lib/store';
import { PRODUCTS } from '@/lib/mockData';

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    deliveryFee,
    discountAmount,
    appliedCoupon,
    applyCouponCode,
    grandTotal,
    totalItemCount,
    addToCart,
  } = useBloomoraStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ msg: string; ok: boolean } | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCouponCode(couponInput);
    setCouponFeedback({ msg: res.message, ok: res.success });
    if (res.success) setCouponInput('');
  };

  const freeDeliveryThreshold = 499;
  const progressToFreeDelivery = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);

  // Recommendations: Best sellers not already in cart
  const cartProductIds = new Set(cart.map((item) => item.product.id));
  const recommendedProducts = PRODUCTS.filter((p) => !cartProductIds.has(p.id)).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-10">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-[#8B8B8B]">
        <Link href="/" className="hover:text-[#262626]">
          Home
        </Link>
        <span>/</span>
        <Link href="/catalog" className="hover:text-[#262626]">
          Gifts
        </Link>
        <span>/</span>
        <span className="text-[#262626] font-semibold">Shopping Bag</span>
      </div>

      {/* Main Cart Content */}
      {cart.length === 0 ? (
        <div className="text-center py-20 px-4 bg-white rounded-[28px] border border-[#EFE8E4] shadow-xs max-w-2xl mx-auto space-y-6">
          <div className="w-20 h-20 bg-[#FFF4F2] text-[#D98C95] rounded-full flex items-center justify-center mx-auto shadow-inner">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h1 className="font-serif-heading text-3xl font-bold text-[#262626]">
              Your Shopping Bag is Empty
            </h1>
            <p className="text-xs sm:text-sm text-[#6B6B6B] max-w-md mx-auto leading-relaxed font-sans">
              You haven’t added any gift stories yet. Explore our handcrafted bouquets, gourmet bento cakes, and luxury hampers to create a beautiful memory.
            </p>
          </div>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#262626] hover:bg-[#D98C95] text-white font-semibold rounded-full text-xs transition-colors shadow-sm"
          >
            Explore Gift Stories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#EFE8E4] pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#D98C95] mb-1">
                <Sparkles className="w-3.5 h-3.5" /> Curated Gifting Cart
              </div>
              <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#262626]">
                Shopping Bag ({totalItemCount} {totalItemCount === 1 ? 'item' : 'items'})
              </h1>
            </div>
            <Link
              href="/catalog"
              className="text-xs font-semibold text-[#8B8B8B] hover:text-[#262626] flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
            </Link>
          </div>

          {/* Free Delivery Bar */}
          <div className="bg-[#FFF8F5] p-4 sm:p-5 rounded-2xl border border-[#F1E2DD] space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#262626] flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#D98C95]" />
                {subtotal >= freeDeliveryThreshold ? (
                  <span className="text-emerald-700">Congratulations! You unlocked FREE Delivery!</span>
                ) : (
                  <span>
                    Add <strong className="text-[#D98C95]">₹{amountNeededForFreeDelivery}</strong> more for{' '}
                    <strong>FREE Delivery</strong>
                  </span>
                )}
              </span>
              <span className="font-bold text-[#8B8B8B]">{progressToFreeDelivery}%</span>
            </div>
            <div className="w-full bg-[#EFE8E4] rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#C8A46A] to-[#D98C95] h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressToFreeDelivery}%` }}
              />
            </div>
          </div>

          {/* Grid Layout: Cart Items (Left) + Order Summary (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Items List */}
            <div className="lg:col-span-8 space-y-4">
              {cart.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedPackaging || 'default'}`}
                  className="bg-white rounded-[22px] p-4 sm:p-5 border border-[#EFE8E4] shadow-xs flex flex-col sm:flex-row items-center gap-5 justify-between hover:border-[#D98C95]/40 transition-colors"
                >
                  {/* Thumbnail & Product Details */}
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <Link
                      href={`/product/${item.product.id}`}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-[#FFF8F5] shrink-0 border border-[#F1E2DD]"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#C8A46A] uppercase tracking-wider block">
                        {item.product.category.replace('-', ' ')}
                      </span>
                      <Link href={`/product/${item.product.id}`}>
                        <h3 className="font-serif-heading text-base font-bold text-[#262626] hover:text-[#D98C95] transition-colors line-clamp-1">
                          {item.product.name}
                        </h3>
                      </Link>
                      {item.selectedPackaging && (
                        <p className="text-[11px] text-[#8B8B8B] flex items-center gap-1">
                          <Gift className="w-3 h-3 text-[#D98C95]" /> {item.selectedPackaging}
                        </p>
                      )}
                      <p className="text-xs font-bold text-[#262626]">
                        ₹{item.product.price}
                        {item.product.originalPrice && (
                          <span className="text-[11px] font-normal text-[#8B8B8B] line-through ml-2">
                            ₹{item.product.originalPrice}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Quantity Stepper & Price Total */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-[#F3E8E5]">
                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-[#E8C8C1]/60 rounded-full p-1 bg-[#FFF8F5]">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#262626] hover:bg-[#FAF5F2] transition-colors shadow-2xs"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-[#262626]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#262626] hover:bg-[#FAF5F2] transition-colors shadow-2xs"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Total item amount */}
                    <div className="text-right min-w-[70px]">
                      <span className="text-sm font-bold text-[#262626]">
                        ₹{item.product.price * item.quantity}
                      </span>
                    </div>

                    {/* Trash remove button */}
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Order Summary Sidebar */}
            <div className="lg:col-span-4 bg-white rounded-[28px] p-6 sm:p-7 border border-[#EFE8E4] shadow-sm space-y-6 sticky top-24">
              <h2 className="font-serif-heading text-xl font-bold text-[#262626]">
                Order Summary
              </h2>

              {/* Promo Code Form */}
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Coupon (e.g. BLOOM100)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="w-full uppercase text-xs font-bold tracking-wider bg-[#FFF8F5] border border-[#E8C8C1]/60 rounded-full pl-9 pr-3 py-2.5 outline-none focus:border-[#D98C95]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-[#262626] text-white hover:bg-[#D98C95] text-xs font-bold rounded-full transition-colors shrink-0"
                  >
                    Apply
                  </button>
                </div>
                {couponFeedback && (
                  <p
                    className={`text-[11px] font-semibold pl-2 ${
                      couponFeedback.ok ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {couponFeedback.msg}
                  </p>
                )}
                {appliedCoupon && (
                  <div className="flex items-center justify-between text-xs bg-emerald-50 text-emerald-800 p-2.5 rounded-xl border border-emerald-200">
                    <span className="font-bold">Code {appliedCoupon.code} Applied</span>
                    <span>-{appliedCoupon.discountPercentage}%</span>
                  </div>
                )}
              </form>

              {/* Financial Calculation Breakdown */}
              <div className="space-y-3 text-xs text-[#6B6B6B] border-t border-b border-[#F3E8E5] py-4">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-semibold text-[#262626]">₹{subtotal}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Coupon Discount</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="font-semibold text-[#262626]">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-600 font-bold uppercase tracking-wider text-[10px]">
                        FREE
                      </span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Signature Gift Wrap</span>
                  <span className="text-emerald-600 font-bold uppercase tracking-wider text-[10px]">
                    INCLUDED
                  </span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <span className="text-sm font-bold text-[#262626]">Grand Total</span>
                  <span className="block text-[10px] text-[#8B8B8B]">Inclusive of all taxes</span>
                </div>
                <span className="font-serif-heading text-2xl font-bold text-[#262626]">
                  ₹{grandTotal}
                </span>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => router.push('/checkout')}
                className="w-full py-4 bg-[#262626] hover:bg-[#D98C95] text-white font-bold rounded-full text-xs transition-all shadow-md flex items-center justify-center gap-2 group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Security & Guarantees */}
              <div className="space-y-2 pt-2 border-t border-[#F3E8E5] text-[11px] text-[#8B8B8B]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Safe & Secure Encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>On-Time Hyperlocal Handover Guarantee</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Products Carousel */}
          {recommendedProducts.length > 0 && (
            <div className="pt-10 space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#C8A46A] uppercase tracking-widest">
                  Pair with a Sweet Touch
                </span>
                <h3 className="font-serif-heading text-2xl font-bold text-[#262626]">
                  Customers Also Loved
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {recommendedProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-white rounded-[22px] overflow-hidden border border-[#F3E8E5] shadow-xs flex flex-col justify-between group h-[340px]"
                  >
                    <div className="relative h-44 bg-[#FFF8F5] overflow-hidden">
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2.5 left-2.5 bg-white/90 text-[#262626] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                        {prod.category.replace('-', ' ')}
                      </span>
                    </div>

                    <div className="p-4 flex flex-col justify-between flex-grow space-y-2">
                      <div>
                        <Link href={`/product/${prod.id}`}>
                          <h4 className="font-serif-heading text-sm font-bold text-[#262626] group-hover:text-[#D98C95] transition-colors line-clamp-1">
                            {prod.name}
                          </h4>
                        </Link>
                        <p className="text-[11px] text-[#8B8B8B] line-clamp-1">{prod.subtitle}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#F3E8E5]">
                        <span className="text-sm font-bold text-[#262626]">₹{prod.price}</span>
                        <button
                          onClick={() => addToCart(prod, 1)}
                          className="px-3.5 py-1.5 bg-[#262626] hover:bg-[#D98C95] text-white text-[10px] font-bold rounded-full transition-colors flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
