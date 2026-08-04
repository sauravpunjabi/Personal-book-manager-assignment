import { create } from 'zustand';
import type { BookStatus } from '@/types/book';

export type StatusFilter = BookStatus | 'all';

interface FilterState {
  status: StatusFilter;
  tags: string[];
  setStatus: (status: StatusFilter) => void;
  toggleTag: (tag: string) => void;
  clearFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  status: 'all',
  tags: [],

  setStatus: (status) => set({ status }),

  toggleTag: (tag) =>
    set((state) => ({
      tags: state.tags.includes(tag)
        ? state.tags.filter((existing) => existing !== tag)
        : [...state.tags, tag],
    })),

  clearFilters: () => set({ status: 'all', tags: [] }),
}));
