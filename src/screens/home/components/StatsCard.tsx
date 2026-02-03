/**
 * Stats Card Component
 * 
 * Displays user statistics in a visually appealing card layout
 */

import React, { memo } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import Animated, { FadeIn, useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { useTheme } from '../../../hooks/useTheme';
import { Card } from '../../../components/ui/Card';
import { UserStats } from '../../../types/models';
import { formatCompactNumber } from '../../../utils/formatters';

interface StatItemProps {
  label: string;
  value: number;
  color: string;
  index: number;
}

function StatItem({ label, value, color, index }: StatItemProps): React.JSX.Element {
  const { colors } = useTheme();

  return (
    <Animated.View
      entering={FadeIn.delay(index * 100).duration(400)}
      style={styles.statItem}
    >
      <Text style={[styles.statValue, { color }]}>
        {formatCompactNumber(value)}
      </Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
        {label}
      </Text>
    </Animated.View>
  );
}

interface StatsCardProps {
  stats: UserStats | null;
}

function StatsCardComponent({ stats }: StatsCardProps): React.JSX.Element {
  const { colors } = useTheme();

  if (!stats) {
    return (
      <Card style={styles.card}>
        <View style={styles.placeholder}>
          <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>
            Loading stats...
          </Text>
        </View>
      </Card>
    );
  }

  const statItems = [
    { label: 'Posts', value: stats.postsCount, color: '#6366F1' },
    { label: 'Followers', value: stats.followersCount, color: '#10B981' },
    { label: 'Following', value: stats.followingCount, color: '#F59E0B' },
    { label: 'Likes', value: stats.likesCount, color: '#EC4899' },
  ];

  return (
    <Card style={styles.card}>
      <View style={styles.statsRow}>
        {statItems.map((item, index) => (
          <StatItem
            key={item.label}
            label={item.label}
            value={item.value}
            color={item.color}
            index={index}
          />
        ))}
      </View>
    </Card>
  );
}

export const StatsCard = memo(StatsCardComponent);

const styles = StyleSheet.create({
  card: {
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  placeholder: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
});

export { StatsCard as default };
