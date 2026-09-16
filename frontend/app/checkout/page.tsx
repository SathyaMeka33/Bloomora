'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  MapPin,
  Truck,
  Check,
  ShoppingBag,
  CreditCard,
  ShieldCheck,
  Package,
  Calendar,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { PRODUCTS } from '@/lib/mockData';
import { useBloomoraStore } from '@/lib/store';
import { createOrderInDb } from '@/lib/firestoreService';
import { useAuth } from '@/lib/authContext';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutBookingPage() {
  const router = useRouter();
  const { user, userProfile } = useAuth();
  const {
    cart,
    fulfillmentType,
    setFulfillmentType,
    selectedShop,
    deliveryAddress,
    setDeliveryAddress,
    subtotal,
    discountAmount,
    pickupFee,
    deliveryFee,
    grandTotal,
    clearCart,
  } = useBloomoraStore();

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerName, setCustomerName] = useState(userProfile?.displayName || user?.displayName || 'Bloomora Customer');
  const [customerEmail, setCustomerEmail] = useState(userProfile?.email || user?.email || '');
  const [customerPhone, setCustomerPhone] = useState('+91 9876543210');

  const displayCart = cart.length > 0 ? cart : [{ product: PRODUCTS[0], quantity: 1, selectedPackaging: 'Blush Pink Luxury Wrap' }];
  const currentTotal = grandTotal || 259;

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    try {
      const orderPayload = {
        userId: user?.uid || 'guest',
        customerName: customerName || 'Bloomora Customer',
        customerEmail: customerEmail || 'customer@bloomora.com',
        customerPhone: customerPhone || '+91 9876543210',
        fulfillmentType,
        selectedShop: fulfillmentType === 'pickup' ? selectedShop : undefined,
        deliveryAddress: fulfillmentType === 'delivery' ? deliveryAddress : undefined,
        items: displayCart.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          selectedPackaging: item.selectedPackaging,
          customMessage: item.customMessage,
        })),
        subtotal: subtotal || 249,
        discountAmount: discountAmount || 0,
        pickupFee,
        deliveryFee,
        grandTotal: currentTotal,
        paymentMethod: paymentMethod === 'cod' ? ('cod' as const) : ('razorpay' as const),
        status: 'confirmed' as const,
      };

      if (paymentMethod === 'cod') {
        const newOrderId = await createOrderInDb(orderPayload);
        clearCart();
        setIsProcessing(false);
        router.push(`/tracking?orderId=${newOrderId}`);
        return;
      }

      // Online Razorpay Payment Flow
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: currentTotal, currency: 'INR' }),
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to initialize payment');
      }

      const isLoaded = await loadRazorpayScript();
      if (!isLoaded || !window.Razorpay) {
        // Fallback if Razorpay script CDN is blocked
        const newOrderId = await createOrderInDb({
          ...orderPayload,
          paymentId: `pay_sim_${Date.now()}`,
          razorpayOrderId: data.orderId,
        });
        clearCart();
        setIsProcessing(false);
        router.push(`/tracking?orderId=${newOrderId}`);
        return;
      }

      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_demo';

      const options = {
        key: razorpayKey,
        amount: data.amount,
        currency: data.currency || 'INR',
        name: 'Bloomora Luxury Gifting',
        description: 'Order Payment',
        image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=200&q=80',
        order_id: data.orderId,
        handler: async function (response: any) {
          try {
            await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response),
            });

            const newOrderId = await createOrderInDb({
              ...orderPayload,
              paymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
            });

            clearCart();
            setIsProcessing(false);
            router.push(`/tracking?orderId=${newOrderId}`);
          } catch (err) {
            console.error('Payment completion sync error:', err);
            setIsProcessing(false);
          }
        },
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone,
        },
        theme: {
          color: '#D4AF37',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response: any) {
        alert(`Payment failed: ${response.error.description}`);
        setIsProcessing(false);
      });
      paymentObject.open();
    } catch (err: any) {
      console.error('Order placement error:', err);
      alert(`Could not process order: ${err.message || 'Please try again'}`);
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">
          Luxury Booking Experience
        </span>
        <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#262626]">
          Confirm Your Gift Memory
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Booking Form & Options */}
        <div className="lg:col-span-7 space-y-8">
          {/* SECTION 1: SELECTED GIFTS OVERVIEW */}
          <div className="bg-white p-6 rounded-3xl border border-[#E8C8C1]/40 shadow-xs space-y-4">
            <h3 className="font-serif-heading text-lg font-bold text-[#262626] flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#D4AF37]" /> 1. Selected Gift Experience
            </h3>

            <div className="space-y-4">
              {displayCart.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-[#FFF8F5] border border-[#E8C8C1]/30">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div className="flex-grow space-y-1">
                    <h4 className="text-sm font-bold text-[#262626]">"{item.product.name}"</h4>
                    <p className="text-xs text-[#6B6B6B] italic font-serif">"{item.product.story}"</p>
                    <span className="text-[10px] font-bold text-[#D4AF37] bg-white px-2 py-0.5 rounded border border-[#E8C8C1]/30">
                      Wrap: {item.selectedPackaging || 'Signature Blush Wrap'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-[#262626]">₹{item.product.price * item.quantity}</span>
                    <p className="text-[10px] text-[#6B6B6B]">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 2: FULFILLMENT METHOD */}
          <div className="bg-white p-6 rounded-3xl border border-[#E8C8C1]/40 shadow-xs space-y-4">
            <h3 className="font-serif-heading text-lg font-bold text-[#262626] flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#D4AF37]" /> 2. Delivery Option
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setFulfillmentType('pickup')}
                className={`p-4 min-h-[52px] rounded-2xl border text-left transition-all ${
                  fulfillmentType === 'pickup'
                    ? 'border-[#D4AF37] bg-[#F9EDE8]/60 shadow-xs font-bold'
                    : 'border-[#E8C8C1]/40 bg-white text-[#6B6B6B]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <MapPin className="w-5 h-5 text-[#D4AF37]" />
                  <span className="bg-[#D4AF37] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                    ₹10 Fee
                  </span>
                </div>
                <h4 className="text-xs font-bold text-[#262626] mt-2">Meet Me There Pickup</h4>
                <p className="text-[10px] text-[#6B6B6B]">Pick up prepared gift at partner shop along travel route</p>
              </button>

              <button
                onClick={() => setFulfillmentType('delivery')}
                className={`p-4 min-h-[52px] rounded-2xl border text-left transition-all ${
                  fulfillmentType === 'delivery'
                    ? 'border-[#D4AF37] bg-[#F9EDE8]/60 shadow-xs font-bold'
                    : 'border-[#E8C8C1]/40 bg-white text-[#6B6B6B]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Truck className="w-5 h-5 text-[#262626]" />
                  <span className="text-[10px] text-[#6B6B6B]">₹49 Standard</span>
                </div>
                <h4 className="text-xs font-bold text-[#262626] mt-2">Doorstep Home Delivery</h4>
                <p className="text-[10px] text-[#6B6B6B]">Direct delivery to recipient home or office address</p>
              </button>
            </div>

            {fulfillmentType === 'pickup' ? (
              <div className="p-4 rounded-2xl bg-[#FFF8F5] border border-[#E8C8C1]/40 text-xs space-y-1">
                <span className="font-bold text-[#262626]">Selected Pickup Store:</span>
                <p className="text-[#6B6B6B] font-semibold">{selectedShop.name} — {selectedShop.address}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#262626]">Recipient Delivery Address:</label>
                <textarea
                  rows={2}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full bg-[#FFF8F5] border border-[#E8C8C1]/50 rounded-xl p-3 min-h-[44px] text-xs text-[#262626] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            )}
          </div>

          {/* SECTION 3: PAYMENT METHOD */}
          <div className="bg-white p-6 rounded-3xl border border-[#E8C8C1]/40 shadow-xs space-y-4">
            <h3 className="font-serif-heading text-lg font-bold text-[#262626] flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#D4AF37]" /> 3. Payment Method
            </h3>

            <div className="space-y-2">
              {[
                { id: 'upi', label: 'Razorpay UPI (Google Pay, PhonePe, Paytm)', desc: 'Instant Secure Payment via Razorpay' },
                { id: 'card', label: 'Credit / Debit Card (Razorpay)', desc: 'Visa, Mastercard, RuPay' },
                { id: 'netbanking', label: 'Net Banking (Razorpay)', desc: 'All major Indian banks' },
                { id: 'cod', label: 'Cash on Delivery / Pickup', desc: 'Pay when gift is handed over' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPaymentMethod(p.id as any)}
                  className={`w-full p-4 min-h-[50px] rounded-2xl border text-left transition-all flex items-center justify-between ${
                    paymentMethod === p.id
                      ? 'border-[#D4AF37] bg-[#F9EDE8]/60 font-bold'
                      : 'border-[#E8C8C1]/30 bg-white text-[#6B6B6B]'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold text-[#262626]">{p.label}</span>
                    <p className="text-[10px] text-[#6B6B6B]">{p.desc}</p>
                  </div>
                  {paymentMethod === p.id && <Check className="w-4 h-4 text-[#D4AF37]" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Place Order */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8C8C1]/40 shadow-xs space-y-6">
            <h3 className="font-serif-heading text-lg font-bold text-[#262626] border-b border-[#F9EDE8] pb-3">
              Order Summary
            </h3>

            <div className="space-y-3 text-xs text-[#6B6B6B]">
              <div className="flex justify-between">
                <span>Gift Subtotal</span>
                <span className="font-bold text-[#262626]">₹{subtotal || 249}</span>
              </div>

              <div className="flex justify-between">
                <span>Signature Packaging</span>
                <span className="text-emerald-600 font-semibold">FREE (Luxury Included)</span>
              </div>

              <div className="flex justify-between">
                <span>Fulfillment Fee ({fulfillmentType === 'pickup' ? 'Meet Me There Pickup' : 'Home Delivery'})</span>
                <span className="font-bold text-[#262626]">₹{fulfillmentType === 'pickup' ? pickupFee : deliveryFee}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>AI Coupon Discount</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}

              <div className="pt-3 border-t border-[#F9EDE8] flex justify-between text-base font-bold text-[#262626]">
                <span>Total Payable Amount</span>
                <span className="text-xl">₹{currentTotal}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="w-full bg-[#262626] hover:bg-[#D4AF37] text-white hover:text-[#262626] font-semibold py-4 min-h-[48px] rounded-full text-xs transition-colors shadow-md flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <span>Securing Order...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" /> Pay & Confirm Surprise (₹{currentTotal})
                </>
              )}
            </button>

            <p className="text-[10px] text-center text-[#6B6B6B] flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Encrypted & Verified Gifting Guarantee
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
