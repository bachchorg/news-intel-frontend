/**
 * ============================================================================
 * RATE LIMITS API TESTS
 * ============================================================================
 *
 * PRINCIPLE: Test Informational Endpoints for Shape, Not Values
 * ---------------------------------------------------------------
 * The rate-limits endpoint returns dynamic data that depends on external
 * API calls. We can't predict exact values, but we CAN verify:
 *   1. The endpoint returns 200
 *   2. The response is an array
 *   3. Each item has the expected shape (if any exist)
 *
 * This is called "contract testing" — we test the API contract (shape)
 * rather than exact values.
 */
import { test, expect } from '../fixtures/api-fixture';

test.describe('Rate Limits API — GET /api/sessions/rate-limits', () => {
  test('should return 200 with an array', async ({ request }) => {
    // ACT
    const response = await request.get('/api/sessions/rate-limits');

    // ASSERT
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
  });

  test('should have correct shape when rate limits exist', async ({ request }) => {
    // ACT
    const response = await request.get('/api/sessions/rate-limits');
    const body = await response.json();

    // ASSERT — if any rate limit entries exist, validate their shape
    if (body.length > 0) {
      const entry = body[0];
      expect(entry).toHaveProperty('sourceName');
      expect(entry).toHaveProperty('isExhausted');
      expect(typeof entry.sourceName).toBe('string');
      expect(typeof entry.isExhausted).toBe('boolean');
    }
  });
});
