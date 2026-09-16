import 'server-only';
import { NextRequest } from 'next/server';
import { adminAuth, adminDb } from './admin';
import { UserRole } from '../types';

export interface VerifiedAuthResult {
  authenticated: boolean;
  uid?: string;
  email?: string;
  role?: UserRole;
  error?: string;
}

export async function verifyServerAuthToken(req: NextRequest): Promise<VerifiedAuthResult> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { authenticated: false, error: 'Authorization header missing or invalid' };
  }

  const idToken = authHeader.split('Bearer ')[1];
  if (!idToken) {
    return { authenticated: false, error: 'Bearer token missing' };
  }

  if (!adminAuth) {
    return { authenticated: false, error: 'Firebase Admin Auth is not configured on server' };
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const email = decodedToken.email;

    let role: UserRole = 'customer';
    if (adminDb) {
      const userDoc = await adminDb.collection('users').doc(uid).get();
      if (userDoc.exists) {
        const data = userDoc.data();
        role = (data?.role as UserRole) || 'customer';
      }
    }

    return {
      authenticated: true,
      uid,
      email,
      role,
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown verification error';
    console.error('Server ID token verification failed:', errorMsg);
    return { authenticated: false, error: 'Invalid or expired authentication token' };
  }
}

export async function requireServerRole(
  req: NextRequest,
  allowedRoles: UserRole[]
): Promise<VerifiedAuthResult> {
  const authResult = await verifyServerAuthToken(req);
  if (!authResult.authenticated || !authResult.role) {
    return { authenticated: false, error: authResult.error || 'Authentication required' };
  }

  if (!allowedRoles.includes(authResult.role)) {
    return { authenticated: false, error: `Access denied. Requires role: ${allowedRoles.join(' or ')}` };
  }

  return authResult;
}
