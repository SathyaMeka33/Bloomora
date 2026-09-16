'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Gift,
  Sparkles,
  CheckCircle2,
  Package,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  MapPin,
  ChevronRight,
  Plus,
  ShoppingBag,
} from 'lucide-react';
import { getSurpriseExperiences } from '@/lib/services/surpriseService';
import { FirestoreSurpriseExperienceDoc, FirestoreSurprisePackageDoc, PackageTier } from '@/lib/types/models';
import { useBloomoraStore } from '@/lib/store';

// Defined reference package tiers as per specification
const PACKAGE_TIERS: { tier: PackageTier; label: string; price: number; description: string }[] = [
  { tier: 'mini', label: 'Mini Package', price: 1500, description: 'Intimate celebration box with cake, flowers & card' },
  { tier: 'classic', label: 'Classic Package', price: 2000, description: 'Popular surprise bundle with artisanal cake & truffle bouquet' },
  { tier: 'signature', label: 'Signature Package', price: 3000, description: 'Luxe hamper with designer cake, floral box & ambient candle setup' },
  { tier: 'grand', label: 'Grand Package', price: 5000, description: 'Royal grand celebration with multi-tier cake, 24-stem roses & decor' },
];

const AVAILABLE_ADDONS = [
  { id: 'cake-upgrade', name: 'Upgrade to 1kg Designer Cake', price: 500 },
  { id: 'rose-upgrade', name: 'Add 12 Extra Dutch Red Roses', price: 450 },
  { id: 'truffle-box', name: 'Belgian Truffle Box (16 pcs)', price: 650 },
  { id: 'balloon-decor', name: 'Surprise Room Balloon Decor Kit', price: 800 },
  { id: 'led-frame', name: 'Illuminated Photo Memory Frame', price: 750 },
];

