// A card that shows the numbers from GET /api/stats. Pass it a function that fetches them, for
// example `(signal) => fetchTaskStats(client, signal)`.
import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { errorMessageKey, useTranslation } from '@/lib/i18n';
import { fontSize, radius, space, useTheme } from '@/theme';

import type { TaskStats } from './schema';

export function TaskStatsCard({
  fetchStats,
}: {
  fetchStats: (signal: AbortSignal) => Promise<TaskStats>;
}) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const stats = useQuery({ queryKey: ['task-stats'], queryFn: ({ signal }) => fetchStats(signal) });

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {stats.isPending ? (
        <ActivityIndicator color={colors.accent} />
      ) : stats.isError ? (
        <Text style={{ color: colors.danger }}>{t(errorMessageKey(stats.error))}</Text>
      ) : (
        <Text accessibilityRole="summary" style={[styles.text, { color: colors.text }]}>
          {`${stats.data.done} / ${stats.data.total}`}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: radius, padding: space.lg, alignItems: 'center' },
  text: { fontSize: fontSize.title, fontWeight: '700' },
});
