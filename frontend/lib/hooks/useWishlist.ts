/**
 * useWishlist — API-backed wishlist with auth-gate
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useBloomoraAuth } from './useBloomoraAuth';
import { useRouter } from 'next/navigation';

export interface WishlistProduct {
  id: number;
  name: string;
  subtitle?: string;
  price: number;
  original_price?: number;
  images: string[];
  category: number;
  category_name: string;
  seller_name: string;
  customizable: boolean;
  same_day_available: boolean;
}

export function useWishlist() {
  const { isLoggedIn } = useBloomoraAuth();
  const router = useRouter();
  const [products, setProducts] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!isLoggedIn) {
      setProducts([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/wishlist/`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json();
      // API returns { products: [...] }
      const prods: WishlistProduct[] = Array.isArray(data)
        ? data
        : Array.isArray(data.products)
        ? data.products
        : [];
      setProducts(prods);
    } catch (err) {
      console.error('[useWishlist] load error:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    load();
  }, [load]);

  const ids = new Set(products.map((p) => String(p.id)));

  const toggle = useCallback(
    async (productId: number | string) => {
      if (!isLoggedIn) {
        router.push(
          `/auth/login?next=${encodeURIComponent(window.location.pathname)}`
        );
        return;
      }
      const inList = ids.has(String(productId));

      // Optimistic update
      if (inList) {
        setProducts((prev) => prev.filter((p) => String(p.id) !== String(productId)));
      }

      try {
        const base =
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const token = getToken();

        if (inList) {
          await fetch(`${base}/api/wishlist/${productId}/`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          });
        } else {
          await fetch(`${base}/api/wishlist/`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ product_id: productId }),
          });
          await load(); // refresh to get full product details
        }
      } catch (err) {
        console.error('[useWishlist] toggle error:', err);
        // Revert optimistic update on failure
        await load();
      }
    },
    [isLoggedIn, ids, load, router]
  );

  const isInWishlist = (productId: number | string) => ids.has(String(productId));

  return {
    products,
    loading,
    toggle,
    isInWishlist,
    count: products.length,
    reload: load,
  };
}

/** Read JWT access token from localStorage (matching tokenManager in api/client.ts) */
function getToken(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('bloomora_access_token') || '';
}
