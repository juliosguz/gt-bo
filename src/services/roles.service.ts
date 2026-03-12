import { apiFetch } from '../lib/api';
import type { Role, RoleDetail, Permission, CreateRoleDto } from '../types/role';

export function getRoles(): Promise<Role[]> {
  return apiFetch<Role[]>('/roles');
}

export function getRole(role: string): Promise<RoleDetail> {
  return apiFetch<RoleDetail>(`/roles/${role}`);
}

export function createRole(data: CreateRoleDto): Promise<Role> {
  return apiFetch<Role>('/roles', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function deleteRole(role: string): Promise<void> {
  return apiFetch<void>(`/roles/${role}`, {
    method: 'DELETE',
  });
}

export function getPermissions(): Promise<Permission[]> {
  return apiFetch<Permission[]>('/roles/permissions');
}

export function addPermission(role: string, permission: string): Promise<void> {
  return apiFetch<void>(`/roles/${role}/permissions`, {
    method: 'POST',
    body: JSON.stringify({ permission }),
  });
}

export function replacePermissions(role: string, permissions: string[]): Promise<void> {
  return apiFetch<void>(`/roles/${role}/permissions`, {
    method: 'PUT',
    body: JSON.stringify({ permissions }),
  });
}

export function removePermission(role: string, permission: string): Promise<void> {
  return apiFetch<void>(`/roles/${role}/permissions/${permission}`, {
    method: 'DELETE',
  });
}
