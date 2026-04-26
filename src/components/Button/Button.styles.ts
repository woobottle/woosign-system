/**
 * Button styles — WooBottle "Paper & Ink"
 *
 * Buttons are ALWAYS full-pill. Hierarchy comes from color role, not shape.
 * Press state is a tactile squeeze (scale 0.95), 200ms calm ease.
 */

import {createVariants} from '../../core/variants';
import {
  colors,
  spacing,
  borderRadius,
  typography,
  shadowsCss,
  whiteAlpha,
} from '../../core/theme/tokens';

/**
 * Button container variants
 *
 * Padding per spec: sm 8/16, default 10/18, lg 12/20.
 * All variants share the same pill radius.
 */
export const buttonVariants = createVariants({
  base: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: 'transparent',
    gap: spacing[2],
  },
  variants: {
    variant: {
      default: {
        backgroundColor: colors.actionPrimary,
        borderColor: colors.actionPrimary,
      },
      destructive: {
        backgroundColor: colors.actionDanger,
        borderColor: colors.actionDanger,
      },
      outline: {
        backgroundColor: 'transparent',
        borderColor: colors.actionPrimary,
      },
      secondary: {
        backgroundColor: colors.card,
        borderColor: colors.borderDefault,
      },
      ghost: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
      },
      dark: {
        backgroundColor: colors.actionDark,
        borderColor: colors.actionDark,
      },
      inverse: {
        backgroundColor: 'transparent',
        borderColor: colors.borderInverse,
      },
      link: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
      },
      forest: {
        backgroundColor: colors.actionForest,
        borderColor: colors.actionForest,
      },
    },
    size: {
      default: {
        height: 40,
        paddingLeft: 18,
        paddingRight: 18,
      },
      sm: {
        height: 36,
        paddingLeft: 16,
        paddingRight: 16,
      },
      lg: {
        height: 48,
        paddingLeft: 20,
        paddingRight: 20,
      },
      icon: {
        height: 40,
        width: 40,
        paddingLeft: 0,
        paddingRight: 0,
      },
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

/**
 * Button text variants
 *
 * Semibold label, tight tracking, sentence case (casing is copy-side only).
 */
export const buttonTextVariants = createVariants({
  base: {
    fontWeight: typography.fontWeight.semibold,
    fontSize: typography.fontSize.bodySm.size,
    lineHeight: typography.fontSize.bodySm.lineHeight,
    letterSpacing: typography.letterSpacing.tight,
    textAlign: 'center',
  },
  variants: {
    variant: {
      default: {
        color: colors.textInverse,
      },
      destructive: {
        color: colors.textInverse,
      },
      outline: {
        color: colors.actionPrimary,
      },
      secondary: {
        color: colors.textPrimary,
      },
      ghost: {
        color: colors.actionPrimary,
      },
      dark: {
        color: colors.textInverse,
      },
      inverse: {
        color: colors.textInverse,
      },
      link: {
        color: colors.actionPrimary,
        textDecorationLine: 'underline',
      },
      forest: {
        color: colors.textInverse,
      },
    },
    size: {
      default: {
        fontSize: typography.fontSize.bodySm.size,
      },
      sm: {
        fontSize: typography.fontSize.caption.size,
      },
      lg: {
        fontSize: typography.fontSize.bodyMd.size,
      },
      icon: {
        fontSize: typography.fontSize.bodySm.size,
      },
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

/**
 * Hover styles (web only). "Hover is for promise, not drama" — no lift or scale.
 */
export const hoverStyles: Record<string, React.CSSProperties> = {
  default: {
    backgroundColor: colors.actionPrimaryHover,
    borderColor: colors.actionPrimaryHover,
  },
  destructive: {opacity: 0.9},
  outline: {backgroundColor: colors.successTint},
  secondary: {backgroundColor: colors.section},
  ghost: {backgroundColor: colors.successTint},
  dark: {backgroundColor: '#000000', borderColor: '#000000'},
  inverse: {backgroundColor: whiteAlpha[10]},
  link: {textDecoration: 'underline'},
  forest: {
    backgroundColor: colors.actionForestHover,
    borderColor: colors.actionForestHover,
  },
};

/**
 * Focus ring — ember 22% glow (matches wb-input:focus in colors_and_type.css)
 */
export const focusRingStyle: React.CSSProperties = {
  outline: 'none',
  boxShadow: shadowsCss.focusRing,
};

/**
 * Disabled style
 */
export const disabledStyle = {
  opacity: 0.5,
};

/**
 * Pressed style for native — a tactile squeeze per spec.
 */
export const pressedStyle = {
  opacity: 1,
  transform: [{scale: 0.95}],
};
