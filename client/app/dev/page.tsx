'use client';

/**
 * Temporary API console for poking at the backend from a browser instead of
 * curl. Delete this route once the real books UI lands in Phase 6.
 */

import { useState } from 'react';
import { isAxiosError } from 'axios';
import * as authService from '@/lib/services/auth.service';
import * as booksService from '@/lib/services/books.service';
import { BOOK_STATUSES, type Book, type BookStatus } from '@/types/book';

interface LogEntry {
  label: string;
  status: string;
  body: unknown;
  ok: boolean;
  at: string;
}

export default function DevConsolePage() {
  const [name, setName] = useState('Saurav');
  const [email, setEmail] = useState('saurav@example.com');
  const [password, setPassword] = useState('password123');

  const [title, setTitle] = useState('The Left Hand of Darkness');
  const [author, setAuthor] = useState('Ursula K. Le Guin');
  const [tags, setTags] = useState('fiction, sci-fi');
  const [status, setStatus] = useState<BookStatus>('want-to-read');

  const [filterStatus, setFilterStatus] = useState('');
  const [filterTags, setFilterTags] = useState('');

  const [books, setBooks] = useState<Book[]>([]);
  const [log, setLog] = useState<LogEntry[]>([]);

  async function run(label: string, action: () => Promise<unknown>) {
    try {
      const body = await action();
      record(label, '2xx OK', body, true);
      return body;
    } catch (error) {
      if (isAxiosError(error)) {
        record(
          label,
          `${error.response?.status ?? 'network'} ${error.response?.statusText ?? ''}`.trim(),
          error.response?.data ?? error.message,
          false
        );
      } else {
        record(label, 'error', String(error), false);
      }
    }
  }

  function record(label: string, statusText: string, body: unknown, ok: boolean) {
    setLog((entries) =>
      [
        {
          label,
          status: statusText,
          body,
          ok,
          at: new Date().toLocaleTimeString(),
        },
        ...entries,
      ].slice(0, 12)
    );
  }

  async function refreshBooks() {
    const result = await run('GET /api/books', () =>
      booksService.getBooks({
        ...(filterStatus ? { status: filterStatus as BookStatus } : {}),
        ...(filterTags
          ? {
              tags: filterTags
                .split(',')
                .map((tag) => tag.trim())
                .filter(Boolean),
            }
          : {}),
      })
    );

    if (Array.isArray(result)) {
      setBooks(result as Book[]);
    }
  }

  function nextStatus(current: BookStatus): BookStatus {
    return BOOK_STATUSES[(BOOK_STATUSES.indexOf(current) + 1) % BOOK_STATUSES.length];
  }

  return (
    <main className="mx-auto max-w-5xl space-y-8 p-6 font-mono text-sm">
      <header>
        <h1 className="text-xl font-bold">API console</h1>
        <p className="text-neutral-500">
          Temporary. Deleted in Phase 6 once the real UI exists.
        </p>
      </header>

      <Section title="Auth">
        <div className="flex flex-wrap gap-2">
          <Field value={name} onChange={setName} placeholder="name" />
          <Field value={email} onChange={setEmail} placeholder="email" />
          <Field value={password} onChange={setPassword} placeholder="password" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Btn
            onClick={() =>
              run('POST /signup', () => authService.signup(name, email, password))
            }
          >
            signup
          </Btn>
          <Btn
            onClick={() => run('POST /login', () => authService.login(email, password))}
          >
            login
          </Btn>
          <Btn onClick={() => run('GET /me', () => authService.getMe())}>me</Btn>
          <Btn onClick={() => run('POST /logout', () => authService.logout())}>
            logout
          </Btn>
          <Btn
            onClick={() =>
              record('document.cookie', 'read', document.cookie || '(empty)', true)
            }
          >
            read document.cookie
          </Btn>
        </div>
      </Section>

      <Section title="Create book">
        <div className="flex flex-wrap gap-2">
          <Field value={title} onChange={setTitle} placeholder="title" />
          <Field value={author} onChange={setAuthor} placeholder="author" />
          <Field value={tags} onChange={setTags} placeholder="tags, comma separated" />
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as BookStatus)}
            className="rounded border border-neutral-300 px-2 py-1"
          >
            {BOOK_STATUSES.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <Btn
          onClick={async () => {
            await run('POST /api/books', () =>
              booksService.createBook({
                title,
                author,
                status,
                tags: tags
                  .split(',')
                  .map((tag) => tag.trim())
                  .filter(Boolean),
              })
            );
            await refreshBooks();
          }}
        >
          create
        </Btn>
      </Section>

      <Section title="List and filter">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterStatus}
            onChange={(event) => setFilterStatus(event.target.value)}
            className="rounded border border-neutral-300 px-2 py-1"
          >
            <option value="">any status</option>
            {BOOK_STATUSES.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          <Field value={filterTags} onChange={setFilterTags} placeholder="filter tags" />
          <Btn onClick={refreshBooks}>fetch</Btn>
          <Btn
            onClick={() =>
              run('GET /api/books?status=bogus', () =>
                booksService.getBooks({ status: 'bogus' as BookStatus })
              )
            }
          >
            try invalid status
          </Btn>
          <Btn
            onClick={() =>
              run('GET /api/books/deadbeef', () => booksService.getBook('deadbeef'))
            }
          >
            try bad id
          </Btn>
        </div>

        <ul className="space-y-2">
          {books.map((book) => (
            <li
              key={book._id}
              className="flex flex-wrap items-center gap-2 rounded border border-neutral-200 p-2"
            >
              <span className="grow">
                <strong>{book.title}</strong> — {book.author}
                <span className="text-neutral-500">
                  {' '}
                  [{book.status}] {book.tags.join(', ')}
                </span>
              </span>
              <Btn
                onClick={async () => {
                  await run('PATCH status', () =>
                    booksService.updateStatus(book._id, nextStatus(book.status))
                  );
                  await refreshBooks();
                }}
              >
                cycle status
              </Btn>
              <Btn
                onClick={async () => {
                  await run('PUT /api/books/:id', () =>
                    booksService.updateBook(book._id, { title: `${book.title} (edited)` })
                  );
                  await refreshBooks();
                }}
              >
                edit title
              </Btn>
              <Btn
                onClick={async () => {
                  await run('DELETE /api/books/:id', () =>
                    booksService.deleteBook(book._id)
                  );
                  await refreshBooks();
                }}
              >
                delete
              </Btn>
            </li>
          ))}
          {books.length === 0 && <li className="text-neutral-500">no books loaded</li>}
        </ul>
      </Section>

      <Section title="Responses">
        <ul className="space-y-2">
          {log.map((entry, index) => (
            <li
              key={index}
              className={`rounded border p-2 ${
                entry.ok ? 'border-neutral-200' : 'border-red-300 bg-red-50'
              }`}
            >
              <div className="flex justify-between">
                <strong>{entry.label}</strong>
                <span className="text-neutral-500">
                  {entry.status} · {entry.at}
                </span>
              </div>
              <pre className="mt-1 overflow-x-auto whitespace-pre-wrap text-xs">
                {JSON.stringify(entry.body, null, 2)}
              </pre>
            </li>
          ))}
          {log.length === 0 && <li className="text-neutral-500">nothing yet</li>}
        </ul>
      </Section>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-bold uppercase tracking-wide text-neutral-500">{title}</h2>
      {children}
    </section>
  );
}

function Field({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <input
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      className="rounded border border-neutral-300 px-2 py-1"
    />
  );
}

function Btn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded border border-neutral-400 px-3 py-1 hover:bg-neutral-100"
    >
      {children}
    </button>
  );
}
