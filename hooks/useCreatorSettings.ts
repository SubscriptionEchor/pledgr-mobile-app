import { useState } from 'react';
import { useUserContext } from '@/lib/context/UserContext';
import { creatorAPI } from '@/lib/api/creator';
import { showToast } from '@/components/Toast';

export interface CreatorSettings {
  campaign_details: {
    id: string;
    user_id: string;
    role_id: string;
    campaign_settings: {
      page_name: string;
      page_categories: string[];
      profile_photo: {
        media_id: string;
      };
      cover_photo: {
        media_id: string;
      };
      brand_color: {
        hex_code: string;
      };
      about_page: {
        description_blob_id: string;
      };
      visibility_settings: {
        earnings_visibility: 'private' | 'public';
        membership_details_visibility: 'private' | 'public';
        membership_options: 'all' | 'paid';
        comment_access: 'enabled' | 'disabled';
        adult_content: boolean;
      };
      legal_info: {
        first_name: string;
        surname: string;
        country_of_residence: string;
      };
      welcome_notes: {
        use_unified_welcome: boolean;
        default_welcome_message: {
          message: string;
          intro_video_url: string;
        };
      };
      featured_tags: {
        tags: string[];
      };
    };
    owner_settings: {
      notification_preferences: {
        email: {
          receive_email_on_post: boolean;
          receive_email_on_comments: boolean;
          receive_email_on_direct_message: boolean;
          receive_email_on_new_paid_member: boolean;
          receive_email_on_shop_purchases: boolean;
          receive_email_on_reminder_to_share: boolean;
        };
        notification_feed: {
          receive_notification_on_likes: boolean;
          receive_notification_on_comments: boolean;
          receive_notification_on_chat_messages: boolean;
          receive_notification_on_new_free_members: boolean;
          receive_notification_on_new_paid_members: boolean;
          receive_notification_on_upgraded_members: boolean;
          receive_notification_on_downgraded_members: boolean;
          receive_notification_on_cancelled_members: boolean;
        };
      };
      marketing_preferences: {
        receive_marketing_emails: boolean;
      };
      published: boolean;
      shop_visibility: boolean;
      published_at: string | null;
      unpublished_at: string | null;
    };
    page_url: string;
    created_at: string;
    updated_at: string;
  };
  rich_blobs: Array<{
    id: string;
    content_blob: string;
    parent_id: string;
    parent_type: string;
  }>;
}

export function useCreatorSettings() {
  const { creatorSettings, setCreatorSettings } = useUserContext();
  const [isLoading, setIsLoading] = useState(false);

  const fetchCreatorSettings = async () => {
    if (creatorSettings) return; // Don't fetch if we already have settings

    setIsLoading(true);
    try {
      const response = await creatorAPI.getCurrentCampaign();
      setCreatorSettings(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching creator settings:', error);
      showToast.error('Failed to load settings', 'Please try again later');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCreatorSettings = async (newSettings: Partial<CreatorSettings>) => {
    if (!creatorSettings) return;

    setIsLoading(true);
    try {
      const response = await creatorAPI.updateCampaign(newSettings);
      setCreatorSettings(response.data);
      showToast.success('Settings updated', 'Your changes have been saved');
      return response.data;
    } catch (error) {
      console.error('Error updating creator settings:', error);
      showToast.error('Failed to update settings', 'Please try again later');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCreatorNotifications = async (notificationSettings: {
    notification_preferences: {
    email?: Record<string, boolean>;
    notification_feed?: Record<string, boolean>;
  };
  marketing_preferences: {
    receive_marketing_emails: boolean;
  };
  published: boolean;
  shop_visibility: boolean;
  }) => {
    if (!creatorSettings) return;

    setIsLoading(true);
    try {
      const response = await creatorAPI.updateCampaignSettings(notificationSettings);
      setCreatorSettings(response.data);
      showToast.success('Notification settings updated', 'Your changes have been saved');
      return response.data;
    } catch (error) {
      console.error('Error updating creator notification settings:', error);
      showToast.error('Failed to update notification settings', 'Please try again later');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    creatorSettings,
    isLoading,
    fetchCreatorSettings,
    updateCreatorSettings,
    updateCreatorNotifications
  };
}