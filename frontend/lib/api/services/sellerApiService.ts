import api from "../client";
import type { Seller, Product } from "../types";

export const sellerApiService = {
  async getMyProfile(): Promise<Seller> {
    return api.get<Seller>("/api/seller/me/");
  },
  async updateMyProfile(data: Partial<Seller>): Promise<Seller> {
    return api.put<Seller>("/api/seller/me/", data);
  },
  async getSellers(): Promise<Seller[]> {
    return api.get<Seller[]>("/api/sellers/");
  },
  async getSeller(id: number): Promise<Seller> {
    return api.get<Seller>(`/api/sellers/${id}/`);
  },
  async getMyProducts(): Promise<Product[]> {
    return api.get<Product[]>("/api/sellers/products/");
  },
};
