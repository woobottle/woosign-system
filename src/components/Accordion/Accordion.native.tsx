import {View, Text, Pressable} from 'react-native';
import {useResolvedColors} from '../../core/hooks';
import {useControllableState} from '../_shared/state';
import type {AccordionNativeProps} from './types';
export function Accordion({
  items,
  value,
  defaultValue = [],
  onValueChange,
  multiple = false,
  disabled,
  testID,
  style,
}: AccordionNativeProps) {
  const c = useResolvedColors();
  const [selected, setSelected] = useControllableState(
    value,
    defaultValue,
    onValueChange,
  );
  return (
    <View testID={testID} style={style}>
      {items.map(item => {
        const open = selected.includes(item.value);
        const blocked = disabled || item.disabled;
        return (
          <View
            key={item.value}
            style={{borderBottomWidth: 1, borderBottomColor: c.borderDefault}}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={item.title}
              accessibilityState={{expanded: open, disabled: !!blocked}}
              disabled={blocked}
              onPress={() =>
                setSelected(
                  open
                    ? selected.filter(v => v !== item.value)
                    : multiple
                    ? [...selected, item.value]
                    : [item.value],
                )
              }
              style={{padding: 16, opacity: blocked ? 0.5 : 1}}>
              <Text style={{color: c.textPrimary, fontWeight: '600'}}>
                {item.title} {open ? '−' : '+'}
              </Text>
            </Pressable>
            {open && (
              <View style={{padding: 16}}>
                {typeof item.content === 'string' ? (
                  <Text style={{color: c.textPrimary}}>{item.content}</Text>
                ) : (
                  item.content
                )}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}
