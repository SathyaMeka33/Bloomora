/**
 * /gifts/[slug] — SEO-friendly taxonomy discovery page
 * Works for both gift types (flowers, personalized-gifts) and occasions (birthday, anniversary)
 */
'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useTaxonomy, type TaxonomyItem } from '@/lib/hooks/useTaxonomy';

interface Product {
  id: number;
  name: string;
  subtitle?: string;
  price: number;
  original_price?: number;
  images: string[];
  seller_name: string;
  customizable: boolean;
  same_day_available: boolean;
  category_name: string;
}

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function TaxonomySlugPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  // Next.js 15: params may be a Promise
  const resolvedParams = 'then' in params ? React.use(params as Promise<{ slug: string }>) : params;
  const slug = resolvedParams?.slug || '';

  const { gift_types, occasion_types, loading: taxLoading } = useTaxonomy();
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);


  // Resolve taxonomy item from slug
  const allGiftTypes = gift_types.flatMap(g => [g, ...(g.subcategories || [])]);
  const allOccasions = occasion_types.flatMap(o => [o, ...(o.subcategories || [])]);

  const taxItem: TaxonomyItem | undefined =
    allGiftTypes.find(g => g.slug === slug) ||
    allOccasions.find(o => o.slug === slug);

  const isGiftType = allGiftTypes.some(g => g.slug === slug);
  const isOccasion = allOccasions.some(o => o.slug === slug);

  // Fetch products filtered by this slug
  useEffect(() => {
    if (taxLoading) return;
    setLoadingProducts(true);
    const params = new URLSearchParams({ page: String(page), page_size: '12' });
    if (isGiftType) params.set('gift_type', slug);
    else if (isOccasion) params.set('occasion_type', slug);
    else params.set('search', slug); // fallback to search

    fetch(`${BASE}/api/products/?${params.toString()}`)
      .then(r => r.json())
      .then(data => {
        const prods: Product[] = Array.isArray(data) ? data : (data.results || data.products || []);
        setProducts(prev => page === 1 ? prods : [...prev, ...prods]);
        setHasMore(!!data.next);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoadingProducts(false));
  }, [slug, page, taxLoading, isGiftType, isOccasion]);

  const displayName = taxItem?.name || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const displayEmoji = taxItem?.emoji || taxItem?.icon || '🎁';

  return (
    <div style={{ minHeight: '100vh', background: '#FFF8F5', paddingTop: '88px', paddingBottom: '80px' }}>
      {/* BREADCRUMB */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#8B8B8B', marginBottom: '24px' }}>
          <Link href="/" style={{ color: '#8B8B8B', textDecoration: 'none' }}>Home</Link>
          <ChevronRight size={14} />
          <Link href="/catalog" style={{ color: '#8B8B8B', textDecoration: 'none' }}>Gifts</Link>
          <ChevronRight size={14} />
          <span style={{ color: '#262626', fontWeight: 600 }}>{displayName}</span>
        </div>

        {/* PAGE HEADER */}
        <div style={{ marginBottom: '36px' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
              <span style={{ fontSize: '48px' }}>{displayEmoji}</span>
              <div>
                <p style={{ fontSize: '11px', fontWeight: 700, color: '#C8A46A', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '4px' }}>
                  {isOccasion ? 'Shop by Occasion' : 'Shop by Gift Type'}
                </p>
                <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, color: '#262626', fontFamily: 'var(--font-playfair), serif', margin: 0 }}>
                  {displayName}
                </h1>
              </div>
            </div>
            {taxItem?.description && (
              <p style={{ fontSize: '15px', color: '#666', maxWidth: '600px', lineHeight: 1.6 }}>{taxItem.description}</p>
            )}
          </motion.div>
        </div>

        {/* SUBCATEGORIES (if any) */}
        {taxItem?.subcategories && taxItem.subcategories.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#8B8B8B', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
              Browse within {displayName}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {taxItem.subcategories.map(sub => (
                <Link key={sub.id} href={`/gifts/${sub.slug}`}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '8px 16px', borderRadius: '100px',
                    border: '1.5px solid #EFE8E4', background: 'white',
                    fontSize: '13px', fontWeight: 500, color: '#262626',
                    textDecoration: 'none', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#D98C95'; (e.currentTarget as HTMLAnchorElement).style.color = '#D98C95'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#EFE8E4'; (e.currentTarget as HTMLAnchorElement).style.color = '#262626'; }}
                >
                  {sub.icon && <span>{sub.icon}</span>}
                  {sub.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* QUICK ACTIONS */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '36px', flexWrap: 'wrap' }}>
          <Link href={`/gift-finder?occasion=${slug}`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 24px', borderRadius: '100px',
              background: '#D98C95', color: 'white', border: 'none',
              fontSize: '14px', fontWeight: 700, textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(217,140,149,0.35)',
            }}>
            ✨ Find Perfect {displayName} Gift
          </Link>
          <Link href="/catalog"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 24px', borderRadius: '100px',
              background: 'white', color: '#262626',
              border: '1.5px solid #EFE8E4',
              fontSize: '14px', fontWeight: 600, textDecoration: 'none',
            }}>
            <ShoppingBag size={15} /> Browse All Gifts
          </Link>
        </div>

        {/* PRODUCTS GRID */}
        {loadingProducts && products.length === 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <Loader2 size={32} style={{ color: '#D98C95', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>🎁</span>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#262626', marginBottom: '8px' }}>
              No products yet for {displayName}
            </h3>
            <p style={{ color: '#8B8B8B', marginBottom: '24px' }}>
              Our sellers are curating beautiful gifts. Check back soon!
            </p>
            <Link href="/catalog" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 24px', borderRadius: '100px',
              background: '#262626', color: 'white', textDecoration: 'none',
              fontSize: '14px', fontWeight: 700,
            }}>
              Browse All Gifts
            </Link>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              {products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>

            {hasMore && (
              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={loadingProducts}
                  style={{
                    padding: '14px 32px', borderRadius: '100px',
                    background: '#262626', color: 'white', border: 'none',
                    fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                  }}>
                  {loadingProducts ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : null}
                  Load more gifts
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const img = product.images?.[0] || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80';

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}>
      <Link href={`/product/${product.id}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div style={{
          background: 'white', borderRadius: '20px', overflow: 'hidden',
          border: '1px solid #EFE8E4', transition: 'all 0.25s',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}
        >
          {/* Image */}
          <div style={{ aspectRatio: '4/3', overflow: 'hidden', background: '#FFF8F5', position: 'relative' }}>
            <img src={img} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            />
            {product.same_day_available && (
              <div style={{ position: 'absolute', top: 10, left: 10, background: '#5A9E7B', color: 'white', borderRadius: '8px', padding: '3px 8px', fontSize: '10px', fontWeight: 700 }}>
                Same Day
              </div>
            )}
            {product.customizable && (
              <div style={{ position: 'absolute', top: 10, right: 10, background: '#D98C95', color: 'white', borderRadius: '8px', padding: '3px 8px', fontSize: '10px', fontWeight: 700 }}>
                Customizable
              </div>
            )}
          </div>

          {/* Info */}
          <div style={{ padding: '16px' }}>
            <p style={{ fontSize: '11px', color: '#C8A46A', fontWeight: 700, marginBottom: '4px' }}>{product.seller_name}</p>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#262626', marginBottom: '4px', lineHeight: 1.3 }}>{product.name}</h3>
            {product.subtitle && (
              <p style={{ fontSize: '12px', color: '#8B8B8B', marginBottom: '8px' }}>{product.subtitle}</p>
            )}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#262626' }}>₹{product.price}</span>
                {product.original_price && product.original_price > product.price && (
                  <span style={{ fontSize: '12px', color: '#8B8B8B', textDecoration: 'line-through', marginLeft: '6px' }}>₹{product.original_price}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
