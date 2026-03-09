import { useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import {
  loginWithGoogle as loginWithGoogleService,
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
      logout,
    }}>
      {children}
    </AuthContext>
  );
}
