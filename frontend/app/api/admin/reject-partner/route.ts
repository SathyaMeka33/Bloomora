import { NextRequest, NextResponse } from 'next/server';
import { requireServerRole } from '@/lib/firebase/verifyAuth';
import { adminDb } from '@/lib/firebase/admin';

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireServerRole(req, ['admin']);
    if (!authResult.authenticated) {
      return NextResponse.json({ success: false, error: authResult.error || 'Admin authentication required' }, { status: 401 });
    }

    const { applicationId, reason } = await req.json();
    if (!applicationId) {
      return NextResponse.json({ success: false, error: 'applicationId is required' }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ success: false, error: 'Firebase Admin DB is unconfigured on server' }, { status: 503 });
    }

    const appRef = adminDb.collection('partnerApplications').doc(applicationId);
    const appSnap = await appRef.get();

    if (!appSnap.exists) {
      return NextResponse.json({ success: false, error: 'Partner application not found' }, { status: 404 });
    }

    await appRef.update({
      status: 'rejected',
      rejectionReason: reason || 'Application did not meet criteria',
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, message: 'Partner application rejected successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}
