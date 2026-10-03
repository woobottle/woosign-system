import {useRef, useState} from 'react';
import {View} from 'react-native';
import {useResolvedColors} from '../../core/hooks';
import {useControllableState, normalizeRange} from '../_shared/state';
import type {SliderNativeProps} from './types';
export function Slider({
  value,
  defaultValue = 0,
  onValueChange,
  onValueCommit,
  min = 0,
  max = 100,
  step = 1,
  disabled,
  label,
  testID,
  style,
}: SliderNativeProps) {
  const c = useResolvedColors();
  const lower = Number.isFinite(min) ? min : 0;
  const upper = Number.isFinite(max) ? Math.max(lower, max) : 100;
  const increment = Number.isFinite(step) && step > 0 ? step : 1;
  const [raw, setValue] = useControllableState(
    value,
    defaultValue,
    onValueChange,
  );
  const current = normalizeRange(raw, lower, upper, increment);
  const [width, setWidth] = useState(0);
  const gesture = useRef({x: 0, pageX: 0});
  const last = useRef(current);
  const blocked = !!disabled || upper === lower;
  const update = (x: number) => {
    if (width <= 0 || blocked) {
      return;
    }
    const next = normalizeRange(
      lower + Math.max(0, Math.min(1, x / width)) * (upper - lower),
      lower,
      upper,
      increment,
    );
    last.current = next;
    setValue(next);
  };
  const ratio = upper === lower ? 0 : (current - lower) / (upper - lower);
  return (
    <View
      testID={testID}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityState={{disabled: blocked}}
      accessibilityValue={{min: lower, max: upper, now: current}}
      accessibilityActions={[
        {name: 'increment', label: '증가'},
        {name: 'decrement', label: '감소'},
      ]}
      onAccessibilityAction={event => {
        if (
          !blocked &&
          ['increment', 'decrement'].includes(event.nativeEvent.actionName)
        ) {
          const next = normalizeRange(
            current +
              (event.nativeEvent.actionName === 'increment'
                ? increment
                : -increment),
            lower,
            upper,
            increment,
          );
          setValue(next);
          onValueCommit?.(next);
        }
      }}
      onLayout={event => setWidth(event.nativeEvent.layout.width)}
      onStartShouldSetResponder={() => !blocked}
      onMoveShouldSetResponder={() => !blocked}
      onResponderGrant={event => {
        gesture.current = {
          x: event.nativeEvent.locationX,
          pageX: event.nativeEvent.pageX,
        };
        update(event.nativeEvent.locationX);
      }}
      onResponderMove={event =>
        update(
          gesture.current.x + event.nativeEvent.pageX - gesture.current.pageX,
        )
      }
      onResponderRelease={() => onValueCommit?.(last.current)}
      style={[
        {height: 44, justifyContent: 'center', opacity: blocked ? 0.5 : 1},
        style,
      ]}>
      <View
        pointerEvents="none"
        style={{height: 4, borderRadius: 999, backgroundColor: c.section}}>
        <View
          style={{
            height: 4,
            width: `${ratio * 100}%`,
            borderRadius: 999,
            backgroundColor: c.actionPrimary,
          }}
        />
      </View>
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: Math.max(0, (width - 20) * ratio),
          width: 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: c.actionPrimary,
        }}
      />
    </View>
  );
}
