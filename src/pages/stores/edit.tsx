import { useParams, useNavigate } from 'react-router';
import { useStore, useUpdateStore } from '../../hooks/use-stores';
import StoreForm from '../../components/store-form';
import type { CreateStoreDto } from '../../types/store';

export default function StoresEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: store, isLoading, error } = useStore(id!);
  const mutation = useUpdateStore();

  function handleSubmit(data: CreateStoreDto) {
    mutation.mutate(
      { id: id!, data },
      { onSuccess: () => navigate('/stores') },
    );
  }

  if (isLoading) {
    return <div className="flex justify-center p-12"><span className="loading loading-spinner loading-lg" /></div>;
  }

  if (error) {
    return <div className="alert alert-error">{error.message}</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Edit Store</h1>
      {mutation.error && (
        <div className="alert alert-error">{mutation.error.message}</div>
      )}
      <StoreForm
        defaultValues={store}
        onSubmit={handleSubmit}
        isLoading={mutation.isPending}
      />
    </div>
  );
}
