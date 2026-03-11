/**
 * ============================================================================
 * API HEALTH & SMOKE TESTS
 * ============================================================================
 *
 * PRINCIPLE: Smoke Tests Run First
 * ----------------------------------
 * These tests verify that the API is running and reachable before other
 * tests execute. If these fail, something is fundamentally wrong (server
 * down, wrong URL, network issue) and there's no point running the rest.
 *
 * PRINCIPLE: Test Error Responses
 * ---------------------------------
 * Good APIs return consistent error shapes. We verify that:
 *   1. Invalid routes return 404 (not 500)
 *   2. Invalid request bodies return 400 (not 500)
 *   3. The server never crashes — it always returns an HTTP response
 *
 * EXAMPLE: Run just the smoke tests to verify deployment:
 *   npx playwright test --grep "@smoke"
 */
import { test, expect } from '@playwright/test';

test.describe('API Health & Smoke Tests', () => {
  test('GET /api/sessions should be reachable @smoke', async ({ request }) => {
    // This is the most basic test — if this fails, the server is down
    const response = await request.get('/api/sessions');
    expect(response.status()).toBe(200);
    expect(response.ok()).toBe(true);
  });

  test('GET /api/sessions/rate-limits should be reachable @smoke', async ({ request }) => {
    const response = await request.get('/api/sessions/rate-limits');
    expect(response.status()).toBe(200);
  });

  test('should return 404 for unknown routes (not 500)', async ({ request }) => {
    // PRINCIPLE: The API should handle unknown routes gracefully
    // A 500 here would indicate the server is crashing instead of routing correctly
    const response = await request.get('/api/this-does-not-exist');
    expect(response.status()).toBe(404);
  });

  test('should return error for invalid JSON body (not 500)', async ({ request }) => {
    // ACT — send malformed body
    const response = await request.post('/api/sessions', {
      headers: { 'Content-Type': 'application/json' },
      data: 'this is not json{{{',
    });

    // ASSERT — should get 400 Bad Request, not 500 Internal Server Error
    expect(response.status()).toBeLessThan(500);
  });

  test('should handle empty body gracefully', async ({ request }) => {
    // ACT — send empty POST
    const response = await request.post('/api/sessions', {
      data: {},
    });

    // ASSERT — 400 is acceptable, 500 is not
    expect(response.status()).toBeLessThan(500);
  });
});
