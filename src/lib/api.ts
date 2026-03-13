import { getStoredToken, clearAuthStorage } from '../services/auth.service';

export class ForbiddenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ForbiddenError';
  }
}

const BASE_URL = '/api';

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    clearAuthStorage();
    if (window.location.pathname !== '/login' && window.location.pathname !== '/login/') {
      window.location.href = '/login';
      throw new Error('Session expired');
    }
  }

  if (response.status === 403) {
    const body = await response.json().catch(() => ({}));
    throw new ForbiddenError(body.message ?? 'You do not have permission to perform this action');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message ?? `Request failed with status ${response.status}`);
  }

  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return undefined as T;
  }

  return response.json();
}
