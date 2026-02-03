/**
 * Register Screen
 * 
 * User registration with comprehensive form validation,
 * password strength indicator, and terms acceptance.
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
  Keyboard,
  Linking,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../hooks/useTheme';
import { useAuthViewModel } from './AuthViewModel';
import { Container } from '../../components/layout/Container';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import {
  validateEmail,
  validatePassword,
  validateName,
  validateConfirmPassword,
  getPasswordStrength,
} from '../../utils/validators';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export function RegisterScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { colors, spacing } = useTheme();
  
  const {
    register,
    isLoading,
    error: authError,
    clearError,
  } = useAuthViewModel();

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Input refs for focus management
  const lastNameRef = useRef<any>(null);
  const emailRef = useRef<any>(null);
  const passwordRef = useRef<any>(null);
  const confirmPasswordRef = useRef<any>(null);

  // Password strength
  const passwordStrength = getPasswordStrength(formData.password);
  const strengthWidth = useSharedValue(0);

  // Update strength indicator
  useEffect(() => {
    strengthWidth.value = withTiming((passwordStrength.score / 4) * 100, { duration: 300 });
  }, [passwordStrength.score, strengthWidth]);

  // Clear errors when data changes
  useEffect(() => {
    clearError();
  }, [formData, clearError]);

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

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.error;
    }

    const confirmValidation = validateConfirmPassword(
      formData.password,
      formData.confirmPassword
    );
    if (!confirmValidation.isValid) {
      newErrors.confirmPassword = confirmValidation.error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Handle registration
  const handleRegister = useCallback(async () => {
    Keyboard.dismiss();

    if (!validateForm()) {
      return;
    }

    if (!acceptedTerms) {
      Alert.alert(
        'Terms & Conditions',
        'Please accept the terms and conditions to continue.'
      );
      return;
    }

    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        general: err instanceof Error ? err.message : 'Registration failed',
      }));
    }
  }, [formData, acceptedTerms, validateForm, register]);

  // Navigate to login
  const handleLogin = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Open terms/privacy
  const openTerms = useCallback(() => {
    Linking.openURL('https://example.com/terms');
  }, []);

  const openPrivacy = useCallback(() => {
    Linking.openURL('https://example.com/privacy');
  }, []);

  // Input change handlers
  const createChangeHandler = useCallback((field: keyof FormData) => (text: string) => {
    setFormData(prev => ({ ...prev, [field]: text }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  // Password strength indicator
  const strengthAnimatedStyle = useAnimatedStyle(() => ({
    width: `${strengthWidth.value}%`,
  }));

  const getStrengthColor = useCallback(() => {
    switch (passwordStrength.level) {
      case 'weak': return '#EF4444';
      case 'fair': return '#F59E0B';
      case 'good': return '#10B981';
      case 'strong': return '#6366F1';
      default: return colors.border;
    }
  }, [passwordStrength.level, colors.border]);

  return (
    <Container edges={['left', 'right']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Animated.View
            entering={FadeInDown.delay(100).duration(600)}
            style={styles.headerSection}
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: colors.text }]}>
              Create Account
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Join us and start your journey today
            </Text>
          </Animated.View>

          {/* Form */}
          <Animated.View
            entering={FadeInUp.delay(200).duration(600)}
            style={styles.formSection}
          >
            {/* Error Message */}
            {(errors.general || authError) && (
              <View style={[styles.errorBanner, { backgroundColor: `${colors.error}15` }]}>
                <Ionicons name="alert-circle" size={20} color={colors.error} />
                <Text style={[styles.errorText, { color: colors.error }]}>
                  {errors.general || authError}
                </Text>
              </View>
            )}

            {/* Name Row */}
            <View style={styles.nameRow}>
              <View style={styles.nameField}>
                <Input
                  label="First Name"
                  value={formData.firstName}
                  onChangeText={createChangeHandler('firstName')}
                  placeholder="John"
                  autoCapitalize="words"
                  autoComplete="given-name"
                  error={errors.firstName}
                  returnKeyType="next"
                  onSubmitEditing={() => lastNameRef.current?.focus()}
                  editable={!isLoading}
                />
              </View>
              <View style={styles.nameField}>
                <Input
                  ref={lastNameRef}
                  label="Last Name"
                  value={formData.lastName}
                  onChangeText={createChangeHandler('lastName')}
                  placeholder="Doe"
                  autoCapitalize="words"
                  autoComplete="family-name"
                  error={errors.lastName}
                  returnKeyType="next"
                  onSubmitEditing={() => emailRef.current?.focus()}
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Email */}
            <Input
              ref={emailRef}
              label="Email"
              value={formData.email}
              onChangeText={createChangeHandler('email')}
              placeholder="john@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              error={errors.email}
              leftIcon="mail-outline"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              editable={!isLoading}
            />

            {/* Password */}
            <Input
              ref={passwordRef}
              label="Password"
              value={formData.password}
              onChangeText={createChangeHandler('password')}
              placeholder="Create a strong password"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="new-password"
              error={errors.password}
              leftIcon="lock-closed-outline"
              rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
              onRightIconPress={() => setShowPassword(!showPassword)}
              returnKeyType="next"
              onSubmitEditing={() => confirmPasswordRef.current?.focus()}
              editable={!isLoading}
            />

            {/* Password Strength Indicator */}
            {formData.password.length > 0 && (
              <View style={styles.strengthContainer}>
                <View style={[styles.strengthTrack, { backgroundColor: colors.border }]}>
                  <Animated.View
                    style={[
                      styles.strengthBar,
                      strengthAnimatedStyle,
                      { backgroundColor: getStrengthColor() },
                    ]}
                  />
                </View>
                <Text style={[styles.strengthText, { color: getStrengthColor() }]}>
                  {passwordStrength.level.charAt(0).toUpperCase() + passwordStrength.level.slice(1)}
                </Text>
              </View>
            )}

            {/* Confirm Password */}
            <Input
              ref={confirmPasswordRef}
              label="Confirm Password"
              value={formData.confirmPassword}
              onChangeText={createChangeHandler('confirmPassword')}
              placeholder="Re-enter your password"
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoComplete="new-password"
              error={errors.confirmPassword}
              leftIcon="shield-checkmark-outline"
              rightIcon={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
              onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
              returnKeyType="done"
              onSubmitEditing={handleRegister}
              editable={!isLoading}
            />

            {/* Terms Checkbox */}
            <TouchableOpacity
              style={styles.termsRow}
              onPress={() => setAcceptedTerms(!acceptedTerms)}
              activeOpacity={0.7}
            >
              <View style={[
                styles.checkbox,
                { borderColor: colors.border },
                acceptedTerms && { backgroundColor: colors.primary, borderColor: colors.primary },
              ]}>
                {acceptedTerms && (
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                )}
              </View>
              <Text style={[styles.termsText, { color: colors.textSecondary }]}>
                I agree to the{' '}
                <Text style={{ color: colors.primary }} onPress={openTerms}>
                  Terms of Service
                </Text>
                {' '}and{' '}
                <Text style={{ color: colors.primary }} onPress={openPrivacy}>
                  Privacy Policy
                </Text>
              </Text>
            </TouchableOpacity>

            {/* Register Button */}
            <Button
              title="Create Account"
              onPress={handleRegister}
              loading={isLoading}
              disabled={isLoading || !acceptedTerms}
              style={styles.registerButton}
              size="large"
            />
          </Animated.View>

          {/* Login Link */}
          <Animated.View
            entering={FadeIn.delay(400).duration(600)}
            style={styles.loginSection}
          >
            <Text style={[styles.loginText, { color: colors.textSecondary }]}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={[styles.loginLink, { color: colors.primary }]}>
                Sign in
              </Text>
            </TouchableOpacity>
          </Animated.View>
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
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  headerSection: {
    marginBottom: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginBottom: 16,
    marginLeft: -8,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  formSection: {
    marginBottom: 24,
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
  nameRow: {
    flexDirection: 'row',
    gap: 12,
  },
  nameField: {
    flex: 1,
  },
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -8,
    marginBottom: 8,
    gap: 12,
  },
  strengthTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  strengthBar: {
    height: '100%',
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    minWidth: 50,
    textAlign: 'right',
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 16,
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  registerButton: {
    marginTop: 8,
  },
  loginSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 20,
  },
  loginText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  loginLink: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
});
