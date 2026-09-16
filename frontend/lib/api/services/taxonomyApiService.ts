/**
 * taxonomyApiService — fetches taxonomy from Django
 */
import api from '../client';

export interface TaxonomyItem {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  emoji?: string;
  image?: string;
  display_order: number;
  description?: string;
  is_featured?: boolean;
  is_seasonal?: boolean;
  subcategories?: TaxonomyItem[];
}

export interface TaxonomyData {
  gift_types: TaxonomyItem[];
  occasion_types: TaxonomyItem[];
  recipient_types: TaxonomyItem[];
  gift_intents: TaxonomyItem[];
}

interface TaxonomyResponse {
  success: boolean;
  data: TaxonomyData;
}

export const taxonomyApiService = {
  async getTaxonomy(): Promise<TaxonomyData> {
    const res = await api.get<TaxonomyResponse>('/api/taxonomy/');
    return res.data;
  },
  async getGiftTypes(): Promise<TaxonomyItem[]> {
    const res = await api.get<{ data: TaxonomyItem[] }>('/api/taxonomy/gift-types/');
    return res.data;
  },
  async getOccasionTypes(): Promise<TaxonomyItem[]> {
    const res = await api.get<{ data: TaxonomyItem[] }>('/api/taxonomy/occasion-types/');
    return res.data;
  },
  async getRecipientTypes(): Promise<TaxonomyItem[]> {
    const res = await api.get<{ data: TaxonomyItem[] }>('/api/taxonomy/recipient-types/');
    return res.data;
  },
};
