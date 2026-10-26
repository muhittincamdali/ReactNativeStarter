import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { useApi } from '@/lib/api-context';
import { errorMessageKey, isMessageKey, useTranslation } from '@/lib/i18n';
import { useSession } from '@/lib/session';
import { createTaskSchema, fieldErrors } from '@/shared/schemas';
import { fontSize, radius, space, useTheme } from '@/theme';

import { TaskRow } from './TaskRow';
import { useCreateTask, useDeleteTask, useTasks, useToggleTask } from './use-tasks';

/** The signed-in home screen: a field to add a task and the list of tasks. */
export function TasksScreen() {
  const api = useApi();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const name = useSession((state) => state.user?.name ?? '');
  const tasks = useTasks(api);
  const create = useCreateTask(api);
  const toggle = useToggleTask(api);
  const remove = useDeleteTask(api);
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);

  const items = tasks.data?.pages.flatMap((page) => page.items) ?? [];
  const open = items.filter((task) => !task.done).length;

  const add = () => {
    const parsed = createTaskSchema.safeParse({ title });
    if (!parsed.success) {
      const key = fieldErrors(parsed.error).title;
      setError(key && isMessageKey(key) ? t(key) : null);
      return;
    }
    setError(null);
    create.mutate(parsed.data.title, {
      onSuccess: () => setTitle(''),
      onError: (failure) => setError(t(errorMessageKey(failure))),
    });
  };

  const header = (
    <View style={styles.header}>
      <Text accessibilityRole="header" style={[styles.greeting, { color: colors.text }]}>
        {t('tasks.greeting', { name })}
      </Text>
      <Text style={[styles.count, { color: colors.muted }]}>
        {t('tasks.open', { count: open })}
      </Text>
      <View style={styles.addRow}>
        <TextInput
          accessibilityLabel={t('tasks.newPlaceholder')}
          placeholder={t('tasks.newPlaceholder')}
          placeholderTextColor={colors.muted}
          value={title}
          onChangeText={setTitle}
          onSubmitEditing={add}
          returnKeyType="done"
          style={[
            styles.input,
            {
              color: colors.text,
              backgroundColor: colors.surface,
              borderColor: error ? colors.danger : colors.border,
            },
          ]}
          testID="new-task"
        />
        <View style={styles.addButton}>
          <Button
            title={t('tasks.add')}
            onPress={add}
            loading={create.isPending}
            testID="add-task"
          />
        </View>
      </View>
      {error ? (
        <Text accessibilityLiveRegion="polite" role="alert" style={{ color: colors.danger }}>
          {error}
        </Text>
      ) : null}
    </View>
  );

  return (
    <Screen scroll={false} edges={['top']}>
      <FlatList
        data={items}
        keyExtractor={(task) => task.id}
        renderItem={({ item }) => (
          <TaskRow task={item} onToggle={toggle.mutate} onDelete={remove.mutate} />
        )}
        ListHeaderComponent={header}
        ListEmptyComponent={
          tasks.isPending ? (
            <ActivityIndicator color={colors.accent} />
          ) : tasks.isError ? (
            <View style={styles.empty}>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                {t('tasks.loadError')}
              </Text>
              <Text style={{ color: colors.muted }}>{t(errorMessageKey(tasks.error))}</Text>
              <Button
                title={t('common.retry')}
                variant="secondary"
                onPress={() => void tasks.refetch()}
              />
            </View>
          ) : (
            <View style={styles.empty}>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>{t('tasks.empty')}</Text>
              <Text style={{ color: colors.muted }}>{t('tasks.emptyHint')}</Text>
            </View>
          )
        }
        onEndReached={() => {
          if (tasks.hasNextPage && !tasks.isFetchingNextPage) void tasks.fetchNextPage();
        }}
        refreshControl={
          <RefreshControl
            refreshing={tasks.isRefetching && !tasks.isFetchingNextPage}
            onRefresh={() => void tasks.refetch()}
            tintColor={colors.accent}
          />
        }
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { padding: space.xl, gap: space.sm },
  header: { gap: space.sm, marginBottom: space.md },
  greeting: { fontSize: fontSize.largeTitle, fontWeight: '700' },
  count: { fontSize: fontSize.body },
  addRow: { flexDirection: 'row', gap: space.sm, marginTop: space.sm },
  input: {
    flex: 1,
    minHeight: 48,
    borderWidth: 1,
    borderRadius: radius,
    paddingHorizontal: space.md,
    fontSize: fontSize.body,
  },
  addButton: { minWidth: 88 },
  empty: { alignItems: 'center', gap: space.sm, paddingVertical: space.xxl },
  emptyTitle: { fontSize: fontSize.title, fontWeight: '600' },
});
