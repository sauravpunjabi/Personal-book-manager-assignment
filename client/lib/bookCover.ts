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
  barHeight: string;
  barRadius: string;
  titleSize: string;
  justify: 'flex-end' | 'center';
}

export const SHAPES: CoverShape[] = [
  {
    barWidth: '34px',
    barHeight: '3px',
    barRadius: '2px',
    titleSize: '19px',
    justify: 'flex-end',
  },
  {
    barWidth: '100%',
    barHeight: '8px',
    barRadius: '4px',
    titleSize: '17px',
    justify: 'flex-end',
  },
  {
    barWidth: '22px',
    barHeight: '22px',
    barRadius: '50%',
    titleSize: '20px',
    justify: 'flex-end',
  },
  {
    barWidth: '46px',
    barHeight: '2px',
    barRadius: '1px',
    titleSize: '22px',
    justify: 'center',
  },
  {
    barWidth: '14px',
    barHeight: '14px',
    barRadius: '3px',
    titleSize: '18px',
    justify: 'flex-end',
  },
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

/**
 * Shape is derived rather than stored — the design only ever lets a reader
 * choose the colour, and deriving keeps a book's spine stable across loads.
 */
export function shapeFor(title: string, author: string): CoverShape {
  return SHAPES[hash(`${title}|${author}`) % SHAPES.length];
}

/** The design prints only the author's surname across the spine. */
export function surnameOf(author: string): string {
  const parts = author.trim().split(/\s+/);
  return (parts[parts.length - 1] ?? '').toUpperCase();
}
