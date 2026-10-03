/** Compatibility adapter for Input(type='date'). */
import {Calendar as PublicCalendar} from '../Calendar/Calendar.web';
import type {CalendarWebProps} from '../Calendar/types';
export type CalendarProps = Omit<CalendarWebProps, 'onValueChange'> & {
  onChange?: (value: string) => void;
};
export function Calendar({onChange, ...props}: CalendarProps) {
  return <PublicCalendar {...props} onValueChange={onChange} />;
}
