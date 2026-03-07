// REST calls go through Next.js rewrites (/api/*) to avoid CORS.
// SignalR uses a direct URL since it needs WebSocket (see .env.local).
const isBrowser = typeof window !== 'undefined';
const BASE_URL = isBrowser ? '' : (process.env.BACKEND_URL || 'http://localhost:5155');

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`API Error ${res.status}: ${error}`);
  }
  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return undefined as T;
  }
  return res.json();
}

// For file downloads (export), also use proxied path
export const BASE_API_URL = isBrowser ? '' : (process.env.BACKEND_URL || 'http://localhost:5155');
