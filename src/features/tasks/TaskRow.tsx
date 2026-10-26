import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTranslation } from '@/lib/i18n';
import type { Task } from '@/shared/schemas';
import { fontSize, radius, space, useTheme } from '@/theme';

/** Props of {@link TaskRow}. */
export interface TaskRowProps {
  task: Task;
  onToggle: (task: Task) => void;
  onDelete: (task: Task) => void;
}

/** One task: a checkbox with the title, and a delete button. */
export function TaskRow({ task, onToggle, onDelete }: TaskRowProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  return (
    <View style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: task.done }}
        accessibilityLabel={t(task.done ? 'tasks.toggleBack' : 'tasks.toggle', {
          title: task.title,
        })}
        onPress={() => onToggle(task)}
        style={styles.main}
        testID={`toggle-${task.title}`}
      >
        <Ionicons
          name={task.done ? 'checkmark-circle' : 'ellipse-outline'}
          size={26}
          color={task.done ? colors.accent : colors.muted}
        />
        <Text
          style={[
            styles.title,
            { color: task.done ? colors.muted : colors.text },
            task.done && styles.done,
          ]}
        >
          {task.title}
        </Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('tasks.delete', { title: task.title })}
        hitSlop={8}
        onPress={() => onDelete(task)}
        style={styles.delete}
        testID={`delete-${task.title}`}
      >
        <Ionicons name="trash-outline" size={20} color={colors.muted} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius,
    paddingLeft: space.md,
  },
  main: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: space.md, minHeight: 52 },
  title: { flex: 1, fontSize: fontSize.body, paddingVertical: space.md },
  done: { textDecorationLine: 'line-through' },
  delete: { padding: space.md },
});
