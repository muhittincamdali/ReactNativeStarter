import Constants from 'expo-constants';
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { Segmented } from '@/components/Segmented';
import { apiBaseUrl } from '@/lib/api';
import { useApi } from '@/lib/api-context';
import { useTranslation } from '@/lib/i18n';
import { usePreferences } from '@/lib/preferences';
import { endSession, useSession } from '@/lib/session';
import { fontSize, radius, space, useTheme } from '@/theme';

function Section({ title, children }: { title: string; children: ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={styles.section}>
      <Text accessibilityRole="header" style={[styles.sectionTitle, { color: colors.muted }]}>
        {title}
      </Text>
      {children}
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, { color: colors.text }]}>{label}</Text>
      <Text selectable style={[styles.rowValue, { color: colors.muted }]}>
        {value}
      </Text>
    </View>
  );
}

/** Appearance, language, the signed-in account and the build details. */
export function SettingsScreen() {
  const api = useApi();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const user = useSession((state) => state.user);
  const { appearance, language, setAppearance, setLanguage } = usePreferences();

  const signOut = () => {
    // The server forgets the token if it can be reached; the device forgets it either way.
    void api.signOut().catch(() => undefined);
    void endSession();
  };

  return (
    <Screen edges={['top']}>
      <Text accessibilityRole="header" style={[styles.title, { color: colors.text }]}>
        {t('settings.title')}
      </Text>

      <Section title={t('settings.appearance')}>
        <Segmented
          label={t('settings.appearance')}
          value={appearance}
          onChange={setAppearance}
          options={[
            { value: 'system', label: t('settings.appearance.system') },
            { value: 'light', label: t('settings.appearance.light') },
            { value: 'dark', label: t('settings.appearance.dark') },
          ]}
        />
      </Section>

      <Section title={t('settings.language')}>
        <Segmented
          label={t('settings.language')}
          value={language}
          onChange={setLanguage}
          options={[
            { value: 'system', label: t('settings.language.system') },
            { value: 'en', label: 'English' },
            { value: 'tr', label: 'Türkçe' },
          ]}
        />
      </Section>

      <Section title={t('settings.account')}>
        <View
          style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Row label={t('fields.name')} value={user?.name ?? ''} />
          <Row label={t('fields.email')} value={user?.email ?? ''} />
        </View>
        <Button
          title={t('settings.signOut')}
          variant="secondary"
          onPress={signOut}
          testID="sign-out"
        />
      </Section>

      <Section title={t('settings.about')}>
        <View
          style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Row label={t('settings.version')} value={Constants.expoConfig?.version ?? '—'} />
          <Row
            label={t('settings.server')}
            value={
              apiBaseUrl === null
                ? t('settings.notConfigured')
                : apiBaseUrl === ''
                  ? t('settings.sameOrigin')
                  : apiBaseUrl
            }
          />
        </View>
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: fontSize.largeTitle, fontWeight: '700' },
  section: { gap: space.sm },
  sectionTitle: { fontSize: fontSize.caption, fontWeight: '600', textTransform: 'uppercase' },
  card: { borderWidth: 1, borderRadius: radius, paddingHorizontal: space.md },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: space.md,
    paddingVertical: space.md,
  },
  rowLabel: { fontSize: fontSize.body },
  rowValue: { fontSize: fontSize.body, flexShrink: 1, textAlign: 'right' },
});
