import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../hooks/use-auth';

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card bg-base-100 shadow-xl w-full max-w-sm">
        <div className="card-body items-center text-center gap-6">
          <h1 className="text-2xl font-bold">GT Backoffice</h1>
          <p className="text-base-content/60">Sign in to continue</p>

          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              setError(null);
              try {
                await login(credentialResponse.credential!);
                navigate('/', { replace: true });
              } catch {
                setError('Authentication failed. Please try again.');
              }
            }}
            onError={() => {
              setError('Google Sign-In failed. Please try again.');
            }}
            theme="outline"
            size="large"
            width="300"
          />

          {error && (
            <div role="alert" className="alert alert-error">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
