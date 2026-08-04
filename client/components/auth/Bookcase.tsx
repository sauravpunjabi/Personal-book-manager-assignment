'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface Spine {
  /** Relative thickness. Spines flex, so a shelf always fills its full width. */
  weight: number;
  height: number;
  background: string;
  color?: string;
  title?: string;
  titleSize?: number;
}

const book = (weight: number, height: number, background: string): Spine => ({
  weight,
  height,
  background,
});

const titled = (
  weight: number,
  height: number,
  background: string,
  color: string,
  title: string,
  titleSize = 12
): Spine => ({ weight, height, background, color, title, titleSize });

/** A gap on the shelf — the row of books is never quite complete. */
const gap = (weight: number): Spine => ({ weight, height: 0, background: '' });

const SHELVES: Spine[][] = [
  [
    book(9, 128, '#37465c'),
    titled(12, 156, '#e9ddc5', '#43392c', 'The Overstory', 11.5),
    book(7, 112, '#8c6a35'),
    book(10, 142, '#3a4a40'),
    book(8, 120, '#d8c8ae'),
    gap(7),
    book(9, 134, '#b9552f'),
    book(6, 104, '#c9a227'),
    book(11, 150, '#2f2b28'),
    book(7, 116, '#5b7a58'),
    gap(5),
    book(10, 138, '#7c3f2c'),
    book(8, 124, '#e8dcc4'),
    book(6, 108, '#37465c'),
    book(9, 146, '#8c6a35'),
    book(7, 118, '#d8c8ae'),
  ],
  [
    book(8, 126, '#5b7a58'),
    gap(6),
    titled(13, 168, '#2f2b28', '#ded4c3', 'Four Thousand Weeks', 11),
    book(6, 108, '#c9a227'),
    book(10, 148, '#7c3f2c'),
    book(7, 114, '#e8dcc4'),
    book(9, 138, '#3a4a40'),
    gap(5),
    book(8, 130, '#b9552f'),
    book(11, 158, '#37465c'),
    book(6, 106, '#d8c8ae'),
    book(9, 142, '#8c6a35'),
    book(7, 120, '#e9ddc5'),
    book(10, 152, '#5b7a58'),
    book(6, 110, '#2f2b28'),
  ],
  [
    titled(10, 190, '#3a4a40', '#e9e2d4', 'Piranesi', 12),
    book(8, 164, '#b9552f'),
    titled(12, 208, '#e8dcc4', '#4a4034', 'Braiding Sweetgrass', 12.5),
    book(7, 148, '#8c6a35'),
    titled(11, 182, '#2f2b28', '#ddd3c2', 'Ways of Seeing', 12),
    book(9, 172, '#5b7a58'),
    book(6, 140, '#d8c8ae'),
    titled(11, 198, '#7c3f2c', '#f0e3d2', 'Circe', 12),
    gap(6),
    book(8, 158, '#37465c'),
    book(7, 146, '#c9a227'),
    book(10, 176, '#3a4a40'),
    book(6, 138, '#e9ddc5'),
    book(9, 168, '#b9552f'),
  ],
];

const LIFT_PX = -14;

export function Bookcase() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const context = gsap.context(() => {
      // matchMedia keeps it opt-in: reduced motion means no entrance and no hover
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('[data-spine]', {
          yPercent: 110,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: { each: 0.02, from: 'start' },
        });
      });
    }, root);

    return () => context.revert();
  }, []);

  function lift(element: HTMLElement, isEntering: boolean) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const glow = element.querySelector('[data-glow]');

    gsap.to(element, {
      y: isEntering ? LIFT_PX : 0,
      duration: isEntering ? 0.45 : 0.6,
      ease: isEntering ? 'power3.out' : 'elastic.out(1, 0.6)',
    });

    if (glow) {
      gsap.to(glow, {
        opacity: isEntering ? 0.55 : 0,
        scale: isEntering ? 1 : 0.85,
        duration: 0.45,
        ease: 'power2.out',
      });
    }
  }

  return (
    <div ref={root} aria-hidden="true" className="flex flex-col gap-6">
      {SHELVES.map((shelf, shelfIndex) => (
        <div key={shelfIndex}>
          <div className="flex w-full items-end gap-[7px]">
            {shelf.map((spine, spineIndex) =>
              spine.height === 0 ? (
                <span key={spineIndex} style={{ flex: `${spine.weight} 1 0%` }} />
              ) : (
                <div
                  key={spineIndex}
                  data-spine
                  onMouseEnter={(event) => lift(event.currentTarget, true)}
                  onMouseLeave={(event) => lift(event.currentTarget, false)}
                  className="relative flex items-center justify-center will-change-transform"
                  style={{ flex: `${spine.weight} 1 0%`, height: spine.height }}
                >
                  {/* A blurred wash of the spine's colour, so it reads as light not decoration */}
                  <span
                    data-glow
                    className="pointer-events-none absolute -inset-4 scale-90 rounded-full opacity-0 blur-2xl"
                    style={{ background: spine.background }}
                  />
                  <span
                    className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-t-[4px] shadow-[var(--cover-shadow)]"
                    style={{
                      background: spine.background,
                      color: spine.color,
                      padding: spine.title ? '12px 0' : undefined,
                    }}
                  >
                    {spine.title && (
                      <span
                        className="font-display tracking-[0.02em] whitespace-nowrap"
                        style={{
                          writingMode: 'vertical-rl',
                          fontSize: spine.titleSize,
                        }}
                      >
                        {spine.title}
                      </span>
                    )}
                  </span>
                </div>
              )
            )}
          </div>

          {/* The shelf board the books stand on. */}
          <div className="h-[3px] w-full rounded-full bg-[color-mix(in_oklab,var(--color-ink)_14%,transparent)]" />
        </div>
      ))}
    </div>
  );
}
