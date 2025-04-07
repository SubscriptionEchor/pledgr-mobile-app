import { fetchAPI } from './client';

interface SignUpResponse {
  message: string;
  data: {
    token: string;
    user: {
      id: string;
      email: string;
    };
  };
}

interface SignInResponse {
  message: string;
  data: {
    token: string;
    user: {
      id: string;
      email: string;
    };
  };
}

interface BaseInfoResponse {
  message: string;
  data: {
    accessTokenMember?: string;
    accessTokenCampaign?: string;
  };
}

interface SignUpCredentials {
  email: string;
  password: string;
}

interface SignInCredentials {
  login: string;
  password: string;
}

export const authAPI = {
  signUp: (credentials: SignUpCredentials) =>
    fetchAPI<SignUpResponse>('/users/register', {
      method: 'POST',
      data: credentials,
      requiresAuth: false,
    }),

  signIn: (credentials: SignInCredentials) =>
    fetchAPI<SignInResponse>('/users/login', {
      method: 'POST',
      data: credentials,
      requiresAuth: false,
    }),

  fetchBaseInfo: () =>
    fetchAPI<BaseInfoResponse>('/users/fetchBaseInfo', {
      method: 'POST',
      requiresAuth: true,
    }),
};