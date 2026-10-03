import {Pressable, Text} from 'react-native';
import {useResolvedColors} from '../../core/hooks';
import {BottomSheet} from '../BottomSheet/BottomSheet.native';
import {useControllableState} from '../_shared/state';
import type {DropdownMenuNativeProps} from './types';
export function DropdownMenu({
  trigger,
  label,
  items,
  open,
  defaultOpen = false,
  onOpenChange,
  disabled,
  testID,
  style,
}: DropdownMenuNativeProps) {
  const c = useResolvedColors();
  const [expanded, setExpanded] = useControllableState(
    open,
    defaultOpen,
    onOpenChange,
  );
  return (
    <>
      <Pressable
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{disabled, expanded: expanded && !disabled}}
        testID={testID}
        onPress={() => setExpanded(!expanded)}
        style={{
          padding: 12,
          borderRadius: 999,
          borderWidth: 1,
          borderColor: c.borderDefault,
          backgroundColor: c.card,
        }}>
        {typeof trigger === 'string' ? (
          <Text style={{color: c.textPrimary}}>{trigger}</Text>
        ) : (
          trigger
        )}
      </Pressable>
      <BottomSheet
        open={expanded && !disabled}
        onClose={() => setExpanded(false)}
        style={style}>
        <BottomSheet.Header>
          <BottomSheet.Title>{label}</BottomSheet.Title>
        </BottomSheet.Header>
        <BottomSheet.Body>
          {items.map(item => (
            <Pressable
              key={item.value}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              accessibilityState={{disabled: !!item.disabled}}
              disabled={item.disabled}
              onPress={() => {
                setExpanded(false);
                item.onSelect?.();
              }}
              style={{padding: 14, opacity: item.disabled ? 0.5 : 1}}>
              <Text
                style={{
                  color: item.destructive ? c.actionDanger : c.textPrimary,
                }}>
                {item.label}
              </Text>
            </Pressable>
          ))}
        </BottomSheet.Body>
      </BottomSheet>
    </>
  );
}
