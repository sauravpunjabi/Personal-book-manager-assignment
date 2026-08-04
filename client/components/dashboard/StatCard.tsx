'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

const COUNT_DURATION_MS = 800;

/** Fast at first, easing out at the end — a linear count looks mechanical. */
function easeOut(progress: number): number {
  return 1 - Math.pow(1 - progress, 3);
}

function useCountUp(target: number, animate: boolean): number {
  const [value, setValue] = useState(animate ? 0 : target);

  useEffect(() => {
    if (!animate) {
      setValue(target);
      return;
    }

    let frame = 0;
    const start = performance.now();

    function step(now: number) {
      const progress = Math.min((now - start) / COUNT_DURATION_MS, 1);
      setValue(Math.round(target * easeOut(progress)));

      if (progress < 1) {
        frame = requestAnimationFrame(step);
      }
    }

    frame = requestAnimationFrame(step);

    // rAF is paused in a hidden or throttled tab, which would strand the
    // counter at zero. The number is data, not decoration, so land it on the
    // real value regardless of whether a single frame ever rendered.
    const settle = setTimeout(() => setValue(target), COUNT_DURATION_MS + 100);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(settle);
    };
  }, [target, animate]);

  return value;
}

interface StatCardProps {
  label: string;
  value: number;
  tone?: string;
}

export function StatCard({ label, value, tone = 'text-ink' }: StatCardProps) {
  const reduceMotion = useReducedMotion();
  const displayed = useCountUp(value, !reduceMotion);

  return (
    <div className="rounded-lg border border-line bg-surface p-5">
      <p className={cn('font-display text-3xl font-semibold tabular-nums', tone)}>
        {displayed}
      </p>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </div>
  );
}
