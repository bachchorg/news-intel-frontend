import { apiFetch } from './client';
import { Article } from '@/types/article';

export const articlesApi = {
  list: (sessionId: string, page = 1, pageSize = 50) =>
    apiFetch<{ articles: Article[]; total: number; page: number; pageSize: number }>(
      `/api/sessions/${sessionId}/articles?page=${page}&pageSize=${pageSize}`
    ),
};
