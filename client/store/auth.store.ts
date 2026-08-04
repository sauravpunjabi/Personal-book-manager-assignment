import { create } from 'zustand';
import * as authService from '@/lib/services/auth.service';
import type { User } from '@/types/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Starts loading so a protected page shows a spinner rather than flashing
  // the login redirect before the session has been resolved.
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ user, isAuthenticated: true, isLoading: false }),

  // Local state only — clearing the cookie is the server's job, via authService.
  logout: () => set({ user: null, isAuthenticated: false, isLoading: false }),

  checkAuth: async () => {
    if (!get().user) {
      set({ isLoading: true });
    }

    try {
      const { user } = await authService.getMe();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
