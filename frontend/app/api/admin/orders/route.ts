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

    const snapshot = await adminDb.collection('orders').get();
    const orders = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));

    return NextResponse.json({ success: true, data: orders });
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

    const { orderId, status, paymentStatus } = await req.json();
    if (!orderId) {
      return NextResponse.json({ success: false, error: 'orderId is required' }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ success: false, error: 'Firebase Admin DB is unconfigured on server' }, { status: 503 });
    }

    const orderRef = adminDb.collection('orders').doc(orderId);
    const updateData: Record<string, any> = { updatedAt: new Date().toISOString() };
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    await orderRef.update(updateData);

    return NextResponse.json({ success: true, message: 'Order updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}
