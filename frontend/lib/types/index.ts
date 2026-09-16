export * from './models';

export type UserRole = 'customer' | 'partner' | 'admin';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phone?: string;
  role: UserRole;
  rewardPoints: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export type ProductCategory = 
  | 'flowers' 
  | 'chocolate-bouquets' 
  | 'gift-hampers' 
  | 'luxury-boxes' 
  | 'personalized' 
  | 'mini-gifts';

export interface ProductVariant {
  id: string;
  name: string;
  priceOffset: number;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  story: string;
  price: number;
  originalPrice?: number;
  discountPrice?: number;
  category: ProductCategory | string;
  occasion: string[];
  recipientTag: 'for-her' | 'for-him' | 'for-parents' | 'for-friends' | 'for-colleagues';
  budgetTier: 'under-199' | '200-299' | '300-499' | '500-999' | '1000-plus';
  images: string[];
  packagingItems: string[];
  rating: number;
  reviewCount: number;
  isBestSeller?: boolean;
  isTrending?: boolean;
  isSeasonal?: boolean;
  isFeatured?: boolean;
  inStock: boolean;
  preparationTimeMinutes: number;
  aiRecommendationReason: string;
  inventory?: number;
  partnerAvailability?: string[];
  tags?: string[];
  variants?: ProductVariant[];
  partnerId?: string;
  partnerName?: string;
  isBloomoraProduct?: boolean;
  isPartnerProduct?: boolean;
  isSponsored?: boolean;
  isExperienceComponent?: boolean;
  approvalStatus?: 'pending_review' | 'approved' | 'changes_requested' | 'rejected';
  adminNotes?: string;
  externalProductUrl?: string;
  fulfillmentOptions?: string[];
  materials?: string;
  dimensions?: string;
  location?: string;
  minOrderQuantity?: number;
  customizationAvailable?: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface PartnerShop {
  id: string;
  name: string;
  type: 'Flower Shop' | 'Bakery' | 'Gift Store' | 'Cafe' | 'Stationery';
  city: string;
  area: string;
  address: string;
  landmark: string;
  rating: number;
  distanceKm: number;
  openHours: string;
  phone: string;
  image: string;
  availableLockers: number;
  isStoreOpen: boolean;
  deliveryZones: string[];
  latitude?: number;
  longitude?: number;
  pickupCapability?: boolean;
  deliveryCapability?: boolean;
  status?: 'active' | 'inactive';
  ownerUserId?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  selectedPackaging?: string;
  customMessage?: string;
  customizationDetails?: string;
  addedAt?: unknown;
}

export interface WishlistItem {
  productId: string;
  addedAt?: unknown;
}

export interface UserReminder {
  id: string;
  userId?: string;
  title: string;
  recipientName: string;
  relationship: string;
  date: string;
  budget: number;
  occasion: string;
  createdAt?: unknown;
}

export interface SavedRecipient {
  id: string;
  userId?: string;
  name: string;
  relationship: string;
  favoriteColors?: string[];
  favoriteChocolates?: string[];
  city: string;
  createdAt?: unknown;
}

export type FulfillmentType = 'pickup' | 'delivery';
export type PaymentMethod = 'razorpay' | 'cod';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type OrderStatus = 'confirmed' | 'preparing' | 'ready_for_pickup' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  selectedPackaging?: string;
  customMessage?: string;
}

export interface GiftStory {
  title: string;
  reasoning: string;
  packaging: string;
  recommendedCardMessage: string;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  fulfillmentType: FulfillmentType;
  selectedShopId?: string;
  selectedShop?: PartnerShop;
  deliveryAddress?: string;
  items: OrderItem[];
  giftStory?: GiftStory;
  subtotal: number;
  discountAmount: number;
  pickupFee: number;
  deliveryFee: number;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  paymentId?: string;
  razorpayOrderId?: string;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  pickupPin?: string;
  partnerId?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface Coupon {
  code: string;
  discountPercentage: number;
  maxDiscount: number;
  minOrderValue: number;
  description: string;
  active?: boolean;
}

export interface GiftComboRecommendation {
  id: string;
  title: string;
  reasoning: string;
  totalPrice: number;
  budget: number;
  savings: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    image: string;
  }>;
  packaging: string;
  recommendedCardMessage: string;
}

export interface AIConciergeInput {
  budget: number;
  occasion: string;
  recipient: string;
  relationship: string;
  city: string;
  deliveryTime: string;
  notes?: string;
  gender?: string;
  ageGroup?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  isSimulated?: boolean;
}
