/**
 * ============================================================================
 * ARTICLES API — PAGINATION TESTS
 * ============================================================================
 *
 * PRINCIPLE: Test Pagination Thoroughly
 * ---------------------------------------
 * Pagination is a common source of off-by-one bugs and performance issues.
 * We test:
 *   - Default page/pageSize values
 *   - Custom page sizes (10, 20, 30)
 *   - Out-of-range pages (page 999 should return empty, not error)
 *   - Response metadata (total, page, pageSize)
 *
 * PRINCIPLE: Tests Should Be Fast
 * ---------------------------------
 * API tests should complete in seconds, not minutes. We don't wait for
 * the crawler to actually fetch articles — we test the pagination logic
 * with whatever data exists (even if 0 articles).
 */
import { test, expect } from '../fixtures/api-fixture';
import { Assertions } from '../helpers/assertions';

test.describe('Articles API — Pagination', () => {
  test('should return paginated articles with default params', async ({ apiClient }) => {
    // ARRANGE
    const session = await apiClient.createSession();

    // ACT
    const result = await apiClient.getArticles(session.id);

    // ASSERT — verify pagination shape even with 0 articles
    Assertions.isValidPagination(result, { page: 1, pageSize: 50 });
    expect(Array.isArray(result.articles)).toBe(true);
  });

  test('should respect custom pageSize of 10', async ({ apiClient }) => {
    // ARRANGE
    const session = await apiClient.createSession();

    // ACT
    const result = await apiClient.getArticles(session.id, 1, 10);

    // ASSERT
    Assertions.isValidPagination(result, { page: 1, pageSize: 10 });
    expect(result.articles.length).toBeLessThanOrEqual(10);
  });

  test('should respect custom pageSize of 20', async ({ apiClient }) => {
    const session = await apiClient.createSession();
    const result = await apiClient.getArticles(session.id, 1, 20);
    Assertions.isValidPagination(result, { page: 1, pageSize: 20 });
  });

  test('should respect custom pageSize of 30', async ({ apiClient }) => {
    const session = await apiClient.createSession();
    const result = await apiClient.getArticles(session.id, 1, 30);
    Assertions.isValidPagination(result, { page: 1, pageSize: 30 });
  });

  test('should return empty articles for out-of-range page', async ({ apiClient }) => {
    // ARRANGE
    const session = await apiClient.createSession();

    // ACT — request page 999
    const result = await apiClient.getArticles(session.id, 999, 10);

    // ASSERT — should return valid structure with 0 articles, not an error
    expect(result.articles).toHaveLength(0);
    expect(result.page).toBe(999);
  });

  test('should validate article shape when articles exist', async ({ apiClient }) => {
    // ARRANGE
    const session = await apiClient.createSession();

    // ACT
    const result = await apiClient.getArticles(session.id);

    // ASSERT — if there are articles, each should have the correct shape
    if (result.articles.length > 0) {
      for (const article of result.articles) {
        Assertions.isValidArticle(article);
      }
    }
  });
});
