'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ReadingSection } from '@/components/dashboard/ReadingSection';
import { StatCard } from '@/components/dashboard/StatCard';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { getApiError } from '@/lib/apiError';
import * as booksService from '@/lib/services/books.service';
import { useAuthStore } from '@/store/auth.store';
import type { Book } from '@/types/book';

const RECENT_COUNT = 4;
const NOON = 12;
const EVENING = 17;

function greetingFor(hour: number): string {
  if (hour < NOON) {
    return 'Good morning';
  }
  return hour < EVENING ? 'Good afternoon' : 'Good evening';
}

export default function DashboardPage() {
  const reduceMotion = useReducedMotion();
  const user = useAuthStore((state) => state.user);

  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

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

  // Everything on this page is derived from the one request. Counting in the
  // browser beats four extra round trips for numbers this small.
  const stats = useMemo(() => {
    const byStatus = (status: Book['status']) =>
      books.filter((book) => book.status === status);

    return {
      total: books.length,
      wantToRead: byStatus('want-to-read').length,
      reading: byStatus('reading'),
      completed: byStatus('completed').length,
      recent: [...books]
        .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
        .slice(0, RECENT_COUNT),
    };
  }, [books]);

  // Safe to read the clock during render: ProtectedLayout shows its spinner
  // until auth resolves, so this component only ever renders in the browser.
  const greeting = greetingFor(new Date().getHours());

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (loadError) {
    return (
      <div className="rounded-lg border border-line bg-surface p-8 text-center">
        <p className="text-sm text-danger">{loadError}</p>
        <Button variant="secondary" className="mt-4" onClick={() => void loadBooks()}>
          Try again
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.25 }}
      className="mx-auto max-w-5xl space-y-8"
    >
      <h1 className="font-display text-3xl font-semibold text-balance">
        {greeting}
        {user ? `, ${user.name}` : ''}.
      </h1>

      {books.length === 0 ? (
        <div className="rounded-lg border border-line bg-surface px-6 py-16 text-center">
          <p className="font-display text-lg font-semibold">Nothing on the shelf yet.</p>
          <p className="mt-2 text-sm text-muted">
            Add a book and this page starts filling in.
          </p>
          <Link
            href="/books"
            className="mt-6 inline-flex h-11 items-center rounded-md bg-ink px-5 text-sm font-medium text-paper transition-colors hover:bg-ink/90"
          >
            Start building your shelf
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard label="Total books" value={stats.total} />
            <StatCard
              label="Want to read"
              value={stats.wantToRead}
              tone="text-status-want"
            />
            <StatCard
              label="Reading"
              value={stats.reading.length}
              tone="text-status-reading"
            />
            <StatCard label="Completed" value={stats.completed} tone="text-status-done" />
          </div>

          <ReadingSection
            title="Currently reading"
            books={stats.reading}
            emptyMessage="Nothing in progress. Pick something off the shelf."
          />

          <ReadingSection
            title="Recently added"
            books={stats.recent}
            emptyMessage="Nothing here yet."
          />
        </>
      )}
    </motion.div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <Skeleton className="h-9 w-72" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-24" />
        ))}
      </div>
      <div className="space-y-3">
        <Skeleton className="h-6 w-40" />
        <div className="flex gap-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-28 w-56 shrink-0" />
          ))}
        </div>
      </div>
    </div>
  );
}
