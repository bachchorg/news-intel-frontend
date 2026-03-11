/**
 * ============================================================================
 * CUSTOM ASSERTION HELPERS
 * ============================================================================
 *
 * PRINCIPLE: Readable, Expressive Assertions
 * -------------------------------------------
 * Instead of writing raw field-by-field checks in every test, we create
 * domain-specific assertion helpers. This makes tests read like documentation.
 *
 * BAD (hard to scan, easy to forget a field):
 *   expect(body.id).toBeDefined();
 *   expect(body.name).toBeTruthy();
 *   expect(body.state).toBe('Created');
 *   expect(body.keywords).toBeInstanceOf(Array);
 *   ...
 *
 * GOOD (one line, full validation):
 *   Assertions.isValidSession(body);
 *
 * WHEN TO ADD A NEW ASSERTION:
 *   If you find yourself writing the same 3+ expect() calls in multiple
 *   tests, extract them into a helper here.
 */
import { expect } from '@playwright/test';
import type { SessionResponse, ArticleResponse } from './api-client';

export const Assertions = {
  /**
   * Validates that a response body has the full shape of a Session.
   *
   * EXAMPLE:
   *   const session = await response.json();
   *   Assertions.isValidSession(session);
   */
  isValidSession(session: SessionResponse) {
    expect(session.id).toBeTruthy();
    expect(typeof session.id).toBe('string');
    expect(session.name).toBeTruthy();
    expect(session.state).toBeTruthy();
    expect(session.createdAt).toBeTruthy();
    expect(typeof session.pollIntervalSeconds).toBe('number');
    expect(Array.isArray(session.keywords)).toBe(true);
    expect(Array.isArray(session.sources)).toBe(true);
  },

  /**
   * Validates that a session is in the expected state.
   *
   * EXAMPLE:
   *   Assertions.sessionHasState(session, 'Running');
   */
  sessionHasState(session: SessionResponse, expectedState: string) {
    expect(session.state).toBe(expectedState);
  },

  /**
   * Validates that a response body has the full shape of an Article.
   *
   * EXAMPLE:
   *   for (const article of articles) {
   *     Assertions.isValidArticle(article);
   *   }
   */
  isValidArticle(article: ArticleResponse) {
    expect(article.articleId).toBeTruthy();
    expect(article.source).toBeTruthy();
    expect(article.headline).toBeTruthy();
    expect(article.articleUrl).toBeTruthy();
    expect(article.publishedAt).toBeTruthy();
    expect(article.sentiment).toBeTruthy();
    expect(Array.isArray(article.keywordsMatched)).toBe(true);
  },

  /**
   * Validates pagination metadata in an articles response.
   *
   * EXAMPLE:
   *   Assertions.isValidPagination(body, { page: 1, pageSize: 10 });
   */
  isValidPagination(
    body: { total: number; page: number; pageSize: number },
    expected: { page: number; pageSize: number }
  ) {
    expect(body.page).toBe(expected.page);
    expect(body.pageSize).toBe(expected.pageSize);
    expect(typeof body.total).toBe('number');
    expect(body.total).toBeGreaterThanOrEqual(0);
  },

  /**
   * Validates the analytics snapshot shape.
   *
   * EXAMPLE:
   *   const analytics = await api.getAnalytics(sessionId);
   *   Assertions.isValidAnalytics(analytics);
   */
  isValidAnalytics(analytics: {
    keywordFrequencies: unknown[];
    sourceDistribution: unknown[];
    sentimentTrend: unknown[];
    totalArticles: number;
  }) {
    expect(Array.isArray(analytics.keywordFrequencies)).toBe(true);
    expect(Array.isArray(analytics.sourceDistribution)).toBe(true);
    expect(Array.isArray(analytics.sentimentTrend)).toBe(true);
    expect(typeof analytics.totalArticles).toBe('number');
  },

  /**
   * Validates that an error response has the expected status and shape.
   *
   * EXAMPLE:
   *   const response = await request.get('/api/sessions/bad-id');
   *   Assertions.isErrorResponse(response, 404);
   */
  async isErrorResponse(response: { status: () => number }, expectedStatus: number) {
    expect(response.status()).toBe(expectedStatus);
  },
};
