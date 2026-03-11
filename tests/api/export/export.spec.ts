/**
 * ============================================================================
 * EXPORT API TESTS
 * ============================================================================
 *
 * PRINCIPLE: Test Content-Type and File Downloads
 * -------------------------------------------------
 * Export endpoints return files (CSV, JSON) instead of JSON API responses.
 * We verify:
 *   1. Correct HTTP status
 *   2. Correct Content-Type header
 *   3. Response body is non-empty and well-formed
 *
 * PRINCIPLE: Test the Happy Path AND the Sad Path
 * -------------------------------------------------
 * - Happy: Export from a valid session → 200 with file content
 * - Sad:   Export from non-existent session → 404 or empty
 */
import { test, expect } from '../fixtures/api-fixture';
import { TestData } from '../helpers/test-data';

test.describe('Export API — /api/sessions/:id/export/*', () => {
  test.describe('CSV Export', () => {
    test('should return a CSV file with correct headers', async ({ apiClient, request }) => {
      // ARRANGE
      const session = await apiClient.createSession();

      // ACT
      const response = await request.get(`/api/sessions/${session.id}/export/csv`);

      // ASSERT
      expect(response.status()).toBe(200);
      const contentType = response.headers()['content-type'];
      expect(contentType).toContain('text/csv');

      const body = await response.text();
      // CSV should at minimum have the header row
      expect(body).toContain('article_id');
      expect(body).toContain('source');
      expect(body).toContain('headline');
    });
  });

  test.describe('JSON Export', () => {
    test('should return a JSON file', async ({ apiClient, request }) => {
      // ARRANGE
      const session = await apiClient.createSession();

      // ACT
      const response = await request.get(`/api/sessions/${session.id}/export/json`);

      // ASSERT
      expect(response.status()).toBe(200);
      const contentType = response.headers()['content-type'];
      expect(contentType).toContain('application/json');

      const body = await response.text();
      // Should be valid JSON (array)
      const parsed = JSON.parse(body);
      expect(Array.isArray(parsed)).toBe(true);
    });
  });

  test.describe('Summary', () => {
    test('should return a text summary for an existing session', async ({ apiClient, request }) => {
      // ARRANGE
      const session = await apiClient.createSession();

      // ACT
      const response = await request.get(`/api/sessions/${session.id}/summary`);

      // ASSERT
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body).toHaveProperty('summary');
      expect(body).toHaveProperty('generatedAt');
      expect(typeof body.summary).toBe('string');
      expect(body.summary).toContain('NEWS INTELLIGENCE BRIEF');
    });

    test('should return 404 for non-existent session summary', async ({ request }) => {
      const response = await request.get(
        `/api/sessions/${TestData.nonExistentId()}/summary`
      );
      expect(response.status()).toBe(404);
    });
  });
});
