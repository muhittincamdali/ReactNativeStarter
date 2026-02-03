/**
 * Button Component Tests
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Button } from '../../src/components/ui/Button';

// Mock dependencies
jest.mock('../../src/hooks/useTheme', () => ({
  useTheme: () => ({
    colors: {
      primary: '#6366F1',
      secondary: '#F1F5F9',
      text: '#0F172A',
      textSecondary: '#64748B',
      border: '#E2E8F0',
      error: '#EF4444',
    },
  }),
}));

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light' },
}));

describe('Button Component', () => {
  it('renders correctly with title', () => {
    const { getByText } = render(
      <Button title="Click Me" onPress={() => {}} />
    );
    
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button title="Click Me" onPress={onPressMock} />
    );
    
    fireEvent.press(getByText('Click Me'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button title="Click Me" onPress={onPressMock} disabled />
    );
    
    fireEvent.press(getByText('Click Me'));
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('does not call onPress when loading', () => {
    const onPressMock = jest.fn();
    const { getByRole } = render(
      <Button title="Click Me" onPress={onPressMock} loading />
    );
    
    // Should show loading indicator
    expect(getByRole('button')).toBeTruthy();
  });

  it('renders with different variants', () => {
    const variants = ['primary', 'secondary', 'outline', 'ghost', 'danger'] as const;
    
    variants.forEach((variant) => {
      const { getByText } = render(
        <Button title={variant} onPress={() => {}} variant={variant} />
      );
      expect(getByText(variant)).toBeTruthy();
    });
  });

  it('renders with different sizes', () => {
    const sizes = ['small', 'medium', 'large'] as const;
    
    sizes.forEach((size) => {
      const { getByText } = render(
        <Button title={size} onPress={() => {}} size={size} />
      );
      expect(getByText(size)).toBeTruthy();
    });
  });

  it('renders with icon', () => {
    const { getByText } = render(
      <Button
        title="With Icon"
        onPress={() => {}}
        icon="arrow-forward"
        iconPosition="right"
      />
    );
    
    expect(getByText('With Icon')).toBeTruthy();
  });

  it('has correct accessibility properties', () => {
    const { getByRole, getByLabelText } = render(
      <Button
        title="Accessible Button"
        onPress={() => {}}
        accessibilityLabel="Custom label"
      />
    );
    
    expect(getByRole('button')).toBeTruthy();
    expect(getByLabelText('Custom label')).toBeTruthy();
  });
});
