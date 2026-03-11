import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateRoleDto } from '../types/role';
import * as rolesService from '../services/roles.service';

const ROLES_KEY = ['roles'] as const;
const PERMISSIONS_KEY = ['permissions'] as const;

export function useRoles() {
  return useQuery({
    queryKey: ROLES_KEY,
    queryFn: rolesService.getRoles,
  });
}

export function useRole(role: string) {
  return useQuery({
    queryKey: [...ROLES_KEY, role],
    queryFn: () => rolesService.getRole(role),
    enabled: !!role,
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRoleDto) => rolesService.createRole(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ROLES_KEY }),
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (role: string) => rolesService.deleteRole(role),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ROLES_KEY }),
  });
}

export function usePermissions() {
  return useQuery({
    queryKey: PERMISSIONS_KEY,
    queryFn: rolesService.getPermissions,
  });
}

export function useAddPermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ role, permission }: { role: string; permission: string }) =>
      rolesService.addPermission(role, permission),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ROLES_KEY }),
  });
}

export function useReplacePermissions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ role, permissions }: { role: string; permissions: string[] }) =>
      rolesService.replacePermissions(role, permissions),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ROLES_KEY }),
  });
}

export function useRemovePermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ role, permission }: { role: string; permission: string }) =>
      rolesService.removePermission(role, permission),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ROLES_KEY }),
  });
}
