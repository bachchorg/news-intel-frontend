import { apiFetch } from './client';
import { NEWS_SOURCES, NewsSource } from '@/lib/newsSources';

/**
 * Gateway client for accessing external news APIs through our backend proxy.
 *
 * All requests are routed via the backend (/api/news-gateway/:sourceId/...)
 * so that API keys are kept server-side and CORS is avoided.
 */

export interface NewsGatewaySearchParams {
  query: string;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
  language?: string;
  sortBy?: 'relevancy' | 'publishedAt' | 'popularity';
}

export interface GatewayArticle {
  title: string;
  description?: string;
  url: string;
  source: string;
  publishedAt: string;
  author?: string;
  imageUrl?: string;
}

export interface GatewaySearchResponse {
  articles: GatewayArticle[];
  totalResults: number;
  sourceId: string;
}

export interface GatewaySourceStatus {
  sourceId: string;
  label: string;
  available: boolean;
  configured: boolean;
  apiUrl: string;
}

export const newsGatewayApi = {
  /**
   * Search articles through a specific news source via the backend gateway.
   */
  search: (sourceId: string, params: NewsGatewaySearchParams) =>
    apiFetch<GatewaySearchResponse>(
      `/api/news-gateway/${sourceId}/search`,
      { method: 'POST', body: JSON.stringify(params) }
    ),

  /**
   * Search multiple sources in parallel and return combined results.
   */
  searchMultiple: async (sourceIds: string[], params: NewsGatewaySearchParams) => {
    const results = await Promise.allSettled(
      sourceIds.map((id) =>
        apiFetch<GatewaySearchResponse>(
          `/api/news-gateway/${id}/search`,
          { method: 'POST', body: JSON.stringify(params) }
        )
      )
    );

    const articles: GatewayArticle[] = [];
    const errors: { sourceId: string; error: string }[] = [];

    results.forEach((result, i) => {
      if (result.status === 'fulfilled') {
        articles.push(...result.value.articles);
      } else {
        errors.push({ sourceId: sourceIds[i], error: result.reason?.message ?? 'Unknown error' });
      }
    });

    return { articles, errors };
  },

  /**
   * Get the configuration/availability status of all registered sources.
   */
  getSourceStatuses: () =>
    apiFetch<GatewaySourceStatus[]>('/api/news-gateway/sources'),

  /**
   * Test connectivity to a specific source.
   */
  testSource: (sourceId: string) =>
    apiFetch<{ ok: boolean; latencyMs: number; error?: string }>(
      `/api/news-gateway/${sourceId}/test`
    ),

  /**
   * Resolve source metadata from the local registry (no network call).
   */
  getSourceMeta: (sourceId: string): NewsSource | undefined =>
    NEWS_SOURCES.find((s) => s.id === sourceId),
};
