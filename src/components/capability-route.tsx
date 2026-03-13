import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../hooks/use-auth';
import { showToast } from '../lib/toast';
import type { Capabilities } from '../types/auth';

interface CapabilityRouteProps {
  check: (caps: Capabilities) => boolean;
}

export default function CapabilityRoute({ check }: CapabilityRouteProps) {
  const { user } = useAuth();
  const caps = user?.capabilities;

  if (!caps || !check(caps)) {
    showToast('You do not have access to this section.', 'error');
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
