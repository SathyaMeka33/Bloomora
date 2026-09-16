'use client';

import { useSyncExternalStore } from 'react';

export type SellerOrderStatus = 'NEW' | 'PREPARING' | 'DISPATCHED' | 'DELIVERED' | 'CANCELLED';

export interface SellerOrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
  customMessage?: string;
  selectedPackaging?: string;
}

export interface SellerOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: string;
  fulfillmentType: 'partner_delivery' | 'meet_me_there';
  lockerNumber?: string;
  status: SellerOrderStatus;
  items: SellerOrderItem[];
  totalAmount: number;
  specialInstructions?: string;
  orderTime: string;
  targetDeliveryTime: string;
}

export interface SellerProduct {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  story?: string;
  price: number;
  discountPrice?: number;
  category: string;
  images: string[];
  inventory: number;
  inStock: boolean;
  preparationTimeMinutes: number;
  fulfillmentOptions: string[];
  materials?: string;
  dimensions?: string;
  approvalStatus: 'approved' | 'pending_review' | 'rejected';
  rating: number;
  reviewCount: number;
}

export interface SellerProfile {
  id: string;
  storeName: string;
  ownerName: string;
  storeCategory: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  operatingHours: string;
  isOpen: boolean;
  bankAccount: {
    accountNumber: string;
    bankName: string;
    ifsc: string;
    accountHolder: string;
  };
  commissionPercentage: number;
  commissionRate: number;
  rating: number;
  payoutBank: string;
  upiId: string;
  deliveryRadiusKm: number;
}

interface SellerStoreState {
  activeRole: 'customer' | 'seller';
  profile: SellerProfile;
  orders: SellerOrder[];
  products: SellerProduct[];
}

const INITIAL_SELLER_PROFILE: SellerProfile = {
  id: 'partner-aditya-surampalem',
  storeName: 'Royal Rose & Bakers Studio',
  ownerName: 'Venkatesh Rao',
  storeCategory: 'Artisanal Bakery & Floral Atelier',
  phone: '+91 98765 43210',
  email: 'partner.royalrose@bloomora.in',
  city: 'Surampalem / Rajahmundry',
  address: 'Shop #4, Main Gate Avenue, Near Aditya Engineering College Campus',
  operatingHours: '08:00 AM – 10:00 PM',
  isOpen: true,
  bankAccount: {
    accountNumber: '••••••••4892',
    bankName: 'HDFC Bank, Rajahmundry Main Branch',
    ifsc: 'HDFC0001248',
    accountHolder: 'Royal Rose & Bakers Studio LLP',
  },
  commissionPercentage: 10,
  commissionRate: 10,
  rating: 4.9,
  payoutBank: 'HDFC Bank - A/C ••••4892 (IFSC: HDFC0001248)',
  upiId: 'royalrose.surampalem@okhdfcbank',
  deliveryRadiusKm: 15,
};

