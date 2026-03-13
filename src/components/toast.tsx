import { useState, useEffect, useCallback } from 'react';
import { subscribe } from '../lib/toast';
import type { Toast } from '../lib/toast';

const alertClass: Record<Toast['type'], string> = {
  info: 'alert-info',
  success: 'alert-success',
  warning: 'alert-warning',
  error: 'alert-error',
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Toast) => {
    setToasts((prev) => [...prev, toast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toast.id));
    }, 5000);
  }, []);

  useEffect(() => subscribe(addToast), [addToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="toast toast-end toast-top z-50">
      {toasts.map((t) => (
        <div key={t.id} role="alert" className={`alert ${alertClass[t.type]} shadow-lg`}>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
