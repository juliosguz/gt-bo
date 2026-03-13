export type ResourceCapabilities = {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
};

export type UsersCapabilities = ResourceCapabilities & {
  assignRoles: boolean;
};

export type Capabilities = {
  stores: ResourceCapabilities;
  users: UsersCapabilities;
};

export type User = {
  id: string;
  email: string;
  name: string;
  picture: string;
  roles?: string[];
  capabilities?: Capabilities;
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
