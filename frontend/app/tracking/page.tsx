'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Sparkles,
  MapPin,
  CheckCircle2,
  Clock,
  Package,
  Phone,
  ArrowRight,
  ShieldCheck,
  Gift,
  Truck,
} from 'lucide-react';
import { PARTNER_SHOPS } from '@/lib/mockData';
import { getOrderById, OrderData } from '@/lib/firestoreService';

function TrackingContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'BLOOM-8921';

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(2); // 0: Preparing, 1: Wrapping, 2: Partner Ready, 3: Out for Delivery, 4: Delivered

  useEffect(() => {
    getOrderById(orderId).then((data) => {
      if (data) {
        setOrder(data);
        if (data.status === 'confirmed') setCurrentStep(0);
        else if (data.status === 'preparing') setCurrentStep(1);
        else if (data.status === 'ready_for_pickup') setCurrentStep(2);
        else if (data.status === 'out_for_delivery') setCurrentStep(3);
        else if (data.status === 'delivered') setCurrentStep(4);
      }
      setLoading(false);
    });
  }, [orderId]);

  const timelineSteps = [
    { label: 'Preparing', desc: 'Handpicking fresh roses & chocolates', icon: Gift },
    { label: 'Wrapping', desc: 'Crafting signature blush velvet wrap', icon: Package },
    { label: 'Partner Ready', desc: 'Stored safely at partner hub locker', icon: MapPin },
    { label: 'Out for Delivery', desc: 'Driver en route with delicate care', icon: Truck },
    { label: 'Delivered', desc: 'Surprise memory successfully delivered!', icon: CheckCircle2 },
  ];

  const shopDetails = order?.selectedShop || PARTNER_SHOPS[0];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Order Status Banner */}
      <div className="bg-[#262626] text-white rounded-3xl p-6 sm:p-10 border border-[#D4AF37]/40 shadow-sm space-y-4 text-center">
        <div className="inline-flex items-center gap-2 bg-[#D4AF37] text-[#262626] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> Live Firestore Order Tracking
        </div>

        <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold">
          Order #{orderId}
        </h1>

        <p className="text-xs sm:text-sm text-gray-300">
          Estimated Pickup / Delivery Time: <strong className="text-[#D4AF37]">Today by 6:30 PM</strong>
        </p>

        {order && (
          <div className="pt-2 text-xs text-gray-300">
            <span>Customer: <strong>{order.customerName}</strong></span> • <span>Payment Method: <strong>{order.paymentMethod.toUpperCase()}</strong></span>
          </div>
        )}
      </div>

      {/* Animated Step Timeline */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8C8C1]/40 shadow-xs space-y-8">
        <h3 className="font-serif-heading text-xl font-bold text-[#262626]">
          Real-Time Progress Timeline
        </h3>

        <div className="relative border-l-2 border-[#E8C8C1]/40 ml-4 sm:ml-6 space-y-8">
          {timelineSteps.map((step, idx) => {
            const isCompleted = idx <= currentStep;
            const isCurrent = idx === currentStep;
            const IconComp = step.icon;

            return (
              <div key={step.label} className="relative pl-8 sm:pl-10">
                {/* Node indicator */}
                <div
                  className={`absolute -left-[17px] top-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-[#262626] text-[#D4AF37] border-2 border-[#D4AF37]'
                      : 'bg-white text-gray-400 border-2 border-gray-200'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className={`text-sm font-bold ${isCompleted ? 'text-[#262626]' : 'text-gray-400'}`}>
                      {step.label}
                    </h4>
                    {isCurrent && (
                      <span className="bg-[#F9EDE8] text-[#D4AF37] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                        In Progress
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#6B6B6B]">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Meet Me There Secret Pickup PIN (If Meet Me There) */}
      <div className="bg-[#FFF8F5] p-6 rounded-3xl border border-[#E8C8C1]/50 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#F9EDE8] text-[#D4AF37] flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#262626]">Destination Pickup Hub</h4>
            <p className="text-xs text-[#6B6B6B]">{shopDetails.name} — {shopDetails.address}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8C8C1]/30 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#6B6B6B] uppercase font-bold">Your Secret Locker PIN</span>
            <p className="text-2xl font-mono font-bold tracking-widest text-[#262626]">7842</p>
          </div>
          <span className="bg-[#F9EDE8] text-[#D4AF37] text-xs font-bold px-3 py-1 rounded-full">
            ₹10 Pickup Fee Paid
          </span>
        </div>
      </div>

      <div className="text-center pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#262626] hover:bg-[#D4AF37] text-white hover:text-[#262626] font-semibold px-8 py-3.5 rounded-full text-xs transition-colors"
        >
          Return to Home <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-xs text-gray-400">Loading order tracking...</div>}>
      <TrackingContent />
    </Suspense>
  );
}
