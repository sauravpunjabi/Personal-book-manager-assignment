export const BOOK_STATUSES = ['want-to-read', 'reading', 'completed'] as const;

export type BookStatus = (typeof BOOK_STATUSES)[number];

export interface Book {
  _id: string;
  title: string;
  author: string;
  tags: string[];
  status: BookStatus;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookInput {
  title: string;
  author: string;
  tags: string[];
  status: BookStatus;
}

export type UpdateBookInput = Partial<CreateBookInput>;

export interface BookFilters {
  status?: BookStatus;
  tags?: string[];
}
