const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }

  if (res.status === 204) return null as T;

  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return null as T;
  }

  const text = await res.text();
  if (!text) return null as T;
  return JSON.parse(text) as T;
}

