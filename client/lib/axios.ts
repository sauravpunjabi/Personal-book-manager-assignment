import axios from 'axios';

/**
 * withCredentials is what makes the browser send the auth cookie. It is set on
 * the instance rather than per call so no request can accidentally skip it.
 */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

export default api;
