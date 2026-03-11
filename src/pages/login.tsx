import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../hooks/use-auth';

export default function LoginPage() {
  const { isAuthenticated, login, verify2FA } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const [requires2FA, setRequires2FA] = useState(false);
  const [tempToken, setTempToken] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsVerifying(true);
    
    try {
      await verify2FA(tempToken, twoFactorCode);
      navigate('/', { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid 2FA code. Please try again.';
      setError(message);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card bg-base-100 shadow-xl w-full max-w-sm">
        <div className="card-body items-center text-center gap-6">
          <h1 className="text-2xl font-bold">GT Backoffice</h1>
          <p className="text-base-content/60">Sign in to continue</p>

          {!requires2FA ? (
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                setError(null);
                try {
                  const result = await login(credentialResponse.credential!);
                  if (result?.requires2FA) {
                    setRequires2FA(true);
                    setTempToken(result.tempToken!);
                  } else {
                    navigate('/', { replace: true });
                  }
                } catch (err: unknown) {
                  const message = err instanceof Error ? err.message : 'Authentication failed. Please try again.';
                  setError(message);
                }
              }}
              onError={() => {
                setError('Google Sign-In failed. Please try again.');
              }}
              theme="outline"
              size="large"
              width="300"
            />
          ) : (
            <form onSubmit={handleVerify2FA} className="w-full text-left">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Two-Factor Authentication Code</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter 6-digit code"
                  className="input input-bordered w-full text-center tracking-widest text-lg"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value.replace(/[^0-9]/g, ''))}
                  maxLength={6}
                  required
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-primary w-full mt-6"
                disabled={isVerifying || twoFactorCode.length !== 6}
              >
                {isVerifying ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  'Verify'
                )}
              </button>
              <button 
                type="button" 
                className="btn btn-ghost w-full mt-2"
                onClick={() => {
                  setRequires2FA(false);
                  setTempToken('');
                  setTwoFactorCode('');
                  setError(null);
                }}
              >
                Cancel
              </button>
            </form>
          )}

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
