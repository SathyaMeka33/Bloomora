import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import {
  FirestoreProductDoc,
  FirestorePartnerApplicationDoc,
  FirestoreOrderDoc,
  FirestorePartnerAdAnalyticsDoc,
  ProductApprovalStatus,
  SellerOrderStatus,
  PartnerFulfillmentType,
} from '../types/models';

// 1. Submit Partner Application
export async function submitPartnerApplication(appData: Omit<FirestorePartnerApplicationDoc, 'id' | 'status'>): Promise<string> {
  const appId = `PARTNER-APP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const fullApp: FirestorePartnerApplicationDoc = {
    ...appData,
    id: appId,
    status: 'pending',
    appliedAt: serverTimestamp(),
  };

  if (!db) {
    if (typeof window !== 'undefined') {
      const existing = JSON.parse(localStorage.getItem('bloomora_partner_apps') || '[]');
      localStorage.setItem('bloomora_partner_apps', JSON.stringify([fullApp, ...existing]));
    }
    return appId;
  }

  try {
    await setDoc(doc(db, 'partnerApplications', appId), fullApp);
    return appId;
  } catch (error) {
    console.warn('Firestore partner application submission failed, storing locally:', error);
    if (typeof window !== 'undefined') {
      const existing = JSON.parse(localStorage.getItem('bloomora_partner_apps') || '[]');
      localStorage.setItem('bloomora_partner_apps', JSON.stringify([fullApp, ...existing]));
    }
    return appId;
  }
}

// 2. Fetch Partner Applications (Admin)
export async function getPartnerApplications(): Promise<FirestorePartnerApplicationDoc[]> {
  if (!db) {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('bloomora_partner_apps') || '[]');
    }
    return [];
  }
  try {
    const colRef = collection(db, 'partnerApplications');
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map((docSnap) => docSnap.data() as FirestorePartnerApplicationDoc);
  } catch (error) {
    console.warn('Firestore get partner applications failed:', error);
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('bloomora_partner_apps') || '[]');
    }
    return [];
  }
}

// 3. Update Partner Application Status (Admin)
export async function updatePartnerApplicationStatus(
  appId: string,
  status: 'pending' | 'approved' | 'rejected' | 'suspended',
  rejectionReason?: string
): Promise<void> {
  if (!db) {
    if (typeof window !== 'undefined') {
      const existing: FirestorePartnerApplicationDoc[] = JSON.parse(
        localStorage.getItem('bloomora_partner_apps') || '[]'
      );
      const updated = existing.map((a) =>
        a.id === appId ? { ...a, status, rejectionReason: rejectionReason || a.rejectionReason } : a
      );
      localStorage.setItem('bloomora_partner_apps', JSON.stringify(updated));
    }
    return;
  }

  try {
    await updateDoc(doc(db, 'partnerApplications', appId), {
      status,
      rejectionReason: rejectionReason || '',
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.warn('Firestore update partner application status failed:', error);
  }
}

// 4. Submit Seller Product for Admin Approval
export async function submitSellerProduct(
  productData: Omit<FirestoreProductDoc, 'id' | 'approvalStatus' | 'rating' | 'reviewCount' | 'inStock'> & {
    id?: string;
    rating?: number;
    reviewCount?: number;
    inStock?: boolean;
  }
): Promise<string> {
  const productId = productData.id || `PROD-PARTNER-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const fullProduct: FirestoreProductDoc = {
    ...productData,
    id: productId,
    rating: productData.rating || 5.0,
    reviewCount: productData.reviewCount || 1,
    approvalStatus: 'pending_review',
    isPartnerProduct: true,
    isBloomoraProduct: productData.isBloomoraProduct || false,
    isSponsored: productData.isSponsored || false,
    inStock: productData.inStock !== undefined ? productData.inStock : productData.inventory > 0,
    availability: productData.availability !== undefined ? productData.availability : true,
    fulfillmentOptions: productData.fulfillmentOptions && productData.fulfillmentOptions.length > 0
      ? productData.fulfillmentOptions
      : ['partner_delivery', 'meet_me_there'],
    createdAt: serverTimestamp(),
  };

  if (!db) {
    if (typeof window !== 'undefined') {
      const existing = JSON.parse(localStorage.getItem('bloomora_seller_products') || '[]');
      localStorage.setItem('bloomora_seller_products', JSON.stringify([fullProduct, ...existing]));
    }
    return productId;
  }

  try {
    await setDoc(doc(db, 'products', productId), fullProduct);
    return productId;
  } catch (error) {
    console.warn('Firestore seller product save failed, saving locally:', error);
    if (typeof window !== 'undefined') {
      const existing = JSON.parse(localStorage.getItem('bloomora_seller_products') || '[]');
      localStorage.setItem('bloomora_seller_products', JSON.stringify([fullProduct, ...existing]));
    }
    return productId;
  }
}