const INITIAL_SELLER_ORDERS: SellerOrder[] = [
  {
    id: 'ORD-8821',
    customerName: 'Ananya Sharma',
    customerPhone: '+91 98480 22334',
    customerEmail: 'ananya.sharma@example.com',
    deliveryAddress: 'Room 214, Staff Quarters, Aditya Campus, ADB Road, Surampalem',
    fulfillmentType: 'partner_delivery',
    status: 'NEW',
    totalAmount: 599,
    specialInstructions: 'Please tie with extra golden satin ribbon and include the handwritten card.',
    orderTime: 'Just now (12 mins ago)',
    targetDeliveryTime: 'Today by 6:00 PM',
    items: [
      {
        id: 'prod-flower-12roses',
        name: '12 Red Roses Luxe Botanical Bouquet',
        quantity: 1,
        price: 599,
        image: '/products/flowers/default/12-red-flowers-bouquet-1.png',
        customMessage: 'Happy Birthday Sis! Always shining bright.',
        selectedPackaging: 'Signature Matte Wrap with Gold Ribbon',
      },
    ],
  },
  {
    id: 'ORD-8819',
    customerName: 'Vikram Verma',
    customerPhone: '+91 94401 55678',
    customerEmail: 'vikram.verma@example.com',
    deliveryAddress: 'Meet-Me-There Destination Locker Hub, Surampalem',
    fulfillmentType: 'meet_me_there',
    lockerNumber: 'Locker #04 (Code: 8491)',
    status: 'PREPARING',
    totalAmount: 399,
    specialInstructions: 'Keep chilled. Birthday candle and wooden fork required.',
    orderTime: '45 mins ago',
    targetDeliveryTime: 'Today by 4:30 PM',
    items: [
      {
        id: 'prod-cake-bento',
        name: 'Bento Belgian Dark Chocolate Truffle Cake',
        quantity: 1,
        price: 399,
        image: '/products/cakes/default/bento-chocolate-truffle-mini-cake-1.png',
        customMessage: 'Happy Birthday Bro! Enjoy the treat.',
        selectedPackaging: 'Pastel Bento Box with Wax Seal',
      },
    ],
  },
  {
    id: 'ORD-8815',
    customerName: 'Priya Reddy',
    customerPhone: '+91 98850 99887',
    customerEmail: 'priya.reddy@example.com',
    deliveryAddress: 'Flat 402, Godavari Grandeur, Danavaipeta, Rajahmundry',
    fulfillmentType: 'partner_delivery',
    status: 'DISPATCHED',
    totalAmount: 1499,
    specialInstructions: 'Handle with extreme care. Cylindrical velvet hatbox is fragile.',
    orderTime: '2 hours ago',
    targetDeliveryTime: 'Out for Delivery (Rider: Suresh K.)',
    items: [
      {
        id: 'prod-bouquet-velvet',
        name: 'Signature Velvet Box Rose Arrangement',
        quantity: 1,
        price: 1499,
        image: '/products/bouquets/default/velvet-box-arrangement-2.png',
        customMessage: 'To my favorite person, on our milestone anniversary.',
        selectedPackaging: 'Cylindrical Velvet Hatbox with Satin Ribbon',
      },
    ],
  },
  {
    id: 'ORD-8790',
    customerName: 'Rajesh Gupta',
    customerPhone: '+91 97000 11223',
    customerEmail: 'rajesh.gupta@enterprise.in',
    deliveryAddress: 'Executive Suite 3B, Tech Park Avenue, Rajahmundry',
    fulfillmentType: 'partner_delivery',
    status: 'DELIVERED',
    totalAmount: 4899,
    specialInstructions: 'Delivered to reception desk. Signed by recipient.',
    orderTime: 'Yesterday, 5:40 PM',
    targetDeliveryTime: 'Delivered at 6:15 PM',
    items: [
      {
        id: 'prod-prem-imperial',
        name: 'Imperial Heritage Brass-Fitted Royal Chest',
        quantity: 1,
        price: 4899,
        image: '/products/premium/imperial-heritage-hamper/whatsapp-image-2026-09-14-at-5-16-43-pm-1.jpeg',
        customMessage: 'With deep gratitude for your partnership and leadership.',
        selectedPackaging: 'Brass-Fitted Heirloom Hardwood Chest',
      },
    ],
  },
  {
    id: 'ORD-8765',
    customerName: 'Sneha Rao',
    customerPhone: '+91 99890 44556',
    customerEmail: 'sneha.rao@example.com',
    deliveryAddress: 'House 12, Rose Villa, Kakinada Road, Surampalem',
    fulfillmentType: 'partner_delivery',
    status: 'DELIVERED',
    totalAmount: 899,
    specialInstructions: 'Placed at doorstep as requested.',
    orderTime: '2 days ago',
    targetDeliveryTime: 'Delivered',
    items: [
      {
        id: 'prod-2',
        name: 'The Golden Truffle & Satin Treasure',
        quantity: 1,
        price: 899,
        image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80',
        customMessage: 'Congratulations on your new home!',
        selectedPackaging: 'Midnight Black Rigid Box',
      },
    ],
  },
];

