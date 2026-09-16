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
  FirestoreSurpriseExperienceDoc,
  FirestoreSurprisePackageDoc,
  FirestoreSurprisePlanDoc,
  FirestoreSurprisePlannerRequestDoc,
  SurprisePlannerRequestStatus,
  SurpriseOccasionType,
} from '../types/models';

export const DEFAULT_SURPRISE_EXPERIENCES: FirestoreSurpriseExperienceDoc[] = [
  {
    id: 'exp-birthday',
    title: 'Birthday Surprise Experience',
    slug: 'birthday-surprise',
    subtitle: 'Make their special day unforgettable with curated cakes, floral arrangements, and setup',
    description: 'Complete birthday celebration curated by Bloomora. Features luxury artisanal cake, fresh flower bouquet, handwritten message card, and optional decor setup.',
    occasion: 'Birthday Surprise',
    category: 'Celebration',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1200&auto=format&fit=crop',
    active: true,
    packages: [
      {
        id: 'pkg-bday-mini',
        experienceId: 'exp-birthday',
        tier: 'mini',
        name: 'Bloomora Mini Celebration',
        price: 1499,
        originalPrice: 1799,
        description: 'Charming personal birthday package with mini cake, rose bouquet, and personalized greeting card.',
        contents: [
          'Handcrafted Mini Cake (300g)',
          'Signature Rose Bouquet (6 stems)',
          'Handwritten Bloomora Keepsake Card',
          'Premium Velvet Ribbon Packaging',
          'Standard Doorstep Delivery',
        ],
        customizationAvailable: true,
        setupIncluded: false,
        active: true,
      },
      {
        id: 'pkg-bday-signature',
        experienceId: 'exp-birthday',
        tier: 'signature',
        name: 'Bloomora Signature Celebration',
        price: 2199,
        originalPrice: 2499,
        description: 'Our most popular birthday experience with gourmet cake, artisanal floral box, and luxury chocolate bouquet.',
        contents: [
          'Gourmet Artisanal Cake (500g)',
          'Bloomora Floral Box (12 stems)',
          'Handmade Chocolate Bouquet',
          'Gold Foil Greeting Card & Envelope',
          'Signature Bloomora Box & Satin Wrap',
          'Timed Express Delivery',
        ],
        customizationAvailable: true,
        setupIncluded: true,
        active: true,
      },
      {
        id: 'pkg-bday-grand',
        experienceId: 'exp-birthday',
        tier: 'grand',
        name: 'Bloomora Grand Surprise',
        price: 2999,
        originalPrice: 3499,
        description: 'An extravagant surprise featuring luxury double-layer cake, premium flower hamper, room balloons decor, and keepsake box.',
        contents: [
          'Double-Layer Designer Cake (1kg)',
          'Grand Flower Hamper (24 stems)',
          'Artisanal Belgian Truffles Box',
          'Personalized Engraved Frame Keepsake',
          'Surprise Ambient Decor / Balloon Setup',
          'White Glove Delivery & Setup',
        ],
        customizationAvailable: true,
        setupIncluded: true,
        active: true,
      },
    ],
  },
  {
    id: 'exp-anniversary',
    title: 'Anniversary Surprise Experience',
    slug: 'anniversary-surprise',
    subtitle: 'Celebrate timeless love with romantic florals, luxury chocolate, and memory photo cards',
    description: 'An elegant romantic experience designed to commemorate your milestones with exquisite red roses, custom chocolate treats, and keepsake memory gifts.',
    occasion: 'Anniversary Surprise',
    category: 'Romance',
    image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1200&auto=format&fit=crop',
    active: true,
    packages: [
      {
        id: 'pkg-anni-mini',
        experienceId: 'exp-anniversary',
        tier: 'mini',
        name: 'Bloomora Mini Romance',
        price: 1499,
        originalPrice: 1799,
        description: 'Sweet intimate anniversary bundle.',
        contents: [
          'Red Rose Bouquet (8 stems)',
          'Heart-shaped Chocolate Box',
          'Romantic Handwritten Love Note',
          'Bloomora Satin Ribbon Box',
        ],
        active: true,
      },
      {
        id: 'pkg-anni-signature',
        experienceId: 'exp-anniversary',
        tier: 'signature',
        name: 'Bloomora Signature Romance',
        price: 2199,
        originalPrice: 2599,
        description: 'Romantic anniversary experience with cake, roses, and custom photo card.',
        contents: [
          'Red Velvet Heart Cake (500g)',
          'Signature Crimson Roses (15 stems)',
          'Custom Printed Photo Memory Card',
          'Belgian Pralines Collection',
          'Surprise Candle Set',
        ],
        active: true,
      },
      {
        id: 'pkg-anni-grand',
        experienceId: 'exp-anniversary',
        tier: 'grand',
        name: 'Bloomora Grand Romance',
        price: 2999,
        originalPrice: 3499,
        description: 'The ultimate grand romantic surprise setup with rose dome and gourmet pairings.',
        contents: [
          '50 Stem Luxury Crimson Rose Bouquet',
          'Designer Anniversary Cake (1kg)',
          'Preserved Forever Rose Dome',
          'Luxury Chocolate & Wine-Flavored Truffles',
          'Romantic Table/Room Setup',
        ],
        active: true,
      },
    ],
  },
  {
    id: 'exp-romantic',
    title: 'Romantic Surprise',
    slug: 'romantic-surprise',
    subtitle: 'Deeply expressive romantic gestures designed to captivate their heart',
    description: 'Express your feelings with handcrafted love tokens, fresh roses, and candlelit ambiance.',
    occasion: 'Romantic Surprise',
    category: 'Romance',
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1200&auto=format&fit=crop',
    active: true,
    packages: [
      {
        id: 'pkg-rom-mini',
        experienceId: 'exp-romantic',
        tier: 'mini',
        name: 'Bloomora Mini Romantic',
        price: 1499,
        contents: ['Blush Pink Rose Bouquet', 'Artisanal Chocolates', 'Love Message Scroll'],
        description: 'Delicate mini romantic gesture.',
        active: true,
      },
      {
        id: 'pkg-rom-signature',
        experienceId: 'exp-romantic',
        tier: 'signature',
        name: 'Bloomora Signature Romantic',
        price: 2199,
        contents: ['Crimson Rose Arrangement', 'Heart Chocolate Bouquet', 'Scented Candle', 'Gold Letter Note'],
        description: 'Bestselling romantic gift arrangement.',
        active: true,
      },
      {
        id: 'pkg-rom-grand',
        experienceId: 'exp-romantic',
        tier: 'grand',
        name: 'Bloomora Grand Romantic',
        price: 2999,
        contents: ['100 Rose Luxury Arrangement', 'Gourmet Chocolate Box', 'Memory Frame', 'Candlelit Decor Kit'],
        description: 'Breathtaking grand declaration of love.',
        active: true,
      },
    ],
  },
  {
    id: 'exp-partner',
    title: 'Partner Surprise',
    slug: 'partner-surprise',
    subtitle: 'Thoughtful curated moments for your life partner',
    description: 'Show appreciation for your partner with pampering gifts, gourmet treats, and personalized memory items.',
    occasion: 'Partner Surprise',
    category: 'Appreciation',
    image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1200&auto=format&fit=crop',
    active: true,
    packages: [
      {
        id: 'pkg-part-mini',
        experienceId: 'exp-partner',
        tier: 'mini',
        name: 'Bloomora Mini Partner Package',
        price: 1499,
        contents: ['Fresh Flower Arrangement', 'Chocolate Truffles', 'Appreciation Note'],
        description: 'Warm daily surprise.',
        active: true,
      },
      {
        id: 'pkg-part-sig',
        experienceId: 'exp-partner',
        tier: 'signature',
        name: 'Bloomora Signature Partner Package',
        price: 2199,
        contents: ['Luxury Floral Box', 'Gourmet Pastry Set', 'Engraved Keychain Keepsake', 'Custom Card'],
        description: 'Complete partner pampering box.',
        active: true,
      },
      {
        id: 'pkg-part-grand',
        experienceId: 'exp-partner',
        tier: 'grand',
        name: 'Bloomora Grand Partner Package',
        price: 2999,
        contents: ['Grand Flower Box', 'Designer Pastry Basket', 'Leather/Gold Keepsake Item', 'Personal Delivery Setup'],
        description: 'Ultimate royal partner surprise.',
        active: true,
      },
    ],
  },
  {
    id: 'exp-friendship',
    title: 'Friendship Surprise',
    slug: 'friendship-surprise',
    subtitle: 'Vibrant hampers and memory gifts for best friends',
    description: 'Celebrate friendship bonds with colorful blooms, customized treats, and joy-filled surprises.',
    occasion: 'Friendship Surprise',
    category: 'Celebration',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200&auto=format&fit=crop',
    active: true,
    packages: [
      {
        id: 'pkg-friend-mini',
        experienceId: 'exp-friendship',
        tier: 'mini',
        name: 'Bloomora Mini Buddy Box',
        price: 1499,
        contents: ['Sunflower Bouquet', 'Assorted Cookies', 'Friendship Card'],
        description: 'Bright cheerful friendship surprise.',
        active: true,
      },
      {
        id: 'pkg-friend-sig',
        experienceId: 'exp-friendship',
        tier: 'signature',
        name: 'Bloomora Signature Friendship Hamper',
        price: 2199,
        contents: ['Vibrant Wildflower Arrangement', 'Chocolate Bouquet', 'Custom Mug/Keepsake', 'Fun Polaroid Card'],
        description: 'Fun-filled best friend hamper.',
        active: true,
      },
      {
        id: 'pkg-friend-grand',
        experienceId: 'exp-friendship',
        tier: 'grand',
        name: 'Bloomora Grand Friendship Celebration',
        price: 2999,
        contents: ['Grand Mixed Bloom Hamper', 'Gourmet Snack & Sweet Tower', 'Customized Memory Album', 'Confetti Balloon Delivery'],
        description: 'Unforgettable group friendship celebration.',
        active: true,
      },
    ],
  },
  {
    id: 'exp-workplace',
    title: 'Workplace Birthday Surprise',
    slug: 'workplace-birthday',
    subtitle: 'Professional, elegant desk surprises for colleagues and leaders',
    description: 'Punctual, polished office delivery with birthday cake, flower vase, and team greeting card.',
    occasion: 'Workplace Birthday Surprise',
    category: 'Corporate',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop',
    active: true,
    packages: [
      {
        id: 'pkg-work-mini',
        experienceId: 'exp-workplace',
        tier: 'mini',
        name: 'Bloomora Mini Desk Celebration',
        price: 1499,
        contents: ['Compact Desk Flower Arrangement', 'Mini Bday Cake', 'Team Signature Card'],
        description: 'Neat office desk delivery.',
        active: true,
      },
      {
        id: 'pkg-work-sig',
        experienceId: 'exp-workplace',
        tier: 'signature',
        name: 'Bloomora Signature Office Surprise',
        price: 2199,
        contents: ['Executive Floral Vase', 'Artisanal 500g Cake', 'Gourmet Chocolate Box', 'Colleague Sign-off Banner'],
        description: 'Popular team birthday package.',
        active: true,
      },
      {
        id: 'pkg-work-grand',
        experienceId: 'exp-workplace',
        tier: 'grand',
        name: 'Bloomora Grand Workplace Celebration',
        price: 2999,
        contents: ['Large Desk Flower Stand', 'Party Cupcake Tower (12 pcs)', 'Premium Coffee/Tea Hamper', 'Celebration Desk Banner & Balloons'],
        description: 'Grand department-wide birthday setup.',
        active: true,
      },
    ],
  },
  {
    id: 'exp-congratulations',
    title: 'Congratulations Experience',
    slug: 'congratulations-surprise',
    subtitle: 'Mark promotions, graduations, and achievements in style',
    description: 'Celebrate wins with premium orchid stems, celebration cupcakes, and congratulations keepsakes.',
    occasion: 'Congratulations',
    category: 'Milestone',
    image: 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?q=80&w=1200&auto=format&fit=crop',
    active: true,
    packages: [
      {
        id: 'pkg-cong-mini',
        experienceId: 'exp-congratulations',
        tier: 'mini',
        name: 'Bloomora Mini Achievement Package',
        price: 1499,
        contents: ['Yellow Rose & Lily Bouquet', 'Macaron Set', 'Congratulations Card'],
        description: 'Elegant victory bouquet.',
        active: true,
      },
      {
        id: 'pkg-cong-sig',
        experienceId: 'exp-congratulations',
        tier: 'signature',
        name: 'Bloomora Signature Milestone Box',
        price: 2199,
        contents: ['Exotic Orchid Vase', 'Artisanal Tart & Sweet Box', 'Golden Congratulations Trophy/Plaque'],
        description: 'Distinguished congratulations gift.',
        active: true,
      },
      {
        id: 'pkg-cong-grand',
        experienceId: 'exp-congratulations',
        tier: 'grand',
        name: 'Bloomora Grand Triumph Celebration',
        price: 2999,
        contents: ['Grand Exotic Flower Stand', 'Sparkling Celebration Beverage (Non-alc)', 'Gourmet Truffle Box', 'Customized Framed Certificate/Note'],
        description: 'Ultimate grand victory package.',
        active: true,
      },
    ],
  },
  {
    id: 'exp-thank-you',
    title: 'Thank You Surprise',
    slug: 'thank-you-surprise',
    subtitle: 'Gracious appreciation gifts that convey warm gratitude',
    description: 'Express sincere thanks with elegant pastel blossoms, artisanal cookies, and heartfelt notes.',
    occasion: 'Thank You',
    category: 'Appreciation',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1200&auto=format&fit=crop',
    active: true,
    packages: [
      {
        id: 'pkg-ty-mini',
        experienceId: 'exp-thank-you',
        tier: 'mini',
        name: 'Bloomora Mini Gratitude Box',
        price: 1499,
        contents: ['Pastel Carnation Bouquet', 'Butter Cookies Tin', 'Thank You Card'],
        description: 'Warm, sincere gratitude gesture.',
        active: true,
      },
      {
        id: 'pkg-ty-sig',
        experienceId: 'exp-thank-you',
        tier: 'signature',
        name: 'Bloomora Signature Appreciation Box',
        price: 2199,
        contents: ['White & Peach Rose Box', 'Gourmet Tea & Honey Set', 'Scented Soy Candle', 'Personalized Parchment Note'],
        description: 'Refined appreciation hamper.',
        active: true,
      },
      {
        id: 'pkg-ty-grand',
        experienceId: 'exp-thank-you',
        tier: 'grand',
        name: 'Bloomora Grand Appreciation Basket',
        price: 2999,
        contents: ['Grand Lily & Orchid Basket', 'Luxury Dry Fruits & Chocolate Chest', 'Handmade Artisan Mug', 'Personal Delivery'],
        description: 'Opulent expression of deep thanks.',
        active: true,
      },
    ],
  },
  {
    id: 'exp-corporate',
    title: 'Formal / Corporate Surprise',
    slug: 'corporate-surprise',
    subtitle: 'Sophisticated corporate gifting tailored for VIP clients and partners',
    description: 'Subtle, high-end corporate arrangements with premium packaging, branded cards, and white-glove delivery.',
    occasion: 'Formal / Corporate Surprise',
    category: 'Corporate',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
    active: true,
    packages: [
      {
        id: 'pkg-corp-mini',
        experienceId: 'exp-corporate',
        tier: 'mini',
        name: 'Bloomora Executive Mini Gift',
        price: 1499,
        contents: ['Monochrome Desk Floral Vase', 'Artisanal Dark Chocolates', 'Corporate Embossed Card'],
        description: 'Polished corporate token.',
        active: true,
      },
      {
        id: 'pkg-corp-sig',
        experienceId: 'exp-corporate',
        tier: 'signature',
        name: 'Bloomora Signature Executive Chest',
        price: 2199,
        contents: ['White Calla Lily Arrangement', 'Imported Belgian Pralines', 'Custom Leather Notebook/Pen', 'Gold Foil Sleeve'],
        description: 'High-level business partner hamper.',
        active: true,
      },
      {
        id: 'pkg-corp-grand',
        experienceId: 'exp-corporate',
        tier: 'grand',
        name: 'Bloomora VIP Corporate Hamper',
        price: 2999,
        contents: ['Grand Executive Floral Stand', 'Luxury Imported Hamper (Chocolates, Teas, Nuts)', 'Engraved Desk Trophy', 'Priority White-Glove Courier'],
        description: 'State-of-the-art VIP client surprise.',
        active: true,
      },
    ],
  },
  {
    id: 'exp-custom',
    title: 'Custom Surprise Experience',
    slug: 'custom-surprise',
    subtitle: 'Fully personalized surprise tailored to your specific imagination',
    description: 'Build your dream surprise experience with completely custom cake, flowers, decor, and setup options.',
    occasion: 'Custom Surprise',
    category: 'Bespoke',
    image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=1200&auto=format&fit=crop',
    active: true,
    packages: [
      {
        id: 'pkg-cust-mini',
        experienceId: 'exp-custom',
        tier: 'mini',
        name: 'Bloomora Custom Mini Bundle',
        price: 1499,
        contents: ['Custom Flower Choice', 'Custom Mini Sweet', 'Custom Card'],
        description: 'Curated tailored mini experience.',
        active: true,
      },
      {
        id: 'pkg-cust-sig',
        experienceId: 'exp-custom',
        tier: 'signature',
        name: 'Bloomora Custom Signature Package',
        price: 2199,
        contents: ['Custom Floral Basket', 'Custom Flavored Cake', 'Selected Addon Item', 'Personalized Note'],
        description: 'Popular custom surprise combo.',
        active: true,
      },
      {
        id: 'pkg-cust-grand',
        experienceId: 'exp-custom',
        tier: 'grand',
        name: 'Bloomora Custom Grand Setup',
        price: 2999,
        contents: ['Custom Grand Floral & Balloon Setup', 'Custom Multi-Tier Cake', 'Gourmet Treats Box', 'White-Glove Setup Team'],
        description: 'Complete custom grand event arrangement.',
        active: true,
      },
    ],
  },
];

