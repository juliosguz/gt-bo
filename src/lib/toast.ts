type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

type Listener = (toast: Toast) => void;

let nextId = 0;
const listeners = new Set<Listener>();

export function showToast(message: string, type: ToastType = 'info') {
  const toast: Toast = { id: nextId++, message, type };
  listeners.forEach((fn) => fn(toast));
}

export function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
