import { useState, useCallback, useEffect } from 'react';
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

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [token, setToken] = useState(() => getStoredToken());
  const [isLoading, setIsLoading] = useState(() => !!getStoredToken());

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    getMe()
      .then((freshUser) => {
        if (cancelled) return;
        setUser(freshUser);
        setStoredUser(freshUser);
      })
      .catch(() => {
        // 401 is handled by apiFetch (clears storage and redirects)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
      logout,
    }}>
      {children}
    </AuthContext>
  );
}
