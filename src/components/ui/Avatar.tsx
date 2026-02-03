/**
 * Avatar Component
 * 
 * Displays user avatar with fallback to initials,
 * supports multiple sizes and optional online status.
 */

import React, { useState, useMemo, memo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { useTheme } from '../../hooks/useTheme';

type AvatarSize = number | 'small' | 'medium' | 'large' | 'xlarge';

interface AvatarProps {
  source?: string | null;
  name?: string | null;
  size?: AvatarSize;
  style?: ViewStyle | ImageStyle;
  showStatus?: boolean;
  isOnline?: boolean;
  borderColor?: string;
}

// Generate consistent color from string
function stringToColor(str: string): string {
  const colors = [
    '#6366F1', '#8B5CF6', '#EC4899', '#F43F5E',
    '#EF4444', '#F97316', '#F59E0B', '#EAB308',
    '#84CC16', '#22C55E', '#10B981', '#14B8A6',
    '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1',
  ];
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
}

// Get initials from name
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return (name[0] || '?').toUpperCase();
}

function AvatarComponent({
  source,
  name,
  size = 'medium',
  style,
  showStatus = false,
  isOnline = false,
  borderColor,
}: AvatarProps): React.JSX.Element {
  const { colors } = useTheme();
  const [imageError, setImageError] = useState(false);

  // Calculate pixel size
  const pixelSize = useMemo(() => {
    if (typeof size === 'number') return size;
    
    switch (size) {
      case 'small': return 32;
      case 'medium': return 48;
      case 'large': return 64;
      case 'xlarge': return 96;
      default: return 48;
    }
  }, [size]);

  // Calculate font size for initials
  const fontSize = useMemo(() => {
    return Math.floor(pixelSize * 0.4);
  }, [pixelSize]);

  // Calculate status indicator size
  const statusSize = useMemo(() => {
    return Math.max(Math.floor(pixelSize * 0.25), 8);
  }, [pixelSize]);

  // Generate background color from name
  const backgroundColor = useMemo(() => {
    return name ? stringToColor(name) : colors.primary;
  }, [name, colors.primary]);

  // Get initials
  const initials = useMemo(() => {
    return name ? getInitials(name) : '?';
  }, [name]);

  // Container style
  const containerStyle: ViewStyle = {
    width: pixelSize,
    height: pixelSize,
    borderRadius: pixelSize / 2,
    backgroundColor,
    borderWidth: borderColor ? 3 : 0,
    borderColor,
  };

  // Check if we should show image
  const showImage = source && !imageError;

  return (
    <View style={[styles.container, containerStyle, style]}>
      {showImage ? (
        <Animated.View
          entering={FadeIn.duration(200)}
          style={StyleSheet.absoluteFill}
        >
          <Image
            source={{ uri: source }}
            style={[
              styles.image,
              {
                width: pixelSize,
                height: pixelSize,
                borderRadius: pixelSize / 2,
              },
            ]}
            onError={() => setImageError(true)}
            resizeMode="cover"
          />
        </Animated.View>
      ) : (
        <View style={styles.initialsContainer}>
          <Text
            style={[
              styles.initials,
              { fontSize },
            ]}
            numberOfLines={1}
          >
            {initials}
          </Text>
        </View>
      )}

      {/* Online Status Indicator */}
      {showStatus && (
        <View
          style={[
            styles.statusIndicator,
            {
              width: statusSize,
              height: statusSize,
              borderRadius: statusSize / 2,
              backgroundColor: isOnline ? '#22C55E' : colors.textSecondary,
              borderWidth: 2,
              borderColor: colors.background,
              right: 0,
              bottom: 0,
            },
          ]}
        />
      )}
    </View>
  );
}

export const Avatar = memo(AvatarComponent);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  initialsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
  },
  statusIndicator: {
    position: 'absolute',
  },
});

export default Avatar;
