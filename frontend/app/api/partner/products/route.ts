import { NextRequest, NextResponse } from 'next/server';
import { requireServerRole } from '@/lib/firebase/verifyAuth';
import { adminDb } from '@/lib/firebase/admin';

// GET /api/partner/products - List products owned by authenticated partner
export async function GET(req: NextRequest) {
  try {
    const authResult = await requireServerRole(req, ['partner', 'admin']);
    if (!authResult.authenticated || !authResult.uid) {
      return NextResponse.json({ success: false, error: authResult.error || 'Partner authentication required' }, { status: 401 });
    }

    if (!adminDb) {
      return NextResponse.json({ success: false, error: 'Firebase Admin DB is unconfigured on server' }, { status: 503 });
    }

    let q = adminDb.collection('products').where('partnerId', '==', authResult.uid);
    if (authResult.role === 'admin') {
      const searchPartnerId = req.nextUrl.searchParams.get('partnerId');
      if (searchPartnerId) {
        q = adminDb.collection('products').where('partnerId', '==', searchPartnerId);
      }
    }

    const snapshot = await q.get();
    const products = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));

    return NextResponse.json({ success: true, data: products });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// POST /api/partner/products - Partner submits new product for review
export async function POST(req: NextRequest) {
  try {
    const authResult = await requireServerRole(req, ['partner', 'admin']);
    if (!authResult.authenticated || !authResult.uid) {
      return NextResponse.json({ success: false, error: authResult.error || 'Partner authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const { title, price, category, images, inventory, description } = body;

    if (!title || price === undefined || !category) {
      return NextResponse.json({ success: false, error: 'title, price, and category are required' }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ success: false, error: 'Firebase Admin DB is unconfigured on server' }, { status: 503 });
    }

    const productId = body.id || `PROD-PARTNER-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newProduct = {
      ...body,
      id: productId,
      name: title,
      title,
      price: Number(price),
      category,
      partnerId: authResult.uid,
      images: Array.isArray(images) ? images : [],
      inventory: Number(inventory ?? 10),
      inStock: Number(inventory ?? 10) > 0,
      approvalStatus: 'pending_review',
      isPartnerProduct: true,
      isBloomoraProduct: false,
      isSponsored: false,
      availability: false, // published only after admin approval
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await adminDb.collection('products').doc(productId).set(newProduct);

    return NextResponse.json({ success: true, message: 'Product submitted for admin approval', data: newProduct });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}
