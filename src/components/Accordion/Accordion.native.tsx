import {View, Text, Pressable, StyleSheet} from 'react-native';
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
            style={[styles.item, {borderBottomColor: c.borderDefault}]}>
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
              style={[styles.header, blocked && styles.disabled]}>
              <Text style={[styles.title, {color: c.textPrimary}]}>
                {item.title} {open ? '−' : '+'}
              </Text>
            </Pressable>
            {open && (
              <View style={styles.content}>
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

const styles = StyleSheet.create({
  item: {borderBottomWidth: 1},
  header: {padding: 16},
  disabled: {opacity: 0.5},
  title: {fontWeight: '600'},
  content: {padding: 16},
});
