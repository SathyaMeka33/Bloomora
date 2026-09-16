import api from "../client";
import type { Review } from "../types";

export const reviewApiService = {
  async getProductReviews(productId: number): Promise<Review[]> {
    return api.get<Review[]>(`/api/products/${productId}/reviews/`);
  },
  async createReview(data: { product: number; rating: number; comment: string }): Promise<Review> {
    return api.post<Review>("/api/reviews/", data);
  },
  async submitFeedback(data: { message: string; rating?: number; page?: string }): Promise<void> {
    return api.post("/api/feedback/", data);
  },
};
