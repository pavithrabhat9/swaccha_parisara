import { useEffect, useRef, useState } from 'react';

/** True when the user prefers reduced motion (live-updating). */
export function usePrefersReducedMotion() {
  const query = '(prefers-reduced-motion: reduce)';
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && Boolean(window.matchMedia?.(query).matches)
  );

  useEffect(() => {
    const mq = window.matchMedia?.(query);
    if (!mq) return undefined;
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

/**
 * Animates a number from its previous value to `value` with an ease-out curve.
 * Respects `prefers-reduced-motion`.
 */
export function useCountUp(value, duration = 900) {
  const reduced = usePrefersReducedMotion();
  const target = Number(value) || 0;
  const [display, setDisplay] = useState(() => (reduced ? target : 0));
  const currentRef = useRef(reduced ? target : 0);

  useEffect(() => {
    const from = currentRef.current;
    if (reduced || from === target) {
      const id = requestAnimationFrame(() => {
        currentRef.current = target;
        setDisplay(target);
      });
      return () => cancelAnimationFrame(id);
    }

    let frame;
    let start;
    const tick = (ts) => {
      if (start === undefined) start = ts;
      const t = Math.min(1, (ts - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = Math.round(from + (target - from) * eased);
      currentRef.current = next;
      setDisplay(next);
      if (t < 1) {
        frame = requestAnimationFrame(tick);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, reduced]);

  return display;
}
