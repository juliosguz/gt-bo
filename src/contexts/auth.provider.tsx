import { useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import {
  loginWithGoogle as loginWithGoogleService,
  verify2FA as verify2FAService,
  getStoredToken,
  getStoredUser,
  setStoredToken,
  setStoredUser,
  clearAuthStorage,
} from '../services/auth.service';
import { AuthContext } from './auth.context';

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [token, setToken] = useState(() => getStoredToken());

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
      login,
      verify2FA,
      logout,
    }}>
      {children}
    </AuthContext>
  );
}
