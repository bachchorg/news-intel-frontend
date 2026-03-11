/**
 * ============================================================================
 * SESSIONS API — LIFECYCLE / STATE MACHINE TESTS
 * ============================================================================
 *
 * PRINCIPLE: Test State Transitions Explicitly
 * ----------------------------------------------
 * A crawl session has a lifecycle:
 *   Idle → Running/Backfilling → Paused → Running/Backfilling → Stopped
 *
 * We test both VALID transitions (happy path) and INVALID transitions
 * (e.g., stopping an already-stopped session). This ensures the API
 * enforces business rules correctly.
 *
 * PRINCIPLE: Test Side Effects
 * -----------------------------
 * State changes often trigger side effects (e.g., SignalR notifications).
 * While we can't easily test WebSocket pushes in API tests, we verify
 * that the state is persisted correctly by re-fetching the session.
 */
import { test, expect } from '../fixtures/api-fixture';

test.describe('Sessions API — Lifecycle State Machine', () => {
  test('should start a session (Idle → Running/Backfilling)', async ({ apiClient }) => {
    // ARRANGE
    const session = await apiClient.createSession();
    expect(session.state).toBe('Idle');

    // ACT
    await apiClient.startSession(session.id);

    // ASSERT — re-fetch to verify persisted state
    const updated = await apiClient.getSession(session.id);
    // Server may set state to 'Running' or 'Backfilling' depending on date range
    expect(['Running', 'Backfilling']).toContain(updated.state);
    expect(updated.startedAt).toBeTruthy();
  });

  test('should pause a running session (Running → Paused)', async ({ apiClient }) => {
    // ARRANGE
    const session = await apiClient.createSession();
    await apiClient.startSession(session.id);

    // ACT
    await apiClient.pauseSession(session.id);

    // ASSERT
    const updated = await apiClient.getSession(session.id);
    expect(updated.state).toBe('Paused');
  });

  test('should resume a paused session (Paused → Running/Backfilling)', async ({ apiClient }) => {
    // ARRANGE
    const session = await apiClient.createSession();
    await apiClient.startSession(session.id);
    await apiClient.pauseSession(session.id);

    // ACT
    await apiClient.startSession(session.id);

    // ASSERT
    const updated = await apiClient.getSession(session.id);
    expect(['Running', 'Backfilling']).toContain(updated.state);
  });

  test('should stop a running session (Running → Stopped)', async ({ apiClient }) => {
    // ARRANGE
    const session = await apiClient.createSession();
    await apiClient.startSession(session.id);

    // ACT
    await apiClient.stopSession(session.id);

    // ASSERT
    const updated = await apiClient.getSession(session.id);
    expect(updated.state).toBe('Stopped');
    expect(updated.stoppedAt).toBeTruthy();
  });

  test('should stop a paused session (Paused → Stopped)', async ({ apiClient }) => {
    // ARRANGE
    const session = await apiClient.createSession();
    await apiClient.startSession(session.id);
    await apiClient.pauseSession(session.id);

    // ACT
    await apiClient.stopSession(session.id);

    // ASSERT
    const updated = await apiClient.getSession(session.id);
    expect(updated.state).toBe('Stopped');
  });

  test('should return 404 when starting a non-existent session', async ({ request }) => {
    const response = await request.put('/api/sessions/00000000-0000-4000-8000-000000000000/start');
    expect(response.status()).toBe(404);
  });

  test('should return 404 when pausing a non-existent session', async ({ request }) => {
    const response = await request.put('/api/sessions/00000000-0000-4000-8000-000000000000/pause');
    expect(response.status()).toBe(404);
  });

  test('should return 404 when stopping a non-existent session', async ({ request }) => {
    const response = await request.put('/api/sessions/00000000-0000-4000-8000-000000000000/stop');
    expect(response.status()).toBe(404);
  });
});
