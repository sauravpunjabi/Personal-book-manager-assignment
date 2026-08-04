'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { BookForm } from '@/components/books/BookForm';
import { DeleteModal } from '@/components/books/DeleteModal';
import { BookGrid } from '@/components/library/BookGrid';
import { BookListView } from '@/components/library/BookListView';
import { EmptyLibrary, EmptyResults } from '@/components/library/LibraryEmpty';
import { LibraryHeader } from '@/components/library/LibraryHeader';
import { LibrarySidebar } from '@/components/library/LibrarySidebar';
import { LibrarySkeleton } from '@/components/library/LibrarySkeleton';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { getApiError } from '@/lib/apiError';
import { surnameOf } from '@/lib/bookCover';
import * as booksService from '@/lib/services/books.service';
import { useAuthStore } from '@/store/auth.store';
import { useFilterStore } from '@/store/filter.store';
import type { Book, BookStatus, CreateBookInput } from '@/types/book';

export default function LibraryPage() {
  const user = useAuthStore((state) => state.user);
  const { status, tag, query, sort, view, clearFilters } = useFilterStore();

  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [editing, setEditing] = useState<Book | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const [pendingDelete, setPendingDelete] = useState<Book | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const loadBooks = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');

    try {
      setBooks(await booksService.getBooks());
    } catch (error) {
      setLoadError(getApiError(error).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBooks();
  }, [loadBooks]);

  // Filtering happens here rather than on the server because the sidebar needs
  // counts across every shelf at the same time as the grid shows one of them —
  // a filtered response cannot answer both. The API still supports filtering.
  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();

    const matched = books.filter((book) => {
      if (status !== 'all' && book.status !== status) {
        return false;
      }
      if (tag && !book.tags.includes(tag)) {
        return false;
      }
      if (needle) {
        const haystack = `${book.title} ${book.author} ${book.tags.join(' ')}`;
        return haystack.toLowerCase().includes(needle);
      }
      return true;
    });

    const order = {
      recent: (a: Book, b: Book) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
      title: (a: Book, b: Book) => a.title.localeCompare(b.title),
      author: (a: Book, b: Book) =>
        surnameOf(a.author).localeCompare(surnameOf(b.author)),
    };

    return [...matched].sort(order[sort]);
  }, [books, status, tag, query, sort]);

  function openAdd() {
    setEditing(null);
    setFormError('');
    setIsFormOpen(true);
  }

  function openEdit(book: Book) {
    setEditing(book);
    setFormError('');
    setIsFormOpen(true);
  }

  async function saveBook(input: CreateBookInput) {
    setIsSaving(true);
    setFormError('');

    try {
      if (editing) {
        const updated = await booksService.updateBook(editing._id, input);
        setBooks((current) =>
          current.map((book) => (book._id === updated._id ? updated : book))
        );
      } else {
        const created = await booksService.createBook(input);
        setBooks((current) => [created, ...current]);
      }
      setIsFormOpen(false);
    } catch (error) {
      // Leave the modal open so the typed-in values survive the failure.
      setFormError(getApiError(error).message);
    } finally {
      setIsSaving(false);
    }
  }

  async function changeStatus(book: Book, next: BookStatus) {
    const previous = books;
    setBooks((current) =>
      current.map((entry) =>
        entry._id === book._id ? { ...entry, status: next } : entry
      )
    );

    try {
      const updated = await booksService.updateStatus(book._id, next);
      setBooks((current) =>
        current.map((entry) => (entry._id === updated._id ? updated : entry))
      );
    } catch {
      setBooks(previous);
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) {
      return;
    }

    setIsDeleting(true);
    setDeleteError('');

    try {
      await booksService.deleteBook(pendingDelete._id);
      setBooks((current) => current.filter((book) => book._id !== pendingDelete._id));
      setPendingDelete(null);
      setIsFormOpen(false);
    } catch (error) {
      setDeleteError(getApiError(error).message);
    } finally {
      setIsDeleting(false);
    }
  }

  const isFiltered = status !== 'all' || tag !== null || query.trim() !== '';
  const echo = query.trim() ? `“${query.trim()}”` : tag ? `“${tag}”` : 'that shelf';

  return (
    <div className="flex min-h-screen animate-[fadeIn_.45s_ease_both]">
      <div className="hidden md:block">
        <LibrarySidebar books={books} />
      </div>

      <main className="flex min-w-0 flex-1 flex-col">
        <LibraryHeader books={books} name={user?.name} onAdd={openAdd} />

        <div className="flex flex-wrap items-center gap-3 px-5 pt-5 pb-3 sm:px-10">
          <p className="flex-1 text-[13px] text-ink-2">
            {visible.length
              ? `${visible.length} ${visible.length === 1 ? 'book' : 'books'} ${
                  isFiltered ? 'on this shelf' : 'in your library'
                }`
              : ''}
          </p>

          {isFiltered && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-[12.5px] text-accent hover:underline hover:underline-offset-[3px]"
            >
              Clear filters
            </button>
          )}

          <SortControl />
        </div>

        <section className="flex-1 px-5 pt-3 pb-[72px] sm:px-10">
          {isLoading && <LibrarySkeleton />}

          {!isLoading && loadError && (
            <div className="rounded-[14px] border border-line bg-surface p-8 text-center">
              <p className="text-[13.5px] text-danger">{loadError}</p>
              <Button
                variant="secondary"
                className="mt-4"
                onClick={() => void loadBooks()}
              >
                Try again
              </Button>
            </div>
          )}

          {!isLoading && !loadError && books.length === 0 && (
            <EmptyLibrary onAdd={openAdd} />
          )}

          {!isLoading && !loadError && books.length > 0 && visible.length === 0 && (
            <EmptyResults echo={echo} onClear={clearFilters} />
          )}

          {!isLoading &&
            !loadError &&
            visible.length > 0 &&
            (view === 'grid' ? (
              <BookGrid books={visible} onOpen={openEdit} onStatusChange={changeStatus} />
            ) : (
              <BookListView
                books={visible}
                onOpen={openEdit}
                onStatusChange={changeStatus}
              />
            ))}
        </section>
      </main>

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editing ? 'Edit book' : 'Add a book'}
      >
        <BookForm
          key={editing?._id ?? 'new'}
          initialData={editing ?? undefined}
          isSubmitting={isSaving}
          error={formError}
          onSubmit={saveBook}
          onCancel={() => setIsFormOpen(false)}
          onDelete={editing ? () => setPendingDelete(editing) : undefined}
        />
      </Modal>

      <DeleteModal
        isOpen={pendingDelete !== null}
        bookTitle={pendingDelete?.title ?? ''}
        isDeleting={isDeleting}
        error={deleteError}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}

function SortControl() {
  const sort = useFilterStore((state) => state.sort);
  const setSort = useFilterStore((state) => state.setSort);

  return (
    <label className="flex items-center gap-2 text-[12.5px] text-ink-3">
      Sort
      <select
        value={sort}
        onChange={(event) => setSort(event.target.value as typeof sort)}
        className="h-8 cursor-pointer rounded-[9px] border border-line bg-surface px-2 text-[12.5px] text-ink outline-none"
      >
        <option value="recent">Recently added</option>
        <option value="title">Title A–Z</option>
        <option value="author">Author A–Z</option>
      </select>
    </label>
  );
}
