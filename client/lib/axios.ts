import axios, { type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/auth.store';

// The API sleeps on free hosting and takes ~30s to wake, so a first request can
// die before it ever answers. Retrying turns that into a slow load, not a failure.
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 3000;

interface RetriedRequest extends InternalAxiosRequestConfig {
  retryCount?: number;
}

/** withCredentials sits on the instance so no request can skip the auth cookie */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    // A 401 clears auth state and lets ProtectedLayout do the redirecting
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      return Promise.reject(error);
    }

    // No response at all means the request never landed, not that it was refused
    const request: RetriedRequest | undefined = error.config;

    if (!error.response && request) {
      const attempt = request.retryCount ?? 0;

      if (attempt < MAX_RETRIES) {
        request.retryCount = attempt + 1;
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
        return api(request);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
