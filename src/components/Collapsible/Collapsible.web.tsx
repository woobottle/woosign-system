import {useResolvedColors} from '../../core/hooks';
import {useControllableState} from '../_shared/state';
import type {CollapsibleWebProps} from './types';
export function Collapsible({
  id,
  title,
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  disabled,
  testID,
  style,
  className,
}: CollapsibleWebProps) {
  const c = useResolvedColors();
  const [expanded, setExpanded] = useControllableState(
    open,
    defaultOpen,
    onOpenChange,
  );
  return (
    <div
      data-testid={testID}
      className={className}
      style={{color: c.textPrimary, ...style}}>
      <button
        type="button"
        id={`${id}-trigger`}
        aria-controls={`${id}-content`}
        aria-expanded={expanded}
        disabled={disabled}
        onClick={() => setExpanded(!expanded)}
        style={{
          borderRadius: 999,
          backgroundColor: c.section,
          color: c.textPrimary,
          border: 0,
          padding: '10px 16px',
        }}>
        {title} {expanded ? '−' : '+'}
      </button>
      <div
        id={`${id}-content`}
        aria-labelledby={`${id}-trigger`}
        hidden={!expanded}
        style={{padding: '12px 0'}}>
        {children}
      </div>
    </div>
  );
}
