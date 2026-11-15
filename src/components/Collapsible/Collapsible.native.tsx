import {View, Text, Pressable, StyleSheet} from 'react-native';
import {useResolvedColors} from '../../core/hooks';
import {useControllableState} from '../_shared/state';
import type {CollapsibleNativeProps} from './types';
export function Collapsible({
  title,
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  disabled,
  testID,
  style,
}: CollapsibleNativeProps) {
  const c = useResolvedColors();
  const [expanded, setExpanded] = useControllableState(
    open,
    defaultOpen,
    onOpenChange,
  );
  return (
    <View testID={testID} style={style}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{expanded, disabled}}
        disabled={disabled}
        onPress={() => setExpanded(!expanded)}
        style={[styles.trigger, {backgroundColor: c.section}]}>
        <Text style={{color: c.textPrimary}}>
          {title} {expanded ? '−' : '+'}
        </Text>
      </Pressable>
      {expanded && (
        <View style={styles.content}>
          {typeof children === 'string' ? (
            <Text style={{color: c.textPrimary}}>{children}</Text>
          ) : (
            children
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  trigger: {borderRadius: 999, padding: 12},
  content: {paddingVertical: 12},
});
