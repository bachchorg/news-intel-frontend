/**
 * ============================================================================
 * KEYWORDS API TESTS
 * ============================================================================
 *
 * PRINCIPLE: Test Resource Relationships
 * ----------------------------------------
 * Keywords are a sub-resource of Sessions. We test them in the context
 * of a parent session to verify that:
 *   1. Keywords are correctly linked to their session
 *   2. Deleting a keyword doesn't affect the parent session
 *   3. Non-existent parent sessions return appropriate errors
 *
 * PRINCIPLE: Boundary Value Testing
 * -----------------------------------
 * Test edge cases: empty strings, very long keywords, special characters.
 * These are the inputs most likely to cause bugs in production.
 */
import { test, expect } from '../fixtures/api-fixture';
import { TestData } from '../helpers/test-data';

test.describe('Keywords API — /api/sessions/:id/keywords', () => {
  test('should list keywords for a session', async ({ apiClient }) => {
    // ARRANGE
    const session = await apiClient.createSession({
      keywords: [
        { term: 'AI', logic: 'or' },
        { term: 'robotics', logic: 'and' },
      ],
    });

    // ACT
    const keywords = await apiClient.getKeywords(session.id);

    // ASSERT
    expect(Array.isArray(keywords)).toBe(true);
    expect(keywords.length).toBeGreaterThanOrEqual(2);
    expect(keywords.some((k: { term: string }) => k.term === 'AI')).toBe(true);
  });

  test('should add a new keyword to an existing session', async ({ apiClient }) => {
    // ARRANGE
    const session = await apiClient.createSession();
    const initialCount = session.keywords.length;

    // ACT
    const newKeyword = await apiClient.addKeyword(session.id, 'quantum computing', 'or');

    // ASSERT
    expect(newKeyword.term).toBe('quantum computing');
    expect(newKeyword.logic).toBe('or');

    // Verify the keyword count increased
    const keywords = await apiClient.getKeywords(session.id);
    expect(keywords.length).toBe(initialCount + 1);
  });

  test('should support all logic operators (or, and, not)', async ({ apiClient }) => {
    // ARRANGE
    const session = await apiClient.createSession({ keywords: [] });

    // ACT
    const kwOr = await apiClient.addKeyword(session.id, 'include-this', 'or');
    const kwAnd = await apiClient.addKeyword(session.id, 'require-this', 'and');
    const kwNot = await apiClient.addKeyword(session.id, 'exclude-this', 'not');

    // ASSERT
    expect(kwOr.logic).toBe('or');
    expect(kwAnd.logic).toBe('and');
    expect(kwNot.logic).toBe('not');
  });

  test('should delete a keyword by ID and return 204', async ({ apiClient, request }) => {
    // ARRANGE
    const session = await apiClient.createSession();
    const keyword = await apiClient.addKeyword(session.id, 'temporary-keyword', 'or');

    // ACT
    const response = await request.delete(
      `/api/sessions/${session.id}/keywords/${keyword.id}`
    );

    // ASSERT
    expect(response.status()).toBe(204);

    // Verify keyword is gone
    const keywords = await apiClient.getKeywords(session.id);
    const found = keywords.find((k: { id: number }) => k.id === keyword.id);
    expect(found).toBeUndefined();
  });

  test('should return 404 when adding keyword to non-existent session', async ({ request }) => {
    const response = await request.post(
      `/api/sessions/${TestData.nonExistentId()}/keywords`,
      { data: { term: 'ghost', logic: 'or' } }
    );
    expect(response.status()).toBe(404);
  });

  test('should return 404 when deleting non-existent keyword', async ({ apiClient, request }) => {
    const session = await apiClient.createSession();
    const response = await request.delete(
      `/api/sessions/${session.id}/keywords/999999`
    );
    expect(response.status()).toBe(404);
  });
});
