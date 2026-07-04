import { supabase } from './supabase';

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) return null;
  return data.session.user;
}

export async function signUp(email: string, password: string, name: string) {
  return fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  }).then((r) => r.json());
}

export async function login(email: string, password: string) {
  return fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  }).then((r) => r.json());
}

export async function logout() {
  return fetch('/api/auth/logout', {
    method: 'POST',
  }).then((r) => r.json());
}

export async function forgotPassword(email: string) {
  return fetch('/api/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  }).then((r) => r.json());
}

export async function resetPassword(password: string, token: string) {
  return fetch('/api/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password, token }),
  }).then((r) => r.json());
}

export async function getMe(token: string) {
  return fetch('/api/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((r) => r.json());
}
