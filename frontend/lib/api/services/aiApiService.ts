/**
 * Bloomora AI API Service
 * Gift Finder, Chat Concierge, Message Generator, Budget Optimizer
 */
import api from '../client';
import type {
  RecommendationsResponse,
  GiftIntentInput,
  ChatResponse,
  GreetingMessageInput,
} from '../types';

export const aiApiService = {
  /**
   * Full AI Gift Finder - 7-step wizard sends to this endpoint.
   * Returns recommendations with Gift Fit Scores and "why this gift" explanations.
   */
  async findGifts(intent: GiftIntentInput): Promise<RecommendationsResponse> {
    return api.post<RecommendationsResponse>('/api/ai/gift-finder/', intent);
  },

  /**
   * Rule-based recommendations (faster, no AI cost).
   * Used as fallback or for quick results.
   */
  async getRecommendations(intent: GiftIntentInput): Promise<RecommendationsResponse> {
    return api.post<RecommendationsResponse>('/api/recommendations/', intent);
  },

  /**
   * Bloomora AI Chat Concierge.
   * Multi-turn conversation with gift intent context.
   */
  async chat(message: string, conversationId?: number, context?: Record<string, unknown>): Promise<ChatResponse> {
    return api.post<ChatResponse>('/api/ai/chat/', {
      message,
      conversation_id: conversationId,
      context,
    });
  },

  /**
   * Generate AI gift message.
   */
  async generateGiftMessage(input: GreetingMessageInput): Promise<{ message: string }> {
    return api.post<{ message: string }>('/api/ai/greeting-message/', input);
  },

  /**
   * Budget optimizer - get best gift combo within budget.
   */
  async optimizeBudget(budget: number, occasion?: string): Promise<{
    main_gift?: { product: number; price: number };
    additions: Array<{ name: string; price: number }>;
    total: number;
    remaining_budget: number;
    budget: number;
  }> {
    return api.post('/api/ai/budget-optimizer/', { budget, occasion });
  },

  /**
   * Get conversation list.
   */
  async getConversations() {
    return api.get('/api/ai/conversations/');
  },

  /**
   * Get conversation messages.
   */
  async getConversation(id: number) {
    return api.get(`/api/ai/conversations/${id}/`);
  },
};
