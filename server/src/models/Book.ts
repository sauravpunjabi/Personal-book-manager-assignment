import { Document, Schema, Types, model } from 'mongoose';
import { COVER_COUNT } from '../lib/coverIndex';

export const BOOK_STATUSES = ['want-to-read', 'reading', 'completed'] as const;

export type BookStatus = (typeof BOOK_STATUSES)[number];

export function isBookStatus(value: unknown): value is BookStatus {
  return BOOK_STATUSES.includes(value as BookStatus);
}

export interface IBook extends Document {
  _id: Types.ObjectId;
  title: string;
  author: string;
  tags: string[];
  status: BookStatus;
  cover: number;
  pages: number;
  currentPage: number;
  note: string;
  owner: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const bookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    tags: { type: [String], default: [] },
    status: { type: String, enum: BOOK_STATUSES, default: 'want-to-read' },
    // Index into the design's cover palette. Covers are drawn, not fetched.
    cover: { type: Number, default: 0, min: 0, max: COVER_COUNT - 1 },
    // Zero pages means unknown, which hides the progress bar instead of showing 0%
    pages: { type: Number, default: 0, min: 0 },
    currentPage: { type: Number, default: 0, min: 0 },
    note: { type: String, default: '', trim: true, maxlength: 500 },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  },
  { timestamps: true }
);

// Fiction and fiction are the same tag to a reader, so they fold together on save
bookSchema.pre('save', function () {
  if (!this.isModified('tags')) {
    return;
  }

  const cleaned = this.tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean);
  this.tags = [...new Set(cleaned)];
});

// Every query is scoped to an owner first, so both indexes lead with owner
bookSchema.index({ owner: 1, status: 1 });
bookSchema.index({ owner: 1, tags: 1 });

export const Book = model<IBook>('Book', bookSchema);
