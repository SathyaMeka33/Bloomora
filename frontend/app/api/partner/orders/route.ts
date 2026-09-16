import { NextRequest, NextResponse } from 'next/server';
import { requireServerRole } from '@/lib/firebase/verifyAuth';
import { adminDb } from '@/lib/firebase/admin';

export async function GET(req: NextRequest) {
  try {
    const authResult = await requireServerRole(req, ['partner', 'admin']);
    if (!authResult.authenticated || !authResult.uid) {
      return NextResponse.json({ success: false, error: authResult.error || 'Partner authentication required' }, { status: 401 });
    }

    if (!adminDb) {
      return NextResponse.json({ success: false, error: 'Firebase Admin DB is unconfigured on server' }, { status: 503 });
    }

    const ordersSnap = await adminDb.collection('orders').get();
    const allOrders = ordersSnap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));

    if (authResult.role === 'admin') {
      return NextResponse.json({ success: true, data: allOrders });
    }

    // Filter strictly by partnerId or items containing partnerId
    const partnerOrders = allOrders.filter((order: any) => {
      return (
        order.partnerId === authResult.uid ||
        (Array.isArray(order.items) && order.items.some((item: any) => item.partnerId === authResult.uid))
      );
    });

    return NextResponse.json({ success: true, data: partnerOrders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}
