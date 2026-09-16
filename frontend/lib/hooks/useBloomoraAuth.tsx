/**
 * useBloomoraAuth — Centralized auth state for Bloomora (Django JWT)
 * Drop-in hook used across all components.
 */
'use client';

import { useState, useEffect, useCallback, createContext, useContext } from 'react';

interface AuthUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: string;
  phone_number?: string;
}

interface AuthCtx {
  user: AuthUser | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx>({
  user: null,
  isLoggedIn: false,
  loading: true,
  login: async () => {},
  logout: async () => {},
  refreshUser: async () => {},
});

export function BloomoraAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const { authApiService } = await import('@/lib/api');
      if (!authApiService.isAuthenticated()) {
        setUser(null);
        return;
      }
      const me = await authApiService.getMe();
      setUser({
        id: me.id,
        email: me.email,
        first_name: me.first_name,
        last_name: me.last_name,
        full_name: me.full_name || `${me.first_name} ${me.last_name}`.trim(),
        role: me.role,
        phone_number: me.phone_number,
      });
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    const { authApiService } = await import('@/lib/api');
    await authApiService.login({ email, password });
    await refreshUser();
  }, [refreshUser]);

  const logout = useCallback(async () => {
    const { authApiService } = await import('@/lib/api');
    await authApiService.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn: !!user,
      loading,
      login,
      logout,
      refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useBloomoraAuth() {
  return useContext(AuthContext);
}

export default useBloomoraAuth;
