'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  Heart,
  ChevronRight,
  ShieldCheck,
  Package,
  MapPin,
  Clock,
  Quote,
  ShoppingBag,
  Check,
} from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '@/lib/mockData';
import { useBloomoraStore } from '@/lib/store';
import { useTaxonomy } from '@/lib/hooks/useTaxonomy';
import { getUpcomingIndianOccasions } from '@/lib/indianOccasions';

export default function HomePage() {
  const router = useRouter();
  const { toggleWishlist, wishlist, addToCart } = useBloomoraStore();
  const [addedId, setAddedId] = React.useState<string | null>(null);

  // Dynamically calculate upcoming Indian festivals strictly from today
  const upcomingOccasions = React.useMemo(() => getUpcomingIndianOccasions(4), []);

  const relationshipCategories = [
    { id: 'for-her', title: 'For Her', subtitle: 'Fresh Rose Bouquets', image: '/gifts/Bouquets/IMG_4110.JPG' },
    { id: 'for-mom', title: 'For Mom', subtitle: 'Rosette Cakes & Flora', image: '/gifts/Cakes/IMG_4021.JPG' },
    { id: 'for-friends', title: 'For Friends', subtitle: 'Kawaii Stationery & Sets', image: '/gifts/Stationary items/IMG_4054.JPG' },
    { id: 'for-dad', title: 'For Dad', subtitle: 'Watches & Accessories', image: '/gifts/Accessories for mens/31539d062f953b238e58806ce775e1a7.jpg' },
    { id: 'student-budget', title: 'Student Budget', subtitle: 'Wax-Sealed Love Letters', image: '/gifts/Letters/00d2b1c0f895bbf66c1f748d4e4fedf8.jpg' },
    { id: 'corporate', title: 'Bespoke Hampers', subtitle: 'Curated Birthday Boxes', image: '/gifts/Customised hampers/IMG_4076.JPG' },
  ];



  const customerStories = [
    {
      author: 'Ananya Sharma',
      relation: 'Gifted to Her Sister',
      city: 'Rajahmundry',
      quote: 'Bloomora turned a simple birthday bouquet into an unforgettable unboxing memory. The handwritten card and signature wrap felt like high jewelry packaging.',
    },
    {
      author: 'Vikram Verma',
      relation: 'Gifted to His Mother',
      city: 'Surampalem',
      quote: 'Using Meet Me There allowed me to collect a freshly prepared hamper right at the destination hub without carrying heavy gifts on the train ride.',
    },
    {
      author: 'Priya Reddy',
      relation: 'Gifted to Her Partner',
      city: 'Vijayawada',
      quote: 'The AI Concierge asked exact human questions and recommended a perfect combination within my budget. Truly India’s most elegant gifting platform.',
    },
  ];

  return (
    <div className="space-y-28 sm:space-y-36 pb-24">
      {/* 1. LUXURY HERO (FULL FIRST FOLD) */}
      <section className="relative min-h-[90vh] sm:min-h-[94vh] flex items-end justify-center overflow-hidden bg-[#262626]">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=2000&q=85"
            alt="Bloomora Luxury Gifting Experience"
            className="w-full h-full object-cover object-center filter contrast-105 saturate-90 brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#262626] via-[#262626]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#262626]/60 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-20 sm:pb-28 pt-36 text-left space-y-8">
          <div className="space-y-4 max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#E8C8C1]">
              India’s First AI-Powered Hyperlocal Premium Gifting Platform
            </span>

            <h1 className="font-serif-heading text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08]">
              Every Gift, <br />
              <span className="italic font-garamond font-normal text-[#E8C8C1]">A Beautiful Story.</span>
            </h1>

            <p className="text-base sm:text-xl text-[#FCF6F2]/90 font-serif italic max-w-2xl leading-relaxed border-l-2 border-[#D98C95] pl-4 py-1">
              "We don't sell flowers. We create memories. We convert raw human emotions into unforgettable gift experiences."
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2 max-w-md">
            <Link
              href="/ai-concierge"
              className="bg-[#D98C95] hover:bg-[#C9838B] text-white font-semibold px-8 py-4 rounded-full transition-all text-center text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm"
            >
              <Sparkles className="w-4 h-4" /> Find My Perfect Gift
            </Link>

            <Link
              href="/catalog"
              className="bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-full transition-all text-center text-xs sm:text-sm"
            >
              Explore Gift Stories
            </Link>
          </div>
        </div>
      </section>

      {/* 2. SHOP BY CATEGORY — STRICT EQUAL-SIZE LUXURY CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-[#EFE8E4] pb-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF4F2] border border-[#F6D2CF]">
              <Sparkles className="w-3.5 h-3.5 text-[#D98C95]" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#D98C95]">Handcrafted Collections</span>
            </div>
            <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#262626] tracking-tight">
              Shop by Category
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6B6B] max-w-xl font-sans">
              From fresh Dutch roses and artisanal bento cakes to executive corporate sets and royal heirloom hampers.
            </p>
          </div>

          <Link
            href="/catalog"
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#262626] text-white hover:bg-[#D98C95] transition-all text-xs font-semibold shadow-xs"
          >
            Browse All Categories
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Professional Uniform Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/catalog?category=${cat.id}`}
              className="group bg-white rounded-[22px] overflow-hidden border border-[#EFE8E4] shadow-[0_6px_20px_rgba(0,0,0,0.04)] hover:-translate-y-1.5 hover:shadow-[0_16px_36px_-8px_rgba(217,140,149,0.2)] hover:border-[#D98C95]/50 transition-all duration-300 flex flex-col justify-between h-[310px]"
            >
              {/* Image Container - Exact 65% height (200px) */}
              <div className="relative h-[200px] w-full bg-[#FFF8F5] overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                {/* Tag Pill (Top Left) */}
                <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-[#262626] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                  {cat.tag}
                </span>

                {/* Item Count Pill (Top Right) */}
                <span className="absolute top-3 right-3 bg-[#262626]/85 backdrop-blur-md text-[#E8C8C1] text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-xs">
                  {cat.itemCount}
                </span>
              </div>

              {/* Text Container - Exact 35% height (110px) */}
              <div className="h-[110px] p-4 bg-white flex flex-col justify-between border-t border-[#F3E8E5]">
                <div className="space-y-1">
                  <h3 className="font-serif-heading text-base sm:text-lg font-bold text-[#262626] group-hover:text-[#D98C95] transition-colors leading-snug line-clamp-1">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-[#6B6B6B] line-clamp-2 leading-relaxed font-sans">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-[#FAF5F2] text-[11px] font-semibold text-[#D98C95]">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. RELATIONSHIP CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-[#EFE8E4] pb-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C8A46A]">Curated Collections</span>
            <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#262626]">
              Discover by Relationship
            </h2>
          </div>

          <Link href="/catalog" className="text-xs font-semibold text-[#666666] hover:text-[#262626] flex items-center gap-1">
            View All Collections <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5">
          {relationshipCategories.map((rel) => (
            <Link
              key={rel.id}
              href={`/catalog?relationship=${rel.id}`}
              className="group rounded-[18px] overflow-hidden bg-white border border-[#F3E8E5] shadow-[0_8px_20px_-6px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 transition-all duration-300 h-[150px] flex flex-col justify-between"
            >
              {/* Image 70% height */}
              <div className="relative h-[105px] bg-[#FFF8F5] overflow-hidden">
                <img
                  src={rel.image}
                  alt={rel.title}
                  className="w-full h-full object-cover editorial-image group-hover:scale-[1.01]"
                />
              </div>

              {/* Text 30% height (Below Image) */}
              <div className="h-[45px] px-3 py-1.5 bg-white flex flex-col justify-center border-t border-[#F3E8E5]">
                <h3 className="font-serif-heading text-sm sm:text-base font-semibold text-[#262626] group-hover:text-[#D98C95] transition-colors leading-tight line-clamp-1">
                  {rel.title}
                </h3>
                <p className="text-[10px] text-[#6B6B6B] line-clamp-1 font-sans">
                  {rel.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. UPCOMING OCCASIONS — INDIAN CELEBRATION CALENDAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-[#EFE8E4] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#C8A46A]">
              <Sparkles className="w-3.5 h-3.5 text-[#D98C95]" />
              <span>Live Indian Festive Calendar</span>
            </div>
            <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#262626]">
              Upcoming Indian Celebrations
            </h2>
            <p className="text-xs text-[#6B6B6B] font-sans">
              Auto-calculated daily from today with real-time countdowns. Completed events are automatically retired.
            </p>
          </div>

          <Link href="/account?tab=reminders" className="text-xs font-semibold text-[#666666] hover:text-[#262626] flex items-center gap-1 whitespace-nowrap">
            Personal Reminders <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {upcomingOccasions.map((occ) => (
            <Link
              key={occ.id}
              href={`/catalog?occasion=${occ.id}`}
              className="bg-[#FFFDFB] rounded-[22px] overflow-hidden border border-[#F1E2DD] shadow-[0_10px_25px_-8px_rgba(0,0,0,0.05)] hover:-translate-y-1 hover:shadow-[0_16px_32px_-10px_rgba(217,140,149,0.2)] transition-all duration-300 flex flex-col justify-between group h-[270px]"
            >
              {/* Premium Occasion Photography */}
              <div className="relative h-[165px] bg-[#FFF8F5] overflow-hidden">
                <img
                  src={occ.image}
                  alt={occ.name}
                  className="w-full h-full object-cover editorial-image group-hover:scale-105 transition-transform duration-500"
                />

                {/* Date Badge (Top Left) */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-[#262626] text-[11px] font-bold px-3 py-1 rounded-full shadow-xs border border-white/40">
                  {occ.date}
                </div>

                {/* Countdown Pill (Top Right) with dynamic urgency */}
                <div
                  className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs ${
                    occ.daysLeft === 0
                      ? 'bg-[#D98C95] text-white shadow-md animate-pulse'
                      : occ.daysLeft === 1
                      ? 'bg-[#C8A46A] text-white shadow-sm'
                      : 'bg-white/90 backdrop-blur-md text-[#D98C95]'
                  }`}
                >
                  {occ.countdown}
                </div>
              </div>

              {/* Text Section (Below Image) */}
              <div className="p-4 space-y-1 flex-grow flex flex-col justify-between bg-[#FFFDFB]">
                <div>
                  <h4 className="font-serif-heading text-base sm:text-lg font-bold text-[#262626] group-hover:text-[#D98C95] transition-colors leading-tight line-clamp-1">
                    {occ.name}
                  </h4>
                  <p className="text-[11px] text-[#6B6B6B] line-clamp-1 font-sans mt-0.5">
                    {occ.tagline}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-[#FAF5F2] text-[11px] font-semibold text-[#D98C95]">
                  <span>Explore Festive Gifts</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. BEST SELLER STORIES — CURIOSITY DRIVEN HORIZONTAL CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-[#EFE8E4] pb-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C8A46A]">Signature Experiences</span>
            <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#262626]">
              Best Seller Stories
            </h2>
          </div>

          <Link href="/catalog" className="text-xs font-semibold text-[#666666] hover:text-[#262626] flex items-center gap-1">
            Browse All Stories <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCTS.filter((p) => p.isBestSeller).slice(0, 8).map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-[22px] overflow-hidden border border-[#F3E8E5] shadow-[0_10px_25px_-8px_rgba(0,0,0,0.05)] hover:-translate-y-1 hover:shadow-[0_18px_36px_-10px_rgba(217,140,149,0.18)] transition-all duration-300 flex flex-col justify-between group h-[405px]"
            >
              {/* Product Image */}
              <div className="relative h-48 bg-[#FFF8F5] overflow-hidden">
                <Link href={`/product/${product.id}`} className="block w-full h-full">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover editorial-image group-hover:scale-[1.03] transition-transform duration-300"
                  />
                </Link>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-3.5 right-3.5 p-2 rounded-full bg-white/90 text-[#262626] hover:text-[#D98C95] transition-colors shadow-xs z-10"
                  title="Toggle Wishlist"
                >
                  <Heart className={`w-3.5 h-3.5 ${wishlist.includes(product.id) ? 'fill-[#D98C95] text-[#D98C95]' : ''}`} />
                </button>

                <div className="absolute top-3.5 left-3.5 bg-[#262626] text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {product.isBestSeller ? 'Best Seller' : 'Artisan Pick'}
                </div>
              </div>

              {/* Text Section (Below Image) */}
              <div className="p-4 space-y-2 flex-grow flex flex-col justify-between bg-white">
                <div className="space-y-1">
                  <Link href={`/product/${product.id}`}>
                    <h3 className="font-serif-heading text-[18px] sm:text-[20px] font-bold text-[#262626] group-hover:text-[#D98C95] transition-colors leading-tight line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-[#6B6B6B] line-clamp-1 font-sans">
                    {product.subtitle || product.story}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#F3E8E5] space-y-2.5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-base font-bold text-[#262626]">
                      ₹{product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-gray-400 line-through">
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        addToCart(product, 1);
                        setAddedId(product.id);
                        setTimeout(() => setAddedId(null), 1800);
                      }}
                      className="h-[36px] px-2 bg-white hover:bg-[#FAF5F2] border border-[#E8C8C1] text-[#262626] font-semibold rounded-full text-[11px] transition-colors inline-flex items-center justify-center gap-1 shadow-xs"
                    >
                      {addedId === product.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-bold">Added!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5 text-[#D98C95]" />
                          <span>Add to Bag</span>
                        </>
                      )}
                    </button>

                    <Link
                      href={`/product/${product.id}`}
                      className="h-[36px] px-2 bg-[#262626] hover:bg-[#D98C95] text-white font-medium rounded-full text-[11px] transition-colors inline-flex items-center justify-center whitespace-nowrap"
                    >
                      Gift Story →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CUSTOMER STORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C8A46A]">Unforgettable Moments</span>
          <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#262626]">
            Customer Stories
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {customerStories.map((story, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[28px] border border-[#EFE8E4] editorial-card-shadow space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <Quote className="w-8 h-8 text-[#E8C8C1]" />
                <p className="text-xs sm:text-sm text-[#666666] font-serif italic leading-relaxed">
                  "{story.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#EFE8E4]">
                <h4 className="text-sm font-bold text-[#262626]">{story.author}</h4>
                <p className="text-[11px] text-[#8B8B8B]">{story.relation} • {story.city}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. WHY BLOOMORA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FCF6F2] rounded-[32px] p-8 sm:p-14 border border-[#EFE8E4] grid grid-cols-1 lg:grid-cols-3 gap-8 text-center sm:text-left">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#D98C95] flex items-center justify-center mx-auto sm:mx-0 shadow-xs">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif-heading text-xl font-bold text-[#262626]">AI-Guided Curation</h3>
            <p className="text-xs text-[#666666] leading-relaxed">
              Personalized recommendations based on recipient personality, occasion tone, and budget optimization.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#D98C95] flex items-center justify-center mx-auto sm:mx-0 shadow-xs">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="font-serif-heading text-xl font-bold text-[#262626]">Italian Unboxing Architecture</h3>
            <p className="text-xs text-[#666666] leading-relaxed">
              Every gift is wrapped like fine jewelry with satin ribbons, rigid keepsake chests, and embossed gold cards.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#D98C95] flex items-center justify-center mx-auto sm:mx-0 shadow-xs">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-serif-heading text-xl font-bold text-[#262626]">Hyperlocal Destination Pickup</h3>
            <p className="text-xs text-[#666666] leading-relaxed">
              Travel heavy-free. Collect freshly prepared gifts at verified partner stores along your route.
            </p>
          </div>
        </div>
      </section>

      {/* ===== AI GIFT FINDER CTA SECTION ===== */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 50%, #1a0a2e 100%)',
          borderTop: '1px solid rgba(192,132,252,0.2)',
          borderBottom: '1px solid rgba(192,132,252,0.2)',
          padding: '80px 24px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(192,132,252,0.1)',
            border: '1px solid rgba(192,132,252,0.3)',
            borderRadius: '100px',
            padding: '8px 20px',
            marginBottom: '24px',
          }}>
            <Sparkles style={{ color: '#E879F9', width: '14px', height: '14px' }} />
            <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C084FC' }}>
              AI Gift Intelligence
            </span>
          </div>

          <h2 style={{
            fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: '16px',
            color: '#F5F5F0',
          }}>
            Find the <span style={{
              background: 'linear-gradient(135deg, #C084FC, #E879F9)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Perfect Gift</span><br />
            in 60 seconds
          </h2>

          <p style={{
            fontSize: '17px',
            color: 'rgba(245,245,240,0.6)',
            lineHeight: 1.7,
            marginBottom: '32px',
            maxWidth: '480px',
            margin: '0 auto 32px',
          }}>
            Answer 6 simple questions. Bloomora's AI Gift Intelligence Engine scores hundreds of products and reveals your perfect matches — with Gift Fit Scores and "Why this gift?" explanations.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '40px' }}>
            <Link
              href="/gift-finder"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                background: 'linear-gradient(135deg, #C084FC 0%, #E879F9 100%)',
                color: 'white',
                padding: '18px 36px',
                borderRadius: '100px',
                fontSize: '16px',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 8px 32px rgba(192,132,252,0.4)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 12px 40px rgba(192,132,252,0.5)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.transform = '';
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 32px rgba(192,132,252,0.4)';
              }}
            >
              <Sparkles style={{ width: '18px', height: '18px' }} />
              Start Gift Finder
              <ArrowRight style={{ width: '18px', height: '18px' }} />
            </Link>
          </div>

          {/* Feature chips */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {['Gift Fit Score™', 'Why This Gift?', 'Emotion-First', 'Anti-Repetition'].map(feature => (
              <span key={feature} style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '100px',
                padding: '8px 16px',
                fontSize: '12px',
                color: 'rgba(245,245,240,0.7)',
              }}>
                <span style={{ color: '#C084FC' }}>✓</span>
                {feature}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SHOP BY EMOTION SECTION ===== */}
      <section style={{ padding: '0 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#D98C95',
            display: 'block',
            marginBottom: '12px',
          }}>
            Emotion-First Gifting
          </span>
          <h2 style={{
            fontSize: 'clamp(24px, 4vw, 36px)',
            fontWeight: 800,
            color: '#262626',
          }}>
            Shop by Feeling
          </h2>
          <p style={{ color: '#666', fontSize: '15px', marginTop: '8px' }}>
            Choose the emotion you want to convey — we'll find the perfect gift
          </p>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '12px',
        }}>
          {[
            { emotion: 'loved', label: 'Loved', emoji: '💕', color: '#FF4B6B', bg: 'rgba(255,75,107,0.08)' },
            { emotion: 'appreciated', label: 'Appreciated', emoji: '✨', color: '#FF8C42', bg: 'rgba(255,140,66,0.08)' },
            { emotion: 'surprised', label: 'Surprised', emoji: '🎊', color: '#7C3AED', bg: 'rgba(124,58,237,0.08)' },
            { emotion: 'celebrated', label: 'Celebrated', emoji: '🥂', color: '#D97706', bg: 'rgba(217,119,6,0.08)' },
            { emotion: 'cherished', label: 'Cherished', emoji: '🌿', color: '#059669', bg: 'rgba(5,150,105,0.08)' },
            { emotion: 'remembered', label: 'Remembered', emoji: '💙', color: '#2563EB', bg: 'rgba(37,99,235,0.08)' },
          ].map(item => (
            <Link
              key={item.emotion}
              href={`/gift-finder`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '24px 16px',
                background: item.bg,
                border: `1px solid ${item.color}22`,
                borderRadius: '20px',
                textDecoration: 'none',
                transition: 'all 0.25s',
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-4px)';
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 12px 30px ${item.color}20`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.transform = '';
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = '';
              }}
            >
              <span style={{ fontSize: '32px', marginBottom: '10px' }}>{item.emoji}</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: item.color }}>
                Feel {item.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── SHOP BY OCCASION (taxonomy-driven) ── */}
      <TaxonomyDiscoverySection />
    </div>
  );
}

/* ───────────────────────────────────────────
   Taxonomy Discovery Sections — live from Django
─────────────────────────────────────────── */

function TaxonomyDiscoverySection() {
  const { featuredOccasions, featuredGiftTypes, loading } = useTaxonomy();
  if (loading || (!featuredOccasions.length && !featuredGiftTypes.length)) return null;

  return (
    <>
      {/* SHOP BY OCCASION */}
      {featuredOccasions.length > 0 && (
        <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 48px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#C8A46A', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '6px' }}>Discover</p>
              <h2 style={{ fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 800, color: '#262626', fontFamily: 'var(--font-playfair), serif', margin: 0 }}>Shop by Occasion</h2>
            </div>
            <a href="/catalog" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#D98C95', textDecoration: 'none' }}>
              View all <ArrowRight size={14} />
            </a>
          </div>
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none' }}>
            {featuredOccasions.map(occ => (
              <a key={occ.id} href={`/gifts/${occ.slug}`}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                  minWidth: '88px', padding: '16px 12px',
                  background: 'white', borderRadius: '20px', border: '1.5px solid #EFE8E4',
                  textDecoration: 'none', transition: 'all 0.2s', flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#D98C95'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#EFE8E4'; (e.currentTarget as HTMLAnchorElement).style.transform = ''; }}
              >
                <span style={{ fontSize: '28px' }}>{occ.emoji || occ.icon}</span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#262626', textAlign: 'center', lineHeight: 1.3 }}>{occ.name}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* SHOP BY GIFT TYPE */}
      {featuredGiftTypes.length > 0 && (
        <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 64px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#C8A46A', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '6px' }}>Browse</p>
              <h2 style={{ fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 800, color: '#262626', fontFamily: 'var(--font-playfair), serif', margin: 0 }}>Shop by Gift Type</h2>
            </div>
            <a href="/catalog" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#D98C95', textDecoration: 'none' }}>
              View all <ArrowRight size={14} />
            </a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
            {featuredGiftTypes.slice(0, 10).map(gt => (
              <a key={gt.id} href={`/gifts/${gt.slug}`}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
                  padding: '20px 12px', background: 'white', borderRadius: '20px',
                  border: '1.5px solid #EFE8E4', textDecoration: 'none', transition: 'all 0.2s',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#FEF0F0'; (e.currentTarget as HTMLAnchorElement).style.borderColor = '#D98C95'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'white'; (e.currentTarget as HTMLAnchorElement).style.borderColor = '#EFE8E4'; (e.currentTarget as HTMLAnchorElement).style.transform = ''; }}
              >
                <span style={{ fontSize: '28px' }}>{gt.icon}</span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#262626', textAlign: 'center', lineHeight: 1.3 }}>{gt.name}</span>
              </a>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

