import { NextRequest, NextResponse } from 'next/server';
import { requireServerRole } from '@/lib/firebase/verifyAuth';
import { adminDb } from '@/lib/firebase/admin';

export async function GET(req: NextRequest) {
  try {
    const authResult = await requireServerRole(req, ['admin']);
    if (!authResult.authenticated) {
      return NextResponse.json({ success: false, error: authResult.error || 'Admin authentication required' }, { status: 401 });
    }

    if (!adminDb) {
      return NextResponse.json({ success: false, error: 'Firebase Admin DB is unconfigured on server' }, { status: 503 });
    }

    const snapshot = await adminDb.collection('products').get();
    const inventory = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data.title || data.name,
        inventory: data.inventory ?? 0,
        inStock: data.inStock ?? false,
        partnerId: data.partnerId,
        partnerName: data.partnerName,
      };
    });

    return NextResponse.json({ success: true, data: inventory });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authResult = await requireServerRole(req, ['admin']);
    if (!authResult.authenticated) {
      return NextResponse.json({ success: false, error: authResult.error || 'Admin authentication required' }, { status: 401 });
    }

    const { productId, newStock } = await req.json();
    if (!productId || newStock === undefined) {
      return NextResponse.json({ success: false, error: 'productId and newStock are required' }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ success: false, error: 'Firebase Admin DB is unconfigured on server' }, { status: 503 });
    }

    const prodRef = adminDb.collection('products').doc(productId);
    await prodRef.update({
      inventory: Number(newStock),
      inStock: Number(newStock) > 0,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, message: 'Product stock updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}
