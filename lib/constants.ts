import { DeviceTypes } from '@/lib/enums';

export const MOCK_DEVICES = [
  {
    id: '1',
    name: 'MacBook Pro',
    type: DeviceTypes.DESKTOP,
    location: 'San Francisco, US',
    lastActive: 'Active now',
    isCurrentDevice: true,
  },
  {
    id: '2',
    name: 'iPhone 14',
    type: DeviceTypes.MOBILE,
    location: 'San Francisco, US',
    lastActive: '2 hours ago',
    isCurrentDevice: false,
  },
  {
    id: '3',
    name: 'iPad Pro',
    type: DeviceTypes.TABLET,
    location: 'New York, US',
    lastActive: '3 days ago',
    isCurrentDevice: false,
  },
] as const;