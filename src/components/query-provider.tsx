import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider, MutationCache, QueryCache } from '@tanstack/react-query';
import { useAuth } from '../hooks/use-auth';
import { ForbiddenError } from '../lib/api';
import { showToast } from '../lib/toast';

export default function QueryProvider({ children }: { children: ReactNode }) {
  const { refreshCapabilities } = useAuth();

  const queryClient = useMemo(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 30,
        retry: 1,
      },
    },
    queryCache: new QueryCache({
      onError: async (error) => {
        if (error instanceof ForbiddenError) {
          await refreshCapabilities();
          showToast('Your permissions have changed. Some actions may no longer be available.', 'warning');
        }
      },
    }),
    mutationCache: new MutationCache({
      onError: async (error) => {
        if (error instanceof ForbiddenError) {
          await refreshCapabilities();
          showToast('Your permissions have changed. Some actions may no longer be available.', 'warning');
        }
      },
    }),
  }), [refreshCapabilities]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
