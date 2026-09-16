'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Clock, MapPin, Phone, ShieldCheck, Sparkles, Navigation, Lock } from 'lucide-react';
import { PARTNER_SHOPS } from '@/lib/mockData';

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = (params?.orderId as string) || 'BLOOM-982145';
  const shop = PARTNER_SHOPS[0];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Status Header */}
      <div className="bg-gradient-to-r from-[#1A1A1A] to-[#2A2A2A] text-white p-8 rounded-3xl border border-[#D4AF37]/40 shadow-xl space-y-4 text-center">
        <div className="inline-flex items-center gap-2 bg-[#D4AF37] text-[#1A1A1A] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> Order Status: Prepared & Pickup Ready
        </div>
        <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold">
          Order #{orderId}
        </h1>
        <p className="text-xs text-gray-300">
          Your gift has been prepared in luxury packaging and is safely kept at your destination pickup store.
        </p>
      </div>

      {/* Secret Pickup PIN Box */}
      <div className="bg-white p-8 rounded-3xl border-2 border-[#D4AF37] luxury-card-shadow text-center space-y-4">
        <span className="text-xs text-[#D4AF37] font-bold uppercase tracking-widest block">
          Show This at Store Counter / Locker
        </span>
        
        <div className="inline-block bg-[#FFF8F5] border border-[#D4AF37]/40 px-8 py-4 rounded-2xl">
          <p className="text-xs text-gray-500 font-bold uppercase mb-1">Destination Pickup Secret PIN</p>
          <p className="font-serif-heading text-5xl font-bold text-[#1A1A1A] tracking-widest">
            4892
          </p>
        </div>

        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          🔒 Keep this PIN private until you arrive at the store. Your secret PIN has also been sent via WhatsApp/SMS to your phone.
        </p>
      </div>

      {/* Destination Pickup Store Card */}
      <div className="bg-white p-6 rounded-3xl border border-[#EFE8E5] luxury-card-shadow space-y-4">
        <h3 className="font-serif-heading text-lg font-bold text-[#1A1A1A] border-b border-gray-100 pb-3 flex items-center justify-between">
          <span>Destination Partner Pickup Hub</span>
          <span className="text-xs text-emerald-600 font-sans font-bold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Ready for Pickup Now
          </span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <p className="font-bold text-[#1A1A1A] text-sm">{shop.name}</p>
            <p className="text-gray-500">{shop.address}</p>
            <p className="text-gray-500">Landmark: {shop.landmark}</p>
          </div>

          <div className="space-y-2 sm:text-right">
            <p className="font-bold text-[#D4AF37]">Open Hours: {shop.openHours}</p>
            <p className="font-semibold text-gray-700">Store Contact: {shop.phone}</p>
            <a
              href={`tel:${shop.phone}`}
              className="inline-flex items-center gap-1.5 bg-[#FFF8F5] border border-[#D4AF37]/30 text-[#8B6508] font-bold px-3 py-1.5 rounded-xl hover:bg-[#FDEFEA]"
            >
              <Phone className="w-3.5 h-3.5" /> Call Store Manager
            </a>
          </div>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="bg-white p-6 rounded-3xl border border-[#EFE8E5] luxury-card-shadow space-y-4">
        <h3 className="font-serif-heading text-lg font-bold text-[#1A1A1A] border-b border-gray-100 pb-3">
          Order Journey Timeline
        </h3>

        <div className="space-y-4 text-xs">
          <div className="flex items-center gap-3 text-emerald-600 font-bold">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>Order Confirmed & AI Recommendation Finalized</span>
          </div>

          <div className="flex items-center gap-3 text-emerald-600 font-bold">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>Prepared & Packaged by Partner ({shop.name})</span>
          </div>

          <div className="flex items-center gap-3 text-[#D4AF37] font-bold">
            <Clock className="w-5 h-5 flex-shrink-0 animate-pulse" />
            <span>Stored in Partner Locker / Pickup Counter (Awaiting Arrival)</span>
          </div>

          <div className="flex items-center gap-3 text-gray-400 font-medium">
            <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
            <span>Collected by Recipient / Customer</span>
          </div>
        </div>
      </div>

      <div className="text-center pt-4">
        <Link
          href="/"
          className="bg-[#1A1A1A] text-white hover:bg-[#D4AF37] hover:text-[#1A1A1A] font-bold px-8 py-3 rounded-xl transition-all text-xs"
        >
          Return to Homepage
        </Link>
      </div>

    </div>
  );
}
