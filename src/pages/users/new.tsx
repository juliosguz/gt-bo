import { useNavigate } from 'react-router';
import { useCreateUser } from '../../hooks/use-users';
import UserForm from '../../components/user-form';
import type { CreateUserDto } from '../../types/user';

export default function UsersNewPage() {
  const navigate = useNavigate();
  const mutation = useCreateUser();

  function handleSubmit(data: CreateUserDto) {
    mutation.mutate(data, {
      onSuccess: () => navigate('/users'),
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">New User</h1>
      {mutation.error && (
        <div className="alert alert-error">{mutation.error.message}</div>
      )}
      <UserForm onSubmit={handleSubmit} isLoading={mutation.isPending} />
    </div>
  );
}
