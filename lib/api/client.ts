import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = Platform.select({
  web: 'http://localhost:3000',
  default: 'http://10.0.2.2:3000', // Android emulator localhost
});

interface FetchOptions extends RequestInit {
  requiresAuth?: boolean;
  data?: any;
  method?: string;
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
    // Optionally, clear storage on 401 errors here as well
    if (response.status === 401) {
      try {
        await AsyncStorage.clear();
      } catch (e) {
        console.error('Error clearing storage', e);
      }
    }
    throw new APIError(response.status, data?.message || 'An error occurred');
  }

  return data;
}

async function getAuthHeaders(): Promise<HeadersInit> {
  const token = await AsyncStorage.getItem('@auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchAPI<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  let { requiresAuth = true, method = 'GET', data, ...fetchOptions } = options;
  method = method.toUpperCase();

  // Build the URL based on the method and data provided.
  let url = `${API_URL}${endpoint}`;
  if (method === 'GET' && data && Object.keys(data).length > 0) {
    const queryParams = new URLSearchParams(data).toString();
    url = `${url}${url.includes('?') ? '&' : '?'}${queryParams}`;
  } else if (data && method !== 'GET') {
    // Attach the data as the body. If data is FormData, use it directly.
    fetchOptions.body = data instanceof FormData ? data : JSON.stringify(data);
  }

  // Determine if we need to set the Content-Type header.
  const isFormData = fetchOptions.body instanceof FormData;
  const contentTypeHeader = !isFormData ? { 'Content-Type': 'application/json' } : {};

  const headers: HeadersInit = {
    ...contentTypeHeader,
    'Accept': 'application/json',
    ...(requiresAuth ? await getAuthHeaders() : {}),
    ...fetchOptions.headers,
  };

  try {
    const response = await fetch(url, {
      method,
      headers,
      ...fetchOptions,
    });
    return await handleResponse(response);
  } catch (error: any) {
    // If it's an APIError and status is 401, clear storage.
    if (error instanceof APIError && error.status === 401) {
      try {
        await AsyncStorage.clear();
      } catch (e) {
        console.error('Error clearing storage', e);
      }
    }
    // Rethrow the error to let the caller handle it.
    throw error instanceof APIError ? error : new Error('Network error occurred');
  }
}