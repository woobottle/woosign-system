import {Pressable, Text} from 'react-native';
import {useResolvedColors} from '../../core/hooks';
import {BottomSheet} from '../BottomSheet/BottomSheet.native';
import {useControllableState} from '../_shared/state';
import type {PopoverNativeProps} from './types';
export function Popover({
  trigger,
  label,
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  disabled,
  testID,
  style,
}: PopoverNativeProps) {
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
        onPress={() => setExpanded(!expanded)}
        testID={testID}
        style={{
          padding: 12,
          borderRadius: 999,
          borderWidth: 1,
          borderColor: c.borderDefault,
          backgroundColor: c.card,
        }}>
        {typeof trigger === 'string' || typeof trigger === 'number' ? (
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
          {typeof children === 'string' ? (
            <Text style={{color: c.textPrimary}}>{children}</Text>
          ) : (
            children
          )}
        </BottomSheet.Body>
        <BottomSheet.Footer>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="닫기"
            onPress={() => setExpanded(false)}
            style={{
              padding: 12,
              borderRadius: 999,
              backgroundColor: c.section,
            }}>
            <Text style={{color: c.textPrimary}}>닫기</Text>
          </Pressable>
        </BottomSheet.Footer>
      </BottomSheet>
    </>
  );
}
