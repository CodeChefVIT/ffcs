'use client';

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

const DURATION_MS = 5000;

type ToastOptions = {
  message: string;
  // Shows an Undo button, which runs this and closes the toast.
  onUndo?: () => void;
  color?: 'green' | 'red' | 'yellow';
};

type ToastItem = ToastOptions & { id: number };

const colors = {
  green: 'bg-ffcs-popup-green',
  red: 'bg-ffcs-popup-red',
  yellow: 'bg-ffcs-popup-yellow',
};

const ToastContext = createContext<(options: ToastOptions) => void>(() => {});

export const useToast = () => useContext(ToastContext);

function ToastCard({ toast, onClose }: { toast: ToastItem; onClose: () => void }) {
  const [secondsLeft, setSecondsLeft] = useState(Math.ceil(DURATION_MS / 1000));
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
    const tick = setInterval(() => {
      setSecondsLeft(Math.max(1, Math.ceil((remaining.current - (Date.now() - start)) / 1000)));
    }, 200);
    return () => {
      clearTimeout(timeout);
      clearInterval(tick);
      remaining.current -= Date.now() - start;
    };
  }, [paused]);

  return (
    <div
      role="status"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={`${colors[toast.color ?? 'green']} pointer-events-auto relative flex w-full max-w-md animate-in slide-in-from-top-8 fade-in duration-300 items-center gap-3 overflow-hidden rounded-2xl border-3 border-black px-4 py-3 font-poppins text-base font-medium text-black shadow-hard`}
    >
      <span className="flex-1">{toast.message}</span>
      {toast.onUndo && (
        <button
          type="button"
          onClick={() => {
            toast.onUndo?.();
            onClose();
          }}
          className="cursor-pointer rounded-lg border-2 border-black bg-ffcs-yellow px-3 py-0.5 text-sm font-semibold shadow-hard-sm active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
        >
          Undo
        </button>
      )}
      <span className="w-4 text-center text-sm font-semibold tabular-nums">{secondsLeft}</span>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-white/50 text-lg leading-none hover:bg-white/80"
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
