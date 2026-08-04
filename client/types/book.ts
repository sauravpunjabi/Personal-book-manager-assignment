export const BOOK_STATUSES = ['want-to-read', 'reading', 'completed'] as const;

export type BookStatus = (typeof BOOK_STATUSES)[number];

export interface Book {
  _id: string;
  title: string;
  author: string;
  tags: string[];
  status: BookStatus;
  /** Index into the drawn cover palette. */
  cover: number;
  /** Zero means unknown, which hides the progress bar rather than showing 0%. */
  pages: number;
  currentPage: number;
  note: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookInput {
  title: string;
  author: string;
  tags: string[];
  status: BookStatus;
  cover: number;
  pages: number;
  currentPage: number;
  note: string;
}

export type UpdateBookInput = Partial<CreateBookInput>;

export interface BookFilters {
  status?: BookStatus;
  tags?: string[];
}
