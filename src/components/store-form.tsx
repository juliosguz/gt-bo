import { useState, type FormEvent } from 'react';
import type { CreateStoreDto } from '../types/store';

interface StoreFormProps {
  defaultValues?: Partial<CreateStoreDto>;
  onSubmit: (data: CreateStoreDto) => void;
  isLoading?: boolean;
}

export default function StoreForm({ defaultValues, onSubmit, isLoading }: StoreFormProps) {
  const [name, setName] = useState(defaultValues?.name ?? '');
  const [url, setUrl] = useState(defaultValues?.url ?? '');
  const [category, setCategory] = useState(defaultValues?.category ?? '');
  const [active, setActive] = useState(defaultValues?.active ?? true);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit({ name, url, category, active });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
      <fieldset className="fieldset">
        <label className="fieldset-label">Name</label>
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="e.g. Ripley"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </fieldset>

      <fieldset className="fieldset">
        <label className="fieldset-label">URL</label>
        <input
          type="url"
          className="input input-bordered w-full"
          placeholder="https://www.example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
      </fieldset>

      <fieldset className="fieldset">
        <label className="fieldset-label">Category</label>
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="e.g. department-store"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
      </fieldset>

      <fieldset className="fieldset">
        <label className="fieldset-label cursor-pointer justify-start gap-3">
          <input
            type="checkbox"
            className="toggle toggle-primary"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
          />
          Active
        </label>
      </fieldset>

      <button type="submit" className="btn btn-primary" disabled={isLoading}>
        {isLoading && <span className="loading loading-spinner loading-sm" />}
        {defaultValues ? 'Update Store' : 'Create Store'}
      </button>
    </form>
  );
}
