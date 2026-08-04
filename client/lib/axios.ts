import axios from 'axios';
import { useAuthStore } from '@/store/auth.store';

/**
 * withCredentials is what makes the browser send the auth cookie. It is set on
 * the instance rather than per call so no request can accidentally skip it.
 */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * An expired or missing session drops the auth state here rather than
 * navigating. ProtectedLayout is already watching that state and sends the
 * person to /login, which keeps routing where the router lives.
 */
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
