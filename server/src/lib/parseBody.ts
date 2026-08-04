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
