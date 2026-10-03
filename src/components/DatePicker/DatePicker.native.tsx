import {useState} from 'react';
import {View} from 'react-native';
import {Calendar} from '../Calendar/Calendar.native';
import {Popover} from '../Popover/Popover.native';
import {useControllableState} from '../_shared/state';
import type {DatePickerNativeProps} from './types';
export function DatePicker({
  value,
  defaultValue = '',
  onValueChange,
  min,
  max,
  isDateDisabled,
  locale,
  disabled,
  label,
  placeholder = '날짜 선택',
  testID,
  style,
}: DatePickerNativeProps) {
  const [selected, setSelected] = useControllableState(
    value,
    defaultValue,
    onValueChange,
  );
  const [open, setOpen] = useState(false);
  return (
    <View style={style}>
      <Popover
        label={`${label}: ${selected || placeholder}`}
        trigger={selected || placeholder}
        open={open}
        onOpenChange={setOpen}
        disabled={disabled}
        testID={testID}>
        <Calendar
          value={selected}
          min={min}
          max={max}
          isDateDisabled={isDateDisabled}
          locale={locale}
          style={{width: '100%'}}
          onValueChange={date => {
            setSelected(date);
            setOpen(false);
          }}
        />
      </Popover>
    </View>
  );
}
