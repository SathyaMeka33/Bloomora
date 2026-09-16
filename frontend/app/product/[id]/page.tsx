'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { trackExternalReferral } from '@/lib/services/analyticsService';
import { ExternalLink, Heart, Sparkles, Star, Clock, Check, ShoppingBag, MessageSquare, Loader2 } from 'lucide-react';
import { useBloomoraStore } from '@/lib/store';
import { PRODUCTS } from '@/lib/mockData';
import GiftFitScoreCard from '@/components/gift-finder/GiftFitScoreCard';

export default function ProductStoryPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart, toggleWishlist, wishlist } = useBloomoraStore();

  const product = PRODUCTS.find((p) => p.id === resolvedParams.id) || PRODUCTS[0];
  const [selectedImage, setSelectedImage] = useState(product.images[0] || product.images[0]);
  const [selectedPackaging, setSelectedPackaging] = useState('Blush Pink Luxury Wrap');
  const [deliveryOption, setDeliveryOption] = useState<'door' | 'meet-me-there' | 'pickup'>('door');

  // Gift Finder params â€” shown when product is opened from AI Gift Finder results
  const giftFitScore = searchParams.get('fit_score');
  const giftWhyText = searchParams.get('why');
  const giftDelivery = searchParams.get('delivery');

  // AI Message Generator state
  const [messageRecipient, setMessageRecipient] = useState('');
  const [messageOccasion, setMessageOccasion] = useState('birthday');
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [generatingMessage, setGeneratingMessage] = useState(false);

  const handleGenerateMessage = async () => {
    if (!messageRecipient.trim()) return;
    setGeneratingMessage(true);
    try {
      const { aiApiService } = await import('@/lib/api');
      const result = await aiApiService.generateGiftMessage({
        recipient: messageRecipient,
        occasion: messageOccasion,
        relationship: 'friend',
      });
      setGeneratedMessage(result.message);
    } catch {
      setGeneratedMessage(
        `Wishing you a wonderful ${messageOccasion}, ${messageRecipient}! This gift comes with all my love and warmest thoughts. May it bring a smile to your beautiful face.`
      );
    } finally {
      setGeneratingMessage(false);
    }
  };

  const handleExternalPartnerClick = async () => {
    if (product.partnerId) {
      await trackExternalReferral(product.id, product.partnerId);
    }
    if (product.externalProductUrl) {
      window.open(product.externalProductUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const packagingOptions = [
    { name: 'Blush Pink Luxury Wrap', color: 'bg-[#F9EDE8]' },
    { name: 'White Elegance Box', color: 'bg-white' },
    { name: 'Golden Luxe Chest', color: 'bg-[#FFF8F5]' },
    { name: 'Red Passion Silk', color: 'bg-rose-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-[#6B6B6B]">
        <Link href="/" className="hover:text-[#262626]">
          Home
        </Link>
        <span>/</span>
        <Link href="/catalog" className="hover:text-[#262626]">
          Gift Stories
        </Link>
        <span>/</span>
        <span className="text-[#262626] font-semibold">{product.name}</span>
      </div>

      {/* Gift Fit Score Card â€” only shown when arriving from AI Gift Finder */}
      {giftFitScore && (
        <GiftFitScoreCard
          score={parseInt(giftFitScore)}
          why={giftWhyText ? decodeURIComponent(giftWhyText) : 'This product matches your gift intent.'}
          productName={product.name}
          deliveryEstimate={giftDelivery ? decodeURIComponent(giftDelivery) : undefined}
        />
      )}

      {/* Main Product / Gift Story Layout (70% Visual Weight Image Focus) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
        {/* Left Visual Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative rounded-3xl overflow-hidden shadow-sm border border-[#E8C8C1]/30 bg-white">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-[420px] sm:h-[540px] object-cover editorial-image"
            />
            <button
              onClick={() => toggleWishlist(product.id)}
              className="absolute top-4 right-4 p-3 rounded-full bg-white/90 text-gray-700 hover:text-rose-500 transition-colors shadow-sm z-10"
            >
              <Heart className={`w-5 h-5 ${wishlist.includes(product.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              <div className="bg-[#262626] text-[#D4AF37] text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 w-fit">
                <Sparkles className="w-3.5 h-3.5" /> Signature Gift Story
              </div>

              {product.isSponsored && (
                <div className="bg-[#FFF8F5] text-[#262626] border border-[#D4AF37] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest w-fit">
                  Curated Partner Feature
                </div>
              )}

              {product.isPartnerProduct && (
                <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest w-fit">
                  Local Partner Craft
                </div>
              )}
            </div>
          </div>

          {/* Thumbnail Strip */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto custom-scrollbar pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === img ? 'border-[#D4AF37] scale-95' : 'border-[#E8C8C1]/40 opacity-70'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Editorial Story & Customization Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2 border-b border-[#F9EDE8] pb-4">
            <div className="flex items-center justify-between text-xs text-[#6B6B6B]">
              <Link
                href={`/catalog?category=${product.category}`}
                className="px-2.5 py-1 rounded-full bg-[#FFF4F2] text-[#D98C95] font-semibold hover:bg-[#F6D2CF] transition-colors uppercase tracking-wider text-[10px]"
              >
                {product.category.replace('-', ' ')}
              </Link>
              <div className="flex items-center gap-3">
                <span className="text-[#C8A46A] font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-[#C8A46A]" /> {product.rating} ({product.reviewCount} reviews)
                </span>
                <span className="flex items-center gap-1 text-[#8B8B8B]">
                  <Clock className="w-3.5 h-3.5" /> Prep: {product.preparationTimeMinutes}m
                </span>
              </div>
            </div>

            <h1 className="font-serif-heading text-2xl sm:text-4xl font-bold text-[#262626] leading-tight">
              {product.name}
            </h1>

            <p className="text-xs text-[#8B8B8B] font-sans">
              {product.subtitle}
            </p>

            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-3xl font-bold text-[#262626]">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-sm font-normal text-[#8B8B8B] line-through">
                  ₹{product.originalPrice}
                </span>
              )}
              {product.originalPrice && (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </span>
              )}
            </div>
          </div>

          {/* External Partner Banner if applicable */}
          {product.externalProductUrl ? (
            <div className="bg-[#FFF8F5] p-5 rounded-2xl border border-[#D4AF37]/50 space-y-3">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest">
                  Direct Partner Showcase
                </span>
                <h4 className="text-sm font-bold text-[#262626]">Curated Partner Product</h4>
                <p className="text-xs text-[#6B6B6B]">
                  This product is crafted directly by our verified partner merchant. You can inspect full specifications on the partner website.
                </p>
              </div>

              <button
                onClick={handleExternalPartnerClick}
                className="w-full bg-[#262626] text-white py-3.5 min-h-[44px] rounded-full text-xs font-bold hover:bg-[#D4AF37] hover:text-[#262626] transition-colors flex items-center justify-center gap-2"
              >
                View Partner Product <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              {/* Emotional Story Box */}
              <div className="bg-[#FFF8F5] p-4 sm:p-5 rounded-2xl border border-[#E8C8C1]/40 space-y-2">
                <h4 className="text-xs font-bold text-[#C8A46A] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D98C95]" /> The Gift Story
                </h4>
                <p className="text-xs text-[#4A4A4A] italic font-serif leading-relaxed">
                  "{product.story}"
                </p>
              </div>

              {/* What's Included */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#262626]">What's Inside the Box:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#4A4A4A]">
                  {product.packagingItems.map((item, idx) => (
                    <div key={idx} className="bg-white p-2.5 rounded-xl border border-[#E8C8C1]/40 flex items-center gap-2 shadow-2xs">
                      <Check className="w-3.5 h-3.5 text-[#5A9E7B] shrink-0" />
                      <span className="leading-tight">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Choose Wrapping */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#262626]">Select Signature Wrap:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {packagingOptions.map((pkg) => (
                    <button
                      key={pkg.name}
                      onClick={() => setSelectedPackaging(pkg.name)}
                      className={`p-3 min-h-[44px] rounded-xl border text-xs text-left transition-all flex items-center justify-between ${
                        selectedPackaging === pkg.name
                          ? 'border-[#D98C95] bg-[#FFF4F2] font-bold text-[#262626]'
                          : 'border-[#E8C8C1]/40 bg-white text-[#6B6B6B] hover:border-[#D98C95]'
                      }`}
                    >
                      <span>{pkg.name}</span>
                      {selectedPackaging === pkg.name && <Check className="w-3.5 h-3.5 text-[#D98C95]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Add to Bag + Buy Now */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    addToCart(product, 1, selectedPackaging);
                    alert(`Added "${product.name}" with ${selectedPackaging} to your bag!`);
                  }}
                  className="w-full bg-white hover:bg-[#FAF5F2] border-2 border-[#262626] text-[#262626] font-bold py-3.5 min-h-[48px] rounded-full text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <ShoppingBag className="w-4 h-4 text-[#D98C95]" /> Add to Bag
                </button>

                <button
                  onClick={() => {
                    addToCart(product, 1, selectedPackaging);
                    router.push('/checkout');
                  }}
                  className="w-full bg-[#262626] hover:bg-[#D98C95] text-white font-bold py-3.5 min-h-[48px] rounded-full text-xs transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  Personalize & Checkout →
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ===== AI GIFT MESSAGE GENERATOR ===== */}
      <section style={{
        background: '#FFF8F5',
        borderRadius: '24px',
        padding: '40px',
        border: '1px solid #EFE8E4',
        boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <MessageSquare size={20} color="#D98C95" />
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#262626', fontFamily: 'var(--font-playfair), serif' }}>
            Write the Perfect Gift Message
          </h2>
        </div>
        <p style={{ fontSize: '14px', color: '#8B8B8B', marginBottom: '24px' }}>
          Let Bloomora's AI craft a heartfelt, personalised message for this gift
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#262626', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '7px' }}>Recipient's name</label>
            <input type="text" placeholder="e.g. Priya" value={messageRecipient}
              onChange={e => setMessageRecipient(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', background: '#FFFFFF', border: '1.5px solid #EFE8E4', borderRadius: '12px', padding: '13px 16px', color: '#262626', fontSize: '14px', outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.2s' }}
              onFocus={e => e.target.style.borderColor = '#D98C95'}
              onBlur={e => e.target.style.borderColor = '#EFE8E4'}
            />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#262626', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '7px' }}>Occasion</label>
            <select value={messageOccasion} onChange={e => setMessageOccasion(e.target.value)}
              style={{ width: '100%', background: '#FFFFFF', border: '1.5px solid #EFE8E4', borderRadius: '12px', padding: '13px 16px', color: '#262626', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }}>
              <option value="birthday">Birthday</option>
              <option value="anniversary">Anniversary</option>
              <option value="thank-you">Thank You</option>
              <option value="love">Just Because</option>
              <option value="congratulations">Congratulations</option>
            </select>
          </div>
        </div>

        <button onClick={handleGenerateMessage} disabled={!messageRecipient.trim() || generatingMessage}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: !messageRecipient.trim() ? '#CCCCCC' : '#D98C95',
            border: 'none', borderRadius: '100px', padding: '14px 28px',
            color: 'white', fontSize: '14px', fontWeight: 700,
            cursor: !messageRecipient.trim() ? 'not-allowed' : 'pointer',
            marginBottom: '16px', transition: 'all 0.2s',
            boxShadow: messageRecipient.trim() ? '0 4px 16px rgba(217,140,149,0.35)' : 'none',
          }}
          onMouseEnter={e => { if (messageRecipient.trim()) (e.currentTarget as HTMLButtonElement).style.background = '#C9838B'; }}
          onMouseLeave={e => { if (messageRecipient.trim()) (e.currentTarget as HTMLButtonElement).style.background = '#D98C95'; }}
        >
          {generatingMessage ? (
            <><Loader2 size={16} className="animate-spin" /> Generating...</>
          ) : (
            <><Sparkles size={16} /> Generate Message</>
          )}
        </button>

        {generatedMessage && (
          <div style={{ background: '#FFFFFF', border: '1.5px solid #EFE8E4', borderLeft: '4px solid #D98C95', borderRadius: '14px', padding: '20px', position: 'relative' }}>
            <p style={{ fontSize: '15px', color: '#262626', lineHeight: 1.8, fontStyle: 'italic', marginBottom: '8px' }}>
              "{generatedMessage}"
            </p>
            <button onClick={() => navigator.clipboard.writeText(generatedMessage)}
              style={{ background: '#FFF8F5', border: '1px solid #EFE8E4', borderRadius: '8px', padding: '6px 16px', color: '#666666', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
              Copy Message
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

