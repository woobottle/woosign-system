/**
 * Variant system types
 * Inspired by class-variance-authority (CVA) but for JS objects
 */

// Style object type (can be React Native StyleSheet or CSS Properties)
export type StyleObject = Record<string, unknown>;

// Configuration for createVariants
export interface VariantConfig<
  TVariants extends Record<string, Record<string, StyleObject>>,
> {
  /** Base styles applied to all variants */
  base?: StyleObject;
  /** Variant definitions */
  variants: TVariants;
  /** Default variant values */
  defaultVariants?: {
    [K in keyof TVariants]?: keyof TVariants[K];
  };
  /** Compound variants for combining multiple variant conditions */
  compoundVariants?: Array<
    {
      [K in keyof TVariants]?: keyof TVariants[K];
    } & {
      style: StyleObject;
    }
  >;
}

// Props type derived from variant config
export type VariantProps<
  TVariants extends Record<string, Record<string, StyleObject>>,
> = {
  [K in keyof TVariants]?: keyof TVariants[K];
};

// Return type of createVariants
export type VariantFunction<
  TVariants extends Record<string, Record<string, StyleObject>>,
> = (props?: VariantProps<TVariants>) => StyleObject;
