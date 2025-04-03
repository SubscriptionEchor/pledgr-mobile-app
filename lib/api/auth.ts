import { fetchAPI } from './client';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

interface SignUpCredentials extends LoginCredentials {
  name: string;
}

export const authAPI = {
  login: (credentials: LoginCredentials) =>
    fetchAPI<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      requiresAuth: false,
    }),

  signUp: (credentials: SignUpCredentials) =>
    fetchAPI<LoginResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(credentials),
      requiresAuth: false,
    }),

  forgotPassword: (email: string) =>
    fetchAPI('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
      requiresAuth: false,
    }),

  resetPassword: (token: string, password: string) =>
    fetchAPI('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
      requiresAuth: false,
    }),

  verifyEmail: (token: string) =>
    fetchAPI('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
      requiresAuth: false,
    }),
};