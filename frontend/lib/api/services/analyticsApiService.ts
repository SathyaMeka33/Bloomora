import api from "../client";

export const analyticsApiService = {
  async trackEvent(eventType: string, data: Record<string,unknown> = {}): Promise<void> {
    try {
      await api.post("/api/analytics/event/", { event_type: eventType, data });
    } catch {
      // Analytics should never throw
    }
  },
};
