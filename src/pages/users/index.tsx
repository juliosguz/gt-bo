import { useState } from 'react';
import { Link } from 'react-router';
import { useUsers, useDeleteUser } from '../../hooks/use-users';
import { useAuth } from '../../hooks/use-auth';
import ConfirmDialog from '../../components/confirm-dialog';
import UserAvatar from '../../components/user-avatar';

export default function UsersListPage() {
  const { user: currentUser } = useAuth();
  const userCaps = currentUser?.capabilities?.users;
  const { data: users, isLoading, error } = useUsers();
  const deleteMutation = useDeleteUser();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const userToDelete = users?.find((u) => u.id === deleteId);
  const hasActions = userCaps?.update || userCaps?.delete;

  function handleDelete() {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId, {
      onSuccess: () => setDeleteId(null),
    });
  }

  if (isLoading) {
    return <div className="flex justify-center p-12"><span className="loading loading-spinner loading-lg" /></div>;
  }

  if (error) {
    return <div className="alert alert-error">{error.message}</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Users</h1>
        {userCaps?.create && (
          <Link to="/users/new" className="btn btn-primary">
            + New User
          </Link>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Roles</th>
              {hasActions && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <UserAvatar name={`${user.firstName} ${user.lastName}`} picture={user.picture} size="w-8" />
                    <span className="font-medium">{user.firstName} {user.lastName}</span>
                  </div>
                </td>
                <td className="text-sm">{user.email}</td>
                <td>
                  <div className="flex flex-wrap gap-1">
                    {user.roles?.length ? (
                      user.roles.map((role) => (
                        <span key={role} className="badge badge-ghost badge-sm">{role}</span>
                      ))
                    ) : (
                      <span className="opacity-40 text-sm">No roles</span>
                    )}
                  </div>
                </td>
                {hasActions && (
                  <td className="flex gap-2">
                    {userCaps?.update && (
                      <Link to={`/users/${user.id}/edit`} className="btn btn-sm btn-ghost">
                        Edit
                      </Link>
                    )}
                    {userCaps?.delete && (
                      <button
                        className="btn btn-sm btn-ghost text-error"
                        onClick={() => setDeleteId(user.id)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
            {users?.length === 0 && (
              <tr><td colSpan={hasActions ? 4 : 3} className="text-center opacity-60">No users yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {userCaps?.delete && (
        <ConfirmDialog
          open={!!deleteId}
          title="Delete User"
          message={`Are you sure you want to delete "${userToDelete?.firstName} ${userToDelete?.lastName}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
          isLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
