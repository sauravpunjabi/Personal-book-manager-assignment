const SEARCH_URL = 'https://openlibrary.org/search.json';
const COVER_URL = 'https://covers.openlibrary.org/b/id';
const LOOKUP_TIMEOUT_MS = 5000;
// Medium is ~180px wide. Large is a third heavier and noticeably slower to
// fetch, for artwork that is never shown above about 80px.
const COVER_SIZE = 'M';

function readCoverId(payload: unknown): number | null {
  if (typeof payload !== 'object' || payload === null || !('docs' in payload)) {
    return null;
  }

  const { docs } = payload;
  if (!Array.isArray(docs) || docs.length === 0) {
    return null;
  }

  const first: unknown = docs[0];
  if (typeof first !== 'object' || first === null || !('cover_i' in first)) {
    return null;
  }

  return typeof first.cover_i === 'number' ? first.cover_i : null;
}

/**
 * Looks up a cover on Open Library. The service is free but genuinely
 * unreliable — it times out and serves HTML 503 pages under load — so every
 * failure path returns an empty string. A missing cover is a cosmetic loss and
 * must never stop someone saving a book.
 */
export async function findCoverUrl(title: string, author: string): Promise<string> {
  const query = new URLSearchParams({ title, author, limit: '1', fields: 'cover_i' });

  try {
    const response = await fetch(`${SEARCH_URL}?${query}`, {
      signal: AbortSignal.timeout(LOOKUP_TIMEOUT_MS),
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      return '';
    }

    const coverId = readCoverId(await response.json());

    // default=false makes a missing cover 404 instead of returning a blank
    // placeholder image, which lets the client fall back cleanly.
    return coverId === null
      ? ''
      : `${COVER_URL}/${coverId}-${COVER_SIZE}.jpg?default=false`;
  } catch {
    return '';
  }
}
