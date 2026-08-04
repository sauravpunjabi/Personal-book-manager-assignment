/** Number of cover palettes in the design. Keep in step with the client list. */
export const COVER_COUNT = 8;

export function isCoverIndex(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= 0 &&
    value < COVER_COUNT
  );
}

/** Picks a palette from the title so the same book always gets the same colour */
export function pickCover(title: string): number {
  let hash = 0;
  for (let index = 0; index < title.length; index += 1) {
    hash = (hash * 31 + title.charCodeAt(index)) >>> 0;
  }
  return hash % COVER_COUNT;
}
