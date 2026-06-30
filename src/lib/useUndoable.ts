import { useCallback, useRef, useState } from 'react';

const MAX_HISTORY = 50;
const DEBOUNCE_MS = 350;

interface Hist<T> {
  past: T[];
  present: T;
  future: T[];
}

export function useUndoable<T>(initial: T) {
  const [hist, setHist] = useState<Hist<T>>({ past: [], present: initial, future: [] });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // snapshot captures present at the START of a rapid-change burst (e.g. drag)
  const snapshot = useRef<T>(initial);

  const set = useCallback((next: T) => {
    setHist(h => {
      if (!timer.current) snapshot.current = h.present; // first in burst
      return { past: h.past, present: next, future: [] };
    });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      timer.current = null;
      // commit: push pre-burst state to past
      setHist(h => ({
        past: [...h.past.slice(-(MAX_HISTORY - 1)), snapshot.current],
        present: h.present,
        future: [],
      }));
    }, DEBOUNCE_MS);
  }, []);

  // non-undoable replacement (new/open project)
  const replace = useCallback((next: T) => {
    if (timer.current) { clearTimeout(timer.current); timer.current = null; }
    setHist({ past: [], present: next, future: [] });
  }, []);

  const undo = useCallback(() => {
    if (timer.current) { clearTimeout(timer.current); timer.current = null; }
    setHist(h => {
      if (h.past.length === 0) return h;
      const prev = h.past[h.past.length - 1];
      return {
        past: h.past.slice(0, -1),
        present: prev,
        future: [h.present, ...h.future].slice(0, MAX_HISTORY),
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHist(h => {
      if (h.future.length === 0) return h;
      const [next, ...rest] = h.future;
      return {
        past: [...h.past.slice(-(MAX_HISTORY - 1)), h.present],
        present: next,
        future: rest,
      };
    });
  }, []);

  return {
    current: hist.present,
    set,
    replace,
    undo,
    redo,
    canUndo: hist.past.length > 0,
    canRedo: hist.future.length > 0,
  };
}
