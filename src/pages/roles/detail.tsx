import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router';
import { useRole, usePermissions, useReplacePermissions } from '../../hooks/use-roles';
import type { Permission } from '../../types/role';

function PermissionsEditor({
  roleName,
  initialPermissions,
  allPermissions,
}: {
  roleName: string;
  initialPermissions: string[];
  allPermissions: Permission[];
}) {
  const replaceMutation = useReplacePermissions();
  const [selected, setSelected] = useState<Set<string>>(() => new Set(initialPermissions));
  const [dirty, setDirty] = useState(false);

  function togglePermission(permission: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(permission)) {
        next.delete(permission);
      } else {
        next.add(permission);
      }
      return next;
    });
    setDirty(true);
  }

  function handleSave() {
    replaceMutation.mutate(
      { role: roleName, permissions: Array.from(selected) },
      { onSuccess: () => setDirty(false) },
    );
  }

  const grouped = useMemo(() => {
    return allPermissions.reduce<Record<string, Permission[]>>((acc, perm) => {
      const parts = perm.permission.split(':');
      const group = parts.length >= 2 ? `${parts[0]}:${parts[1]}` : parts[0];
      if (!acc[group]) acc[group] = [];
      acc[group].push(perm);
      return acc;
    }, {});
  }, [allPermissions]);

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <Link to="/roles" className="link link-ghost text-sm">&larr; Back to Roles</Link>
          <h1 className="text-2xl font-bold mt-1">Role: {roleName}</h1>
        </div>
        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={!dirty || replaceMutation.isPending}
        >
          {replaceMutation.isPending && <span className="loading loading-spinner loading-sm" />}
          Save Permissions
        </button>
      </div>

      {replaceMutation.error && (
        <div className="alert alert-error">{replaceMutation.error.message}</div>
      )}

      {Object.keys(grouped).length === 0 ? (
        <p className="opacity-60">No permissions available in the system.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([group, perms]) => (
            <div key={group}>
              <h3 className="font-semibold text-sm uppercase tracking-wide opacity-70 mb-2">{group}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {perms.sort((a, b) => a.permission.localeCompare(b.permission)).map((perm) => (
                  <label
                    key={perm.permission}
                    className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-base-200"
                    title={perm.description}
                  >
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary checkbox-sm"
                      checked={selected.has(perm.permission)}
                      onChange={() => togglePermission(perm.permission)}
                    />
                    <span className="text-sm font-mono">{perm.permission}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default function RolesDetailPage() {
  const { role } = useParams<{ role: string }>();
  const { data: roleData, isLoading: roleLoading, error: roleError, dataUpdatedAt } = useRole(role!);
  const { data: allPermissions, isLoading: permsLoading } = usePermissions();

  if (roleLoading || permsLoading) {
    return <div className="flex justify-center p-12"><span className="loading loading-spinner loading-lg" /></div>;
  }

  if (roleError) {
    return <div className="alert alert-error">{roleError.message}</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <PermissionsEditor
        key={dataUpdatedAt}
        roleName={role!}
        initialPermissions={roleData?.permissions ?? []}
        allPermissions={allPermissions ?? []}
      />
    </div>
  );
}
