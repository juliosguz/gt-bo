import { useNavigate } from 'react-router';
import { useCreateStore } from '../../hooks/use-stores';
import StoreForm from '../../components/store-form';
import type { CreateStoreDto } from '../../types/store';

export default function StoresNewPage() {
  const navigate = useNavigate();
  const mutation = useCreateStore();

  function handleSubmit(data: CreateStoreDto) {
    mutation.mutate(data, {
      onSuccess: () => navigate('/stores'),
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">New Store</h1>
      {mutation.error && (
        <div className="alert alert-error">{mutation.error.message}</div>
      )}
      <StoreForm onSubmit={handleSubmit} isLoading={mutation.isPending} />
    </div>
  );
}
