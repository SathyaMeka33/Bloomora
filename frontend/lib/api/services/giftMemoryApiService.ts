import api from "../client";
import type { GiftMemory } from "../types";

export const giftMemoryApiService = {
  async getAll(): Promise<GiftMemory[]> {
    return api.get<GiftMemory[]>("/api/gift-memory/");
  },
  async getByRecipient(recipientId: number): Promise<GiftMemory[]> {
    return api.get<GiftMemory[]>(`/api/gift-memory/${recipientId}/`);
  },
  async create(data: Omit<GiftMemory, "id"|"recipient_name"|"created_at">): Promise<GiftMemory> {
    return api.post<GiftMemory>("/api/gift-memory/", data);
  },
};
