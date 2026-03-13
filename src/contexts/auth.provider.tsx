import { useState, useCallback, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import {
  loginWithGoogle as loginWithGoogleService,
  verify2FA as verify2FAService,
  getMe,
  getStoredToken,
  getStoredUser,
  setStoredToken,
  setStoredUser,
  clearAuthStorage,
} from '../services/auth.service';
import { AuthContext } from './auth.context';
import type { User } from '../types/auth';

const INACTIVITY_THRESHOLD_MS = 5 * 60 * 1000;

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [token, setToken] = useState(() => getStoredToken());
  const [isLoading, setIsLoading] = useState(() => !!getStoredToken());
  const hiddenSince = useRef<number | null>(null);

  const refreshCapabilities = useCallback(async () => {
    try {
      const freshUser = await getMe();
      setUser(freshUser);
      setStoredUser(freshUser);
    } catch {
      // 401 handled by apiFetch
    }
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }

    const controller = new AbortController();

    getMe()
      .then((freshUser) => {
        if (!controller.signal.aborted) {
          setUser(freshUser);
          setStoredUser(freshUser);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    function handleVisibilityChange() {
      if (document.hidden) {
        hiddenSince.current = Date.now();
      } else if (hiddenSince.current && token) {
        const elapsed = Date.now() - hiddenSince.current;
        hiddenSince.current = null;
        if (elapsed >= INACTIVITY_THRESHOLD_MS) {
          refreshCapabilities();
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [token, refreshCapabilities]);

  const login = useCallback(async (credential: string) => {
    const response = await loginWithGoogleService(credential);

    if ('requires2FA' in response && response.requires2FA) {
      return { requires2FA: true, tempToken: response.tempToken };
    }

    if ('accessToken' in response) {
      setStoredToken(response.accessToken);
      setStoredUser(response.user);
      setToken(response.accessToken);
      setUser(response.user);
      return { requires2FA: false };
    }

    throw new Error('Unexpected response from server');
  }, []);

  const verify2FA = useCallback(async (tempToken: string, tokenToVerify: string) => {
    const response = await verify2FAService(tempToken, tokenToVerify);

    setStoredToken(response.accessToken);
    setStoredUser(response.user);
    setToken(response.accessToken);
    setUser(response.user);
  }, []);

  const updateUser = useCallback((data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updatedUser = { ...prev, ...data };
      setStoredUser(updatedUser);
      return updatedUser;
    });
  }, []);

  const logout = useCallback(() => {
    clearAuthStorage();
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext value={{
      user,
      token,
      isAuthenticated: !!token,
      isLoading,
      login,
      verify2FA,
      updateUser,
      refreshCapabilities,
      logout,
    }}>
      {children}
    </AuthContext>
  );
}
