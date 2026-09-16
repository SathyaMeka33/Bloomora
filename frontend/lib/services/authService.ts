import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';
import { UserProfile, UserRole } from '../types';

export async function fetchOrCreateUserProfile(
  uid: string,
  email: string | null,
  displayName: string | null,
  photoURL: string | null = null,
  phone: string = ''
): Promise<UserProfile> {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase Authentication is not configured. Please add valid credentials to .env.local.');
  }

  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    const existingData = snap.data() as UserProfile;
    return {
      ...existingData,
      uid,
      email: email || existingData.email,
      displayName: displayName || existingData.displayName,
      photoURL: photoURL || existingData.photoURL,
    };
  }

  const newProfile: UserProfile = {
    uid,
    email: email || null,
    displayName: displayName || 'Bloomora Customer',
    photoURL: photoURL || null,
    phone: phone || '',
    role: 'customer' as UserRole,
    rewardPoints: 350,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(userRef, newProfile);
  return newProfile;
}

export async function getUserRoleFromFirestore(uid: string): Promise<UserRole> {
  if (!db) return 'customer';
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data();
      return (data.role as UserRole) || 'customer';
    }
  } catch (err) {
    console.error('Failed to fetch user role from Firestore:', err);
  }
  return 'customer';
}

export async function mergeGuestDataToUserAccount(
  uid: string,
  guestCart: Array<{ product: { id: string }; quantity: number; selectedPackaging?: string; customMessage?: string }>,
  guestWishlist: string[]
): Promise<void> {
  if (!db || !uid) return;

  try {
    const userRef = doc(db, 'users', uid);

    if (guestWishlist.length > 0) {
      const userSnap = await getDoc(userRef);
      const existingWishlist = (userSnap.data()?.savedWishlist as string[]) || [];
      const mergedWishlist = Array.from(new Set([...existingWishlist, ...guestWishlist]));
      await updateDoc(userRef, { savedWishlist: mergedWishlist, updatedAt: serverTimestamp() });
    }

    if (guestCart.length > 0) {
      const formattedCart = guestCart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        selectedPackaging: item.selectedPackaging || '',
        customMessage: item.customMessage || '',
      }));
      await updateDoc(userRef, { savedCart: formattedCart, updatedAt: serverTimestamp() });
    }
  } catch (err) {
    console.warn('Cart & wishlist merging warning:', err);
  }
}
