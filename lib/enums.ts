export enum SubscriptionStatus {
  SUBSCRIBED = 'subscribed',
  FOLLOWING = 'following'
}

export enum ProfileVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private'
}

export enum NotificationTypes {
  NEW_POSTS = 'newPosts',
  COMMENTS = 'comments',
  LIVE_STREAMS = 'liveStreams',
  CREATOR_UPDATES = 'creatorUpdates'
}

export enum DeviceTypes {
  DESKTOP = 'desktop',
  MOBILE = 'mobile',
  TABLET = 'tablet'
}

export enum UserRole {
  MEMBER = 'member',
  CREATOR = 'creator',
  CREATOR_ASSOCIATE = 'creator_associate'
}

export enum StorageKeys {
  TOKEN = '@auth_token',
  USER = '@user_data',
  REMEMBER_ME = '@remember_me',
  USER_ROLE = '@user_role',
  IS_CREATOR_CREATED = '@is_creator_created',
  BRAND_COLOR = '@brand_color',
  REMEMBER_ME_CREDS = '@remember_me_creds',
  ACCESS_TOKEN_MEMBER = '@access_token_member',
  ACCESS_TOKEN_CAMPAIGN = '@access_token_campaign'
}

export enum SocialPlatforms {
  INSTAGRAM = 'instagram',
  FACEBOOK = 'facebook',
  TWITTER = 'twitter',
  YOUTUBE = 'youtube',
  WEBSITE = 'website'
}

export const PRESET_COLORS = [
  { name: 'Blue', hex: '#1E88E5' },
  { name: 'Red', hex: '#E53935' },
  { name: 'Green', hex: '#43A047' },
  { name: 'Orange', hex: '#FB8C00' },
  { name: 'Light Blue', hex: '#29B6F6' },
  { name: 'Purple', hex: '#8E24AA' },
  { name: 'Pink', hex: '#D81B60' },
  { name: 'Gray', hex: '#546E7A' },
];