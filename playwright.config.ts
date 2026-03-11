/**
 * ============================================================================
 * PLAYWRIGHT API TEST CONFIGURATION
 * ============================================================================
 *
 * PRINCIPLE: Single Source of Truth
 * ---------------------------------
 * All test configuration lives here. Tests never hardcode URLs, timeouts,
 * or retry logic. This ensures consistency and easy environment switching.
 *
 * USAGE:
 *   npm run test:api              # Run all API tests against local backend
 *   npm run test:api -- --grep "sessions"  # Run only session tests
 *   BASE_URL=https://prod.example.com npm run test:api  # Run against production
 */
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Only look for tests in the tests/api directory
  testDir: './tests/api',

  // Run tests in parallel for speed — each test file runs in its own worker
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry failed tests once on CI to handle flaky network issues
  retries: process.env.CI ? 1 : 0,

  // Limit parallel workers on CI to avoid resource contention
  workers: process.env.CI ? 2 : undefined,

  // Use the list reporter for local dev (clear output), HTML on CI for artifacts
  reporter: process.env.CI ? 'html' : 'list',

  // Global timeout per test — API tests should be fast
  timeout: 30_000,

  // Shared settings for all API tests
  use: {
    // Base URL for all API requests — override via BASE_URL env var
    baseURL: process.env.BASE_URL || 'http://localhost:5155',

    // Include extra HTTP headers with every request
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  },

  // Organize tests into projects for different concerns
  projects: [
    {
      name: 'api-tests',
      testDir: './tests/api',
    },
  ],
});
