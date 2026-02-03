/**
 * Button Component
 * 
 * Customizable button with multiple variants, sizes, and states.
 * Supports loading state, icons, and haptic feedback.
 */

import React, { useCallback, memo } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  View,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { useTheme } from '../../hooks/useTheme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  haptic?: boolean;
  accessibilityLabel?: string;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

function ButtonComponent({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = true,
  style,
  textStyle,
  haptic = true,
  accessibilityLabel,
}: ButtonProps): React.JSX.Element {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  // Get variant styles
  const getVariantStyles = useCallback(() => {
    const isDisabled = disabled || loading;

    switch (variant) {
      case 'primary':
        return {
          backgroundColor: isDisabled ? `${colors.primary}50` : colors.primary,
          borderColor: 'transparent',
          textColor: '#FFFFFF',
        };
      case 'secondary':
        return {
          backgroundColor: isDisabled ? `${colors.secondary}50` : colors.secondary,
          borderColor: 'transparent',
          textColor: colors.text,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: isDisabled ? `${colors.border}50` : colors.border,
          textColor: isDisabled ? colors.textSecondary : colors.text,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          textColor: isDisabled ? colors.textSecondary : colors.primary,
        };
      case 'danger':
        return {
          backgroundColor: isDisabled ? `${colors.error}50` : colors.error,
          borderColor: 'transparent',
          textColor: '#FFFFFF',
        };
      default:
        return {
          backgroundColor: colors.primary,
          borderColor: 'transparent',
          textColor: '#FFFFFF',
        };
    }
  }, [variant, disabled, loading, colors]);

  // Get size styles
  const getSizeStyles = useCallback(() => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 8,
          paddingHorizontal: 16,
          fontSize: 14,
          iconSize: 16,
          borderRadius: 8,
        };
      case 'medium':
        return {
          paddingVertical: 12,
          paddingHorizontal: 20,
          fontSize: 16,
          iconSize: 18,
          borderRadius: 12,
        };
      case 'large':
        return {
          paddingVertical: 16,
          paddingHorizontal: 24,
          fontSize: 18,
          iconSize: 20,
          borderRadius: 14,
        };
      default:
        return {
          paddingVertical: 12,
          paddingHorizontal: 20,
          fontSize: 16,
          iconSize: 18,
          borderRadius: 12,
        };
    }
  }, [size]);

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  // Animated style for press feedback
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePress = useCallback(() => {
    if (disabled || loading) return;

    if (haptic && Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    onPress();
  }, [disabled, loading, haptic, onPress]);

  // Button container styles
  const containerStyle: ViewStyle = {
    ...styles.container,
    backgroundColor: variantStyles.backgroundColor,
    borderColor: variantStyles.borderColor,
    borderWidth: variant === 'outline' ? 1.5 : 0,
    paddingVertical: sizeStyles.paddingVertical,
    paddingHorizontal: sizeStyles.paddingHorizontal,
    borderRadius: sizeStyles.borderRadius,
    width: fullWidth ? '100%' : undefined,
    opacity: disabled || loading ? 0.7 : 1,
  };

  // Text styles
  const buttonTextStyle: TextStyle = {
    ...styles.text,
    color: variantStyles.textColor,
    fontSize: sizeStyles.fontSize,
  };

  // Icon component
  const IconComponent = icon && !loading ? (
    <Ionicons
      name={icon}
      size={sizeStyles.iconSize}
      color={variantStyles.textColor}
      style={iconPosition === 'left' ? styles.iconLeft : styles.iconRight}
    />
  ) : null;

  return (
    <AnimatedTouchable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={0.9}
      style={[containerStyle, animatedStyle, style]}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={variantStyles.textColor}
            style={styles.loader}
          />
        ) : (
          <>
            {iconPosition === 'left' && IconComponent}
            <Text style={[buttonTextStyle, textStyle]} numberOfLines={1}>
              {title}
            </Text>
            {iconPosition === 'right' && IconComponent}
          </>
        )}
      </View>
    </AnimatedTouchable>
  );
}

export const Button = memo(ButtonComponent);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  loader: {
    marginVertical: 2,
  },
});

export default Button;
