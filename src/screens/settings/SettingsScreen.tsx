/**
 * Settings Screen
 * 
 * Application settings including theme, notifications,
 * privacy, and account management.
 */

import React, { useCallback, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../hooks/useTheme';
import { useSettingsStore } from '../../store/settingsSlice';
import { useAuthViewModel } from '../auth/AuthViewModel';
import { Container } from '../../components/layout/Container';
import { Header } from '../../components/layout/Header';
import { Card } from '../../components/ui/Card';
import { Loading } from '../../components/ui/Loading';

interface SettingItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  description?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  showArrow?: boolean;
  destructive?: boolean;
}

function SettingItem({
  icon,
  label,
  description,
  onPress,
  rightElement,
  showArrow = true,
  destructive = false,
}: SettingItemProps): React.JSX.Element {
  const { colors } = useTheme();
  
  const iconColor = destructive ? colors.error : colors.primary;
  const labelColor = destructive ? colors.error : colors.text;

  return (
    <TouchableOpacity
      style={[styles.settingItem, { borderBottomColor: colors.border }]}
      onPress={onPress}
      disabled={!onPress && !rightElement}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={[styles.settingIcon, { backgroundColor: `${iconColor}15` }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingLabel, { color: labelColor }]}>
          {label}
        </Text>
        {description && (
          <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
            {description}
          </Text>
        )}
      </View>
      {rightElement || (showArrow && onPress && (
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
      ))}
    </TouchableOpacity>
  );
}

interface SectionHeaderProps {
  title: string;
}

function SectionHeader({ title }: SectionHeaderProps): React.JSX.Element {
  const { colors } = useTheme();
  
  return (
    <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>
      {title}
    </Text>
  );
}

