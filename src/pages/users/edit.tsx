import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useUser, useUpdateUser, useAssignRole, useRemoveRole } from '../../hooks/use-users';
import { useRoles } from '../../hooks/use-roles';
import UserForm from '../../components/user-form';
import type { CreateUserDto } from '../../types/user';

export default function UsersEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: user, isLoading, error } = useUser(id!);
  const { data: roles } = useRoles();
  const mutation = useUpdateUser();
  const assignMutation = useAssignRole();
  const removeMutation = useRemoveRole();
  const [selectedRole, setSelectedRole] = useState('');

  function handleSubmit(data: CreateUserDto) {
    mutation.mutate(
      { id: id!, data: { firstName: data.firstName, lastName: data.lastName, picture: data.picture } },
      { onSuccess: () => navigate('/users') },
    );
  }

  function handleAssignRole() {
    if (!selectedRole) return;
    assignMutation.mutate(
      { id: id!, role: selectedRole },
      { onSuccess: () => setSelectedRole('') },
    );
  }

  function handleRemoveRole(role: string) {
    removeMutation.mutate({ id: id!, role });
  }

  if (isLoading) {
    return <div className="flex justify-center p-12"><span className="loading loading-spinner loading-lg" /></div>;
  }

  if (error) {
    return <div className="alert alert-error">{error.message}</div>;
  }

  const availableRoles = roles?.filter((r) => !user?.roles?.includes(r.role)) ?? [];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold">Edit User</h1>
        {mutation.error && (
          <div className="alert alert-error mt-4">{mutation.error.message}</div>
        )}
        <div className="mt-4">
          <UserForm
            defaultValues={user}
            onSubmit={handleSubmit}
            isLoading={mutation.isPending}
            isEdit
          />
        </div>
      </div>

      <div className="divider" />

      <div className="max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Roles</h2>

        {assignMutation.error && (
          <div className="alert alert-error mb-4">{assignMutation.error.message}</div>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {user?.roles?.length ? (
            user.roles.map((role) => (
              <span key={role} className="badge badge-lg gap-2">
                {role}
                <button
                  className="btn btn-ghost btn-xs"
                  onClick={() => handleRemoveRole(role)}
                  disabled={removeMutation.isPending}
                >
                  x
                </button>
              </span>
            ))
          ) : (
            <p className="opacity-60 text-sm">No roles assigned</p>
          )}
        </div>

        {availableRoles.length > 0 && (
          <div className="flex gap-2">
            <select
              className="select select-bordered flex-1"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="">Select a role...</option>
              {availableRoles.map((r) => (
                <option key={r.role} value={r.role}>{r.role}</option>
              ))}
            </select>
            <button
              className="btn btn-primary"
              onClick={handleAssignRole}
              disabled={!selectedRole || assignMutation.isPending}
            >
              {assignMutation.isPending && <span className="loading loading-spinner loading-sm" />}
              Assign
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
