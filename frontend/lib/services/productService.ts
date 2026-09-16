import { collection, doc, getDocs, getDoc, setDoc, updateDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { FirestoreProductDoc } from '../types/models';
import { Product, PRODUCTS } from '../mockData';

export async function getCatalogProducts(filters?: {
  category?: string;
  occasion?: string;
  partnerId?: string;
  isSponsored?: boolean;
}): Promise<Product[]> {
  if (!db) return PRODUCTS;

  try {
    const colRef = collection(db, 'products');
    let q = query(colRef, where('availability', '==', true));

    if (filters?.category && filters.category !== 'all') {
      q = query(q, where('category', '==', filters.category));
    }
    if (filters?.partnerId) {
      q = query(q, where('partnerId', '==', filters.partnerId));
    }
    if (filters?.isSponsored !== undefined) {
      q = query(q, where('isSponsored', '==', filters.isSponsored));
    }

    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return PRODUCTS;
    }

    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data() as FirestoreProductDoc;
      return {
        id: docSnap.id,
        name: data.name || data.title,
        subtitle: data.subtitle || '',
        description: data.description || '',
        story: data.story || '',
        price: data.price,
        originalPrice: data.originalPrice || data.compareAtPrice,
        category: data.category,
        occasion: data.occasion || [],
        recipientTag: data.recipientTag || 'for-friends',
        budgetTier: data.budgetTier || '300-499',
        images: data.images || [],
        packagingItems: data.packagingItems || [],
        rating: data.rating || 4.9,
        reviewCount: data.reviewCount || 100,
        inStock: data.inStock ?? true,
        preparationTimeMinutes: data.preparationTimeMinutes || 15,
        aiRecommendationReason: data.aiRecommendationReason || '',
        partnerId: data.partnerId,
        isBloomoraProduct: data.isBloomoraProduct ?? true,
        isPartnerProduct: data.isPartnerProduct ?? false,
        isSponsored: data.isSponsored ?? false,
        externalProductUrl: data.externalProductUrl,
      };
    });
  } catch (err) {
    console.warn('Firestore product query failed, using local product catalog:', err);
    return PRODUCTS;
  }
}

export async function createOrUpdateProductInDb(
  productData: Partial<FirestoreProductDoc> & { id?: string }
): Promise<string> {
  if (!db) {
    throw new Error('Firestore is not configured');
  }

  const productId = productData.id || `prod-${Date.now()}`;
  const prodRef = doc(db, 'products', productId);

  const payload: Partial<FirestoreProductDoc> = {
    ...productData,
    id: productId,
    name: productData.name || productData.title || 'Bloomora Gift Experience',
    title: productData.title || productData.name || 'Bloomora Gift Experience',
    slug: productData.slug || productId,
    isBloomoraProduct: productData.isBloomoraProduct ?? !productData.partnerId,
    isPartnerProduct: productData.isPartnerProduct ?? Boolean(productData.partnerId),
    isSponsored: productData.isSponsored ?? false,
    updatedAt: serverTimestamp(),
  };

  if (!productData.id) {
    payload.createdAt = serverTimestamp();
    await setDoc(prodRef, payload);
  } else {
    await updateDoc(prodRef, payload);
  }

  return productId;
}
