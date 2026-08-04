import type { NextFunction, Request, Response } from 'express';
import { QueryFilter, Types } from 'mongoose';
import { isCoverIndex, pickCover } from '../lib/coverIndex';
import { HttpError } from '../lib/httpError';
import { readCount, readString, readStringArray } from '../lib/parseBody';
import { Book, IBook, isBookStatus } from '../models/Book';

type FieldErrors = Record<string, string>;

function requireUserId(req: Request): string {
  const userId = req.user?.id;

  if (!userId) {
    throw new HttpError(401, 'Not authenticated');
  }

  return userId;
}

/**
 * Loads a book only if it belongs to the caller. An unknown id and a malformed
 * id both read as "not found" — a CastError would otherwise surface as a 500.
 */
async function loadOwnedBook(bookId: unknown, ownerId: string): Promise<IBook> {
  if (typeof bookId !== 'string' || !Types.ObjectId.isValid(bookId)) {
    throw new HttpError(404, 'Book not found');
  }

  const book = await Book.findById(bookId);

  if (!book) {
    throw new HttpError(404, 'Book not found');
  }

  if (book.owner.toString() !== ownerId) {
    throw new HttpError(403, 'Forbidden');
  }

  return book;
}

function readQueryParam(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export async function getBooks(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const filter: QueryFilter<IBook> = { owner: requireUserId(req) };

    const status = readQueryParam(req.query.status);
    if (status) {
      if (!isBookStatus(status)) {
        throw new HttpError(400, `Unknown status "${status}"`);
      }
      filter.status = status;
    }

    const tags = readQueryParam(req.query.tags)
      .split(',')
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);

    // $all rather than $in — selecting two tags should narrow the list, not widen it.
    if (tags.length > 0) {
      filter.tags = { $all: tags };
    }

    res.json(await Book.find(filter).sort({ createdAt: -1 }));
  } catch (error) {
    next(error);
  }
}

export async function getBook(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    res.json(await loadOwnedBook(req.params.id, requireUserId(req)));
  } catch (error) {
    next(error);
  }
}

export async function createBook(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const ownerId = requireUserId(req);
    const body: Record<string, unknown> = req.body ?? {};

    const title = readString(body, 'title');
    const author = readString(body, 'author');
    const status = readString(body, 'status');

    const errors: FieldErrors = {};
    if (!title) {
      errors.title = 'Title is required';
    }
    if (!author) {
      errors.author = 'Author is required';
    }
    if (status && !isBookStatus(status)) {
      errors.status = `Unknown status "${status}"`;
    }

    if (Object.keys(errors).length > 0) {
      res.status(400).json({ message: 'Please check the highlighted fields', errors });
      return;
    }

    const book = await Book.create({
      title,
      author,
      tags: readStringArray(body, 'tags'),
      ...(isBookStatus(status) ? { status } : {}),
      // Honour a picked colour, otherwise derive one from the title.
      cover: isCoverIndex(body.cover) ? body.cover : pickCover(title),
      pages: readCount(body, 'pages'),
      currentPage: readCount(body, 'currentPage'),
      note: readString(body, 'note'),
      owner: ownerId,
    });

    res.status(201).json(book);
  } catch (error) {
    next(error);
  }
}

export async function updateBook(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const book = await loadOwnedBook(req.params.id, requireUserId(req));
    const body: Record<string, unknown> = req.body ?? {};

    const errors: FieldErrors = {};

    // Only fields actually present are touched, so a partial update stays partial.
    if ('title' in body) {
      const title = readString(body, 'title');
      if (!title) {
        errors.title = 'Title is required';
      } else {
        book.title = title;
      }
    }

    if ('author' in body) {
      const author = readString(body, 'author');
      if (!author) {
        errors.author = 'Author is required';
      } else {
        book.author = author;
      }
    }

    if ('status' in body) {
      const status = readString(body, 'status');
      if (!isBookStatus(status)) {
        errors.status = `Unknown status "${status}"`;
      } else {
        book.status = status;
      }
    }

    if ('tags' in body) {
      book.tags = readStringArray(body, 'tags');
    }

    if (isCoverIndex(body.cover)) {
      book.cover = body.cover;
    }

    if ('pages' in body) {
      book.pages = readCount(body, 'pages');
    }

    if ('currentPage' in body) {
      book.currentPage = readCount(body, 'currentPage');
    }

    if ('note' in body) {
      book.note = readString(body, 'note');
    }

    // A bookmark past the last page is nonsense, so clamp rather than reject.
    if (book.pages > 0 && book.currentPage > book.pages) {
      book.currentPage = book.pages;
    }

    if (Object.keys(errors).length > 0) {
      res.status(400).json({ message: 'Please check the highlighted fields', errors });
      return;
    }

    res.json(await book.save());
  } catch (error) {
    next(error);
  }
}

export async function updateStatus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const book = await loadOwnedBook(req.params.id, requireUserId(req));
    const body: Record<string, unknown> = req.body ?? {};
    const status = readString(body, 'status');

    if (!isBookStatus(status)) {
      res.status(400).json({
        message: 'Please check the highlighted fields',
        errors: { status: `Unknown status "${status}"` },
      });
      return;
    }

    book.status = status;
    res.json(await book.save());
  } catch (error) {
    next(error);
  }
}

export async function deleteBook(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const book = await loadOwnedBook(req.params.id, requireUserId(req));
    await book.deleteOne();

    res.json({ message: 'Book deleted' });
  } catch (error) {
    next(error);
  }
}
