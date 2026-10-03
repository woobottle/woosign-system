import {useResolvedColors} from '../../core/hooks';
import {useControllableState} from '../_shared/state';
import {pageItems} from './pages';
import type {PaginationWebProps} from './types';
export function Pagination({
  totalPages,
  page,
  defaultPage = 1,
  onPageChange,
  disabled,
  label = '페이지 이동',
  testID,
  style,
  className,
}: PaginationWebProps) {
  const c = useResolvedColors();
  const total = Number.isFinite(totalPages)
    ? Math.max(1, Math.floor(totalPages) || 1)
    : 1;
  const [raw, setPage] = useControllableState(page, defaultPage, onPageChange);
  const current = Math.max(
    1,
    Math.min(total, Number.isFinite(raw) ? Math.floor(raw) : 1),
  );
  const button = (
    n: number,
    text: string,
    blocked: boolean,
    selected = false,
  ) => (
    <button
      key={text}
      type="button"
      disabled={disabled || blocked}
      aria-label={text}
      aria-current={selected ? 'page' : undefined}
      onClick={() => setPage(n)}
      style={{
        borderRadius: 999,
        border: `1px solid ${c.borderDefault}`,
        padding: '8px 12px',
        backgroundColor: selected ? c.actionPrimary : c.card,
        color: selected ? c.primaryForeground : c.textPrimary,
      }}>
      {text}
    </button>
  );
  return (
    <nav
      aria-label={label}
      data-testid={testID}
      className={className}
      style={{display: 'flex', alignItems: 'center', gap: 8, ...style}}>
      {button(current - 1, '이전', current === 1)}
      {pageItems(current, total).map((n, i) =>
        n === 'gap' ? (
          <span key={`gap-${i}`} aria-hidden="true">
            …
          </span>
        ) : (
          button(n, `${n}`, false, n === current)
        ),
      )}
      {button(current + 1, '다음', current === total)}
    </nav>
  );
}
