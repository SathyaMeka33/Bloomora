import { doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

export async function checkAndDeductInventory(
  items: Array<{ productId: string; quantity: number; componentProductIds?: string[] }>
): Promise<{ success: boolean; error?: string }> {
  if (!db) {
    return { success: true };
  }
  const database = db;

  try {
    await runTransaction(database, async (transaction) => {
      // Flatten all products that need stock deduction (main product + package components)
      const productsToDeduct: Array<{ id: string; qty: number }> = [];
      for (const item of items) {
        productsToDeduct.push({ id: item.productId, qty: item.quantity });
        if (Array.isArray(item.componentProductIds)) {
          for (const compId of item.componentProductIds) {
            productsToDeduct.push({ id: compId, qty: item.quantity });
          }
        }
      }

      for (const item of productsToDeduct) {
        const prodRef = doc(database, 'products', item.id);
        const prodSnap = await transaction.get(prodRef);

        if (prodSnap.exists()) {
          const currentStock = prodSnap.data().inventory ?? 100;
          if (currentStock < item.qty) {
            throw new Error(`Insufficient stock for "${prodSnap.data().name || item.id}". Available: ${currentStock}, Requested: ${item.qty}`);
          }

          const newStock = currentStock - item.qty;
          transaction.update(prodRef, {
            inventory: newStock,
            inStock: newStock > 0,
            updatedAt: serverTimestamp(),
          });
        }
      }
    });

    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Inventory reservation failed';
    return { success: false, error: errorMsg };
  }
}
