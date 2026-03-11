export interface Role {
  role: string;
  permissions?: string[];
}

export interface CreateRoleDto {
  role: string;
}
