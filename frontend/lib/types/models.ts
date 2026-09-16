import { UserRole } from './index';

// 1. Users Collection
export interface FirestoreUserDoc {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  phone?: string;
  role: UserRole;
  rewardPoints: number;
  savedCart?: FirestoreCartItem[];
  savedWishlist?: string[]; // product IDs
  createdAt?: unknown;
  updatedAt?: unknown;
}

// 2. Products & 6. Partner Products Collection
export type ProductApprovalStatus = 'pending_review' | 'approved' | 'changes_requested' | 'rejected';
export type PartnerFulfillmentType = 'bloomora_delivery' | 'partner_delivery' | 'meet_me_there' | 'external_partner_fulfillment';

export interface FirestoreProductDoc {
  id: string;
  title: string;
  name: string; // compatibility field
  slug: string;
  subtitle: string;
  description: string;
  story: string;
  emotionalRationale?: string;
  price: number;
  originalPrice?: number;
  discountPrice?: number;
  compareAtPrice?: number;
  category: string;
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
  inventory: number;
  minOrderQuantity?: number;
  availability: boolean;
  partnerId?: string;
  partnerName?: string;
  isBloomoraProduct: boolean;
  isPartnerProduct: boolean;
  isSponsored: boolean;
  isExperienceComponent?: boolean;
  approvalStatus?: ProductApprovalStatus;
  adminNotes?: string;
  externalProductUrl?: string;
  fulfillmentOptions: PartnerFulfillmentType[];
  packagingOptions?: string[];
  materials?: string;
  dimensions?: string;
  location?: string;
  customizationAvailable?: boolean;
  pickupAvailable?: boolean;
  deliveryAvailable?: boolean;
  tags?: string[];
  createdAt?: unknown;
  updatedAt?: unknown;
}

// 3. Categories Collection
export interface FirestoreCategoryDoc {
  id: string;
  name: string;
  icon: string;
  description: string;
  displayOrder: number;
  active: boolean;
}

// 4. Occasions Collection
export interface FirestoreOccasionDoc {
  id: string;
  name: string;
  color: string;
  tagline: string;
  active: boolean;
}

// 5. Partners Collection
export interface FirestorePartnerDoc {
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
  latitude: number;
  longitude: number;
  pickupCapability: boolean;
  deliveryCapability: boolean;
  status: 'active' | 'inactive';
  ownerUserId?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

// 7. Inventory Collection
export interface FirestoreInventoryDoc {
  id: string;
  productId: string;
  partnerId?: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  lastRestockedAt?: unknown;
  updatedAt?: unknown;
}

// 8. Orders & 9. OrderItems Collection
export type SellerOrderStatus = 
  | 'NEW'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'READY'
  | 'HANDED_TO_BLOOMORA'
  | 'COMPLETED';

export type ExtendedOrderStatus = 
  | 'PLACED' 
  | 'CONFIRMED' 
  | 'PREPARING' 
  | 'WRAPPING' 
  | 'PARTNER_READY' 
  | 'OUT_FOR_DELIVERY' 
  | 'DELIVERED' 
  | 'CANCELLED'
  | SellerOrderStatus;

export interface FirestoreOrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  selectedPackaging?: string;
  customMessage?: string;
  partnerId?: string;
  sellerOrderStatus?: SellerOrderStatus;
}

