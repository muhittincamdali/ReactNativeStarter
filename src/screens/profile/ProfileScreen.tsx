/**
 * Profile Screen
 * 
 * Displays user profile information with stats, recent activity,
 * and quick access to profile settings.
 */

import React, { useCallback, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  FadeInDown,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  Extrapolate,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../hooks/useTheme';
import { useUserStore } from '../../store/userSlice';
import { useAuthStore } from '../../store/authSlice';
import { Container } from '../../components/layout/Container';
import { Avatar } from '../../components/ui/Avatar';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Loading } from '../../components/ui/Loading';
import { formatCompactNumber } from '../../utils/formatters';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HEADER_HEIGHT = 280;

interface StatItemProps {
  label: string;
  value: number;
  onPress?: () => void;
}

function StatItem({ label, value, onPress }: StatItemProps): React.JSX.Element {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity
      style={styles.statItem}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <Text style={[styles.statValue, { color: colors.text }]}>
        {formatCompactNumber(value)}
      </Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  showBadge?: boolean;
  badgeCount?: number;
}

function MenuItem({ icon, label, onPress, showBadge, badgeCount }: MenuItemProps): React.JSX.Element {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity
      style={[styles.menuItem, { borderBottomColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.menuIcon, { backgroundColor: `${colors.primary}15` }]}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <Text style={[styles.menuLabel, { color: colors.text }]}>
        {label}
      </Text>
      <View style={styles.menuRight}>
        {showBadge && badgeCount && badgeCount > 0 && (
          <View style={[styles.badge, { backgroundColor: colors.error }]}>
            <Text style={styles.badgeText}>{badgeCount > 99 ? '99+' : badgeCount}</Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
      </View>
    </TouchableOpacity>
  );
}

export function ProfileScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { colors } = useTheme();
  
  const { profile, stats, isLoading, refreshProfile } = useUserStore();
  const { user } = useAuthStore();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [-100, 0],
      [1.5, 1],
      Extrapolate.CLAMP
    );
    const translateY = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT],
      [0, -HEADER_HEIGHT / 2],
      Extrapolate.CLAMP
    );
    return {
      transform: [{ scale }, { translateY }],
    };
  });

  const avatarAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [-50, 0, 100],
      [1.2, 1, 0.8],
      Extrapolate.CLAMP
    );
    return {
      transform: [{ scale }],
    };
  });

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refreshProfile();
    setIsRefreshing(false);
  }, [refreshProfile]);

  const handleEditProfile = useCallback(() => {
    navigation.navigate('EditProfile' as never);
  }, [navigation]);

  const handleSettings = useCallback(() => {
    navigation.navigate('Settings' as never);
  }, [navigation]);

  const displayUser = profile || user;

  if (isLoading && !displayUser) {
    return (
      <Container>
        <Loading size="large" text="Loading profile..." />
      </Container>
    );
  }

  return (
    <Container edges={['left', 'right']}>
      {/* Header Background */}
      <Animated.View
        style={[
          styles.headerBackground,
          headerAnimatedStyle,
          { backgroundColor: colors.primary },
        ]}
      />

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#FFFFFF"
            progressViewOffset={100}
          />
        }
      >
        {/* Profile Header */}
        <View style={[styles.profileHeader, { paddingTop: insets.top + 20 }]}>
          {/* Settings Button */}
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={handleSettings}
              accessibilityLabel="Settings"
            >
              <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Avatar */}
          <Animated.View style={[styles.avatarContainer, avatarAnimatedStyle]}>
            <Avatar
              source={displayUser?.avatar}
              name={displayUser?.firstName}
              size={100}
              style={styles.avatar}
            />
            <TouchableOpacity
              style={[styles.editAvatarButton, { backgroundColor: colors.primary }]}
              onPress={handleEditProfile}
              accessibilityLabel="Change profile photo"
            >
              <Ionicons name="camera" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </Animated.View>

          {/* Name */}
          <Text style={styles.name}>
            {displayUser?.firstName} {displayUser?.lastName}
          </Text>
          <Text style={styles.username}>@{displayUser?.username || 'user'}</Text>

          {/* Bio */}
          {displayUser?.bio && (
            <Text style={styles.bio} numberOfLines={3}>
              {displayUser.bio}
            </Text>
          )}

          {/* Edit Profile Button */}
          <Button
            title="Edit Profile"
            onPress={handleEditProfile}
            variant="outline"
            size="small"
            style={styles.editButton}
            textStyle={{ color: '#FFFFFF' }}
          />
        </View>

        {/* Stats Card */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <Card style={styles.statsCard}>
            <View style={styles.statsRow}>
              <StatItem label="Posts" value={stats?.postsCount || 0} />
              <View style={[styles.statsDivider, { backgroundColor: colors.border }]} />
              <StatItem label="Followers" value={stats?.followersCount || 0} />
              <View style={[styles.statsDivider, { backgroundColor: colors.border }]} />
              <StatItem label="Following" value={stats?.followingCount || 0} />
            </View>
          </Card>
        </Animated.View>

        {/* Menu Section */}
        <Animated.View entering={FadeIn.delay(200).duration(400)}>
          <Card style={styles.menuCard}>
            <MenuItem
              icon="person-outline"
              label="Personal Information"
              onPress={handleEditProfile}
            />
            <MenuItem
              icon="notifications-outline"
              label="Notifications"
              onPress={() => navigation.navigate('Notifications' as never)}
              showBadge
              badgeCount={3}
            />
            <MenuItem
              icon="shield-outline"
              label="Privacy & Security"
              onPress={handleSettings}
            />
            <MenuItem
              icon="bookmark-outline"
              label="Saved Items"
              onPress={() => {}}
            />
            <MenuItem
              icon="heart-outline"
              label="Liked Posts"
              onPress={() => {}}
            />
          </Card>
        </Animated.View>

        {/* Support Section */}
        <Animated.View entering={FadeIn.delay(300).duration(400)}>
          <Card style={styles.menuCard}>
            <MenuItem
              icon="help-circle-outline"
              label="Help & Support"
              onPress={() => {}}
            />
            <MenuItem
              icon="document-text-outline"
              label="Terms & Policies"
              onPress={() => {}}
            />
            <MenuItem
              icon="information-circle-outline"
              label="About"
              onPress={() => {}}
            />
          </Card>
        </Animated.View>
      </Animated.ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  profileHeader: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  headerActions: {
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'row',
    paddingTop: 48,
    paddingRight: 16,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  name: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  username: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 12,
  },
  bio: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
    marginBottom: 16,
  },
  editButton: {
    borderColor: 'rgba(255, 255, 255, 0.5)',
    minWidth: 120,
  },
  statsCard: {
    marginTop: -20,
    marginBottom: 16,
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
  },
  statsDivider: {
    width: 1,
    height: 40,
  },
  menuCard: {
    marginBottom: 16,
    padding: 0,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter-Medium',
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});
