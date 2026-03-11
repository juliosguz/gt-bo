import { createContext } from 'react';
import type { User } from '../types/auth';

export interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credential: string) => Promise<{ requires2FA?: boolean; tempToken?: string }>;
  verify2FA: (tempToken: string, token: string) => Promise<void>;
  updateUser: (data: Partial<User>) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
