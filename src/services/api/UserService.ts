/**
 * User Service
 * 
 * Handles user-related API calls including profile management,
 * preferences, and user data operations.
 */

import { ApiClient } from './ApiClient';
import {
  User,
  UserStats,
  FeedItem,
  PaginatedResponse,
  UpdateProfileRequest,
} from '../../types/models';

const USER_ENDPOINTS = {
  profile: '/users/profile',
  stats: '/users/stats',
  feed: '/users/feed',
  avatar: '/users/avatar',
  settings: '/users/settings',
  followers: '/users/followers',
  following: '/users/following',
  notifications: '/users/notifications',
  search: '/users/search',
};

export const UserService = {
  /**
   * Get user profile by ID
   */
  async getProfile(userId: string): Promise<User> {
    const response = await ApiClient.get<User>(`${USER_ENDPOINTS.profile}/${userId}`);
    return response;
  },

  /**
   * Get current user's profile
   */
  async getCurrentProfile(): Promise<User> {
    const response = await ApiClient.get<User>(USER_ENDPOINTS.profile);
    return response;
  },

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    const response = await ApiClient.put<User>(USER_ENDPOINTS.profile, data);
    return response;
  },

  /**
   * Get user statistics
   */
  async getStats(userId: string): Promise<UserStats> {
    const response = await ApiClient.get<UserStats>(`${USER_ENDPOINTS.stats}/${userId}`);
    return response;
  },

  /**
   * Get user's feed
   */
  async getFeed(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<FeedItem>> {
    const response = await ApiClient.get<PaginatedResponse<FeedItem>>(
      `${USER_ENDPOINTS.feed}/${userId}`,
      { page, limit }
    );
    return response;
  },

  /**
   * Upload avatar
   */
  async uploadAvatar(imageUri: string): Promise<{ avatarUrl: string }> {
    const formData = new FormData();
    
    // Create file object from URI
    const filename = imageUri.split('/').pop() || 'avatar.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    formData.append('avatar', {
      uri: imageUri,
      name: filename,
      type,
    } as any);

    const response = await ApiClient.upload<{ avatarUrl: string }>(
      USER_ENDPOINTS.avatar,
      formData
    );
    
    return response;
  },

  /**
   * Delete avatar
   */
  async deleteAvatar(): Promise<void> {
    await ApiClient.delete(USER_ENDPOINTS.avatar);
  },

  /**
   * Get user settings
   */
  async getSettings(): Promise<Record<string, any>> {
    const response = await ApiClient.get<Record<string, any>>(USER_ENDPOINTS.settings);
    return response;
  },

  /**
   * Update user settings
   */
  async updateSettings(settings: Record<string, any>): Promise<void> {
    await ApiClient.put(USER_ENDPOINTS.settings, settings);
  },

  /**
   * Get followers list
   */
  async getFollowers(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<User>> {
    const response = await ApiClient.get<PaginatedResponse<User>>(
      `${USER_ENDPOINTS.followers}/${userId}`,
      { page, limit }
    );
    return response;
  },

  /**
   * Get following list
   */
  async getFollowing(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<User>> {
    const response = await ApiClient.get<PaginatedResponse<User>>(
      `${USER_ENDPOINTS.following}/${userId}`,
      { page, limit }
    );
    return response;
  },

  /**
   * Follow a user
   */
  async followUser(userId: string): Promise<void> {
    await ApiClient.post(`${USER_ENDPOINTS.following}/${userId}`);
  },

  /**
   * Unfollow a user
   */
  async unfollowUser(userId: string): Promise<void> {
    await ApiClient.delete(`${USER_ENDPOINTS.following}/${userId}`);
  },

  /**
   * Search users
   */
  async searchUsers(
    query: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<User>> {
    const response = await ApiClient.get<PaginatedResponse<User>>(
      USER_ENDPOINTS.search,
      { q: query, page, limit }
    );
    return response;
  },

  /**
   * Get user notifications
   */
  async getNotifications(
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<any>> {
    const response = await ApiClient.get<PaginatedResponse<any>>(
      USER_ENDPOINTS.notifications,
      { page, limit }
    );
    return response;
  },

  /**
   * Mark notification as read
   */
  async markNotificationRead(notificationId: string): Promise<void> {
    await ApiClient.put(`${USER_ENDPOINTS.notifications}/${notificationId}/read`);
  },

  /**
   * Mark all notifications as read
   */
  async markAllNotificationsRead(): Promise<void> {
    await ApiClient.put(`${USER_ENDPOINTS.notifications}/read-all`);
  },

  /**
   * Delete account
   */
  async deleteAccount(password: string): Promise<void> {
    await ApiClient.post('/users/delete-account', { password });
  },
};

export default UserService;
