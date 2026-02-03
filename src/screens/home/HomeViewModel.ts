/**
 * Home View Model
 * 
 * Manages state and business logic for the Home screen.
 * Implements data fetching, caching, and pagination.
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';

import { useAuthStore } from '../../store/authSlice';
import { useUserStore } from '../../store/userSlice';
import { UserService } from '../../services/api/UserService';
import { FeedItem, UserStats, User } from '../../types/models';

interface UseHomeViewModelReturn {
  user: User | null;
  feedItems: FeedItem[];
  stats: UserStats | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  loadMore: () => Promise<void>;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

const FEED_PAGE_SIZE = 10;
const STALE_TIME = 5 * 60 * 1000; // 5 minutes
const CACHE_TIME = 30 * 60 * 1000; // 30 minutes

export function useHomeViewModel(): UseHomeViewModelReturn {
  const queryClient = useQueryClient();
  const { user: authUser } = useAuthStore();
  const { profile, setProfile } = useUserStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch user profile
  const {
    data: userData,
    isLoading: isLoadingUser,
    error: userError,
  } = useQuery({
    queryKey: ['user', 'profile', authUser?.id],
    queryFn: () => UserService.getProfile(authUser?.id || ''),
    enabled: !!authUser?.id,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
  });

  // Sync user data to store
  useEffect(() => {
    if (userData) {
      setProfile(userData);
    }
  }, [userData, setProfile]);

  // Fetch user stats
  const {
    data: statsData,
    isLoading: isLoadingStats,
    error: statsError,
  } = useQuery({
    queryKey: ['user', 'stats', authUser?.id],
    queryFn: () => UserService.getStats(authUser?.id || ''),
    enabled: !!authUser?.id,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
  });

  // Fetch feed with infinite scroll
  const {
    data: feedData,
    isLoading: isLoadingFeed,
    error: feedError,
    fetchNextPage,
    hasNextPage = false,
    isFetchingNextPage,
    refetch: refetchFeed,
  } = useInfiniteQuery({
    queryKey: ['feed', authUser?.id],
    queryFn: ({ pageParam = 1 }) => 
      UserService.getFeed(authUser?.id || '', pageParam, FEED_PAGE_SIZE),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.items.length < FEED_PAGE_SIZE) {
        return undefined;
      }
      return allPages.length + 1;
    },
    initialPageParam: 1,
    enabled: !!authUser?.id,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
  });

  // Flatten feed items from all pages
  const feedItems = useMemo(() => {
    if (!feedData?.pages) return [];
    return feedData.pages.flatMap(page => page.items);
  }, [feedData?.pages]);

  // Combined loading state
  const isLoading = isLoadingUser || isLoadingStats || isLoadingFeed;

  // Combined error state
  const error = useMemo(() => {
    return userError || statsError || feedError || null;
  }, [userError, statsError, feedError]);

  // Refetch all data
  const refetch = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['user', 'profile'] }),
        queryClient.invalidateQueries({ queryKey: ['user', 'stats'] }),
        refetchFeed(),
      ]);
    } catch (err) {
      console.error('Error refreshing home data:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [queryClient, refetchFeed]);

  // Load more feed items
  const loadMore = useCallback(async () => {
    if (!hasNextPage || isFetchingNextPage) return;
    
    try {
      await fetchNextPage();
    } catch (err) {
      console.error('Error loading more feed items:', err);
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    user: userData || profile || authUser,
    feedItems,
    stats: statsData || null,
    isLoading,
    isRefreshing,
    error: error as Error | null,
    refetch,
    loadMore,
    hasNextPage,
    isFetchingNextPage,
  };
}

/**
 * Prefetch home data for faster navigation
 */
export function prefetchHomeData(userId: string): void {
  const queryClient = useQueryClient();

  queryClient.prefetchQuery({
    queryKey: ['user', 'profile', userId],
    queryFn: () => UserService.getProfile(userId),
    staleTime: STALE_TIME,
  });

  queryClient.prefetchQuery({
    queryKey: ['user', 'stats', userId],
    queryFn: () => UserService.getStats(userId),
    staleTime: STALE_TIME,
  });

  queryClient.prefetchInfiniteQuery({
    queryKey: ['feed', userId],
    queryFn: ({ pageParam = 1 }) => UserService.getFeed(userId, pageParam, FEED_PAGE_SIZE),
    initialPageParam: 1,
    staleTime: STALE_TIME,
  });
}
