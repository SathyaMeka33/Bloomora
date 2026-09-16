/**
 * useCart — API-backed cart with auth-gate and local fallback
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useBloomoraAuth } from './useBloomoraAuth';
import { useRouter } from 'next/navigation';

export interface CartLineItem {
  id: number;
  product_id: string;
  product_name: string;
  product_image: string;
  product_price: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  packaging?: string;
  custom_message?: string;
}

export interface CartSummary {
  items: CartLineItem[];
  subtotal: number;
  discount: number;
  total: number;
  item_count: number;
}

const EMPTY: CartSummary = { items: [], subtotal: 0, discount: 0, total: 0, item_count: 0 };

export function useCart() {
  const { isLoggedIn } = useBloomoraAuth();
  const router = useRouter();
  const [cart, setCart] = useState<CartSummary>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!isLoggedIn) { setCart(EMPTY); return; }
    setLoading(true);
    try {
      const { cartApiService } = await import('@/lib/api');
      const data = await cartApiService.getCart();
      setCart({
        items: (data.items || []) as unknown as CartLineItem[],
        subtotal: Number(data.subtotal || 0),
        discount: Number(data.discount || 0),
        total: Number(data.total || 0),
        item_count: Number(data.item_count || 0),
      });
    } catch { /* silent */ } finally { setLoading(false); }
  }, [isLoggedIn]);

  useEffect(() => { load(); }, [load]);

  const addItem = useCallback(async (productId: string, qty = 1, packaging?: string, message?: string) => {
    if (!isLoggedIn) {
      router.push(`/auth/login?next=${encodeURIComponent(window.location.pathname)}`);
      return false;
    }
    setAdding(productId);
    try {
      const { cartApiService } = await import('@/lib/api');
      await cartApiService.addItem(Number(productId), qty, packaging ? { packaging } : undefined, message);
      await load();
      return true;
    } catch { return false; } finally { setAdding(null); }
  }, [isLoggedIn, load, router]);

  const removeItem = useCallback(async (itemId: number) => {
    try {
      const { cartApiService } = await import('@/lib/api');
      await cartApiService.removeItem(itemId);
      await load();
    } catch { /* silent */ }
  }, [load]);

  const updateQty = useCallback(async (itemId: number, qty: number) => {
    try {
      const { cartApiService } = await import('@/lib/api');
      await cartApiService.updateItem(itemId, qty);
      await load();
    } catch { /* silent */ }
  }, [load]);

  const clearCart = useCallback(async () => {
    try {
      const { cartApiService } = await import('@/lib/api');
      await cartApiService.clearCart();
      setCart(EMPTY);
    } catch { /* silent */ }
  }, []);

  return { cart, loading, adding, addItem, removeItem, updateQty, clearCart, reload: load };
}
