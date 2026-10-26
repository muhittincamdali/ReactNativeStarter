import { Link } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { Screen } from '@/components/Screen';
import { useTranslation } from '@/lib/i18n';
import { fontSize, useTheme } from '@/theme';

export default function NotFoundRoute() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  return (
    <Screen>
      <Text accessibilityRole="header" style={[styles.title, { color: colors.text }]}>
        {t('notFound.title')}
      </Text>
      <Link href="/" style={[styles.link, { color: colors.accent }]}>
        {t('notFound.link')}
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: fontSize.title, fontWeight: '600' },
  link: { fontSize: fontSize.body },
});
