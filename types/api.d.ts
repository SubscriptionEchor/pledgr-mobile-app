// Generic API Response types
export interface APIResponse<T = any> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Error types
export interface APIError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

// Common response types
export interface SuccessResponse {
  success: true;
  message: string;
}