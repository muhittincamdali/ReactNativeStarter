import { useId } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { fontSize, radius, space, useTheme } from '@/theme';

/** Props of {@link TextField}: a label, an optional hint and error, and any `TextInput` prop. */
export interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  hint?: string | undefined;
  /** Shown in red below the field and announced by screen readers. */
  error?: string | undefined;
}

/** A labelled text input with an error line. */
export function TextField({ label, hint, error, ...input }: TextFieldProps) {
  const { colors } = useTheme();
  const id = useId();
  return (
    <View style={styles.container}>
      <Text nativeID={`${id}-label`} style={[styles.label, { color: colors.text }]}>
        {label}
      </Text>
      <TextInput
        accessibilityLabel={label}
        accessibilityLabelledBy={`${id}-label`}
        accessibilityHint={error ?? hint}
        placeholderTextColor={colors.muted}
        style={[
          styles.input,
          {
            color: colors.text,
            backgroundColor: colors.surface,
            borderColor: error ? colors.danger : colors.border,
          },
        ]}
        {...input}
      />
      {error ? (
        <Text
          accessibilityLiveRegion="polite"
          role="alert"
          style={[styles.note, { color: colors.danger }]}
        >
          {error}
        </Text>
      ) : hint ? (
        <Text style={[styles.note, { color: colors.muted }]}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.xs },
  label: { fontSize: fontSize.caption, fontWeight: '600' },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: radius,
    paddingHorizontal: space.md,
    fontSize: fontSize.body,
  },
  note: { fontSize: fontSize.caption },
});
