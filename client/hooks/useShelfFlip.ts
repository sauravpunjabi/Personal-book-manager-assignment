'use client';

import { useCallback, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(Flip);

const SPINES = '[data-flip-id]';

/**
 * Flip needs the layout measured before React re-renders, so the caller records
 * it in the click handler and this replays the move once the DOM has settled.
 */
export function useShelfFlip(signature: string) {
  const captured = useRef<Flip.FlipState | null>(null);

  const record = useCallback(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const spines = gsap.utils.toArray<HTMLElement>(SPINES);

    // Hover leaves books nudged sideways and lifted. Flip would measure those
    // offsets as real positions, so they are stopped and cleared beforehand.
    gsap.killTweensOf(spines);
    gsap.set(spines, { x: 0, y: 0, z: 0 });

    captured.current = Flip.getState(spines);
  }, []);

  useLayoutEffect(() => {
    if (!captured.current) {
      return;
    }

    Flip.from(captured.current, {
      // Essential: moving shelves means React destroys the old node and builds a
      // new one, so Flip has to re-query the live DOM and match on data-flip-id.
      // Without this it sees a removal and an insertion instead of a move.
      targets: SPINES,
      duration: 0.65,
      ease: 'power2.inOut',
      absolute: true,
      // Only animate what actually moved; untouched books stay perfectly still
      prune: true,
      onEnter: (elements) =>
        gsap.fromTo(
          elements,
          { opacity: 0, scale: 0.92 },
          { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out' }
        ),
      onLeave: (elements) =>
        gsap.to(elements, { opacity: 0, scale: 0.92, duration: 0.28 }),
    });

    captured.current = null;
  }, [signature]);

  return record;
}
