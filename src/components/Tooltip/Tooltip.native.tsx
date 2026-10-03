import {Popover} from '../Popover/Popover.native';
import type {TooltipNativeProps} from './types';
export function Tooltip({
  trigger,
  content,
  disabled,
  testID,
  style,
}: TooltipNativeProps) {
  return (
    <Popover
      trigger={trigger}
      label="도움말"
      disabled={disabled}
      testID={testID}
      style={style}>
      {content}
    </Popover>
  );
}