const INITIAL_SELLER_PRODUCTS: SellerProduct[] = [
  {
    id: 'prod-cake-bento',
    name: 'Bento Belgian Dark Chocolate Truffle Cake',
    subtitle: 'Artisanal Single-Portion Mini Cake with 55% Ganache',
    description: 'Freshly baked daily with single-origin cocoa and silky ganache.',
    price: 399,
    discountPrice: 349,
    category: 'cakes',
    images: ['/products/cakes/default/bento-chocolate-truffle-mini-cake-1.png'],
    inventory: 24,
    inStock: true,
    preparationTimeMinutes: 20,
    fulfillmentOptions: ['partner_delivery', 'meet_me_there'],
    materials: 'Flour, Belgian Cocoa, Cream, Butter, Sugar',
    dimensions: '4 inch diameter x 2.5 inch height',
    approvalStatus: 'approved',
    rating: 4.93,
    reviewCount: 420,
  },
  {
    id: 'prod-flower-12roses',
    name: '12 Red Roses Luxe Botanical Bouquet',
    subtitle: '12 Long-Stem Dutch Roses with Gypsophila & Golden Wrap',
    description: 'Flawless Grade-A Dutch roses with floral food nutrient pack.',
    price: 599,
    discountPrice: 499,
    category: 'flowers',
    images: ['/products/flowers/default/12-red-flowers-bouquet-1.png'],
    inventory: 35,
    inStock: true,
    preparationTimeMinutes: 15,
    fulfillmentOptions: ['partner_delivery', 'meet_me_there'],
    materials: 'Grade-A Fresh Dutch Roses, Eucalyptus foliage, Matte Wrap',
    dimensions: '45cm height x 30cm width',
    approvalStatus: 'approved',
    rating: 4.95,
    reviewCount: 392,
  },
  {
    id: 'prod-bouquet-velvet',
    name: 'Signature Velvet Box Rose Arrangement',
    subtitle: 'Handcrafted Roses in Matte Cylindrical Velvet Hatbox',
    description: 'Regal floral presentation with hydration core pad to keep flowers vibrant for days.',
    price: 1499,
    discountPrice: 1399,
    category: 'bouquets',
    images: ['/products/bouquets/default/velvet-box-arrangement-2.png'],
    inventory: 12,
    inStock: true,
    preparationTimeMinutes: 25,
    fulfillmentOptions: ['partner_delivery', 'meet_me_there'],
    materials: 'Velvet Hatbox, Dutch Roses, Gypsophila, Hydration Foam',
    dimensions: '22cm diameter x 25cm height',
    approvalStatus: 'approved',
    rating: 4.96,
    reviewCount: 248,
  },
  {
    id: 'prod-prem-imperial',
    name: 'Imperial Heritage Brass-Fitted Royal Chest',
    subtitle: '4 Luxury Nut Jars + Swiss Pralines + Kahwa Tea + Candle',
    description: 'Heirloom dual-layer solid wood chest with brass latches.',
    price: 4899,
    discountPrice: 4699,
    category: 'premium-gifts',
    images: ['/products/premium/imperial-heritage-hamper/whatsapp-image-2026-09-14-at-5-16-43-pm-1.jpeg'],
    inventory: 6,
    inStock: true,
    preparationTimeMinutes: 40,
    fulfillmentOptions: ['partner_delivery'],
    materials: 'Solid Sheesham Wood, Pure Brass Fittings, Velvet, Dry Fruits',
    dimensions: '35cm x 25cm x 15cm',
    approvalStatus: 'approved',
    rating: 5.0,
    reviewCount: 89,
  },
];

let sellerState: SellerStoreState = {
  activeRole: 'customer',
  profile: INITIAL_SELLER_PROFILE,
  orders: INITIAL_SELLER_ORDERS,
  products: INITIAL_SELLER_PRODUCTS,
};

let initialized = false;

function initSellerFromStorage() {
  if (typeof window === 'undefined' || initialized) return;
  initialized = true;
  try {
    const role = localStorage.getItem('bloomora_active_role');
    if (role === 'customer' || role === 'seller') {
      sellerState.activeRole = role;
    }

    const savedOrders = localStorage.getItem('bloomora_seller_orders');
    if (savedOrders) {
      sellerState.orders = JSON.parse(savedOrders);
    } else {
      localStorage.setItem('bloomora_seller_orders', JSON.stringify(INITIAL_SELLER_ORDERS));
    }

    const savedProducts = localStorage.getItem('bloomora_seller_products');
    if (savedProducts) {
      sellerState.products = JSON.parse(savedProducts);
    } else {
      localStorage.setItem('bloomora_seller_products', JSON.stringify(INITIAL_SELLER_PRODUCTS));
    }

    const savedProfile = localStorage.getItem('bloomora_seller_profile');
    if (savedProfile) {
      sellerState.profile = { ...INITIAL_SELLER_PROFILE, ...JSON.parse(savedProfile) };
    } else {
      localStorage.setItem('bloomora_seller_profile', JSON.stringify(INITIAL_SELLER_PROFILE));
    }
  } catch (err) {
    console.error('Error initializing seller store', err);
  }
}

