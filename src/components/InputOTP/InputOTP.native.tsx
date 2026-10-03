import {useState} from 'react';
import {View, Text, TextInput} from 'react-native';
import {useResolvedColors} from '../../core/hooks';
import {useControllableState} from '../_shared/state';
import type {InputOTPNativeProps} from './types';
export function InputOTP({
  value,
  defaultValue = '',
  onChangeText,
  onComplete,
  length = 6,
  disabled,
  label = '인증 코드',
  error,
  testID,
  style,
}: InputOTPNativeProps) {
  const c = useResolvedColors();
  const count = Math.max(1, Math.min(12, Math.floor(length) || 6));
  const [raw, setValue] = useControllableState(
    value,
    defaultValue,
    onChangeText,
  );
  const current = raw.replace(/[^0-9]/g, '').slice(0, count);
  const [focused, setFocused] = useState(false);
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          maxWidth: '100%',
          gap: 8,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}>
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        pointerEvents="none"
        style={{flexDirection: 'row', flex: 1, gap: 8}}>
        {Array.from({length: count}, (_, i) => (
          <View
            key={i}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              maxWidth: 40,
              height: 48,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: error
                ? c.actionDanger
                : focused && i === Math.min(current.length, count - 1)
                ? c.borderFocus
                : c.borderDefault,
              backgroundColor: c.card,
            }}>
            <Text style={{color: c.textPrimary, fontSize: 20}}>
              {current[i] ?? ''}
            </Text>
          </View>
        ))}
      </View>
      <TextInput
        accessibilityLabel={label}
        testID={testID}
        value={current}
        editable={!disabled}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChangeText={text => {
          const next = text.replace(/[^0-9]/g, '').slice(0, count);
          setValue(next);
          if (next.length === count && next !== current) {
            onComplete?.(next);
          }
        }}
        caretHidden
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: 48,
          opacity: 0.01,
        }}
      />
    </View>
  );
}
