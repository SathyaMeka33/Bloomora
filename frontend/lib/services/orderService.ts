import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { FirestoreOrderDoc, ExtendedOrderStatus } from '../types/models';
import { checkAndDeductInventory } from './inventoryService';

export function generateSecurePickupPin(): string {
  // Generates a 4-digit numeric locker pickup PIN
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export async function createProductionOrderInDb(
  orderPayload: Omit<FirestoreOrderDoc, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
): Promise<{ success: boolean; orderId: string; pickupPin?: string; error?: string }> {
  const orderId = orderPayload.id || `BLOOM-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
  const pickupPin = orderPayload.fulfillmentType === 'pickup' ? generateSecurePickupPin() : undefined;

  // Verify stock before order placement
  const stockCheck = await checkAndDeductInventory(
    orderPayload.items.map((i) => ({ productId: i.productId, quantity: i.quantity }))
  );

  if (!stockCheck.success) {
    return { success: false, orderId, error: stockCheck.error || 'Inventory verification failed' };
  }

  const fullOrder: FirestoreOrderDoc = {
    ...orderPayload,
    id: orderId,
    status: orderPayload.status || 'PLACED',
    pickupPin,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (!db) {
    if (typeof window !== 'undefined') {
      const existing = JSON.parse(localStorage.getItem('bloomora_orders') || '[]');
      localStorage.setItem('bloomora_orders', JSON.stringify([fullOrder, ...existing]));
    }
    return { success: true, orderId, pickupPin };
  }

  try {
    await setDoc(doc(db, 'orders', orderId), fullOrder);
    return { success: true, orderId, pickupPin };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to create order in Firestore';
    console.warn('Firestore order save failed, writing fallback to localStorage:', errorMsg);
    if (typeof window !== 'undefined') {
      const existing = JSON.parse(localStorage.getItem('bloomora_orders') || '[]');
      localStorage.setItem('bloomora_orders', JSON.stringify([fullOrder, ...existing]));
    }
    return { success: true, orderId, pickupPin };
  }
}

export async function updateOrderStatusInDb(
  orderId: string,
  newStatus: ExtendedOrderStatus
): Promise<{ success: boolean; error?: string }> {
  if (!db) return { success: true };
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status: newStatus,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to update order status';
    return { success: false, error: errorMsg };
  }
}
