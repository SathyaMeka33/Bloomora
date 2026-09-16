import { NextRequest, NextResponse } from 'next/server';
import { requireServerRole } from '@/lib/firebase/verifyAuth';
import { adminDb } from '@/lib/firebase/admin';
import { SellerOrderStatus } from '@/lib/types/models';

const VALID_SELLER_STATUSES: SellerOrderStatus[] = [
  'NEW',
  'ACCEPTED',
  'PREPARING',
  'READY',
  'HANDED_TO_BLOOMORA',
  'COMPLETED',
];

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: orderId } = await params;
    const authResult = await requireServerRole(req, ['partner', 'admin']);
    if (!authResult.authenticated || !authResult.uid) {
      return NextResponse.json({ success: false, error: authResult.error || 'Partner authentication required' }, { status: 401 });
    }

    const { status } = await req.json();
    if (!status || !VALID_SELLER_STATUSES.includes(status)) {
      return NextResponse.json(
        { success: false, error: `Invalid status. Must be one of: ${VALID_SELLER_STATUSES.join(', ')}` },
        { status: 400 }
      );
    }

    if (!adminDb) {
      return NextResponse.json({ success: false, error: 'Firebase Admin DB is unconfigured on server' }, { status: 503 });
    }

    const orderRef = adminDb.collection('orders').doc(orderId);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const orderData = orderSnap.data();

    // Verify ownership
    const isOwner =
      authResult.role === 'admin' ||
      orderData?.partnerId === authResult.uid ||
      (Array.isArray(orderData?.items) && orderData.items.some((i: any) => i.partnerId === authResult.uid));

    if (!isOwner) {
      return NextResponse.json({ success: false, error: 'Access denied. You do not own items in this order.' }, { status: 403 });
    }

    await orderRef.update({
      status,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, message: `Seller order status updated to ${status}` });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}
