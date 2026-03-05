import { useState } from 'react';
import { Link } from 'react-router';
import { useStores, useDeleteStore } from '../../hooks/use-stores';
import ConfirmDialog from '../../components/confirm-dialog';

export default function StoresListPage() {
  const { data: stores, isLoading, error } = useStores();
  const deleteMutation = useDeleteStore();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const storeToDelete = stores?.find((s) => s.id === deleteId);

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
        <h1 className="text-2xl font-bold">Stores</h1>
        <Link to="/stores/new" className="btn btn-primary">
          + New Store
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>URL</th>
              <th>Category</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stores?.map((store) => (
              <tr key={store.id}>
                <td className="font-medium">{store.name}</td>
                <td>
                  <a href={store.url} target="_blank" rel="noreferrer" className="link link-primary text-sm">
                    {store.url}
                  </a>
                </td>
                <td><span className="badge badge-ghost">{store.category}</span></td>
                <td>
                  <span className={`badge ${store.active ? 'badge-success' : 'badge-error'}`}>
                    {store.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="flex gap-2">
                  <Link to={`/stores/${store.id}/edit`} className="btn btn-sm btn-ghost">
                    Edit
                  </Link>
                  <button
                    className="btn btn-sm btn-ghost text-error"
                    onClick={() => setDeleteId(store.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {stores?.length === 0 && (
              <tr><td colSpan={5} className="text-center opacity-60">No stores yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Store"
        message={`Are you sure you want to delete "${storeToDelete?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
