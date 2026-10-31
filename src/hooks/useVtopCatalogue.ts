'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  parseVtopCatalogue,
  requestVtopExtension,
  VTOP_CACHE_KEY,
  VTOP_CHANNEL,
  VtopCatalogue,
  VtopStatus,
} from '@/lib/vtopCatalogue';

export type VtopModal = 'install' | 'login' | 'progress' | 'error' | null;
export default function useVtopCatalogue() {
  const [catalogue, setCatalogue] = useState<VtopCatalogue | null>(null);
  const [busy, setBusy] = useState(false);
  const [modal, setModal] = useState<VtopModal>(null);
  const [error, setError] = useState('');
  const [status, setStatus] = useState<VtopStatus | null>(null);
  const current = useRef<VtopCatalogue | null>(null);
  const connected = useRef(false);
  const selecting = useRef(false);
  const [readySelection, setReadySelection] = useState(0);

  const receive = useCallback((value: unknown) => {
    const next = value == null ? null : parseVtopCatalogue(value);
    if (
      next &&
      next.catalogueId === current.current?.catalogueId &&
      next.capturedAt === current.current?.capturedAt
    )
      return next;
    current.current = next;
    setCatalogue(next);
    try {
      if (next) localStorage.setItem(VTOP_CACHE_KEY, JSON.stringify(next));
      else localStorage.removeItem(VTOP_CACHE_KEY);
    } catch {
      setError('Browser storage is full or unavailable. Courses can still be used in this tab.');
    }
    return next;
  }, []);

  const select = useCallback(async () => {
    if (selecting.current) return false;
    selecting.current = true;
    setBusy(true);
    setError('');
    let foundExtension = false;
    try {
      const result = await requestVtopExtension('GET_STATUS');
      foundExtension = true;
      connected.current = true;
      setStatus(result);
      if (result.running) {
        setModal('progress');
        return false;
      }
      const data = await requestVtopExtension('GET_DATA');
      const next = receive(data.dataset);
      if (!next) {
        setError(result.error || '');
        setModal(result.error ? 'error' : 'login');
        return false;
      }
      setModal(null);
      return true;
    } catch (err) {
      setError(foundExtension && err instanceof Error ? err.message : '');
      setModal(foundExtension ? 'error' : 'install');
      return false;
    } finally {
      selecting.current = false;
      setBusy(false);
    }
  }, [receive]);

  useEffect(() => {
    try {
      const cached = localStorage.getItem(VTOP_CACHE_KEY);
      if (cached) receive(JSON.parse(cached));
    } catch {
      /* Invalid or unavailable browser storage does not prevent bundled planning. */
    }
    const check = async () => {
      if (!connected.current || selecting.current) return;
      try {
        const result = await requestVtopExtension('GET_STATUS');
        setStatus(result);
        if (result.running) return;
        if ((result.capturedAt || null) !== (current.current?.capturedAt || null)) {
          const data = await requestVtopExtension('GET_DATA');
          const next = receive(data.dataset);
          if (next) setReadySelection(value => value + 1);
        }
      } catch {
        /* Keep the local snapshot while the extension is unavailable. */
      }
    };
    const changed = (event: MessageEvent) => {
      if (
        event.source === window &&
        event.origin === location.origin &&
        event.data?.channel === VTOP_CHANNEL &&
        event.data.direction === 'changed'
      )
        void check();
    };
    const timer = setInterval(() => void check(), 3000);
    window.addEventListener('focus', check);
    window.addEventListener('message', changed);
    return () => {
      clearInterval(timer);
      window.removeEventListener('focus', check);
      window.removeEventListener('message', changed);
    };
  }, [receive]);

  useEffect(() => {
    if (modal === 'login' && status?.running) {
      setModal('progress');
      return;
    }
    if (modal !== 'progress' || status?.running) return;
    if (status?.error) {
      setError(status.error);
      setModal('error');
    } else if (catalogue && status?.capturedAt) setModal(null);
  }, [modal, status, catalogue]);

  const clear = async () => {
    setBusy(true);
    setError('');
    try {
      await requestVtopExtension('CLEAR_DATA');
      for (const key of Object.keys(localStorage))
        if (key.startsWith('selectedCourses:vtop:')) localStorage.removeItem(key);
      receive(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete VTOP data.');
      setModal('error');
    } finally {
      setBusy(false);
    }
  };
  return {
    catalogue,
    busy,
    modal,
    status,
    error,
    select,
    clear,
    readySelection,
    closeModal: () => setModal(null),
  };
}
