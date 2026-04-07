'use client';

import { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

export type Toast = {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
};

type ToastContextType = {
  toasts: Toast[];
  showToast: (message: string, type: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const DEFAULT_DURATION = 3000; 

export function ToastProvider({ children }: { readonly children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType, duration?: number) => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { id, message, type, duration }]);
    setTimeout(() => removeToast(id), duration ?? DEFAULT_DURATION);
  }, [removeToast]);

  const contextValue = useMemo(
    () => ({ toasts, showToast, removeToast }),
    [toasts, showToast, removeToast]
  );

  return (
    <ToastContext value={contextValue}>
      {children}
    </ToastContext>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};
