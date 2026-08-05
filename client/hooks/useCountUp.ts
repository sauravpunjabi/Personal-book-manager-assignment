'use client';

import { useEffect, useState } from 'react';

const DURATION_MS = 700;

/** Fast at first and easing out; a linear count looks mechanical */
function easeOut(progress: number): number {
  return 1 - Math.pow(1 - progress, 3);
}

/** Counts up to a target, landing on the real value even if frames never run */
export function useCountUp(target: number, animate: boolean): number {
  const [value, setValue] = useState(target);

  useEffect(() => {
    if (!animate) {
      setValue(target);
      return;
    }

    let frame = 0;
    const start = performance.now();

    function step(now: number) {
      const progress = Math.min((now - start) / DURATION_MS, 1);
      setValue(Math.round(target * easeOut(progress)));

      if (progress < 1) {
        frame = requestAnimationFrame(step);
      }
    }

    frame = requestAnimationFrame(step);

    // rAF is paused in a hidden tab, so this guarantees the number still lands
    const settle = setTimeout(() => setValue(target), DURATION_MS + 100);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(settle);
    };
  }, [target, animate]);

  return value;
}
