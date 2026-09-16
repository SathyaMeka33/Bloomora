import { doc, getDoc, setDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

export async function trackPartnerProductClick(
  productId: string,
  partnerId: string
): Promise<void> {
  if (!db || !partnerId || !productId) return;
  try {
    const analyticsId = `ad_${partnerId}_${productId}`;
    const docRef = doc(db, 'partnerAdAnalytics', analyticsId);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      await updateDoc(docRef, {
        clicks: increment(1),
        referrals: increment(1),
        lastUpdated: serverTimestamp(),
      });
    } else {
      await setDoc(docRef, {
        id: analyticsId,
        partnerId,
        productId,
        impressions: 1,
        clicks: 1,
        referrals: 1,
        conversions: 0,
        lastUpdated: serverTimestamp(),
      });
    }
  } catch (err) {
    console.warn('Failed to record partner product click analytics:', err);
  }
}

export async function trackPartnerProductImpression(
  productId: string,
  partnerId: string
): Promise<void> {
  if (!db || !partnerId || !productId) return;
  try {
    const analyticsId = `ad_${partnerId}_${productId}`;
    const docRef = doc(db, 'partnerAdAnalytics', analyticsId);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      await updateDoc(docRef, {
        impressions: increment(1),
        lastUpdated: serverTimestamp(),
      });
    } else {
      await setDoc(docRef, {
        id: analyticsId,
        partnerId,
        productId,
        impressions: 1,
        clicks: 0,
        referrals: 0,
        conversions: 0,
        lastUpdated: serverTimestamp(),
      });
    }
  } catch (err) {
    console.warn('Failed to record partner product impression analytics:', err);
  }
}

export async function trackExternalReferral(
  productId: string,
  partnerId: string
): Promise<void> {
  if (!db || !partnerId || !productId) return;
  try {
    const analyticsId = `ad_${partnerId}_${productId}`;
    const docRef = doc(db, 'partnerAdAnalytics', analyticsId);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      await updateDoc(docRef, {
        referrals: increment(1),
        lastUpdated: serverTimestamp(),
      });
    } else {
      await setDoc(docRef, {
        id: analyticsId,
        partnerId,
        productId,
        impressions: 1,
        clicks: 1,
        referrals: 1,
        conversions: 0,
        lastUpdated: serverTimestamp(),
      });
    }
  } catch (err) {
    console.warn('Failed to record external referral analytics:', err);
  }
}

export async function trackPartnerConversion(
  productId: string,
  partnerId: string
): Promise<void> {
  if (!db || !partnerId || !productId) return;
  try {
    const analyticsId = `ad_${partnerId}_${productId}`;
    const docRef = doc(db, 'partnerAdAnalytics', analyticsId);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      await updateDoc(docRef, {
        conversions: increment(1),
        lastUpdated: serverTimestamp(),
      });
    } else {
      await setDoc(docRef, {
        id: analyticsId,
        partnerId,
        productId,
        impressions: 1,
        clicks: 1,
        referrals: 1,
        conversions: 1,
        lastUpdated: serverTimestamp(),
      });
    }
  } catch (err) {
    console.warn('Failed to record conversion analytics:', err);
  }
}

export async function getPartnerAdAnalyticsList(): Promise<any[]> {
  if (!db) return [];
  try {
    const { collection, getDocs } = await import('firebase/firestore');
    const colRef = collection(db, 'partnerAdAnalytics');
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map((docSnap) => docSnap.data());
  } catch (err) {
    console.warn('Failed to fetch partner ad analytics:', err);
    return [];
  }
}

