import {useResolvedColors} from '../../core/hooks';
import type {BreadcrumbWebProps} from './types';
export function Breadcrumb({
  items,
  label = '현재 경로',
  testID,
  style,
  className,
}: BreadcrumbWebProps) {
  const c = useResolvedColors();
  return (
    <nav
      aria-label={label}
      data-testid={testID}
      className={className}
      style={style}>
      <ol
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          listStyle: 'none',
          padding: 0,
          margin: 0,
          color: c.textSecondary,
        }}>
        {items.map((item, i) => (
          <li key={i} style={{display: 'flex', gap: 8}}>
            {i > 0 && <span aria-hidden="true">/</span>}
            {i === items.length - 1 ? (
              <span aria-current="page" style={{color: c.textPrimary}}>
                {item.label}
              </span>
            ) : item.href ? (
              <a
                href={item.href}
                onClick={item.onPress}
                style={{color: 'inherit'}}>
                {item.label}
              </a>
            ) : item.onPress ? (
              <button
                type="button"
                onClick={item.onPress}
                style={{
                  border: 0,
                  borderRadius: 999,
                  background: 'transparent',
                  color: 'inherit',
                }}>
                {item.label}
              </button>
            ) : (
              <span>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
