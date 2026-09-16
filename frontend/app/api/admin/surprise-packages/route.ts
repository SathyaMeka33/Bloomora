import { NextRequest, NextResponse } from 'next/server';
import { requireServerRole } from '@/lib/firebase/verifyAuth';
import { adminDb } from '@/lib/firebase/admin';

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireServerRole(req, ['admin']);
    if (!authResult.authenticated) {
      return NextResponse.json({ success: false, error: authResult.error || 'Admin authentication required' }, { status: 401 });
    }

    const experienceData = await req.json();
    if (!experienceData.id || !experienceData.title || !experienceData.occasion) {
      return NextResponse.json({ success: false, error: 'id, title, and occasion are required' }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ success: false, error: 'Firebase Admin DB is unconfigured on server' }, { status: 503 });
    }

    const expRef = adminDb.collection('surpriseExperiences').doc(experienceData.id);
    await expRef.set({
      ...experienceData,
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    return NextResponse.json({ success: true, message: 'Surprise Experience package saved successfully', data: experienceData });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}
