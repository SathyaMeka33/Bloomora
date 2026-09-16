/**
 * Bloomora Product API Service
 */
import api from '../client';
import type { Product, ProductsResponse, Category } from '../types';

export interface ProductFilters {
  category?: number | string;
  search?: string;
  min_price?: number;
  max_price?: number;
  emotion?: string;
  occasion?: string;
  customizable?: boolean;
  same_day?: boolean;
  location?: string;
  featured?: boolean;
  is_best_seller?: boolean;
  is_trending?: boolean;
  page?: number;
  ordering?: string;
}

function buildQueryString(filters: ProductFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export const productApiService = {
  async getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
    const qs = buildQueryString(filters);
    return api.get<ProductsResponse>(`/api/products/${qs}`);
  },

  async getProduct(id: number | string): Promise<Product> {
    return api.get<Product>(`/api/products/${id}/`);
  },

  async getCategories(): Promise<Category[]> {
    const response = await api.get<{ results: Category[] } | Category[]>('/api/categories/');
    if (Array.isArray(response)) return response;
    return (response as { results: Category[] }).results || [];
  },

  async getFeaturedProducts(): Promise<Product[]> {
    const response = await productApiService.getProducts({ featured: true });
    return response.results;
  },

  async getBestSellers(): Promise<Product[]> {
    const response = await productApiService.getProducts({ is_best_seller: true });
    return response.results;
  },

  async getTrending(): Promise<Product[]> {
    const response = await productApiService.getProducts({ is_trending: true });
    return response.results;
  },

  async searchProducts(query: string): Promise<Product[]> {
    const response = await productApiService.getProducts({ search: query });
    return response.results;
  },

  // Seller-only operations
  async createProduct(data: Partial<Product>): Promise<Product> {
    return api.post<Product>('/api/products/', data);
  },

  async updateProduct(id: number, data: Partial<Product>): Promise<Product> {
    return api.put<Product>(`/api/products/${id}/`, data);
  },

  async deleteProduct(id: number): Promise<void> {
    return api.delete(`/api/products/${id}/`);
  },
};
