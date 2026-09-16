'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  MapPin,
  Clock,
  Check,
  Search,
  Navigation,
  Phone,
  Store,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { PARTNER_SHOPS, PartnerShop } from '@/lib/mockData';
import { useBloomoraStore } from '@/lib/store';
import GoogleMapPicker from '@/components/GoogleMapPicker';

export default function MeetMeTherePage() {
  const { setSelectedShop, selectedShop, setFulfillmentType } = useBloomoraStore();
  const [searchLocation, setSearchLocation] = useState('Surampalem / Rajahmundry');
  const [selectedShopId, setSelectedShopId] = useState<string>(selectedShop.id);

  const activeShop = PARTNER_SHOPS.find((s) => s.id === selectedShopId) || selectedShop || PARTNER_SHOPS[0];

  const handleSelectShop = (shop: PartnerShop) => {
    setSelectedShopId(shop.id);
    setSelectedShop(shop);
    setFulfillmentType('pickup');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header Banner */}
      <div className="bg-[#262626] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden space-y-6">
        <div className="inline-flex items-center gap-2 bg-[#D4AF37] text-[#262626] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          <MapPin className="w-3.5 h-3.5" /> Signature Hyperlocal Innovation
        </div>

        <h1 className="font-serif-heading text-3xl sm:text-5xl font-bold leading-tight">
          Meet Me There — Destination Pickup for ₹10
        </h1>

        <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
          Traveling to attend a birthday or anniversary? <strong>Don’t carry heavy gifts on bus or train rides.</strong> Order online, choose a destination partner store along your route, and pick up your freshly prepared gift for just ₹10!
        </p>

        {/* Location Search Bar */}
        <div className="relative max-w-lg pt-2">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            placeholder="Search destination city or landmark..."
            className="w-full bg-white/10 border border-white/20 rounded-full pl-11 pr-4 py-3 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
      </div>

      {/* Main Grid: Interactive Google Map View & Partner Shops */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Google Maps Component */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white p-4 rounded-3xl border border-[#E8C8C1]/40 shadow-xs space-y-4">
            <h3 className="font-serif-heading text-lg font-bold text-[#262626] flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#D4AF37]" /> Interactive Map & Locker Availability
            </h3>
            
            <GoogleMapPicker
              shops={PARTNER_SHOPS}
              selectedShop={activeShop}
              onSelectShop={handleSelectShop}
            />

            <div className="p-4 rounded-2xl bg-[#FFF8F5] border border-[#E8C8C1]/40 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">
                  Selected Destination Hub
                </span>
                <h4 className="text-sm font-bold text-[#262626]">{activeShop.name}</h4>
                <p className="text-xs text-[#6B6B6B]">{activeShop.area}, {activeShop.city}</p>
              </div>

              <button
                onClick={() => handleSelectShop(activeShop)}
                className="bg-[#262626] hover:bg-[#D4AF37] text-white hover:text-[#262626] px-4 py-2 rounded-full text-xs font-semibold transition-colors"
              >
                Select for ₹10
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Partner Shop List */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#F9EDE8] pb-3">
            <h3 className="font-serif-heading text-xl font-bold text-[#262626]">
              Verified Partner Stores Nearby
            </h3>
            <span className="text-xs text-[#6B6B6B]">{PARTNER_SHOPS.length} hubs active</span>
          </div>

          <div className="space-y-4">
            {PARTNER_SHOPS.map((shop) => (
              <div
                key={shop.id}
                onClick={() => handleSelectShop(shop)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer space-y-3 ${
                  selectedShopId === shop.id
                    ? 'border-[#D4AF37] bg-[#F9EDE8]/60 shadow-xs'
                    : 'border-[#E8C8C1]/30 hover:border-[#E8C8C1] bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={shop.image}
                      alt={shop.name}
                      className="w-14 h-14 rounded-2xl object-cover"
                    />
                    <div>
                      <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">
                        {shop.type}
                      </span>
                      <h4 className="text-sm font-bold text-[#262626]">{shop.name}</h4>
                      <p className="text-xs text-[#6B6B6B]">{shop.address}</p>
                    </div>
                  </div>

                  <span className="bg-[#FFF8F5] border border-[#E8C8C1]/40 text-[#262626] text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                    {shop.distanceKm} km away
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-[#6B6B6B] pt-2 border-t border-[#F9EDE8]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#D4AF37]" /> {shop.openHours}
                  </span>
                  <span className="flex items-center gap-1 text-[#262626] font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> ₹10 Flat Pickup Fee
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <Link
              href="/catalog"
              className="w-full bg-[#262626] hover:bg-[#D4AF37] text-white hover:text-[#262626] font-semibold py-4 rounded-full text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              Browse Gifts Ready for ₹10 Pickup <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
