'use client';

import { useId, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CoverPicker } from '@/components/books/CoverPicker';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { STATUS_LABELS } from '@/lib/bookStatus';
import { BOOK_STATUSES, type Book, type CreateBookInput } from '@/types/book';

const bookSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  author: z.string().trim().min(1, 'Author is required'),
  tags: z.string(),
  status: z.enum(BOOK_STATUSES),
});

type BookFormValues = z.infer<typeof bookSchema>;

interface BookFormProps {
  initialData?: Book;
  isSubmitting: boolean;
  error?: string;
  onSubmit: (input: CreateBookInput) => void;
  onCancel: () => void;
}

export function BookForm({
  initialData,
  isSubmitting,
  error,
  onSubmit,
  onCancel,
}: BookFormProps) {
  const statusId = useId();
  const [cover, setCover] = useState(initialData?.cover ?? 0);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: initialData?.title ?? '',
      author: initialData?.author ?? '',
      tags: initialData?.tags.join(', ') ?? '',
      status: initialData?.status ?? 'want-to-read',
    },
  });

  // Watched so the cover preview updates as the title and author are typed.
  const previewTitle = useWatch({ control, name: 'title' });
  const previewAuthor = useWatch({ control, name: 'author' });

  function submit(values: BookFormValues) {
    onSubmit({
      title: values.title.trim(),
      author: values.author.trim(),
      status: values.status,
      cover,
      tags: values.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    });
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-5">
      <CoverPicker
        title={previewTitle}
        author={previewAuthor}
        cover={cover}
        onChange={setCover}
      />

      <Input
        label="Title"
        autoFocus
        placeholder="The Left Hand of Darkness"
        error={errors.title?.message}
        {...register('title')}
      />

      <Input
        label="Author"
        placeholder="Ursula K. Le Guin"
        error={errors.author?.message}
        {...register('author')}
      />

      <Input
        label="Tags"
        placeholder="fiction, sci-fi"
        error={errors.tags?.message}
        {...register('tags')}
      />

      <div className="space-y-1.5">
        <label htmlFor={statusId} className="block text-sm font-medium">
          Status
        </label>
        <select
          id={statusId}
          className="h-11 w-full rounded-md border border-line bg-surface px-3 text-ink"
          {...register('status')}
        >
          {BOOK_STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2 pt-1">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {initialData ? 'Save changes' : 'Add book'}
        </Button>
      </div>
    </form>
  );
}
