/**
 * Spacing System
 * 
 * Defines consistent spacing values for margins, paddings,
 * and gaps throughout the application.
 */

/**
 * Base spacing unit (4px)
 */
const SPACING_UNIT = 4;

/**
 * Spacing scale
 */
export const spacing = {
  // Named sizes
  none: 0,
  xs: SPACING_UNIT, // 4
  sm: SPACING_UNIT * 2, // 8
  md: SPACING_UNIT * 3, // 12
  lg: SPACING_UNIT * 4, // 16
  xl: SPACING_UNIT * 5, // 20
  '2xl': SPACING_UNIT * 6, // 24
  '3xl': SPACING_UNIT * 8, // 32
  '4xl': SPACING_UNIT * 10, // 40
  '5xl': SPACING_UNIT * 12, // 48
  '6xl': SPACING_UNIT * 16, // 64

  // Numeric scale
  0: 0,
  1: SPACING_UNIT, // 4
  2: SPACING_UNIT * 2, // 8
  3: SPACING_UNIT * 3, // 12
  4: SPACING_UNIT * 4, // 16
  5: SPACING_UNIT * 5, // 20
  6: SPACING_UNIT * 6, // 24
  8: SPACING_UNIT * 8, // 32
  10: SPACING_UNIT * 10, // 40
  12: SPACING_UNIT * 12, // 48
  16: SPACING_UNIT * 16, // 64
  20: SPACING_UNIT * 20, // 80
  24: SPACING_UNIT * 24, // 96
} as const;

/**
 * Screen padding
 */
export const screenPadding = {
  horizontal: spacing.lg,
  vertical: spacing.xl,
} as const;

/**
 * Border radius
 */
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
} as const;

export type Spacing = typeof spacing;
export type SpacingKey = keyof Spacing;

export default spacing;
