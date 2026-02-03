/**
 * FormField Component
 * 
 * Generic form field wrapper with label, error handling,
 * and validation support. Works with react-hook-form.
 */

import React, { memo, ReactNode, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  FadeIn,
} from 'react-native-reanimated';
import { Controller, Control, FieldValues, FieldPath } from 'react-hook-form';

import { useTheme } from '../../hooks/useTheme';

interface FormFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label?: string;
  error?: string;
  required?: boolean;
  children: (props: {
    value: any;
    onChange: (value: any) => void;
    onBlur: () => void;
    error?: string;
  }) => ReactNode;
  containerStyle?: ViewStyle;
}

function FormFieldComponent<T extends FieldValues>({
  name,
  control,
  label,
  error,
  required = false,
  children,
  containerStyle,
}: FormFieldProps<T>): React.JSX.Element {
  const { colors } = useTheme();
  const errorOpacity = useSharedValue(error ? 1 : 0);

  // Update error animation
  React.useEffect(() => {
    errorOpacity.value = withTiming(error ? 1 : 0, { duration: 200 });
  }, [error, errorOpacity]);

  const errorAnimatedStyle = useAnimatedStyle(() => ({
    opacity: errorOpacity.value,
    transform: [{ translateY: errorOpacity.value === 0 ? -10 : 0 }],
  }));

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Label */}
      {label && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, { color: error ? colors.error : colors.textSecondary }]}>
            {label}
          </Text>
          {required && (
            <Text style={[styles.required, { color: colors.error }]}>*</Text>
          )}
        </View>
      )}

      {/* Field */}
      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange, onBlur } }) =>
          children({ value, onChange, onBlur, error })
        }
      />

      {/* Error */}
      {error && (
        <Animated.View style={[styles.errorContainer, errorAnimatedStyle]}>
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error}
          </Text>
        </Animated.View>
      )}
    </View>
  );
}

// Type-safe wrapper
export function FormField<T extends FieldValues>(props: FormFieldProps<T>) {
  return <FormFieldComponent {...props} />;
}

/**
 * Simple form field without react-hook-form integration
 */
interface SimpleFormFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  containerStyle?: ViewStyle;
  helperText?: string;
}

export function SimpleFormField({
  label,
  error,
  required = false,
  children,
  containerStyle,
  helperText,
}: SimpleFormFieldProps): React.JSX.Element {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Label */}
      {label && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, { color: error ? colors.error : colors.textSecondary }]}>
            {label}
          </Text>
          {required && (
            <Text style={[styles.required, { color: colors.error }]}>*</Text>
          )}
        </View>
      )}

      {/* Field */}
      {children}

      {/* Helper Text */}
      {helperText && !error && (
        <Text style={[styles.helperText, { color: colors.textSecondary }]}>
          {helperText}
        </Text>
      )}

      {/* Error */}
      {error && (
        <Animated.View entering={FadeIn.duration(200)} style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error}
          </Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  required: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginLeft: 4,
  },
  errorContainer: {
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  helperText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
});

export default FormField;
