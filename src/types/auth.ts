export interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
  roles?: string[];
  permissions?: string[];
  isTwoFactorEnabled?: boolean;
}

export interface AuthSuccessResponse {
  accessToken: string;
  user: User;
}

export interface Auth2FARequiredResponse {
  requires2FA: boolean;
  tempToken: string;
}

export type AuthResponse = AuthSuccessResponse | Auth2FARequiredResponse;
