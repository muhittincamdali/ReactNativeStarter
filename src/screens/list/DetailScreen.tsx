/**
 * Detail Screen
 *
 * Displays detailed information about a selected item with
 * hero image, rich content, actions, and related items.
 */

import React, { useCallback, useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Share,
  Platform,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolate,
  withSpring,
} from 'react-native-reanimated';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { useTheme } from '../../hooks/useTheme';
import { Container } from '../../components/layout/Container';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Loading } from '../../components/ui/Loading';
import { formatRelativeTime, formatCompactNumber } from '../../utils/formatters';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const HERO_HEIGHT = 280;

type DetailRouteParams = {
  Detail: {
    id: string;
    title?: string;
  };
};

// Mock detail data
interface DetailData {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  image: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
    followers: number;
  };
  tags: string[];
  rating: number;
  viewCount: number;
  likesCount: number;
  commentsCount: number;
  readTime: number;
  isFavorite: boolean;
  isBookmarked: boolean;
  createdAt: string;
  relatedItems: Array<{
    id: string;
    title: string;
    image: string;
    category: string;
  }>;
}

function getMockDetail(id: string): DetailData {
  return {
    id,
    title: 'Building Scalable React Native Applications with TypeScript',
    description:
      'A comprehensive guide to structuring large-scale mobile apps with modern tooling and best practices.',
    content: `## Introduction

Building scalable mobile applications requires careful consideration of architecture, state management, and developer experience. In this guide, we'll explore proven patterns used by top engineering teams.

## Architecture Patterns

### Clean Architecture
The clean architecture approach separates your app into distinct layers: presentation, domain, and data. This separation ensures testability and maintainability as your codebase grows.

### Feature-Based Structure
Organize code by features rather than technical layers. Each feature folder contains its own screens, components, hooks, and services, making it easy to add, modify, or remove features independently.

## State Management

Zustand provides a lightweight yet powerful state management solution:

- **Minimal boilerplate** — No providers, reducers, or actions
- **TypeScript first** — Full type inference out of the box
- **Middleware support** — Persist, devtools, and custom middleware
- **Selective re-renders** — Only components using changed state re-render

## Data Fetching

React Query (TanStack Query) handles server state management:

- **Automatic caching** — Intelligent background refetching
- **Optimistic updates** — Instant UI feedback with rollback
- **Infinite queries** — Built-in pagination support
- **Offline support** — Pause mutations and resume when online

## Performance Optimization

Key techniques for maintaining 60fps:

1. **Memoization** — Use React.memo, useMemo, and useCallback strategically
2. **List optimization** — FlatList with proper keyExtractor and getItemLayout
3. **Image caching** — Use expo-image or FastImage for efficient loading
4. **Bundle splitting** — Lazy load screens and heavy components
5. **Native animations** — Use Reanimated for thread-safe animations

## Testing Strategy

A balanced testing pyramid:

- **Unit tests** — Validators, formatters, and business logic
- **Integration tests** — Hooks and store interactions
- **Component tests** — UI rendering and user interactions
- **E2E tests** — Critical user flows with Detox or Maestro

## Conclusion

Following these patterns ensures your React Native app remains maintainable, performant, and testable as it scales to millions of users.`,
    category: 'Technology',
    image: `https://picsum.photos/seed/${id}/800/400`,
    author: {
      name: 'Sarah Chen',
      avatar: 'https://i.pravatar.cc/80?img=32',
      bio: 'Senior Mobile Engineer. Building apps that people love.',
      followers: 12400,
    },
    tags: ['react-native', 'typescript', 'architecture', 'mobile', 'performance'],
    rating: 4.8,
    viewCount: 15420,
    likesCount: 843,
    commentsCount: 127,
    readTime: 8,
    isFavorite: false,
    isBookmarked: false,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    relatedItems: [
      {
        id: 'related-1',
        title: 'Advanced TypeScript Patterns',
        image: 'https://picsum.photos/seed/r1/200/120',
        category: 'Technology',
      },
      {
        id: 'related-2',
        title: 'State Management Comparison',
        image: 'https://picsum.photos/seed/r2/200/120',
        category: 'Technology',
      },
      {
        id: 'related-3',
        title: 'Mobile CI/CD Pipeline',
        image: 'https://picsum.photos/seed/r3/200/120',
        category: 'Technology',
      },
    ],
  };
}

