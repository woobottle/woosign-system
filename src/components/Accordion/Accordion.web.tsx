import {useResolvedColors} from '../../core/hooks';
import {useRef} from 'react';
import {useControllableState} from '../_shared/state';
import type {AccordionWebProps} from './types';
export function Accordion({
  id,
  items,
  value,
  defaultValue = [],
  onValueChange,
  multiple = false,
  disabled,
  testID,
  style,
  className,
}: AccordionWebProps) {
  const c = useResolvedColors();
  const [selected, setSelected] = useControllableState(
    value,
    defaultValue,
    onValueChange,
  );
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  return (
    <div data-testid={testID} className={className} style={style}>
      {items.map((item, i) => {
        const open = selected.includes(item.value);
        const blocked = disabled || item.disabled;
        return (
          <div
            key={item.value}
            style={{borderBottom: `1px solid ${c.borderDefault}`}}>
            <h3 style={{margin: 0}}>
              <button
                type="button"
                ref={el => {
                  refs.current[i] = el;
                }}
                id={`${id}-${i}-trigger`}
                aria-controls={`${id}-${i}-content`}
                aria-expanded={open}
                disabled={blocked}
                onClick={() =>
                  setSelected(
                    open
                      ? selected.filter(v => v !== item.value)
                      : multiple
                      ? [...selected, item.value]
                      : [item.value],
                  )
                }
                onKeyDown={event => {
                  const eligible = refs.current.filter(
                    (el): el is HTMLButtonElement => !!el && !el.disabled,
                  );
                  const index = eligible.indexOf(event.currentTarget);
                  let next = index;
                  if (event.key === 'ArrowDown') {
                    next = (index + 1) % eligible.length;
                  } else if (event.key === 'ArrowUp') {
                    next = (index - 1 + eligible.length) % eligible.length;
                  } else if (event.key === 'Home') {
                    next = 0;
                  } else if (event.key === 'End') {
                    next = eligible.length - 1;
                  } else {
                    return;
                  }
                  event.preventDefault();
                  eligible[next]?.focus();
                }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: 16,
                  border: 0,
                  borderRadius: 999,
                  background: 'transparent',
                  color: c.textPrimary,
                  opacity: blocked ? 0.5 : 1,
                }}>
                {item.title} {open ? '−' : '+'}
              </button>
            </h3>
            <div
              role="region"
              id={`${id}-${i}-content`}
              aria-labelledby={`${id}-${i}-trigger`}
              hidden={!open}
              style={{padding: 16, color: c.textPrimary}}>
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
