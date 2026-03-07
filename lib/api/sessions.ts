import { apiFetch, BASE_API_URL } from './client';
import { CrawlSession, CreateSessionRequest, UpdateSessionRequest } from '@/types/session';
import { AnalyticsSnapshot } from '@/types/analytics';

export const sessionsApi = {
  list: () => apiFetch<CrawlSession[]>('/api/sessions'),
  get: (id: string) => apiFetch<CrawlSession>(`/api/sessions/${id}`),
  create: (req: CreateSessionRequest) =>
    apiFetch<CrawlSession>('/api/sessions', { method: 'POST', body: JSON.stringify(req) }),
  update: (id: string, req: UpdateSessionRequest) =>
    apiFetch<CrawlSession>(`/api/sessions/${id}`, { method: 'PUT', body: JSON.stringify(req) }),
  start: (id: string) => apiFetch<void>(`/api/sessions/${id}/start`, { method: 'PUT' }),
  pause: (id: string) => apiFetch<void>(`/api/sessions/${id}/pause`, { method: 'PUT' }),
  stop: (id: string) => apiFetch<void>(`/api/sessions/${id}/stop`, { method: 'PUT' }),
  delete: (id: string) => apiFetch<void>(`/api/sessions/${id}`, { method: 'DELETE' }),
  getAnalytics: (id: string) => apiFetch<AnalyticsSnapshot>(`/api/sessions/${id}/analytics`),
  getSummary: (id: string) => apiFetch<{ summary: string; generatedAt: string }>(`/api/sessions/${id}/summary`),
  exportCsv: (id: string) => fetch(`${BASE_API_URL}/api/sessions/${id}/export/csv`),
  exportJson: (id: string) => fetch(`${BASE_API_URL}/api/sessions/${id}/export/json`),
  getRateLimits: () => apiFetch<RateLimitInfo[]>('/api/sessions/rate-limits'),
};

export interface RateLimitInfo {
  sourceName: string;
  remainingRequests: number | null;
  dailyLimit: number | null;
  lastRequestAt: string;
  resetsAt: string | null;
  isExhausted: boolean;
}
