import { apiFetch } from './client';
import { SessionKeyword } from '@/types/session';

export const keywordsApi = {
  list: (sessionId: string) => apiFetch<SessionKeyword[]>(`/api/sessions/${sessionId}/keywords`),
  add: (sessionId: string, term: string, logic: string) =>
    apiFetch<SessionKeyword>(`/api/sessions/${sessionId}/keywords`, {
      method: 'POST',
      body: JSON.stringify({ term, logic }),
    }),
  remove: (sessionId: string, keywordId: number) =>
    apiFetch<void>(`/api/sessions/${sessionId}/keywords/${keywordId}`, { method: 'DELETE' }),
};
