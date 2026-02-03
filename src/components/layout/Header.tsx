/**
 * Header Component
 * 
 * Customizable header with title, back button,
 * and action buttons. Supports animated effects.
 */

import React, { memo, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
  Platform,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  interpolate,
  SharedValue,
  Extrapolate,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../hooks/useTheme';

interface HeaderAction {
  icon?: keyof typeof Ionicons.glyphMap;
  label?: string;
  onPress: () => void;
  disabled?: boolean;
}

interface HeaderProps {
  title?: string;
  subtitle?: string;
  leftAction?: HeaderAction;
  rightAction?: HeaderAction;
  rightActions?: HeaderAction[];
  transparent?: boolean;
  animated?: boolean;
  scrollY?: SharedValue<number>;
  style?: ViewStyle;
}

function HeaderComponent({
  title,
  subtitle,
  leftAction,
  rightAction,
  rightActions = [],
  transparent = false,
  animated = false,
  scrollY,
  style,
}: HeaderProps): React.JSX.Element {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  // Default left action is back button
  const defaultLeftAction: HeaderAction = {
    icon: 'arrow-back',
    onPress: () => navigation.goBack(),
  };

  const left = leftAction ?? (navigation.canGoBack() ? defaultLeftAction : undefined);
  const allRightActions = rightAction ? [rightAction, ...rightActions] : rightActions;

  // Animated header style
  const animatedHeaderStyle = useAnimatedStyle(() => {
    if (!animated || !scrollY) {
      return {};
    }

    const opacity = interpolate(
      scrollY.value,
      [0, 100],
      [0, 1],
      Extrapolate.CLAMP
    );

    return {
      backgroundColor: `rgba(${transparent ? '255, 255, 255' : '255, 255, 255'}, ${opacity})`,
    };
  });

  // Animated title style
  const animatedTitleStyle = useAnimatedStyle(() => {
    if (!animated || !scrollY) {
      return {};
    }

    const opacity = interpolate(
      scrollY.value,
      [50, 100],
      [0, 1],
      Extrapolate.CLAMP
    );

    return {
      opacity,
    };
  });

  const headerStyle: ViewStyle = {
    paddingTop: insets.top + 8,
    paddingBottom: 8,
    backgroundColor: transparent ? 'transparent' : colors.surface,
    borderBottomWidth: transparent ? 0 : StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  };

  const renderAction = (action: HeaderAction, isLeft: boolean = false) => (
    <TouchableOpacity
      style={[styles.actionButton, isLeft ? styles.leftAction : styles.rightAction]}
      onPress={action.onPress}
      disabled={action.disabled}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      accessibilityLabel={action.label || 'Action button'}
    >
      {action.icon && (
        <Ionicons
          name={action.icon}
          size={24}
          color={action.disabled ? colors.textSecondary : colors.text}
        />
      )}
      {action.label && !action.icon && (
        <Text
          style={[
            styles.actionLabel,
            {
              color: action.disabled ? colors.textSecondary : colors.primary,
            },
          ]}
        >
          {action.label}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <Animated.View style={[headerStyle, animatedHeaderStyle, style]}>
      <View style={styles.container}>
        {/* Left Action */}
        <View style={styles.leftContainer}>
          {left && renderAction(left, true)}
        </View>

        {/* Title */}
        <Animated.View style={[styles.titleContainer, animatedTitleStyle]}>
          {title && (
            <Text
              style={[styles.title, { color: colors.text }]}
              numberOfLines={1}
            >
              {title}
            </Text>
          )}
          {subtitle && (
            <Text
              style={[styles.subtitle, { color: colors.textSecondary }]}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          )}
        </Animated.View>

        {/* Right Actions */}
        <View style={styles.rightContainer}>
          {allRightActions.map((action, index) => (
            <View key={index}>
              {renderAction(action)}
            </View>
          ))}
        </View>
      </View>
    </Animated.View>
  );
}

export const Header = memo(HeaderComponent);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    minHeight: 44,
  },
  leftContainer: {
    minWidth: 48,
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightContainer: {
    minWidth: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  title: {
    fontSize: 17,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginTop: 2,
  },
  actionButton: {
    padding: 8,
  },
  leftAction: {
    marginLeft: -4,
  },
  rightAction: {
    marginRight: -4,
  },
  actionLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
});

export default Header;
