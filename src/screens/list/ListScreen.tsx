/**
 * List Screen
 *
 * Displays a searchable, filterable list of items with pull-to-refresh,
 * infinite scrolling, and smooth animations. Supports grid/list toggle.
 */

import React, { useCallback, useMemo, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
  Extrapolate,
  useAnimatedScrollHandler,
  Layout,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../hooks/useTheme';
import { useListViewModel, ListItem, ListFilter } from './ListViewModel';
import { Container } from '../../components/layout/Container';
import { Card } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Loading } from '../../components/ui/Loading';
import { Button } from '../../components/ui/Button';
import { ListItemCard } from './components/ListItemCard';
import { FilterChips } from './components/FilterChips';
import { formatRelativeTime } from '../../utils/formatters';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLUMN_GAP = 12;
const GRID_ITEM_WIDTH = (SCREEN_WIDTH - 16 * 2 - COLUMN_GAP) / 2;

const AnimatedFlatList = Animated.createAnimatedComponent(
  FlatList<ListItem>,
);

type ViewMode = 'list' | 'grid';

export function ListScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { colors, spacing } = useTheme();

  const {
    items,
    isLoading,
    isRefreshing,
    error,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    filters,
    refetch,
    loadMore,
    hasNextPage,
  } = useListViewModel();

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const searchInputRef = useRef<TextInput>(null);
  const scrollY = useSharedValue(0);

  // Scroll handler
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Animated search bar
  const searchBarStyle = useAnimatedStyle(() => {
    const elevation = interpolate(
      scrollY.value,
      [0, 20],
      [0, 4],
      Extrapolate.CLAMP,
    );
    return {
      shadowOpacity: interpolate(elevation, [0, 4], [0, 0.1]),
      shadowRadius: elevation,
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
  const handleItemPress = useCallback(
    (item: ListItem) => {
      navigation.navigate('Details' as never, {
        id: item.id,
        title: item.title,
      } as never);
    },
    [navigation],
  );

  // Toggle view mode
  const toggleViewMode = useCallback(() => {
    setViewMode((prev) => (prev === 'list' ? 'grid' : 'list'));
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    searchInputRef.current?.blur();
  }, [setSearchQuery]);

  // Render list item
  const renderListItem = useCallback(
    ({ item, index }: { item: ListItem; index: number }) => (
      <Animated.View
        entering={FadeInDown.delay(index * 30)
          .duration(350)
          .springify()}
        layout={Layout.springify()}
      >
        <ListItemCard
          item={item}
          onPress={() => handleItemPress(item)}
          viewMode={viewMode}
          style={
            viewMode === 'grid' ? { width: GRID_ITEM_WIDTH } : undefined
          }
        />
      </Animated.View>
    ),
    [handleItemPress, viewMode],
  );

  // Key extractor
  const keyExtractor = useCallback(
    (item: ListItem) => item.id.toString(),
    [],
  );

  // List header
  const ListHeaderComponent = useMemo(
    () => (
      <View style={styles.listHeader}>
        {/* Filter Chips */}
        <FilterChips
          filters={filters}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {/* Results count */}
        <View style={styles.resultsRow}>
          <Text style={[styles.resultsText, { color: colors.textSecondary }]}>
            {items.length} {items.length === 1 ? 'result' : 'results'}
            {searchQuery ? ` for "${searchQuery}"` : ''}
          </Text>
        </View>
      </View>
    ),
    [filters, activeFilter, setActiveFilter, items.length, searchQuery, colors],
  );

  // List footer
  const ListFooterComponent = useMemo(() => {
    if (!isLoadingMore) return <View style={styles.listFooter} />;
    return (
      <View style={styles.loadingMore}>
        <Loading size="small" />
      </View>
    );
  }, [isLoadingMore]);

  // Empty state
  const ListEmptyComponent = useMemo(() => {
    if (isLoading) return null;

    return (
      <View style={styles.emptyContainer}>
        <Ionicons
          name="search-outline"
          size={64}
          color={colors.textTertiary}
        />
        <Text style={[styles.emptyTitle, { color: colors.text }]}>
          {searchQuery ? 'No results found' : 'Nothing here yet'}
        </Text>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          {searchQuery
            ? `Try adjusting your search or filters`
            : 'Items will appear here once added'}
        </Text>
        {searchQuery && (
          <Button
            title="Clear Search"
            onPress={clearSearch}
            variant="outline"
            size="small"
            style={styles.emptyButton}
          />
        )}
      </View>
    );
  }, [isLoading, searchQuery, colors, clearSearch]);

  // Loading state
  if (isLoading && !items.length) {
    return (
      <Container>
        <Loading size="large" text="Loading items..." />
      </Container>
    );
  }

  // Error state
  if (error && !items.length) {
    return (
      <Container>
        <View style={styles.errorContainer}>
          <Ionicons
            name="cloud-offline-outline"
            size={64}
            color={colors.error}
          />
          <Text style={[styles.errorTitle, { color: colors.text }]}>
            Something went wrong
          </Text>
          <Text style={[styles.errorText, { color: colors.textSecondary }]}>
            {error}
          </Text>
          <Button
            title="Try Again"
            onPress={handleRefresh}
            variant="primary"
            style={styles.errorButton}
          />
        </View>
      </Container>
    );
  }

  return (
    <Container edges={['left', 'right']}>
      {/* Search Bar */}
      <Animated.View
        style={[
          styles.searchContainer,
          {
            paddingTop: insets.top + 8,
            backgroundColor: colors.surface,
            borderBottomColor: colors.border,
          },
          searchBarStyle,
        ]}
      >
        <View style={styles.searchRow}>
          <View
            style={[
              styles.searchInputContainer,
              {
                backgroundColor: colors.surfaceVariant,
                borderColor: isSearchFocused ? colors.primary : 'transparent',
                borderWidth: isSearchFocused ? 1.5 : 0,
              },
            ]}
          >
            <Ionicons
              name="search"
              size={20}
              color={isSearchFocused ? colors.primary : colors.textSecondary}
            />
            <TextInput
              ref={searchInputRef}
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search items..."
              placeholderTextColor={colors.placeholder}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              returnKeyType="search"
              autoCorrect={false}
              clearButtonMode="while-editing"
            />
            {searchQuery.length > 0 && Platform.OS !== 'ios' && (
              <TouchableOpacity onPress={clearSearch} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            )}
          </View>

          {/* View mode toggle */}
          <TouchableOpacity
            style={[
              styles.viewToggle,
              { backgroundColor: colors.surfaceVariant },
            ]}
            onPress={toggleViewMode}
            accessibilityLabel={`Switch to ${viewMode === 'list' ? 'grid' : 'list'} view`}
          >
            <Ionicons
              name={viewMode === 'list' ? 'grid-outline' : 'list-outline'}
              size={22}
              color={colors.text}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Content */}
      <AnimatedFlatList
        data={items}
        keyExtractor={keyExtractor}
        renderItem={renderListItem}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        ListEmptyComponent={ListEmptyComponent}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        showsVerticalScrollIndicator={false}
        numColumns={viewMode === 'grid' ? 2 : 1}
        key={viewMode}
        columnWrapperStyle={
          viewMode === 'grid' ? styles.gridRow : undefined
        }
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    paddingVertical: 0,
  },
  viewToggle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
  },
  listHeader: {
    paddingTop: 12,
    marginBottom: 4,
  },
  resultsRow: {
    marginTop: 8,
    marginBottom: 4,
  },
  resultsText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
  },
  gridRow: {
    justifyContent: 'space-between',
  },
  listFooter: {
    height: 20,
  },
  loadingMore: {
    paddingVertical: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyButton: {
    marginTop: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: 24,
  },
  errorButton: {
    minWidth: 140,
  },
});
