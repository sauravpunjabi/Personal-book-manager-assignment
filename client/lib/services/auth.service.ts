import api from '../axios';
import type { AuthResponse } from '@/types/auth';

export async function signup(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/api/auth/signup', {
    name,
    email,
    password,
  });
  return data;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/api/auth/login', { email, password });
  return data;
}

export async function logout(): Promise<void> {
  await api.post('/api/auth/logout');
}

export async function getMe(): Promise<AuthResponse> {
  const { data } = await api.get<AuthResponse>('/api/auth/me');
  return data;
}
