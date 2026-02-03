/**
 * Home Screen
 * 
 * Main dashboard screen showing user's feed, recent activity,
 * and quick actions. Implements pull-to-refresh and infinite scroll.
 */

import React, { useCallback, useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  FadeInRight,
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

import { useTheme } from '../../hooks/useTheme';
import { useHomeViewModel } from './HomeViewModel';
import { Container } from '../../components/layout/Container';
import { Header } from '../../components/layout/Header';
import { Card } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Loading } from '../../components/ui/Loading';
import { Button } from '../../components/ui/Button';
import { QuickActions } from './components/QuickActions';
import { FeedCard } from './components/FeedCard';
import { StatsCard } from './components/StatsCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HEADER_MAX_HEIGHT = 200;
const HEADER_MIN_HEIGHT = 100;

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export function HomeScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { colors, spacing, typography } = useTheme();
  
  const {
    user,
    feedItems,
    stats,
    isLoading,
    isRefreshing,
    error,
    refetch,
    loadMore,
    hasNextPage,
  } = useHomeViewModel();

  const scrollY = useSharedValue(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Animated scroll handler
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Animated header styles
  const headerAnimatedStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      Extrapolate.CLAMP
    );

    return {
      height,
    };
  });

  // Animated header content opacity
  const headerContentStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 50],
      [1, 0],
      Extrapolate.CLAMP
    );

    return {
      opacity,
    };
  });

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  // Handle load more
  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !hasNextPage) return;
    
    setIsLoadingMore(true);
    await loadMore();
    setIsLoadingMore(false);
  }, [isLoadingMore, hasNextPage, loadMore]);

  // Handle item press
  const handleItemPress = useCallback((item: any) => {
    navigation.navigate('Details', { id: item.id, title: item.title });
  }, [navigation]);

  // Render feed item
  const renderFeedItem = useCallback(({ item, index }: { item: any; index: number }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 50).duration(400)}
      style={styles.feedItemContainer}
    >
      <FeedCard
        item={item}
        onPress={() => handleItemPress(item)}
      />
    </Animated.View>
  ), [handleItemPress]);

  // Render list header
  const ListHeaderComponent = useMemo(() => (
    <View style={styles.listHeader}>
      {/* Welcome Section */}
      <Animated.View
        entering={FadeInRight.delay(100).duration(500)}
        style={styles.welcomeSection}
      >
        <View style={styles.welcomeRow}>
          <View style={styles.welcomeText}>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>
              Welcome back,
            </Text>
            <Text style={[styles.userName, { color: colors.text }]}>
              {user?.firstName || 'User'}! 👋
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
            accessibilityLabel="Go to profile"
          >
            <Avatar
              source={user?.avatar}
              name={user?.firstName}
              size={56}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Stats Section */}
      <Animated.View
        entering={FadeInDown.delay(200).duration(500)}
        style={styles.statsSection}
      >
        <StatsCard stats={stats} />
      </Animated.View>

      {/* Quick Actions */}
      <Animated.View
        entering={FadeInDown.delay(300).duration(500)}
        style={styles.quickActionsSection}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Quick Actions
        </Text>
        <QuickActions />
      </Animated.View>

      {/* Feed Title */}
      <View style={styles.feedHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Recent Activity
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
          <Text style={[styles.viewAllText, { color: colors.primary }]}>
            View All
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  ), [user, stats, colors, navigation]);

  // Render list footer
  const ListFooterComponent = useMemo(() => {
    if (!isLoadingMore) return null;
    
    return (
      <View style={styles.loadingMore}>
        <Loading size="small" />
      </View>
    );
  }, [isLoadingMore]);

  // Render empty state
  const ListEmptyComponent = useMemo(() => {
    if (isLoading) return null;
    
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyTitle, { color: colors.text }]}>
          No activity yet
        </Text>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          Your recent activity will appear here
        </Text>
        <Button
          title="Explore"
          onPress={() => navigation.navigate('Explore')}
          style={styles.emptyButton}
        />
      </View>
    );
  }, [isLoading, colors, navigation]);

  // Show loading state
  if (isLoading && !feedItems.length) {
    return (
      <Container>
        <Loading size="large" text="Loading your feed..." />
      </Container>
    );
  }

  // Show error state
  if (error && !feedItems.length) {
    return (
      <Container>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorTitle, { color: colors.error }]}>
            Something went wrong
          </Text>
          <Text style={[styles.errorText, { color: colors.textSecondary }]}>
            {error.message}
          </Text>
          <Button
            title="Try Again"
            onPress={handleRefresh}
            variant="outline"
          />
        </View>
      </Container>
    );
  }

  return (
    <Container edges={['left', 'right']}>
      {/* Animated Header */}
      <Animated.View
        style={[
          styles.animatedHeader,
          headerAnimatedStyle,
          { backgroundColor: colors.primary, paddingTop: insets.top },
        ]}
      >
        <Animated.View style={[styles.headerContent, headerContentStyle]}>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <Text style={styles.headerSubtitle}>
            Here's what's happening today
          </Text>
        </Animated.View>
      </Animated.View>

      {/* Main Content */}
      <AnimatedFlatList
        data={feedItems}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={renderFeedItem}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        ListEmptyComponent={ListEmptyComponent}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          { paddingTop: HEADER_MAX_HEIGHT },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
            progressViewOffset={HEADER_MAX_HEIGHT}
          />
        }
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    overflow: 'hidden',
  },
  headerContent: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  listHeader: {
    paddingTop: 20,
  },
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginTop: 4,
  },
  statsSection: {
    marginBottom: 24,
  },
  quickActionsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  feedItemContainer: {
    marginBottom: 16,
  },
  loadingMore: {
    paddingVertical: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyButton: {
    minWidth: 120,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: 20,
  },
});