export function DetailScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<DetailRouteParams, 'Detail'>>();
  const { colors } = useTheme();

  const { id, title: routeTitle } = route.params || { id: '1' };

  // Simulate loading
  const [isLoading, setIsLoading] = useState(false);
  const detail = useMemo(() => getMockDetail(id), [id]);

  // Animated values
  const scrollY = useSharedValue(0);
  const likeScale = useSharedValue(1);
  const bookmarkScale = useSharedValue(1);
  const [isLiked, setIsLiked] = useState(detail.isFavorite);
  const [isBookmarked, setIsBookmarked] = useState(detail.isBookmarked);

  // Scroll handler
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Animated header
  const headerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [HERO_HEIGHT - 120, HERO_HEIGHT - 60],
      [0, 1],
      Extrapolate.CLAMP,
    );
    return { opacity };
  });

  // Animated hero
  const heroStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [-100, 0],
      [1.3, 1],
      Extrapolate.CLAMP,
    );
    const translateY = interpolate(
      scrollY.value,
      [0, HERO_HEIGHT],
      [0, HERO_HEIGHT * 0.4],
      Extrapolate.CLAMP,
    );
    const opacity = interpolate(
      scrollY.value,
      [0, HERO_HEIGHT * 0.6],
      [1, 0],
      Extrapolate.CLAMP,
    );

    return {
      transform: [{ scale }, { translateY }],
      opacity,
    };
  });

  // Back button style
  const backButtonStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolate(
      scrollY.value,
      [0, HERO_HEIGHT - 120],
      [0.5, 0],
      Extrapolate.CLAMP,
    );
    return {
      backgroundColor: `rgba(0,0,0,${backgroundColor})`,
    };
  });

  // Actions
  const handleLike = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    likeScale.value = withSpring(0.7, { damping: 8 }, () => {
      likeScale.value = withSpring(1);
    });
    setIsLiked((prev) => !prev);
  }, [likeScale]);

  const handleBookmark = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    bookmarkScale.value = withSpring(0.7, { damping: 8 }, () => {
      bookmarkScale.value = withSpring(1);
    });
    setIsBookmarked((prev) => !prev);
  }, [bookmarkScale]);

  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        title: detail.title,
        message: `Check out "${detail.title}" — ${detail.description}`,
        url: `https://app.example.com/details/${detail.id}`,
      });
    } catch (err) {
      console.error('Share error:', err);
    }
  }, [detail]);

  const likeAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: likeScale.value }],
  }));

  const bookmarkAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bookmarkScale.value }],
  }));

  if (isLoading) {
    return (
      <Container>
        <Loading size="large" text="Loading..." />
      </Container>
    );
  }

  // Parse markdown-like content into simple sections
  const contentSections = detail.content
    .split('\n\n')
    .filter((s) => s.trim().length > 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Floating Header */}
      <Animated.View
        style={[
          styles.floatingHeader,
          {
            paddingTop: insets.top,
            backgroundColor: colors.surface,
            borderBottomColor: colors.border,
          },
          headerStyle,
        ]}
      >
        <Text style={[styles.floatingTitle, { color: colors.text }]} numberOfLines={1}>
          {detail.title}
        </Text>
      </Animated.View>

      {/* Back Button */}
      <View style={[styles.backButtonContainer, { top: insets.top + 8 }]}>
        <Animated.View style={[styles.backButton, backButtonStyle]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Content */}
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
      >
        {/* Hero Image */}
        <Animated.View style={[styles.heroContainer, heroStyle]}>
          <Image
            source={{ uri: detail.image }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay} />
          <View style={[styles.heroContent, { paddingBottom: 24 }]}>
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: colors.primary },
              ]}
            >
              <Text style={styles.categoryBadgeText}>{detail.category}</Text>
            </View>
            <Text style={styles.heroReadTime}>
              {detail.readTime} min read
            </Text>
          </View>
        </Animated.View>

        {/* Article Content */}
        <View style={styles.contentContainer}>
          {/* Title */}
          <Animated.View entering={FadeInDown.delay(100).duration(400)}>
            <Text style={[styles.title, { color: colors.text }]}>
              {detail.title}
            </Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {detail.description}
            </Text>
          </Animated.View>

          {/* Author & Meta */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(400)}
            style={[styles.authorSection, { borderColor: colors.border }]}
          >
            <TouchableOpacity style={styles.authorRow}>
              <Avatar
                source={detail.author.avatar}
                name={detail.author.name}
                size={44}
              />
              <View style={styles.authorInfo}>
                <Text style={[styles.authorName, { color: colors.text }]}>
                  {detail.author.name}
                </Text>
                <Text
                  style={[styles.authorMeta, { color: colors.textSecondary }]}
                >
                  {formatCompactNumber(detail.author.followers)} followers •{' '}
                  {formatRelativeTime(detail.createdAt)}
                </Text>
              </View>
              <Button
                title="Follow"
                onPress={() => {}}
                variant="outline"
                size="small"
                fullWidth={false}
              />
            </TouchableOpacity>
          </Animated.View>

          {/* Stats Bar */}
          <Animated.View
            entering={FadeInDown.delay(250).duration(400)}
            style={styles.statsBar}
          >
            <View style={styles.statsGroup}>
              <View style={styles.statBadge}>
                <Ionicons name="eye-outline" size={16} color={colors.textSecondary} />
                <Text style={[styles.statValue, { color: colors.textSecondary }]}>
                  {formatCompactNumber(detail.viewCount)}
                </Text>
              </View>
              <View style={styles.statBadge}>
                <Ionicons name="star" size={16} color="#F59E0B" />
                <Text style={[styles.statValue, { color: colors.textSecondary }]}>
                  {detail.rating}
                </Text>
              </View>
            </View>

            <View style={styles.actionGroup}>
              <TouchableOpacity onPress={handleLike} style={styles.actionBtn}>
                <Animated.View style={likeAnimStyle}>
                  <Ionicons
                    name={isLiked ? 'heart' : 'heart-outline'}
                    size={22}
                    color={isLiked ? '#EC4899' : colors.textSecondary}
                  />
                </Animated.View>
                <Text
                  style={[styles.actionCount, { color: colors.textSecondary }]}
                >
                  {detail.likesCount + (isLiked ? 1 : 0)}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleBookmark} style={styles.actionBtn}>
                <Animated.View style={bookmarkAnimStyle}>
                  <Ionicons
                    name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                    size={22}
                    color={isBookmarked ? colors.primary : colors.textSecondary}
                  />
                </Animated.View>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleShare} style={styles.actionBtn}>
                <Ionicons
                  name="share-outline"
                  size={22}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Content Body */}
          <Animated.View
            entering={FadeInDown.delay(300).duration(400)}
            style={styles.articleBody}
          >
            {contentSections.map((section, index) => {
              const isHeading = section.startsWith('##');
              const isSubheading = section.startsWith('###');
              const isList = section.includes('\n1.');
              const cleanText = section
                .replace(/^#{1,3}\s/, '')
                .replace(/\*\*(.*?)\*\*/g, '$1')
                .replace(/`(.*?)`/g, '$1');

              if (isSubheading) {
                return (
                  <Text
                    key={index}
                    style={[styles.subheading, { color: colors.text }]}
                  >
                    {cleanText}
                  </Text>
                );
              }
              if (isHeading) {
                return (
                  <Text
                    key={index}
                    style={[styles.heading, { color: colors.text }]}
                  >
                    {cleanText}
                  </Text>
                );
              }

              // Handle list items
              const lines = cleanText.split('\n');
              if (lines.some((l) => /^\d+\./.test(l.trim()) || /^-\s/.test(l.trim()))) {
                return (
                  <View key={index} style={styles.listBlock}>
                    {lines
                      .filter((l) => l.trim().length > 0)
                      .map((line, li) => {
                        const bulletText = line
                          .replace(/^\d+\.\s/, '')
                          .replace(/^-\s/, '')
                          .trim();
                        if (!bulletText) return null;
                        return (
                          <View key={li} style={styles.listItem}>
                            <Text style={[styles.listBullet, { color: colors.primary }]}>
                              •
                            </Text>
                            <Text
                              style={[styles.listItemText, { color: colors.text }]}
                            >
                              {bulletText}
                            </Text>
                          </View>
                        );
                      })}
                  </View>
                );
              }

              return (
                <Text
                  key={index}
                  style={[styles.paragraph, { color: colors.text }]}
                >
                  {cleanText}
                </Text>
              );
            })}
          </Animated.View>

          {/* Tags */}
          <Animated.View
            entering={FadeIn.delay(400).duration(400)}
            style={styles.tagsSection}
          >
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
              Tags
            </Text>
            <View style={styles.tagsRow}>
              {detail.tags.map((tag) => (
                <View
                  key={tag}
                  style={[
                    styles.tagChip,
                    { backgroundColor: colors.surfaceVariant },
                  ]}
                >
                  <Text style={[styles.tagText, { color: colors.textSecondary }]}>
                    #{tag}
                  </Text>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* Related Items */}
          <Animated.View
            entering={FadeIn.delay(500).duration(400)}
            style={styles.relatedSection}
          >
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Related Articles
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.relatedScroll}
            >
              {detail.relatedItems.map((item) => (
                <Card
                  key={item.id}
                  onPress={() =>
                    navigation.navigate('Details' as never, {
                      id: item.id,
                      title: item.title,
                    } as never)
                  }
                  style={styles.relatedCard}
                >
                  <Image
                    source={{ uri: item.image }}
                    style={styles.relatedImage}
                    resizeMode="cover"
                  />
                  <View style={styles.relatedContent}>
                    <Text
                      style={[
                        styles.relatedCategory,
                        { color: colors.primary },
                      ]}
                    >
                      {item.category}
                    </Text>
                    <Text
                      style={[styles.relatedTitle, { color: colors.text }]}
                      numberOfLines={2}
                    >
                      {item.title}
                    </Text>
                  </View>
                </Card>
              ))}
            </ScrollView>
          </Animated.View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    paddingHorizontal: 56,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  floatingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  backButtonContainer: {
    position: 'absolute',
    left: 16,
    zIndex: 200,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContainer: {
    height: HERO_HEIGHT,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  heroReadTime: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255,255,255,0.9)',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    lineHeight: 32,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
    marginBottom: 20,
  },
  authorSection: {
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 16,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
  },
  authorName: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
  },
  authorMeta: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  statsGroup: {
    flexDirection: 'row',
    gap: 16,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
  },
  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionCount: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
  },
  articleBody: {
    marginBottom: 24,
  },
  heading: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    lineHeight: 30,
    marginTop: 24,
    marginBottom: 12,
  },
  subheading: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    lineHeight: 26,
    marginTop: 20,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 26,
    marginBottom: 16,
  },
  listBlock: {
    marginBottom: 16,
    paddingLeft: 4,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  listBullet: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginRight: 10,
    marginTop: 2,
  },
  listItemText: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
  },
  tagsSection: {
    marginBottom: 28,
  },
  sectionLabel: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
  },
  relatedSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 14,
  },
  relatedScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
    gap: 12,
  },
  relatedCard: {
    width: 180,
    padding: 0,
    overflow: 'hidden',
  },
  relatedImage: {
    width: '100%',
    height: 100,
  },
  relatedContent: {
    padding: 10,
  },
  relatedCategory: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  relatedTitle: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    lineHeight: 18,
  },
});
