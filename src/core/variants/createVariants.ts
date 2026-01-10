/**
 * createVariants - CVA-style variant system for React Native
 *
 * Creates a function that returns style objects based on variant props.
 * Inspired by class-variance-authority but works with JS objects instead of CSS classes.
 *
 * @example
 * ```tsx
 * const buttonVariants = createVariants({
 *   base: {
 *     display: 'flex',
 *     alignItems: 'center',
 *     justifyContent: 'center',
 *   },
 *   variants: {
 *     variant: {
 *       default: { backgroundColor: '#0F172A' },
 *       destructive: { backgroundColor: '#EF4444' },
 *       outline: { borderWidth: 1, borderColor: '#E2E8F0' },
 *       secondary: { backgroundColor: '#F1F5F9' },
 *       ghost: { backgroundColor: 'transparent' },
 *       link: { backgroundColor: 'transparent' },
 *     },
 *     size: {
 *       default: { height: 40, paddingHorizontal: 16 },
 *       sm: { height: 36, paddingHorizontal: 12 },
 *       lg: { height: 44, paddingHorizontal: 32 },
 *       icon: { height: 40, width: 40 },
 *     },
 *   },
 *   defaultVariants: {
 *     variant: 'default',
 *     size: 'default',
 *   },
 *   compoundVariants: [
 *     {
 *       variant: 'outline',
 *       size: 'sm',
 *       style: { borderRadius: 4 },
 *     },
 *   ],
 * });
 *
 * // Usage
 * const styles = buttonVariants({ variant: 'destructive', size: 'lg' });
 * // Returns merged style object
 * ```
 */

import type {
  StyleObject,
  VariantConfig,
  VariantProps,
  VariantFunction,
} from './types';

export function createVariants<
  TVariants extends Record<string, Record<string, StyleObject>>,
>(config: VariantConfig<TVariants>): VariantFunction<TVariants> {
  const { base = {}, variants, defaultVariants = {}, compoundVariants = [] } = config;

  return function getVariantStyles(
    props?: VariantProps<TVariants>
  ): StyleObject {
    // Merge default variants with provided props
    const resolvedVariants = {
      ...defaultVariants,
      ...props,
    } as Record<string, string | undefined>;

    // Start with base styles
    let result: StyleObject = { ...base };

    // Apply variant styles
    for (const [variantKey, variantValue] of Object.entries(resolvedVariants)) {
      if (variantValue !== undefined) {
        const variantStyles = variants[variantKey]?.[variantValue];
        if (variantStyles) {
          result = { ...result, ...variantStyles };
        }
      }
    }

    // Apply compound variants
    for (const compound of compoundVariants) {
      const { style, ...conditions } = compound;

      // Check if all conditions match
      const matches = Object.entries(conditions).every(
        ([key, value]) => resolvedVariants[key] === value
      );

      if (matches && style) {
        result = { ...result, ...style };
      }
    }

    return result;
  };
}

/**
 * Helper to merge multiple style objects
 */
export function mergeStyles(
  ...styles: (StyleObject | undefined | null | false)[]
): StyleObject {
  return Object.assign({}, ...styles.filter(Boolean));
}
