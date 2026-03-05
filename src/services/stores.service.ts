import { apiFetch } from '../lib/api';
import type { Store, CreateStoreDto, UpdateStoreDto } from '../types/store';

export function getStores(): Promise<Store[]> {
  return apiFetch<Store[]>('/stores');
}

export function getStore(id: string): Promise<Store> {
  return apiFetch<Store>(`/stores/${id}`);
}

export function createStore(data: CreateStoreDto): Promise<Store> {
  return apiFetch<Store>('/stores', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateStore(id: string, data: UpdateStoreDto): Promise<Store> {
  return apiFetch<Store>(`/stores/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function deleteStore(id: string): Promise<void> {
  return apiFetch<void>(`/stores/${id}`, {
    method: 'DELETE',
  });
}
