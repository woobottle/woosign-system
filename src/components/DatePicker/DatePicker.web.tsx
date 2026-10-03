import {useState} from 'react';
import {Calendar} from '../Calendar';
import {Popover} from '../Popover';
import {useControllableState} from '../_shared/state';
import type {DatePickerWebProps} from './types';
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
  name,
  testID,
  style,
  className,
}: DatePickerWebProps) {
  const [selected, setSelected] = useControllableState(
    value,
    defaultValue,
    onValueChange,
  );
  const [open, setOpen] = useState(false);
  return (
    <div className={className} style={style}>
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
      {name && (
        <input type="hidden" name={name} value={selected} disabled={disabled} />
      )}
    </div>
  );
}
