import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKeys, UserRole } from '@/lib/enums';

const API_URL = 'https://dev-core-api.divinitydelights.com/api';

interface FetchOptions extends RequestInit {
  requiresAuth?: boolean;
  data?: any;
}

class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

async function handleResponse(response: Response) {
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    throw new APIError(response.status, data?.message || 'An error occurred');
  }

  console.log(data, "API response");
  return data;
}

export async function fetchAPI<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { requiresAuth = true, data, ...fetchOptions } = options;

  // Build headers
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...fetchOptions.headers,
  };

  // Add auth token if required
  if (requiresAuth) {
    const token = await AsyncStorage.getItem(StorageKeys.TOKEN);
    if (!token) {
      throw new Error('Authentication required');
    }
    headers['Authorization'] = `Bearer ${token}`;

    const personaRole = await AsyncStorage.getItem(StorageKeys.USER_ROLE);
    if (personaRole) {
      headers['personatype'] = personaRole;

      if (personaRole === UserRole.MEMBER) {
        const memberToken = await AsyncStorage.getItem(StorageKeys.ACCESS_TOKEN_MEMBER);
        if (memberToken) {
          headers['persona_auth'] = `Bearer ${memberToken}`;
        }
      }
      if (personaRole === UserRole.CREATOR) {
        headers['personatype'] = 'campaign';
        const creatorToken = await AsyncStorage.getItem(StorageKeys.ACCESS_TOKEN_CAMPAIGN);
        if (creatorToken) {
          headers['persona_auth'] = `Bearer ${creatorToken}`;
        }
      }
    }
    
  }

  const config: RequestInit = {
    ...fetchOptions,
    headers,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    return await handleResponse(response);
    
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new Error('Network error occurred');
  }
}