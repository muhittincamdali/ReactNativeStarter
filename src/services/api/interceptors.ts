/**
 * API Interceptors
 * 
 * Request and response interceptors for the API client.
 * Handles authentication tokens, error handling, and logging.
 */

import { useAuthStore } from '../../store/authSlice';
import { ApiError, RequestConfig } from '../../types/api';

/**
 * Setup interceptors for the API client
 */
export function setupInterceptors(apiClient: any): void {
  // Request interceptor: Add auth token
  apiClient.addRequestInterceptor(async (config: RequestConfig) => {
    const { accessToken } = useAuthStore.getState();

    if (accessToken) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`,
      };
    }

    // Add request timestamp for debugging
    if (__DEV__) {
      config.headers = {
        ...config.headers,
        'X-Request-Time': new Date().toISOString(),
      };
    }

    return config;
  });

  // Request interceptor: Log requests in development
  if (__DEV__) {
    apiClient.addRequestInterceptor(async (config: RequestConfig) => {
      console.log(`🌐 [API] ${config.method} ${config.url || ''}`, {
        headers: config.headers,
        body: config.body,
      });
      return config;
    });
  }

  // Response interceptor: Log responses in development
  if (__DEV__) {
    apiClient.addResponseInterceptor(async (response: Response) => {
      console.log(`✅ [API] ${response.status} ${response.url}`);
      return response;
    });
  }

  // Error interceptor: Handle common errors
  apiClient.addErrorInterceptor(async (error: ApiError) => {
    // Log error in development
    if (__DEV__) {
      console.error(`❌ [API] Error ${error.status}:`, error.message);
    }

    // Handle specific error cases
    switch (error.status) {
      case 401:
        // Unauthorized - token expired or invalid
        handleUnauthorizedError(error);
        break;

      case 403:
        // Forbidden - user doesn't have permission
        error.message = 'You do not have permission to perform this action';
        break;

      case 404:
        // Not found
        error.message = error.message || 'Resource not found';
        break;

      case 422:
        // Validation error
        error.message = error.message || 'Validation failed';
        break;

      case 429:
        // Rate limited
        error.message = 'Too many requests. Please try again later.';
        break;

      case 500:
      case 502:
      case 503:
        // Server error
        error.message = 'Server error. Please try again later.';
        break;

      default:
        error.message = error.message || 'An unexpected error occurred';
    }

    return error;
  });
}

/**
 * Handle 401 Unauthorized errors
 */
function handleUnauthorizedError(error: ApiError): void {
  const { clearAuth, refreshToken } = useAuthStore.getState();

  // If we have a refresh token, the auth refresh should be handled
  // by the auth hook. If not, clear auth state.
  if (!refreshToken) {
    clearAuth();
    error.message = 'Session expired. Please sign in again.';
  }
}

/**
 * Create a retry interceptor
 */
export function createRetryInterceptor(maxRetries: number = 3, retryDelay: number = 1000) {
  let retryCount = 0;

  return async (error: ApiError): Promise<ApiError> => {
    // Only retry on specific errors
    const shouldRetry = [408, 500, 502, 503, 504].includes(error.status);

    if (shouldRetry && retryCount < maxRetries) {
      retryCount++;
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, retryDelay * retryCount));
      
      // The actual retry logic would need to be implemented in the API client
      // This interceptor just tracks retry attempts
      error.retryAttempt = retryCount;
    } else {
      retryCount = 0;
    }

    return error;
  };
}

/**
 * Create a logging interceptor
 */
export function createLoggingInterceptor(options: {
  logRequests?: boolean;
  logResponses?: boolean;
  logErrors?: boolean;
} = {}) {
  const { logRequests = true, logResponses = true, logErrors = true } = options;

  return {
    request: async (config: RequestConfig): Promise<RequestConfig> => {
      if (logRequests) {
        console.log('[API Request]', {
          method: config.method,
          url: config.url,
          body: config.body,
        });
      }
      return config;
    },

    response: async (response: Response): Promise<Response> => {
      if (logResponses) {
        console.log('[API Response]', {
          status: response.status,
          url: response.url,
        });
      }
      return response;
    },

    error: async (error: ApiError): Promise<ApiError> => {
      if (logErrors) {
        console.error('[API Error]', {
          status: error.status,
          message: error.message,
          code: error.code,
        });
      }
      return error;
    },
  };
}

export default setupInterceptors;
