export type User = {
  id: string;
  email: string;
  name: string;
  picture: string;
  roles?: string[];
  permissions?: string[];
  isTwoFactorEnabled?: boolean;
};

export type AuthSuccessResponse = {
  accessToken: string;
  user: User;
};

export type Auth2FARequiredResponse ={
  requires2FA: boolean;
  tempToken: string;
};

export type AuthResponse = AuthSuccessResponse | Auth2FARequiredResponse;
