/**
 * The row of spines along the bottom of the auth panel. Purely decorative, so
 * it is hidden from assistive tech — the titles are set dressing, not content.
 */

interface Spine {
  width: number;
  height: number;
  background: string;
  color?: string;
  title?: string;
  titleSize?: number;
  padding?: number;
}

const SPINES: Spine[] = [
  {
    width: 34,
    height: 196,
    background: '#3a4a40',
    color: '#e9e2d4',
    title: 'Piranesi',
    titleSize: 12.5,
    padding: 12,
  },
  { width: 28, height: 168, background: '#b9552f' },
  {
    width: 40,
    height: 214,
    background: '#e8dcc4',
    color: '#4a4034',
    title: 'Braiding Sweetgrass',
    titleSize: 13,
    padding: 14,
  },
  { width: 24, height: 150, background: '#8c6a35' },
  {
    width: 36,
    height: 188,
    background: '#2f2b28',
    color: '#ddd3c2',
    title: 'Ways of Seeing',
    titleSize: 12.5,
    padding: 12,
  },
  { width: 30, height: 176, background: '#5b7a58' },
  { width: 22, height: 140, background: '#d8c8ae' },
  {
    width: 38,
    height: 204,
    background: '#7c3f2c',
    color: '#f0e3d2',
    title: 'Circe',
    titleSize: 12.5,
    padding: 12,
  },
];

export function BookshelfMark() {
  return (
    <div aria-hidden="true" className="flex h-[250px] items-end gap-[9px] pl-0.5">
      {SPINES.map((spine, index) => (
        <div
          key={index}
          className="flex flex-none items-center justify-center rounded-t-[4px] shadow-[var(--cover-shadow)]"
          style={{
            width: spine.width,
            height: spine.height,
            background: spine.background,
            color: spine.color,
            padding: spine.padding ? `${spine.padding}px 0` : undefined,
          }}
        >
          {spine.title && (
            <span
              className="font-display tracking-[0.02em]"
              style={{ writingMode: 'vertical-rl', fontSize: spine.titleSize }}
            >
              {spine.title}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
