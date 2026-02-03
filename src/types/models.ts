/**
 * Model Types
 * 
 * Type definitions for domain models used throughout the application.
 */

/**
 * User model
 */
export interface User {
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
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Auth response
 */
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

/**
 * Login request
 */
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Register request
 */
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

/**
 * Update profile request
 */
export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  bio?: string;
  phone?: string;
  website?: string;
  location?: string;
}

/**
 * User statistics
 */
export interface UserStats {
  postsCount: number;
  followersCount: number;
  followingCount: number;
  likesCount: number;
}

/**
 * Feed item author
 */
export interface FeedItemAuthor {
  id: string;
  name: string;
  username: string;
  avatar?: string;
}

/**
 * Feed item
 */
export interface FeedItem {
  id: string;
  type: 'post' | 'share' | 'activity';
  author: FeedItemAuthor;
  title?: string;
  description: string;
  image?: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked: boolean;
  isSaved: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  hasMore?: boolean;
}

/**
 * Notification
 */
export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'system';
  title: string;
  body: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: Date | string;
}

/**
 * Comment
 */
export interface Comment {
  id: string;
  author: FeedItemAuthor;
  content: string;
  likesCount: number;
  isLiked: boolean;
  replies?: Comment[];
  createdAt: Date | string;
}

/**
 * Search result
 */
export interface SearchResult {
  users: User[];
  posts: FeedItem[];
  tags: string[];
}

export default {
  User: {} as User,
  AuthResponse: {} as AuthResponse,
  FeedItem: {} as FeedItem,
};
