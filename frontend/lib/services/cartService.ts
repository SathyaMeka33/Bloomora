import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { FirestoreCartItem } from '../types/models';

export async function saveUserCartToFirestore(
  userId: string,
  items: FirestoreCartItem[]
): Promise<void> {
  if (!db || !userId) return;
  try {
    const cartRef = doc(db, 'carts', userId);
    await setDoc(cartRef, {
      userId,
      items,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn('Failed to persist cart to Firestore:', err);
  }
}

export async function getUserCartFromFirestore(
  userId: string
): Promise<FirestoreCartItem[]> {
  if (!db || !userId) return [];
  try {
    const cartRef = doc(db, 'carts', userId);
    const snap = await getDoc(cartRef);
    if (snap.exists()) {
      return (snap.data().items as FirestoreCartItem[]) || [];
    }
  } catch (err) {
    console.warn('Failed to fetch cart from Firestore:', err);
  }
  return [];
}

export async function saveUserWishlistToFirestore(
  userId: string,
  productIds: string[]
): Promise<void> {
  if (!db || !userId) return;
  try {
    const wishlistRef = doc(db, 'wishlists', userId);
    await setDoc(wishlistRef, {
      userId,
      productIds,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn('Failed to persist wishlist to Firestore:', err);
  }
}

export async function getUserWishlistFromFirestore(
  userId: string
): Promise<string[]> {
  if (!db || !userId) return [];
  try {
    const wishlistRef = doc(db, 'wishlists', userId);
    const snap = await getDoc(wishlistRef);
    if (snap.exists()) {
      return (snap.data().productIds as string[]) || [];
    }
  } catch (err) {
    console.warn('Failed to fetch wishlist from Firestore:', err);
  }
  return [];
}
