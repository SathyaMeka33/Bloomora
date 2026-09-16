/**
 * useTaxonomy — fetches and caches the full Bloomora taxonomy.
 * Cached in memory for the session so it's fetched only once.
 */
'use client';

import { useState, useEffect } from 'react';
import type { TaxonomyData, TaxonomyItem } from '@/lib/api/services/taxonomyApiService';

let _cache: TaxonomyData | null = null;
let _promise: Promise<TaxonomyData> | null = null;

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function fetchTaxonomy(): Promise<TaxonomyData> {
  if (_cache) return _cache;
  if (_promise) return _promise;

  _promise = fetch(`${BASE}/api/taxonomy/`)
    .then((r) => r.json())
    .then((json) => {
      _cache = json.data as TaxonomyData;
      _promise = null;
      return _cache;
    })
    .catch(() => {
      _promise = null;
      return { gift_types: [], occasion_types: [], recipient_types: [], gift_intents: [] };
    });

  return _promise;
}

export function useTaxonomy() {
  const [data, setData] = useState<TaxonomyData>({
    gift_types: [],
    occasion_types: [],
    recipient_types: [],
    gift_intents: [],
  });
  const [loading, setLoading] = useState(!_cache);

  useEffect(() => {
    if (_cache) {
      setData(_cache);
      setLoading(false);
      return;
    }
    fetchTaxonomy().then((d) => {
      setData(d);
      setLoading(false);
    });
  }, []);

  // Helpers
  const getGiftTypeBySlug = (slug: string): TaxonomyItem | undefined =>
    data.gift_types.find((g) => g.slug === slug) ||
    data.gift_types.flatMap((g) => g.subcategories || []).find((g) => g.slug === slug);

  const getOccasionBySlug = (slug: string): TaxonomyItem | undefined =>
    data.occasion_types.find((o) => o.slug === slug) ||
    data.occasion_types.flatMap((o) => o.subcategories || []).find((o) => o.slug === slug);

  const featuredGiftTypes = data.gift_types.filter((g) => g.is_featured);
  const featuredOccasions = data.occasion_types.filter((o) => o.is_featured);

  return {
    ...data,
    loading,
    featuredGiftTypes,
    featuredOccasions,
    getGiftTypeBySlug,
    getOccasionBySlug,
  };
}

export type { TaxonomyItem, TaxonomyData };
