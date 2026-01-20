/**
 * Card component - Web implementation
 * Pure React + inline styles (no react-native-web)
 */

import React, { forwardRef, useState, useCallback } from 'react';
import type {
  CardWebProps,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardContentProps,
  CardFooterProps,
} from './types';
import {
  cardVariants,
  cardHeaderStyle,
  cardTitleStyle,
  cardDescriptionStyle,
  cardContentStyle,
  cardFooterStyle,
  hoverStyle,
  disabledStyle,
} from './Card.styles';
import { mergeStyles } from '../../core/variants';

/**
 * Card component for web
 */
export const Card = forwardRef<HTMLDivElement, CardWebProps>(
  function Card(
    {
      variant = 'default',
      children,
      fullWidth = false,
      onPress,
      disabled = false,
      className,
      style,
      testID,
    },
    ref
  ) {
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    const handleClick = useCallback(() => {
      if (!disabled && onPress) {
        onPress();
      }
    }, [disabled, onPress]);

    // Get variant styles
    const containerStyles = cardVariants({ variant }) as React.CSSProperties;

    // Convert shadow styles for web
    const webShadow = variant === 'default'
      ? { boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' }
      : {};

    // Compose final card styles
    const cardStyle = mergeStyles(
      containerStyles,
      webShadow,
      fullWidth ? { width: '100%' } : undefined,
      disabled ? { ...disabledStyle, cursor: 'not-allowed' } : onPress ? { cursor: 'pointer' } : undefined,
      isHovered && !disabled && onPress ? hoverStyle : undefined,
      isPressed && !disabled && onPress ? { transform: 'scale(0.99)' } : undefined,
      { transition: 'all 150ms ease' },
      style
    ) as React.CSSProperties;

    return (
      <div
        ref={ref}
        className={className}
        style={cardStyle}
        onClick={onPress ? handleClick : undefined}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsPressed(false);
        }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        data-testid={testID}
        role={onPress ? 'button' : undefined}
        tabIndex={onPress && !disabled ? 0 : undefined}
        onKeyDown={onPress ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        } : undefined}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

/**
 * CardHeader component
 */
export function CardHeader({ children, style, className }: CardHeaderProps) {
  const headerStyle = mergeStyles(cardHeaderStyle, style) as React.CSSProperties;
  return (
    <div className={className} style={headerStyle}>
      {children}
    </div>
  );
}

CardHeader.displayName = 'CardHeader';

/**
 * CardTitle component
 */
export function CardTitle({ children, style, className }: CardTitleProps) {
  const titleStyle = mergeStyles(cardTitleStyle, { margin: 0 }, style) as React.CSSProperties;
  return (
    <h3 className={className} style={titleStyle}>
      {children}
    </h3>
  );
}

CardTitle.displayName = 'CardTitle';

/**
 * CardDescription component
 */
export function CardDescription({ children, style, className }: CardDescriptionProps) {
  const descStyle = mergeStyles(cardDescriptionStyle, { margin: 0 }, style) as React.CSSProperties;
  return (
    <p className={className} style={descStyle}>
      {children}
    </p>
  );
}

CardDescription.displayName = 'CardDescription';

/**
 * CardContent component
 */
export function CardContent({ children, style, className }: CardContentProps) {
  const contentStyle = mergeStyles(cardContentStyle, style) as React.CSSProperties;
  return (
    <div className={className} style={contentStyle}>
      {children}
    </div>
  );
}

CardContent.displayName = 'CardContent';

/**
 * CardFooter component
 */
export function CardFooter({ children, style, className }: CardFooterProps) {
  const footerStyle = mergeStyles(cardFooterStyle, style) as React.CSSProperties;
  return (
    <div className={className} style={footerStyle}>
      {children}
    </div>
  );
}

CardFooter.displayName = 'CardFooter';
