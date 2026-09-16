import { NextRequest, NextResponse } from 'next/server';
import { requireServerRole } from '@/lib/firebase/verifyAuth';
import { adminDb } from '@/lib/firebase/admin';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: productId } = await params;
    const authResult = await requireServerRole(req, ['partner', 'admin']);
    if (!authResult.authenticated || !authResult.uid) {
      return NextResponse.json({ success: false, error: authResult.error || 'Partner authentication required' }, { status: 401 });
    }

    if (!adminDb) {
      return NextResponse.json({ success: false, error: 'Firebase Admin DB is unconfigured on server' }, { status: 503 });
    }

    const prodRef = adminDb.collection('products').doc(productId);
    const prodSnap = await prodRef.get();

    if (!prodSnap.exists) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    const prodData = prodSnap.data();

    // Verify ownership
    if (authResult.role !== 'admin' && prodData?.partnerId !== authResult.uid) {
      return NextResponse.json({ success: false, error: 'Access denied. You do not own this product.' }, { status: 403 });
    }

    const updates = await req.json();
    const updatePayload: Record<string, any> = { updatedAt: new Date().toISOString() };

    if (updates.title) {
      updatePayload.title = updates.title;
      updatePayload.name = updates.title;
    }
    if (updates.price !== undefined) updatePayload.price = Number(updates.price);
    if (updates.inventory !== undefined) {
      updatePayload.inventory = Number(updates.inventory);
      updatePayload.inStock = Number(updates.inventory) > 0;
    }
    if (typeof updates.inStock === 'boolean') updatePayload.inStock = updates.inStock;
    if (updates.description) updatePayload.description = updates.description;
    if (Array.isArray(updates.images)) updatePayload.images = updates.images;

    await prodRef.update(updatePayload);

    return NextResponse.json({ success: true, message: 'Partner product updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}
