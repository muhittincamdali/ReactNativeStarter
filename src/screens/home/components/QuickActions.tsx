/**
 * Quick Actions Component
 * 
 * Grid of quick action buttons for common tasks
 */

import React, { useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Animated, { FadeInRight, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../../hooks/useTheme';

interface QuickAction {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  route?: string;
  onPress?: () => void;
}

const quickActions: QuickAction[] = [
  {
    id: 'search',
    title: 'Search',
    icon: 'search-outline',
    color: '#6366F1',
    route: 'Search',
  },
  {
    id: 'favorites',
    title: 'Favorites',
    icon: 'heart-outline',
    color: '#EC4899',
    route: 'Favorites',
  },
  {
    id: 'messages',
    title: 'Messages',
    icon: 'chatbubble-outline',
    color: '#10B981',
    route: 'Messages',
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: 'settings-outline',
    color: '#F59E0B',
    route: 'Settings',
  },
];

interface QuickActionButtonProps {
  action: QuickAction;
  index: number;
  onPress: (action: QuickAction) => void;
}

function QuickActionButton({ action, index, onPress }: QuickActionButtonProps): React.JSX.Element {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  }, [scale]);

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 100).duration(400)}
      style={styles.actionWrapper}
    >
      <TouchableOpacity
        onPress={() => onPress(action)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        accessibilityLabel={action.title}
        accessibilityRole="button"
      >
        <Animated.View style={[styles.actionButton, animatedStyle]}>
          <View style={[styles.iconContainer, { backgroundColor: `${action.color}15` }]}>
            <Ionicons name={action.icon} size={24} color={action.color} />
          </View>
          <Text style={[styles.actionTitle, { color: colors.text }]} numberOfLines={1}>
            {action.title}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export function QuickActions(): React.JSX.Element {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const handleActionPress = useCallback((action: QuickAction) => {
    if (action.onPress) {
      action.onPress();
    } else if (action.route) {
      navigation.navigate(action.route as never);
    }
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {quickActions.map((action, index) => (
          <QuickActionButton
            key={action.id}
            action={action}
            index={index}
            onPress={handleActionPress}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: -16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  actionWrapper: {
    marginRight: 4,
  },
  actionButton: {
    alignItems: 'center',
    width: 80,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
});
