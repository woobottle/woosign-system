/**
 * Badge component - React Native implementation
 */

import {forwardRef, useMemo} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import type {BadgeNativeProps} from './types';
import {getBadgeVariants, getBadgeTextVariants} from './Badge.styles';
import {useResolvedColors} from '../../core/hooks';

/**
 * Badge component for React Native
 */
export const Badge = forwardRef<View, BadgeNativeProps>(function Badge(
  {variant = 'default', children, style, textStyle, testID},
  ref,
) {
  const colors = useResolvedColors();
  const badgeVariants = useMemo(() => getBadgeVariants(colors), [colors]);
  const badgeTextVariants = useMemo(
    () => getBadgeTextVariants(colors),
    [colors],
  );

  // Get variant styles
  const containerStyles = badgeVariants({variant});
  const labelStyles = badgeTextVariants({variant});

  return (
    <View
      ref={ref}
      testID={testID}
      style={[styles.base, containerStyles, style]}>
      {typeof children === 'string' ? (
        <Text style={[labelStyles, textStyle]}>{children}</Text>
      ) : (
        children
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
});

Badge.displayName = 'Badge';
