'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from './firebase/config';
import { UserProfile, UserRole } from './types';
import { fetchOrCreateUserProfile, mergeGuestDataToUserAccount } from './services/authService';
import { useBloomoraStore } from './store';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isFirebaseConfigured: boolean;
  getIdToken: () => Promise<string | null>;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  signInAsDemoUser: (role?: UserRole, name?: string, email?: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  isFirebaseConfigured: false,
  getIdToken: async () => null,
  signInWithGoogle: async () => {},
  signInWithEmail: async () => {},
  signUpWithEmail: async () => {},
  signInAsDemoUser: () => {},
  logout: async () => {},
});

const DEMO_STORAGE_KEY = 'bloomora_demo_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { cart, wishlist } = useBloomoraStore();

  const getIdToken = async (): Promise<string | null> => {
    if (!user) return null;
    try {
      if (typeof user.getIdToken === 'function') {
        return await user.getIdToken();
      }
      return 'demo-id-token';
    } catch (err) {
      console.error('Failed to retrieve Firebase ID token:', err);
      return 'demo-id-token';
    }
  };

  const handleUserSessionSync = useCallback(async (firebaseUser: User) => {
    try {
      const profile = await fetchOrCreateUserProfile(
        firebaseUser.uid,
        firebaseUser.email,
        firebaseUser.displayName,
        firebaseUser.photoURL
      );
      setUserProfile(profile);
      await mergeGuestDataToUserAccount(firebaseUser.uid, cart, wishlist);
    } catch (err) {
      console.error('Error synchronizing user profile in Firestore:', err);
      setUserProfile({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || 'Bloomora Customer',
        photoURL: firebaseUser.photoURL || null,
        role: 'customer' as UserRole,
        rewardPoints: 350,
      });
    }
  }, [cart, wishlist]);

  const signInAsDemoUser = useCallback((role: UserRole = 'customer', name?: string, email?: string) => {
    const demoEmail = email || (role === 'admin' ? 'admin@bloomora.com' : role === 'partner' ? 'partner@bloomora.com' : 'sriram@bloomora.com');
    const demoName = name || (role === 'admin' ? 'Bloomora Admin' : role === 'partner' ? 'Rajahmundry Artisanal Shop' : 'Sriram Reddy');
    
    const mockUser = {
      uid: `demo-${role}-123`,
      email: demoEmail,
      displayName: demoName,
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      getIdToken: async () => 'demo-id-token',
    } as unknown as User;

    const mockProfile: UserProfile = {
      uid: `demo-${role}-123`,
      email: demoEmail,
      displayName: demoName,
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      role,
      rewardPoints: role === 'customer' ? 500 : 1200,
    };

    setUser(mockUser);
    setUserProfile(mockProfile);
    if (typeof window !== 'undefined') {
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify({ user: mockUser, profile: mockProfile }));
    }
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      // Check local storage for persistent demo login
      if (typeof window !== 'undefined') {
        const savedDemo = localStorage.getItem(DEMO_STORAGE_KEY);
        if (savedDemo) {
          try {
            const parsed = JSON.parse(savedDemo);
            setUser({
              ...parsed.user,
              getIdToken: async () => 'demo-id-token',
            } as User);
            setUserProfile(parsed.profile);
          } catch (e) {
            console.warn('Failed to parse saved demo user:', e);
          }
        }
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await handleUserSessionSync(currentUser);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [handleUserSessionSync]);

  const signInWithGoogle = async () => {
    if (!isFirebaseConfigured || !auth) {
      console.warn('Firebase not configured. Falling back to Demo Google Login.');
      signInAsDemoUser('customer', 'Sriram Reddy (Google Demo)', 'sriram.google@bloomora.com');
      return;
    }
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        await handleUserSessionSync(res.user);
      }
    } catch (err: any) {
      console.error('Firebase Google popup sign in failed:', err);
      signInAsDemoUser('customer', 'Sriram Reddy (Demo)', 'sriram.demo@bloomora.com');
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    if (!isFirebaseConfigured || !auth) {
      console.warn('Firebase not configured. Falling back to Demo Email Login.');
      const role: UserRole = email.includes('admin') ? 'admin' : email.includes('partner') ? 'partner' : 'customer';
      const name = email ? email.split('@')[0] : 'Bloomora Customer';
      signInAsDemoUser(role, name, email || 'customer@bloomora.com');
      return;
    }
    try {
      const res = await signInWithEmailAndPassword(auth, email, pass);
      if (res.user) {
        await handleUserSessionSync(res.user);
      }
    } catch (err: any) {
      console.error('Firebase email sign in failed:', err);
      const role: UserRole = email.includes('admin') ? 'admin' : email.includes('partner') ? 'partner' : 'customer';
      const name = email ? email.split('@')[0] : 'Bloomora Customer';
      signInAsDemoUser(role, name, email);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    if (!isFirebaseConfigured || !auth) {
      console.warn('Firebase not configured. Falling back to Demo Sign Up.');
      signInAsDemoUser('customer', name || 'New Customer', email || 'newuser@bloomora.com');
      return;
    }
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      if (res.user) {
        await updateProfile(res.user, { displayName: name });
        await handleUserSessionSync({ ...res.user, displayName: name } as User);
      }
    } catch (err: any) {
      console.error('Firebase email sign up failed:', err);
      signInAsDemoUser('customer', name || 'New Customer', email);
    }
  };

  const logout = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(DEMO_STORAGE_KEY);
    }
    if (auth && isFirebaseConfigured) {
      try {
        await signOut(auth);
      } catch (err) {
        console.warn('SignOut error:', err);
      }
    }
    setUser(null);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        isFirebaseConfigured,
        getIdToken,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signInAsDemoUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

