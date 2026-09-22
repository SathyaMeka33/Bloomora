/**
 * Bloomora Auth API Service
 * Handles Django JWT authentication
 */
import api, { tokenManager } from '../client';
import type { AuthResponse, AuthUser, Address } from '../types';

export const authApiService = {
  async register(data: {
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    role?: string;
    store_name?: string;
    city?: string;
  }): Promise<AuthResponse> {
    const result = await api.post<AuthResponse>('/api/auth/register/', data);
    tokenManager.setTokens(result.access, result.refresh);
    return result;
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const result = await api.post<AuthResponse>('/api/auth/login/', data);
    tokenManager.setTokens(result.access, result.refresh);
    return result;
  },

  async logout(): Promise<void> {
    const refresh = tokenManager.getRefresh();
    if (refresh) {
      try {
        await api.post('/api/auth/logout/', { refresh });
      } catch {
        // ignore
      }
    }
    tokenManager.clearTokens();
  },

  async getMe(): Promise<AuthUser> {
    return api.get<AuthUser>('/api/auth/me/');
  },

  async updateMe(data: Partial<AuthUser>): Promise<AuthUser> {
    return api.put<AuthUser>('/api/auth/me/', data);
  },

  isAuthenticated(): boolean {
    const token = tokenManager.getAccess();
    if (!token) return false;
    return !tokenManager.isExpired(token);
  },

  // Addresses
  async getAddresses(): Promise<Address[]> {
    return api.get<Address[]>('/api/users/addresses/');
  },

  async createAddress(data: Omit<Address, 'id' | 'created_at'>): Promise<Address> {
    return api.post<Address>('/api/users/addresses/', data);
  },

  async updateAddress(id: number, data: Partial<Address>): Promise<Address> {
    return api.put<Address>(`/api/users/addresses/${id}/`, data);
  },

  async deleteAddress(id: number): Promise<void> {
    return api.delete(`/api/users/addresses/${id}/`);
  },
};
