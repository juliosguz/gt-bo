import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../hooks/use-auth';
import { generate2FA, enable2FA, disable2FA } from '../services/auth.service';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  
  const [qrUri, setQrUri] = useState<string | null>(null);
  const [tokenCode, setTokenCode] = useState('');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnabling, setIsEnabling] = useState(false);
  const [isDisabling, setIsDisabling] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const is2FAEnabled = user?.isTwoFactorEnabled || false;

  const handleGenerate = async () => {
    setError(null);
    setSuccess(null);
    setIsGenerating(true);
    try {
      const response = await generate2FA();
      setQrUri(response.uri);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to generate 2FA secret.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEnable = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsEnabling(true);
    try {
      await enable2FA(tokenCode);
      updateUser({ isTwoFactorEnabled: true });
      setQrUri(null);
      setTokenCode('');
      setSuccess('Two-Factor Authentication has been successfully enabled.');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid 2FA code. Please try again.');
    } finally {
      setIsEnabling(false);
    }
  };

  const handleDisable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!window.confirm('Are you sure you want to disable 2FA? This will make your account less secure.')) {
      return;
    }
    
    setError(null);
    setSuccess(null);
    setIsDisabling(true);
    try {
      await disable2FA(tokenCode);
      updateUser({ isTwoFactorEnabled: false });
      setTokenCode('');
      setSuccess('Two-Factor Authentication has been successfully disabled.');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid 2FA code. Please try again.');
    } finally {
      setIsDisabling(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Profile Settings</h1>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-xl mb-4">Security: Two-Factor Authentication (2FA)</h2>
          
          {error && (
            <div role="alert" className="alert alert-error mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div role="alert" className="alert alert-success mb-4 text-success-content">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{success}</span>
            </div>
          )}

          <div className="flex items-center gap-4 mb-4">
            <div className={`badge ${is2FAEnabled ? 'badge-success' : 'badge-error'} gap-2 p-3 font-medium`}>
              {is2FAEnabled ? 'Enabled' : 'Disabled'}
            </div>
            <p className="text-sm text-base-content/70">
              {is2FAEnabled 
                ? 'Your account is protected by Two-Factor Authentication.'
                : 'Protect your account by enabling Two-Factor Authentication.'}
            </p>
          </div>

          {!is2FAEnabled && !qrUri && (
            <button 
              className="btn btn-primary" 
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? <span className="loading loading-spinner"></span> : 'Set Up 2FA'}
            </button>
          )}

          {qrUri && !is2FAEnabled && (
            <div className="border border-base-300 rounded-lg p-6 bg-base-200/50 mt-4 space-y-6">
              <div className="steps-vertical lg:steps-horizontal steps w-full mb-4">
                <div className="step step-primary">Get App</div>
                <div className="step step-primary">Scan QR</div>
                <div className="step step-primary">Verify</div>
              </div>

              <div>
                <h3 className="font-bold mb-2">1. Scan the QR code</h3>
                <p className="text-sm text-base-content/70 mb-4">
                  Open your authenticator app (like Google Authenticator, Authy, etc.) and scan the QR code below.
                </p>
                <div className="bg-white p-4 inline-block rounded-lg shadow-sm">
                  <QRCodeSVG value={qrUri} size={200} />
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-2">2. Verify the code</h3>
                <p className="text-sm text-base-content/70 mb-4">
                  Enter the 6-digit code generated by your authenticator app to confirm the setup.
                </p>
                <form onSubmit={handleEnable} className="flex gap-4 items-start max-w-sm">
                  <div className="form-control flex-1">
                    <input
                      type="text"
                      placeholder="000000"
                      className="input input-bordered text-center tracking-widest"
                      value={tokenCode}
                      onChange={(e) => setTokenCode(e.target.value.replace(/[^0-9]/g, ''))}
                      maxLength={6}
                      required
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isEnabling || tokenCode.length !== 6}
                  >
                    {isEnabling ? <span className="loading loading-spinner"></span> : 'Verify & Enable'}
                  </button>
                </form>
              </div>
              <button 
                className="btn btn-ghost btn-sm"
                onClick={() => { setQrUri(null); setTokenCode(''); setError(null); }}
              >
                Cancel Setup
              </button>
            </div>
          )}

          {is2FAEnabled && (
            <div className="border border-base-300 rounded-lg p-6 bg-base-200/50 mt-4">
              <h3 className="font-bold text-error mb-2">Disable 2FA</h3>
              <p className="text-sm text-base-content/70 mb-4">
                To disable Two-Factor Authentication, please enter a code from your authenticator app.
              </p>
              <form onSubmit={handleDisable} className="flex gap-4 items-start max-w-sm">
                <div className="form-control flex-1">
                  <input
                    type="text"
                    placeholder="000000"
                    className="input input-bordered text-center tracking-widest"
                    value={tokenCode}
                    onChange={(e) => setTokenCode(e.target.value.replace(/[^0-9]/g, ''))}
                    maxLength={6}
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn btn-error"
                  disabled={isDisabling || tokenCode.length !== 6}
                >
                  {isDisabling ? <span className="loading loading-spinner"></span> : 'Disable'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
