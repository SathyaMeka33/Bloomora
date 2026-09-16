import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { Product, PartnerShop, PRODUCTS, PARTNER_SHOPS } from './mockData';
import { UserReminder, SavedRecipient } from './store';

export interface OrderData {
  id?: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  fulfillmentType: 'pickup' | 'delivery';
  selectedShop?: PartnerShop;
  deliveryAddress?: string;
  items: Array<{
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    selectedPackaging?: string;
    customMessage?: string;
  }>;
  subtotal: number;
  discountAmount: number;
  pickupFee: number;
  deliveryFee: number;
  grandTotal: number;
  paymentMethod: 'razorpay' | 'cod';
  paymentId?: string;
  razorpayOrderId?: string;
  status: 'confirmed' | 'preparing' | 'ready_for_pickup' | 'out_for_delivery' | 'delivered';
  createdAt?: unknown;
}

// 1. Fetch & Seed Products
export async function getProductsFromDb(): Promise<Product[]> {
  if (!db) return PRODUCTS;
  try {
    const colRef = collection(db, 'products');
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      console.log('Seeding products to Firestore...');
      for (const prod of PRODUCTS) {
        await setDoc(doc(db, 'products', prod.id), prod);
      }
      return PRODUCTS;
    }
    return snapshot.docs.map((docSnap) => docSnap.data() as Product);
  } catch (error) {
    console.warn('Firestore fetch failed, falling back to local dataset:', error);
    return PRODUCTS;
  }
}

// 2. Fetch & Seed Partner Shops
export async function getPartnerShopsFromDb(): Promise<PartnerShop[]> {
  if (!db) return PARTNER_SHOPS;
  try {
    const colRef = collection(db, 'partner_shops');
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      console.log('Seeding partner shops to Firestore...');
      for (const shop of PARTNER_SHOPS) {
        await setDoc(doc(db, 'partner_shops', shop.id), shop);
      }
      return PARTNER_SHOPS;
    }
    return snapshot.docs.map((docSnap) => docSnap.data() as PartnerShop);
  } catch (error) {
    console.warn('Firestore fetch failed, falling back to local dataset:', error);
    return PARTNER_SHOPS;
  }
}

// 3. Create Order
export async function createOrderInDb(orderData: OrderData): Promise<string> {
  const orderId = `BLOOM-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const fullOrder = {
    ...orderData,
    id: orderId,
    status: 'confirmed',
    createdAt: serverTimestamp(),
  };

  if (!db) {
    if (typeof window !== 'undefined') {
      const existing = JSON.parse(localStorage.getItem('bloomora_orders') || '[]');
      localStorage.setItem('bloomora_orders', JSON.stringify([fullOrder, ...existing]));
    }
    return orderId;
  }

  try {
    await setDoc(doc(db, 'orders', orderId), fullOrder);
    return orderId;
  } catch (error) {
    console.warn('Firestore order save failed, storing locally:', error);
    if (typeof window !== 'undefined') {
      const existing = JSON.parse(localStorage.getItem('bloomora_orders') || '[]');
      localStorage.setItem('bloomora_orders', JSON.stringify([fullOrder, ...existing]));
    }
    return orderId;
  }
}

// 4. Fetch Order by ID
export async function getOrderById(orderId: string): Promise<OrderData | null> {
  if (db) {
    try {
      const docRef = doc(db, 'orders', orderId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data() as OrderData;
      }
    } catch (error) {
      console.warn('Firestore get order failed:', error);
    }
  }

  if (typeof window !== 'undefined') {
    const existing = JSON.parse(localStorage.getItem('bloomora_orders') || '[]');
    const found = existing.find((o: { id: string }) => o.id === orderId);
    if (found) return found;
  }

  return null;
}

// 5. User Reminders CRUD
export async function getUserReminders(userId: string): Promise<UserReminder[]> {
  if (!db) return [];
  try {
    const colRef = collection(db, 'users', userId, 'reminders');
    const snap = await getDocs(colRef);
    return snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as UserReminder));
  } catch (error) {
    console.warn('Firestore get reminders failed:', error);
    return [];
  }
}

export async function addOrUpdateUserReminder(userId: string, reminder: Omit<UserReminder, 'id'> & { id?: string }): Promise<string> {
  const remId = reminder.id || `rem-${Date.now()}`;
  if (!db) return remId;
  try {
    await setDoc(doc(db, 'users', userId, 'reminders', remId), reminder);
  } catch (error) {
    console.warn('Firestore reminder save failed:', error);
  }
  return remId;
}

export async function deleteUserReminder(userId: string, reminderId: string): Promise<void> {
  if (!db) return;
  try {
    await deleteDoc(doc(db, 'users', userId, 'reminders', reminderId));
  } catch (error) {
    console.warn('Firestore reminder delete failed:', error);
  }
}

// 6. Saved Recipients CRUD
export async function getUserRecipients(userId: string): Promise<SavedRecipient[]> {
  if (!db) return [];
  try {
    const colRef = collection(db, 'users', userId, 'recipients');
    const snap = await getDocs(colRef);
    return snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as SavedRecipient));
  } catch (error) {
    console.warn('Firestore get recipients failed:', error);
    return [];
  }
}

export async function addOrUpdateUserRecipient(userId: string, recipient: Omit<SavedRecipient, 'id'> & { id?: string }): Promise<string> {
  const recId = recipient.id || `rec-${Date.now()}`;
  if (!db) return recId;
  try {
    await setDoc(doc(db, 'users', userId, 'recipients', recId), recipient);
  } catch (error) {
    console.warn('Firestore recipient save failed:', error);
  }
  return recId;
}
