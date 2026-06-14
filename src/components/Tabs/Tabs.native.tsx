import {forwardRef} from 'react';
import {Pressable, Text, View} from 'react-native';
import type {TabsNativeProps} from './types';
import {getTabsStyles} from './Tabs.styles';
import {useResolvedColors} from '../../core/hooks';

export const Tabs = forwardRef<View, TabsNativeProps>(function Tabs(
  {
    items,
    value,
    onChange,
    inverse = false,
    style,
    tabStyle,
    labelStyle,
    testID,
  },
  ref,
) {
  const colors = useResolvedColors();
  const s = getTabsStyles(colors, inverse);
  return (
    <View ref={ref} testID={testID} style={[s.rail, style]}>
      {items.map(item => {
        const active = item.key === value;
        return (
          <Pressable
            key={item.key}
            onPress={() => !item.disabled && onChange(item.key)}
            disabled={item.disabled}
            style={[
              s.tab,
              active ? s.tabActive : null,
              item.disabled ? {opacity: 0.5} : null,
              tabStyle,
            ]}>
            {typeof item.label === 'string' ? (
              <Text
                style={[s.label, active ? s.labelActive : null, labelStyle]}>
                {item.label}
              </Text>
            ) : (
              item.label
            )}
          </Pressable>
        );
      })}
    </View>
  );
});

Tabs.displayName = 'Tabs';