export interface FirestoreOrderDoc {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  fulfillmentType: 'pickup' | 'delivery' | PartnerFulfillmentType;
  selectedShopId?: string;
  selectedShop?: FirestorePartnerDoc;
  deliveryAddress?: string;
  items: FirestoreOrderItem[];
  giftStory?: {
    title: string;
    reasoning: string;
    packaging: string;
    recommendedCardMessage: string;
  };
  subtotal: number;
  discountAmount: number;
  pickupFee: number;
  deliveryFee: number;
  grandTotal: number;
  paymentMethod: 'razorpay' | 'cod';
  paymentId?: string;
  razorpayOrderId?: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  status: ExtendedOrderStatus;
  pickupPin?: string;
  partnerId?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

// 10. Cart Collection
export interface FirestoreCartItem {
  productId: string;
  quantity: number;
  selectedPackaging?: string;
  customMessage?: string;
  customizationDetails?: string;
  addedAt?: unknown;
}

export interface FirestoreCartDoc {
  userId: string;
  items: FirestoreCartItem[];
  updatedAt?: unknown;
}

// 11. Wishlist Collection
export interface FirestoreWishlistDoc {
  userId: string;
  productIds: string[];
  updatedAt?: unknown;
}

// 12. Recipients Collection
export interface FirestoreRecipientDoc {
  id: string;
  userId: string;
  name: string;
  relationship: string;
  favoriteColors?: string[];
  favoriteChocolates?: string[];
  city: string;
  createdAt?: unknown;
}

// 13. Reminders Collection
export interface FirestoreReminderDoc {
  id: string;
  userId: string;
  title: string;
  recipientName: string;
  relationship: string;
  date: string;
  budget: number;
  occasion: string;
  createdAt?: unknown;
}

// 14. GiftStories Collection
export interface FirestoreGiftStoryDoc {
  id: string;
  userId?: string;
  title: string;
  reasoning: string;
  totalPrice: number;
  budget: number;
  items: {
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  packaging: string;
  recommendedCardMessage: string;
  createdAt?: unknown;
}

// 15. CustomGifts Collection
export interface FirestoreCustomGiftDoc {
  id: string;
  userId?: string;
  baseProductId: string;
  selectedWrap: string;
  selectedRibbon: string;
  selectedFlowers: string;
  selectedChocolates: string;
  selectedAddons: string[];
  customPhotoUrl?: string;
  greetingMessage: string;
  calculatedPrice: number;
  createdAt?: unknown;
}

// 16. PackagingOptions Collection
export interface FirestorePackagingOptionDoc {
  id: string;
  name: string;
  type: 'normal' | 'premium' | 'chocolate' | 'flower' | 'waterproof';
  price: number;
  colorCode?: string;
  description: string;
  active: boolean;
}

// 17. DeliveryLocations Collection
export interface FirestoreDeliveryLocationDoc {
  id: string;
  city: string;
  pincode: string;
  area: string;
  deliveryFee: number;
  active: boolean;
}

// 18. PickupLocations Collection
export interface FirestorePickupLocationDoc {
  id: string;
  shopId: string;
  shopName: string;
  city: string;
  address: string;
  pickupFee: number; // ₹10 standard
  availableLockers: number;
  active: boolean;
}

// 19. AIRecommendations Collection
export interface FirestoreAIRecommendationDoc {
  id: string;
  sessionId: string;
  userId?: string;
  inputs: {
    budget: number;
    occasion: string;
    recipient: string;
    relationship: string;
    city: string;
    deliveryTime: string;
    notes?: string;
  };
  generatedRecommendation: {
    title: string;
    reasoning: string;
    totalPrice: number;
    packaging: string;
    recommendedCardMessage: string;
  };
  createdAt?: unknown;
}

export type PartnerApplicationStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'suspended';

// 20. PartnerApplications Collection
export interface FirestorePartnerApplicationDoc {
  id: string;
  businessName: string;
  contactName: string;
  ownerName?: string;
  email: string;
  phone: string;
  city: string;
  state?: string;
  pincode?: string;
  businessType: string;
  address: string;
  description?: string;
  serviceLocations?: string[];
  gstNumber?: string;
  bankAccountNumber?: string;
  bankIfscCode?: string;
  bankName?: string;
  accountHolderName?: string;
  logoUrl?: string;
  status: PartnerApplicationStatus;
  rejectionReason?: string;
  appliedAt?: unknown;
  updatedAt?: unknown;
}

// Partner Advertising Analytics Collection
export interface FirestorePartnerAdAnalyticsDoc {
  id: string;
  partnerId: string;
  productId: string;
  impressions: number;
  clicks: number;
  referrals: number;
  conversions: number;
  lastUpdated?: unknown;
}

// 21. Surprise Experiences & Packages Collections
export type SurpriseOccasionType =
  | 'Birthday Surprise'
  | 'Anniversary Surprise'
  | 'Romantic Surprise'
  | 'Partner Surprise'
  | 'Friendship Surprise'
  | 'Workplace Birthday Surprise'
  | 'Congratulations'
  | 'Thank You'
  | 'Formal / Corporate Surprise'
  | 'Custom Surprise';

export type PackageTier = 'mini' | 'classic' | 'signature' | 'grand' | 'custom';

export type SurprisePlannerRequestStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'CONTACTED'
  | 'PLANNING'
  | 'QUOTED'
  | 'CUSTOMER_CONFIRMED'
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export interface FirestoreSurprisePackageDoc {
  id: string;
  experienceId: string;
  tier: PackageTier;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  contents: string[];
  componentProductIds?: string[]; // Includes standalone partner products
  customizationAvailable?: boolean;
  setupIncluded?: boolean;
  active: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface FirestoreSurpriseExperienceDoc {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  occasion: SurpriseOccasionType;
  image: string;
  category: string;
  active: boolean;
  packages: FirestoreSurprisePackageDoc[];
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface FirestoreSurprisePlanDoc {
  id: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  occasion: SurpriseOccasionType;
  relationship: string;
  recipientName: string;
  budget: number;
  date: string;
  preferredTime: string;
  location: string;
  surpriseType: string;
  cakeRequirement?: boolean;
  cakeDetails?: string;
  flowersRequirement?: boolean;
  flowersDetails?: string;
  chocolateRequirement?: boolean;
  chocolateDetails?: string;
  decorationRequirement?: boolean;
  decorationDetails?: string;
  personalizedMessage?: string;
  deliveryOrSetup: PartnerFulfillmentType;
  additionalNotes?: string;
  selectedExperienceId?: string;
  selectedPackageId?: string;
  selectedPackageName?: string;
  selectedProducts?: string[];
  estimatedTotal: number;
  status: 'draft' | 'saved' | 'ordered';
  createdAt?: unknown;
}

// 22. SurprisePlannerRequests Collection (Custom Surprise Execution Requests)
export interface FirestoreSurprisePlannerRequestDoc {
  id: string; // Reference ID e.g. SRP-84920
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  occasion: SurpriseOccasionType | string;
  recipientName: string;
  relationship: string;
  eventDate: string; // Must be at least 3 days in advance
  preferredTime: string;
  city: string;
  locationDetails: string; // Address / venue details
  typeOfSurprise: string; // Workplace, home decor, romantic dinner, etc.
  numberOfPeople?: number;
  budget: number; // Approximate budget
  requiredItems: string[]; // e.g. ['cake', 'flowers', 'decorations', 'gift']
  notes?: string; // Additional instructions
  requestStatus: SurprisePlannerRequestStatus;
  adminNotes?: string;
  quotation?: number;
  assignedPartnerId?: string;
  assignedStaff?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}


