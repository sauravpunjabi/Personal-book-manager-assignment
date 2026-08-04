'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { BookCard } from '@/components/books/BookCard';
import { BookForm } from '@/components/books/BookForm';
import { DeleteModal } from '@/components/books/DeleteModal';
import { EmptyState } from '@/components/books/EmptyState';
import { FilterPanel } from '@/components/books/FilterPanel';
import { SkeletonCard } from '@/components/books/SkeletonCard';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { getApiError } from '@/lib/apiError';
import * as booksService from '@/lib/services/books.service';
import { useFilterStore } from '@/store/filter.store';
import type { Book, BookStatus, CreateBookInput } from '@/types/book';

const SKELETON_COUNT = 6;

export default function BooksPage() {
  const reduceMotion = useReducedMotion();
  const status = useFilterStore((state) => state.status);
  const tags = useFilterStore((state) => state.tags);
  const clearFilters = useFilterStore((state) => state.clearFilters);

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

  const tagKey = tags.join(',');

  const loadBooks = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');

    try {
      setBooks(
        await booksService.getBooks({
          ...(status === 'all' ? {} : { status }),
          ...(tagKey ? { tags: tagKey.split(',') } : {}),
        })
      );
    } catch (error) {
      setLoadError(getApiError(error).message);
    } finally {
      setIsLoading(false);
    }
  }, [status, tagKey]);

  useEffect(() => {
    void loadBooks();
  }, [loadBooks]);

  const availableTags = useMemo(
    () => [...new Set(books.flatMap((book) => book.tags))].sort(),
    [books]
  );

  function openAddForm() {
    setEditing(null);
    setFormError('');
    setIsFormOpen(true);
  }

  function openEditForm(book: Book) {
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
    } catch (error) {
      setDeleteError(getApiError(error).message);
    } finally {
      setIsDeleting(false);
    }
  }

  const isFiltered = status !== 'all' || tags.length > 0;

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.25 }}
      className="mx-auto max-w-5xl space-y-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-semibold">My books</h1>
        <Button onClick={openAddForm}>Add book</Button>
      </div>

      <FilterPanel availableTags={availableTags} />

      {isLoading && (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: SKELETON_COUNT }, (_, index) => (
            <li key={index}>
              <SkeletonCard />
            </li>
          ))}
        </ul>
      )}

      {!isLoading && loadError && (
        <div className="rounded-lg border border-line bg-surface p-8 text-center">
          <p className="text-sm text-danger">{loadError}</p>
          <Button variant="secondary" className="mt-4" onClick={() => void loadBooks()}>
            Try again
          </Button>
        </div>
      )}

      {!isLoading && !loadError && books.length === 0 && (
        <EmptyState
          variant={isFiltered ? 'no-results' : 'no-books'}
          onAction={isFiltered ? clearFilters : openAddForm}
        />
      )}

      {!isLoading && !loadError && books.length > 0 && (
        <motion.ul
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.04 } },
          }}
        >
          <AnimatePresence mode="popLayout">
            {books.map((book) => (
              <motion.div
                key={book._id}
                variants={{
                  hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                transition={{ duration: reduceMotion ? 0 : 0.2 }}
                className="contents"
              >
                <BookCard
                  book={book}
                  onEdit={openEditForm}
                  onDelete={(target) => {
                    setDeleteError('');
                    setPendingDelete(target);
                  }}
                  onStatusChange={changeStatus}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}

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
    </motion.div>
  );
}
