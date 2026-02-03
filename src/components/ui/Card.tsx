/**
 * Card Component
 * 
 * Reusable card container with shadow, border radius,
 * and optional press handling.
 */

import React, { memo, useCallback } from 'react';
import {
  StyleSheet,
  View,
  ViewStyle,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { useTheme } from '../../hooks/useTheme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  elevation?: 'none' | 'low' | 'medium' | 'high';
  variant?: 'default' | 'outlined' | 'filled';
  padding?: 'none' | 'small' | 'medium' | 'large';
  borderRadius?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

function CardComponent({
  children,
  style,
  onPress,
  elevation = 'low',
  variant = 'default',
  padding = 'medium',
  borderRadius = 'medium',
  disabled = false,
}: CardProps): React.JSX.Element {
  const { colors, isDark } = useTheme();
  const scale = useSharedValue(1);

  // Get shadow styles based on elevation
  const getShadowStyle = useCallback((): ViewStyle => {
    if (variant === 'outlined' || elevation === 'none') {
      return {};
    }

    const shadowOpacity = isDark ? 0.3 : 0.1;

    switch (elevation) {
      case 'low':
        return Platform.select({
          ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity,
            shadowRadius: 4,
          },
          android: {
            elevation: 2,
          },
        }) as ViewStyle;
      case 'medium':
        return Platform.select({
          ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity,
            shadowRadius: 8,
          },
          android: {
            elevation: 4,
          },
        }) as ViewStyle;
      case 'high':
        return Platform.select({
          ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity,
            shadowRadius: 16,
          },
          android: {
            elevation: 8,
          },
        }) as ViewStyle;
      default:
        return {};
    }
  }, [elevation, variant, isDark]);

  // Get padding based on size
  const getPaddingStyle = useCallback((): ViewStyle => {
    switch (padding) {
      case 'none':
        return { padding: 0 };
      case 'small':
        return { padding: 12 };
      case 'medium':
        return { padding: 16 };
      case 'large':
        return { padding: 24 };
      default:
        return { padding: 16 };
    }
  }, [padding]);

  // Get border radius based on size
  const getBorderRadiusStyle = useCallback((): ViewStyle => {
    switch (borderRadius) {
      case 'small':
        return { borderRadius: 8 };
      case 'medium':
        return { borderRadius: 16 };
      case 'large':
        return { borderRadius: 24 };
      default:
        return { borderRadius: 16 };
    }
  }, [borderRadius]);

  // Get variant styles
  const getVariantStyle = useCallback((): ViewStyle => {
    switch (variant) {
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.border,
        };
      case 'filled':
        return {
          backgroundColor: colors.surfaceVariant,
        };
      default:
        return {
          backgroundColor: colors.surface,
        };
    }
  }, [variant, colors]);

  // Animation handlers
  const handlePressIn = useCallback(() => {
    if (onPress) {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
    }
  }, [onPress, scale]);

  const handlePressOut = useCallback(() => {
    if (onPress) {
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    }
  }, [onPress, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Combined styles
  const cardStyle: ViewStyle = {
    ...styles.card,
    ...getShadowStyle(),
    ...getPaddingStyle(),
    ...getBorderRadiusStyle(),
    ...getVariantStyle(),
  };

  if (onPress) {
    return (
      <AnimatedTouchable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.9}
        style={[cardStyle, animatedStyle, style]}
        accessibilityRole="button"
      >
        {children}
      </AnimatedTouchable>
    );
  }

  return (
    <View style={[cardStyle, style]}>
      {children}
    </View>
  );
}

export const Card = memo(CardComponent);

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
});

export default Card;
