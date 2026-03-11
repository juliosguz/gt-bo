import { useState } from 'react';
import { Link } from 'react-router';
import { useRoles, useDeleteRole } from '../../hooks/use-roles';
import ConfirmDialog from '../../components/confirm-dialog';

export default function RolesListPage() {
  const { data: roles, isLoading, error } = useRoles();
  const deleteMutation = useDeleteRole();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function handleDelete() {
    if (!deleteTarget) return;
    setDeleteError(null);
    deleteMutation.mutate(deleteTarget, {
      onSuccess: () => setDeleteTarget(null),
      onError: (err) => {
        setDeleteTarget(null);
        setDeleteError(err.message);
      },
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
        <h1 className="text-2xl font-bold">Roles</h1>
        <Link to="/roles/new" className="btn btn-primary">
          + New Role
        </Link>
      </div>

      {deleteError && (
        <div className="alert alert-error">
          <span>{deleteError}</span>
          <button className="btn btn-ghost btn-sm" onClick={() => setDeleteError(null)}>Dismiss</button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Role</th>
              <th>Permissions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles?.map((r) => (
              <tr key={r.role}>
                <td className="font-medium">
                  <Link to={`/roles/${r.role}`} className="link link-primary">
                    {r.role}
                  </Link>
                </td>
                <td>
                  <span className="badge badge-ghost">{r.permissions?.length ?? 0} permissions</span>
                </td>
                <td className="flex gap-2">
                  <Link to={`/roles/${r.role}`} className="btn btn-sm btn-ghost">
                    Manage
                  </Link>
                  <button
                    className="btn btn-sm btn-ghost text-error"
                    onClick={() => setDeleteTarget(r.role)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {roles?.length === 0 && (
              <tr><td colSpan={3} className="text-center opacity-60">No roles yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Role"
        message={`Are you sure you want to delete the role "${deleteTarget}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
