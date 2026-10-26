import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { fontSize, radius, space, useTheme } from '@/theme';

/** Props of {@link Button}. */
export interface ButtonProps {
  title: string;
  onPress: () => void;
  /** `primary` is filled with the accent colour; `secondary` is outlined. */
  variant?: 'primary' | 'secondary';
  /** Shows a spinner and ignores presses. */
  loading?: boolean;
  disabled?: boolean;
  testID?: string;
}

/** A full-width button with a 48-point touch target. */
export function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  testID,
}: ButtonProps) {
  const { colors } = useTheme();
  const primary = variant === 'primary';
  const inactive = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: primary ? colors.accent : 'transparent',
          borderColor: colors.accent,
          opacity: inactive ? 0.6 : pressed ? 0.85 : 1,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={primary ? colors.onAccent : colors.accent} />
      ) : (
        <Text style={[styles.title, { color: primary ? colors.onAccent : colors.accent }]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: radius,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.lg,
  },
  title: { fontSize: fontSize.body, fontWeight: '600' },
});