// 5. Fetch Seller Products by Partner ID
export async function getSellerProducts(partnerId?: string): Promise<FirestoreProductDoc[]> {
  if (!db) {
    if (typeof window !== 'undefined') {
      const existing: FirestoreProductDoc[] = JSON.parse(
        localStorage.getItem('bloomora_seller_products') || '[]'
      );
      return partnerId ? existing.filter((p) => p.partnerId === partnerId) : existing;
    }
    return [];
  }

  try {
    const colRef = collection(db, 'products');
    const q = partnerId
      ? query(colRef, where('partnerId', '==', partnerId))
      : query(colRef, where('isPartnerProduct', '==', true));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => docSnap.data() as FirestoreProductDoc);
  } catch (error) {
    console.warn('Firestore fetch seller products failed:', error);
    if (typeof window !== 'undefined') {
      const existing: FirestoreProductDoc[] = JSON.parse(
        localStorage.getItem('bloomora_seller_products') || '[]'
      );
      return partnerId ? existing.filter((p) => p.partnerId === partnerId) : existing;
    }
    return [];
  }
}

// 6. Admin: Get All Pending Product Submissions
export async function getPendingProductsForAdmin(): Promise<FirestoreProductDoc[]> {
  if (!db) {
    if (typeof window !== 'undefined') {
      const existing: FirestoreProductDoc[] = JSON.parse(
        localStorage.getItem('bloomora_seller_products') || '[]'
      );
      return existing.filter((p) => p.approvalStatus === 'pending_review' || !p.approvalStatus);
    }
    return [];
  }

  try {
    const colRef = collection(db, 'products');
    const snapshot = await getDocs(colRef);
    const all = snapshot.docs.map((docSnap) => docSnap.data() as FirestoreProductDoc);
    return all.filter((p) => p.approvalStatus === 'pending_review' || (p.isPartnerProduct && !p.approvalStatus));
  } catch (error) {
    console.warn('Firestore fetch pending products failed:', error);
    if (typeof window !== 'undefined') {
      const existing: FirestoreProductDoc[] = JSON.parse(
        localStorage.getItem('bloomora_seller_products') || '[]'
      );
      return existing.filter((p) => p.approvalStatus === 'pending_review' || !p.approvalStatus);
    }
    return [];
  }
}

