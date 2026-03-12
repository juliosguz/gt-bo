export interface Role {
  role: string;
  isProtected: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RoleDetail extends Role {
  permissions: string[];
}

export interface Permission {
  permission: string;
  description: string;
  createdAt: string;
}

export interface CreateRoleDto {
  role: string;
}
