import api from "../client";
import type { Wishlist } from "../types";

export const wishlistApiService = {
  async getWishlist(): Promise<Wishlist> {
    return api.get<Wishlist>("/api/wishlist/");
  },
  async addToWishlist(productId: number): Promise<void> {
    return api.post("/api/wishlist/", { product_id: productId });
  },
  async removeFromWishlist(productId: number): Promise<void> {
    return api.delete(`/api/wishlist/${productId}/`);
  },
};