// 7. Admin Approval/Status Update
export async function updateProductApprovalStatus(
  productId: string,
  approvalStatus: ProductApprovalStatus,
  adminNotes?: string
): Promise<void> {
  if (!db) {
    if (typeof window !== 'undefined') {
      const existing: FirestoreProductDoc[] = JSON.parse(
        localStorage.getItem('bloomora_seller_products') || '[]'
      );
      const updated = existing.map((p) =>
        p.id === productId ? { ...p, approvalStatus, adminNotes } : p
      );
      localStorage.setItem('bloomora_seller_products', JSON.stringify(updated));
    }
    return;
  }

  try {
    const docRef = doc(db, 'products', productId);
    await updateDoc(docRef, {
      approvalStatus,
      adminNotes: adminNotes || '',
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.warn('Firestore product approval update failed:', error);
  }
}

// 8. Admin Update Product Flags (Featured, Sponsored, Enabled, Experience Component)
export async function updateProductFlags(
  productId: string,
  flags: {
    isFeatured?: boolean;
    isSponsored?: boolean;
    isExperienceComponent?: boolean;
    availability?: boolean;
  }
): Promise<void> {
  if (!db) return;
  try {
    const docRef = doc(db, 'products', productId);
    await updateDoc(docRef, { ...flags, updatedAt: serverTimestamp() });
  } catch (error) {
    console.warn('Firestore product flags update failed:', error);
  }
}

// 9. Seller Order Management: Fetch Seller Orders
export async function getSellerOrders(partnerId?: string): Promise<FirestoreOrderDoc[]> {
  if (!db) {
    if (typeof window !== 'undefined') {
      const existing: FirestoreOrderDoc[] = JSON.parse(
        localStorage.getItem('bloomora_orders') || '[]'
      );
      return partnerId
        ? existing.filter((o) => o.partnerId === partnerId || o.items.some((i) => i.partnerId === partnerId))
        : existing;
    }
    return [];
  }

  try {
    const colRef = collection(db, 'orders');
    const snapshot = await getDocs(colRef);
    const all = snapshot.docs.map((docSnap) => docSnap.data() as FirestoreOrderDoc);
    if (!partnerId) return all;
    return all.filter((o) => o.partnerId === partnerId || o.items.some((i) => i.partnerId === partnerId));
  } catch (error) {
    console.warn('Firestore fetch seller orders failed:', error);
    if (typeof window !== 'undefined') {
      const existing: FirestoreOrderDoc[] = JSON.parse(
        localStorage.getItem('bloomora_orders') || '[]'
      );
      return partnerId
        ? existing.filter((o) => o.partnerId === partnerId || o.items.some((i) => i.partnerId === partnerId))
        : existing;
    }
    return [];
  }
}

// 10. Update Seller Order Status (NEW -> ACCEPTED -> PREPARING -> READY -> HANDED_TO_BLOOMORA -> COMPLETED)
export async function updateSellerOrderStatus(
  orderId: string,
  sellerOrderStatus: SellerOrderStatus
): Promise<void> {
  if (!db) {
    if (typeof window !== 'undefined') {
      const existing: FirestoreOrderDoc[] = JSON.parse(
        localStorage.getItem('bloomora_orders') || '[]'
      );
      const updated = existing.map((o) =>
        o.id === orderId ? { ...o, status: sellerOrderStatus as any } : o
      );
      localStorage.setItem('bloomora_orders', JSON.stringify(updated));
    }
    return;
  }

  try {
    const docRef = doc(db, 'orders', orderId);
    await updateDoc(docRef, {
      status: sellerOrderStatus as any,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.warn('Firestore seller order status update failed:', error);
  }
}

// 11. Update Product Stock / Inventory
export async function updatePartnerInventoryStock(
  productId: string,
  newStock: number,
  inStockOverride?: boolean
): Promise<void> {
  const isAvailable = inStockOverride !== undefined ? inStockOverride : newStock > 0;
  if (!db) {
    if (typeof window !== 'undefined') {
      const existing: FirestoreProductDoc[] = JSON.parse(
        localStorage.getItem('bloomora_seller_products') || '[]'
      );
      const updated = existing.map((p) =>
        p.id === productId ? { ...p, inventory: newStock, inStock: isAvailable, availability: isAvailable } : p
      );
      localStorage.setItem('bloomora_seller_products', JSON.stringify(updated));
    }
    return;
  }
  try {
    const docRef = doc(db, 'products', productId);
    await updateDoc(docRef, {
      inventory: newStock,
      inStock: isAvailable,
      availability: isAvailable,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.warn('Firestore inventory stock update failed:', error);
  }
}

// 12. Get Partner Application by Email or UID
export async function getPartnerApplicationByEmail(email: string): Promise<FirestorePartnerApplicationDoc | null> {
  const apps = await getPartnerApplications();
  return apps.find((a) => a.email.toLowerCase() === email.toLowerCase()) || null;
}

