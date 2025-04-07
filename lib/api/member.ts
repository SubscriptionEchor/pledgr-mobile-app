import { fetchAPI } from './client';
import { UserRole } from '@/lib/enums';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface UpdateProfileData {
  name?: string;
  email?: string;
  avatar?: string;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

interface CheckCreatorExistsResponse {
  data: {
    exists: boolean;
    campaignId?: string;
  };
  status: string;
  timestamp: string;
  path: string;
}

export const memberAPI = {
  checkCreatorExists: () =>
    fetchAPI<CheckCreatorExistsResponse>('/campaigns/check-exists', {
      method: 'POST',
      requiresAuth: true,
    }),
  
  getProfile: () => 
    fetchAPI<User>('/user/profile'),

  updateProfile: (data: UpdateProfileData) =>
    fetchAPI<User>('/user/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  changePassword: (data: ChangePasswordData) =>
    fetchAPI('/user/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateNotificationSettings: (settings: Record<string, boolean>) =>
    fetchAPI('/user/notifications', {
      method: 'PATCH',
      body: JSON.stringify(settings),
    }),

  deleteAccount: () =>
    fetchAPI('/user/account', {
      method: 'DELETE',
    }),
};