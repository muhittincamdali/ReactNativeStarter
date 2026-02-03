/**
 * Edit Profile Screen
 * 
 * Allows users to update their profile information,
 * including avatar, name, bio, and contact details.
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActionSheetIOS,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { useTheme } from '../../hooks/useTheme';
import { useUserStore } from '../../store/userSlice';
import { Container } from '../../components/layout/Container';
import { Header } from '../../components/layout/Header';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { Loading } from '../../components/ui/Loading';
import { validateName, validateEmail, validatePhone } from '../../utils/validators';

interface FormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  bio: string;
  website: string;
  location: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  phone?: string;
  bio?: string;
  website?: string;
  general?: string;
}

export function EditProfileScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { colors } = useTheme();
  
  const { profile, updateProfile, uploadAvatar, isUpdating } = useUserStore();

  const [formData, setFormData] = useState<FormData>({
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || '',
    username: profile?.username || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    bio: profile?.bio || '',
    website: profile?.website || '',
    location: profile?.location || '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [newAvatar, setNewAvatar] = useState<string | null>(null);

  // Input refs
  const lastNameRef = useRef<any>(null);
  const usernameRef = useRef<any>(null);
  const emailRef = useRef<any>(null);
  const phoneRef = useRef<any>(null);
  const bioRef = useRef<any>(null);
  const websiteRef = useRef<any>(null);
  const locationRef = useRef<any>(null);

  // Track changes
  useEffect(() => {
    const changed = (
      formData.firstName !== (profile?.firstName || '') ||
      formData.lastName !== (profile?.lastName || '') ||
      formData.username !== (profile?.username || '') ||
      formData.email !== (profile?.email || '') ||
      formData.phone !== (profile?.phone || '') ||
      formData.bio !== (profile?.bio || '') ||
      formData.website !== (profile?.website || '') ||
      formData.location !== (profile?.location || '') ||
      newAvatar !== null
    );
    setHasChanges(changed);
  }, [formData, profile, newAvatar]);

  // Validate form
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    const firstNameValidation = validateName(formData.firstName, 'First name');
    if (!firstNameValidation.isValid) {
      newErrors.firstName = firstNameValidation.error;
    }

    const lastNameValidation = validateName(formData.lastName, 'Last name');
    if (!lastNameValidation.isValid) {
      newErrors.lastName = lastNameValidation.error;
    }

    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error;
    }

    if (formData.phone) {
      const phoneValidation = validatePhone(formData.phone);
      if (!phoneValidation.isValid) {
        newErrors.phone = phoneValidation.error;
      }
    }

    if (formData.bio && formData.bio.length > 150) {
      newErrors.bio = 'Bio must be 150 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Handle save
  const handleSave = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    try {
      // Upload new avatar if changed
      if (newAvatar) {
        await uploadAvatar(newAvatar);
      }

      // Update profile
      await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email,
        phone: formData.phone || undefined,
        bio: formData.bio || undefined,
        website: formData.website || undefined,
        location: formData.location || undefined,
      });

      navigation.goBack();
    } catch (err) {
      setErrors({
        general: err instanceof Error ? err.message : 'Failed to update profile',
      });
    }
  }, [formData, newAvatar, validateForm, updateProfile, uploadAvatar, navigation]);

  // Handle cancel
  const handleCancel = useCallback(() => {
    if (hasChanges) {
      Alert.alert(
        'Discard Changes',
        'Are you sure you want to discard your changes?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
        ]
      );
    } else {
      navigation.goBack();
    }
  }, [hasChanges, navigation]);

  // Handle avatar change
  const handleAvatarPress = useCallback(() => {
    const options = ['Take Photo', 'Choose from Library', 'Cancel'];
    const cancelButtonIndex = 2;

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
        },
        async (buttonIndex) => {
          if (buttonIndex === 0) {
            await takePhoto();
          } else if (buttonIndex === 1) {
            await pickImage();
          }
        }
      );
    } else {
      Alert.alert('Change Photo', 'Choose an option', [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Library', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' },
      ]);
    }
  }, []);

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission Required', 'Please allow camera access to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setNewAvatar(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission Required', 'Please allow photo library access.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setNewAvatar(result.assets[0].uri);
    }
  };

  // Input handlers
  const createChangeHandler = useCallback((field: keyof FormData) => (text: string) => {
    setFormData(prev => ({ ...prev, [field]: text }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  return (
    <Container>
      {/* Header */}
      <Header
        title="Edit Profile"
        leftAction={{
          icon: 'close',
          onPress: handleCancel,
        }}
        rightAction={{
          label: 'Save',
          onPress: handleSave,
          disabled: !hasChanges || isUpdating,
        }}
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 20 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Loading Overlay */}
          {isUpdating && (
            <View style={styles.loadingOverlay}>
              <Loading size="large" text="Saving..." />
            </View>
          )}

          {/* Error Message */}
          {errors.general && (
            <View style={[styles.errorBanner, { backgroundColor: `${colors.error}15` }]}>
              <Ionicons name="alert-circle" size={20} color={colors.error} />
              <Text style={[styles.errorText, { color: colors.error }]}>
                {errors.general}
              </Text>
            </View>
          )}

          {/* Avatar Section */}
          <Animated.View
            entering={FadeIn.delay(100).duration(400)}
            style={styles.avatarSection}
          >
            <TouchableOpacity onPress={handleAvatarPress} activeOpacity={0.8}>
              <Avatar
                source={newAvatar || profile?.avatar}
                name={formData.firstName}
                size={100}
              />
              <View style={[styles.editAvatarBadge, { backgroundColor: colors.primary }]}>
                <Ionicons name="camera" size={16} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleAvatarPress}>
              <Text style={[styles.changePhotoText, { color: colors.primary }]}>
                Change Photo
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Form */}
          <Animated.View entering={FadeInDown.delay(200).duration(400)}>
            {/* Name Row */}
            <View style={styles.nameRow}>
              <View style={styles.nameField}>
                <Input
                  label="First Name"
                  value={formData.firstName}
                  onChangeText={createChangeHandler('firstName')}
                  error={errors.firstName}
                  autoCapitalize="words"
                  returnKeyType="next"
                  onSubmitEditing={() => lastNameRef.current?.focus()}
                />
              </View>
              <View style={styles.nameField}>
                <Input
                  ref={lastNameRef}
                  label="Last Name"
                  value={formData.lastName}
                  onChangeText={createChangeHandler('lastName')}
                  error={errors.lastName}
                  autoCapitalize="words"
                  returnKeyType="next"
                  onSubmitEditing={() => usernameRef.current?.focus()}
                />
              </View>
            </View>

            <Input
              ref={usernameRef}
              label="Username"
              value={formData.username}
              onChangeText={createChangeHandler('username')}
              error={errors.username}
              autoCapitalize="none"
              autoCorrect={false}
              leftIcon="at"
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
            />

            <Input
              ref={emailRef}
              label="Email"
              value={formData.email}
              onChangeText={createChangeHandler('email')}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              leftIcon="mail-outline"
              returnKeyType="next"
              onSubmitEditing={() => phoneRef.current?.focus()}
            />

            <Input
              ref={phoneRef}
              label="Phone (optional)"
              value={formData.phone}
              onChangeText={createChangeHandler('phone')}
              error={errors.phone}
              keyboardType="phone-pad"
              leftIcon="call-outline"
              returnKeyType="next"
              onSubmitEditing={() => bioRef.current?.focus()}
            />

            <Input
              ref={bioRef}
              label="Bio (optional)"
              value={formData.bio}
              onChangeText={createChangeHandler('bio')}
              error={errors.bio}
              multiline
              numberOfLines={3}
              maxLength={150}
              placeholder="Tell us about yourself"
              returnKeyType="next"
              onSubmitEditing={() => websiteRef.current?.focus()}
            />
            <Text style={[styles.charCount, { color: colors.textSecondary }]}>
              {formData.bio.length}/150
            </Text>

            <Input
              ref={websiteRef}
              label="Website (optional)"
              value={formData.website}
              onChangeText={createChangeHandler('website')}
              error={errors.website}
              keyboardType="url"
              autoCapitalize="none"
              autoCorrect={false}
              leftIcon="globe-outline"
              placeholder="https://yourwebsite.com"
              returnKeyType="next"
              onSubmitEditing={() => locationRef.current?.focus()}
            />

            <Input
              ref={locationRef}
              label="Location (optional)"
              value={formData.location}
              onChangeText={createChangeHandler('location')}
              leftIcon="location-outline"
              placeholder="City, Country"
              returnKeyType="done"
            />
          </Animated.View>

          {/* Save Button (Mobile) */}
          <Button
            title="Save Changes"
            onPress={handleSave}
            disabled={!hasChanges || isUpdating}
            loading={isUpdating}
            style={styles.saveButton}
            size="large"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  editAvatarBadge: {
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
  changePhotoText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginTop: 12,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
  },
  nameField: {
    flex: 1,
  },
  charCount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'right',
    marginTop: -8,
    marginBottom: 8,
  },
  saveButton: {
    marginTop: 24,
  },
});
