export interface Store {
  id: string;
  name: string;
  url: string;
  category: string;
  active: boolean;
}

export interface CreateStoreDto {
  name: string;
  url: string;
  category: string;
  active?: boolean;
}

export interface UpdateStoreDto {
  name?: string;
  url?: string;
  category?: string;
  active?: boolean;
}
