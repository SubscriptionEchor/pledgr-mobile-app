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