const sellerListeners = new Set<() => void>();

function notifySeller() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('bloomora_active_role', sellerState.activeRole);
      localStorage.setItem('bloomora_seller_orders', JSON.stringify(sellerState.orders));
      localStorage.setItem('bloomora_seller_products', JSON.stringify(sellerState.products));
      localStorage.setItem('bloomora_seller_profile', JSON.stringify(sellerState.profile));
    } catch {}
  }
  sellerListeners.forEach((listener) => listener());
}

function subscribeSeller(listener: () => void) {
  sellerListeners.add(listener);
  return () => {
    sellerListeners.delete(listener);
  };
}

function getSellerSnapshot() {
  if (!initialized && typeof window !== 'undefined') {
    initSellerFromStorage();
  }
  return sellerState;
}

function getServerSellerSnapshot() {
  return {
    activeRole: 'customer' as const,
    profile: INITIAL_SELLER_PROFILE,
    orders: INITIAL_SELLER_ORDERS,
    products: INITIAL_SELLER_PRODUCTS,
  };
}

export function useSellerStore() {
  const state = useSyncExternalStore(subscribeSeller, getSellerSnapshot, getServerSellerSnapshot);

  // Role switching
  const setActiveRole = (role: 'customer' | 'seller') => {
    sellerState = { ...sellerState, activeRole: role };
    notifySeller();
  };

  // Order status transitions
  const updateOrderStatus = (orderId: string, newStatus: SellerOrderStatus) => {
    const updated = sellerState.orders.map((o) =>
      o.id === orderId ? { ...o, status: newStatus } : o
    );
    sellerState = { ...sellerState, orders: updated };
    notifySeller();
  };

  // Add Product
  const addSellerProduct = (data: Omit<SellerProduct, 'id' | 'rating' | 'reviewCount' | 'approvalStatus'>) => {
    const newProduct: SellerProduct = {
      ...data,
      id: `prod-partner-${Date.now()}`,
      approvalStatus: 'approved',
      rating: 5.0,
      reviewCount: 1,
    };
    sellerState = {
      ...sellerState,
      products: [newProduct, ...sellerState.products],
    };
    notifySeller();
    return newProduct;
  };

  // Update Inventory Stock
  const updateProductStock = (productId: string, stock: number, inStockOverride?: boolean) => {
    const updated = sellerState.products.map((p) => {
      if (p.id !== productId) return p;
      const isAvailable = inStockOverride !== undefined ? inStockOverride : stock > 0;
      return { ...p, inventory: stock, inStock: isAvailable };
    });
    sellerState = { ...sellerState, products: updated };
    notifySeller();
  };

  // Delete Product
  const deleteProduct = (productId: string) => {
    const updated = sellerState.products.filter((p) => p.id !== productId);
    sellerState = { ...sellerState, products: updated };
    notifySeller();
  };

  // Toggle Store Vacation/Open status
  const toggleStoreStatus = () => {
    const updatedProfile = {
      ...sellerState.profile,
      isOpen: !sellerState.profile.isOpen,
    };
    sellerState = { ...sellerState, profile: updatedProfile };
    notifySeller();
  };

  // Update Store Profile
  const updateStoreProfile = (partial: Partial<SellerProfile>) => {
    const updatedProfile = { ...sellerState.profile, ...partial };
    sellerState = { ...sellerState, profile: updatedProfile };
    notifySeller();
  };

  // KPI Calculations
  const totalRevenue = state.orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingOrdersCount = state.orders.filter(
    (o) => o.status === 'NEW' || o.status === 'PREPARING'
  ).length;

  const deliveredOrdersCount = state.orders.filter(
    (o) => o.status === 'DELIVERED'
  ).length;

  const dispatchedOrdersCount = state.orders.filter(
    (o) => o.status === 'DISPATCHED'
  ).length;

  const commissionAmount = Math.round((totalRevenue * state.profile.commissionPercentage) / 100);
  const netEarnings = Math.max(0, totalRevenue - commissionAmount);

  return {
    activeRole: state.activeRole,
    profile: state.profile,
    orders: state.orders,
    products: state.products,
    totalRevenue,
    pendingOrdersCount,
    deliveredOrdersCount,
    dispatchedOrdersCount,
    commissionAmount,
    netEarnings,
    setActiveRole,
    updateOrderStatus,
    addSellerProduct,
    updateProductStock,
    deleteProduct,
    toggleStoreStatus,
    updateStoreProfile,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SELLER AUTHENTICATION & CREDENTIALS REGISTRY
// ─────────────────────────────────────────────────────────────────────────────

export interface RegisteredSellerAccount {
  email: string;
  password: string;
  storeName: string;
  ownerName: string;
  phone: string;
  city: string;
  storeCategory: string;
}

const DEFAULT_SELLER_ACCOUNTS: RegisteredSellerAccount[] = [
  {
    email: 'seller@bloomora.com',
    password: 'Bloomora@2026',
    storeName: 'Royal Rose & Bakers Studio',
    ownerName: 'Venkatesh Rao',
    phone: '+91 98765 43210',
    city: 'Surampalem / Rajahmundry',
    storeCategory: 'Artisanal Bakery & Floral Atelier',
  },
  {
    email: 'partner.royalrose@bloomora.in',
    password: 'Bloomora@2026',
    storeName: 'Royal Rose & Bakers Studio',
    ownerName: 'Venkatesh Rao',
    phone: '+91 98765 43210',
    city: 'Surampalem / Rajahmundry',
    storeCategory: 'Artisanal Bakery & Floral Atelier',
  },
];

export function getRegisteredSellerAccounts(): RegisteredSellerAccount[] {
  if (typeof window === 'undefined') return DEFAULT_SELLER_ACCOUNTS;
  try {
    const stored = localStorage.getItem('bloomora_registered_sellers');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return [...DEFAULT_SELLER_ACCOUNTS, ...parsed];
      }
    }
  } catch (e) {
    console.error('Failed to parse registered sellers', e);
  }
  return DEFAULT_SELLER_ACCOUNTS;
}

