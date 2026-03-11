/**
 * ============================================================================
 * API CLIENT HELPER
 * ============================================================================
 *
 * PRINCIPLE: DRY (Don't Repeat Yourself) for API Operations
 * ----------------------------------------------------------
 * Common API operations (create session, delete session, etc.) are wrapped
 * in typed helper functions. This avoids duplicating request logic across
 * tests and makes maintenance easier — if an endpoint changes, we fix it
 * in one place.
 *
 * PRINCIPLE: Clean Up After Yourself
 * -----------------------------------
 * Every test that creates data should delete it when done. The ApiClient
 * tracks created resources and provides a `cleanup()` method to delete them.
 *
 * EXAMPLE:
 *   test('example', async ({ request }) => {
 *     const api = new ApiClient(request);
 *     const session = await api.createSession();  // auto-tracked for cleanup
 *     // ... do assertions ...
 *     await api.cleanup();  // deletes the session
 *   });
 */
import { APIRequestContext, expect } from '@playwright/test';
import { TestData } from './test-data';

/** Shape of a session returned by the API */
export interface SessionResponse {
  id: string;
  name: string;
  state: string;
  createdAt: string;
  startedAt: string | null;
  stoppedAt: string | null;
  dateRangeFrom: string | null;
  dateRangeTo: string | null;
  pollIntervalSeconds: number;
  keywords: { id: number; term: string; logic: string }[];
  sources: { id: number; sourceName: string; isEnabled: boolean }[];
}

/** Shape of the paginated articles response */
export interface ArticlesResponse {
  articles: ArticleResponse[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ArticleResponse {
  articleId: string;
  source: string;
  articleUrl: string;
  headline: string;
  publishedAt: string;
  sentiment: string;
  keywordsMatched: string[];
}

export class ApiClient {
  private createdSessionIds: string[] = [];

  constructor(private request: APIRequestContext) {}

  // ---------------------------------------------------------------------------
  // SESSION OPERATIONS
  // ---------------------------------------------------------------------------

  /**
   * Creates a new crawl session and tracks it for cleanup.
   *
   * EXAMPLE:
   *   const session = await api.createSession();
   *   expect(session.name).toContain('Test Session');
   */
  async createSession(overrides: Record<string, unknown> = {}): Promise<SessionResponse> {
    const payload = TestData.createSessionPayload(overrides);
    const response = await this.request.post('/api/sessions', { data: payload });
    expect(response.status()).toBe(201);
    const session: SessionResponse = await response.json();
    this.createdSessionIds.push(session.id);
    return session;
  }

  /**
   * Fetches a single session by ID.
   *
   * EXAMPLE:
   *   const session = await api.getSession(sessionId);
   *   expect(session.state).toBe('Created');
   */
  async getSession(id: string): Promise<SessionResponse> {
    const response = await this.request.get(`/api/sessions/${id}`);
    expect(response.status()).toBe(200);
    return response.json();
  }

  /**
   * Fetches all sessions.
   *
   * EXAMPLE:
   *   const sessions = await api.getAllSessions();
   *   expect(sessions.length).toBeGreaterThanOrEqual(1);
   */
  async getAllSessions(): Promise<SessionResponse[]> {
    const response = await this.request.get('/api/sessions');
    expect(response.status()).toBe(200);
    return response.json();
  }

  /**
   * Updates a session with partial data.
   *
   * EXAMPLE:
   *   const updated = await api.updateSession(id, { name: 'New Name' });
   *   expect(updated.name).toBe('New Name');
   */
  async updateSession(id: string, data: Record<string, unknown>): Promise<SessionResponse> {
    const response = await this.request.put(`/api/sessions/${id}`, { data });
    expect(response.status()).toBe(200);
    return response.json();
  }

  /**
   * Starts a session's crawl.
   *
   * EXAMPLE:
   *   await api.startSession(session.id);
   */
  async startSession(id: string): Promise<void> {
    const response = await this.request.put(`/api/sessions/${id}/start`);
    expect(response.status()).toBe(204);
  }

  /**
   * Pauses a running session.
   */
  async pauseSession(id: string): Promise<void> {
    const response = await this.request.put(`/api/sessions/${id}/pause`);
    expect(response.status()).toBe(204);
  }

  /**
   * Stops a session.
   */
  async stopSession(id: string): Promise<void> {
    const response = await this.request.put(`/api/sessions/${id}/stop`);
    expect(response.status()).toBe(204);
  }

  /**
   * Deletes a session by ID.
   */
  async deleteSession(id: string): Promise<void> {
    const response = await this.request.delete(`/api/sessions/${id}`);
    expect(response.status()).toBe(204);
  }

  // ---------------------------------------------------------------------------
  // KEYWORD OPERATIONS
  // ---------------------------------------------------------------------------

  /**
   * Adds a keyword to a session.
   *
   * EXAMPLE:
   *   const keyword = await api.addKeyword(sessionId, 'bitcoin', 'or');
   *   expect(keyword.term).toBe('bitcoin');
   */
  async addKeyword(sessionId: string, term: string, logic: string = 'or') {
    const response = await this.request.post(`/api/sessions/${sessionId}/keywords`, {
      data: { term, logic },
    });
    expect(response.status()).toBe(200);
    return response.json();
  }

  /**
   * Fetches all keywords for a session.
   */
  async getKeywords(sessionId: string) {
    const response = await this.request.get(`/api/sessions/${sessionId}/keywords`);
    expect(response.status()).toBe(200);
    return response.json();
  }

  // ---------------------------------------------------------------------------
  // ARTICLE OPERATIONS
  // ---------------------------------------------------------------------------

  /**
   * Fetches paginated articles for a session.
   *
   * EXAMPLE:
   *   const result = await api.getArticles(sessionId, 1, 10);
   *   expect(result.articles).toHaveLength(10);
   *   expect(result.total).toBeGreaterThan(0);
   */
  async getArticles(sessionId: string, page = 1, pageSize = 50): Promise<ArticlesResponse> {
    const response = await this.request.get(
      `/api/sessions/${sessionId}/articles?page=${page}&pageSize=${pageSize}`
    );
    expect(response.status()).toBe(200);
    return response.json();
  }

  // ---------------------------------------------------------------------------
  // ANALYTICS
  // ---------------------------------------------------------------------------

  async getAnalytics(sessionId: string) {
    const response = await this.request.get(`/api/sessions/${sessionId}/analytics`);
    expect(response.status()).toBe(200);
    return response.json();
  }

  // ---------------------------------------------------------------------------
  // CLEANUP — Call this in afterEach or at the end of each test
  // ---------------------------------------------------------------------------

  /**
   * Deletes all sessions created during this test.
   * Silently ignores 404s (already deleted).
   *
   * PRINCIPLE: Every test cleans up after itself.
   * This prevents test pollution — one test's data should never
   * affect another test's outcome.
   *
   * EXAMPLE:
   *   test.afterEach(async ({ request }) => {
   *     await api.cleanup();
   *   });
   */
  async cleanup(): Promise<void> {
    for (const id of this.createdSessionIds) {
      try {
        await this.request.delete(`/api/sessions/${id}`);
      } catch {
        // Ignore — session may already be deleted by the test
      }
    }
    this.createdSessionIds = [];
  }
}
