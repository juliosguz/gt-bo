import { apiFetch } from '../lib/api';
import type { UserDetail, CreateUserDto, UpdateUserDto } from '../types/user';

export function getUsers(): Promise<UserDetail[]> {
  return apiFetch<UserDetail[]>('/users');
}

export function getUser(id: string): Promise<UserDetail> {
  return apiFetch<UserDetail>(`/users/${id}`);
}

export function createUser(data: CreateUserDto): Promise<UserDetail> {
  return apiFetch<UserDetail>('/users', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateUser(id: string, data: UpdateUserDto): Promise<UserDetail> {
  return apiFetch<UserDetail>(`/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function deleteUser(id: string): Promise<void> {
  return apiFetch<void>(`/users/${id}`, {
    method: 'DELETE',
  });
}

export function assignRole(id: string, role: string): Promise<void> {
  return apiFetch<void>(`/users/${id}/roles`, {
    method: 'POST',
    body: JSON.stringify({ role }),
  });
}

export function removeRole(id: string, role: string): Promise<void> {
  return apiFetch<void>(`/users/${id}/roles/${role}`, {
    method: 'DELETE',
  });
}
