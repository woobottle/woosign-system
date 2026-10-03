import {useResolvedColors} from '../../core/hooks';
import {useRef, useState} from 'react';
import {useControllableState} from '../_shared/state';
import type {ComboboxWebProps} from './types';
export function Combobox({
  id,
  options,
  value,
  defaultValue = '',
  onValueChange,
  label,
  placeholder = '선택하세요',
  emptyMessage = '검색 결과가 없습니다',
  disabled,
  error,
  name,
  testID,
  style,
  className,
}: ComboboxWebProps) {
  const c = useResolvedColors();
  const [selected, setSelected] = useControllableState(
    value,
    defaultValue,
    onValueChange,
  );
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(-1);
  const input = useRef<HTMLInputElement>(null);
  const filtered = options.filter(option =>
    option.label.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
  );
  const enabled = filtered
    .map((option, i) => (option.disabled ? -1 : i))
    .filter(i => i >= 0);
  const selectedLabel =
    options.find(option => option.value === selected)?.label ?? '';
  const choose = (index: number) => {
    const option = filtered[index];
    if (!option || option.disabled) {
      return;
    }
    setSelected(option.value);
    setOpen(false);
    setQuery('');
    setActive(-1);
  };
  return (
    <div
      className={className}
      data-testid={testID}
      style={{position: 'relative', ...style}}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          setOpen(false);
          setQuery('');
        }
      }}>
      <label
        htmlFor={id}
        style={{display: 'block', marginBottom: 8, color: c.textPrimary}}>
        {label}
      </label>
      <input
        ref={input}
        id={id}
        role="combobox"
        aria-label={label}
        aria-expanded={open && !disabled}
        aria-controls={`${id}-options`}
        aria-autocomplete="list"
        aria-invalid={error || undefined}
        aria-activedescendant={
          open && active >= 0 && filtered[active] && !filtered[active].disabled
            ? `${id}-option-${active}`
            : undefined
        }
        disabled={disabled}
        placeholder={placeholder}
        value={open ? query : selectedLabel}
        onFocus={() => {
          setOpen(true);
          setQuery('');
          setActive(-1);
        }}
        onClick={() => setOpen(true)}
        onChange={event => {
          setQuery(event.currentTarget.value);
          setOpen(true);
          setActive(-1);
        }}
        onKeyDown={event => {
          if (event.nativeEvent.isComposing) {
            return;
          }
          if (event.key === 'Escape') {
            event.preventDefault();
            setOpen(false);
            setQuery('');
            setActive(-1);
          } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            setOpen(true);
            const index = enabled.indexOf(active);
            setActive(
              event.key === 'ArrowDown'
                ? enabled[(index + 1) % enabled.length] ?? -1
                : enabled[(index <= 0 ? enabled.length : index) - 1] ?? -1,
            );
          } else if (event.key === 'Enter' && open && active >= 0) {
            event.preventDefault();
            choose(active);
          }
        }}
        style={{
          boxSizing: 'border-box',
          width: '100%',
          height: 44,
          borderRadius: 12,
          padding: '0 14px',
          border: `1px solid ${error ? c.actionDanger : c.borderDefault}`,
          backgroundColor: c.card,
          color: c.textPrimary,
        }}
      />
      {name && (
        <input type="hidden" name={name} value={selected} disabled={disabled} />
      )}
      {open && !disabled && (
        <div
          id={`${id}-options`}
          role="listbox"
          aria-label={label}
          style={{
            position: 'absolute',
            zIndex: 1000,
            top: '100%',
            width: '100%',
            maxHeight: 240,
            overflow: 'auto',
            border: `1px solid ${c.borderDefault}`,
            borderRadius: 12,
            backgroundColor: c.popover,
            color: c.textPrimary,
          }}>
          {filtered.length ? (
            filtered.map((option, i) => (
              <div
                key={option.value}
                id={`${id}-option-${i}`}
                role="option"
                aria-selected={option.value === selected}
                aria-disabled={!!option.disabled}
                onMouseDown={event => event.preventDefault()}
                onMouseEnter={() => {
                  if (!option.disabled) {
                    setActive(i);
                  }
                }}
                onClick={() => choose(i)}
                style={{
                  padding: 12,
                  backgroundColor: active === i ? c.section : 'transparent',
                  opacity: option.disabled ? 0.5 : 1,
                  cursor: option.disabled ? 'not-allowed' : 'pointer',
                }}>
                {option.label}
              </div>
            ))
          ) : (
            <div role="status" style={{padding: 12}}>
              {emptyMessage}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
