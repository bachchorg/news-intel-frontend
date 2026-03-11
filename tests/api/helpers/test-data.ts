/**
 * ============================================================================
 * TEST DATA FACTORY
 * ============================================================================
 *
 * PRINCIPLE: Test Data Independence
 * ----------------------------------
 * Each test should create its own data and never depend on data from another
 * test. This factory provides builder functions that generate unique,
 * isolated test data with sensible defaults.
 *
 * WHY: If tests share data, they become order-dependent and flaky.
 *      A factory ensures every test starts from a clean, predictable state.
 *
 * EXAMPLE:
 *   // Create a session with defaults
 *   const payload = TestData.createSessionPayload();
 *
 *   // Override specific fields
 *   const payload = TestData.createSessionPayload({ name: 'My Custom Name' });
 */

/** Generates a unique suffix to prevent name collisions between parallel tests */
function uniqueId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const TestData = {
  /**
   * Builds a valid CreateSession request body.
   * Override any field by passing partial overrides.
   *
   * EXAMPLE:
   *   TestData.createSessionPayload()
   *   // => { name: "Test Session 1710...", keywords: [...], sources: [...], ... }
   *
   *   TestData.createSessionPayload({ name: "Custom", pollIntervalSeconds: 120 })
   *   // => { name: "Custom", keywords: [...], sources: [...], pollIntervalSeconds: 120 }
   */
  createSessionPayload(overrides: Record<string, unknown> = {}) {
    return {
      name: `Test Session ${uniqueId()}`,
      keywords: [
        { term: 'technology', logic: 'or' },
        { term: 'AI', logic: 'or' },
      ],
      sources: ['rss-bbc', 'rss-reuters'],
      dateRangeFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      dateRangeTo: null,
      pollIntervalSeconds: 60,
      ...overrides,
    };
  },

  /**
   * Builds a valid UpdateSession request body.
   *
   * EXAMPLE:
   *   TestData.updateSessionPayload({ name: "Renamed Session" })
   */
  updateSessionPayload(overrides: Record<string, unknown> = {}) {
    return {
      name: `Updated Session ${uniqueId()}`,
      ...overrides,
    };
  },

  /**
   * Builds a valid keyword entry for the Keywords API.
   *
   * EXAMPLE:
   *   TestData.keywordEntry()             // => { term: "test-keyword-xxx", logic: "or" }
   *   TestData.keywordEntry("bitcoin")    // => { term: "bitcoin", logic: "or" }
   */
  keywordEntry(term?: string, logic: string = 'or') {
    return {
      term: term ?? `test-keyword-${uniqueId()}`,
      logic,
    };
  },

  /**
   * Returns a random valid UUID (v4 format) for testing "not found" scenarios.
   *
   * EXAMPLE:
   *   const fakeId = TestData.nonExistentId();
   *   await request.get(`/api/sessions/${fakeId}`);  // expect 404
   */
  nonExistentId(): string {
    return '00000000-0000-4000-8000-000000000000';
  },

  /**
   * Returns an invalid (non-UUID) string for testing route validation.
   *
   * EXAMPLE:
   *   await request.get(`/api/sessions/${TestData.invalidId()}`);  // expect 400 or 404
   */
  invalidId(): string {
    return 'not-a-valid-uuid';
  },
};
