/**
 * ============================================================================
 * CUSTOM PLAYWRIGHT FIXTURE
 * ============================================================================
 *
 * PRINCIPLE: Fixture-Based Setup & Teardown
 * ------------------------------------------
 * Playwright fixtures provide automatic lifecycle management. Instead of
 * repeating setup/teardown logic in every test file, we define it once
 * here. Every test that uses `apiClient` gets:
 *   1. A fresh ApiClient instance (setup)
 *   2. Automatic cleanup of created resources (teardown)
 *
 * This is analogous to JUnit's @BeforeEach / @AfterEach but more powerful
 * because fixtures compose — you can build fixtures on top of other fixtures.
 *
 * EXAMPLE:
 *   // In your test file, import `test` from this fixture instead of @playwright/test
 *   import { test, expect } from '../fixtures/api-fixture';
 *
 *   test('my test', async ({ apiClient }) => {
 *     // apiClient is ready to use, cleanup happens automatically
 *     const session = await apiClient.createSession();
 *     expect(session.name).toContain('Test Session');
 *   });
 *
 * WHY NOT just `import { test } from '@playwright/test'`?
 *   Because then you'd need to manually create ApiClient and call cleanup()
 *   in every single test file. Fixtures eliminate that boilerplate.
 */
import { test as base, expect } from '@playwright/test';
import { ApiClient } from '../helpers/api-client';

/**
 * Declare the custom fixture types.
 * This gives you full TypeScript autocomplete in your tests.
 */
type ApiFixtures = {
  /** Pre-configured API client with automatic cleanup */
  apiClient: ApiClient;
};

/**
 * Extend Playwright's base test with our custom fixtures.
 */
export const test = base.extend<ApiFixtures>({
  apiClient: async ({ request }, use) => {
    // SETUP: Create a fresh ApiClient before each test
    const client = new ApiClient(request);

    // Hand the client to the test
    await use(client);

    // TEARDOWN: Clean up all resources created during the test
    await client.cleanup();
  },
});

// Re-export expect so tests only need one import
export { expect };
