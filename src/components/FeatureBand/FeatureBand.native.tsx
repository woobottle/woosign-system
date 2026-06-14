import {forwardRef} from 'react';
import {View} from 'react-native';
import type {FeatureBandNativeProps} from './types';
import {getFeatureBandStyle} from './FeatureBand.styles';
import {useResolvedColors} from '../../core/hooks';

export const FeatureBand = forwardRef<View, FeatureBandNativeProps>(
  function FeatureBand(
    {tone = 'inverse', rounded = true, children, style, testID},
    ref,
  ) {
    const colors = useResolvedColors();
    const base = getFeatureBandStyle(colors, tone, rounded);
    return (
      <View ref={ref} testID={testID} style={[base, style]}>
        {children}
      </View>
    );
  },
);

FeatureBand.displayName = 'FeatureBand';
