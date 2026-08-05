'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BookDetail } from '@/components/books/BookDetail';
import { BookForm } from '@/components/books/BookForm';
import { DeleteModal } from '@/components/books/DeleteModal';
import { BookListView } from '@/components/library/BookListView';
import { Bookshelf } from '@/components/shelf/Bookshelf';
import { EmptyLibrary, EmptyResults } from '@/components/library/LibraryEmpty';
import { LibraryHeader } from '@/components/library/LibraryHeader';
import { LibrarySidebar } from '@/components/library/LibrarySidebar';
import { LibrarySkeleton } from '@/components/library/LibrarySkeleton';
import { MobileShelfBar } from '@/components/library/MobileShelfBar';
import { Toast } from '@/components/library/Toast';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useShelfFlip } from '@/hooks/useShelfFlip';
import { getApiError } from '@/lib/apiError';
import { surnameOf } from '@/lib/bookCover';
import * as booksService from '@/lib/services/books.service';
import { useAuthStore } from '@/store/auth.store';
import { useFilterStore } from '@/store/filter.store';
import type { Book, BookStatus, CreateBookInput } from '@/types/book';

// Long enough to notice and react, since this one gates something irreversible
const UNDO_WINDOW_MS = 5000;

export default function LibraryPage() {
  const user = useAuthStore((state) => state.user);
  const { status, tag, query, sort, view, clearFilters } = useFilterStore();

  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [detailId, setDetailId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Book | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const [pendingDelete, setPendingDelete] = useState<Book | null>(null);
  const [removed, setRemoved] = useState<Book | null>(null);
  const [toastMessage, setToastMessage] = useState('');

  // Held in a ref so the timer and the unmount cleanup never see a stale value
  const removedRef = useRef<Book | null>(null);
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // Filtered here because the sidebar needs every shelf count while the grid shows one
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

  // The shelf keeps every book in place and greys the ones that miss the search,
  // so filtering reads as narrowing rather than as books vanishing.
  const shelfBooks = useMemo(
    () => (status === 'all' ? books : books.filter((book) => book.status === status)),
    [books, status]
  );

  const dimmedIds = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const dimmed = new Set<string>();

    if (!needle && !tag) {
      return dimmed;
    }

    for (const book of shelfBooks) {
      const haystack =
        `${book.title} ${book.author} ${book.tags.join(' ')}`.toLowerCase();
      const matches =
        (!tag || book.tags.includes(tag)) && (!needle || haystack.includes(needle));

      if (!matches) {
        dimmed.add(book._id);
      }
    }

    return dimmed;
  }, [shelfBooks, query, tag]);

  // Any change to which shelf a book sits on replays as a physical move
  const recordShelf = useShelfFlip(
    shelfBooks.map((book) => `${book._id}:${book.status}:${book.updatedAt}`).join('|')
  );

  // Looked up, not stored, so a status change inside the drawer shows immediately
  const detail = useMemo(
    () => books.find((book) => book._id === detailId) ?? null,
    [books, detailId]
  );

  function openAdd() {
    setEditing(null);
    setFormError('');
    setIsFormOpen(true);
  }

  function openEdit(book: Book) {
    setDetailId(null);
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

    // Measure the shelf before React moves anything, so Flip can replay the move
    recordShelf();

    // Bumping updatedAt here as well as on the server puts the book at the end
    // of its new shelf immediately, rather than jumping there once the reply lands
    setBooks((current) =>
      current.map((entry) =>
        entry._id === book._id
          ? { ...entry, status: next, updatedAt: new Date().toISOString() }
          : entry
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

  /** Fires the delete the server acts on, once the undo window has closed */
  const commitRemoval = useCallback(() => {
    const book = removedRef.current;

    if (!book) {
      return;
    }

    removedRef.current = null;
    setRemoved(null);

    if (undoTimer.current) {
      clearTimeout(undoTimer.current);
      undoTimer.current = null;
    }

    void booksService.deleteBook(book._id).catch((error) => {
      // Put it back — as far as the reader is concerned it never left.
      setBooks((current) => [book, ...current]);
      setToastMessage(`Could not remove “${book.title}”. ${getApiError(error).message}`);
    });
  }, []);

  function startRemoval(book: Book) {
    commitRemoval();

    removedRef.current = book;
    setRemoved(book);
    setToastMessage('');
    setBooks((current) => current.filter((entry) => entry._id !== book._id));

    undoTimer.current = setTimeout(commitRemoval, UNDO_WINDOW_MS);
  }

  function undoRemoval() {
    const book = removedRef.current;

    if (!book) {
      return;
    }

    if (undoTimer.current) {
      clearTimeout(undoTimer.current);
      undoTimer.current = null;
    }

    removedRef.current = null;
    setRemoved(null);
    setBooks((current) => [book, ...current]);
  }

  // Leaving the page commits, or a pending delete would quietly be forgotten
  useEffect(() => commitRemoval, [commitRemoval]);

  function confirmDelete() {
    if (!pendingDelete) {
      return;
    }

    startRemoval(pendingDelete);
    setPendingDelete(null);
    setIsFormOpen(false);
    setDetailId(null);
  }

  // Remounting on a deliberate shelf change replays the stagger; typing is excluded
  const shelfKey = `${status}-${tag ?? 'none'}-${sort}`;

  const isFiltered = status !== 'all' || tag !== null || query.trim() !== '';
  const echo = query.trim() ? `“${query.trim()}”` : tag ? `“${tag}”` : 'that shelf';

  return (
    <div className="flex min-h-screen animate-[fadeIn_.45s_ease_both]">
      <div className="hidden md:block">
        <LibrarySidebar books={books} />
      </div>

      <main className="flex min-w-0 flex-1 flex-col">
        <LibraryHeader books={books} name={user?.name} onAdd={openAdd} />

        <MobileShelfBar books={books} />

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

          {!isLoading && !loadError && books.length > 0 && view === 'shelf' && (
            <Bookshelf
              key={shelfKey}
              books={shelfBooks}
              dimmedIds={dimmedIds}
              onOpen={(book) => setDetailId(book._id)}
              onAdd={openAdd}
            />
          )}

          {!isLoading && !loadError && view === 'list' && visible.length === 0 && (
            <EmptyResults echo={echo} onClear={clearFilters} />
          )}

          {!isLoading && !loadError && view === 'list' && visible.length > 0 && (
            <BookListView
              books={visible}
              onOpen={(book) => setDetailId(book._id)}
              onStatusChange={changeStatus}
            />
          )}
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
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />

      <BookDetail
        book={detail}
        onClose={() => setDetailId(null)}
        onStatusChange={changeStatus}
        onEdit={openEdit}
        onDelete={setPendingDelete}
      />

      {removed && (
        <Toast
          message={`“${removed.title}” removed`}
          action={{ label: 'Undo', onClick: undoRemoval }}
        />
      )}

      {!removed && toastMessage && <Toast message={toastMessage} />}
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
