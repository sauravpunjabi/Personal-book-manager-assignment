import axios from 'axios';
import { useAuthStore } from '@/store/auth.store';

/** withCredentials sits on the instance so no request can skip the auth cookie */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

/** A 401 clears auth state and lets ProtectedLayout do the redirecting */
api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      useAuthStore.getState().logout();
    }

    return Promise.reject(error);
  }
);

export default api;
