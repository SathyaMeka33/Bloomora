import { NextRequest, NextResponse } from 'next/server';
import { requireServerRole } from '@/lib/firebase/verifyAuth';
import { adminDb } from '@/lib/firebase/admin';

export async function PATCH(req: NextRequest) {
  try {
    const authResult = await requireServerRole(req, ['admin']);
    if (!authResult.authenticated) {
      return NextResponse.json({ success: false, error: authResult.error || 'Admin authentication required' }, { status: 401 });
    }

    const { productId, availability, inStock, approvalStatus } = await req.json();
    if (!productId) {
      return NextResponse.json({ success: false, error: 'productId is required' }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ success: false, error: 'Firebase Admin DB is unconfigured on server' }, { status: 503 });
    }

    const prodRef = adminDb.collection('products').doc(productId);
    const prodSnap = await prodRef.get();

    if (!prodSnap.exists) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    const updatePayload: Record<string, any> = { updatedAt: new Date().toISOString() };
    if (typeof availability === 'boolean') updatePayload.availability = availability;
    if (typeof inStock === 'boolean') updatePayload.inStock = inStock;
    if (approvalStatus) updatePayload.approvalStatus = approvalStatus;

    await prodRef.update(updatePayload);

    return NextResponse.json({ success: true, message: 'Product status updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}
