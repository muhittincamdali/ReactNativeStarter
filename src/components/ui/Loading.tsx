/**
 * Loading Component
 * 
 * Customizable loading indicator with optional text
 * and multiple presentation styles.
 */

import React, { memo, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';

import { useTheme } from '../../hooks/useTheme';

type LoadingSize = 'small' | 'medium' | 'large';
type LoadingVariant = 'spinner' | 'dots' | 'pulse';

interface LoadingProps {
  size?: LoadingSize;
  variant?: LoadingVariant;
  text?: string;
  color?: string;
  fullscreen?: boolean;
  overlay?: boolean;
  style?: ViewStyle;
}

function SpinnerLoader({ size, color }: { size: 'small' | 'large'; color: string }) {
  return <ActivityIndicator size={size} color={color} />;
}

function DotsLoader({ color }: { color: string }) {
  const dot1Opacity = useSharedValue(0.3);
  const dot2Opacity = useSharedValue(0.3);
  const dot3Opacity = useSharedValue(0.3);

  useEffect(() => {
    dot1Opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 300 }),
        withTiming(0.3, { duration: 300 })
      ),
      -1
    );
    
    setTimeout(() => {
      dot2Opacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 300 }),
          withTiming(0.3, { duration: 300 })
        ),
        -1
      );
    }, 150);

    setTimeout(() => {
      dot3Opacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 300 }),
          withTiming(0.3, { duration: 300 })
        ),
        -1
      );
    }, 300);
  }, [dot1Opacity, dot2Opacity, dot3Opacity]);

  const dot1Style = useAnimatedStyle(() => ({
    opacity: dot1Opacity.value,
  }));

  const dot2Style = useAnimatedStyle(() => ({
    opacity: dot2Opacity.value,
  }));

  const dot3Style = useAnimatedStyle(() => ({
    opacity: dot3Opacity.value,
  }));

  return (
    <View style={styles.dotsContainer}>
      <Animated.View style={[styles.dot, { backgroundColor: color }, dot1Style]} />
      <Animated.View style={[styles.dot, { backgroundColor: color }, dot2Style]} />
      <Animated.View style={[styles.dot, { backgroundColor: color }, dot3Style]} />
    </View>
  );
}

function PulseLoader({ size, color }: { size: number; color: string }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.5, { duration: 1000, easing: Easing.ease }),
      -1
    );
    opacity.value = withRepeat(
      withTiming(0, { duration: 1000, easing: Easing.ease }),
      -1
    );
  }, [scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.pulseContainer}>
      <Animated.View
        style={[
          styles.pulseOuter,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
          },
          animatedStyle,
        ]}
      />
      <View
        style={[
          styles.pulseInner,
          {
            width: size * 0.6,
            height: size * 0.6,
            borderRadius: size * 0.3,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
}

function LoadingComponent({
  size = 'medium',
  variant = 'spinner',
  text,
  color,
  fullscreen = false,
  overlay = false,
  style,
}: LoadingProps): React.JSX.Element {
  const { colors } = useTheme();
  const loaderColor = color || colors.primary;

  // Get spinner size
  const getSpinnerSize = (): 'small' | 'large' => {
    return size === 'small' ? 'small' : 'large';
  };

  // Get pulse size
  const getPulseSize = (): number => {
    switch (size) {
      case 'small': return 30;
      case 'medium': return 50;
      case 'large': return 70;
      default: return 50;
    }
  };

  // Render loader based on variant
  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return <DotsLoader color={loaderColor} />;
      case 'pulse':
        return <PulseLoader size={getPulseSize()} color={loaderColor} />;
      default:
        return <SpinnerLoader size={getSpinnerSize()} color={loaderColor} />;
    }
  };

  const containerStyle: ViewStyle = {
    ...styles.container,
    ...(fullscreen && styles.fullscreen),
    ...(overlay && {
      ...styles.overlay,
      backgroundColor: colors.background + 'E6',
    }),
  };

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}
      style={[containerStyle, style]}
    >
      {renderLoader()}
      {text && (
        <Text style={[styles.text, { color: colors.text }]}>
          {text}
        </Text>
      )}
    </Animated.View>
  );
}

export const Loading = memo(LoadingComponent);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  fullscreen: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  text: {
    marginTop: 16,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  pulseContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseOuter: {
    position: 'absolute',
  },
  pulseInner: {},
});

export default Loading;
