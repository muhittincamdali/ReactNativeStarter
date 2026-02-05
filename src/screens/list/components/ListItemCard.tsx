/**
 * List Item Card Component
 *
 * Displays a single item in list or grid layout with
 * image, title, metadata, and action buttons.
 */

import React, { useCallback, memo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../../hooks/useTheme';
import { Avatar } from '../../../components/ui/Avatar';
import { Card } from '../../../components/ui/Card';
import { ListItem } from '../ListViewModel';
import { formatRelativeTime, formatCompactNumber } from '../../../utils/formatters';

interface ListItemCardProps {
  item: ListItem;
  onPress?: () => void;
  viewMode?: 'list' | 'grid';
  style?: ViewStyle;
}

function ListItemCardComponent({
  item,
  onPress,
  viewMode = 'list',
  style,
}: ListItemCardProps): React.JSX.Element {
  const { colors } = useTheme();
  const favoriteScale = useSharedValue(1);

  const handleFavoritePress = useCallback(() => {
    favoriteScale.value = withSpring(0.7, { damping: 8, stiffness: 400 }, () => {
      favoriteScale.value = withSpring(1, { damping: 8, stiffness: 400 });
    });
  }, [favoriteScale]);

  const favoriteStyle = useAnimatedStyle(() => ({
    transform: [{ scale: favoriteScale.value }],
  }));

  // Rating stars
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating - fullStars >= 0.5;

    return (
      <View style={styles.ratingRow}>
        {Array.from({ length: 5 }, (_, i) => (
          <Ionicons
            key={i}
            name={
              i < fullStars
                ? 'star'
                : i === fullStars && hasHalf
                  ? 'star-half'
                  : 'star-outline'
            }
            size={12}
            color="#F59E0B"
          />
        ))}
        <Text style={[styles.ratingText, { color: colors.textSecondary }]}>
          {rating.toFixed(1)}
        </Text>
      </View>
    );
  };

  // Grid mode
  if (viewMode === 'grid') {
    return (
      <Card onPress={onPress} style={[styles.gridCard, style]}>
        {/* Image */}
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            style={styles.gridImage}
            resizeMode="cover"
          />
        ) : (
          <View
            style={[
              styles.gridImagePlaceholder,
              { backgroundColor: colors.surfaceVariant },
            ]}
          >
            <Ionicons
              name="image-outline"
              size={32}
              color={colors.textTertiary}
            />
          </View>
        )}

        {/* Content */}
        <View style={styles.gridContent}>
          <Text
            style={[styles.gridCategory, { color: colors.primary }]}
            numberOfLines={1}
          >
            {item.category}
          </Text>
          <Text
            style={[styles.gridTitle, { color: colors.text }]}
            numberOfLines={2}
          >
            {item.title}
          </Text>
          {renderStars(item.rating)}
        </View>
      </Card>
    );
  }

  // List mode
  return (
    <Card onPress={onPress} style={styles.listCard}>
      <View style={styles.listRow}>
        {/* Image / Thumbnail */}
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            style={styles.listImage}
            resizeMode="cover"
          />
        ) : (
          <View
            style={[
              styles.listImagePlaceholder,
              { backgroundColor: colors.surfaceVariant },
            ]}
          >
            <Ionicons
              name="document-text-outline"
              size={24}
              color={colors.textTertiary}
            />
          </View>
        )}

        {/* Content */}
        <View style={styles.listContent}>
          {/* Category badge */}
          <View style={styles.metaRow}>
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: `${colors.primary}12` },
              ]}
            >
              <Text
                style={[styles.categoryText, { color: colors.primary }]}
              >
                {item.category}
              </Text>
            </View>
            <Text
              style={[styles.timeText, { color: colors.textTertiary }]}
            >
              {formatRelativeTime(item.createdAt)}
            </Text>
          </View>

          {/* Title */}
          <Text
            style={[styles.listTitle, { color: colors.text }]}
            numberOfLines={2}
          >
            {item.title}
          </Text>

          {/* Description */}
          <Text
            style={[styles.listDescription, { color: colors.textSecondary }]}
            numberOfLines={2}
          >
            {item.description}
          </Text>

          {/* Footer */}
          <View style={styles.listFooter}>
            {/* Author */}
            <View style={styles.authorRow}>
              <Avatar
                source={item.author.avatar}
                name={item.author.name}
                size={20}
              />
              <Text
                style={[styles.authorName, { color: colors.textSecondary }]}
                numberOfLines={1}
              >
                {item.author.name}
              </Text>
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons
                  name="eye-outline"
                  size={14}
                  color={colors.textTertiary}
                />
                <Text
                  style={[styles.statText, { color: colors.textTertiary }]}
                >
                  {formatCompactNumber(item.viewCount)}
                </Text>
              </View>

              {/* Favorite button */}
              <TouchableOpacity
                onPress={handleFavoritePress}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Animated.View style={favoriteStyle}>
                  <Ionicons
                    name={item.isFavorite ? 'heart' : 'heart-outline'}
                    size={16}
                    color={item.isFavorite ? '#EC4899' : colors.textTertiary}
                  />
                </Animated.View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Card>
  );
}

export const ListItemCard = memo(ListItemCardComponent);

const styles = StyleSheet.create({
  // List styles
  listCard: {
    padding: 0,
    marginBottom: 12,
    overflow: 'hidden',
  },
  listRow: {
    flexDirection: 'row',
  },
  listImage: {
    width: 100,
    height: '100%',
    minHeight: 120,
  },
  listImagePlaceholder: {
    width: 100,
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    flex: 1,
    padding: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
  },
  timeText: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
  },
  listTitle: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    lineHeight: 20,
    marginBottom: 4,
  },
  listDescription: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    lineHeight: 18,
    marginBottom: 8,
  },
  listFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  authorName: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },

  // Grid styles
  gridCard: {
    padding: 0,
    marginBottom: 12,
    overflow: 'hidden',
  },
  gridImage: {
    width: '100%',
    height: 100,
  },
  gridImagePlaceholder: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridContent: {
    padding: 10,
  },
  gridCategory: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  gridTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    lineHeight: 18,
    marginBottom: 6,
  },

  // Shared
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    marginLeft: 4,
  },
});

export default ListItemCard;
