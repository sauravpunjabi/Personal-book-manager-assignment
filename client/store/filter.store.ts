import { create } from 'zustand';
import type { BookStatus } from '@/types/book';

export type StatusFilter = BookStatus | 'all';
export type SortOrder = 'recent' | 'title' | 'author';
export type ViewMode = 'shelf' | 'list';

interface FilterState {
  status: StatusFilter;
  tag: string | null;
  query: string;
  sort: SortOrder;
  view: ViewMode;
  setStatus: (status: StatusFilter) => void;
  toggleTag: (tag: string) => void;
  setQuery: (query: string) => void;
  setSort: (sort: SortOrder) => void;
  setView: (view: ViewMode) => void;
  clearFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  status: 'all',
  tag: null,
  query: '',
  sort: 'recent',
  view: 'shelf',

  setStatus: (status) => set({ status }),
  // One tag at a time, as the design has it — clicking the active tag clears it.
  toggleTag: (tag) => set((state) => ({ tag: state.tag === tag ? null : tag })),
  setQuery: (query) => set({ query }),
  setSort: (sort) => set({ sort }),
  setView: (view) => set({ view }),

  // View and sort are preferences, not filters, so they survive a clear.
  clearFilters: () => set({ status: 'all', tag: null, query: '' }),
}));
