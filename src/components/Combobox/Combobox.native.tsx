import {useState} from 'react';
import {Pressable, Text, View, TextInput} from 'react-native';
import {useResolvedColors} from '../../core/hooks';
import {BottomSheet} from '../BottomSheet/BottomSheet.native';
import {useControllableState} from '../_shared/state';
import type {ComboboxNativeProps} from './types';
export function Combobox({
  options,
  value,
  defaultValue = '',
  onValueChange,
  label,
  placeholder = '선택하세요',
  searchPlaceholder = '검색',
  emptyMessage = '검색 결과가 없습니다',
  disabled,
  error,
  testID,
  style,
}: ComboboxNativeProps) {
  const c = useResolvedColors();
  const [selected, setSelected] = useControllableState(
    value,
    defaultValue,
    onValueChange,
  );
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const selectedLabel =
    options.find(option => option.value === selected)?.label ?? placeholder;
  const filtered = options.filter(option =>
    option.label.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
  );
  return (
    <View style={style}>
      <Text style={{color: c.textPrimary, marginBottom: 8}}>{label}</Text>
      <Pressable
        testID={testID}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{disabled, expanded: open && !disabled}}
        accessibilityValue={{text: selectedLabel}}
        onPress={() => {
          setOpen(true);
          setQuery('');
        }}
        style={{
          height: 44,
          justifyContent: 'center',
          borderRadius: 12,
          paddingHorizontal: 14,
          borderWidth: 1,
          borderColor: error ? c.actionDanger : c.borderDefault,
          backgroundColor: c.card,
          opacity: disabled ? 0.5 : 1,
        }}>
        <Text style={{color: c.textPrimary}}>{selectedLabel}</Text>
      </Pressable>
      <BottomSheet open={open && !disabled} onClose={() => setOpen(false)}>
        <BottomSheet.Header>
          <BottomSheet.Title>{label}</BottomSheet.Title>
          <TextInput
            accessibilityLabel={searchPlaceholder}
            placeholder={searchPlaceholder}
            placeholderTextColor={c.textTertiary}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            style={{
              height: 44,
              borderWidth: 1,
              borderColor: c.borderDefault,
              borderRadius: 12,
              color: c.textPrimary,
              paddingHorizontal: 12,
            }}
          />
        </BottomSheet.Header>
        <BottomSheet.Body>
          {filtered.length ? (
            filtered.map(option => (
              <Pressable
                key={option.value}
                accessibilityRole="radio"
                accessibilityLabel={option.label}
                accessibilityState={{
                  checked: option.value === selected,
                  disabled: !!option.disabled,
                }}
                disabled={option.disabled}
                onPress={() => {
                  setSelected(option.value);
                  setOpen(false);
                }}
                style={{
                  padding: 14,
                  backgroundColor:
                    option.value === selected ? c.section : c.card,
                  opacity: option.disabled ? 0.5 : 1,
                }}>
                <Text style={{color: c.textPrimary}}>{option.label}</Text>
              </Pressable>
            ))
          ) : (
            <Text
              accessibilityLiveRegion="polite"
              style={{color: c.textSecondary}}>
              {emptyMessage}
            </Text>
          )}
        </BottomSheet.Body>
      </BottomSheet>
    </View>
  );
}
