/**
 * API Client
 * 
 * Centralized API client with request/response interceptors,
 * automatic token refresh, and error handling.
 */

import { QueryClient } from '@tanstack/react-query';

import { ApiError, ApiResponse, RequestConfig } from '../../types/api';
import { useAuthStore } from '../../store/authSlice';
import { setupInterceptors } from './interceptors';

// Base configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.example.com';
const API_TIMEOUT = 30000;

// Query client instance
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

/**
 * Request interceptor type
 */
type RequestInterceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;

/**
 * Response interceptor type
 */
type ResponseInterceptor = (response: Response) => Response | Promise<Response>;

/**
 * Error interceptor type
 */
type ErrorInterceptor = (error: ApiError) => ApiError | Promise<ApiError>;

class ApiClientClass {
  private baseUrl: string;
  private timeout: number;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];

  constructor(baseUrl: string = API_BASE_URL, timeout: number = API_TIMEOUT) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
    
    // Setup default interceptors
    setupInterceptors(this);
  }

  /**
   * Add request interceptor
   */
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Add response interceptor
   */
  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * Add error interceptor
   */
  addErrorInterceptor(interceptor: ErrorInterceptor): void {
    this.errorInterceptors.push(interceptor);
  }

  /**
   * Apply request interceptors
   */
  private async applyRequestInterceptors(config: RequestConfig): Promise<RequestConfig> {
    let processedConfig = config;
    
    for (const interceptor of this.requestInterceptors) {
      processedConfig = await interceptor(processedConfig);
    }
    
    return processedConfig;
  }

  /**
   * Apply response interceptors
   */
  private async applyResponseInterceptors(response: Response): Promise<Response> {
    let processedResponse = response;
    
    for (const interceptor of this.responseInterceptors) {
      processedResponse = await interceptor(processedResponse);
    }
    
    return processedResponse;
  }

  /**
   * Apply error interceptors
   */
  private async applyErrorInterceptors(error: ApiError): Promise<ApiError> {
    let processedError = error;
    
    for (const interceptor of this.errorInterceptors) {
      processedError = await interceptor(processedError);
    }
    
    return processedError;
  }

  /**
   * Create abort controller with timeout
   */
  private createAbortController(): { controller: AbortController; timeoutId: NodeJS.Timeout } {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    
    return { controller, timeoutId };
  }

  /**
   * Build full URL with query params
   */
  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(endpoint, this.baseUrl);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    
    return url.toString();
  }

  /**
   * Parse response
   */
  private async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      return response.json();
    }
    
    return response.text() as unknown as T;
  }

  /**
   * Handle error response
   */
  private async handleError(response: Response): Promise<never> {
    let errorData: any = {};
    
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText };
    }

    const error: ApiError = {
      status: response.status,
      message: errorData.message || 'An error occurred',
      code: errorData.code,
      errors: errorData.errors,
    };

    const processedError = await this.applyErrorInterceptors(error);
    throw processedError;
  }

  /**
   * Make HTTP request
   */
  async request<T>(
    method: string,
    endpoint: string,
    options: RequestConfig = {}
  ): Promise<T> {
    const { controller, timeoutId } = this.createAbortController();

    try {
      // Build initial config
      let config: RequestConfig = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        signal: controller.signal,
        ...options,
      };

      // Apply request interceptors
      config = await this.applyRequestInterceptors(config);

      // Build URL
      const url = this.buildUrl(endpoint, config.params);

      // Make request
      let response = await fetch(url, {
        method: config.method,
        headers: config.headers,
        body: config.body ? JSON.stringify(config.body) : undefined,
        signal: config.signal,
      });

      // Apply response interceptors
      response = await this.applyResponseInterceptors(response);

      // Handle error responses
      if (!response.ok) {
        await this.handleError(response);
      }

      // Parse and return response
      return this.parseResponse<T>(response);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        const timeoutError: ApiError = {
          status: 408,
          message: 'Request timeout',
          code: 'TIMEOUT',
        };
        throw await this.applyErrorInterceptors(timeoutError);
      }

      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // HTTP method shortcuts
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    return this.request<T>('GET', endpoint, { params });
  }

  async post<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>('POST', endpoint, { body });
  }

  async put<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>('PUT', endpoint, { body });
  }

  async patch<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>('PATCH', endpoint, { body });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>('DELETE', endpoint);
  }

  /**
   * Upload file with multipart form data
   */
  async upload<T>(endpoint: string, formData: FormData): Promise<T> {
    const { controller, timeoutId } = this.createAbortController();

    try {
      const { accessToken } = useAuthStore.getState();
      
      const headers: Record<string, string> = {};
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const response = await fetch(this.buildUrl(endpoint), {
        method: 'POST',
        headers,
        body: formData,
        signal: controller.signal,
      });

      if (!response.ok) {
        await this.handleError(response);
      }

      return this.parseResponse<T>(response);
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

// Export singleton instance
export const ApiClient = new ApiClientClass();

export default ApiClient;
