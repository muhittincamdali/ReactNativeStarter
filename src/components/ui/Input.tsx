/**
 * Input Component
 * 
 * Customizable text input with label, icons, error state,
 * and animated focus effects.
 */

import React, { useState, useCallback, useRef, forwardRef, memo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  ViewStyle,
  Platform,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../hooks/useTheme';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  disabled?: boolean;
  required?: boolean;
}

const AnimatedView = Animated.createAnimatedComponent(View);

const InputComponent = forwardRef<TextInput, InputProps>(({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  disabled = false,
  required = false,
  ...textInputProps
}, ref) => {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const focusAnimation = useSharedValue(0);
  const internalRef = useRef<TextInput>(null);

  // Determine the ref to use
  const inputRef = (ref || internalRef) as React.RefObject<TextInput>;

  // Handle focus
  const handleFocus = useCallback((e: any) => {
    setIsFocused(true);
    focusAnimation.value = withTiming(1, { duration: 200 });
    textInputProps.onFocus?.(e);
  }, [focusAnimation, textInputProps]);

  // Handle blur
  const handleBlur = useCallback((e: any) => {
    setIsFocused(false);
    focusAnimation.value = withTiming(0, { duration: 200 });
    textInputProps.onBlur?.(e);
  }, [focusAnimation, textInputProps]);

  // Animated border style
  const containerAnimatedStyle = useAnimatedStyle(() => {
    const borderColor = error
      ? colors.error
      : interpolateColor(
          focusAnimation.value,
          [0, 1],
          [colors.border, colors.primary]
        );

    return {
      borderColor,
      borderWidth: focusAnimation.value === 1 ? 2 : 1,
    };
  });

  // Animated label style
  const labelAnimatedStyle = useAnimatedStyle(() => {
    const labelColor = error
      ? colors.error
      : interpolateColor(
          focusAnimation.value,
          [0, 1],
          [colors.textSecondary, colors.primary]
        );

    return {
      color: labelColor,
    };
  });

  // Get icon color
  const getIconColor = () => {
    if (error) return colors.error;
    if (isFocused) return colors.primary;
    return colors.textSecondary;
  };

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {/* Label */}
      {label && (
        <Animated.Text style={[styles.label, labelAnimatedStyle]}>
          {label}
          {required && <Text style={{ color: colors.error }}> *</Text>}
        </Animated.Text>
      )}

      {/* Input Container */}
      <AnimatedView
        style={[
          styles.container,
          {
            backgroundColor: disabled ? colors.border + '20' : colors.surface,
          },
          containerAnimatedStyle,
        ]}
      >
        {/* Left Icon */}
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            <Ionicons name={leftIcon} size={20} color={getIconColor()} />
          </View>
        )}

        {/* Text Input */}
        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            {
              color: colors.text,
              paddingLeft: leftIcon ? 0 : 16,
              paddingRight: rightIcon ? 0 : 16,
            },
            textInputProps.multiline && styles.multilineInput,
          ]}
          placeholderTextColor={colors.textSecondary}
          editable={!disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          selectionColor={colors.primary}
          {...textInputProps}
        />

        {/* Right Icon */}
        {rightIcon && (
          <TouchableOpacity
            style={styles.rightIconContainer}
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name={rightIcon} size={20} color={getIconColor()} />
          </TouchableOpacity>
        )}
      </AnimatedView>

      {/* Error Message */}
      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={14} color={colors.error} />
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error}
          </Text>
        </View>
      )}

      {/* Hint Text */}
      {hint && !error && (
        <Text style={[styles.hintText, { color: colors.textSecondary }]}>
          {hint}
        </Text>
      )}
    </View>
  );
});

InputComponent.displayName = 'Input';

export const Input = memo(InputComponent);

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    minHeight: 52,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    paddingVertical: Platform.OS === 'ios' ? 16 : 12,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  leftIconContainer: {
    paddingLeft: 16,
    paddingRight: 12,
  },
  rightIconContainer: {
    paddingRight: 16,
    paddingLeft: 12,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  hintText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 6,
  },
});

export default Input;
