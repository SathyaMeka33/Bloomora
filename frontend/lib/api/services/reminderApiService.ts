import api from "../client";
import type { Reminder } from "../types";

export const reminderApiService = {
  async getReminders(): Promise<Reminder[]> {
    return api.get<Reminder[]>("/api/reminders/");
  },
  async createReminder(data: Omit<Reminder, "id"|"created_at"|"updated_at">): Promise<Reminder> {
    return api.post<Reminder>("/api/reminders/", data);
  },
  async updateReminder(id: number, data: Partial<Reminder>): Promise<Reminder> {
    return api.put<Reminder>(`/api/reminders/${id}/`, data);
  },
  async deleteReminder(id: number): Promise<void> {
    return api.delete(`/api/reminders/${id}/`);
  },
};