export function SettingsScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { colors } = useTheme();
  
  const {
    theme,
    setTheme,
    pushNotifications,
    setPushNotifications,
    emailNotifications,
    setEmailNotifications,
    biometricEnabled,
    setBiometricEnabled,
    language,
    setLanguage,
  } = useSettingsStore();
  
  const { logout, isLoading } = useAuthViewModel();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Theme selection
  const handleThemePress = useCallback(() => {
    const options = ['Light', 'Dark', 'System Default', 'Cancel'];
    const values = ['light', 'dark', 'system'] as const;

    Alert.alert('Theme', 'Choose your preferred theme', [
      { text: 'Light', onPress: () => setTheme('light') },
      { text: 'Dark', onPress: () => setTheme('dark') },
      { text: 'System Default', onPress: () => setTheme('system') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }, [setTheme]);

  // Language selection
  const handleLanguagePress = useCallback(() => {
    Alert.alert('Language', 'Choose your preferred language', [
      { text: 'English', onPress: () => setLanguage('en') },
      { text: 'Spanish', onPress: () => setLanguage('es') },
      { text: 'French', onPress: () => setLanguage('fr') },
      { text: 'German', onPress: () => setLanguage('de') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }, [setLanguage]);

  // Get display text for settings
  const getThemeText = () => {
    switch (theme) {
      case 'light': return 'Light';
      case 'dark': return 'Dark';
      case 'system': return 'System';
      default: return 'System';
    }
  };

  const getLanguageText = () => {
    switch (language) {
      case 'en': return 'English';
      case 'es': return 'Spanish';
      case 'fr': return 'French';
      case 'de': return 'German';
      default: return 'English';
    }
  };

  // Handle logout
  const handleLogout = useCallback(() => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            setIsLoggingOut(true);
            try {
              await logout();
            } finally {
              setIsLoggingOut(false);
            }
          },
        },
      ]
    );
  }, [logout]);

  // Handle delete account
  const handleDeleteAccount = useCallback(() => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: () => {
            // Navigate to delete account flow
            Alert.alert('Contact Support', 'Please contact support to delete your account.');
          },
        },
      ]
    );
  }, []);

  // External links
  const openPrivacyPolicy = useCallback(() => {
    Linking.openURL('https://example.com/privacy');
  }, []);

  const openTermsOfService = useCallback(() => {
    Linking.openURL('https://example.com/terms');
  }, []);

  const openSupport = useCallback(() => {
    Linking.openURL('mailto:support@example.com');
  }, []);

  if (isLoggingOut) {
    return (
      <Container>
        <Loading size="large" text="Signing out..." />
      </Container>
    );
  }

  return (
    <Container>
      <Header
        title="Settings"
        leftAction={{
          icon: 'arrow-back',
          onPress: () => navigation.goBack(),
        }}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Appearance Section */}
        <Animated.View entering={FadeIn.delay(100).duration(400)}>
          <SectionHeader title="APPEARANCE" />
          <Card style={styles.sectionCard}>
            <SettingItem
              icon="color-palette-outline"
              label="Theme"
              description={getThemeText()}
              onPress={handleThemePress}
            />
            <SettingItem
              icon="language-outline"
              label="Language"
              description={getLanguageText()}
              onPress={handleLanguagePress}
            />
          </Card>
        </Animated.View>

        {/* Notifications Section */}
        <Animated.View entering={FadeInDown.delay(150).duration(400)}>
          <SectionHeader title="NOTIFICATIONS" />
          <Card style={styles.sectionCard}>
            <SettingItem
              icon="notifications-outline"
              label="Push Notifications"
              description="Receive alerts and updates"
              showArrow={false}
              rightElement={
                <Switch
                  value={pushNotifications}
                  onValueChange={setPushNotifications}
                  trackColor={{ false: colors.border, true: `${colors.primary}50` }}
                  thumbColor={pushNotifications ? colors.primary : '#FFFFFF'}
                />
              }
            />
            <SettingItem
              icon="mail-outline"
              label="Email Notifications"
              description="Receive emails about activity"
              showArrow={false}
              rightElement={
                <Switch
                  value={emailNotifications}
                  onValueChange={setEmailNotifications}
                  trackColor={{ false: colors.border, true: `${colors.primary}50` }}
                  thumbColor={emailNotifications ? colors.primary : '#FFFFFF'}
                />
              }
            />
          </Card>
        </Animated.View>

        {/* Security Section */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <SectionHeader title="SECURITY" />
          <Card style={styles.sectionCard}>
            <SettingItem
              icon="lock-closed-outline"
              label="Change Password"
              onPress={() => navigation.navigate('ChangePassword' as never)}
            />
            <SettingItem
              icon="finger-print"
              label="Biometric Login"
              description="Use fingerprint or face to sign in"
              showArrow={false}
              rightElement={
                <Switch
                  value={biometricEnabled}
                  onValueChange={setBiometricEnabled}
                  trackColor={{ false: colors.border, true: `${colors.primary}50` }}
                  thumbColor={biometricEnabled ? colors.primary : '#FFFFFF'}
                />
              }
            />
            <SettingItem
              icon="shield-checkmark-outline"
              label="Two-Factor Authentication"
              onPress={() => navigation.navigate('TwoFactorAuth' as never)}
            />
          </Card>
        </Animated.View>

        {/* Privacy Section */}
        <Animated.View entering={FadeInDown.delay(250).duration(400)}>
          <SectionHeader title="PRIVACY" />
          <Card style={styles.sectionCard}>
            <SettingItem
              icon="eye-outline"
              label="Profile Visibility"
              description="Control who can see your profile"
              onPress={() => {}}
            />
            <SettingItem
              icon="people-outline"
              label="Blocked Users"
              onPress={() => {}}
            />
            <SettingItem
              icon="download-outline"
              label="Download My Data"
              onPress={() => {}}
            />
          </Card>
        </Animated.View>

        {/* Support Section */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <SectionHeader title="SUPPORT" />
          <Card style={styles.sectionCard}>
            <SettingItem
              icon="help-circle-outline"
              label="Help Center"
              onPress={openSupport}
            />
            <SettingItem
              icon="chatbubble-ellipses-outline"
              label="Contact Support"
              onPress={openSupport}
            />
            <SettingItem
              icon="bug-outline"
              label="Report a Bug"
              onPress={openSupport}
            />
          </Card>
        </Animated.View>

        {/* Legal Section */}
        <Animated.View entering={FadeInDown.delay(350).duration(400)}>
          <SectionHeader title="LEGAL" />
          <Card style={styles.sectionCard}>
            <SettingItem
              icon="document-text-outline"
              label="Terms of Service"
              onPress={openTermsOfService}
            />
            <SettingItem
              icon="shield-outline"
              label="Privacy Policy"
              onPress={openPrivacyPolicy}
            />
            <SettingItem
              icon="information-circle-outline"
              label="Licenses"
              onPress={() => {}}
            />
          </Card>
        </Animated.View>

        {/* Account Section */}
        <Animated.View entering={FadeInDown.delay(400).duration(400)}>
          <SectionHeader title="ACCOUNT" />
          <Card style={styles.sectionCard}>
            <SettingItem
              icon="log-out-outline"
              label="Sign Out"
              onPress={handleLogout}
              showArrow={false}
            />
            <SettingItem
              icon="trash-outline"
              label="Delete Account"
              onPress={handleDeleteAccount}
              destructive
              showArrow={false}
            />
          </Card>
        </Animated.View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={[styles.appVersion, { color: colors.textSecondary }]}>
            Version 1.0.0 (Build 100)
          </Text>
        </View>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
  },
  sectionHeader: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 16,
    marginLeft: 4,
  },
  sectionCard: {
    padding: 0,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
  },
  settingDescription: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  appInfo: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  appVersion: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
  },
});
