'use client';

import { useId, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CoverPicker } from '@/components/books/CoverPicker';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { STATUS_COLORS, STATUS_LABELS, statusTint } from '@/lib/bookStatus';
import {
  BOOK_STATUSES,
  type Book,
  type BookStatus,
  type CreateBookInput,
} from '@/types/book';

// Number inputs hand back strings, so page counts are coerced and bounded here
const pageCount = z
  .string()
  .refine((value) => value === '' || /^\d{1,5}$/.test(value), 'Use a whole number');

const bookSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  author: z.string().trim().min(1, 'Author is required'),
  tags: z.string(),
  status: z.enum(BOOK_STATUSES),
  pages: pageCount,
  currentPage: pageCount,
  note: z.string().max(500, 'Keep it under 500 characters'),
});

type BookFormValues = z.infer<typeof bookSchema>;

interface BookFormProps {
  initialData?: Book;
  isSubmitting: boolean;
  error?: string;
  onSubmit: (input: CreateBookInput) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export function BookForm({
  initialData,
  isSubmitting,
  error,
  onSubmit,
  onCancel,
  onDelete,
}: BookFormProps) {
  const [cover, setCover] = useState(initialData?.cover ?? 0);
  const noteId = useId();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: initialData?.title ?? '',
      author: initialData?.author ?? '',
      tags: initialData?.tags.join(', ') ?? '',
      status: initialData?.status ?? 'want-to-read',
      pages: initialData?.pages ? String(initialData.pages) : '',
      currentPage: initialData?.currentPage ? String(initialData.currentPage) : '',
      note: initialData?.note ?? '',
    },
  });

  // Watched so the cover preview and status pills track what is typed.
  const title = useWatch({ control, name: 'title' });
  const author = useWatch({ control, name: 'author' });
  const status = useWatch({ control, name: 'status' });

  function submit(values: BookFormValues) {
    onSubmit({
      title: values.title.trim(),
      author: values.author.trim(),
      status: values.status,
      cover,
      pages: Number(values.pages) || 0,
      currentPage: Number(values.currentPage) || 0,
      note: values.note.trim(),
      tags: values.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    });
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate>
      <div className="flex flex-col gap-[22px] sm:flex-row">
        <CoverPicker title={title} author={author} cover={cover} onChange={setCover} />

        <div className="flex min-w-0 flex-1 flex-col gap-[15px]">
          <Input
            label="Title"
            autoFocus
            placeholder="The book's title"
            error={errors.title?.message}
            {...register('title')}
          />

          <Input
            label="Author"
            placeholder="Who wrote it"
            error={errors.author?.message}
            {...register('author')}
          />

          <Input
            label="Tags"
            placeholder="Fiction, Comfort reads"
            hint="Separate with commas"
            error={errors.tags?.message}
            {...register('tags')}
          />

          <div className="flex gap-3">
            <Input
              label="Pages"
              type="number"
              inputMode="numeric"
              min={0}
              placeholder="—"
              error={errors.pages?.message}
              {...register('pages')}
            />
            <Input
              label="On page"
              type="number"
              inputMode="numeric"
              min={0}
              placeholder="—"
              error={errors.currentPage?.message}
              {...register('currentPage')}
            />
          </div>

          <div className="flex flex-col gap-[7px]">
            <label
              htmlFor={noteId}
              className="text-[11.5px] tracking-[0.08em] text-ink-3 uppercase"
            >
              My note
            </label>
            <textarea
              id={noteId}
              rows={3}
              placeholder="Something worth remembering"
              className="field w-full resize-none px-[14px] py-2.5 text-[14px] outline-none"
              {...register('note')}
            />
            {errors.note?.message && (
              <p className="text-[12.5px] text-danger">{errors.note.message}</p>
            )}
          </div>

          <fieldset className="flex flex-col gap-[9px]">
            <legend className="text-[11.5px] tracking-[0.08em] text-ink-3 uppercase">
              Reading status
            </legend>
            <input type="hidden" {...register('status')} />
            <div className="flex flex-wrap gap-[7px]">
              {BOOK_STATUSES.map((choice) => (
                <StatusChoice
                  key={choice}
                  status={choice}
                  isActive={status === choice}
                  onPick={() => setValue('status', choice, { shouldDirty: true })}
                />
              ))}
            </div>
          </fieldset>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-5 text-[12.5px] text-danger">
          {error}
        </p>
      )}

      <div className="mt-[22px] flex items-center gap-2.5">
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="h-[42px] rounded-[12px] px-3 text-[13.5px] text-ink-3 transition-colors hover:bg-[color-mix(in_oklab,var(--color-accent)_10%,var(--color-surface))] hover:text-accent"
          >
            Remove
          </button>
        )}
        <div className="flex-1" />
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {initialData ? 'Save changes' : 'Add to shelf'}
        </Button>
      </div>
    </form>
  );
}

function StatusChoice({
  status,
  isActive,
  onPick,
}: {
  status: BookStatus;
  isActive: boolean;
  onPick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onPick}
      aria-pressed={isActive}
      className="flex h-[34px] items-center gap-[7px] rounded-full border px-[13px] text-[12.5px] transition-colors hover:border-ink-3"
      style={{
        background: isActive ? statusTint(status) : 'transparent',
        color: isActive ? STATUS_COLORS[status] : 'var(--color-ink-2)',
        borderColor: isActive
          ? `color-mix(in oklab, ${STATUS_COLORS[status]} 40%, var(--color-surface))`
          : 'var(--color-line)',
      }}
    >
      <span
        className="size-[5px] rounded-full"
        style={{ background: STATUS_COLORS[status] }}
      />
      {STATUS_LABELS[status]}
    </button>
  );
}
