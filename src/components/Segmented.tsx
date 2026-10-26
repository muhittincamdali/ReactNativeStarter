import { Pressable, StyleSheet, Text, View } from 'react-native';

import { fontSize, radius, space, useTheme } from '@/theme';

/** Props of {@link Segmented}. */
export interface SegmentedProps<Value extends string> {
  /** Read by screen readers as the name of the group. */
  label: string;
  value: Value;
  options: readonly { value: Value; label: string }[];
  onChange: (value: Value) => void;
}

/** A row of mutually exclusive options, announced as radio buttons. */
export function Segmented<Value extends string>({
  label,
  value,
  options,
  onChange,
}: SegmentedProps<Value>) {
  const { colors } = useTheme();
  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={label}
      style={[styles.group, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            onPress={() => onChange(option.value)}
            style={[styles.option, selected && { backgroundColor: colors.accent }]}
          >
            <Text style={[styles.text, { color: selected ? colors.onAccent : colors.text }]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { flexDirection: 'row', borderWidth: 1, borderRadius: radius, padding: 3, gap: 3 },
  option: {
    flex: 1,
    minHeight: 40,
    borderRadius: radius - 3,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.sm,
  },
  text: { fontSize: fontSize.caption, fontWeight: '600' },
});
