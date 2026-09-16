import { NextRequest, NextResponse } from 'next/server';
import { requireServerRole } from '@/lib/firebase/verifyAuth';
import { adminDb } from '@/lib/firebase/admin';

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireServerRole(req, ['admin']);
    if (!authResult.authenticated) {
      return NextResponse.json({ success: false, error: authResult.error || 'Admin authentication required' }, { status: 401 });
    }

    const { applicationId } = await req.json();
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
      status: 'approved',
      updatedAt: new Date().toISOString(),
    });

    const appData = appSnap.data();
    if (appData?.email) {
      // Ensure user role is updated to partner if user account exists
      const usersSnap = await adminDb.collection('users').where('email', '==', appData.email).limit(1).get();
      if (!usersSnap.empty) {
        await usersSnap.docs[0].ref.update({ role: 'partner' });
      }
    }

    return NextResponse.json({ success: true, message: 'Partner application approved successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}