export function saveRegisteredSellerAccount(account: RegisteredSellerAccount): void {
  if (typeof window === 'undefined') return;
  try {
    const accounts = getRegisteredSellerAccounts();
    const cleanEmail = account.email.trim().toLowerCase();
    const filtered = accounts.filter(
      (a) => a.email.toLowerCase() !== cleanEmail &&
             !DEFAULT_SELLER_ACCOUNTS.some((d) => d.email.toLowerCase() === a.email.toLowerCase())
    );
    filtered.push({ ...account, email: cleanEmail });
    localStorage.setItem('bloomora_registered_sellers', JSON.stringify(filtered));
  } catch (e) {
    console.error('Failed to save registered seller', e);
  }
}

export function authenticateSeller(
  email: string,
  password: string
): { success: boolean; error?: string; account?: RegisteredSellerAccount } {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = password.trim();

  if (!cleanEmail || !cleanPass) {
    return { success: false, error: 'Please enter both your seller email and password.' };
  }

  const accounts = getRegisteredSellerAccounts();
  const match = accounts.find(
    (a) => a.email.toLowerCase() === cleanEmail && a.password === cleanPass
  );

  if (match) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bloomora_seller_authenticated', 'true');
      localStorage.setItem('bloomora_active_role', 'seller');
    }
    return { success: true, account: match };
  }

  return {
    success: false,
    error: 'Invalid merchant credentials. Please check your seller email and password.',
  };
}

export function isSellerAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('bloomora_seller_authenticated') === 'true';
}

export function clearSellerAuthentication(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('bloomora_seller_authenticated');
  localStorage.removeItem('bloomora_active_role');
}

