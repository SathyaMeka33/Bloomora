'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  Heart,
  Star,
  Search,
  Check,
  ShoppingBag,
  SlidersHorizontal,
  X,
  PackageCheck,
} from 'lucide-react';
import { PRODUCTS, CATEGORIES, CategoryItem } from '@/lib/mockData';
import { useBloomoraStore } from '@/lib/store';

function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryQuery = searchParams.get('category') || 'all';
  const occasionQuery = searchParams.get('occasion') || 'all';
  const budgetQuery = searchParams.get('budget') || 'all';
  const relationshipQuery = searchParams.get('relationship') || 'all';

  const { addToCart, toggleWishlist, wishlist } = useBloomoraStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryQuery);
  const [selectedBudget, setSelectedBudget] = useState<string>(budgetQuery);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync state when URL search params change
  useEffect(() => {
    if (categoryQuery) setSelectedCategory(categoryQuery);
    if (budgetQuery) setSelectedBudget(budgetQuery);
  }, [categoryQuery, budgetQuery]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Build filter tabs combining high-level curation + exact category keys
  const categoryFilters = useMemo(() => [
    { id: 'all', label: 'All Gifts & Hampers' },
    { id: 'bouquets', label: 'Velvet Bouquets' },
    { id: 'cakes', label: 'Bento Cakes' },
    { id: 'flowers', label: 'Floral Bouquets' },
    { id: 'chocolate-bouquets', label: 'Chocolate Bouquets' },
    { id: 'corporate-gifts', label: 'Corporate & Executive' },
    { id: 'kids-gifting', label: 'Kids Art & Crafts' },
    { id: 'premium-gifts', label: 'Royal Reserve Hampers' },
    { id: 'custom-gifts', label: 'Custom Mugs & Keepsakes' },
    { id: 'best-sellers', label: 'Best Sellers' },
    { id: 'trending', label: 'Trending' },
  ], []);

  // Find active category details for header showcase if applicable
  const activeCategoryMeta: CategoryItem | undefined = useMemo(() => {
    return CATEGORIES.find((c) => c.id === selectedCategory);
  }, [selectedCategory]);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // 1. Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesSub = product.subtitle?.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        const matchesCat = product.category.toLowerCase().includes(q);
        if (!matchesName && !matchesSub && !matchesDesc && !matchesCat) return false;
      }

      // 2. Category filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'best-sellers') {
          if (!product.isBestSeller) return false;
        } else if (selectedCategory === 'trending') {
          if (!product.isTrending) return false;
        } else if (selectedCategory === 'flowers') {
          if (product.category !== 'flowers') return false;
        } else if (selectedCategory === 'bouquets') {
          if (product.category !== 'bouquets') return false;
        } else if (selectedCategory === 'cakes') {
          if (product.category !== 'cakes') return false;
        } else if (selectedCategory === 'corporate-gifts') {
          if (product.category !== 'corporate-gifts') return false;
        } else if (selectedCategory === 'kids-gifting') {
          if (product.category !== 'kids-gifting') return false;
        } else if (selectedCategory === 'premium-gifts') {
          if (product.category !== 'premium-gifts') return false;
        } else if (selectedCategory === 'custom-gifts') {
          if (product.category !== 'custom-gifts') return false;
        } else if (selectedCategory === 'chocolate-bouquets') {
          if (product.category !== 'chocolate-bouquets') return false;
        } else {
          if (product.category !== selectedCategory) return false;
        }
      }

      // 3. Occasion filter (supports Indian festivals and curated celebrations)
      if (occasionQuery !== 'all') {
        const q = occasionQuery.toLowerCase().replace(/-/g, ' ');
        const matches = product.occasion.some((occ) => {
          const o = occ.toLowerCase().replace(/-/g, ' ');
          return o.includes(q) || q.includes(o);
        }) || (
          // Inclusive festive fallback for luxury celebratory hampers
          ['navratri', 'diwali', 'dussehra', 'karwa', 'dhanteras', 'festive', 'bhai dooj', 'pongal', 'sankranti', 'holi', 'raksha'].some(k => q.includes(k)) &&
          (product.category === 'premium-gifts' || product.category === 'cakes' || product.category === 'chocolate-bouquets' || product.category === 'bouquets')
        );
        if (!matches) return false;
      }

      // 4. Relationship filter
      if (relationshipQuery !== 'all') {
        if (product.recipientTag !== relationshipQuery) return false;
      }

      // 5. Budget filter
      if (selectedBudget === 'under-300' && product.price >= 300) return false;
      if (selectedBudget === '300-999' && (product.price < 300 || product.price > 999)) return false;
      if (selectedBudget === '1000-plus' && product.price < 1000) return false;

      return true;
    });
  }, [searchQuery, selectedCategory, occasionQuery, relationshipQuery, selectedBudget]);

  const handleCategorySelect = (id: string) => {
    setSelectedCategory(id);
    if (id === 'all') {
      router.push('/catalog', { scroll: false });
    } else {
      router.push(`/catalog?category=${id}`, { scroll: false });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-10">
      {/* Toast feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#262626] text-white px-5 py-3 rounded-full text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <PackageCheck className="w-4 h-4 text-[#D98C95]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF4F2] border border-[#F6D2CF]">
          <Sparkles className="w-3 h-3 text-[#D98C95]" />
          <span className="text-[10px] font-bold text-[#D98C95] uppercase tracking-widest">
            Verified Artisan Curation
          </span>
        </div>
        <h1 className="font-serif-heading text-3xl sm:text-5xl font-bold text-[#262626] leading-tight">
          Gift Stories & Curated Collections
        </h1>
        <p className="text-xs sm:text-sm text-[#6B6B6B] leading-relaxed font-sans">
          Discover hand-crafted floral arrangements, gourmet chocolate mini cakes, corporate executive kits, and royal keepsake chests.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xl mx-auto">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by gift name, cake flavor, roses, pens, chests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#E8C8C1]/60 rounded-full pl-11 pr-10 py-3 text-xs text-[#262626] focus:outline-none focus:border-[#D98C95] shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Budget Dropdown */}
          <select
            value={selectedBudget}
            onChange={(e) => setSelectedBudget(e.target.value)}
            className="w-full sm:w-auto bg-white border border-[#E8C8C1]/60 rounded-full px-4 py-3 text-xs font-semibold text-[#262626] focus:outline-none focus:border-[#D98C95] shadow-xs cursor-pointer"
          >
            <option value="all">All Price Ranges</option>
            <option value="under-300">Under ₹300</option>
            <option value="300-999">₹300 – ₹999</option>
            <option value="1000-plus">₹1000+ (Luxury)</option>
          </select>
        </div>

        {/* Horizontal Scrollable Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2 pt-1 justify-start sm:justify-center -mx-4 px-4 sm:mx-0 sm:px-0">
          {categoryFilters.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center justify-center min-h-[38px] ${
                  isActive
                    ? 'bg-[#262626] text-white shadow-xs'
                    : 'bg-white border border-[#E8C8C1]/50 text-[#6B6B6B] hover:text-[#262626] hover:border-[#D98C95]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Category Meta Banner (When user clicks a specific category) */}
      {activeCategoryMeta && (
        <div className="bg-[#FFF8F5] rounded-[24px] p-5 sm:p-7 border border-[#F1E2DD] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-bold text-[#D98C95] uppercase tracking-widest">
              Category Showcase • {activeCategoryMeta.tag}
            </span>
            <h2 className="font-serif-heading text-xl sm:text-2xl font-bold text-[#262626]">
              {activeCategoryMeta.name}
            </h2>
            <p className="text-xs text-[#6B6B6B] max-w-xl font-sans">
              {activeCategoryMeta.description}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-white border border-[#E8C8C1] text-[#262626]">
              {filteredProducts.length} Product{filteredProducts.length === 1 ? '' : 's'} Available
            </span>
            <button
              onClick={() => handleCategorySelect('all')}
              className="text-xs font-semibold text-[#D98C95] hover:underline"
            >
              Clear Filter
            </button>
          </div>
        </div>
      )}

      {/* Product Grid — All Cards Strict Equal Height */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[24px] border border-[#F3E8E5] space-y-4">
          <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto" />
          <h3 className="font-serif-heading text-xl font-bold text-[#262626]">No gifts found in this selection</h3>
          <p className="text-xs text-[#6B6B6B] max-w-sm mx-auto">
            Try choosing a different category or clearing search filters to see our full catalogue.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedBudget('all');
              setSearchQuery('');
              router.push('/catalog');
            }}
            className="px-6 py-2.5 bg-[#262626] text-white rounded-full text-xs font-semibold hover:bg-[#D98C95] transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {filteredProducts.map((product) => {
            const hasMultipleImages = product.images.length > 1;
            return (
              <div
                key={product.id}
                className="bg-white rounded-[22px] overflow-hidden border border-[#F3E8E5] shadow-[0_6px_20px_rgba(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-[0_18px_36px_-10px_rgba(217,140,149,0.18)] transition-all duration-300 flex flex-col justify-between group h-[410px]"
              >
                {/* Product Image (Fixed 210px height) */}
                <div className="relative h-[210px] w-full bg-[#FFF8F5] overflow-hidden">
                  <Link href={`/product/${product.id}`} className="block w-full h-full">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  </Link>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-[#262626] hover:text-[#D98C95] transition-colors shadow-xs z-10"
                    title="Toggle Wishlist"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        wishlist.includes(product.id) ? 'fill-[#D98C95] text-[#D98C95]' : ''
                      }`}
                    />
                  </button>

                  {/* Top-left Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {product.isBestSeller && (
                      <span className="bg-[#262626] text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                        Best Seller
                      </span>
                    )}
                    {product.isTrending && !product.isBestSeller && (
                      <span className="bg-[#D98C95] text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                        Trending
                      </span>
                    )}
                  </div>

                  {/* Photo count indicator */}
                  {hasMultipleImages && (
                    <span className="absolute bottom-2.5 right-2.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded-md">
                      {product.images.length} photos
                    </span>
                  )}
                </div>

                {/* Text & Pricing Container (Fixed 200px height) */}
                <div className="p-4 space-y-2.5 flex-grow flex flex-col justify-between bg-white border-t border-[#F3E8E5]">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-1 text-[11px] text-[#8B8B8B]">
                      <span className="capitalize text-[#C8A46A] font-semibold">{product.category.replace('-', ' ')}</span>
                      <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {product.rating}
                      </span>
                    </div>

                    <Link href={`/product/${product.id}`} className="block">
                      <h3 className="font-serif-heading text-base sm:text-lg font-bold text-[#262626] group-hover:text-[#D98C95] transition-colors leading-snug line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>

                    <p className="text-xs text-[#6B6B6B] line-clamp-2 font-sans leading-relaxed">
                      {product.subtitle || product.story}
                    </p>
                  </div>

                  {/* Pricing and Action Buttons */}
                  <div className="pt-2 border-t border-[#F3E8E5] space-y-2">
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-bold text-[#262626]">₹{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
                        )}
                      </div>
                      {product.originalPrice && (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                          {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          addToCart(product, 1);
                          showToast(`Added "${product.name}" to cart!`);
                        }}
                        className="py-2 px-2 bg-white hover:bg-[#FAF5F2] border border-[#E8C8C1] text-[#262626] font-semibold rounded-full text-[11px] transition-colors flex items-center justify-center gap-1"
                      >
                        <ShoppingBag className="w-3 h-3 text-[#D98C95]" />
                        <span>Add</span>
                      </button>

                      <Link
                        href={`/product/${product.id}`}
                        className="py-2 px-2 bg-[#262626] hover:bg-[#D98C95] text-white font-semibold rounded-full text-[11px] transition-colors flex items-center justify-center whitespace-nowrap"
                      >
                        <span>Gift Story →</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-xs text-gray-400">Loading gift catalog...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
