'use client';

import React, { useState } from 'react';
import { PartnerShop } from '@/lib/mockData';
import { MapPin, Navigation, Store } from 'lucide-react';

interface GoogleMapPickerProps {
  shops: PartnerShop[];
  selectedShop: PartnerShop;
  onSelectShop: (shop: PartnerShop) => void;
}

export default function GoogleMapPicker({ shops, selectedShop, onSelectShop }: GoogleMapPickerProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [mapZoom, setMapZoom] = useState(13);

  // Default coordinate center (Surampalem / Rajahmundry region)
  const defaultCenter = { lat: 17.0005, lng: 81.7799 };

  return (
    <div className="space-y-4">
      <div className="relative w-full h-80 rounded-2xl overflow-hidden border border-[#E8C8C1]/50 shadow-inner bg-[#F9EDE8]">
        {apiKey ? (
          <iframe
            title="Google Maps Partner Shops"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(
              selectedShop.address + ', ' + selectedShop.city
            )}`}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#FFF8F5] to-[#F9EDE8] p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <div>
              <h4 className="font-bold text-[#262626] text-sm">Interactive Partner Location Map</h4>
              <p className="text-xs text-[#6B6B6B] max-w-sm mt-1">
                Currently showing: <span className="font-bold text-[#D4AF37]">{selectedShop.name}</span> ({selectedShop.area}, {selectedShop.city})
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center pt-2">
              {shops.map((shop) => (
                <button
                  key={shop.id}
                  onClick={() => onSelectShop(shop)}
                  className={`text-[10px] px-3 py-1.5 rounded-full border transition-all ${
                    selectedShop.id === shop.id
                      ? 'bg-[#262626] text-white border-[#262626] font-bold'
                      : 'bg-white text-[#262626] border-[#E8C8C1]/60 hover:border-[#D4AF37]'
                  }`}
                >
                  📍 {shop.name} ({shop.distanceKm} km)
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {shops.map((shop) => (
          <div
            key={shop.id}
            onClick={() => onSelectShop(shop)}
            className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
              selectedShop.id === shop.id
                ? 'border-[#D4AF37] bg-[#F9EDE8]/60 shadow-xs font-bold'
                : 'border-[#E8C8C1]/30 bg-white hover:border-[#E8C8C1]'
            }`}
          >
            <div className="p-2 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
              <Store className="w-5 h-5" />
            </div>
            <div className="flex-grow space-y-1">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold text-[#262626]">{shop.name}</h5>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {shop.availableLockers} Lockers Open
                </span>
              </div>
              <p className="text-[11px] text-[#6B6B6B]">{shop.address}</p>
              <div className="flex items-center gap-3 text-[10px] text-[#D4AF37] pt-1">
                <span>⭐ {shop.rating} Rating</span>
                <span>•</span>
                <span>🚗 {shop.distanceKm} km away</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
