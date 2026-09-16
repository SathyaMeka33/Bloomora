import api from "../client";
import type { Notification } from "../types";

export const notificationApiService = {
  async getAll(): Promise<Notification[]> {
    return api.get<Notification[]>("/api/notifications/");
  },
  async markRead(id: number): Promise<void> {
    return api.patch(`/api/notifications/${id}/read/`);
  },
};
