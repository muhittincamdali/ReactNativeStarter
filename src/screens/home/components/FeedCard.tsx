/**
 * Feed Card Component
 * 
 * Displays a single feed item with author info, content, and actions
 */

import React, { useCallback, memo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../../hooks/useTheme';
import { Avatar } from '../../../components/ui/Avatar';
import { Card } from '../../../components/ui/Card';
import { FeedItem } from '../../../types/models';
import { formatRelativeTime } from '../../../utils/formatters';

interface FeedCardProps {
  item: FeedItem;
  onPress?: () => void;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
}

function FeedCardComponent({
  item,
  onPress,
  onLike,
  onComment,
  onShare,
}: FeedCardProps): React.JSX.Element {
  const { colors } = useTheme();
  const likeScale = useSharedValue(1);
  const isLiked = useSharedValue(item.isLiked ? 1 : 0);

  const handleLikePress = useCallback(() => {
    likeScale.value = withSpring(0.8, { damping: 10, stiffness: 400 }, () => {
      likeScale.value = withSpring(1, { damping: 10, stiffness: 400 });
    });
    isLiked.value = isLiked.value === 1 ? 0 : 1;
    onLike?.();
  }, [likeScale, isLiked, onLike]);

  const likeButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: likeScale.value }],
  }));

  const likeIconStyle = useAnimatedStyle(() => {
    const color = interpolate(
      isLiked.value,
      [0, 1],
      [0, 1]
    );
    return {
      color: color === 1 ? '#EC4899' : colors.textSecondary,
    };
  });

  return (
    <Card onPress={onPress} style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.authorInfo}>
          <Avatar
            source={item.author.avatar}
            name={item.author.name}
            size={40}
          />
          <View style={styles.authorDetails}>
            <Text style={[styles.authorName, { color: colors.text }]}>
              {item.author.name}
            </Text>
            <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
              {formatRelativeTime(item.createdAt)}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuButton}
          accessibilityLabel="More options"
        >
          <Ionicons name="ellipsis-horizontal" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {item.title && (
          <Text style={[styles.title, { color: colors.text }]}>
            {item.title}
          </Text>
        )}
        <Text
          style={[styles.description, { color: colors.textSecondary }]}
          numberOfLines={3}
        >
          {item.description}
        </Text>
      </View>

      {/* Image */}
      {item.image && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.image }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      )}

      {/* Stats */}
      <View style={[styles.stats, { borderTopColor: colors.border }]}>
        <Text style={[styles.statsText, { color: colors.textSecondary }]}>
          {item.likesCount} likes • {item.commentsCount} comments
        </Text>
      </View>

      {/* Actions */}
      <View style={[styles.actions, { borderTopColor: colors.border }]}>
        <Pressable
          onPress={handleLikePress}
          style={styles.actionButton}
          accessibilityLabel={item.isLiked ? 'Unlike' : 'Like'}
        >
          <Animated.View style={likeButtonStyle}>
            <Ionicons
              name={item.isLiked ? 'heart' : 'heart-outline'}
              size={22}
              color={item.isLiked ? '#EC4899' : colors.textSecondary}
            />
          </Animated.View>
          <Text style={[styles.actionText, { color: colors.textSecondary }]}>
            Like
          </Text>
        </Pressable>

        <TouchableOpacity
          onPress={onComment}
          style={styles.actionButton}
          accessibilityLabel="Comment"
        >
          <Ionicons name="chatbubble-outline" size={22} color={colors.textSecondary} />
          <Text style={[styles.actionText, { color: colors.textSecondary }]}>
            Comment
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onShare}
          style={styles.actionButton}
          accessibilityLabel="Share"
        >
          <Ionicons name="share-outline" size={22} color={colors.textSecondary} />
          <Text style={[styles.actionText, { color: colors.textSecondary }]}>
            Share
          </Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

export const FeedCard = memo(FeedCardComponent);

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  authorDetails: {
    marginLeft: 10,
    flex: 1,
  },
  authorName: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
  },
  timestamp: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  menuButton: {
    padding: 8,
  },
  content: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  title: {
    fontSize: 17,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 6,
    lineHeight: 22,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  stats: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  statsText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingVertical: 4,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 6,
  },
  actionText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
  },
});
