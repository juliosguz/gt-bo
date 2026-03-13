import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateStoreDto, UpdateStoreDto } from '../types/store';
import * as storesService from '../services/stores.service';

const STORES_KEY = ['stores'] as const;

export function useStores(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: STORES_KEY,
    queryFn: storesService.getStores,
    enabled: options?.enabled,
  });
}

export function useStore(id: string) {
  return useQuery({
    queryKey: [...STORES_KEY, id],
    queryFn: () => storesService.getStore(id),
    enabled: !!id,
  });
}

export function useCreateStore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateStoreDto) => storesService.createStore(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: STORES_KEY }),
  });
}

export function useUpdateStore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStoreDto }) =>
      storesService.updateStore(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: STORES_KEY }),
  });
}

export function useDeleteStore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => storesService.deleteStore(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: STORES_KEY }),
  });
}
