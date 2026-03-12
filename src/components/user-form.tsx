import { useState, type FormEvent } from 'react';
import type { CreateUserDto } from '../types/user';

interface UserFormProps {
  defaultValues?: Partial<CreateUserDto>;
  onSubmit: (data: CreateUserDto) => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

export default function UserForm({ defaultValues, onSubmit, isLoading, isEdit }: UserFormProps) {
  const [firstName, setFirstName] = useState(defaultValues?.firstName ?? '');
  const [lastName, setLastName] = useState(defaultValues?.lastName ?? '');
  const [email, setEmail] = useState(defaultValues?.email ?? '');
  const [picture, setPicture] = useState(defaultValues?.picture ?? '');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const data: CreateUserDto = { firstName, lastName, email };
    if (picture) data.picture = picture;
    onSubmit(data);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
      <fieldset className="fieldset">
        <label className="fieldset-label">First Name</label>
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="e.g. John"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </fieldset>

      <fieldset className="fieldset">
        <label className="fieldset-label">Last Name</label>
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="e.g. Doe"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </fieldset>

      <fieldset className="fieldset">
        <label className="fieldset-label">Email</label>
        <input
          type="email"
          className="input input-bordered w-full"
          placeholder="john@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isEdit}
        />
      </fieldset>

      <fieldset className="fieldset">
        <label className="fieldset-label">Picture URL</label>
        <input
          type="url"
          className="input input-bordered w-full"
          placeholder="https://example.com/photo.jpg"
          value={picture}
          onChange={(e) => setPicture(e.target.value)}
        />
      </fieldset>

      <button type="submit" className="btn btn-primary" disabled={isLoading}>
        {isLoading && <span className="loading loading-spinner loading-sm" />}
        {isEdit ? 'Update User' : 'Create User'}
      </button>
    </form>
  );
}
