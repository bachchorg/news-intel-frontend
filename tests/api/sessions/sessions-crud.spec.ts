/**
 * ============================================================================
 * SESSIONS API — CRUD TESTS
 * ============================================================================
 *
 * PRINCIPLE: Arrange-Act-Assert (AAA)
 * ------------------------------------
 * Every test follows three distinct phases:
 *   1. ARRANGE — Set up preconditions (create test data)
 *   2. ACT     — Perform the action under test (call the API)
 *   3. ASSERT  — Verify the outcome (check status, body, side effects)
 *
 * Keeping these phases separate makes tests easy to read and debug.
 *
 * PRINCIPLE: One Assertion Concept Per Test
 * ------------------------------------------
 * Each test verifies ONE behavior. Don't test create + update + delete
 * in a single test. If one step fails, you can't tell which behavior broke.
 *
 * PRINCIPLE: Descriptive Test Names
 * ----------------------------------
 * Test names should read as specifications:
 *   BAD:  "test session"
 *   GOOD: "should return 201 and the created session with all fields"
 */
import { test, expect } from '../fixtures/api-fixture';
import { Assertions } from '../helpers/assertions';
import { TestData } from '../helpers/test-data';

test.describe('Sessions API — CRUD Operations', () => {
  // --------------------------------------------------------------------------
  // CREATE (POST /api/sessions)
  // --------------------------------------------------------------------------
  test.describe('POST /api/sessions', () => {
    test('should return 201 and the created session with all fields', async ({ apiClient }) => {
      // ARRANGE
      const payload = TestData.createSessionPayload({ name: 'My CRUD Test Session' });

      // ACT
      const session = await apiClient.createSession({ name: 'My CRUD Test Session' });

      // ASSERT
      Assertions.isValidSession(session);
      expect(session.name).toBe('My CRUD Test Session');
      expect(session.state).toBe('Idle');
      expect(session.keywords.length).toBeGreaterThanOrEqual(2);
      expect(session.sources.length).toBeGreaterThanOrEqual(1);
    });

    test('should set default poll interval to 60 seconds', async ({ apiClient }) => {
      // ACT
      const session = await apiClient.createSession();

      // ASSERT — verify server applies the default
      expect(session.pollIntervalSeconds).toBe(60);
    });

    test('should accept custom poll interval', async ({ apiClient }) => {
      // ACT
      const session = await apiClient.createSession({ pollIntervalSeconds: 120 });

      // ASSERT
      expect(session.pollIntervalSeconds).toBe(120);
    });

    test('should store keywords correctly', async ({ apiClient }) => {
      // ARRANGE
      const keywords = [
        { term: 'blockchain', logic: 'or' },
        { term: 'bitcoin', logic: 'and' },
        { term: 'scam', logic: 'not' },
      ];

      // ACT
      const session = await apiClient.createSession({ keywords });

      // ASSERT — verify all keyword types are preserved
      expect(session.keywords).toHaveLength(3);
      const terms = session.keywords.map((k) => k.term);
      expect(terms).toContain('blockchain');
      expect(terms).toContain('bitcoin');
      expect(terms).toContain('scam');
    });

    test('should store selected sources', async ({ apiClient }) => {
      // ACT
      const session = await apiClient.createSession({ sources: ['rss-bbc', 'newsapi'] });

      // ASSERT
      const sourceNames = session.sources.map((s) => s.sourceName);
      expect(sourceNames).toContain('rss-bbc');
      expect(sourceNames).toContain('newsapi');
    });
  });

  // --------------------------------------------------------------------------
  // READ (GET /api/sessions, GET /api/sessions/:id)
  // --------------------------------------------------------------------------
  test.describe('GET /api/sessions', () => {
    test('should return an array of sessions', async ({ apiClient }) => {
      // ARRANGE — create at least one session
      await apiClient.createSession();

      // ACT
      const sessions = await apiClient.getAllSessions();

      // ASSERT
      expect(Array.isArray(sessions)).toBe(true);
      expect(sessions.length).toBeGreaterThanOrEqual(1);
      Assertions.isValidSession(sessions[0]);
    });
  });

  test.describe('GET /api/sessions/:id', () => {
    test('should return the session by ID', async ({ apiClient }) => {
      // ARRANGE
      const created = await apiClient.createSession();

      // ACT
      const fetched = await apiClient.getSession(created.id);

      // ASSERT
      expect(fetched.id).toBe(created.id);
      expect(fetched.name).toBe(created.name);
      Assertions.isValidSession(fetched);
    });

    test('should return 404 for non-existent ID', async ({ request }) => {
      // ACT
      const response = await request.get(`/api/sessions/${TestData.nonExistentId()}`);

      // ASSERT
      expect(response.status()).toBe(404);
    });

    test('should return 404 for invalid UUID format', async ({ request }) => {
      // ACT — route constraint {id:guid} rejects non-GUIDs
      const response = await request.get(`/api/sessions/${TestData.invalidId()}`);

      // ASSERT — .NET returns 404 when route constraint fails
      expect([400, 404]).toContain(response.status());
    });
  });

  // --------------------------------------------------------------------------
  // UPDATE (PUT /api/sessions/:id)
  // --------------------------------------------------------------------------
  test.describe('PUT /api/sessions/:id', () => {
    test('should update the session name', async ({ apiClient }) => {
      // ARRANGE
      const session = await apiClient.createSession();

      // ACT
      const updated = await apiClient.updateSession(session.id, { name: 'Renamed Session' });

      // ASSERT
      expect(updated.name).toBe('Renamed Session');
      expect(updated.id).toBe(session.id);
    });

    test('should update date range', async ({ apiClient }) => {
      // ARRANGE
      const session = await apiClient.createSession();
      const newFrom = new Date('2025-01-01').toISOString();

      // ACT
      const updated = await apiClient.updateSession(session.id, { dateRangeFrom: newFrom });

      // ASSERT
      expect(updated.dateRangeFrom).toBeTruthy();
    });

    test('should return 404 when updating non-existent session', async ({ request }) => {
      // ACT
      const response = await request.put(`/api/sessions/${TestData.nonExistentId()}`, {
        data: { name: 'Ghost' },
      });

      // ASSERT
      expect(response.status()).toBe(404);
    });
  });

  // --------------------------------------------------------------------------
  // DELETE (DELETE /api/sessions/:id)
  // --------------------------------------------------------------------------
  test.describe('DELETE /api/sessions/:id', () => {
    test('should delete the session and return 204', async ({ apiClient, request }) => {
      // ARRANGE
      const session = await apiClient.createSession();

      // ACT
      await apiClient.deleteSession(session.id);

      // ASSERT — session is gone
      const response = await request.get(`/api/sessions/${session.id}`);
      expect(response.status()).toBe(404);
    });

    test('should return 404 when deleting non-existent session', async ({ request }) => {
      // ACT
      const response = await request.delete(`/api/sessions/${TestData.nonExistentId()}`);

      // ASSERT
      expect(response.status()).toBe(404);
    });
  });
});