export default function SurpriseServicesPage() {
  const { addToCart } = useBloomoraStore();
  const [experiences, setExperiences] = useState<FirestoreSurpriseExperienceDoc[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<FirestoreSurpriseExperienceDoc | null>(null);
  const [selectedTier, setSelectedTier] = useState<PackageTier>('classic');

  // Customization & booking form state
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [eventDate, setEventDate] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('Rajahmundry');
  const [personalNote, setPersonalNote] = useState('');
  const [addedNotification, setAddedNotification] = useState<string | null>(null);

  useEffect(() => {
    async function loadExperiences() {
      const data = await getSurpriseExperiences();
      setExperiences(data);
      if (data.length > 0) {
        setSelectedExperience(data[0]);
      }
    }
    loadExperiences();
  }, []);

  const currentTierInfo = PACKAGE_TIERS.find((t) => t.tier === selectedTier) || PACKAGE_TIERS[1];

  // Calculate dynamic price based on base tier price + selected add-ons
  const addonsTotalPrice = selectedAddons.reduce((sum, addonId) => {
    const item = AVAILABLE_ADDONS.find((a) => a.id === addonId);
    return sum + (item ? item.price : 0);
  }, 0);

  const finalEstimatedPrice = currentTierInfo.price + addonsTotalPrice;

  const toggleAddon = (addonId: string) => {
    if (selectedAddons.includes(addonId)) {
      setSelectedAddons(selectedAddons.filter((id) => id !== addonId));
    } else {
      setSelectedAddons([...selectedAddons, addonId]);
    }
  };

  const handleBookService = () => {
    if (!selectedExperience) return;

    const addonNames = selectedAddons
      .map((id) => AVAILABLE_ADDONS.find((a) => a.id === id)?.name)
      .filter(Boolean);

    const fullDescription = [
      `Package Tier: ${currentTierInfo.label} (Starting ₹${currentTierInfo.price})`,
      `Target Event Date: ${eventDate || 'Scheduled Delivery'}`,
      `Location: ${deliveryLocation}`,
      addonNames.length > 0 ? `Add-ons: ${addonNames.join(', ')}` : 'Standard Package Contents',
    ].join(' • ');

    const mockProduct = {
      id: `srv-${selectedExperience.id}-${selectedTier}-${Date.now()}`,
      name: `${selectedExperience.title} — ${currentTierInfo.label}`,
      subtitle: `Ready-to-Book ${selectedExperience.occasion} Service`,
      description: fullDescription,
      story: selectedExperience.description,
      price: finalEstimatedPrice,
      originalPrice: finalEstimatedPrice + 500,
      category: 'Surprise Service',
      occasion: [selectedExperience.occasion],
      recipientTag: 'for-her' as const,
      budgetTier: '1000-plus' as const,
      images: [selectedExperience.image],
      packagingItems: ['Artisanal Cake', 'Fresh Flowers', 'Chocolates', 'Keepsake Box', ...addonNames],
      rating: 5.0,
      reviewCount: 38,
      inStock: true,
      preparationTimeMinutes: 120,
      aiRecommendationReason: 'Bloomora Ready-to-Book Celebration Service',
      isBloomoraProduct: true,
      fulfillmentOptions: ['delivery', 'pickup'],
    };

    addToCart(mockProduct as any, 1, 'Bloomora Luxury Presentation Box', personalNote || 'Happy Celebration from Bloomora!');
    setAddedNotification(`${selectedExperience.title} (${currentTierInfo.label}) booked and added to cart!`);
    setTimeout(() => setAddedNotification(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Toast Notification */}
      {addedNotification && (
        <div className="fixed top-24 right-4 z-50 bg-[#1B1816] text-white text-xs px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-[#B58A4B]">
          <CheckCircle2 className="w-4 h-4 text-[#B58A4B]" />
          <span>{addedNotification}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="text-xs font-bold text-[#B58A4B] uppercase tracking-widest flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Curated Celebration Packages
        </span>
        <h1 className="font-serif-heading text-3xl sm:text-5xl font-bold text-[#1B1816] leading-tight">
          Bloomora Surprise Services
        </h1>
        <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
          Ready-to-book celebration packages combining artisanal cakes, fresh floral arrangements, luxury chocolates, greeting cards, and setup options. Select your occasion, tier, and customize your experience.
        </p>

        <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/surprise-planner"
            className="inline-flex items-center gap-2 bg-[#FFFDFC] text-[#3B172D] border border-[#E8C8C1] px-5 py-2.5 rounded-full text-xs font-bold hover:bg-[#3B172D] hover:text-white transition-all shadow-2xs"
          >
            Have a custom surprise idea? Try Surprise Planner <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Step 1: Select Occasion */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#EFE8E4] pb-3">
          <h2 className="font-serif-heading text-xl font-bold text-[#1B1816]">
            1. Select Occasion
          </h2>
          <span className="text-xs text-[#666666]">Ready-to-Book Packages</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {experiences.map((exp) => {
            const isSelected = selectedExperience?.id === exp.id;
            return (
              <button
                key={exp.id}
                onClick={() => setSelectedExperience(exp)}
                className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between h-28 relative overflow-hidden ${
                  isSelected
                    ? 'border-[#B58A4B] bg-[#3B172D] text-white shadow-md'
                    : 'border-[#EFE8E4] bg-[#FFFDFC] text-[#1B1816] hover:border-[#E8C8C1]'
                }`}
              >
                <div className="space-y-1 relative z-10">
                  <span className={`text-[9px] font-bold uppercase tracking-wider ${isSelected ? 'text-[#B58A4B]' : 'text-[#8B8B8B]'}`}>
                    {exp.category}
                  </span>
                  <h3 className="text-xs font-bold line-clamp-2">{exp.title}</h3>
                </div>
                <div className="flex items-center justify-between text-[10px] relative z-10 pt-1">
                  <span className={isSelected ? 'text-white/80' : 'text-[#666666]'}>4 Tiers Available</span>
                  <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-[#B58A4B]' : 'text-[#8B8B8B]'}`} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2 & 3: Configure Package & Add-ons */}
      {selectedExperience && (
        <div className="bg-[#FFFDFC] rounded-3xl p-6 sm:p-10 border border-[#EFE8E4] editorial-card-shadow space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Package Image & Overview */}
            <div className="md:col-span-5 relative rounded-2xl overflow-hidden shadow-sm aspect-4/3 border border-[#E8C8C1]/50">
              <img
                src={selectedExperience.image}
                alt={selectedExperience.title}
                className="w-full h-full object-cover editorial-image"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                <span className="text-[10px] font-bold text-[#B58A4B] uppercase tracking-widest">
                  {selectedExperience.occasion}
                </span>
                <h3 className="text-xl font-serif-heading font-bold">{selectedExperience.title}</h3>
              </div>
            </div>

            {/* Tier Selection */}
            <div className="md:col-span-7 space-y-5">
              <div>
                <span className="text-xs font-bold text-[#B58A4B] uppercase tracking-widest block mb-1">
                  2. Choose Package Tier
                </span>
                <h2 className="font-serif-heading text-2xl font-bold text-[#1B1816]">
                  {selectedExperience.title}
                </h2>
                <p className="text-xs text-[#666666] leading-relaxed mt-1">
                  {selectedExperience.description}
                </p>
              </div>

              {/* Package Tiers Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {PACKAGE_TIERS.map((t) => {
                  const isSelected = selectedTier === t.tier;
                  return (
                    <button
                      key={t.tier}
                      onClick={() => setSelectedTier(t.tier)}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'border-[#B58A4B] bg-[#FFF8F5] ring-2 ring-[#B58A4B]/30'
                          : 'border-[#EFE8E4] bg-white hover:border-[#E8C8C1]'
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase text-[#B58A4B] block">{t.label}</span>
                      <span className="text-base font-bold text-[#1B1816] block mt-0.5">Starting ₹{t.price.toLocaleString()}</span>
                      <span className="text-[10px] text-[#666666] line-clamp-2 mt-1">{t.description}</span>
                    </button>
                  );
                })}
              </div>

              {/* Package Standard Contents */}
              <div className="bg-[#FFF8F5] p-4 rounded-2xl border border-[#E8C8C1]/50 space-y-2">
                <span className="text-xs font-bold text-[#1B1816] block">Standard Included Elements:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#666666]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B58A4B]" />
                    <span>Artisanal Celebration Cake</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B58A4B]" />
                    <span>Fresh Flower Bouquet / Box</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B58A4B]" />
                    <span>Belgian Chocolates & Truffles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B58A4B]" />
                    <span>Handwritten Gold Card & Ribbon Wrap</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Custom Add-ons & Logistics Details */}
          <div className="border-t border-[#EFE8E4] pt-6 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-bold text-[#B58A4B] uppercase tracking-widest block">
                3. Choose Optional Add-ons & Customizations
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {AVAILABLE_ADDONS.map((addon) => {
                  const isChecked = selectedAddons.includes(addon.id);
                  return (
                    <label
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`p-3.5 min-h-[44px] rounded-2xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                        isChecked
                          ? 'border-[#B58A4B] bg-[#FFF8F5] font-semibold text-[#1B1816]'
                          : 'border-[#EFE8E4] bg-white text-[#666666] hover:border-[#E8C8C1]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${isChecked ? 'bg-[#3B172D] border-[#3B172D] text-white' : 'border-[#E8C8C1]'}`}>
                          {isChecked && <CheckCircle2 className="w-3 h-3 text-[#B58A4B]" />}
                        </div>
                        <span>{addon.name}</span>
                      </div>
                      <span className="font-bold text-[#1B1816]">+₹{addon.price}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Delivery Date, City & Note */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1B1816]">Target Event Date</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full bg-[#FFF8F5] border border-[#E8C8C1]/60 rounded-xl px-3.5 py-3 min-h-[44px] text-xs text-[#1B1816] focus:outline-none focus:border-[#B58A4B]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1B1816]">Delivery City / Location</label>
                <input
                  type="text"
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  placeholder="e.g. Rajahmundry, Surampalem"
                  className="w-full bg-[#FFF8F5] border border-[#E8C8C1]/60 rounded-xl px-3.5 py-3 min-h-[44px] text-xs text-[#1B1816] focus:outline-none focus:border-[#B58A4B]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#1B1816]">Personalized Card Message</label>
                <input
                  type="text"
                  value={personalNote}
                  onChange={(e) => setPersonalNote(e.target.value)}
                  placeholder="e.g. Happy Birthday Ananya! With love..."
                  className="w-full bg-[#FFF8F5] border border-[#E8C8C1]/60 rounded-xl px-3.5 py-3 min-h-[44px] text-xs text-[#1B1816] focus:outline-none focus:border-[#B58A4B]"
                />
              </div>
            </div>

            {/* Price Summary & Book Button */}
            <div className="bg-[#FFF8F5] p-5 rounded-2xl border border-[#E8C8C1]/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-[#8B8B8B] uppercase tracking-wider block">Estimated Service Total</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-[#1B1816]">₹{finalEstimatedPrice.toLocaleString()}</span>
                  <span className="text-xs text-[#666666]">(Includes selected tier + add-ons)</span>
                </div>
              </div>

              <button
                onClick={handleBookService}
                className="w-full sm:w-auto bg-[#3B172D] hover:bg-[#B58A4B] text-white hover:text-[#1B1816] font-semibold px-8 py-3.5 min-h-[48px] rounded-full text-xs transition-all shadow-md flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" /> Book Service & Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
