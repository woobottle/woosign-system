import {View, Text, Pressable} from 'react-native';
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
        style={{borderRadius: 999, backgroundColor: c.section, padding: 12}}>
        <Text style={{color: c.textPrimary}}>
          {title} {expanded ? '−' : '+'}
        </Text>
      </Pressable>
      {expanded && (
        <View style={{paddingVertical: 12}}>
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
