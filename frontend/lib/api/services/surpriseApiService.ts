import api from "../client";
import type { Surprise } from "../types";

export const surpriseApiService = {
  async create(data: Partial<Surprise>): Promise<Surprise> {
    return api.post<Surprise>("/api/surprises/", data);
  },
  async get(id: number): Promise<Surprise> {
    return api.get<Surprise>(`/api/surprises/${id}/`);
  },
  async update(id: number, data: Partial<Surprise>): Promise<Surprise> {
    return api.post<Surprise>(`/api/surprises/${id}/`, data);
  },
  async checkout(id: number): Promise<{ message: string; id: number }> {
    return api.post(`/api/surprises/${id}/checkout/`);
  },
};
