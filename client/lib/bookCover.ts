/** Cover palettes and spine shapes, transcribed from the design handoff. */

export interface CoverPalette {
  bg: string;
  fg: string;
  accent: string;
}

export const COVERS: CoverPalette[] = [
  { bg: '#3a4a40', fg: '#eee7d8', accent: '#c9a227' },
  { bg: '#b9552f', fg: '#fdf3e7', accent: '#f0d9a8' },
  { bg: '#e9ddc5', fg: '#43392c', accent: '#b9552f' },
  { bg: '#2f2b28', fg: '#ded4c3', accent: '#8bab84' },
  { bg: '#7c3f2c', fg: '#f2e5d4', accent: '#e3b778' },
  { bg: '#5b7a58', fg: '#f0f2e6', accent: '#e9ddc5' },
  { bg: '#d8c8ae', fg: '#3d3527', accent: '#7c3f2c' },
  { bg: '#37465c', fg: '#e6ecf3', accent: '#d9a15b' },
];

export interface CoverShape {
  barWidth: string;
  barHeight: number;
  barRadius: string;
  justify: 'flex-end' | 'center';
}

/** Measured for a grid cover; the scale prop shrinks them for smaller cards */
export const SHAPES: CoverShape[] = [
  { barWidth: '38px', barHeight: 3, barRadius: '2px', justify: 'flex-end' },
  { barWidth: '100%', barHeight: 8, barRadius: '4px', justify: 'flex-end' },
  { barWidth: '24px', barHeight: 24, barRadius: '50%', justify: 'flex-end' },
  { barWidth: '52px', barHeight: 2, barRadius: '1px', justify: 'center' },
  { barWidth: '16px', barHeight: 16, barRadius: '3px', justify: 'flex-end' },
];

function hash(text: string): number {
  let value = 0;
  for (let index = 0; index < text.length; index += 1) {
    value = (value * 31 + text.charCodeAt(index)) >>> 0;
  }
  return value;
}

export function paletteFor(cover: number): CoverPalette {
  return COVERS[cover] ?? COVERS[0];
}

/** Shape is derived, not stored, so a spine looks the same on every load */
export function shapeFor(title: string, author: string): CoverShape {
  return SHAPES[hash(`${title}|${author}`) % SHAPES.length];
}

/** Short titles set large, long ones stepping down, so a cover is never half empty */
export function titleSizeFor(title: string): number {
  const length = title.trim().length;

  if (length <= 10) return 36;
  if (length <= 18) return 30;
  if (length <= 28) return 25;
  if (length <= 42) return 21;
  return 18;
}

/** The design prints only the author's surname across the spine. */
export function surnameOf(author: string): string {
  const parts = author.trim().split(/\s+/);
  return (parts[parts.length - 1] ?? '').toUpperCase();
}
