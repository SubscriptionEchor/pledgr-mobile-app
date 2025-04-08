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

interface MemberSettings {
  type: string;
  profile: {
    display_name: string;
  };
  security: {
    public_profile: boolean;
  };
  social_media: {
    public_profile_enabled: boolean;
  };
  content_preferences: {
    language: string;
    adult_content: boolean;
  };
  notification_preferences: {
    email: {
      marketing: boolean;
      newsletter: boolean;
      special_offers: boolean;
      comment_replies: boolean;
      creator_updates: boolean;
    };
  };
}

interface MemberResponse {
  data: {
    id: string;
    user_id: string;
    persona_setting_id: string | null;
    type: string;
    settings: MemberSettings;
    created_at: string;
    updated_at: string;
  };
  status: string;
  timestamp: string;
  path: string;
}

export const memberAPI = {
  getCurrentMember: () =>
    fetchAPI<MemberResponse>('/members/current', {
      method: 'GET',
      requiresAuth: true,
    }),

  updateMemberSettings: (settings: Partial<MemberSettings>) =>
    fetchAPI<MemberResponse>('/members/settings', {
      method: 'PATCH',
      data: settings,
      requiresAuth: true,
    }),

  checkCreatorExists: () =>
    fetchAPI<{ data: { exists: boolean; campaignId?: string } }>('/campaigns/check-exists', {
      method: 'POST',
      requiresAuth: true,
    }),
  
  getProfile: () => 
    fetchAPI<User>('/user/profile'),

  updateProfile: (data: UpdateProfileData) =>
    fetchAPI<User>('/user/profile', {
      method: 'PATCH',
      data,
    }),

  changePassword: (data: ChangePasswordData) =>
    fetchAPI('/user/change-password', {
      method: 'POST',
      data,
    }),

  updateNotificationSettings: (settings: Record<string, boolean>) =>
    fetchAPI('/user/notifications', {
      method: 'PATCH',
      data: settings,
    }),

  deleteAccount: () =>
    fetchAPI('/user/account', {
      method: 'DELETE',
    }),
};