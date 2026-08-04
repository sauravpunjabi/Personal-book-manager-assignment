/**
 * Request bodies arrive untyped, so these read a field defensively and hand
 * back something the controller can trust.
 */
export function readString(body: Record<string, unknown>, field: string): string {
  const value = body[field];
  return typeof value === 'string' ? value.trim() : '';
}

export function readStringArray(body: Record<string, unknown>, field: string): string[] {
  const value = body[field];
  return Array.isArray(value) ? value.filter((item) => typeof item === 'string') : [];
}

/** Whole numbers only, never negative. Anything else reads as zero. */
export function readCount(body: Record<string, unknown>, field: string): number {
  const value = body[field];

  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    return 0;
  }

  return Math.floor(value);
}