export async function getSurpriseExperiences(): Promise<FirestoreSurpriseExperienceDoc[]> {
  if (!db) return DEFAULT_SURPRISE_EXPERIENCES;
  try {
    const colRef = collection(db, 'surpriseExperiences');
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      console.log('Seeding surprise experiences to Firestore...');
      for (const exp of DEFAULT_SURPRISE_EXPERIENCES) {
        await setDoc(doc(db, 'surpriseExperiences', exp.id), exp);
      }
      return DEFAULT_SURPRISE_EXPERIENCES;
    }
    return snapshot.docs.map((docSnap) => docSnap.data() as FirestoreSurpriseExperienceDoc);
  } catch (error) {
    console.warn('Firestore fetch surprise experiences failed, using defaults:', error);
    return DEFAULT_SURPRISE_EXPERIENCES;
  }
}

export async function saveSurpriseExperience(
  exp: FirestoreSurpriseExperienceDoc
): Promise<void> {
  if (!db) return;
  const docRef = doc(db, 'surpriseExperiences', exp.id);
  await setDoc(docRef, { ...exp, updatedAt: serverTimestamp() }, { merge: true });
}

export async function saveSurprisePlan(plan: Omit<FirestoreSurprisePlanDoc, 'id'> & { id?: string }): Promise<string> {
  const planId = plan.id || `plan-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const fullPlan = {
    ...plan,
    id: planId,
    createdAt: serverTimestamp(),
  };

  if (!db) {
    if (typeof window !== 'undefined') {
      const existing = JSON.parse(localStorage.getItem('bloomora_surprise_plans') || '[]');
      localStorage.setItem('bloomora_surprise_plans', JSON.stringify([fullPlan, ...existing]));
    }
    return planId;
  }

  try {
    await setDoc(doc(db, 'surprisePlans', planId), fullPlan);
    return planId;
  } catch (error) {
    console.warn('Firestore save surprise plan failed, storing locally:', error);
    if (typeof window !== 'undefined') {
      const existing = JSON.parse(localStorage.getItem('bloomora_surprise_plans') || '[]');
      localStorage.setItem('bloomora_surprise_plans', JSON.stringify([fullPlan, ...existing]));
    }
    return planId;
  }
}

// ----------------------------------------------------------------------
// SURPRISE PLANNER REQUESTS (Custom Execution Requests)
// ----------------------------------------------------------------------

export async function saveSurprisePlannerRequest(
  requestData: Omit<FirestoreSurprisePlannerRequestDoc, 'id' | 'requestStatus' | 'createdAt' | 'updatedAt'> & { id?: string }
): Promise<string> {
  const reqId = requestData.id || `SRP-${Math.floor(10000 + Math.random() * 90000)}`;
  const fullDoc: FirestoreSurprisePlannerRequestDoc = {
    ...requestData,
    id: reqId,
    requestStatus: 'SUBMITTED',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (!db) {
    if (typeof window !== 'undefined') {
      const existing = JSON.parse(localStorage.getItem('bloomora_planner_requests') || '[]');
      localStorage.setItem('bloomora_planner_requests', JSON.stringify([fullDoc, ...existing]));
    }
    return reqId;
  }

  try {
    await setDoc(doc(db, 'surprisePlannerRequests', reqId), fullDoc);
    return reqId;
  } catch (error) {
    console.warn('Firestore save planner request failed, saving to localStorage:', error);
    if (typeof window !== 'undefined') {
      const existing = JSON.parse(localStorage.getItem('bloomora_planner_requests') || '[]');
      localStorage.setItem('bloomora_planner_requests', JSON.stringify([fullDoc, ...existing]));
    }
    return reqId;
  }
}

export async function getSurprisePlannerRequests(): Promise<FirestoreSurprisePlannerRequestDoc[]> {
  if (!db) {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bloomora_planner_requests');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  }

  try {
    const colRef = collection(db, 'surprisePlannerRequests');
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('bloomora_planner_requests');
        return saved ? JSON.parse(saved) : [];
      }
      return [];
    }
    return snapshot.docs.map((d) => d.data() as FirestoreSurprisePlannerRequestDoc);
  } catch (error) {
    console.warn('Firestore fetch surprise planner requests failed:', error);
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bloomora_planner_requests');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  }
}

export async function updateSurprisePlannerRequestStatus(
  reqId: string,
  newStatus: SurprisePlannerRequestStatus,
  updates?: {
    adminNotes?: string;
    quotation?: number;
    assignedPartnerId?: string;
    assignedStaff?: string;
  }
): Promise<void> {
  const updatePayload = {
    requestStatus: newStatus,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  if (!db) {
    if (typeof window !== 'undefined') {
      const existing: FirestoreSurprisePlannerRequestDoc[] = JSON.parse(
        localStorage.getItem('bloomora_planner_requests') || '[]'
      );
      const updated = existing.map((r) => (r.id === reqId ? { ...r, ...updatePayload } : r));
      localStorage.setItem('bloomora_planner_requests', JSON.stringify(updated));
    }
    return;
  }

  try {
    const docRef = doc(db, 'surprisePlannerRequests', reqId);
    await updateDoc(docRef, updatePayload);
  } catch (error) {
    console.warn('Firestore update planner request status failed:', error);
    if (typeof window !== 'undefined') {
      const existing: FirestoreSurprisePlannerRequestDoc[] = JSON.parse(
        localStorage.getItem('bloomora_planner_requests') || '[]'
      );
      const updated = existing.map((r) => (r.id === reqId ? { ...r, ...updatePayload } : r));
      localStorage.setItem('bloomora_planner_requests', JSON.stringify(updated));
    }
  }
}

