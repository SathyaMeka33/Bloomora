import api from "../client";
import type { Cart, CartItem } from "../types";

export const cartApiService = {
  async getCart(): Promise<Cart> {
    return api.get<Cart>("/api/cart/");
  },
  async addItem(productId: number, quantity = 1, personalization?: Record<string,unknown>, giftMessage?: string): Promise<Cart> {
    return api.post<Cart>("/api/cart/items/", { product: productId, quantity, personalization, gift_message: giftMessage });
  },
  async updateItem(itemId: number, quantity: number): Promise<CartItem> {
    return api.patch<CartItem>(`/api/cart/items/${itemId}/`, { quantity });
  },
  async removeItem(itemId: number): Promise<void> {
    return api.delete(`/api/cart/items/${itemId}/`);
  },
  async clearCart(): Promise<void> {
    try {
      await api.post('/api/cart/clear/');
    } catch {
      // ignore
    }
  },
};
