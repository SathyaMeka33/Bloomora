'use client';

import { useSyncExternalStore } from 'react';
import { Product, PartnerShop, PARTNER_SHOPS, COUPONS, Coupon } from './mockData';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedPackaging?: string;
  customMessage?: string;
  customizationDetails?: string;
}

export interface UserReminder {
  id: string;
  recipient_name: string;
  relationship: string;
  occasion: string;
  reminder_date: string;
  days_before: number;
  budget: number;
  notes?: string;
  is_active: boolean;
  days_until?: number;
  title?: string;
}

export interface SavedRecipient {
  id: string;
  name: string;
  relationship: string;
  favoriteColors?: string[];
  favoriteChocolates?: string[];
  city: string;
}

export interface SavedAddress {
  id: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
}

interface BloomoraStoreState {
  cart: CartItem[];
  wishlist: string[];
  recentlyViewed: string[];
  fulfillmentType: 'pickup' | 'delivery';
  selectedShop: PartnerShop;
  deliveryAddress: string;
  appliedCoupon: Coupon | null;
  rewardPoints: number;
  savedRecipients: SavedRecipient[];
  savedBudgets: number[];
  reminders: UserReminder[];
  addresses: SavedAddress[];
}

const DEFAULT_SHOP = PARTNER_SHOPS[0];

const INITIAL_STATE: BloomoraStoreState = {
  cart: [],
  wishlist: [],
  recentlyViewed: [],
  fulfillmentType: 'pickup',
  selectedShop: DEFAULT_SHOP,
  deliveryAddress: 'Surampalem Aditya Campus, Andhra Pradesh',
  appliedCoupon: COUPONS[0],
  rewardPoints: 350,
  savedRecipients: [
    { id: 'rec-1', name: 'Ananya', relationship: 'Sister', city: 'Rajahmundry' },
    { id: 'rec-2', name: 'Vikram', relationship: 'Best Friend', city: 'Surampalem' },
  ],
  savedBudgets: [250, 499, 999],
  reminders: [
    {
      id: 'rem-1',
      recipient_name: 'Ananya',
      relationship: 'Sister',
      occasion: 'Birthday',
      reminder_date: '2026-10-15',
      days_before: 3,
      budget: 500,
      notes: 'Loves dark chocolate truffle cakes and fresh Dutch roses.',
      is_active: true,
      days_until: 29,
    },
    {
      id: 'rem-2',
      recipient_name: 'Mom & Dad',
      relationship: 'Parents',
      occasion: 'Anniversary',
      reminder_date: '2026-11-20',
      days_before: 5,
      budget: 2500,
      notes: 'Order Silver Reserve dry fruit hamper.',
      is_active: true,
      days_until: 65,
    },
  ],
  addresses: [
    {
      id: 'addr-1',
      label: 'Home',
      line1: 'Flat 402, Godavari Grandeur, Danavaipeta',
      line2: 'Near SKVT College Ground',
      city: 'Rajahmundry',
      state: 'Andhra Pradesh',
      pincode: '533103',
      is_default: true,
    },
    {
      id: 'addr-2',
      label: 'Campus / Office',
      line1: 'Room 214, Staff Quarters, Aditya Campus',
      line2: 'ADB Road, Surampalem',
      city: 'Surampalem',
      state: 'Andhra Pradesh',
      pincode: '533437',
      is_default: false,
    },
  ],
};

let storeState: BloomoraStoreState = { ...INITIAL_STATE };
let initialized = false;

function initFromLocalStorage() {
  if (typeof window === 'undefined' || initialized) return;
  initialized = true;
  try {
    const localCart = localStorage.getItem('bloomora_cart');
    if (localCart) storeState.cart = JSON.parse(localCart);

    const localWishlist = localStorage.getItem('bloomora_wishlist');
    if (localWishlist) storeState.wishlist = JSON.parse(localWishlist);

    const localReminders = localStorage.getItem('bloomora_reminders');
    if (localReminders) storeState.reminders = JSON.parse(localReminders);

    const localAddresses = localStorage.getItem('bloomora_addresses');
    if (localAddresses) storeState.addresses = JSON.parse(localAddresses);
  } catch (err) {
    console.error('Error loading Bloomora store from localStorage', err);
  }
}

const listeners = new Set<() => void>();

function notify() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('bloomora_cart', JSON.stringify(storeState.cart));
      localStorage.setItem('bloomora_wishlist', JSON.stringify(storeState.wishlist));
      localStorage.setItem('bloomora_reminders', JSON.stringify(storeState.reminders));
      localStorage.setItem('bloomora_addresses', JSON.stringify(storeState.addresses));
    } catch {}
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  if (!initialized && typeof window !== 'undefined') {
    initFromLocalStorage();
  }
  return storeState;
}

function getServerSnapshot() {
  return INITIAL_STATE;
}

