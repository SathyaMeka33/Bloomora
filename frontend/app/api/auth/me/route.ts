import { NextRequest, NextResponse } from 'next/server';
import { verifyServerAuthToken } from '@/lib/firebase/verifyAuth';

export async function GET(req: NextRequest) {
  try {
    const authResult = await verifyServerAuthToken(req);
    if (!authResult.authenticated) {
      return NextResponse.json({ success: false, error: authResult.error }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      data: {
        uid: authResult.uid,
        email: authResult.email,
        role: authResult.role,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
