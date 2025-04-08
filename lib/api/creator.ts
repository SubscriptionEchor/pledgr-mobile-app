import { fetchAPI } from './client';
import { CreatorSettings } from '@/hooks/useCreatorSettings';

interface CreatorProfile {
  id: string;
  name: string;
  description: string;
  avatar: string;
  coverImage: string;
  socialLinks: {
    website?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
  stats: {
    followers: number;
    posts: number;
    totalEarnings: number;
  };
}

interface UpdateCreatorProfileData {
  name?: string;
  description?: string;
  avatar?: string;
  coverImage?: string;
  socialLinks?: {
    website?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
}

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  visibility: 'public' | 'members' | 'paid';
}

interface CheckPageUrlResponse {
  data: {
    available: boolean;
  };
  status: string;
  timestamp: string;
  path: string;
}

interface InitializeCampaignResponse {
  data: any;
  status: string;
  timestamp: string;
  path: string;
}

interface CreatorResponse {
  data: CreatorSettings;
  status: string;
  timestamp: string;
  path: string;
}

export const creatorAPI = {
  getCurrentCampaign: () =>
    fetchAPI<CreatorResponse>('/campaigns/me', {
      method: 'GET',
      requiresAuth: true,
    }),

  updateCampaign: (data: Partial<CreatorSettings>) =>
    fetchAPI<CreatorResponse>('/campaigns/me', {
      method: 'PATCH',
      data,
      requiresAuth: true,
    }),

  checkPageUrl: (pageUrl: string) =>
    fetchAPI<CheckPageUrlResponse>('/campaigns/check-page-url', {
      method: 'POST',
      data: { pageUrl },
    }),

  initializeCampaign: (pageUrl: string, pageName: string) =>
    fetchAPI<InitializeCampaignResponse>('/campaigns/initialize', {
      method: 'POST',
      data: { pageUrl, pageName },
    }),

  getProfile: () =>
    fetchAPI<CreatorProfile>('/creator/profile'),

  updateProfile: (data: UpdateCreatorProfileData) =>
    fetchAPI<CreatorProfile>('/creator/profile', {
      method: 'PATCH',
      data,
    }),

  getPosts: (page = 1, limit = 10) =>
    fetchAPI<{ posts: Post[]; total: number }>(`/creator/posts?page=${page}&limit=${limit}`),

  createPost: (data: Omit<Post, 'id' | 'createdAt'>) =>
    fetchAPI<Post>('/creator/posts', {
      method: 'POST',
      data,
    }),

  updatePost: (postId: string, data: Partial<Post>) =>
    fetchAPI<Post>(`/creator/posts/${postId}`, {
      method: 'PATCH',
      data,
    }),

  deletePost: (postId: string) =>
    fetchAPI(`/creator/posts/${postId}`, {
      method: 'DELETE',
    }),

  getAnalytics: (period: 'day' | 'week' | 'month' | 'year') =>
    fetchAPI(`/creator/analytics?period=${period}`),

  getEarnings: (startDate: string, endDate: string) =>
    fetchAPI(`/creator/earnings?startDate=${startDate}&endDate=${endDate}`),
};