/**
 * API Types
 * 
 * Type definitions for API requests, responses, and errors.
 */

/**
 * API Error
 */
export interface ApiError {
  status: number;
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
  retryAttempt?: number;
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  meta?: ApiMeta;
}

/**
 * API Meta for paginated responses
 */
export interface ApiMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

/**
 * Request config
 */
export interface RequestConfig {
  method?: string;
  url?: string;
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, any>;
  signal?: AbortSignal;
}

/**
 * Paginated response
 */
export interface PaginatedApiResponse<T> {
  items: T[];
  meta: ApiMeta;
}

/**
 * List query params
 */
export interface ListQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, any>;
}

/**
 * Auth request types
 */
export interface LoginRequestBody {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequestBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface RefreshTokenRequestBody {
  refreshToken: string;
}

export interface ResetPasswordRequestBody {
  email: string;
}

export interface ConfirmResetPasswordRequestBody {
  token: string;
  password: string;
}

/**
 * Auth response types
 */
export interface AuthResponseData {
  user: UserData;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

/**
 * User data from API
 */
export interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username?: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  website?: string;
  location?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Update profile request
 */
export interface UpdateProfileRequestBody {
  firstName?: string;
  lastName?: string;
  username?: string;
  bio?: string;
  phone?: string;
  website?: string;
  location?: string;
}

/**
 * Upload response
 */
export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

export default {
  // Export types as empty objects for runtime use
  ApiError: {} as ApiError,
  ApiResponse: {} as ApiResponse<unknown>,
  RequestConfig: {} as RequestConfig,
};
