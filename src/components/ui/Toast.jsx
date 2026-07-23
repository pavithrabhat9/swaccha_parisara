import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export function useToast() {
  return useContext(ToastContext);
}

/**
 * Global toast notification system.
 * Wrap your app with <ToastProvider> and call showToast() from anywhere.
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, exiting: false }]);

    // Start exit animation before removal
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
    }, duration - 300);

    // Remove from DOM after animation
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 300);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed top-0 left-0 right-0 z-[9999] flex flex-col items-center gap-2 p-4 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            onClick={() => dismissToast(toast.id)}
            className={`
              pointer-events-auto cursor-pointer max-w-sm w-full px-4 py-3 rounded-xl
              shadow-elevated flex items-center gap-3 text-sm font-medium
              ${toast.exiting ? 'animate-toast-out' : 'animate-toast-in'}
              ${toast.type === 'success' ? 'bg-primary text-white' : ''}
              ${toast.type === 'info' ? 'bg-yellow text-black' : ''}
              ${toast.type === 'error' ? 'bg-orange-red text-white' : ''}
            `}
          >
            <span className="text-base flex-shrink-0">
              {toast.type === 'success' && '✓'}
              {toast.type === 'info' && 'ℹ'}
              {toast.type === 'error' && '!'}
            </span>
            <span className="flex-1">{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
