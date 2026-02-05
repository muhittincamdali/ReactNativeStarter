/**
 * Filter Chips Component
 *
 * Horizontally scrollable filter chips with animated selection.
 */

import React, { useCallback, memo, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { useTheme } from '../../../hooks/useTheme';
import { ListFilter } from '../ListViewModel';

interface FilterChipsProps {
  filters: ListFilter[];
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
}

interface ChipProps {
  filter: ListFilter;
  isActive: boolean;
  onPress: () => void;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

function Chip({ filter, isActive, onPress }: ChipProps): React.JSX.Element {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const progress = useSharedValue(isActive ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(isActive ? 1 : 0, { duration: 200 });
  }, [isActive, progress]);

  const containerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ['transparent', colors.primary],
    );
    const borderColor = interpolateColor(
      progress.value,
      [0, 1],
      [colors.border, colors.primary],
    );

    return {
      backgroundColor,
      borderColor,
      transform: [{ scale: scale.value }],
    };
  });

  const textStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      progress.value,
      [0, 1],
      [colors.text, '#FFFFFF'],
    );
    return { color };
  });

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePress = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  }, [onPress]);

  return (
    <AnimatedTouchable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
      style={[styles.chip, containerStyle]}
      accessibilityLabel={`Filter by ${filter.label}`}
      accessibilityState={{ selected: isActive }}
    >
      <Ionicons
        name={filter.icon as any}
        size={16}
        color={isActive ? '#FFFFFF' : colors.textSecondary}
      />
      <Animated.Text style={[styles.chipLabel, textStyle]}>
        {filter.label}
      </Animated.Text>
      {filter.count > 0 && (
        <View
          style={[
            styles.chipCount,
            {
              backgroundColor: isActive
                ? 'rgba(255,255,255,0.25)'
                : colors.surfaceVariant,
            },
          ]}
        >
          <Text
            style={[
              styles.chipCountText,
              { color: isActive ? '#FFFFFF' : colors.textSecondary },
            ]}
          >
            {filter.count}
          </Text>
        </View>
      )}
    </AnimatedTouchable>
  );
}

function FilterChipsComponent({
  filters,
  activeFilter,
  onFilterChange,
}: FilterChipsProps): React.JSX.Element {
  const scrollRef = useRef<ScrollView>(null);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filters.map((filter) => (
          <Chip
            key={filter.id}
            filter={filter}
            isActive={activeFilter === filter.id}
            onPress={() => onFilterChange(filter.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

export const FilterChips = memo(FilterChipsComponent);

const styles = StyleSheet.create({
  container: {
    marginHorizontal: -16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  chipLabel: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
  },
  chipCount: {
    minWidth: 20,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  chipCountText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
  },
});

export default FilterChips;
