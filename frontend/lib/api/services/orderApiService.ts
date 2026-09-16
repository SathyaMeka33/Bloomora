import api from "../client";
import type { Order } from "../types";

export const orderApiService = {
  async getOrders(): Promise<Order[]> {
    return api.get<Order[]>("/api/orders/");
  },
  async getOrder(id: number): Promise<Order> {
    return api.get<Order>(`/api/orders/${id}/`);
  },
  async createOrder(data: { address_id?: number; delivery_date?: string; gift_message?: string }): Promise<Order> {
    return api.post<Order>("/api/orders/", data);
  },
  async getHistory(): Promise<Order[]> {
    return api.get<Order[]>("/api/orders/history/");
  },
};
