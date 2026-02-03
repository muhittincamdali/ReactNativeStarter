/**
 * Container Component
 * 
 * Safe area container that handles notches, status bars,
 * and provides consistent padding across screens.
 */

import React, { memo } from 'react';
import {
  StyleSheet,
  View,
  ViewStyle,
  StatusBar,
  Platform,
} from 'react-native';
import {
  SafeAreaView,
  Edge,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { useTheme } from '../../hooks/useTheme';

interface ContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  edges?: Edge[];
  disablePadding?: boolean;
  backgroundColor?: string;
}

function ContainerComponent({
  children,
  style,
  edges = ['top', 'bottom'],
  disablePadding = false,
  backgroundColor,
}: ContainerProps): React.JSX.Element {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: backgroundColor || colors.background,
  };

  return (
    <SafeAreaView style={[containerStyle, style]} edges={edges}>
      <View
        style={[
          styles.content,
          !disablePadding && styles.padding,
        ]}
      >
        {children}
      </View>
    </SafeAreaView>
  );
}

export const Container = memo(ContainerComponent);

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  padding: {
    paddingHorizontal: 0,
  },
});

export default Container;
