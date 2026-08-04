import api from '../axios';
import type {
  Book,
  BookFilters,
  BookStatus,
  CreateBookInput,
  UpdateBookInput,
} from '@/types/book';

const BOOKS_URL = '/api/books';

function toQueryString({ status, tags }: BookFilters): string {
  const params = new URLSearchParams();

  if (status) {
    params.set('status', status);
  }
  if (tags && tags.length > 0) {
    params.set('tags', tags.join(','));
  }

  const query = params.toString();
  return query ? `?${query}` : '';
}

export async function getBooks(filters: BookFilters = {}): Promise<Book[]> {
  const { data } = await api.get<Book[]>(`${BOOKS_URL}${toQueryString(filters)}`);
  return data;
}

export async function getBook(id: string): Promise<Book> {
  const { data } = await api.get<Book>(`${BOOKS_URL}/${id}`);
  return data;
}

export async function createBook(input: CreateBookInput): Promise<Book> {
  const { data } = await api.post<Book>(BOOKS_URL, input);
  return data;
}

export async function updateBook(id: string, input: UpdateBookInput): Promise<Book> {
  const { data } = await api.put<Book>(`${BOOKS_URL}/${id}`, input);
  return data;
}

export async function updateStatus(id: string, status: BookStatus): Promise<Book> {
  const { data } = await api.patch<Book>(`${BOOKS_URL}/${id}/status`, { status });
  return data;
}

export async function deleteBook(id: string): Promise<void> {
  await api.delete(`${BOOKS_URL}/${id}`);
}
