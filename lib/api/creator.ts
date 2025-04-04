import { fetchAPI } from './client';

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

export const creatorAPI = {
  getProfile: () =>
    fetchAPI<CreatorProfile>('/creator/profile'),

  updateProfile: (data: UpdateCreatorProfileData) =>
    fetchAPI<CreatorProfile>('/creator/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  getPosts: (page = 1, limit = 10) =>
    fetchAPI<{ posts: Post[]; total: number }>(`/creator/posts?page=${page}&limit=${limit}`),

  createPost: (data: Omit<Post, 'id' | 'createdAt'>) =>
    fetchAPI<Post>('/creator/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updatePost: (postId: string, data: Partial<Post>) =>
    fetchAPI<Post>(`/creator/posts/${postId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
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