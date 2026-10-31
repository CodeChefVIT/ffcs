'use client';

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

const DURATION_MS = 8000;

type ToastOptions = {
  message: string;
  // Shows an Undo button, which runs this and closes the toast.
  onUndo?: () => void;
  color?: 'green' | 'red' | 'yellow';
};

type ToastItem = ToastOptions & { id: number };

const colors = {
  green: 'bg-ffcs-green',
  red: 'bg-ffcs-red',
  yellow: 'bg-ffcs-yellow',
};

const ToastContext = createContext<(options: ToastOptions) => void>(() => {});

export const useToast = () => useContext(ToastContext);

function ToastCard({ toast, onClose }: { toast: ToastItem; onClose: () => void }) {
  const [paused, setPaused] = useState(false);
  const remaining = useRef(DURATION_MS);
  const closeRef = useRef(onClose);

  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    if (paused) return;
    const start = Date.now();
    const timeout = setTimeout(() => closeRef.current(), remaining.current);
    return () => {
      clearTimeout(timeout);
      remaining.current -= Date.now() - start;
    };
  }, [paused]);

  return (
    <div
      role="status"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={`${colors[toast.color ?? 'green']} pointer-events-auto relative flex w-fit max-w-full animate-in slide-in-from-top-8 fade-in duration-300 items-center gap-3 overflow-hidden rounded-2xl border-3 border-black py-2.5 pl-4 pr-3 font-poppins text-sm font-medium text-black shadow-hard sm:text-base`}
    >
      <span className="min-w-0">{toast.message}</span>
      {toast.onUndo && (
        <button
          type="button"
          onClick={() => {
            toast.onUndo?.();
            onClose();
          }}
          className="cursor-pointer rounded-lg border-2 border-black bg-transparent px-3 py-0.5 text-sm font-semibold text-black shadow-hard-sm active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
        >
          Undo
        </button>
      )}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="shrink-0 cursor-pointer px-1 text-2xl leading-none text-black"
      >
        ×
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const show = useCallback((options: ToastOptions) => {
    setToasts(prev => [...prev.slice(-2), { ...options, id: nextId.current++ }]);
  }, []);

  const close = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex flex-col items-center gap-3 px-4">
        {toasts.map(t => (
          <ToastCard key={t.id} toast={t} onClose={() => close(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
