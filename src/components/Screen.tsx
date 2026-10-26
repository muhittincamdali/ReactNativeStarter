import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { space, useTheme } from '@/theme';

/** Props of {@link Screen}. */
export interface ScreenProps {
  children: ReactNode;
  /** Wraps the content in a ScrollView; turn off for screens that scroll a list themselves. */
  scroll?: boolean;
  /** Safe-area edges to pad; tab screens leave out the bottom edge, which the tab bar covers. */
  edges?: Edge[];
}

/** The page frame: background colour, safe area and room for the keyboard. */
export function Screen({ children, scroll = true, edges = ['top', 'bottom'] }: ScreenProps) {
  const { colors } = useTheme();
  return (
    <SafeAreaView edges={edges} style={[styles.fill, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.fill}
      >
        {scroll ? (
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
        ) : (
          children
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: { padding: space.xl, gap: space.lg, flexGrow: 1 },
});
