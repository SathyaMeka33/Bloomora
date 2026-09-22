import products1000Data from './products1000.json';

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  story: string;
  price: number;
  originalPrice?: number;
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
  aiRecommendationReason?: string;
  tags?: string[];
  customizable?: boolean;
  partnerId?: string;
  externalProductUrl?: string;
  isSponsored?: boolean;
  isPartnerProduct?: boolean;
  isBloomoraProduct?: boolean;
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
}

export interface Coupon {
  code: string;
  discountPercentage: number;
  maxDiscount: number;
  minOrderValue: number;
  description: string;
}

export interface GiftComboRecommendation {
  id: string;
  title: string;
  reasoning: string;
  totalPrice: number;
  budget: number;
  savings: number;
  items: {
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  packaging: string;
  recommendedCardMessage: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  image: string;
  itemCount: string;
  tag: string;
}

export const CATEGORIES: CategoryItem[] = [
  {
    id: 'bouquets',
    name: 'Floral Bouquets & Arrangements',
    icon: 'Flower2',
    description: 'Fresh Dutch roses, pastel hand-tied sprays & romantic floral art',
    image: '/gifts/Bouquets/IMG_4110.JPG',
    itemCount: '23 Bouquets',
    tag: 'Fresh Daily',
  },
  {
    id: 'cakes',
    name: 'Gourmet Celebration Cakes',
    icon: 'Cake',
    description: 'Artisanal rosette cakes, chocolate drip tortes & milestone patisserie',
    image: '/gifts/Cakes/IMG_4021.JPG',
    itemCount: '22 Cakes',
    tag: 'Freshly Baked',
  },
  {
    id: 'accessories-for-men',
    name: "Men's Accessories & Style",
    icon: 'Crown',
    description: 'Stainless steel bracelets, onyx signet rings, designer watches & sunglasses',
    image: '/gifts/Accessories for mens/128556de8739d8368578a70501d6f90f.jpg',
    itemCount: '32 Items',
    tag: 'Refined Style',
  },
  {
    id: 'customised-hampers',
    name: 'Customised Gift Hampers',
    icon: 'Gift',
    description: 'Bespoke birthday gift boxes, pamper sets & multi-item luxury hampers',
    image: '/gifts/Customised hampers/IMG_4076.JPG',
    itemCount: '13 Hampers',
    tag: 'Curated Gifts',
  },
  {
    id: 'letters',
    name: 'Handcrafted Letters & Seals',
    icon: 'Heart',
    description: 'Aesthetic vintage scrolls, wax-sealed love envelopes & keepsake notes',
    image: '/gifts/Letters/00d2b1c0f895bbf66c1f748d4e4fedf8.jpg',
    itemCount: '18 Letters',
    tag: 'Wax Sealed',
  },
  {
    id: 'plants',
    name: 'Living Plants & Succulents',
    icon: 'Leaf',
    description: 'Mini succulent favors, peace lilies & indoor air-purifying potted botanicals',
    image: '/gifts/Plants/IMG_4094.JPG',
    itemCount: '14 Plants',
    tag: 'Eco Living',
  },
  {
    id: 'stationary-items',
    name: 'Aesthetic Stationery & Pens',
    icon: 'BookOpen',
    description: 'Pastel gel pens, kawaii desk stationery, journal sets & writing accessories',
    image: '/gifts/Stationary items/IMG_4054.JPG',
    itemCount: '27 Sets',
    tag: 'Kawaii & Desk',
  },
  {
    id: 'cars',
    name: 'RC Cars & Speed Racers',
    icon: 'Sparkles',
    description: 'High-speed remote control buggies, monster trucks & drift racing cars',
    image: '/gifts/Cars/5ba9c71057e5ec6f933bc74cdf0d0506.jpg',
    itemCount: '11 Racers',
    tag: 'High Speed',
  },
  // Backward compatibility mappings
  {
    id: 'flowers',
    name: 'Fresh Flowers',
    icon: 'Flower2',
    description: 'Hand-picked floral stems & luxury arrangements',
    image: '/gifts/Bouquets/IMG_4111.JPG',
    itemCount: '23 Stems',
    tag: 'Floral Art',
  },
  {
    id: 'jewellery',
    name: 'Jewellery & Cufflinks',
    icon: 'Crown',
    description: 'Fine stainless steel, signet rings and luxury cufflinks',
    image: '/gifts/Accessories for mens/3c61fe7cf11d1ec646cc00220ee58afa.jpg',
    itemCount: '15 Pieces',
    tag: 'Statement Pieces',
  },
  {
    id: 'personalized',
    name: 'Personalized Keepsakes',
    icon: 'Heart',
    description: 'Handwritten scrolls, custom letters and photo keepsakes',
    image: '/gifts/Letters/17bab517adcb37d16dee007dabff2725.jpg',
    itemCount: '22 Keepsakes',
    tag: 'Custom',
  },
  {
    id: 'books-stationery',
    name: 'Stationery & Journals',
    icon: 'BookOpen',
    description: 'Aesthetic pastel writing essentials & journals',
    image: '/gifts/Stationary items/IMG_4056.JPG',
    itemCount: '27 Items',
    tag: 'Creative Study',
  },
];

export const OCCASIONS = [
  { id: 'birthday', name: 'Birthday Celebration', color: 'from-amber-100 to-rose-100' },
  { id: 'love', name: 'Love & Romance', color: 'from-rose-100 to-red-100' },
  { id: 'anniversary', name: 'Anniversary Milestone', color: 'from-amber-200 to-yellow-100' },
  { id: 'proposal', name: 'Proposal Moment', color: 'from-pink-100 to-rose-200' },
  { id: 'congratulations', name: 'Congratulations', color: 'from-emerald-100 to-teal-100' },
  { id: 'thank-you', name: 'Gratitude & Care', color: 'from-purple-100 to-pink-100' },
];

export const EMOTIONAL_COLLECTIONS = [
  { id: 'for-her', title: 'For Her', description: 'Elegance & romantic charm' },
  { id: 'for-him', title: 'For Him', description: 'Refined & thoughtful keepsakes' },
  { id: 'for-parents', title: 'For Parents', description: 'Warmth & timeless gratitude' },
  { id: 'for-friends', title: 'For Best Friends', description: 'Joyful & sweet celebrations' },
  { id: 'for-colleagues', title: 'For Colleagues & Mentors', description: 'Executive polish and professional appreciation' },
  { id: 'student-budget', title: 'Student Budget', description: 'Pocket-friendly luxury under ₹299' },
  { id: 'hidden-gems', title: 'Hidden Gems', description: 'Unique AI curated combinations' },
];

export const BUDGET_TIERS = [
  { id: 'under-199', label: 'Under ₹199', title: 'Tiny Surprises', subtitle: 'Perfect for students & quick thank-yous', range: [0, 199], badge: 'Pocket Friendly' },
  { id: '200-299', label: '₹200 - ₹299', title: 'Chocolate Moments', subtitle: 'Luxury wrapping included with sweet treats', range: [200, 299], badge: 'Most Popular' },
  { id: '300-499', label: '₹300 - ₹499', title: 'Romantic Classics', subtitle: 'Most loved combination hampers', range: [300, 499], badge: 'Best Value' },
  { id: '500-999', label: '₹500 - ₹999', title: 'Grand Celebrations', subtitle: 'Multi-item keepsakes & truffle boxes', range: [500, 999], badge: 'Premium Hampers' },
  { id: '1000-plus', label: '₹1000+', title: 'Ultimate Luxury Chests', subtitle: 'Carved wooden boxes & preserved roses', range: [1000, 10000], badge: 'Royal Luxury' },
];

export const COUPONS: Coupon[] = [
  { code: 'BLOOM100', discountPercentage: 20, maxDiscount: 100, minOrderValue: 249, description: 'Flat 20% off on your first AI curated gift story' },
  { code: 'MEETME10', discountPercentage: 100, maxDiscount: 10, minOrderValue: 199, description: 'Free Pickup Fee on Meet Me There orders' },
];

export const PRODUCTS: Product[] = products1000Data as unknown as Product[];

export const PARTNER_SHOPS: PartnerShop[] = [
  {
    id: 'shop-surampalem-1',
    name: 'Bloomora Express — Surampalem Hub',
    type: 'Gift Store',
    city: 'Surampalem',
    area: 'Aditya Campus Road',
    address: 'Shop #4, Main Gate Avenue, Near Aditya Engineering College',
    landmark: 'Opposite Student Food Court',
    rating: 4.9,
    distanceKm: 0.8,
    openHours: '8:00 AM - 10:00 PM',
    phone: '+91 98765 43210',
    image: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&w=800&q=80',
    availableLockers: 6,
    isStoreOpen: true,
    deliveryZones: ['Aditya Campus', 'Surampalem Main Road', 'Peddapuram Road'],
  },
  {
    id: 'shop-rajahmundry-1',
    name: 'Royal Rose & Bakers Studio',
    type: 'Bakery',
    city: 'Rajahmundry',
    area: 'Danavaipeta',
    address: 'Door No. 12-4-8, Danavaipeta Main Road',
    landmark: 'Near SKVT College Ground',
    rating: 4.95,
    distanceKm: 1.4,
    openHours: '7:30 AM - 10:30 PM',
    phone: '+91 98765 12345',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    availableLockers: 8,
    isStoreOpen: true,
    deliveryZones: ['Danavaipeta', 'VL Puram', 'Devi Chowk', 'Railway Station Area'],
  },
  {
    id: 'shop-rajahmundry-2',
    name: 'Gowthami Flower Boutique',
    type: 'Flower Shop',
    city: 'Rajahmundry',
    area: 'VL Puram',
    address: 'Plot 45, Beside Devi Chowk Complex',
    landmark: 'Opposite State Bank Colony',
    rating: 4.88,
    distanceKm: 2.1,
    openHours: '6:30 AM - 9:30 PM',
    phone: '+91 98765 67890',
    image: 'https://images.unsplash.com/photo-1567696911980-2eed69a46042?auto=format&fit=crop&w=800&q=80',
    availableLockers: 4,
    isStoreOpen: true,
    deliveryZones: ['VL Puram', 'Kambala Cheruvu', 'Godavari Bund'],
  },
  {
    id: 'shop-vijayawada-1',
    name: 'Benz Circle Luxe Gifts & Cafe',
    type: 'Cafe',
    city: 'Vijayawada',
    area: 'Benz Circle',
    address: '40-1-12, MG Road, Benz Circle',
    landmark: 'Near Trendset Mall',
    rating: 4.92,
    distanceKm: 0.5,
    openHours: '8:00 AM - 11:00 PM',
    phone: '+91 98765 99887',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    availableLockers: 12,
    isStoreOpen: true,
    deliveryZones: ['Benz Circle', 'MG Road', 'Labbipet'],
  },
];
