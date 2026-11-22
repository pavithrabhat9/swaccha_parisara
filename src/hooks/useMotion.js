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
 * Animates a number from 0 to `value` once per component mount (visit) with an ease-out curve.
 * Subsequent re-renders with the same value or updated value snap or transition without re-running from 0.
 * Never animates when `prefers-reduced-motion` is on.
 */
export function useCountUp(value, duration = 900) {
  const reduced = usePrefersReducedMotion();
  const target = Number(value) || 0;
  const [display, setDisplay] = useState(() => (reduced ? target : 0));
  const hasAnimatedRef = useRef(false);
  const currentRef = useRef(reduced ? target : 0);

  useEffect(() => {
    if (reduced || target === 0 || hasAnimatedRef.current) {
      const id = requestAnimationFrame(() => {
        currentRef.current = target;
        hasAnimatedRef.current = true;
        setDisplay(target);
      });
      return () => cancelAnimationFrame(id);
    }

    hasAnimatedRef.current = true;
    const from = 0;
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
