import { apiFetch } from '../lib/api';
import type { AuthResponse, AuthSuccessResponse, User } from '../types/auth';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export function loginWithGoogle(credential: string): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/google', {
    method: 'POST',
    body: JSON.stringify({ credential, context: 'backoffice' }),
  });
}

export function verify2FA(tempToken: string, token: string): Promise<AuthSuccessResponse> {
  return apiFetch<AuthSuccessResponse>('/auth/2fa/verify', {
    method: 'POST',
    body: JSON.stringify({ tempToken, token }),
  });
}

export function generate2FA(): Promise<{ uri: string }> {
  return apiFetch<{ uri: string }>('/auth/2fa/generate', {
    method: 'POST',
  });
}

export function enable2FA(token: string): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>('/auth/2fa/enable', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
}

export function disable2FA(token: string): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>('/auth/2fa/disable', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
}

export function getMe(): Promise<User> {
  return apiFetch<User>('/auth/me');
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function getStoredUser(): User | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function setStoredUser(user: User): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function removeStoredUser(): void {
  localStorage.removeItem(USER_KEY);
}

export function clearAuthStorage(): void {
  removeStoredToken();
  removeStoredUser();
}
