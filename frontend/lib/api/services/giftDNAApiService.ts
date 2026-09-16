import api from "../client";
import type { GiftDNA } from "../types";

export const giftDNAApiService = {
  async getAll(): Promise<GiftDNA[]> {
    return api.get<GiftDNA[]>("/api/gift-dna/");
  },
  async create(data: Omit<GiftDNA, "id"|"updated_at">): Promise<GiftDNA> {
    return api.post<GiftDNA>("/api/gift-dna/", data);
  },
  async update(id: number, data: Partial<GiftDNA>): Promise<GiftDNA> {
    return api.put<GiftDNA>(`/api/gift-dna/${id}/`, data);
  },
  async delete(id: number): Promise<void> {
    return api.delete(`/api/gift-dna/${id}/`);
  },
};