export function useBloomoraStore() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const addToCart = (product: Product, quantity = 1, selectedPackaging?: string, customMessage?: string) => {
    const current = [...storeState.cart];
    const existingIndex = current.findIndex(
      (item) => item.product.id === product.id && item.selectedPackaging === selectedPackaging
    );

    if (existingIndex > -1) {
      current[existingIndex] = {
        ...current[existingIndex],
        quantity: current[existingIndex].quantity + quantity,
      };
    } else {
      current.push({ product, quantity, selectedPackaging, customMessage });
    }

    storeState = { ...storeState, cart: current };
    notify();
  };

  const removeFromCart = (productId: string) => {
    const current = storeState.cart.filter((item) => item.product.id !== productId);
    storeState = { ...storeState, cart: current };
    notify();
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const current = storeState.cart.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item
    );
    storeState = { ...storeState, cart: current };
    notify();
  };

  const clearCart = () => {
    storeState = { ...storeState, cart: [] };
    notify();
  };

  const toggleWishlist = (productId: string) => {
    const exists = storeState.wishlist.includes(productId);
    const updated = exists
      ? storeState.wishlist.filter((id) => id !== productId)
      : [...storeState.wishlist, productId];

    storeState = { ...storeState, wishlist: updated };
    notify();
    return !exists;
  };

  const isInWishlist = (productId: string) => {
    return state.wishlist.includes(productId);
  };

  const addRecentlyViewed = (productId: string) => {
    const updated = [productId, ...storeState.recentlyViewed.filter((id) => id !== productId)].slice(0, 8);
    storeState = { ...storeState, recentlyViewed: updated };
    notify();
  };

  const applyCouponCode = (code: string) => {
    const found = COUPONS.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());
    if (found) {
      storeState = { ...storeState, appliedCoupon: found };
      notify();
      return { success: true, message: `Applied coupon ${found.code}! Flat ${found.discountPercentage}% off.` };
    }
    return { success: false, message: 'Invalid coupon code. Try BLOOM100 for 20% off.' };
  };

  const setFulfillmentType = (type: 'pickup' | 'delivery') => {
    storeState = { ...storeState, fulfillmentType: type };
    notify();
  };

  const setSelectedShop = (shop: PartnerShop) => {
    storeState = { ...storeState, selectedShop: shop };
    notify();
  };

  const setDeliveryAddress = (addr: string) => {
    storeState = { ...storeState, deliveryAddress: addr };
    notify();
  };

  // Reminders Management
  const addReminder = (data: Omit<UserReminder, 'id' | 'days_until'>) => {
    const now = new Date();
    const target = new Date(data.reminder_date);
    const diff = Math.max(0, Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

    const newReminder: UserReminder = {
      ...data,
      id: `rem-${Date.now()}`,
      days_until: diff,
      is_active: true,
    };

    storeState = {
      ...storeState,
      reminders: [newReminder, ...storeState.reminders],
    };
    notify();
    return newReminder;
  };

  const deleteReminder = (id: string) => {
    storeState = {
      ...storeState,
      reminders: storeState.reminders.filter((r) => r.id !== id),
    };
    notify();
  };

  // Addresses Management
  const addAddress = (data: Omit<SavedAddress, 'id'>) => {
    const newAddr: SavedAddress = {
      ...data,
      id: `addr-${Date.now()}`,
    };

    let updated = [...storeState.addresses];
    if (newAddr.is_default) {
      updated = updated.map((a) => ({ ...a, is_default: false }));
    }
    updated.unshift(newAddr);

    storeState = { ...storeState, addresses: updated };
    notify();
    return newAddr;
  };

  const deleteAddress = (id: string) => {
    storeState = {
      ...storeState,
      addresses: storeState.addresses.filter((a) => a.id !== id),
    };
    notify();
  };

  const setDefaultAddress = (id: string) => {
    storeState = {
      ...storeState,
      addresses: storeState.addresses.map((a) => ({
        ...a,
        is_default: a.id === id,
      })),
    };
    notify();
  };

  const subtotal = state.cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = state.appliedCoupon
    ? Math.min(state.appliedCoupon.maxDiscount, (subtotal * state.appliedCoupon.discountPercentage) / 100)
    : 0;
  const pickupFee = state.fulfillmentType === 'pickup' ? 10 : 0;
  const deliveryFee = subtotal >= 499 || state.fulfillmentType === 'pickup' ? 0 : 49;
  const grandTotal = Math.max(0, subtotal - discountAmount + pickupFee + deliveryFee);
  const totalItemCount = state.cart.reduce((acc, item) => acc + item.quantity, 0);

  return {
    cart: state.cart,
    wishlist: state.wishlist,
    recentlyViewed: state.recentlyViewed,
    fulfillmentType: state.fulfillmentType,
    selectedShop: state.selectedShop,
    deliveryAddress: state.deliveryAddress,
    reminders: state.reminders,
    addresses: state.addresses,
    savedRecipients: state.savedRecipients,
    savedBudgets: state.savedBudgets,
    appliedCoupon: state.appliedCoupon,
    discountAmount,
    rewardPoints: state.rewardPoints,
    subtotal,
    pickupFee,
    deliveryFee,
    grandTotal,
    totalItemCount,
    setFulfillmentType,
    setSelectedShop,
    setDeliveryAddress,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleWishlist,
    isInWishlist,
    addRecentlyViewed,
    applyCouponCode,
    addReminder,
    deleteReminder,
    addAddress,
    deleteAddress,
    setDefaultAddress,
  };
}
