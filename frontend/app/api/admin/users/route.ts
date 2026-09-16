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

    const snapshot = await adminDb.collection('users').get();
    const users = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      // Ensure password or auth sensitive hashes are NEVER returned
      delete data.password;
      delete data.hash;
      return { uid: docSnap.id, ...data };
    });

    return NextResponse.json({ success: true, data: users });
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

    const { targetUid, role, rewardPoints } = await req.json();
    if (!targetUid) {
      return NextResponse.json({ success: false, error: 'targetUid is required' }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ success: false, error: 'Firebase Admin DB is unconfigured on server' }, { status: 503 });
    }

    const userRef = adminDb.collection('users').doc(targetUid);
    const updateData: Record<string, any> = { updatedAt: new Date().toISOString() };
    if (role) updateData.role = role;
    if (rewardPoints !== undefined) updateData.rewardPoints = rewardPoints;

    await userRef.update(updateData);

    return NextResponse.json({ success: true, message: 'User updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}
