import {forwardRef} from 'react';
import type {TabsWebProps} from './types';
import {getTabsStyles} from './Tabs.styles';

export const Tabs = forwardRef<HTMLDivElement, TabsWebProps>(function Tabs(
  {items, value, onChange, inverse = false, className, style, testID},
  ref,
) {
  const s = getTabsStyles(inverse);
  return (
    <div
      ref={ref}
      role="tablist"
      className={className}
      data-testid={testID}
      style={{display: 'flex', ...s.rail, ...style}}>
      {items.map(item => {
        const active = item.key === value;
        return (
          <button
            key={item.key}
            role="tab"
            aria-selected={active}
            disabled={item.disabled}
            onClick={() => !item.disabled && onChange(item.key)}
            style={{
              background: 'none',
              border: 'none',
              cursor: item.disabled ? 'not-allowed' : 'pointer',
              opacity: item.disabled ? 0.5 : 1,
              ...s.tab,
              ...(active ? s.tabActive : {}),
              ...s.label,
              ...(active ? s.labelActive : {}),
            }}>
            {item.label}
          </button>
        );
      })}
    </div>
  );
});

Tabs.displayName = 'Tabs';
