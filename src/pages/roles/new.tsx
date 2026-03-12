import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { useCreateRole } from '../../hooks/use-roles';

export default function RolesNewPage() {
  const navigate = useNavigate();
  const mutation = useCreateRole();
  const [role, setRole] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    mutation.mutate({ role }, {
      onSuccess: () => navigate('/roles'),
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">New Role</h1>
      {mutation.error && (
        <div className="alert alert-error">{mutation.error.message}</div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
        <fieldset className="fieldset">
          <label className="fieldset-label">Role Name</label>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="e.g. auditor"
            value={role}
            onChange={(e) => setRole(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
            required
            pattern="[a-z0-9-]+"
          />
          <p className="text-xs opacity-60 mt-1">Lowercase letters, numbers and hyphens only</p>
        </fieldset>

        <button type="submit" className="btn btn-primary" disabled={mutation.isPending}>
          {mutation.isPending && <span className="loading loading-spinner loading-sm" />}
          Create Role
        </button>
      </form>
    </div>
  );
}
