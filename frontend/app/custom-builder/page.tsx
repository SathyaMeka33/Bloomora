'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  Check,
  Heart,
  Package,
  Gift,
  ShoppingBag,
  Sliders,
  FileText,
  Palette,
  Camera,
  BookOpen,
  Smile,
  Crown,
  Upload,
} from 'lucide-react';
import { PRODUCTS } from '@/lib/mockData';
import { useBloomoraStore } from '@/lib/store';
import { uploadCustomGiftMedia } from '@/lib/storageService';

export default function CustomBuilderPage() {
  const router = useRouter();
  const { addToCart } = useBloomoraStore();

  const [selectedProduct] = useState(PRODUCTS[0]);
  const [selectedWrap, setSelectedWrap] = useState('Blush Pink Luxury Wrap');
  const [selectedRibbon, setSelectedRibbon] = useState('Gold Velvet Ribbon');
  const [selectedFlowers, setSelectedFlowers] = useState('12 Dutch Pink Roses');
  const [selectedChocolates, setSelectedChocolates] = useState('Cadbury Dairy Milk Silk (+₹90)');
  const [greetingMessage, setGreetingMessage] = useState(
    'Happy Birthday to my amazing sister! Stay blessed and keep smiling always. 💕'
  );

  const [selectedAddons, setSelectedAddons] = useState<string[]>(['Teddy Bear (+₹199)']);
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string>('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const wraps = [
    { name: 'Blush Pink Luxury Wrap', color: '#F9EDE8', badge: 'Popular' },
    { name: 'White Elegance Box', color: '#FFFFFF', badge: 'Classic' },
    { name: 'Golden Luxe Chest', color: '#FFF8F5', badge: 'Luxury' },
    { name: 'Red Passion Silk Wrap', color: '#FDF2F2', badge: 'Romantic' },
    { name: 'Rose Gold Wrap', color: '#E8C8C1', badge: 'Signature' },
    { name: 'Waterproof Luxury Wrap', color: '#F0F9FF', badge: 'Durable' },
    { name: 'Transparent Crystal Wrap', color: '#FAFAFA', badge: 'Minimal' },
    { name: 'Festival Gold Wrap', color: '#FEF3C7', badge: 'Festive' },
  ];

  const ribbons = [
    { name: 'Gold Velvet Ribbon', code: '#D4AF37' },
    { name: 'Rose Gold Satin', code: '#E8C8C1' },
    { name: 'Midnight Black Ribbon', code: '#262626' },
    { name: 'Cream Silk Ribbon', code: '#FFF8F5' },
  ];

  const flowerOptions = [
    '12 Dutch Pink Roses',
    '12 Dutch Red Roses',
    'Elegant White Lilies (+₹150)',
    'Sunshine Sunflowers (+₹120)',
  ];

  const chocolateOptions = [
    'Cadbury Dairy Milk Silk (+₹90)',
    '16 Golden Ferrero Rocher (+₹450)',
    'Artisanal Truffles Box (+₹299)',
    'None',
  ];

  const addonsList = [
    { id: 'teddy', name: 'Teddy Bear (+₹199)', icon: '🧸' },
    { id: 'diary', name: 'Leather Journal (+₹249)', icon: '📔' },
    { id: 'perfume', name: 'French Perfume Mist (+₹349)', icon: '✨' },
    { id: 'frame', name: 'Custom Photo Frame (+₹199)', icon: '🖼️' },
  ];

  const toggleAddon = (name: string) => {
    setSelectedAddons((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    );
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    try {
      const url = await uploadCustomGiftMedia(file, 'acrylic-photos');
      setCustomPhotoUrl(url);
    } catch (err) {
      console.warn('Firebase Storage upload failed, creating object URL preview:', err);
      setCustomPhotoUrl(URL.createObjectURL(file));
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const calculateAddonsPrice = () => {
    let extra = 0;
    if (selectedChocolates.includes('90')) extra += 90;
    if (selectedChocolates.includes('450')) extra += 450;
    if (selectedChocolates.includes('299')) extra += 299;
    if (selectedFlowers.includes('150')) extra += 150;
    if (selectedFlowers.includes('120')) extra += 120;
    selectedAddons.forEach((a) => {
      if (a.includes('199')) extra += 199;
      if (a.includes('249')) extra += 249;
      if (a.includes('349')) extra += 349;
    });
    return extra;
  };

  const totalPrice = selectedProduct.price + calculateAddonsPrice();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#F9EDE8] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-widest text-[#D4AF37] uppercase">
            <Sparkles className="w-3.5 h-3.5" /> Bloomora Custom Craft Studio
          </div>
          <h1 className="font-serif-heading text-3xl font-bold text-[#262626]">
            Personalize Your Gift Experience
          </h1>
          <p className="text-xs text-[#6B6B6B]">
            Customize wrapping, ribbon, greeting card note, and artisanal add-ons with real-time live preview.
          </p>
        </div>

        <div className="bg-[#FFF8F5] border border-[#E8C8C1]/50 px-5 py-2.5 rounded-2xl text-right">
          <span className="text-[10px] text-[#6B6B6B] uppercase font-bold">Total Experience Price</span>
          <p className="text-xl font-bold text-[#262626]">₹{totalPrice}</p>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Live Visual Preview */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
          <div className="relative rounded-3xl overflow-hidden shadow-sm border-4 border-white bg-[#FFF8F5]">
            <img
              src={customPhotoUrl || selectedProduct.images[0]}
              alt="Live Customization Preview"
              className="w-full h-[400px] object-cover editorial-image"
            />

            {/* Live Customization Overlay Badges */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[10px] font-bold text-[#262626] border border-[#E8C8C1]/40 flex items-center gap-1.5 shadow-xs">
              <Package className="w-3.5 h-3.5 text-[#D4AF37]" /> {selectedWrap}
            </div>

            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[10px] font-bold text-[#262626] border border-[#E8C8C1]/40 flex items-center gap-1.5 shadow-xs">
              <Palette className="w-3.5 h-3.5 text-[#D4AF37]" /> {selectedRibbon}
            </div>

            {/* Live Card Overlay Preview */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-[#E8C8C1]/40 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">
                Embossed Gold Card Preview:
              </span>
              <p className="text-xs text-[#262626] font-serif italic line-clamp-2">
                "{greetingMessage || 'Write your heartfelt message...'}"
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E8C8C1]/30 text-xs space-y-2">
            <h4 className="font-bold text-[#262626]">Live Experience Summary:</h4>
            <ul className="space-y-1 text-[#6B6B6B]">
              <li>🌸 <strong>Flowers:</strong> {selectedFlowers}</li>
              <li>🍫 <strong>Chocolates:</strong> {selectedChocolates}</li>
              <li>🎁 <strong>Wrap:</strong> {selectedWrap} ({selectedRibbon})</li>
              <li>✨ <strong>Add-ons:</strong> {selectedAddons.join(', ') || 'None'}</li>
              {customPhotoUrl && <li>📸 <strong>Uploaded Photo:</strong> Attached to Gift Box</li>}
            </ul>
          </div>
        </div>

        {/* Right Column: Interactive Customization Controls */}
        <div className="lg:col-span-7 space-y-8">
          {/* SECTION 1: PACKAGING SELECTION */}
          <div className="bg-white p-6 rounded-3xl border border-[#E8C8C1]/40 shadow-xs space-y-4">
            <h3 className="font-serif-heading text-lg font-bold text-[#262626] flex items-center gap-2">
              <Package className="w-5 h-5 text-[#D4AF37]" /> 1. Choose Signature Wrapping
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {wraps.map((w) => (
                <button
                  key={w.name}
                  onClick={() => setSelectedWrap(w.name)}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between h-24 ${
                    selectedWrap === w.name
                      ? 'border-[#D4AF37] bg-[#F9EDE8]/60 shadow-xs'
                      : 'border-[#E8C8C1]/40 hover:border-[#E8C8C1] bg-white'
                  }`}
                >
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#D4AF37]">
                    {w.badge}
                  </span>
                  <span className="text-xs font-semibold text-[#262626] line-clamp-2">{w.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 2: RIBBON ACCENT */}
          <div className="bg-white p-6 rounded-3xl border border-[#E8C8C1]/40 shadow-xs space-y-4">
            <h3 className="font-serif-heading text-lg font-bold text-[#262626] flex items-center gap-2">
              <Palette className="w-5 h-5 text-[#D4AF37]" /> 2. Ribbon Color
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {ribbons.map((r) => (
                <button
                  key={r.name}
                  onClick={() => setSelectedRibbon(r.name)}
                  className={`p-3 rounded-2xl border text-xs font-semibold text-[#262626] transition-all flex items-center gap-2 ${
                    selectedRibbon === r.name
                      ? 'border-[#D4AF37] bg-[#F9EDE8]/60'
                      : 'border-[#E8C8C1]/40 bg-white'
                  }`}
                >
                  <div
                    className="w-4 h-4 rounded-full border border-gray-300 shadow-xs"
                    style={{ backgroundColor: r.code }}
                  />
                  <span>{r.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 3: FLOWERS & CHOCOLATES */}
          <div className="bg-white p-6 rounded-3xl border border-[#E8C8C1]/40 shadow-xs space-y-4">
            <h3 className="font-serif-heading text-lg font-bold text-[#262626] flex items-center gap-2">
              <Crown className="w-5 h-5 text-[#D4AF37]" /> 3. Flowers & Chocolates
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#262626] mb-2">Change Floral Stems:</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {flowerOptions.map((f) => (
                    <button
                      key={f}
                      onClick={() => setSelectedFlowers(f)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedFlowers === f
                          ? 'border-[#D4AF37] bg-[#F9EDE8] font-bold text-[#262626]'
                          : 'border-[#E8C8C1]/30 bg-white text-[#6B6B6B]'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#262626] mb-2">Add Gourmet Chocolates:</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {chocolateOptions.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedChocolates(c)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedChocolates === c
                          ? 'border-[#D4AF37] bg-[#F9EDE8] font-bold text-[#262626]'
                          : 'border-[#E8C8C1]/30 bg-white text-[#6B6B6B]'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: EXTRA GIFTS & MEDIA UPLOAD */}
          <div className="bg-white p-6 rounded-3xl border border-[#E8C8C1]/40 shadow-xs space-y-4">
            <h3 className="font-serif-heading text-lg font-bold text-[#262626] flex items-center gap-2">
              <Gift className="w-5 h-5 text-[#D4AF37]" /> 4. Extra Keepsake Add-ons & Firebase Photo Upload
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {addonsList.map((item) => {
                const isSelected = selectedAddons.includes(item.name);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleAddon(item.name)}
                    className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
                      isSelected
                        ? 'border-[#D4AF37] bg-[#F9EDE8]/60 shadow-xs'
                        : 'border-[#E8C8C1]/40 hover:border-[#E8C8C1] bg-white'
                    }`}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-xs font-semibold text-[#262626]">{item.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Firebase Storage Photo Upload */}
            <div className="pt-2 border-t border-[#F9EDE8]">
              <label className="block text-xs font-bold text-[#262626] mb-2">Upload Photo for Memory Frame / Gift Box:</label>
              <label className="flex items-center gap-3 p-4 rounded-2xl border border-dashed border-[#E8C8C1] bg-[#FFF8F5] cursor-pointer hover:border-[#D4AF37] transition-all">
                <Upload className="w-5 h-5 text-[#D4AF37]" />
                <div className="flex-grow">
                  <span className="text-xs font-bold text-[#262626]">
                    {isUploadingPhoto ? 'Uploading to Firebase Storage...' : customPhotoUrl ? 'Photo Uploaded Successfully ✓' : 'Click to Upload High-Res Image'}
                  </span>
                  <p className="text-[10px] text-[#6B6B6B]">JPG, PNG or WEBP (Max 10MB)</p>
                </div>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* SECTION 5: HANDWRITTEN GREETING CARD */}
          <div className="bg-white p-6 rounded-3xl border border-[#E8C8C1]/40 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif-heading text-lg font-bold text-[#262626] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#D4AF37]" /> 5. Gold Embossed Card Message
              </h3>
              <span className="text-[10px] text-[#6B6B6B] font-mono">
                {greetingMessage.length} / 150 chars
              </span>
            </div>

            <textarea
              rows={3}
              maxLength={150}
              value={greetingMessage}
              onChange={(e) => setGreetingMessage(e.target.value)}
              className="w-full bg-[#FFF8F5] border border-[#E8C8C1]/50 rounded-2xl p-4 text-xs text-[#262626] focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* CTA Submit to Checkout */}
          <div className="pt-2">
            <button
              onClick={() => {
                addToCart(selectedProduct, 1, selectedWrap, greetingMessage);
                router.push('/checkout');
              }}
              className="w-full bg-[#262626] hover:bg-[#D4AF37] text-white hover:text-[#262626] font-semibold py-4 rounded-full text-xs transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" /> Save Custom Experience & Checkout (₹{totalPrice})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
