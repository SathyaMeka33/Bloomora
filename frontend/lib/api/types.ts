/**
 * Bloomora API Types
 * TypeScript interfaces for all Django API responses
 */

// === Auth ===
export interface AuthUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: 'customer' | 'seller' | 'admin' | 'support' | 'delivery_partner';
  phone?: string;
  phone_number?: string;
  profile_image?: string;
  gift_preferences: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: AuthUser;
  access: string;
  refresh: string;
}

// === Address ===
export interface Address {
  id: number;
  label: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
  created_at: string;
}

// === Category ===
export interface Category {
  id: number;
  name: string;
  description: string;
  image?: string;
  icon?: string;
  slug: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

// === Product ===
export interface Product {
  id: number;
  seller: number;
  seller_name: string;
  category: number;
  category_name: string;
  name: string;
  subtitle?: string;
  description: string;
  story?: string;
  price: string;
  original_price?: string;
  stock: number;
  images: string[];
  tags: string[];
  customizable: boolean;
  location: string;
  active: boolean;
  featured: boolean;
  is_best_seller: boolean;
  is_trending: boolean;
  emotions: string[];
  recipient_types: string[];
  budget_tier: string;
  same_day_available: boolean;
  delivery_time_hours: number;
  in_stock: boolean;
  average_rating: number;
  review_count: number;
  ai_recommendation_reason: string;
  supports_photo_customization?: boolean;
  supports_text_customization?: boolean;
  personalization_fields?: unknown[];
  delivery_area?: string[];
  preparation_time_minutes?: number;
  created_at: string;
  updated_at: string;
}

export interface ProductsResponse {
  count: number;
  next?: string;
  previous?: string;
  results: Product[];
}

// === Cart ===
export interface CartItem {
  id: number;
  product: number;
  product_name: string;
  quantity: number;
  unit_price_snapshot: string;
  line_total: string;
  personalization?: Record<string, unknown>;
  gift_message?: string;
  packaging?: string;
}

export interface Cart {
  id: number;
  items: CartItem[];
  total: string;
  subtotal?: string | number;
  discount?: string | number;
  item_count?: number;
  created_at: string;
  updated_at: string;
}

// === Order ===
export type OrderStatus =
  | 'pending_payment' | 'paid' | 'processing'
  | 'shipped' | 'out_for_delivery' | 'delivered'
  | 'cancelled' | 'failed';

export interface OrderItem {
  id: number;
  product: number;
  product_name: string;
  quantity: number;
  price_snapshot: string;
  personalization?: Record<string, unknown>;
  gift_message?: string;
  packaging?: string;
  line_total: string;
}

export interface Order {
  id: number;
  total: string;
  address_snapshot: Record<string, string>;
  status: OrderStatus;
  payment_status: string;
  items: OrderItem[];
  gift_message?: string;
  delivery_date?: string;
  tracking_number?: string;
  created_at: string;
  updated_at: string;
}

// === Seller ===
export interface Seller {
  id: number;
  user: number;
  business_name: string;
  description: string;
  location: string;
  approved: boolean;
  creator_story?: string;
  handmade?: boolean;
  profile_image?: string;
  banner_image?: string;
  supports_customization?: boolean;
  supports_same_day?: boolean;
  lead_time_hours?: number;
  delivery_radius_km?: string;
  rating: string;
  total_orders: number;
  created_at: string;
  updated_at: string;
}

// === Review ===
export interface Review {
  id: number;
  product: number;
  user: number;
  user_name: string;
  rating: number;
  comment: string;
  images: string[];
  created_at: string;
  updated_at: string;
}

// === Wishlist ===
export interface Wishlist {
  products: Product[];
}

// === Reminder ===
export interface Reminder {
  id: number;
  title: string;
  recipient_name: string;
  relationship: string;
  occasion: string;
  date: string;
  budget?: string;
  notes?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

// === Gift DNA ===
export interface GiftDNA {
  id: number;
  recipient: number;
  interests: string[];
  personality: string[];
  style: string[];
  dislikes: string[];
  preferred_categories: string[];
  favorite_colors: string[];
  favorite_chocolates: string[];
  notes?: string;
  updated_at: string;
}

// === Gift Memory ===
export interface GiftMemory {
  id: number;
  recipient: number;
  recipient_name: string;
  product?: number;
  product_name_snapshot: string;
  category_snapshot: string;
  occasion: string;
  gifted_at: string;
  rating?: number;
  notes?: string;
  created_at: string;
}

// === Recommendation ===
export interface Recommendation {
  rank: number;
  fit_score: number;
  confidence: number;
  why_this_gift: string;
  product: Product;
  delivery_estimate: string;
  personalization_available?: boolean;
}

export interface RecommendationsResponse {
  intent_id: number;
  total: number;
  recommendations: Recommendation[];
}

// === Gift Intent ===
export interface GiftIntentInput {
  recipient?: { name?: string } | string;
  relationship?: string;
  age?: number;
  occasion?: string;
  emotion?: string;
  interests?: string[];
  personality?: string[];
  budget?: number;
  budget_min?: number;
  location?: string;
  delivery_date?: string;
  urgency?: string;
  free_text?: string;
}

// === Surprise ===
export interface Surprise {
  id: number;
  recipient_name: string;
  recipient_phone?: string;
  occasion: string;
  emotion?: string;
  budget?: string;
  delivery_date?: string;
  delivery_address: Record<string, unknown>;
  gift_message?: string;
  status: string;
  event_type?: string;
  location?: string;
  cake_description?: string;
  flowers_description?: string;
  decorations_description?: string;
  food_description?: string;
  notes?: string;
  total?: string;
  created_at: string;
  updated_at: string;
}

// === AI Chat ===
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  created_at?: string;
}

export interface ChatResponse {
  conversation_id: number;
  response: string;
}

// === AI Greeting ===
export interface GreetingMessageInput {
  recipient: string;
  occasion: string;
  relationship: string;
  emotion?: string;
  tone?: string;
  length?: string;
}

// === Notification ===
export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  data: Record<string, unknown>;
  created_at: string;
}
