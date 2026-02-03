/**
 * TabBar Component
 * 
 * Custom bottom tab bar with animated icons and badges.
 * Implements haptic feedback and accessibility.
 */

import React, { memo, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  interpolateColor,
} from 'react-native-reanimated';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { useTheme } from '../../hooks/useTheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Tab icons mapping
const TAB_ICONS: Record<string, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
  Home: { active: 'home', inactive: 'home-outline' },
  Explore: { active: 'compass', inactive: 'compass-outline' },
  Notifications: { active: 'notifications', inactive: 'notifications-outline' },
  Profile: { active: 'person', inactive: 'person-outline' },
};

interface TabItemProps {
  route: any;
  index: number;
  state: any;
  descriptors: any;
  navigation: any;
  badgeCount?: number;
}

function TabItem({
  route,
  index,
  state,
  descriptors,
  navigation,
  badgeCount = 0,
}: TabItemProps): React.JSX.Element {
  const { colors } = useTheme();
  const isFocused = state.index === index;
  const scale = useSharedValue(1);
  const progress = useSharedValue(isFocused ? 1 : 0);

  // Update progress when focus changes
  React.useEffect(() => {
    progress.value = withTiming(isFocused ? 1 : 0, { duration: 200 });
  }, [isFocused, progress]);

  const { options } = descriptors[route.key];
  const label = options.tabBarLabel ?? options.title ?? route.name;
  const icons = TAB_ICONS[route.name] || { active: 'ellipse', inactive: 'ellipse-outline' };

  const handlePress = useCallback(() => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      navigation.navigate(route.name);
    }
  }, [isFocused, navigation, route]);

  const handleLongPress = useCallback(() => {
    navigation.emit({
      type: 'tabLongPress',
      target: route.key,
    });
  }, [navigation, route.key]);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  }, [scale]);

  // Animated styles
  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedIconStyle = useAnimatedStyle(() => {
    const translateY = interpolate(progress.value, [0, 1], [0, -2]);
    return {
      transform: [{ translateY }],
    };
  });

  const animatedLabelStyle = useAnimatedStyle(() => {
    const opacity = interpolate(progress.value, [0, 1], [0.6, 1]);
    const color = interpolateColor(
      progress.value,
      [0, 1],
      [colors.textSecondary, colors.primary]
    );
    return {
      opacity,
      color,
    };
  });

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, [0, 1], [0, 1]);
    const opacity = interpolate(progress.value, [0, 1], [0, 1]);
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      onPress={handlePress}
      onLongPress={handleLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.tabItem}
      activeOpacity={1}
    >
      <Animated.View style={[styles.tabContent, animatedContainerStyle]}>
        {/* Active Indicator */}
        <Animated.View
          style={[
            styles.activeIndicator,
            { backgroundColor: `${colors.primary}15` },
            animatedIndicatorStyle,
          ]}
        />

        {/* Icon */}
        <Animated.View style={[styles.iconContainer, animatedIconStyle]}>
          <Ionicons
            name={isFocused ? icons.active : icons.inactive}
            size={24}
            color={isFocused ? colors.primary : colors.textSecondary}
          />
          
          {/* Badge */}
          {badgeCount > 0 && (
            <View style={[styles.badge, { backgroundColor: colors.error }]}>
              <Text style={styles.badgeText}>
                {badgeCount > 99 ? '99+' : badgeCount}
              </Text>
            </View>
          )}
        </Animated.View>

        {/* Label */}
        <Animated.Text
          style={[styles.label, animatedLabelStyle]}
          numberOfLines={1}
        >
          {label}
        </Animated.Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

function TabBarComponent({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps): React.JSX.Element {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  // Get badge counts (could come from a store)
  const getBadgeCount = (routeName: string): number => {
    if (routeName === 'Notifications') {
      return 3; // Replace with actual badge count
    }
    return 0;
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          paddingBottom: Math.max(insets.bottom, 8),
          borderTopColor: colors.border,
        },
      ]}
    >
      {state.routes.map((route, index) => (
        <TabItem
          key={route.key}
          route={route}
          index={index}
          state={state}
          descriptors={descriptors}
          navigation={navigation}
          badgeCount={getBadgeCount(route.name)}
        />
      ))}
    </View>
  );
}

export const TabBar = memo(TabBarComponent);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  tabContent: {
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  activeIndicator: {
    position: 'absolute',
    top: -2,
    width: 64,
    height: 48,
    borderRadius: 24,
  },
  iconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
  },
  label: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    marginTop: 4,
  },
});

export default TabBar;
